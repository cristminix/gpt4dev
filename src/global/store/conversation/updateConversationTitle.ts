import { CHAT_BACKEND_URL } from "../config"
import { fetchChatBackendApi } from "../../fn/fetchChatBackendApi"

export async function updateConversationTitle(id: string, title: string) {
  // Logic to update a conversation by its ID
  // console.log(
  //   `Updating conversation title with ID: ${conversation.id}`,
  //   conversation.title
  // )
  const response = await fetchChatBackendApi(
    `${CHAT_BACKEND_URL}/llm/conversations/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        updated_at: Math.floor(Date.now() / 1000),
      }),
    }
  )
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`)
  }
  const data = await response.json()
  // console.log("Create conversation response", data)
}
