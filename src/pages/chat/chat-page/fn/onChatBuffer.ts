import type { ChatMessageInterface, ConversationInterface } from "../types"
import type { GroupedChatMessagesInterface } from "../../../types"

// Helper function to initialize chat state
export function ocbInitializeChatState(
  params: { id?: string } | null,
  newChat: number,
  setNewChat: (value: number) => void,
  setChatIsNew: (value: boolean) => void
) {
  if (newChat === 0) {
    setNewChat(params?.id === "new" ? 1000 : 1002)
  }

  if (newChat === 1000) {
    setNewChat(1003)
    setChatIsNew(true)
    return true
  }

  if (newChat === 1002) {
    setNewChat(1003)
    return true
  }

  return false
}

// Helper function to validate message group
export function ocbIsValidMessageGroup(
  groupedChatMessages: GroupedChatMessagesInterface,
  messageGroupId: string
) {
  return Array.isArray(groupedChatMessages[messageGroupId])
}

// Helper function to setup initial chat buffer
export function ocbSetupChatBuffer(
  tempChatMessageCls: any, // Writable<string>
  setTempMode: (value: number) => void
) {
  tempChatMessageCls.update(() => "hidden")
  setTempMode(1)
}

// Helper function to find assistant message
export function ocbFindAssistantMessage(
  assistantMessagePtr: ChatMessageInterface | undefined,
  setAssistantMessagePtr: (value: ChatMessageInterface | undefined) => void,
  chatMessages: ChatMessageInterface[],
  lastGeneratedAssistantMessageId: string
) {
  if (!assistantMessagePtr) {
    const foundMessage = chatMessages.find(
      (m) => m.id === lastGeneratedAssistantMessageId && m.role === "assistant"
    ) as ChatMessageInterface
    setAssistantMessagePtr(foundMessage)
    return foundMessage
  }
  return assistantMessagePtr
}

// Helper function to update grouped chat messages
export function ocbUpdateGroupedChatMessages(
  messageId: string,
  content: string,
  groupedChatMessages: GroupedChatMessagesInterface,
  messageGroupId: string,
  updateGroupedChatMessagesStore: (value: GroupedChatMessagesInterface) => void
) {
  // Create new object reference to trigger reactivity
  const updatedGrouped = { ...groupedChatMessages }
  const groupMessages = [...(updatedGrouped[messageGroupId] || [])]

  // Find and update the assistant message
  const messageIndex = groupMessages.findIndex((msg) => msg.id === messageId)

  if (messageIndex !== -1) {
    groupMessages[messageIndex] = {
      ...groupMessages[messageIndex],
      content,
    }
    updatedGrouped[messageGroupId] = groupMessages
    updateGroupedChatMessagesStore(updatedGrouped)
  }
}

// Helper function to update message with debouncing
export function ocbUpdateAssistantMessageContent(
  text: string,
  assistantMessagePtr: ChatMessageInterface | undefined,
  setAssistantMessagePtr: (value: ChatMessageInterface | undefined) => void,
  chatMessages: ChatMessageInterface[],
  lastGeneratedAssistantMessageId: string,
  updateTimeouts: Map<string, number>,
  groupedChatMessages: GroupedChatMessagesInterface,
  messageGroupId: string,
  updateGroupedChatMessagesStore: (value: GroupedChatMessagesInterface) => void
) {
  const assistantMessage = ocbFindAssistantMessage(
    assistantMessagePtr,
    setAssistantMessagePtr,
    chatMessages,
    lastGeneratedAssistantMessageId
  )

  if (assistantMessage?.id && text.length > 0) {
    assistantMessage.content = text

    // Clear any existing timeout for this message
    const existingTimeoutId = updateTimeouts.get(assistantMessage.id)
    if (existingTimeoutId) {
      clearTimeout(existingTimeoutId)
    }

    // Set new timeout to update the UI
    const UI_UPDATE_DELAY_MS = 15
    const newTimeoutId = window.setTimeout(() => {
      ocbUpdateGroupedChatMessages(
        assistantMessage.id!,
        text,
        groupedChatMessages,
        messageGroupId,
        updateGroupedChatMessagesStore
      )
      // Clean up the timeout reference
      updateTimeouts.delete(assistantMessage.id!)
    }, UI_UPDATE_DELAY_MS)

    updateTimeouts.set(assistantMessage.id, newTimeoutId)
  }
}

// Helper function to handle completion
export function ocbHandleCompletion(
  setTempMode: (value: number) => void,
  setNewChat: (value: number) => void,
  chatIsNew: boolean,
  setChatIsNew: (value: boolean) => void,
  conversation: ConversationInterface | null,
  setAssistantMessagePtr: (value: ChatMessageInterface | undefined) => void,
  tempChatMessageCls: any, // Writable<string>
  lastChatId: string,
  setLastChatId: (value: string) => void
) {
  setTempMode(0)
  setNewChat(0)

  if (chatIsNew) {
    setChatIsNew(false)
    // @ts-ignore
    setLastChatId(conversation?.id || "")
  }

  // @ts-ignore
  setAssistantMessagePtr(undefined)

  const TEMP_CHAT_MESSAGE_VISIBILITY_DELAY_MS = 3000
  setTimeout(() => {
    tempChatMessageCls.update(() => "")
  }, TEMP_CHAT_MESSAGE_VISIBILITY_DELAY_MS)
}
