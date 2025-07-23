<script lang="ts">
  import type Fs from "@/global/classes/Fs"
  import { onDestroy, onMount } from "svelte"
  import { writable } from "svelte/store"
  import { fsGetFileBase64 } from "@/global/fn/fsGetFileBase64"

  export let path: string
  export let fs: Fs
  export let alt: string = ""
  export let title: string = ""
  export let cls: string = ""
  export let blankImage: string = ""
  let loaded = writable(false)
  let base64 = writable<string>("")
  const loadBase64 = async () => {
    const result = await fsGetFileBase64(fs, path)
    if (result) {
      base64.set(result)
      loaded.set(true)
    } else {
      base64.set(blankImage)
      loaded.set(false)
    }
  }
  onMount(() => {
    loadBase64()
    return () => {
      loaded.set(false)
      base64.set("")
    }
  })
  $: {
    // console.log("Prop changed:", path)
    loadBase64()
  }
</script>

{#if loaded && base64}
  <img src={$base64} {alt} {title} class={cls} />
{:else}
  <div class="loading">Loading...</div>
{/if}
