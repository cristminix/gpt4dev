import { getProviderApiKey } from "@/global/store/auth/getProviderApiKey"
import type { ChatMessageInterface, ConversationInterface } from "../types"
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
  conversation: ConversationInterface,
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
      case "HuggingFace":
        instance = new HuggingFace({ apiKey: getProviderApiKey(providerName) })
        break
    }
    console.log({ provider, instance, model })
    let fullText = ""
    let reasoningText = ""
    let stream
    //@ts-ignore
    let systemMessages: any[] = []
    let processedMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => {
        return {
          role: m.role,
          content: m.content,
        }
      })
    const COMBINE_SYSTEM_MESSAGE_TO_LAST_USER_MESSAGE = false
    if (COMBINE_SYSTEM_MESSAGE_TO_LAST_USER_MESSAGE) {
      systemMessages = messages
        .filter((m) => m.role === "system" && m.content.length > 0)
        .map((m) => {
          return {
            role: m.role,
            content: m.content,
          }
        })

      let lastMessage = processedMessages[processedMessages.length - 1]
      if (lastMessage.role === "user") {
        if (typeof lastMessage.content === "string") {
          if (systemMessages.length > 0) {
            lastMessage.content = `System: ${systemMessages[0].content}\n${lastMessage.content}`
          }
        }
      }
    }

    try {
      stream = await instance.chat.completions.create({
        model,
        messages: [...systemMessages, ...processedMessages],
        stream: true,
      })
    } catch (error) {
      onErrorCallback("Error" + error)
      return
    }

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
      conversation,
      isRegenerate
    )
  }
}
