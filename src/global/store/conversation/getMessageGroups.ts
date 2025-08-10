export async function getMessageGroups(conversationId: string) {
    try {
        const response = await fetch(
            `/llm/message-groups/conversation/${conversationId}`
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
