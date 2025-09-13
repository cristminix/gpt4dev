import { getProviderApiKey } from "@/global/store/auth/getProviderApiKey"
import { createMessageId } from "./createMessageId"
import { getTitleGenerationModelConfig } from "@/global/store/chat/getTitleGenerationModelConfig"
import { LLMCompletion } from "../classes/LLMChatCompletion"
import type { ChatMessageInterface } from "../types"

export async function makeUpConversationTitle(
  sourceContent: string,
  conversation: any
) {
  const prompt = `Please provide the answer to the following question without any additional context or explanations,
    Generate one title in the same language with a relevant emoji for this text: 
    ${sourceContent} 
   ,give one result only without quotes, make sure to include an emoji`
  return new Promise(async (resolve) => {
    const llmCompletion = new LLMCompletion()
    const defaultTitle = sourceContent.slice(0, 250)
    llmCompletion.onFinalizeMessageCallback = (text: string) => {
      resolve(text)
    }
    llmCompletion.onErroCallback = () => {
      resolve(defaultTitle)
    }

    const [provider, model] = getTitleGenerationModelConfig()[0]
    const apiKey = getProviderApiKey(provider)
    llmCompletion.setApiKey(apiKey)
    const messages = [
      {
        role: "user",
        content: prompt,
      },
    ] as ChatMessageInterface[]
    await llmCompletion.completion(
      provider,
      model,
      messages,
      createMessageId(),
      conversation,
      false
    )
  })
}
