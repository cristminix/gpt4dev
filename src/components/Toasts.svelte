<script lang="ts">
  import { onMount } from "svelte"

  const Toastify = window.Toastify

  function buildToastMarkup(t: string, message: string) {
    return `<div class="flex p-4">
        <p class="text-sm text-gray-700 dark:text-neutral-400 ${t === "error" ? "text-red-300" : "text-green-300"}">${message}</p>
        <div class="ms-auto">
          <button onclick="tostifyCustomClose(this)" type="button" class="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-hidden focus:opacity-100 dark:text-white" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
      </div>`
  }
  export function doToast(t: string, message: string) {
    Toastify({
      text: buildToastMarkup(t, message),
      className:
        "hs-toastify-on:opacity-100 opacity-0 fixed -top-37.5 right-5 z-90 transition-all duration-300 w-80 bg-white text-sm text-gray-700 border border-gray-200 rounded-xl shadow-lg [&>.toast-close]:hidden dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400",
      duration: 3000,
      close: true,
      escapeMarkup: false,
    }).showToast()
  }
  onMount(() => {})
</script>
