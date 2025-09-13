<script>
  export let text
  export let raw
  let match = false
  if (text.match(/\[\d+\]\s{1}/g)) {
    text = text.replace(/\[(\d+)\]\s{1}/g, "$1. ")
    match = true
  }
  // console.log({ text })
</script>

{#if match}
  {text}
{:else}
  <slot />
{/if}
