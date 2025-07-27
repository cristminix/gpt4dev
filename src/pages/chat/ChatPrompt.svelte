<script lang="ts">
  import { onMount } from "svelte"
  import jquery from "jquery"
  export let onSubmitPrompt: any
  onMount(() => {
    HSTextareaAutoHeight.autoInit()
  })

  function onUserPromptChange() {
    // console.log("user prompt change")
  }
  function sendKeystroke(text) {
    const textarea = document.getElementById("userInput")
    textarea.focus() // Memfokuskan textarea

    // Menambahkan teks ke textarea
    textarea.value = text

    // Membuat dan memicu event 'input' untuk memperbarui interaksi pengguna
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    })
    textarea.dispatchEvent(event)
  }
  function onUserPromptKeydown(e: Event) {
    if (e.keyCode === 13) {
      onSubmitUserPrompt()
      return e.preventDefault()
    }
    // console.log(e.keyCode)
    // console.log("user prompt change")
  }
  function onSubmitUserPrompt() {
    console.log("submit user prompt")
    const content = jquery("#userInput").val()
    sendKeystroke("")
    onSubmitPrompt(content)
  }
</script>

<div class="max-w-6xl mx-auto sticky bottom-0 z-10 p-3 sm:py-6">
  <!-- Input -->
  <div class="relative">
    <textarea
      id="chatPrompt"
      class="hidden sm:p-4 pb-12 sm:pb-12 block w-full bg-gray-100 border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
      placeholder="System prompt"
    ></textarea>
  </div>
  <div class="relative">
    <textarea
      on:change={onUserPromptChange}
      on:keyup={onUserPromptChange}
      on:keydown={onUserPromptKeydown}
      data-hs-textarea-auto-height
      id="userInput"
      class="p-3 sm:p-4 pb-12 sm:pb-12 block w-full bg-gray-100 border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
      placeholder="Ask me anything..."
    ></textarea>

    <!-- Toolbar -->
    <div
      class="absolute bottom-px inset-x-px p-2 rounded-b-lg bg-gray-100 dark:bg-neutral-800"
    >
      <div class="flex flex-wrap justify-between items-center gap-2">
        <!-- Button Group -->
        <div class="flex items-center">
          <div
            class="chat-toolbar flex items-center justify-between mb-2 hidden"
          >
            <div id="input-count" class="text-xs text-gray-500">
              <button class="hide-input text-gray-400 hover:text-white">
                <i class="fa-solid fa-angles-down"></i>
              </button>
              <label for="agree" class="text"></label>
            </div>
            <div class=""></div>
            <div class=""></div>
          </div>

          <!-- Mic Button -->
          <button
            type="button"
            class="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-hidden focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <line x1="9" x2="15" y1="15" y2="9"></line>
            </svg>
          </button>
          <!-- End Mic Button -->

          <!-- Attach Button -->
          <button
            type="button"
            class="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-hidden focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
              ></path>
            </svg>
          </button>
          <!-- End Attach Button -->
        </div>
        <!-- End Button Group -->

        <!-- Button Group -->
        <div class="flex items-center gap-x-1">
          <!-- Mic Button -->
          <button
            type="button"
            class="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:bg-white focus:z-10 focus:outline-hidden focus:bg-white dark:text-neutral-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          >
            <svg
              class="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
              ></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </button>
          <!-- End Mic Button -->
          <!-- Cancel Button-->
          <button
            id="cancelButton"
            class="prompt-action-btn stop_generating stop_generating-hidden text-red-400 hover:text-red-300"
          >
            <i class="fa-solid fa-stop"></i>
          </button>
          <!-- Regenerate Button -->
          <button
            id="regenerateButton"
            class="prompt-action-btn regenerate text-blue-400 hover:text-blue-300"
          >
            <i class="fa-solid fa-rotate"></i>
          </button>
          <!-- Send Button -->
          <button
            on:click={onSubmitUserPrompt}
            type="button"
            class="inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-hidden focus:bg-blue-500"
          >
            <svg
              class="shrink-0 size-3.5"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"
              ></path>
            </svg>
          </button>
          <!-- <button type="button" class=" hidden inline-flex shrink-0 justify-center items-center size-8 rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:z-10 focus:outline-hidden focus:bg-blue-500">
                <svg class="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                </svg>
              </button> -->
          <!-- <button
            id="addButton"
            aria-label="Add message"
            class=" hidden hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-1"
          >
            <i class="fa-solid fa-square-plus" aria-hidden="true"></i>
            <span>Add</span>
          </button>

          <button
            id="sendButton"
            aria-label="Send message"
            class="hidden hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-1"
          >
            <i class="fa-regular fa-paper-plane" aria-hidden="true"></i>
            <span>Send</span>
          </button> -->
          <!-- End Send Button -->
        </div>
        <!-- End Button Group -->
      </div>
    </div>
    <!-- End Toolbar -->
  </div>
  <!-- End Input -->
</div>
