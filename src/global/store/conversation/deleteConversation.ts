export async function deleteConversation(conversationId: string) {
  try {
    const response = await fetch(`/llm/conversations/${conversationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Periksa apakah response berhasil
    if (!response.ok) {
      throw new Error(`Failed to delete conversation: ${response.statusText}`)
    }

    const result = await response.json()
    return result.success
  } catch (error) {
    console.error("Error deleting conversation:", error)
    throw error // Melempar error kembali agar dapat ditangani oleh pemanggil fungsi
  }
}
