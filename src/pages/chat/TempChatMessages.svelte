<script lang="ts">
  import type { ChatMessageInterface } from "./chat-page/types";
  import ChatStreaming from "./ChatStreaming.svelte";
  export let onProcessingDone: (
    text: string,
    id: string,
    isRegenerate: boolean
  ) => void;
  export let messages: ChatMessageInterface[];
  export let model: string;
  export let conversation_id: string;
  export let provider: string;
  export let messageId: string;
  export let isRegenerate: boolean;
</script>

<div class="mt-16 space-y-5">
  <ChatStreaming
    {onProcessingDone}
    {messages}
    {model}
    {conversation_id}
    {provider}
    {messageId}
    {isRegenerate}
  />
</div>
