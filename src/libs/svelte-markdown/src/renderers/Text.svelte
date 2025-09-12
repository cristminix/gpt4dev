<script>
  export let text
  export let raw
  let match = false
  if (text.match(/\[\d+\]\s*|\b\d+\b/g)) {
    text = text.replace(/\[(\d+)\]\s*|\b\d+\b/g, "$1. ")
    match = true
  }
  // console.log({ text })
</script>

{#if match}
  {text}
{:else}
  <slot />
{/if}
