import type { ChatMessageInterface, ConversationInterface } from "../types"
import type { Writable } from "svelte/store"
import { deleteChatMessage } from "@/global/store/conversation/deleteChatMessage"

export async function deleteMessage(
  id: string,
  chatMessages: Writable<ChatMessageInterface[]>,
  $chatMessages: ChatMessageInterface[],
  $conversation: ConversationInterface | null,
  deleteChatMessage: (
    conversationId: string,
    messageId: string
  ) => Promise<void>,
  confirm: (message: string) => boolean,
  console: Console
) {
  if (confirm("Item ini akan dihapus, yakin?")) {
    const indexToDelete = $chatMessages.findIndex((item) => item.id === id)
    if (indexToDelete > -1) {
      $chatMessages.splice(indexToDelete, 1)
    }
    chatMessages.update((o) => $chatMessages)
    if ($conversation) {
      // Convert id to number for API call if it's a string
      await deleteChatMessage($conversation.id, id)
    }
    console.log($chatMessages)
  }
}
