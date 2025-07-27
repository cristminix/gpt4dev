<script lang="ts">
  import { writable } from "svelte/store"

  import ChatMessages from "./chat/ChatMessages.svelte"
  import ChatPrompt from "./chat/ChatPrompt.svelte"
  import TempChatMessages from "./chat/TempChatMessages.svelte"
  import { v1 } from "uuid"
  import jquery from "jquery"
  export let routeApp: any
  export let params: any
  export let queryString: any
  const tempConversation = writable<any>([])
  const isProcessing = writable(false)
  let conversation = writable<any>(null)
  const promptMessages = writable([])
  const model = writable("")
  const provider = writable("")
  const userPrompt = writable("")
  const messageId = writable("")
  const messageTasks = writable({})
  function getModelConfig() {
    return JSON.parse(localStorage.getItem("modelConfig") || "{}")
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
  export function createMessageId() {
    let random_bytes = (
      Math.floor(Math.random() * 1338377565) + 2956589730
    ).toString(2)
    let unix = Math.floor(Date.now() / 1000).toString(2)

    return BigInt(`0b${unix}${random_bytes}`).toString()
  }
  function onSubmitPrompt(content: string) {
    const previousMessages = $conversation.items
    const id = createMessageId()
    messageId.update(() => id)
    addMessageTask(id)
    let messages = [
      {
        role: "user",
        content,
      },
    ]
    if (params.id !== "new") {
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

  async function makeUpConversationTitle(lastMessage: string) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    tmpFullText = ""
    return new Promise(async (resolve, reject) => {
      const OPENAI_API_KEY = "your-openai-api-key" // Replace with your actual API key

      const response = await fetch("/api/backend-api/v2/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          action: "next",
          api_key: null,
          aspect_ratio: "16:9",
          conversation: null,
          model: $model, // or 'gpt-3.5-turbo'
          messages: [
            {
              role: "user",
              content:
                "Generate one title with a relevant emoji for this text: \n" +
                lastMessage +
                ",give one result only without quotes, make sure to include an emoji",
            },
          ],
          stream: true, // Enable streaming
          provider: $provider,
          id: createMessageId(),
          conversation_id: $conversation.id,
          download_media: true,
        }),
      })
      const reader = response.body.getReader()
      let line = ""
      let reasoningText = ""
      while (true) {
        let buffer = ""

        const { done, value } = await reader.read()
        // console.log("reading response", done, value)
        if (done) {
          resolve(tmpFullText)
          break
        }

        buffer += new TextDecoder().decode(value)
        let resp

        let previewText = ""
        for (const line of buffer.split("\n")) {
          if (!line) {
            continue
          }
          try {
            resp = JSON.parse(line)
          } catch (error) {
            console.error("Error parsing JSON:", error)
          }
          if (resp) {
            console.log(resp)

            switch (resp.type) {
              case "log":
                break
              case "provider":
                break
              case "content":
                tmpFullText += resp.content
                // resolve(tmpFullText)

                console.log(line)

                break
              case "finish":
                const reason = resp.finish.reason
                resolve(tmpFullText)

              case "parameters":
                break
              case "error":
                tmpFullText = resp.message
                resolve(tmpFullText)

                break
              case "preview":
                break
              case "conversation":
                try {
                  const { message_history } = resp.conversation[$provider]
                  const lastMessage =
                    message_history[message_history.length - 1]
                  tmpFullText = lastMessage.content
                  resolve(tmpFullText)
                } catch (error) {
                  console.error("Error accessing conversation data:", error)
                }

                break
              case "reasoning":
                break
            }
          } else {
            alert("no response")
          }
        }

        //   await new Promise((r) => setTimeout(r, 512))
      }
      // return fullText
      // reject("No response from API")
    })
  }
  function onProcessingDone(fullText: string, id: string) {
    const task = getMessageTask(id)
    if (task) {
      if (task.status === "onProcess") {
        setTimeout(async () => {
          tempConversation.update((o) => o.concat(fullText))
          const newConversation = $conversation
          let title = $userPrompt
          if ($userPrompt.length > 250) title = $userPrompt.slice(0, 250)
          if (params.id === "new") {
            if (!fullText.match(/error/gi)) {
              title = (await makeUpConversationTitle(fullText)) || ""
              if (title.length === 0) title = $userPrompt
              if (title.length > 250) title = title.slice(0, 250)
            } else {
              alert("Ada yang salah, silahkan coba lagi")
              isProcessing.update(() => false)
              return
            }
            // if ($userPrompt.length > 250)
            newConversation.title = title
            // else newConversation.title = $userPrompt
            newConversation.items = newConversation.items.slice(1)
          }
          newConversation.updated = Date.now()

          newConversation.items.push({
            role: "user",
            content: $userPrompt,
            id,
          })
          newConversation.items.push({
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
          conversation.update((o) => newConversation)
          console.log("saving to ls")
          localStorage.setItem(
            "conversation:" + $conversation.id,
            JSON.stringify(newConversation)
          )
          if (params.id === "new") {
            if (routeApp) {
              routeApp.navigate(`/chat/${$conversation.id}`)
            }
          }
          isProcessing.update(() => false)
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
  function loadChat(id: string) {
    conversation.update((o) => null)

    console.log("load chat", id)
    if (id == "new") {
      createNewChat()
    }
    if (localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        //@ts-ignore
        if (localStorage.key(i).startsWith("conversation:")) {
          //@ts-ignore

          const conversationSet = JSON.parse(
            localStorage.getItem(localStorage.key(i))
          )
          //@ts-ignore
          // console.log(conversationSet)
          if (conversationSet.id === id) {
            conversation.update(() => conversationSet)
            //@ts-ignore
            // console.log(conversationSet)
            break
          }
          // conversations.push(JSON.parse(conversation))
        }
      }
    }
    if ($conversation) {
      document.title = $conversation.title
      console.log($conversation)
    }
  }
  $: loadChat(params.id)
</script>

<div class="py-10 lg:py-14">
  <div
    class="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto text-center bg-neutral-800"
  >
    {#if $conversation}
      <h1 class="text-xl font-bold text-gray-400 sm:text-xl lg:text-3xl py-4">
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
  <ChatMessages conversation={$conversation} />
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
  <ChatPrompt {onSubmitPrompt} />
</div>
