import type { ChatMessageInterface } from "@/pages/chat/chat-page/types"

export async function createChatMessage(
  message: ChatMessageInterface,
  conversationId: string
) {
  // Initialize with the correct type

  const messageResponse = await fetch(
    `/llm/conversations/${conversationId}/messages`,
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
