import { fetchChatBackendApi } from "@/global/fn/fetchChatBackendApi"
import { CHAT_BACKEND_URL } from "../config"

export async function getConversationCounts(userId: number) {
  try {
    const response = await fetchChatBackendApi(
      `${CHAT_BACKEND_URL}/llm/conversations/users/${userId}/counts`
    )

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(
        `Failed to fetch conversation counts: ${response.statusText}`
      )
    }

    const responseJson = await response.json()
    return responseJson.data?.count || 0
  } catch (error) {
    // console.error("Error fetching conversation counts:", error)
    throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
