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
    hasError: boolean,
    errorMessage: string
  ) => void
  export let messages: ChatMessageInterface[]
  export let regenerateMessages: ChatMessageInterface[]
  export let model: string
  export let conversation: ConversationInterface

  export let provider: string
  export let messageId: string
  export let isRegenerate: boolean

  let chatStreaming: ChatStreaming
  export function abortCompletion() {
    if (chatStreaming) {
      chatStreaming.abortCompletion()
    }
  }
</script>

<div class="mt-6 space-y-5">
  <ChatStreaming
    bind:this={chatStreaming}
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
