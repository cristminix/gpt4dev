import type {
  ChatMessageInterface,
  ConversationInterface,
} from "@/pages/chat/chat-page/types"
import { getCurrentUser } from "../auth/getCurrentUser"
import { CHAT_BACKEND_URL } from "../config"

export async function createConversation(conversation: ConversationInterface) {
  console.log(`Create conversation with ID: ${conversation.id}`, conversation)
  const currentUser = await getCurrentUser()
  const body = {
    id: conversation.id,
    title: conversation.title,
    created_at: Math.floor(Date.now() / 1000),
    updated_at: Math.floor(Date.now() / 1000),
    folder_id: "default",
    user_id: currentUser.id,
  }
  console.log("create conversation", { body })
  const response = await fetch(`${CHAT_BACKEND_URL}/llm/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`)
  }
  const data = await response.json()
  console.log("Create conversation response", data)
  let conversationRow = data.data || null
  return conversationRow
}
