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
  import { onRegenerateMessage as onRegenerateMessageExternal } from "./chat/chat-page/fn/regenerateMessage"
  import { processDoneRegenerate as processDoneRegenerateExternal } from "./chat/chat-page/fn/processDoneRegenerate"
  import { onChatBuffer as onChatBufferExternal } from "./chat/chat-page/fn/onChatBuffer"

  import { getModelConfig } from "@/global/store/chat/getModelConfig"
  import ConversationWidget from "./chat/ConversationWidget.svelte"
  import type { RouteApp as RouteAppType } from "@/components/RouteApp.types"
  import type {
    ChatMessageInterface,
    ConversationInterface,
    MessageTask,
  } from "./chat/chat-page/types"
  import ChatMessagesWithGroup from "./chat/ChatMessagesWithGroup.svelte"
  import { getMessageGroups } from "@/global/store/conversation/getMessageGroups"
  import type { GroupedChatMessagesInterface } from "./types"
  import Toasts from "@/components/Toasts.svelte"
  import { onMount, tick } from "svelte"
  import * as idb from "idb-keyval"
  import { v1 } from "uuid"
  export let routeApp: RouteAppType
  export let params: { id?: string } | null
  export let toasts: Toasts
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
  const lastGeneratedAssistantMessageId = writable("")
  const messageGroupId = writable("")
  const messageGroupIds = writable<string[]>([])
  const isRegenerate = writable(false)
  const regenerateUsingSameModelProvider = writable(false)
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
      regenerateUsingSameModelProvider
    )
  }

  function shouldPerformTitleGeneration() {
    // return false
    // if (modelImageGens.includes($model) || $provider.match(/-Live$/)) {
    //   return false
    // }
    return true
  }
  function onProcessingDone(
    fullText: string,
    id: string,
    isRegenerate: boolean,
    hasError: boolean,
    errorMessage: string
  ) {
    // console.log({
    //   $messageGroupId,
    //   $messageGroupIds,
    // })
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
        errorMessage,
        $useChatBuffer,
        $chatBufferGroupId
      )
  }
  function createNewChat() {
    createNewChatExternal(conversation, chatMessages, jquery)
  }
  let lastChatId = ""
  async function loadChat(id: string, reload = false) {
    console.log("loadChat,reload", reload)
    if (lastChatId === id && !reload && id !== "new") return
    await loadChatExternal(
      id,
      conversation,
      chatMessages,
      createNewChat,
      routeApp
    )
    messageGroupIds.update(() => [])
    // Handle document title update
    if ($conversation) {
      document.title = $conversation.title
      // console.log($conversation)
      await updateMessageGroupMessages()

      // load message groups
      // await updateMessageGroupMessages()
      // toasts.doToast("success", "Loaded")
      lastChatId = id
    }
  }
  async function updateMessageGroupMessages() {
    if ($conversation) {
      const messageGroups = await getMessageGroups($conversation.id)
      // console.log({ messageGroups })
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
      lastGeneratedAssistantMessageId,
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
      regenerateUsingSameModelProvider,
      $regenerateUsingSameModelProvider,
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
      regenerateUsingSameModelProvider,
      $regenerateUsingSameModelProvider,
      messageGroupId,
      $messageGroupId,
      groupedChatMessages,
      $groupedChatMessages,
      model,
      $model,
      provider,
      $provider,
      lastGeneratedAssistantMessageId,
      $lastGeneratedAssistantMessageId,
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
      reloadChat,
      $useChatBuffer,
      $chatBufferGroupId,
      $regeneratePromptMessages
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
  const useChatBuffer = writable(true)
  const chatBufferGroupId = writable("")
  const chatBufferMode = writable("default") // default,regenerate
  let tempMode = 0
  let assistantMessagePtr: ChatMessageInterface
  const tempChatMessageCls = writable("")
  const MIRROR_TMP_CHAT = import.meta.env.VITE_MIRROR_TMP_CHAT === "true"
  const updateTimeouts = new Map<string, number>()
  let newChat = 0
  let chatIsNew = false
  async function onChatBuffer(data: any) {
    if (!params) return
    if (params.id === "new" && newChat === 0) {
      newChat = 1000
    } else if (params.id && params.id !== "new" && newChat === 0) {
      newChat = 1002
    }
    // console.log({ newChat, isRegenerate: $isRegenerate })
    if (!MIRROR_TMP_CHAT) return
    if (!tempChatMessagesRef) return
    const { text, t, complete, params: dataParams, messageId, messages } = data
    // console.log({ text, t, complete, dataParams, messageId, messages })
    if (newChat === 1000) {
      const groupId = v1()
      chatBufferGroupId.update(() => groupId)
      const newMessages = messages.map((m: ChatMessageInterface) => {
        m.groupId = groupId
        return m
      })
      const userMessage = newMessages.find(
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

      messageGroupIds.update(() => [groupId])
      messageGroupId.update(() => groupId)
      chatMessages.update(() => [userMessage, assistantMessagePtr])

      newChat = 1003
      chatIsNew = true
      return
    } else if (newChat === 1002) {
      console.log("here 2")
      if ($isRegenerate) {
        console.log("here 4")

        if ($regenerateUsingSameModelProvider) {
          console.log("here 5")
          assistantMessagePtr = $chatMessages.find(
            (m) => m.id === messageId && m.role === "assistant"
          ) as ChatMessageInterface
          // assistantMessagePtr
        } else {
        }
      } else {
        console.log("here 3")

        const groupId = $messageGroupId
        chatBufferGroupId.update(() => groupId)
        const newMessages = [...messages].map((m) => {
          m.groupId = groupId
          return m
        })
        const userMessage = { ...tempChatMessagesRef.getUserMessage() }
        assistantMessagePtr = {
          role: "assistant",
          username: `${$model}:${$provider}`,
          content: "",
          id: messageId, // Membuat ID unik untuk pesan
          parentId: userMessage?.id || "", // Menggunakan ID pesan pengguna sebagai parentId
          groupId, // Menggunakan groupId saat ini
        }

        // messageGroupIds.update(() => [groupId])
        // messageGroupId.update(() => groupId)
        const chatMessagesSet = [
          ...$chatMessages,
          userMessage,
          assistantMessagePtr,
        ]
        console.log({ chatMessagesSet })

        //@ts-ignore
        chatMessages.update(() => chatMessagesSet)
      }
      newChat = 1003
      return
    }
    // console.log({ newChat })
    if (newChat >= 1003) {
      // console.log({
      //   newChat,
      //   messageGroupId: $messageGroupId,
      //   groupedChatMessages: $groupedChatMessages,
      //   messageGroupIds: $messageGroupIds,
      // })
      if (!Array.isArray($groupedChatMessages[$messageGroupId])) {
        const grpCm = { [$messageGroupId]: [] }

        // groupedChatMessages.update(() => grpCm)
        // await tick()
        console.log("Here")
        // await tick()

        return
      }
      if (tempMode === 0) {
        console.log("INITIAL", { chatIsNew })
        if (chatIsNew) {
        } else {
          if ($isRegenerate) {
          } else {
          }
        }

        tempChatMessageCls.update(() => "hidden")
        tempMode = 1
        // console.log({ updatedGroupedChatMessages })
      } else if (tempMode === 1) {
        // UPDATE

        if (assistantMessagePtr) {
          // console.log("UPDATE")
          console.log({ text })
          if (text.length === 0) return
          assistantMessagePtr.content = text

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
              (msg: any) => msg.id === messageId
            )
            if (messageIndex !== -1) {
              groupMessages[messageIndex] = {
                ...groupMessages[messageIndex],
                content: text,
              }
              updatedGrouped[$messageGroupId] = groupMessages
            }
            // console.log({ updatedGrouped })
            groupedChatMessages.update(() => updatedGrouped)

            // Clean up the timeout reference
            updateTimeouts.delete(messageId)
          }, 15)

          updateTimeouts.set(assistantMessagePtr.id, newTimeout)

          // await tick()
        }
        // await tick()
      }
    }
    if (complete) {
      tempMode = 0
      newChat = 0
      if (chatIsNew) {
        chatIsNew = false
        lastChatId = $conversation.id
      }
      assistantMessagePtr = null
      setTimeout(() => {
        tempChatMessageCls.update(() => "")
      }, 3000)
    }
  }
  function reloadChat() {
    if (params?.id) loadChat(params.id, true)
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
      isProcessing={$isProcessing}
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
