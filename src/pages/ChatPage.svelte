<script lang="ts">
  import { writable } from "svelte/store";

  import ChatMessages from "./chat/ChatMessages.svelte";
  import ChatPrompt from "./chat/ChatPrompt.svelte";
  import TempChatMessages from "./chat/TempChatMessages.svelte";
  import jquery from "jquery";
  import {
    addMessageTask as addMessageTaskExternal,
    updateMessageTask as updateMessageTaskExternal,
    getMessageTask as getMessageTaskExternal,
  } from "./chat/chat-page/fn/messageTasks";
  import { submitPrompt } from "./chat/chat-page/fn/submitPrompt";
  import { processDone } from "./chat/chat-page/fn/processDone";
  import { createNewChat as createNewChatExternal } from "./chat/chat-page/fn/createNewChat";
  import { loadChat as loadChatExternal } from "./chat/chat-page/fn/loadChat";
  import { deleteMessage as deleteMessageExternal } from "./chat/chat-page/fn/deleteMessage";

  import { getModelConfig } from "@/global/store/chat/getModelConfig";
  import ConversationWidget from "./chat/ConversationWidget.svelte";
  import { deleteChatMessage } from "@/global/store/conversation/deleteChatMessage";
  import type { RouteApp as RouteAppType } from "@/components/RouteApp.types";
  import type {
    ChatMessageInterface,
    ConversationInterface,
    MessageTask,
  } from "./chat/chat-page/types";
  import ChatMessagesWithGroup from "./chat/ChatMessagesWithGroup.svelte";
  import { getMessageGroups } from "@/global/store/conversation/getMessageGroups";
  export let routeApp: RouteAppType;
  export let params: { id?: string } | null;

  let modelImageGens = ["flux", "flux-dev", "sd-3.5-large"];
  const tempConversation = writable<any>([]);
  const isProcessing = writable(false);
  const conversation = writable<ConversationInterface | null>(null);
  const chatMessages = writable<ChatMessageInterface[]>([]);
  const promptMessages = writable<ChatMessageInterface[]>([]);
  const model = writable("");
  const provider = writable("");
  const userPrompt = writable("");
  const messageId = writable("");
  const messageGroupId = writable("");
  const messageGroupIds = writable<string[]>([]);
  const isRegenerate = writable(false);

  const messageTasks = writable<Record<string, MessageTask>>({});
  const chatConfig = writable({
    attachChatHistoryToUserPrompt: false,
  });
  function setChatConfig(config: any) {
    chatConfig.update((o: any) => ({ ...o, ...config }));
  }
  function addMessageTask(id: string) {
    addMessageTaskExternal(id, messageTasks, $messageTasks);
  }
  function updateMessageTask(id: string, status: boolean) {
    updateMessageTaskExternal(id, status, messageTasks, $messageTasks);
  }
  function getMessageTask(id: string) {
    return getMessageTaskExternal(id, $messageTasks);
  }

  function onSubmitPrompt(userMessageContent: string, systemMessage: string) {
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
      $messageGroupId
    );
  }

  function shouldPerformTitleGeneration() {
    if (modelImageGens.includes($model)) {
      return false;
    }
    return true;
  }
  function onProcessingDone(
    fullText: string,
    id: string,
    isRegenerate: boolean
  ) {
    console.log({
      $messageGroupId,
      $messageGroupIds,
    });
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
    );
  }
  function createNewChat() {
    createNewChatExternal(conversation, chatMessages, jquery);
  }

  async function loadChat(id: string) {
    await loadChatExternal(id, conversation, chatMessages, createNewChat);

    // Handle document title update
    if ($conversation) {
      document.title = $conversation.title;
      console.log($conversation);

      // load message groups
      const messageGroups = await getMessageGroups($conversation.id);
      console.log({ messageGroups });
      if (messageGroups.length > 0) {
        const messageGroupIdsSet = messageGroups.map((mg: any) => mg.id);
        messageGroupIds.update(() => messageGroupIdsSet);
        if (
          !messageGroupIdsSet.includes($messageGroupId) ||
          $messageGroupId.length == 0
        ) {
          messageGroupId.update(() => messageGroupIdsSet[0]);
        }
      }
    }
  }
  function onDeleteMessage(id: string) {
    deleteMessageExternal(
      id,
      chatMessages,
      $chatMessages,
      $conversation,
      deleteChatMessage,
      confirm,
      console
    );
  }
  async function onRegenerateMessage(message: ChatMessageInterface) {
    console.log("regenerate message", { message });
  }
  $: if (params?.id) loadChat(params.id);
</script>

<div class="py-10 lg:py-14">
  <ConversationWidget conversation={$conversation} {routeApp} />
  {#if $messageGroupIds.length > 0}
    <ChatMessagesWithGroup
      conversation={$conversation}
      chatMessages={$chatMessages}
      messageGroupIds={$messageGroupIds}
      messageGroupId={$messageGroupId}
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
      isRegenerate={$isRegenerate}
    />
  {/if}
  <ChatPrompt {onSubmitPrompt} {setChatConfig} />
</div>
