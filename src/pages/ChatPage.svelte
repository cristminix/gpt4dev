<script lang="ts">
  import { writable } from "svelte/store"

  import ChatMessages from "./chat/ChatMessages.svelte"
  import ChatPrompt from "./chat/ChatPrompt.svelte"
  import TempChatMessages from "./chat/TempChatMessages.svelte"
  import { v1 } from "uuid"
  import jquery from "jquery"
  import { createMessageId } from "./chat/chat-page/fn/createMessageId"
  import { makeUpConversationTitle } from "./chat/chat-page/fn/makeUpConversationTitle"

  import { onMount } from "svelte"
  import { getConversation } from "@/global/store/conversation/getConversation"
  import { getModelConfig } from "@/global/store/chat/getModelConfig"
  import { stripMarkdown } from "./chat/chat-page/fn/stripMarkdown"
  import { createConversation } from "@/global/store/conversation/createConversation"
  import { updateConversation } from "@/global/store/conversation/updateConversation"
  import { cleanQuotes } from "./chat/chat-page/fn/cleanQuotes"
  import { getChatMessages } from "@/global/store/conversation/getChatMessages"
  export let routeApp: any
  export let params: any
  export let queryString: any

  let modelImageGens = ["flux", "flux-dev", "sd-3.5-large"]
  const tempConversation = writable<any>([])
  const isProcessing = writable(false)
  const conversation = writable<any>(null)
  const chatMessages = writable([])
  const promptMessages = writable([])
  const model = writable("")
  const provider = writable("")
  const userPrompt = writable("")
  const messageId = writable("")
  const messageTasks = writable({})
  const chatConfig = writable({
    attachChatHistoryToUserPrompt: false,
  })
  function setChatConfig(config: any) {
    chatConfig.update((o: any) => ({ ...o, ...config }))
  }
  function addMessageTask(id: string) {
    const exists = Object.keys($messageTasks).includes(id)
    if (!exists) {
      messageTasks.update((o) => ({ ...o, [id]: { status: "onProcess" } }))
    }
    console.log({ $messageTasks })
  }
  function updateMessageTask(id: string, status: boolean) {
    const exists = Object.keys($messageTasks).includes(id)
    if (exists) {
      const newData = { ...$messageTasks }
      newData[id] = status
      messageTasks.update(() => newData)
    }
    console.log({ exists, $messageTasks })
  }
  function getMessageTask(id: string) {
    const exists = Object.keys($messageTasks).includes(id)
    console.log({ $messageTasks })
    if (exists) {
      return $messageTasks[id]
    }
    return null
  }

  function onSubmitPrompt(content: string) {
    const { attachChatHistoryToUserPrompt } = $chatConfig

    const id = createMessageId()
    messageId.update(() => id)
    addMessageTask(id)
    let messages = [
      {
        role: "user",
        content,
      },
    ]
    let previousMessages = []
    let isNewConversation = params.id === "new"
    if (!isNewConversation) {
      previousMessages = $chatMessages

      messages = [
        ...previousMessages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        {
          role: "user",
          content,
        },
      ]
    }
    if (attachChatHistoryToUserPrompt) {
      console.log("attachChatHistoryToUserPrompt is enabled")
      let messageHistory = ""
      if (!isNewConversation) {
        previousMessages = $chatMessages

        messageHistory = `[Chat History]`
        previousMessages.forEach((message) => {
          messageHistory += `\n${message.role}: ${message.content}`
        })

        messages = [
          {
            role: "user",
            content: `${messageHistory}\n\n${content}`,
          },
        ]
      }
    }
    console.log("onSubmitPrompt", content, messages)
    // return
    userPrompt.update(() => content)
    // construct messages
    // console.log(messages)
    // return
    const modelConfig = getModelConfig()
    model.update(() => modelConfig.model)
    provider.update(() => modelConfig.provider)
    promptMessages.update(() => messages)
    console.log("submit prompt", content)
    console.log(modelConfig)
    // return
    isProcessing.update(() => false)
    setTimeout(() => {
      isProcessing.update(() => true)
    }, 256)
  }
  let tmpFullText = ""

  function shouldPerformTitleGeneration() {
    // Check if the user prompt is empty or too short
    if (modelImageGens.includes($model)) {
      return false
    }
    return true
  }
  function onProcessingDone(fullText: string, id: string) {
    const task = getMessageTask(id)
    if (task) {
      if (task.status === "onProcess") {
        setTimeout(async () => {
          tempConversation.update((o) => o.concat(fullText))
          const newConversation = { ...$conversation }
          let title = $userPrompt
          if ($userPrompt.length > 250) title = $userPrompt.slice(0, 250)
          if (params.id === "new") {
            //!fullText.match(/error/gi)p
            if (shouldPerformTitleGeneration()) {
              title =
                (await makeUpConversationTitle(
                  fullText,
                  $model,
                  $provider,
                  $conversation
                )) || ""
              title = stripMarkdown(title)
              title = cleanQuotes(title)
              if (title.length === 0) title = $userPrompt
              if (title.length > 250) title = title.slice(0, 250)
            } else {
              // alert("Terjadi kesalahan")
              // isProcessing.update(() => false)
              // return
            }
            // if ($userPrompt.length > 250)
            newConversation.title = title
            // else newConversation.title = $userPrompt
            newConversation.items = newConversation.items.slice(1)
          }
          newConversation.updated = Date.now()
          const chatMessagesData = [...$chatMessages] as any[]
          chatMessagesData.push({
            role: "user",
            content: $userPrompt,
            id,
          })
          chatMessagesData.push({
            role: "assistant",
            content: fullText,
            id: createMessageId(),
            parentId: id,
            provider: {
              model: $model,
              label: $provider,
              finish: { reason: "stop" },
            },
          })
          // conversation.update((o) => newConversation)

          console.log("saving to storage")
          if (params.id === "new") {
            const [c, m] = await createConversation(
              newConversation,
              chatMessagesData
            )
            conversation.update(() => c)
            chatMessages.update(() => m)
            if (routeApp) {
              routeApp.navigate(`/chat/${$conversation.id}`)
            }
          } else {
            const [c, m] = await updateConversation(
              newConversation,
              chatMessagesData
            )
            conversation.update(() => c)
            chatMessages.update(() => m)
            console.log({ m })
          }
          isProcessing.update(() => false)
          // loadChat($conversation.id)
        }, 512)
        updateMessageTask(id, true)
      } else {
        console.log("Message already saved", getMessageTask(id), $messageTasks)
      }
    } else {
      console.log(`No message task correspond to ${id}`)
    }
  }
  function createNewChat() {
    const newConversation = {
      id: v1(),
      items: [
        {
          role: "assistant",
          content: "Ada yang bisa saya bantu ?",
        },
      ],
      title: "New Conversation",
      added: Date.now(),
      updated: Date.now(),
      system: "",
    }
    setTimeout(() => {
      jquery("#userInput").focus()
    }, 1000)
    conversation.update((o) => newConversation)
  }
  async function loadChat(id: string) {
    conversation.update((o) => null)

    console.log("load chat", id)
    if (id == "new") {
      createNewChat()
    } else {
      const conversationData = await getConversation(id)
      const chatMessagesData = await getChatMessages(id)
      conversation.update(() => conversationData)
      chatMessages.update(() => chatMessagesData)
    }

    if ($conversation) {
      document.title = $conversation.title
      console.log($conversation)
    }
  }
  function tostifyCustomClose(el) {
    const parent = el.closest(".toastify")
    const close = parent.querySelector(".toast-close")

    close.click()
  }
  let i = 0
  const toastMarkup1 = `
        <div class="max-w-xs relative bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700" role="alert" tabindex="-1" aria-labelledby="hs-toast-avatar-label">
          <div class="flex p-4">
            <div class="shrink-0">
              <img class="inline-block size-8 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Avatar">
              <button onclick="tostifyCustomClose(this)" type="button" class="absolute top-3 end-3 inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-hidden focus:opacity-100 dark:text-white" aria-label="Close">
                <span class="sr-only">Close</span>
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
              </button>
            </div>
            <div class="ms-4 me-5">
              <h3 id="hs-toast-avatar-label" class="text-gray-800 font-medium text-sm dark:text-white">
                <span class="font-semibold">James</span> mentioned you in a comment
              </h3>
              <div class="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                Nice work! Keep it up!
              </div>
              <div class="mt-3">
                <button type="button" class="text-blue-600 decoration-2 hover:underline font-medium text-sm focus:outline-hidden focus:underline dark:text-blue-500">
                  Mark as read
                </button>
              </div>
            </div>
          </div>
        </div>
      `
  const toastMarkup2 = `
        <div class="flex p-4">
          <p class="text-sm text-gray-700 dark:text-neutral-400">Your email has been sent</p>
          <div class="ms-auto">
            <button onclick="tostifyCustomClose(this)" type="button" class="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-hidden focus:opacity-100 dark:text-white" aria-label="Close">
              <span class="sr-only">Close</span>
              <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
        </div>
      `
  onMount(() => {
    const callToast = document.querySelector("#hs-new-toast")
  })
  let toastClosed = false
  function displayToast() {
    toastClosed = false
    Toastify({
      node: document.querySelector(".clock"),
      className:
        "hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 bg-white text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg [&>.toast-close]:hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400",
      duration: 86400,
      close: true,
      escapeMarkup: false,
      callback() {
        console.log("Toast closed")
        toastClosed = false
      },
    }).showToast()

    i++
  }
  let currentTime = new Date().toLocaleTimeString()

  // Update the time every second
  // setInterval(() => {
  //   currentTime = new Date().toLocaleTimeString()
  // }, 1000)
  $: loadChat(params.id)
