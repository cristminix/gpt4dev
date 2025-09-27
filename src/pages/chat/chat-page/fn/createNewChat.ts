import { v1 } from "uuid"
import jquery from "jquery"
import { createMessageId } from "./createMessageId"
import type { ConversationInterface, ChatMessageInterface } from "../types"
import type { Writable } from "svelte/store"

export function createNewChat(
  conversation: Writable<ConversationInterface | null>,
  chatMessages: Writable<ChatMessageInterface[]>,
 
) {
    const systemMessage: string = jquery("#systemPrompt").val()
  
  const newConversation = {
    id: v1(),
    title: "New Conversation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    systemMessage,
    enableSystemMessage: true,
  }

  setTimeout(() => {
    jquery("#userInput").focus()
  }, 1000)

  conversation.update((o) => newConversation)
  chatMessages.update((o) => [
    {
      role: "assistant",
      content: "Ada yang bisa saya bantu ?",
      id: createMessageId(),
      username: "assistant",
      parentId: newConversation.id,
      groupId: ""
    },
  ])
}
