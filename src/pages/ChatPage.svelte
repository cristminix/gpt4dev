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
  import { onMount } from "svelte"
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
      // console.log($conversation)
      await updateMessageGroupMessages()

      // load message groups
      // await updateMessageGroupMessages()
      // toasts.doToast("success", "Loaded")
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
  function onChatBuffer(data: any) {
    return
    const result = onChatBufferExternal({
      data,
      tempChatMessagesRef,
      messageGroupId,
      groupedChatMessages,
      messageId,
      model,
      provider,
      tempChatMessageCls,
      tempMode,
      assistantMessagePtr,
    })

    // Update the local variables with the result
    tempMode = result.tempMode
    assistantMessagePtr = result.assistantMessagePtr
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
