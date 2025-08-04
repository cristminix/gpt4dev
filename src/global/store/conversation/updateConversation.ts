import type {
  ChatMessageInterface,
  ConversationInterface,
} from "@/pages/chat/chat-page/types"
import { createProviderUsername } from "./createProviderUsername"

export async function updateConversation(
  conversation: ConversationInterface,
  chatMessagesData: ChatMessageInterface[]
) {
  // Logic to update a conversation by its ID
  console.log(`Updating conversation with ID: ${conversation.id}`, conversation)
  // Filter messages that need to be created (string IDs) and existing ones (number IDs)
  const messagesToCreate = chatMessagesData.filter(
    (item: ChatMessageInterface) => {
      return typeof item.id === "string" && item.id.length > 0
    }
  )
  const existingMessages = chatMessagesData.filter(
    (item: ChatMessageInterface) => {
      return typeof item.id === "number"
    }
  )

  // Map messages to the format expected by the API
  const apiMessages = messagesToCreate.map((item: ChatMessageInterface) => {
    return {
      content: item.content,
      participantUsername: item.provider
        ? createProviderUsername(item.provider)
        : "lalisa",
      participantRole: item.role,
    }
  })
  console.log("Messages to insert or update", apiMessages)
  let newChatMessagesData: ChatMessageInterface[] = existingMessages || []
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
      // Find the original message to get the role and other properties
      const originalMessage = messagesToCreate.find(
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
  return [conversation, newChatMessagesData]
}
