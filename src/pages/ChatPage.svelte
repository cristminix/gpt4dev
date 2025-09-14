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
  import {
    ocbInitializeChatState,
    ocbIsValidMessageGroup,
    ocbSetupChatBuffer,
    ocbUpdateAssistantMessageContent,
    ocbHandleCompletion,
  } from "./chat/chat-page/fn/onChatBuffer"

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
  const useChatBuffer = writable(true)
  const chatBufferGroupId = writable("")
  const chatBufferMode = writable("default") // default,regenerate
  let tempMode = 0
  let assistantMessagePtr: ChatMessageInterface | undefined
  const tempChatMessageCls = writable("")
  const MIRROR_TMP_CHAT = import.meta.env.VITE_MIRROR_TMP_CHAT === "true"
  const updateTimeouts = new Map<string, number>()
  let newChat = 0
  let chatIsNew = false
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
      lastGeneratedAssistantMessageId,
      $conversation,
      messageGroupIds
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
        $chatBufferGroupId,
        reloadChat,
        groupedChatMessages,
        $groupedChatMessages
      )
  }
  function createNewChat() {
    createNewChatExternal(conversation, chatMessages, jquery)
  }
  let lastChatId = ""
  async function loadChat(id: string, reload = false) {
    console.log("loadChat,reload", reload)
    clearChatBuffer()
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
      addMessageTask,
      messageGroupIds,
      $messageGroupIds
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
      $regeneratePromptMessages,
      tempChatMessagesRef
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
      isProcessing.update(() => false)
    }
  }
  onMount(() => {
    // chatMessages.subscribe((newChatMessages) => {})
  })

  function clearChatBuffer() {
    newChat = 0
    chatIsNew = false
    assistantMessagePtr = undefined
    tempMode = 0
  }

  async function onChatBuffer(data: any) {
    // Early returns for guard conditions
    if (!params || !MIRROR_TMP_CHAT || !tempChatMessagesRef) return

    const { text, complete } = data

    // Initialize chat state
    if (
      ocbInitializeChatState(
        params,
        newChat,
        (value: number) => {
          newChat = value
        },
        (value: boolean) => {
          chatIsNew = value
        }
      )
    ) {
      return
    }

    // Process chat buffer updates
    if (newChat >= 1003) {
      // Validate message group exists
      if (!ocbIsValidMessageGroup($groupedChatMessages, $messageGroupId)) {
        return
      }

      // Initial setup for chat buffer
      if (tempMode === 0) {
        ocbSetupChatBuffer(tempChatMessageCls, (value: number) => {
          tempMode = value
        })
      }
      // Update existing assistant message
      else if (tempMode === 1) {
        ocbUpdateAssistantMessageContent(
          text,
          assistantMessagePtr,
          (value: ChatMessageInterface | undefined) => {
            assistantMessagePtr = value
          },
          $chatMessages,
          $lastGeneratedAssistantMessageId,
          updateTimeouts,
          $groupedChatMessages,
          $messageGroupId,
          (value: any) => {
            groupedChatMessages.update(() => value)
          }
        )
      }
    }

    // Handle completion
    if (complete) {
      ocbHandleCompletion(
        (value: number) => {
          tempMode = value
        },
        (value: number) => {
          newChat = value
        },
        chatIsNew,
        (value: boolean) => {
          chatIsNew = value
        },
        $conversation,
        (value: ChatMessageInterface | undefined) => {
          assistantMessagePtr = value
        },
        tempChatMessageCls,
        lastChatId,
        (value: string) => {
          lastChatId = value
        }
      )
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
