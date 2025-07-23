<script lang="ts">
  import { marked } from "marked"
  import { onMount } from "svelte"
  import SvelteMarkdown from "svelte-markdown"
  import CodeRenderer from "./CodeRenderer.svelte"
  import { writable } from "svelte/store"
  import CodeRendererStream from "./CodeRendererStream.svelte"
  export let prompt: any = "hi"
  export let model: any = "gpt-4:blackbox"
  export let isStreaming = false
  export let onProcessingDone: any = null
  export let messages: any = []
  export let conversation_id
  export let provider
  const finalContent = writable("")
  let fullText = ""
  let currentMessageElement
  let chatContainer
  async function updateMessage(text) {
    console.log(text)
    // finalContent.update(() => "")
    await setTimeout(() => {
      finalContent.update(() => text)
    }, 200)
    /*
    if (currentMessageElement) {
      currentMessageElement.textContent = `${text}`
    } else {
      currentMessageElement = document.createElement("div")
      currentMessageElement.classList.add("assistant-message")
      currentMessageElement.textContent = `${text}`
      chatContainer.appendChild(currentMessageElement)
    }
      */
  }

  function finalizeMessage() {
    // console.log(fullText)
    /*
    if (currentMessageElement) {
      currentMessageElement.innerHTML = `${marked.parse(fullText)}`
      currentMessageElement = null
    }
      */
    onProcessingDone(fullText)
  }
  const OPENAI_API_KEY = "your-openai-api-key" // Replace with your actual API key

  async function fetchOpenAIResponse() {
    fullText = ""
    const response = await fetch("/api/backend-api/v2/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        action: "next",
        api_key: null,
        aspect_ratio: "16:9",
        conversation: null,
        model, // or 'gpt-3.5-turbo'
        messages,
        stream: true, // Enable streaming
        provider,
        id: conversation_id,
        conversation_id,
        download_media: true,
      }),
    })

    const reader = response.body.getReader()
    let line = ""
    while (true) {
      let buffer = ""

      const { done, value } = await reader.read()
      if (done) break

      buffer += new TextDecoder().decode(value)
      let resp
      let reasoningText = ""
      let previewText = ""
      for (const line of buffer.split("\n")) {
        if (!line) {
          continue
        }
        try {
          resp = JSON.parse(line)
        } catch (error) {
          console.error("Error parsing JSON:", error)
        }
        if (resp) {
          console.log(resp)

          switch (resp.type) {
            case "log":
              break
            case "provider":
              break
            case "content":
              fullText += resp.content
              console.log(line)
              updateMessage(fullText)

              break
            case "finish":
              const reason = resp.finish.reason
              finalizeMessage()

            case "parameters":
              break
            case "error":
              break
            case "preview":
              updateMessage(resp.preview)

              break
            case "reasoning":
              reasoningText += resp.status ?? resp.label
              updateMessage(reasoningText)
              break
          }
        }
      }

      //   await new Promise((r) => setTimeout(r, 512))
    }
    finalizeMessage()
  }
  onMount(() => {})
  $: {
    // chatContainer = document.querySelector("#chat-container")
    if (isStreaming) {
      fetchOpenAIResponse()
    } else {
      finalizeMessage()
    }
  }
</script>

<li
  class="max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 bg-neutral-800 pt-4 rounded-md"
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
    <!-- Card -->
    <div class="space-y-3 inner-content">
      {#if $finalContent.length > 0}
        <SvelteMarkdown
          source={$finalContent}
          renderers={{ code: CodeRendererStream }}
        />
      {/if}
    </div>
    <!-- End Card -->
  </div>
</li>
