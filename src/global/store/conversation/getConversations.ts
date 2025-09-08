import { CHAT_BACKEND_URL } from "../config"
import { fetchChatBackendApi } from "../../fn/fetchChatBackendApi"

export async function getConversations(userId: number) {
  try {
    const response = await fetchChatBackendApi(
      `${CHAT_BACKEND_URL}/llm/conversations/users/${userId}`
    )

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.statusText}`)
    }

    const responseJson = await response.json()
    return responseJson.data || []
  } catch (error) {
    console.error("Error fetching conversations:", error)
    throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
