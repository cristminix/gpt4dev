<script lang="ts">
  import { writable } from "svelte/store"

  import ChatMessages from "./chat/ChatMessages.svelte"
  import ChatPrompt from "./chat/ChatPrompt.svelte"
  import TempChatMessages from "./chat/TempChatMessages.svelte"
  import jquery from "jquery"
  import {
    addMessageTask as addMessageTaskExternal,
    updateMessageTask as updateMessageTaskExternal,
    getMessageTask as getMessageTaskExternal,
  } from "./chat/chat-page/fn/messageTasks"
  import { submitPrompt } from "./chat/chat-page/fn/submitPrompt"
  import { processDone } from "./chat/chat-page/fn/processDone"
  import { createNewChat as createNewChatExternal } from "./chat/chat-page/fn/createNewChat"
  import { loadChat as loadChatExternal } from "./chat/chat-page/fn/loadChat"
  import { deleteMessage as deleteMessageExternal } from "./chat/chat-page/fn/deleteMessage"

  import { getModelConfig } from "@/global/store/chat/getModelConfig"
  import ConversationWidget from "./chat/ConversationWidget.svelte"
  import { deleteChatMessage } from "@/global/store/conversation/deleteChatMessage"
  import type { RouteApp as RouteAppType } from "@/components/RouteApp.types"
  import type {
    ChatMessageInterface,
    ConversationInterface,
    MessageTask,
  } from "./chat/chat-page/types"
  import ChatMessagesWithGroup from "./chat/ChatMessagesWithGroup.svelte"
  import { getMessageGroups } from "@/global/store/conversation/getMessageGroups"
  import { deletChatMessageGroupMesage } from "@/global/store/conversation/deletChatMessageGroupMesage"
  import type { GroupedChatMessagesInterface } from "./types"
  import { createMessageId } from "./chat/chat-page/fn/createMessageId"
  import { v1 } from "uuid"
  import { createMessageGroup } from "@/global/store/conversation/createMessageGroup"
  import { createChatMessage } from "@/global/store/conversation/createChatMessage"
  import { updateChatMessage } from "@/global/store/conversation/updateChatMessage"
  export let routeApp: RouteAppType
  export let params: { id?: string } | null

  let modelImageGens = ["flux", "flux-dev", "sd-3.5-large"]
  const tempConversation = writable<any>([])
  const isProcessing = writable(false)
  const conversation = writable<ConversationInterface | null>(null)
  const chatMessages = writable<ChatMessageInterface[]>([])
  const regeneratePromptMessages = writable<ChatMessageInterface[]>([])
  const promptMessages = writable<ChatMessageInterface[]>([])
  const model = writable("")
  const provider = writable("")
  const userPrompt = writable("")
  const messageId = writable("")
  const lastMessageId = writable("")
  const messageGroupId = writable("")
  const messageGroupIds = writable<string[]>([])
  const isRegenerate = writable(false)
  const useLastMessageId = writable(false)
  const groupedChatMessages = writable<GroupedChatMessagesInterface>({})

  const messageTasks = writable<Record<string, MessageTask>>({})
  const chatConfig = writable({
    attachChatHistoryToUserPrompt: false,
  })
  function setChatConfig(config: any) {
    chatConfig.update((o: any) => ({ ...o, ...config }))
  }
  function addMessageTask(id: string) {
    addMessageTaskExternal(id, messageTasks, $messageTasks)
  }
  function updateMessageTask(id: string, status: boolean) {
    updateMessageTaskExternal(id, status, messageTasks, $messageTasks)
  }
  function getMessageTask(id: string) {
    return getMessageTaskExternal(id, $messageTasks)
  }

  function onSubmitPrompt(userMessageContent: string, systemMessage: string) {
    isRegenerate.update(() => false)
    submitPrompt(
      userMessageContent,
      systemMessage,
      chatMessages,
      messageTasks,
      messageId,
      userPrompt,
      model,
      provider,
      promptMessages,
      isProcessing,
      $chatConfig,
      params,
      addMessageTask,
      getModelConfig,
      $chatMessages,
      messageGroupId,
      $messageGroupId,
      useLastMessageId
    )
  }

  function shouldPerformTitleGeneration() {
    if (modelImageGens.includes($model)) {
      return false
    }
    return true
  }
  function onProcessingDone(
    fullText: string,
    id: string,
    isRegenerate: boolean
  ) {
    console.log({
      $messageGroupId,
      $messageGroupIds,
    })
    if (isRegenerate) {
      processDoneRegenerate(fullText, id)
    } else
      processDone(
        fullText,
        id,
        tempConversation,
        conversation,
        userPrompt,
        model,
        provider,
        chatMessages,
        isProcessing,
        messageTasks,
        params,
        routeApp,
        getMessageTask,
        updateMessageTask,
        shouldPerformTitleGeneration,
        $conversation,
        $userPrompt,
        $model,
        $provider,
        $chatMessages,
        $messageTasks,
        messageGroupId,
        $messageGroupId,
        isRegenerate,
        messageGroupIds,
        $messageGroupIds
      )
  }
  function createNewChat() {
    createNewChatExternal(conversation, chatMessages, jquery)
  }

  async function loadChat(id: string) {
    await loadChatExternal(id, conversation, chatMessages, createNewChat)

    // Handle document title update
    if ($conversation) {
      document.title = $conversation.title
      console.log($conversation)

      // load message groups
      const messageGroups = await getMessageGroups($conversation.id)
      console.log({ messageGroups })
      if (messageGroups.length > 0) {
        const messageGroupIdsSet = messageGroups.map((mg: any) => mg.id)
        messageGroupIds.update(() => messageGroupIdsSet)
        if (
          !messageGroupIdsSet.includes($messageGroupId) ||
          $messageGroupId.length == 0
        ) {
          messageGroupId.update(() => messageGroupIdsSet[0])
        }
      }
    }
  }
  async function onDeleteMessage(id: string, groupId: string) {
    deleteMessageExternal(
      id,
      chatMessages,
      $chatMessages,
      $conversation,

      groupId
    )
  }
  async function onRegenerateMessage(message: ChatMessageInterface) {
    console.log("regenerate message", { message })
    let messageToResend: ChatMessageInterface = message
    lastMessageId.update(() => messageToResend.id)
    // chek if provider and model are same
    const modelConfig = getModelConfig()

    let useSameProviderAndModel = false
    let dontCreateMessageGroup = false
    let dontAppendMessages = false
    const [lastModel, lastProvider] = message.username.split(":")
    if (
      modelConfig.model === lastModel &&
      modelConfig.provider === lastProvider
    ) {
      useSameProviderAndModel = true
      dontCreateMessageGroup = true
      dontAppendMessages = true
    }
    // console.log({ useSameProviderAndModel })
    // return
    // check if assistant message
    if (message.role != "user") {
      const [realMessage] = $chatMessages.filter(
        (msg) => msg.id === message.parentId
      )
      messageToResend = realMessage
    }
    if (messageToResend) {
      console.log({ messageToResend })
    }
    let previousMessage = []
    for (const msg of $chatMessages.filter((msg) => msg.role !== "system")) {
      previousMessage.push({ ...msg })
    }
    if ($messageGroupId.length > 0) {
      previousMessage = []
      for (const msg of $groupedChatMessages[$messageGroupId]) {
        previousMessage.push({ ...msg })
      }
    }

    // console.log({ previousMessage });

    // trim messages data
    const msgIndex = previousMessage.findIndex(
      (item) => item.id === messageToResend.id
    )
    if (msgIndex > -1) {
      //@ts-ignore
      const messagesInRange = []
      for (const msg of previousMessage.slice(0, msgIndex + 1)) {
        messagesInRange.push({ ...msg })
      }
      const systemMessage = jquery("#chatPrompt").val()
      let messagesToSendInConversation = []
      if (systemMessage.length > 0) {
        messagesToSendInConversation.push({
          role: "system",
          content: systemMessage,
          id: createMessageId(),
          username: "system",
        })
      }
      messagesToSendInConversation = [
        ...messagesToSendInConversation,
        ...messagesInRange,
      ]
      //@ts-ignore
      regeneratePromptMessages.update(() => messagesToSendInConversation)
      const newGroupId = v1()
      // test append message with new groupId
      const messagesToAppend = messagesInRange.map((msg) => {
        const newMsg = msg

        if (!useSameProviderAndModel) msg.groupId = newGroupId
        return newMsg
      })

      if (!useSameProviderAndModel) {
        // create new message group
        useLastMessageId.update(() => false)

        chatMessages.update((o) => {
          const messages = [...o, ...messagesToAppend]
          // console.log({ messages });
          return messages
        })
        messageGroupId.update(() => newGroupId)
        console.log({
          messagesInRange,
          //   messagesToSendInConversation,
          messagesToAppend,
          //   chatMessages: $chatMessages,
        })
      } else {
        useLastMessageId.update(() => true)
      }

      // console.log("onSubmitPrompt", userMessageContent, messages);
      // return
      // const id = createMessageId()
      // setTimeout(() => {
      messageTasks.update(() => ({}))
      messageId.update(() => messageToResend.id)
      addMessageTask(messageToResend.id)

      userPrompt.update(() => messageToResend.content)
      model.update(() => modelConfig.model)
      provider.update(() => modelConfig.provider)
      // @ts-ignore
      regeneratePromptMessages.update(() => messagesToAppend)
      console.log("submit prompt", messageToResend.content)
      console.log(modelConfig)
      isProcessing.update(() => false)
      isRegenerate.update(() => true)
      setTimeout(() => {
        isProcessing.update(() => true)
      }, 256)
      // }, 1000);
    }
  }
  async function processDoneRegenerate(fullText: string, id: string) {
    console.log("processDoneRegenerate", fullText, id)
    const task = getMessageTask(id)

    if (task && $conversation) {
      if (task.status === "onProcess") {
        setTimeout(async () => {
          if (fullText.length === 0) {
            isProcessing.update(() => false)
            updateMessageTask(id, true)
            alert("text is empty")
            return
          }
          if (!$useLastMessageId) {
            const messageGroup = await createMessageGroup(
              $messageGroupId,
              //@ts-ignore
              $conversation.id
            )
            console.log({ messageGroup })
          }
          const messages = $groupedChatMessages[$messageGroupId]
          const userMessage: ChatMessageInterface =
            messages[messages.length - 1]
          const assistantMessage: ChatMessageInterface = {
            role: "assistant",
            content: fullText,
            id: createMessageId(),
            parentId: id,
            groupId: $messageGroupId,
            username: `${$model}:${$provider}`,
          }
          let chatMessagesData = [...$chatMessages] as any[]
          if (!$useLastMessageId) {
            for (const nMsg of messages) {
              const uMsg = await createChatMessage(nMsg, $conversation.id)
              console.log({ uMsg })
            }
          }
          if (!$useLastMessageId) {
            const aMsg = await createChatMessage(
              assistantMessage,
              $conversation.id
            )
            console.log({ aMsg })
            chatMessagesData.push(assistantMessage)
          } else {
            assistantMessage.id = $lastMessageId
            const aMsg = await updateChatMessage(
              assistantMessage,
              $conversation.id
            )

            const filtered = chatMessagesData.filter(
              (msg) => msg.id === aMsg.id
            )
            if (filtered.length > 0) {
              filtered[0] = aMsg
            }
          }
          chatMessages.update(() => chatMessagesData)
          isProcessing.update(() => false)
        }, 512)

        updateMessageTask(id, true)
      } else {
        console.log("Message already saved", getMessageTask(id), $messageTasks)
      }
    } else {
      console.log(`No message task correspond to ${id}`)
    }
    // isRegenerate.update(() => false);
  }
  function onChangeMessageGroupId(groupId: string) {
    messageGroupId.update(() => groupId)
  }
  $: if (params?.id) loadChat(params.id)
</script>

<div class="py-10 lg:py-14">
  <ConversationWidget conversation={$conversation} {routeApp} />
  {#if $messageGroupIds.length > 0}
    <ChatMessagesWithGroup
      {groupedChatMessages}
      conversation={$conversation}
      chatMessages={$chatMessages}
      messageGroupIds={$messageGroupIds}
      messageGroupId={$messageGroupId}
      onChangeGroupId={onChangeMessageGroupId}
      {onDeleteMessage}
      {onRegenerateMessage}
    />
  {:else}
    <ChatMessages
      conversation={$conversation}
      chatMessages={$chatMessages}
      {onDeleteMessage}
    />
  {/if}
  {#if $isProcessing}
    <TempChatMessages
      {onProcessingDone}
      messages={$promptMessages}
      model={$model}
      provider={$provider}
      conversation_id={$conversation ? $conversation.id : ""}
      messageId={$messageId}
      regenerateMessages={$regeneratePromptMessages}
      isRegenerate={$isRegenerate}
    />
  {/if}
  <ChatPrompt {onSubmitPrompt} {setChatConfig} />
</div>
