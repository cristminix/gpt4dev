import { CHAT_BACKEND_URL } from "../config"
import { fetchChatBackendApi } from "../../fn/fetchChatBackendApi"

export async function updateConversationTitle(conversation: any) {
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
        title: conversation.title,
        updated_at: conversation.updatedAt || new Date(),
      }),
    }
  )
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`)
  }
  const data = await response.json()
  // console.log("Create conversation response", data)
}
