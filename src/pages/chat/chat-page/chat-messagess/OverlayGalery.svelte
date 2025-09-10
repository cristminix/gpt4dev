<script lang="ts">
  import { onMount } from "svelte"
  import jquery from "jquery"
  import { writable } from "svelte/store"
  const content = writable("")
  let imgEl: HTMLElement

  // Fungsi yang dapat ditimpa dari luar
  export let onPrev = () => {}
  export let onNext = () => {}

  function handleKeydown(event: KeyboardEvent) {
    console.log("Keydown event triggered", event.key)
    if (event.key === "ArrowLeft") {
      // Panggil fungsi untuk tombol panah kiri
      handleLeftArrow()
    } else if (event.key === "ArrowRight") {
      // Panggil fungsi untuk tombol panah kanan
      handleRightArrow()
    }
  }

  function handleLeftArrow() {
    // Implementasi untuk tombol panah kiri
    // console.log("Tombol panah kiri ditekan")
    onPrev()
  }

  function handleRightArrow() {
    // Implementasi untuk tombol panah kanan
    // console.log("Tombol panah kanan ditekan")
    onNext()
  }

  onMount(() => {
    //@ts-ignore
    HSOverlay.autoInit()

    // setTimeout(() => {
    //   jquery("#overlayBtn").click()
    // }, 3000)
  })

  export function open() {
    jquery("#overlayBtn").click()
    // Fokuskan elemen modal setelah dibuka
    setTimeout(() => {
      const modalElement = document.getElementById("hs-basic-modal")
      if (modalElement) {
        modalElement.focus()
      }
    }, 100) // Memberi sedikit jeda agar modal benar-benar terbuka sebelum difokuskan
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
  tabindex="0"
  aria-labelledby="hs-basic-modal-label"
  on:keydown={handleKeydown}
>
  <div
    class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all m-3 mx-auto"
  >
    <img src={$content} bind:this={imgEl} class="mx-auto mt-[60px] h-auto" />
  </div>
</div>
