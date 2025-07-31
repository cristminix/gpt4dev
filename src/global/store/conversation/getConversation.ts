// import { getChatMessages } from "./getChatMessages"

export async function getConversation(id: string) {
  const response = await fetch(`/llm/conversations/${id}`).then((res) =>
    res.json()
  )
  console.log("getConversation response", response)
  if (response.data) {
    let conversation = response.data
    // conversation.items = await getChatMessages(id)
    return conversation
  }

  return null // Return null if no conversation found with the given ID
}
