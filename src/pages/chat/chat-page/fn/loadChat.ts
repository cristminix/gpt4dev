import type { ConversationInterface, ChatMessageInterface } from "../types"
import type { Writable } from "svelte/store"
import { getConversation } from "@/global/store/conversation/getConversation"
import { getChatMessages } from "@/global/store/conversation/getChatMessages"

export async function loadChat(
  id: string,
  conversation: Writable<ConversationInterface | null>,
  chatMessages: Writable<ChatMessageInterface[]>,
  createNewChat: () => void
) {
  conversation.update((o) => null)

  console.log("load chat", id)
  if (id == "new") {
    createNewChat()
  } else {
    const conversationData = await getConversation(id)
    const chatMessagesData = await getChatMessages(id)
    conversation.update(() => conversationData)
    chatMessages.update(() => chatMessagesData)
  }

  // Note: The document title update will need to be handled in the component
  // since we don't have direct access to $conversation here
}
