import { CHAT_BACKEND_URL } from "../config"
import { fetchChatBackendApi } from "../../fn/fetchChatBackendApi"
import type { ConversationInterface } from "@/pages/chat/chat-page/types"

export async function updateConversation(conversation: ConversationInterface) {
  // Logic to update a conversation by its ID
  // console.log(
  //   `Updating conversation title with ID: ${conversation.id}`,
  //   conversation.title
  // )
  const response = await fetchChatBackendApi(
    `${CHAT_BACKEND_URL}/llm/conversations/${conversation.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(() => {
          const { id, ...rest } = conversation
          return {
            ...rest,
            updated_at: Math.floor(Date.now() / 1000),
          }
        })(),
      }),
    }
  )
  if (!response.ok) {
    throw new Error(`Failed to update conversation: ${response.statusText}`)
  }
  const data = await response.json()
  // console.log("Create conversation response", data)
}
