import { CHAT_BACKEND_URL } from "../config"
import { fetchChatBackendApi } from "../../fn/fetchChatBackendApi"

export async function deleteChatMessage(conversationId: string, id: string) {
  try {
    const response = await fetchChatBackendApi(
      `${CHAT_BACKEND_URL}/llm/messages/conversations/${conversationId}/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(`Failed to delete message: ${response.statusText}`)
    }

    const responseMessage = await response.json()

    // console.log("deleteChatMessage responseMessage", responseMessage)

    return responseMessage.success
  } catch (error) {
    // console.error("Error deleting chat message:", error)
    // throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
