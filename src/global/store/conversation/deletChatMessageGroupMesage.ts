export async function deletChatMessageGroupMesage(
  messageId: string,
  groupId: string
) {
  try {
    const response = await fetch(
      `/llm/message-group-messages/${groupId}/${messageId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(`Failed to delete message group message: ${response.statusText}`)
    }

    const responseMessage = await response.json()

    console.log("deletChatMessageGroupMesage responseMessage", responseMessage)

    return responseMessage.success
  } catch (error) {
    console.error("Error deleting message group message:", error)
    throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
