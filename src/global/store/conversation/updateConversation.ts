import { createProviderUsername } from "./createProviderUsername"

export async function updateConversation(
  conversation: any,
  chatMessagesData: any[]
) {
  // Logic to update a conversation by its ID
  console.log(`Updating conversation with ID: ${conversation.id}`, conversation)
  let newMessages = chatMessagesData.filter((item: any) => {
    return typeof item.id === "string" && item.id.length > 0
  })
  let lastMessages = chatMessagesData.filter((item: any) => {
    return typeof item.id === "number"
  })
  newMessages = newMessages.map((item: any) => {
    return {
      content: item.content,

      participantUsername: item.provider
        ? createProviderUsername(item.provider)
        : "lalisa",
      participantRole: item.role,
    }
  })
  console.log("Messages to insert or update", newMessages)
  let newChatMessagesData = lastMessages || []
  for (const message of newMessages) {
    const messageResponse = await fetch(
      `/llm/conversations/${conversation.id}/messages`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      }
    )
    if (!messageResponse.ok) {
      throw new Error(`Failed to create message: ${messageResponse.statusText}`)
    }
    const messageDataR = await messageResponse.json()
    const [messageData] = messageDataR.data || []
    console.log("Create message response", messageData)
    if (messageData) {
      newChatMessagesData.push({
        role: message.participantRole,
        content: message.content,
        createdAt: message.createdAt, // Assuming the server will handle the timestamp
        id: messageData.id, // Assuming the server returns the message ID
      })
    }
  }
  return [conversation, newChatMessagesData]
}
