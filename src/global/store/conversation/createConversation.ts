import { createProviderUsername } from "./createProviderUsername"

export async function createConversation(
  conversation: any,
  chatMessagesData: any[]
) {
  console.log(`Create conversation with ID: ${conversation.id}`, conversation)
  const response = await fetch("/llm/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: conversation.id,
      title: conversation.title,
      created_at: conversation.added,
      updated_at: conversation.updated,
    }),
  })
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`)
  }
  const data = await response.json()
  console.log("Create conversation response", data)
  let conversationRow = data.data || null

  let newMessages = chatMessagesData.filter((item: any) => {
    console.log("Checking message item", typeof item.id)
    return typeof item.id === "string" && item.id.length > 0
  })

  newMessages = chatMessagesData.map((item: any) => {
    return {
      content: item.content,

      participantUsername: item.provider
        ? createProviderUsername(item.provider)
        : "bob",
      participantRole: item.role,
    }
  })
  console.log("Messages to insert or update", newMessages)
  let newChatMessagesData = []
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
      newChatMessagesData = chatMessagesData || []
      newChatMessagesData.push({
        role: message.participantRole,
        content: message.content,
        created: new Date().toISOString(), // Assuming the server will handle the timestamp
        id: messageData.id, // Assuming the server returns the message ID
      })
    }
  }
  return [conversationRow, newChatMessagesData]
}
