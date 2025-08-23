// mockChatStream.ts
export function mockChatStream(
  input: string,
  delayBetweenChunks: number = 50
): Promise<Response> {
  // Example responses based on input
  const responses: Record<string, string> = {
    content:
      'Here\'s how to implement character-by-character typing animation in a Svelte component using TypeScript:\n\n```typescript\n<!-- TypedText.svelte -->\n<script lang="typescript">\n  export let text: string = "";\n  export let typingSpeed: number = 50;\n  export let showCursor: boolean = true;\n  \n  let displayedText: string = "";\n  let isTyping: boolean = false;\n  let typingTimeout: ReturnType<typeof setTimeout> | null = null;\n  \n  $: if (text && !isTyping) {\n    startTyping();\n  }\n  \n  function startTyping(): void {\n    displayedText = "";\n    isTyping = true;\n    \n    if (typingTimeout) clearTimeout(typingTimeout);\n    \n    typeNextChar(0);\n  }\n  \n  function typeNextChar(index: number): void {\n    if (index < text.length) {\n      displayedText += text[index];\n      \n      typingTimeout = setTimeout(() => {\n        typeNextChar(index + 1);\n      }, typingSpeed);\n    } else {\n      isTyping = false;\n    }\n  }\n  \n  import { onDestroy } from \'svelte\';\n  \n  onDestroy(() => {\n    if (typingTimeout) clearTimeout(typingTimeout);\n  });\n</script>\n\n<div class="typed-text">\n  <span>{displayedText}</span>\n  {#if showCursor && isTyping}\n    <span class="cursor">|</span>\n  {/if}\n</div>\n\n<style>\n  .typed-text {\n    display: inline-block;\n  }\n  \n  .cursor {\n    display: inline-block;\n    animation: blink 1s infinite;\n  }\n  \n  @keyframes blink {\n    0%, 100% { opacity: 1; }\n    50% { opacity: 0; }\n  }\n</style>\n```\n\nYou can use this component in your chat application like this:\n\n```typescript\n<!-- ChatMessage.svelte -->\n<script lang="typescript">\n  import TypedText from \'./TypedText.svelte\';\n  \n  export let message: string;\n  export let isTyping: boolean = true;\n</script>\n\n<div class="message">\n  {#if isTyping}\n    <TypedText text={message} typingSpeed={30} />\n  {:else}\n    <span>{message}</span>\n  {/if}\n</div>\n```\n\nWould you like me to explain or break down this code?',

    default:
      "This is a simulated streaming response. The text is being sent chunk by chunk to mimic a real chat API.",
    hello:
      "Hello there! Nice to meet you. I'm a simulated chat response that's streaming character by character.",
    help: "I can help answer questions, write code, or provide information on various topics. What would you like to know?",
  }

  // Choose response or use default
  const responseText = responses[input.toLowerCase()] || responses["content"]

  // Create a ReadableStream
  const stream = new ReadableStream({
    start(controller) {
      let index = 0

      function pushChunk() {
        if (index < responseText.length) {
          // Push 1-3 characters at a time to simulate varying chunk sizes
          const chunkSize = Math.floor(Math.random() * 3) + 1
          const end = Math.min(index + chunkSize, responseText.length)
          const chunk = responseText.slice(index, end)

          // Convert string to Uint8Array for the stream
          const encoder = new TextEncoder()
          controller.enqueue(encoder.encode(chunk))

          index = end
          setTimeout(pushChunk, delayBetweenChunks)
        } else {
          controller.close()
        }
      }

      // Start pushing chunks
      setTimeout(pushChunk, delayBetweenChunks)
    },
  })

  // Return a fake Response object with our stream
  return Promise.resolve(
    new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  )
}
