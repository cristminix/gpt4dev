import type {
  ChatMessageInterface,
  ConversationInterface,
} from "@/pages/chat/chat-page/types"
import { createProviderUsername } from "./createProviderUsername"

export async function createConversation(
  conversation: ConversationInterface,
  chatMessagesData: ChatMessageInterface[]
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
      created_at: conversation.added || new Date().toISOString(),
      updated_at: conversation.updated || new Date().toISOString(),
    }),
  })
  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`)
  }
  const data = await response.json()
  console.log("Create conversation response", data)
  let conversationRow = data.data || null
  let newMessages = chatMessagesData.filter((item: ChatMessageInterface) => {
    console.log("Checking message item", typeof item.id)
    return typeof item.id === "string" && item.id.length > 0
  })

  // Map messages to the format expected by the API
  const apiMessages = newMessages.map((item: ChatMessageInterface) => {
    return {
      content: item.content,
      participantUsername: item.provider
        ? createProviderUsername(item.provider)
        : "lalisa",
      participantRole: item.role,
    }
  })
  console.log("Messages to insert or update", apiMessages)

  // Initialize with the correct type
  let newChatMessagesData: ChatMessageInterface[] = []

  for (const message of apiMessages) {
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
      newChatMessagesData = [...chatMessagesData]
      // Find the original message to get the role
      const originalMessage = newMessages.find(
        (msg) =>
          msg.content === message.content &&
          msg.role === message.participantRole
      )
      newChatMessagesData.push({
        id: messageData.id,
        role: originalMessage ? originalMessage.role : "user",
        content: message.content,
        username: message.participantUsername,
      })
    }
  }
  return [conversationRow, newChatMessagesData]
}
