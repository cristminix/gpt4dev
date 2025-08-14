<!-- TypedText.svelte -->
<script lang="ts">
  export let text: string = ""
  export let typingSpeed: number = 50
  export let showCursor: boolean = true

  let displayedText: string = ""
  let isTyping: boolean = false
  let typingTimeout: ReturnType<typeof setTimeout> | null = null

  $: if (text) {
    startTyping()
  }

  function startTyping(): void {
    displayedText = ""
    isTyping = true

    if (typingTimeout) clearTimeout(typingTimeout)

    typeNextChar(0)
  }

  function typeNextChar(index: number): void {
    if (index < text.length) {
      displayedText += text[index]

      typingTimeout = setTimeout(() => {
        typeNextChar(index + 1)
      }, typingSpeed)
    } else {
      isTyping = false
    }
  }

  import { onDestroy } from "svelte"

  onDestroy(() => {
    if (typingTimeout) clearTimeout(typingTimeout)
  })
</script>

<div class="inline-block">
  <span>{displayedText}</span>
  {#if showCursor && isTyping}
    <span class="inline-block animate-blink">|</span>
  {/if}
</div>
