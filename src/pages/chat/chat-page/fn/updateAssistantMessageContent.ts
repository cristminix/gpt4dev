import type { Writable } from "svelte/store"
import type { ChatMessageInterface } from "../types"

export function updateAssistantMessageContent(
  content: string,
  groupedChatMessages: Writable<Record<string, ChatMessageInterface[]>>,
  $groupedChatMessages: Record<string, ChatMessageInterface[]>,
  $messageGroupId: string,
  assistantMessageId: string
) {
  const updatedGrouped = { ...$groupedChatMessages }
  const groupMessages = [...(updatedGrouped[$messageGroupId] || [])]
  // Find and update the assistant message
  let messageIndex = groupMessages.findIndex(
    (msg: any) => msg.id === assistantMessageId
  )
  if (messageIndex < 0) {
    messageIndex = groupMessages.length - 1
  }
  console.log({ content, messageIndex, message: groupMessages[messageIndex] })

  if (messageIndex !== -1) {
    groupMessages[messageIndex] = {
      ...groupMessages[messageIndex],
      content,
    }
    updatedGrouped[$messageGroupId] = groupMessages
  }
  // console.log({ updatedGrouped })
  groupedChatMessages.update(() => updatedGrouped)
}
