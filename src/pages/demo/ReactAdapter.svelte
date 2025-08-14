<script lang="ts">
  import React from "react"
  import { createRoot } from "react-dom/client"
  import { onDestroy, onMount } from "svelte"

  const e = React.createElement
  let container: any
  let root: any
  let debounceTimer: any

  onMount(() => {
    root = createRoot(container)
  })

  $: {
    if (root) {
      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      // Set new timer with 512ms delay
      debounceTimer = setTimeout(() => {
        const { el, children, class: _, ...props } = $$props
        try {
          root.render(e(el, props, children))
        } catch (err) {
          console.warn(`react-adapter failed to mount.`, { err })
        }
      }, 25)
    }
  }

  onDestroy(() => {
    try {
      if (root) {
        root.unmount()
      }
      // Clear timer on destroy
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    } catch (err) {
      console.warn(`react-adapter failed to unmount.`, { err })
    }
  })
</script>

<div bind:this={container} class={$$props.class} />
