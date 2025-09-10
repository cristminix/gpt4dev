import type { ChatMessageInterface, ConversationInterface } from "../types"
import type { Writable } from "svelte/store"
import { deleteChatMessage } from "@/global/store/conversation/deleteChatMessage"
import { deleteChatMessageGroupMesage } from "@/global/store/conversation/deleteChatMessageGroupMesage"

export async function deleteMessage(
  id: string,
  chatMessages: Writable<ChatMessageInterface[]>,
  $chatMessages: ChatMessageInterface[],
  $conversation: ConversationInterface | null,

  groupId: string
) {
  if (confirm("Item ini akan dihapus, yakin?")) {
    const indexToDelete = $chatMessages.findIndex((item) => item.id === id)
    if (indexToDelete > -1) {
      $chatMessages.splice(indexToDelete, 1)
    }
    chatMessages.update((o) => $chatMessages)
    if ($conversation) {
      // Convert id to number for API call if it's a string
      await deleteChatMessageGroupMesage(id, groupId)

      await deleteChatMessage($conversation.id, id)
    }
    // console.log($chatMessages)
  }
}
