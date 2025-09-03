<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { writable } from "svelte/store"
  import type {
    ChatMessageInterface,
    ConversationInterface,
  } from "./chat-page/types"
  import { autoScroll } from "./chat-page/fn/autoScroll"
  import { autoScrollReasoning } from "./chat-page/fn/autoScrollReasoning"
  import { completion } from "./chat-page/fn/completion"
  import ReactAdapter from "../demo/ReactAdapter.svelte"
  import { AnimatedMarkdown } from "flowtoken"
  import LoadingIndicator from "../../components/ux/LoadingIndicator.svelte"
  //@ts-ignore
  import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

  export let prompt: string = "hi"
  export let model: string = "gpt-4:blackbox"
  export let isStreaming = false

  export let onProcessingDone: (
    text: string,
    id: string,
    isRegenerate: boolean,
    hasError: boolean,

    errorMessage: string
  ) => void
  export let messages: ChatMessageInterface[] = []
  export let regenerateMessages: ChatMessageInterface[] = []

  export let conversation: ConversationInterface
  export let provider: string
  export let messageId: string
  export let isRegenerate: boolean
  export let onChatBuffer: (data: any) => void
  // Store for abort handler

  const finalContent = writable("")
  const reasoningContent = writable("")
  const reasoning = writable(false)
  const dotAnimation = writable("")
  const isProcessing = writable(false)

  // Inisialisasi autoscroll untuk reasoning content
  let autoScrollManager: ReturnType<typeof autoScrollReasoning> | null = null

  onMount(() => {})

  onDestroy(() => {})
  function processOnChatBuffer(
    text: string,
    t: string,
    complete: boolean,
    params?: any
  ) {
    const data = {
      text,
      t,
      complete,
      params,
      messageId,
      messages: isRegenerate ? regenerateMessages : messages,
    }
    onChatBuffer(data)
  }
  // Efek untuk animasi titik saat dalam keadaan reasoning
  let dotInterval: number | null = null
  $: if ($reasoning) {
    // Mulai animasi titik
    dotInterval = window.setInterval(() => {
      dotAnimation.update((dots) => {
        if (dots.length >= 3) return ""
        return dots + "."
      })
    }, 500)
  } else {
    // Hentikan animasi titik
    if (dotInterval) {
      clearInterval(dotInterval)
      dotInterval = null
    }
    // Reset teks animasi
    dotAnimation.set("")
  }

  // Debounce function
  let debounceTimer: number | null = null
  function debounce(func: () => void, delay: number) {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      debounceTimer = window.setTimeout(func, delay)
    }
  }

  async function updateMessage(text: string): Promise<void> {
    processOnChatBuffer(text, "update", false)
    isProcessing.set(true)
    setTimeout(() => {
      reasoning.update(() => false)

      finalContent.update(() => text)
      autoScroll()
    }, 256)
  }
  async function updateReasoningMessage(
    text: string,
    token: string
  ): Promise<void> {
    if (!$reasoning) reasoning.update(() => true)
    processOnChatBuffer(text, "reasoning", false)
    const debouncedUpdate = debounce(() => {
      if (!autoScrollManager) {
        autoScrollManager = autoScrollReasoning(
          ".reasoning-content",
          ".reasoning-content>.inner-content"
        )
        autoScrollManager.initAutoScroll()
      }
      reasoningContent.update(() => text)
      // Perbarui scroll secara langsung
      if (autoScrollManager) {
        autoScrollManager.updateScroll()
      }
    }, 256)
    debouncedUpdate()
  }
  function finalizeMessage(
    text: string,
    hasError = false,
    errorMessage = ""
  ): void {
    isProcessing.set(false)
    if (autoScrollManager) {
      autoScrollManager.cleanup()
      autoScrollManager = null
    }
    processOnChatBuffer(text, "finish", true, {
      messageId,
      isRegenerate,
      hasError,
      errorMessage,
    })

    if (onProcessingDone) {
      onProcessingDone(text, messageId, isRegenerate, hasError, errorMessage)
    }
  }

  // Function to abort the completion process
  const abortController = new AbortController()
  export function abortCompletion(): void {
    abortController.abort()
  }

  async function fetchLLMCompletions(): Promise<void> {
    return await completion(
      provider,
      model,
      isRegenerate ? regenerateMessages : messages,
      messageId,
      conversation,
      finalizeMessage,
      updateMessage,
      //reasoning callback
      (text: string, token: string) => {
        // console.log(`Reasoning callback ${text} ${token}`)
        updateReasoningMessage(text, token)
      },
      //preview callback
      (text: string) => {
        updateMessage(text)
      },
      //error callback
      (text: string) => {
        finalizeMessage("", true, text)
      },
      isRegenerate,
      abortController
    )
    /*
    const now = Date.now()
    if (!oldRequestDate) {
      oldRequestDate = now
    }
    const differenceInMilliseconds = now - oldRequestDate

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
        messages: isRegenerate ? regenerateMessages : messages,
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
    const reader = response.body?.getReader()
    if (!reader) {
      updateMessage("Error: Unable to get response reader")
      return
    }
    let reasoningText = ""
    while (true) {
      let buffer = ""

      const { done, value } = await reader.read()
      if (done) {
        finalizeMessage()
        break
      }

      buffer += new TextDecoder().decode(value)

      for (const line of buffer.split("\n")) {
        if (!line) {
          continue
        }
        let resp
        try {
          resp = JSON.parse(line)
        } catch (error) {
          // Skip invalid JSON lines
          continue
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
              break

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
    }
      */
  }
  onMount(() => {})
  $: {
    if (isStreaming) {
      fetchLLMCompletions()
    } else {
      finalizeMessage("")
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
    <div class="space-y-3 inner-content mb-3">
      {#if $reasoning}
        <div class="flex flex-col gap-2 max-h-48 reasoning-container">
          <div class="reasoning-info">
            <i class="fa fa-spin fa-spinner"></i>
            <span class="ml-2">Thinking {$dotAnimation}</span>
          </div>
          <div class="reasoning-content nice-scrollbar overflow-y-auto">
            <div class="inner-content">
              <!-- <ReactAdapter
                el={AnimatedMarkdown}
                content={$reasoningContent}
                animation="fadeIn"
                animationDuration="0.5s"
                animationTimingFunction="ease-in-out"
                codeStyle={dracula}
                sep="word"
              /> -->
            </div>
          </div>
        </div>
      {/if}
      {#if $finalContent.length > 0}
        {#if $finalContent === "loading"}
          <LoadingIndicator />
        {:else}
          <ReactAdapter
            class="inner-content"
            el={AnimatedMarkdown}
            content={$finalContent}
            animation="fadeIn"
            animationDuration="0.5s"
            animationTimingFunction="ease-in-out"
            codeStyle={dracula}
            sep="word"
          />
        {/if}
      {/if}
    </div>
    <!-- End Card -->
  </div>
</li>
