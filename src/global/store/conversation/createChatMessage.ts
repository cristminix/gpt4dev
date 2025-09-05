import type { ChatMessageInterface } from "@/pages/chat/chat-page/types"
import { CHAT_BACKEND_URL } from "../config"

export async function createChatMessage(
  message: ChatMessageInterface,
  conversationId: string
) {
  // Initialize with the correct type
  console.log(`Create message : ${conversationId}`, message)

  const messageResponse = await fetch(
    `${CHAT_BACKEND_URL}/llm/messages/conversations/${conversationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }
  )
  if (!messageResponse.ok) {
    throw new Error(`Failed to create message: ${messageResponse.statusText}`)
  }
  const messageDataR = await messageResponse.json()
  const [messageData] = messageDataR.data
  return messageData
}
