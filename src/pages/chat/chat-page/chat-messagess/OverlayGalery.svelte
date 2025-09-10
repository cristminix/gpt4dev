<script lang="ts">
  import { onMount } from "svelte"
  import jquery from "jquery"
  import { writable } from "svelte/store"
  const content = writable("")
  let imgEl: HTMLElement
  onMount(() => {
    //@ts-ignore
    HSOverlay.autoInit()

    // setTimeout(() => {
    //   jquery("#overlayBtn").click()
    // }, 3000)
  })

  export function open() {
    jquery("#overlayBtn").click()
  }
  export function setContent(what: any) {
    content.update(() => what)
    // jquery("#overlayBtn").click()
    setTimeout(() => {
      jquery(imgEl).height(jquery(window).height() - 100)
    }, 1000)
  }
</script>

<div class="hidden">
  <button
    type="button"
    id="overlayBtn"
    class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 hidden"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="hs-basic-modal"
    data-hs-overlay="#hs-basic-modal"
  >
    Open modal
  </button>
</div>
<div
  id="hs-basic-modal"
  class="hs-overlay hidden size-full fixed top-0 start-0 z-63 overflow-x-hidden overflow-y-auto pointer-events-none"
  role="dialog"
  tabindex="-1"
  aria-labelledby="hs-basic-modal-label"
>
  <div
    class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all m-3 mx-auto"
  >
    <img src={$content} bind:this={imgEl} class="mx-auto mt-[60px] h-auto" />
  </div>
</div>