</script>

{#if !toastClosed}
  <!-- <div class="clock">
    {currentTime}
  </div> -->
{/if}
<!-- <button
  id="hs-new-toast"
  type="button"
  on:click={displayToast}
  class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
>
  Call toast
</button> -->
<div class="py-10 lg:py-14">
  <div
    class="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto text-center bg-neutral-800"
  >
    {#if $conversation}
      <h1
        class="text-xl font-bold text-gray-400 sm:text-xl lg:text-3xl py-4 text-left"
      >
        {$conversation.title}
      </h1>
    {/if}
    <!-- Button Group -->
    <div>
      <div class="sm:flex sm:justify-between">
        <div>
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
            </svg>
            Share
          </button>
        </div>

        <div class="mt-1 sm:mt-0">
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          >
            <i class="fa fa-edit"></i>
            Edit
          </button>
          <button
            type="button"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm rounded-full border border-transparent text-gray-500 hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          >
            <i class="fa fa-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
    <!-- End Button Group -->
  </div>
  <ChatMessages chatMessages={$chatMessages} />
  {#if $isProcessing}
    <TempChatMessages
      conversation={$tempConversation}
      {onProcessingDone}
      messages={$promptMessages}
      model={$model}
      provider={$provider}
      conversation_id={$conversation.id}
      messageId={$messageId}
    />
  {/if}
  <ChatPrompt {onSubmitPrompt} {setChatConfig} />
</div>
