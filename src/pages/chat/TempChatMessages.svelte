<script lang="ts">
  import type {
    ChatMessageInterface,
    ConversationInterface,
  } from "./chat-page/types"
  import ChatStreaming from "./ChatStreaming.svelte"
  export let onProcessingDone: (
    text: string,
    id: string,
    isRegenerate: boolean,
    errorMessage: string
  ) => void
  export let messages: ChatMessageInterface[]
  export let regenerateMessages: ChatMessageInterface[]
  export let model: string
  export let conversation: ConversationInterface

  export let provider: string
  export let messageId: string
  export let isRegenerate: boolean
</script>

<div class="mt-6 space-y-5">
  <ChatStreaming
    {onProcessingDone}
    {messages}
    {regenerateMessages}
    {model}
    {conversation}
    {provider}
    {messageId}
    {isRegenerate}
  />
</div>
