import type {
  ChatMessageInterface,
  ConversationInterface,
} from "@/pages/chat/chat-page/types"
import { createProviderUsername } from "./createProviderUsername"

export async function createConversation(conversation: ConversationInterface) {
  console.log(`Create conversation with ID: ${conversation.id}`, conversation)
  const response = await fetch("/llm/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: conversation.id,
      title: conversation.title,
      created_at: conversation.createdAt || new Date().getTime(),
      updated_at: conversation.updatedAt || new Date().getTime(),
      folder_id: "default",
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
