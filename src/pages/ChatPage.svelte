<script lang="ts">
  import { writable, type Writable } from "svelte/store"

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
  import { onRegenerateMessage as onRegenerateMessageExternal } from "./chat/chat-page/fn/regenerateMessage"
  import { processDoneRegenerate as processDoneRegenerateExternal } from "./chat/chat-page/fn/processDoneRegenerate"

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
  import Toasts from "@/components/Toasts.svelte"
  import { onMount, tick } from "svelte"
  import UserMessage from "./chat/UserMessage.svelte"
  export let routeApp: RouteAppType
  export let params: { id?: string } | null
  export let toasts: Toasts
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
  const showChatMessagesPager = writable(false)
  const messageTasks = writable<Record<string, MessageTask>>({})
  const chatConfig = writable({
    attachChatHistoryToUserPrompt: false,
  })
  let chatMessageWithGroupRef: ChatMessagesWithGroup | null = null
  let tempChatMessagesRef: TempChatMessages
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
    return false
    if (modelImageGens.includes($model) || $provider.match(/-Live$/)) {
      return false
    }
    return true
  }
  function onProcessingDone(
    fullText: string,
    id: string,
    isRegenerate: boolean,
    hasError: boolean,
    errorMessage: string
  ) {
    console.log({
      $messageGroupId,
      $messageGroupIds,
    })
    if (isRegenerate) {
      processDoneRegenerate(fullText, id, hasError, errorMessage)
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
        $messageGroupIds,
        toasts,
        hasError,
        errorMessage
      )
  }
  function createNewChat() {
    createNewChatExternal(conversation, chatMessages, jquery)
  }

  async function loadChat(id: string) {
    await loadChatExternal(id, conversation, chatMessages, createNewChat)
    messageGroupIds.update(() => [])
    // Handle document title update
    if ($conversation) {
      document.title = $conversation.title
      console.log($conversation)
      await updateMessageGroupMessages()

      // load message groups
      // await updateMessageGroupMessages()
      // toasts.doToast("success", "Loaded")
    }
  }
  async function updateMessageGroupMessages() {
    console.log("iam called")
    if ($conversation) {
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
    onRegenerateMessageExternal(
      message,
      lastMessageId,
      chatMessages,
      $chatMessages,
      messageGroupId,
      $messageGroupId,
      groupedChatMessages,
      $groupedChatMessages,
      regeneratePromptMessages,
      messageTasks,
      $messageTasks,
      messageId,
      userPrompt,
      model,
      provider,
      isProcessing,
      isRegenerate,
      useLastMessageId,
      $useLastMessageId,
      addMessageTask
    )
  }
  async function processDoneRegenerate(
    fullText: string,
    id: string,
    hasError: boolean,
    errorMessage: string
  ) {
    processDoneRegenerateExternal(
      fullText,
      id,
      getMessageTask,
      $conversation,
      useLastMessageId,
      $useLastMessageId,
      messageGroupId,
      $messageGroupId,
      groupedChatMessages,
      $groupedChatMessages,
      model,
      $model,
      provider,
      $provider,
      lastMessageId,
      $lastMessageId,
      chatMessages,
      $chatMessages,
      isProcessing,
      updateMessageGroupMessages,
      updateMessageTask,
      $messageTasks,
      toasts,
      $userPrompt,
      hasError,
      errorMessage,
      reloadChat
    )
  }
  function onChangeMessageGroupId(groupId: string) {
    messageGroupId.update(() => groupId)
  }
  function toggleChatMessagePager() {
    const showOrHide = !$showChatMessagesPager
    // console.log({ showOrHide })
    showChatMessagesPager.update(() => showOrHide)
  }
  function stopGeneration() {
    if (tempChatMessagesRef) {
      tempChatMessagesRef.abortCompletion()
    }
  }
  onMount(() => {
    // chatMessages.subscribe((newChatMessages) => {})
  })
  let tempMode = 0
  let assistantMessagePtr: ChatMessageInterface | null = null
  const tempChatMessageCls = writable("")
  const MIRROR_TMP_CHAT = import.meta.env.VITE_MIRROR_TMP_CHAT === "true"
  const updateTimeouts = new Map<string, number>()
  let newChat = 0
  async function onChatBuffer(data: any) {
    if (params.id === "new" && newChat === 0) {
      newChat = 1000
    }
    if (params.id && params.id !== "new") {
      newChat = 1002
    }
    if (!MIRROR_TMP_CHAT) return
    if (!tempChatMessagesRef) return
    const { text, t, complete, params: dataParams, messageId, messages } = data
    // console.log({ text, t, complete, dataParams, messageId, messages })
    if (newChat === 1000) {
      const groupId = v1()
      const newMessages = messages.map((m: ChatMessageInterface) => {
        m.groupId = groupId
        return m
      })
      const [userMessage] = newMessages.filter(
        (m: ChatMessageInterface) => m.role === "user"
      )
      assistantMessagePtr = {
        role: "assistant",
        username: `${$model}:${$provider}`,
        content: "",
        id: messageId, // Membuat ID unik untuk pesan
        parentId: userMessage?.id || "", // Menggunakan ID pesan pengguna sebagai parentId
        groupId, // Menggunakan groupId saat ini
      }
      chatMessages.update(() => [userMessage, assistantMessagePtr])
      messageGroupIds.update(() => [groupId])
      await tick()
      messageGroupId.update(() => groupId)
      // initMessageGroupMessages(groupId)
      // console.log({ currentMessage, groupId })
      // initMessageGroupMessages()
      newChat = 1001
      return
    }
    // console.log({ newChat })
    if (newChat > 1000) {
      console.log({
        newChat,
        messageGroupId: $messageGroupId,
        groupedChatMessages: $groupedChatMessages,
        messageGroupIds: $messageGroupIds,
      })
      if (!Array.isArray($groupedChatMessages[$messageGroupId])) {
        const grpCm = { [$messageGroupId]: [] }

        groupedChatMessages.update(() => grpCm)
        // await tick()
        console.log("Here")
        await tick()

        return
      }
      if (tempMode === 0) {
        console.log("INITIAL")
        // INITIAL
        // append user message
        const userMessage = tempChatMessagesRef.getUserMessage()
        if (userMessage) {
          userMessage.groupId = $messageGroupId
          if (!assistantMessagePtr) {
            assistantMessagePtr = {
              role: "assistant",
              username: `${$model}:${$provider}`,
              content: "",
              id: messageId, // Membuat ID unik untuk pesan
              parentId: userMessage?.id || "", // Menggunakan ID pesan pengguna sebagai parentId
              groupId: $messageGroupId, // Menggunakan groupId saat ini
            }
            let updatedChatMessages = [
              ...$chatMessages,
              userMessage,
              assistantMessagePtr,
            ]
            // updateChatMessage.push()
            chatMessages.update(() => updatedChatMessages)
          }
        }
        let updatedGroupedChatMessages = { ...$groupedChatMessages }
        if (userMessage) {
          updatedGroupedChatMessages[$messageGroupId] = [
            ...(updatedGroupedChatMessages[$messageGroupId] || []),
            userMessage,
          ]
          // chatMessages.update((o) => [...o, userMessage])
        }
        console.log({ userMessage })

        // append assistant message
        if (assistantMessagePtr) {
          updatedGroupedChatMessages[$messageGroupId] = [
            ...(updatedGroupedChatMessages[$messageGroupId] || []),
            assistantMessagePtr,
          ]
        }

        // update groupedChatMessages
        groupedChatMessages.update(() => updatedGroupedChatMessages)

        tempChatMessageCls.update(() => "hidden")
        tempMode = 1
        console.log({ updatedGroupedChatMessages })
      } else if (tempMode === 1) {
        // UPDATE

        if (assistantMessagePtr) {
          console.log("UPDATE")

          assistantMessagePtr.content = text

          // Debounce the update to prevent too frequent updates (512ms)
          if (assistantMessagePtr.id) {
            const existingTimeout = updateTimeouts.get(assistantMessagePtr.id)
            if (existingTimeout) {
              clearTimeout(existingTimeout)
            }

            const newTimeout = window.setTimeout(() => {
              // Create new object reference to trigger reactivity
              const updatedGrouped = { ...$groupedChatMessages }
              const groupMessages = [...(updatedGrouped[$messageGroupId] || [])]
              // Find and update the assistant message
              const messageIndex = groupMessages.findIndex(
                (msg: any) => msg.id === assistantMessagePtr!.id
              )
              if (messageIndex !== -1) {
                groupMessages[messageIndex] = {
                  ...groupMessages[messageIndex],
                  content: text,
                }
                updatedGrouped[$messageGroupId] = groupMessages
              }
              console.log({ updatedGrouped })
              groupedChatMessages.update(() => updatedGrouped)

              // Clean up the timeout reference
              updateTimeouts.delete(assistantMessagePtr!.id)
            }, 15)

            updateTimeouts.set(assistantMessagePtr!.id, newTimeout)
          }

          // await tick()
        }
        // await tick()
      }
    }
    if (complete) {
      tempMode = 0
      newChat = 0
      setTimeout(() => {
        tempChatMessageCls.update(() => "")
      }, 3000)
    }
  }
  function reloadChat() {
    if (params?.id) loadChat(params.id)
    setTimeout(() => {
      if ($messageGroupId.length > 0 && chatMessageWithGroupRef) {
        chatMessageWithGroupRef.onClickChangeGroupId($messageGroupId)
      }
    }, 1000)
  }
  $: if (params?.id) loadChat(params.id)
</script>

<div class="py-8 lg:py-14">
  <ConversationWidget
    {reloadChat}
    conversation={$conversation}
    {routeApp}
    {toggleChatMessagePager}
    showChatMessagesPager={$showChatMessagesPager}
  />
  {#if $messageGroupIds.length > 0}
    <ChatMessagesWithGroup
      bind:this={chatMessageWithGroupRef}
      showChatMessagesPager={$showChatMessagesPager}
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
      {onRegenerateMessage}
    />
  {/if}
  {#if $isProcessing && $conversation}
    <TempChatMessages
      className={$tempChatMessageCls}
      bind:this={tempChatMessagesRef}
      {onChatBuffer}
      {onProcessingDone}
      messages={$promptMessages}
      model={$model}
      provider={$provider}
      conversation={$conversation}
      messageId={$messageId}
      regenerateMessages={$regeneratePromptMessages}
      isRegenerate={$isRegenerate}
    />
  {/if}
  <ChatPrompt
    isProcessing={$isProcessing}
    {onSubmitPrompt}
    {setChatConfig}
    onStopGeneration={stopGeneration}
  />
</div>
