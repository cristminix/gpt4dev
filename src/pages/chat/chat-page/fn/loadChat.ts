import type { ConversationInterface, ChatMessageInterface } from "../types"
import type { Writable } from "svelte/store"
import { getConversation } from "@/global/store/conversation/getConversation"
import { getChatMessages } from "@/global/store/conversation/getChatMessages"
import type { RouteApp } from "@/components/RouteApp.types"
import jquery from "jquery"
export async function loadChat(
  id: string,
  conversation: Writable<ConversationInterface | null>,
  chatMessages: Writable<ChatMessageInterface[]>,
  createNewChat: () => void,
  routeApp: RouteApp
) {
  conversation.update((o) => null)

  // console.log("load chat", id)
  if (id == "new") {
    createNewChat()
  } else {
    try {
      const conversationData = await getConversation(id)
      const chatMessagesData = await getChatMessages(id)
      conversation.update(() => conversationData)
      chatMessages.update(() => chatMessagesData)

      if(conversationData.enableSystemMessage){
        jquery("#systemPrompt").val(conversationData.systemMessage)
      }
    } catch (error) {
      alert("Chat not found or deleted!!")
      if (routeApp) {
        routeApp.setRoute(`/chat/new?reloadSidebar=${Date.now()}`)
      }
    }
  }

  // Note: The document title update will need to be handled in the component
  // since we don't have direct access to $conversation here
}
