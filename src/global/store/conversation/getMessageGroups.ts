import { CHAT_BACKEND_URL } from "../config"

export async function getMessageGroups(conversationId: string) {
  try {
    const response = await fetch(
      `${CHAT_BACKEND_URL}/llm/message-groups/conversation/${conversationId}`
    )

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(`Failed to fetch message groups: ${response.statusText}`)
    }

    const jsonResponse = await response.json()
    let messageGroups = jsonResponse.data || []
    console.log("getMessageGroups jsonResponse", jsonResponse)

    return messageGroups
  } catch (error) {
    console.error("Error fetching message groups:", error)
    throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
