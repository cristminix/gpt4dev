import { CHAT_BACKEND_URL } from "../config"
// import { getChatMessages } from "./getChatMessages"
import { fetchChatBackendApi } from "../../fn/fetchChatBackendApi"

export async function getConversation(id: string) {
  try {
    const response = await fetchChatBackendApi(
      `${CHAT_BACKEND_URL}/llm/conversations/${id}`
    )

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText}`)
    }

    const responseJson = await response.json()
    console.log("getConversation response", responseJson)
    if (responseJson.data) {
      let conversation = responseJson.data
      // conversation.items = await getChatMessages(id)
      return conversation
    }

    return null // Return null if no conversation found with the given ID
  } catch (error) {
    console.error("Error fetching conversation:", error)
    throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
