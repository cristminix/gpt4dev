export async function deleteConversation(conversationId: string) {
  const response = await fetch(`/llm/conversations/${conversationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`)
  }
  const result = await response.json()
  return result.success
}
