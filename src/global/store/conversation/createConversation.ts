import type {
  ChatMessageInterface,
  ConversationInterface,
} from "@/pages/chat/chat-page/types"
import { getCurrentUser } from "../auth/getCurrentUser"

export async function createConversation(conversation: ConversationInterface) {
  console.log(`Create conversation with ID: ${conversation.id}`, conversation)
  const currentUser = await getCurrentUser()
  const response = await fetch("/llm/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: conversation.id,
      title: conversation.title,
      created_at: new Date(),
      updated_at: new Date(),
      folder_id: "default",
      user_id: currentUser.id,
    }),
  })
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`)
  }
  const data = await response.json()
  console.log("Create conversation response", data)
  let conversationRow = data.data || null
  return conversationRow
}
