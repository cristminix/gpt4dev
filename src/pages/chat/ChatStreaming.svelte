<script lang="ts">
  import UserMessage from "./UserMessage.svelte";
  import AssistantMessage from "./AssistantMessage.svelte";
  import { onMount } from "svelte";
  import { autoScroll } from "./chat-page/fn/autoScroll";
  import type { ChatMessageInterface } from "./chat-page/types";
  export let onProcessingDone: (text: string, id: number | string) => void;
  export let messages: ChatMessageInterface[] = [];
  export let model: string = "gpt-4:blackbox";
  export let conversation_id: string;
  export let provider: string;
  export let messageId: string | number;

  let chatContainer;
  let filteredMessages = messages.filter((m) => m.role !== "system");
  onMount(() => {
    chatContainer = document.querySelector("#chat-container");
    autoScroll();
  });
</script>

<ul id="chat-container" class="mt-16 space-y-5 conversation-list">
  {#if messages.length > 0}
    <UserMessage
      content={filteredMessages[filteredMessages.length - 1].content}
    />
    <AssistantMessage
      {onProcessingDone}
      isStreaming={true}
      {messages}
      {model}
      {conversation_id}
      {provider}
      {messageId}
    />
  {/if}
</ul>

<style>
</style>
