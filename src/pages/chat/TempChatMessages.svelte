<script lang="ts">
  import ChatStreaming from "./ChatStreaming.svelte"
  export let onProcessingDone: any
  export let messages: any
  export let model: any
  export let conversation_id
  export let provider
</script>

<div class="mt-16 space-y-5">
  <ChatStreaming
    {onProcessingDone}
    {messages}
    {model}
    {conversation_id}
    {provider}
  />
</div>
