import { getProviderApiKey } from "@/global/store/auth/getProviderApiKey"
import type { ChatMessageInterface } from "../types"
import { LLMCompletion } from "../classes/LLMChatCompletion"

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
  const liveProviders = [
    "DeepInfra",
    "Puter",
    "PollinationsAI",
    "Together",
    "HuggingFace",
  ]
  if (!liveProviders.includes(provider)) {
    const apiUrl = "/api/backend-api/v2/conversation"
  }
  const llmCompletion = new LLMCompletion()
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
