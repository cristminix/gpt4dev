<script lang="ts">
  import { writable } from "svelte/store"

  export let className = ""
  export let autoHide = false

  const progress = writable(0)
  const message = writable("Initializing...")

  export function setProgress(newProgress: number, newMessage = null) {
    if (newMessage !== null) {
      message.update((o) => newMessage)
    }
    progress.update((o) => newProgress)
  }

  export function setMessage(newMessage: string) {
    message.update((o) => newMessage)
  }

  $: hiddenClass = autoHide && $progress === 0 ? "hidden" : ""
  $: styles = `width: ${$progress}%`

  const cls0 = "cls-0 mb-2 flex justify-between items-center"
  const cls1 = "cls-1 text-sm font-semibold text-gray-800 dark:text-white"
  const cls2 = "cls-2 text-sm text-gray-800 dark:text-white"
  const cls3 = "cls-3 flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700"
  const cls4 =
    "cls-4 flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
</script>

<div class="{className} {hiddenClass}">
  <div class={cls0}>
    <h3 class={cls1}>{message}</h3>
    <span class={cls2}> {progress}% </span>
  </div>
  <div role="progressbar" aria-valuenow={$progress} aria-valuemin="0" aria-valuemax="100" class={cls3}>
    <div class={cls4} style={styles}></div>
  </div>
</div>

<style>
  .cls-0 {
    /* Add your styles here */
  }
  .cls-1 {
    /* Add your styles here */
  }
  .cls-2 {
    /* Add your styles here */
  }
  .cls-3 {
    /* Add your styles here */
  }
  .cls-4 {
    /* Add your styles here */
  }
</style>
