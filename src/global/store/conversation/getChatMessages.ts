export async function getChatMessages(conversationId: string) {
  try {
    const response = await fetch(
      `/llm/conversations/${conversationId}/messages`
    )

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(`Failed to fetch chat messages: ${response.statusText}`)
    }

    const responseMessage = await response.json()
    let chatMessages = []
    console.log("getChatMessages responseMessage", responseMessage)
    if (responseMessage.data) {
      chatMessages = responseMessage.data.map((item: any) => {
        // const { message, participant } = item
        const row = item
        if (item.role === "assistant") {
          const [model, label] = item.username.split(":")
          row.provider = {
            label,
            model,
          }
        }

        return row
      })
    }
    return chatMessages
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
