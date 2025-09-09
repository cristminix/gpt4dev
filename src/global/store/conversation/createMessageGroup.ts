import { CHAT_BACKEND_URL } from "../config"
import { fetchChatBackendApi } from "../../fn/fetchChatBackendApi"

export async function createMessageGroup(
  groupId: string,
  conversationId: string
) {
  try {
    const response = await fetchChatBackendApi(
      `${CHAT_BACKEND_URL}/llm/message-groups`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: groupId,
          conversationId,
        }),
      }
    )

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(`Failed to create message group: ${response.statusText}`)
    }

    const jsonResponse = await response.json()
    let [messageGroup] = jsonResponse.data || []
    // console.log("createMessageGroup jsonResponse", jsonResponse)

    return messageGroup
  } catch (error) {
    // console.error("Error creating message group:", error)
    throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
