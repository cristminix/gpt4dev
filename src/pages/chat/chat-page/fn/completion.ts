import { getProviderApiKey } from "@/global/store/auth/getProviderApiKey"
import type { ChatMessageInterface } from "../types"
import { LLMCompletion } from "../classes/LLMChatCompletion"
import {
  Client,
  CorsProxyManager,
  Custom,
  PollinationsAI,
  DeepInfra,
  Together,
  Puter,
  HuggingFace,
} from "@/pages/chat/chat-page/classes/cors-proxy-manager/CorsProxyManager"
export async function completion(
  provider: string,
  model: string,
  messages: ChatMessageInterface[],
  messageId: string,
  conversationId: string,
  onFinalizeTextCallback: (text: string) => void,
  onUpdateMessageCallback: (text: string) => void,
  onReasoningCallback: (text: string, token: string) => void,
  onPreviewCallback: (text: string) => void,
  onErrorCallback: (text: string) => void,
  isRegenerate: boolean
) {
  const llmCompletion = new LLMCompletion()

  const liveProviders = [
    "PollinationsAI",
    "Puter",
    "Together",
    "DeepInfra",
    "HuggingFace",
  ]
  const liveProviderLabes = liveProviders.map((p) => `${p}-Live`)

  if (liveProviderLabes.includes(provider)) {
    // const apiUrl = "/api/backend-api/v2/conversation"
    let instance: any
    let models: []
    const providerName = provider.replace(/-Live$/, "")
    switch (providerName) {
      case "PollinationsAI":
        instance = new PollinationsAI()
        break
      case "Together":
        instance = new Together()
        break
      case "Puter":
        instance = new Puter()
        break
      case "DeepInfra":
        instance = new DeepInfra()
        break
    }
    console.log({ provider, instance, model })
    let fullText = ""
    let reasoningText = ""
    const stream = await instance.chat.completions.create({
      model,
      messages,
      stream: true,
    })

    try {
      for await (const chunk of stream) {
        // console.log(chunk) // Uncomment this line if you want to see each chunk

        // Handle the chunk based on its structure
        if (chunk.choices && chunk.choices[0]?.delta) {
          const delta = chunk.choices[0].delta

          // Handle content
          if (delta.content) {
            fullText += delta.content
            onUpdateMessageCallback(fullText)
          }

          // Handle reasoning content
          if (delta.reasoning_content) {
            reasoningText += delta.reasoning_content
            onReasoningCallback(reasoningText, delta.reasoning_content)
          }
        } else if (chunk.choices && chunk.choices[0]?.finish_reason) {
          // Handle finish
          onFinalizeTextCallback(fullText)
        }
      }
    } catch (error) {
      console.error("Stream error:", error)
      onErrorCallback("Stream error: " + (error as Error).message)
    }
    onFinalizeTextCallback(fullText)
    // throw new Error("")
    // return
  } else {
    llmCompletion.onFinalizeMessageCallback = onFinalizeTextCallback
    llmCompletion.onUpdateMessageCallback = onUpdateMessageCallback
    llmCompletion.onReasoningCallback = onReasoningCallback
    llmCompletion.onErroCallback = onErrorCallback
    llmCompletion.onPreviewCallback = onPreviewCallback
    return await llmCompletion.completion(
      provider,
      model,
      messages,
      messageId,
      conversationId,
      isRegenerate
    )
  }
}
