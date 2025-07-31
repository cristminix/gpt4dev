<script lang="ts">
  import { marked } from "marked"
  import { onMount } from "svelte"
  import SvelteMarkdown from "svelte-markdown"
  import CodeRenderer from "./CodeRenderer.svelte"
  import { writable } from "svelte/store"
  import CodeRendererStream from "./CodeRendererStream.svelte"
  import { getProviderApiKey } from "@/global/store/auth/getProviderApiKey"
  export let prompt: any = "hi"
  export let model: any = "gpt-4:blackbox"
  export let isStreaming = false
  export let onProcessingDone: any = null
  export let messages: any = []
  export let conversation_id
  export let provider
  export let messageId
  let oldRequestDate = Date.now()
  const finalContent = writable("")
  let fullText = ""
  let tmpFullText = ""
  let currentMessageElement
  let chatContainer
  function autoScroll() {
    setTimeout(() => {
      window.scrollTo({
        top: document.querySelector(".template-content").scrollHeight + 200,
        behavior: "smooth", // Optional: smooth scrolling
      })
    }, 1000)
  }
  async function updateMessage(text) {
    setTimeout(() => {
      finalContent.update(() => text)
      autoScroll()
    }, 256)
  }

  function finalizeMessage() {
    onProcessingDone(fullText, messageId)
    oldRequestDate = Date.now()
  }
  function getReasoningText(resp) {
    if (resp.token) return resp.token
    if (resp.status) return resp.status
    if (resp.label) return resp.label
    return ""
  }

  async function fetchOpenAIResponse() {
    const now = Date.now()
    // Menghitung selisih dalam milidetik
    if (!oldRequestDate) {
      oldRequestDate = now
    }
    const differenceInMilliseconds = now - oldRequestDate

    // Mengonversi selisih milidetik ke detik
    await new Promise((resolve) =>
      setTimeout(resolve, 512 - differenceInMilliseconds)
    )
    const OPENAI_API_KEY = getProviderApiKey(provider)
    fullText = ""
    const response = await fetch("/api/backend-api/v2/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        action: "next",
        api_key: OPENAI_API_KEY,
        aspect_ratio: "16:9",
        conversation: null,
        model, // or 'gpt-3.5-turbo'
        messages,
        stream: true, // Enable streaming
        provider,
        id: messageId,
        conversation_id,
        download_media: true,
      }),
    })
    if (!response.ok) {
      updateMessage("Error fetching response:" + response.statusText)
      return
    }
    const reader = response.body.getReader()
    let line = ""
    let reasoningText = ""
    while (true) {
      let buffer = ""

      const { done, value } = await reader.read()
      if (done) {
        finalizeMessage()
        break
      }

      buffer += new TextDecoder().decode(value)
      let resp

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
          // console.log(resp)

          switch (resp.type) {
            case "log":
              break
            case "provider":
              break
            case "content":
              fullText += resp.content
              // console.log(line)
              updateMessage(fullText)

              break
            case "finish":
              const reason = resp.finish.reason
              finalizeMessage()

            case "parameters":
              break
            case "error":
              fullText = resp.message
              finalizeMessage()
              break
            case "preview":
              updateMessage(resp.preview)

              break
            case "conversation":
              try {
                // const { message_history } = resp.conversation[provider]
                // const lastMessage = message_history[message_history.length - 1]
                // // tmpFullText = tmpFullText
                // fullText = lastMessage
                // finalizeMessage()
              } catch (error) {
                console.error("Error accessing conversation data:", error)
              }

              break
            case "reasoning":
              reasoningText += getReasoningText(resp)
              updateMessage(reasoningText)
              break
          }
        } else {
          alert("no response")
        }
      }

      //   await new Promise((r) => setTimeout(r, 512))
    }
    // finalizeMessage()
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
      <h4 class="text-xl font-semibold">
        {model}:{provider}
      </h4>
    </div>
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
