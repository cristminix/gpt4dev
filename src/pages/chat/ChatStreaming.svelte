<script lang="ts">
  import UserMessage from "./UserMessage.svelte"
  import AssistantMessage from "./AssistantMessage.svelte"
  import { onMount } from "svelte"
  import { autoScroll } from "./chat-page/fn/autoScroll"
  import type { ChatMessageInterface } from "./chat-page/types"

  export let onProcessingDone: (
    text: string,
    id: string,
    isRegenerate: boolean,
    errorMessage: string
  ) => void
  export let messages: ChatMessageInterface[] = []
  export let model: string = "gpt-4:blackbox"
  export let conversation_id: string
  export let provider: string
  export let messageId: string
  export let isRegenerate: boolean
  export let regenerateMessages: ChatMessageInterface[]

  let chatContainer
  let filteredMessages = messages.filter((m) => m.role !== "system")
  if (isRegenerate) {
    // console.log({isRegenerate})
    filteredMessages = regenerateMessages.filter((m) => m.role !== "system")
  }

  onMount(() => {
    chatContainer = document.querySelector("#chat-container")
    autoScroll()
  })
</script>

<ul id="chat-container" class=" space-y-5 conversation-list">
  {#if messages.length > 0 || regenerateMessages.length > 0}
    {#if !isRegenerate}
      <UserMessage
        content={filteredMessages[filteredMessages.length - 1].content}
      />
    {/if}
    <AssistantMessage
      {onProcessingDone}
      isStreaming={true}
      {regenerateMessages}
      {messages}
      {model}
      {conversation_id}
      {provider}
      {messageId}
      {isRegenerate}
    />
  {/if}
</ul>

<style>
</style>
