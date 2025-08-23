<script lang="ts">
  import { onMount } from "svelte"
  import TypedText from "./TypedText.svelte"
  import { mockChatStream } from "./mockChatStream"
  import { AnimatedMarkdown } from "flowtoken"
  // import the flowtoken css in order to use the animations
  import "flowtoken/dist/styles.css"
  // import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs"
  import "highlight.js/styles/github-dark.css"
  //@ts-ignore
  import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
  import hljs from "highlight.js"
  import svelte from "highlight.svelte"

  hljs.registerLanguage("svelte", svelte)
  import ReactAdapter from "../ReactAdapter.svelte"
  import { writable } from "svelte/store"
  let message = writable("")
  let isStreaming: boolean = false
  let userInput: string = ""

  async function handleSubmit() {
    // if (!userInput.trim()) return

    $message = ""
    isStreaming = true

    try {
      // Simulate API call
      const response = await mockChatStream(userInput)

      // Process the stream
      const reader = response.body?.getReader()
      if (!reader) throw new Error("Failed to get stream reader")

      const decoder = new TextDecoder()
      let buffer = ""
      let lastUpdateTime = 0
      const minUpdateInterval = 16 // ~60fps

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          // Flush any remaining buffer
          if (buffer) {
            message.update((o) => o + buffer)
          }
          isStreaming = false
          break
        }

        // Decode the chunk and append to buffer
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        // Throttle updates to make animation smoother
        const now = Date.now()
        if (now - lastUpdateTime >= minUpdateInterval) {
          message.update((o) => o + buffer)
          buffer = ""
          lastUpdateTime = now
        }
      }
    } catch (error) {
      console.error("Error:", error)
      isStreaming = false
    }
  }
</script>

<ul id="chat-container" class=" space-y-5 conversation-list">
  <li
    class="max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 bg-neutral-800 pt-4 rounded-md conversation-item assistant-message"
  >
    <svg
      class="shrink-0 size-9.5 rounded-full"
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="38" height="38" rx="6" fill="#2563EB"></rect>
      <path
        d="M10 28V18.64C10 13.8683 14.0294 10 19 10C23.9706 10 28 13.8683 28 18.64C28 23.4117 23.9706 27.28 19 27.28H18.25"
        stroke="white"
        stroke-width="1.5"
      ></path>
      <path
        d="M13 28V18.7552C13 15.5104 15.6863 12.88 19 12.88C22.3137 12.88 25 15.5104 25 18.7552C25 22 22.3137 24.6304 19 24.6304H18.25"
        stroke="white"
        stroke-width="1.5"
      ></path>
      <ellipse cx="19" cy="18.6554" rx="3.75" ry="3.6" fill="white"></ellipse>
    </svg>
    <div class="grow max-w-[90%] w-full space-y-3">
      <div class="model-info pt-1">
        <h4 class="text-xl font-semibold">gpt-5:OpenAIAccount</h4>
      </div>
      <div class="space-y-3 inner-content mb-3">
        {#if $message.length > 0}
          <ReactAdapter
            el={AnimatedMarkdown}
            content={$message}
            animation="slideUp"
            animationDuration="0.5s"
            animationTimingFunction="ease-in-out"
            codeStyle={dracula}
            sep="word"
          />
        {/if}
      </div>

      <form on:submit|preventDefault={handleSubmit} class="flex gap-2">
        <input
          type="text"
          bind:value={userInput}
          placeholder="Type a message..."
          disabled={isStreaming}
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isStreaming}
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  </li>
</ul>
