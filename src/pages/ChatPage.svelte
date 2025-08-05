<script lang="ts">
  import { writable } from "svelte/store"

  const Toastify = window.Toastify

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
  import ConversationWidget from "./chat/ConversationWidget.svelte"
  import { deleteChatMessage } from "@/global/store/conversation/deleteChatMessage"
  import type { RouteApp as RouteAppType } from "@/components/RouteApp.types"
  import type {
    ChatMessageInterface,
    ConversationInterface,
  } from "./chat/chat-page/types"
  export let routeApp: RouteAppType
  export let params: { id?: string } | null

  let modelImageGens = ["flux", "flux-dev", "sd-3.5-large"]
  const tempConversation = writable<any>([])
  const isProcessing = writable(false)
  const conversation = writable<ConversationInterface | null>(null)
  const chatMessages = writable<ChatMessageInterface[]>([])
  const promptMessages = writable<ChatMessageInterface[]>([])
  const model = writable("")
  const provider = writable("")
  const userPrompt = writable("")
  const messageId = writable("")
  interface MessageTask {
    status: string | boolean
  }

  const messageTasks = writable<Record<string, MessageTask>>({})
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
      const newData: Record<string, MessageTask> = {
        ...$messageTasks,
      }
      newData[id] = { status }
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
        id: createMessageId(),
        username: "user",
      },
    ]
    let previousMessages = []
    let isNewConversation = params?.id === "new"
    if (!isNewConversation) {
      previousMessages = $chatMessages

      messages = [
        ...previousMessages.map((message) => ({
          role: message.role,
          content: message.content,
          id: message.id as string,
          username: message.username,
        })),
        {
          role: "user",
          content,
          id: createMessageId() as string,
          username: "user",
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
            id: createMessageId(),
            username: "user",
          },
        ]
      }
    }
    console.log("onSubmitPrompt", content, messages)
    userPrompt.update(() => content)
    const modelConfig = getModelConfig()
    model.update(() => modelConfig.model)
    provider.update(() => modelConfig.provider)
    promptMessages.update(() => messages)
    console.log("submit prompt", content)
    console.log(modelConfig)
    isProcessing.update(() => false)
    setTimeout(() => {
      isProcessing.update(() => true)
    }, 256)
  }
  let tmpFullText = ""

  function shouldPerformTitleGeneration() {
    if (modelImageGens.includes($model)) {
      return false
    }
    return true
  }
  function onProcessingDone(fullText: string, id: string | number) {
    const taskId = typeof id === "number" ? id.toString() : id
    const task = getMessageTask(taskId)
    if (task) {
      if (task.status === "onProcess") {
        setTimeout(async () => {
          tempConversation.update((o) => o.concat(fullText))
          const newConversation = { ...$conversation }
          let title = $userPrompt
          if ($userPrompt.length > 250) title = $userPrompt.slice(0, 250)
          let chatMessagesData = [...$chatMessages] as any[]

          if (params?.id === "new") {
            if (shouldPerformTitleGeneration()) {
              const newTitle =
                (await makeUpConversationTitle(
                  fullText,
                  $model,
                  $provider,
                  $conversation
                )) || ""
              title = newTitle as string
              title = stripMarkdown(title)
              title = cleanQuotes(title)
              if (title.length === 0) title = $userPrompt
              if (title.length > 250) title = title.slice(0, 250)
            }
            newConversation.title = title
            chatMessagesData = chatMessagesData.slice(1)
          }
          chatMessagesData.push({
            role: "user",
            content: $userPrompt,
            username: "bob",
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

          console.log("saving to storage")
          if (params?.id === "new") {
            const [c, m] = await createConversation(
              newConversation as ConversationInterface,
              chatMessagesData
            )
            if (routeApp) {
              routeApp.navigate(`/chat/${newConversation.id}`)
            }
          } else {
            const [c, m] = await updateConversation(
              newConversation as ConversationInterface,
              chatMessagesData
            )
            chatMessages.update(() => m as ChatMessageInterface[])
            console.log({ m })
          }
          isProcessing.update(() => false)
        }, 512)
        updateMessageTask(taskId, true)
      } else {
        console.log(
          "Message already saved",
          getMessageTask(taskId),
          $messageTasks
        )
      }
    } else {
      console.log(`No message task correspond to ${taskId}`)
    }
  }
  function createNewChat() {
    const newConversation = {
      id: v1(),

      title: "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      system: "",
    }
    setTimeout(() => {
      jquery("#userInput").focus()
    }, 1000)
    conversation.update((o) => newConversation)
    chatMessages.update((o) => [
      {
        role: "assistant",
        content: "Ada yang bisa saya bantu ?",
        id: createMessageId(),
        username: "assistant",
      },
    ])
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
  function onDeleteMessage(id: string | number) {
    if (confirm("Item ini akan dihapus, yakin?")) {
      const indexToDelete = $chatMessages.findIndex((item) => item.id === id)
      if (indexToDelete > -1) {
        $chatMessages.splice(indexToDelete, 1)
      }
      chatMessages.update((o) => $chatMessages)
      if ($conversation) {
        // Convert id to number for API call if it's a string
        const numericId = typeof id === "string" ? parseInt(id) : id
        if (!isNaN(numericId)) {
          deleteChatMessage($conversation.id, numericId)
        }
      }
      console.log($chatMessages)
    }
  }
  function tostifyCustomClose(el: HTMLElement) {
    const parent = el.closest(".toastify")
    if (parent) {
      const close = parent.querySelector(".toast-close")
      if (close && "click" in close) {
        ;(close as HTMLElement).click()
      }
    }
  }

  onMount(() => {
    const callToast = document.querySelector("#hs-new-toast")
  })

  let currentTime = new Date().toLocaleTimeString()

  $: if (params?.id) loadChat(params.id)
</script>

<div class="py-10 lg:py-14">
  <ConversationWidget conversation={$conversation} {routeApp} />
  <ChatMessages
    conversation={$conversation}
    chatMessages={$chatMessages}
    {onDeleteMessage}
  />
  {#if $isProcessing}
    <TempChatMessages
      {onProcessingDone}
      messages={$promptMessages}
      model={$model}
      provider={$provider}
      conversation_id={$conversation ? $conversation.id : ""}
      messageId={$messageId}
    />
  {/if}
  <ChatPrompt {onSubmitPrompt} {setChatConfig} />
</div>
