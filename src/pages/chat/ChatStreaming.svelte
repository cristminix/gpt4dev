<script lang="ts">
  import UserMessage from "./UserMessage.svelte"
  import AssistantMessage from "./AssistantMessage.svelte"
  import { onMount } from "svelte"
  export let onProcessingDone: any
  export let messages: any = []
  export let model: any = "gpt-4:blackbox"
  export let conversation_id
  export let provider
  export let messageId

  let chatContainer

  function autoScroll() {
    window.scrollTo({
      top: document.querySelector(".template-content").scrollHeight,
      behavior: "smooth", // Optional: smooth scrolling
    })
  }

  onMount(() => {
    chatContainer = document.querySelector("#chat-container")
    autoScroll()
  })
</script>

<ul id="chat-container" class="mt-16 space-y-5 conversation-list">
  {#if messages.length > 0}
    <UserMessage content={messages[messages.length - 1].content} />
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
