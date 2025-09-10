import type { Writable } from "svelte/store"
import type { ChatMessageInterface } from "../types"
import type { GroupedChatMessagesInterface } from "../../../types"

interface OnChatBufferParams {
  data: any
  tempChatMessagesRef: any
  messageGroupId: Writable<string>
  groupedChatMessages: Writable<GroupedChatMessagesInterface>
  messageId: Writable<string>
  model: Writable<string>
  provider: Writable<string>
  tempChatMessageCls: Writable<string>
  tempMode: number
  assistantMessagePtr: ChatMessageInterface | null
}

export function onChatBuffer({
  data,
  tempChatMessagesRef,
  messageGroupId,
  groupedChatMessages,
  messageId,
  model,
  provider,
  tempChatMessageCls,
  tempMode,
  assistantMessagePtr,
}: OnChatBufferParams): {
  tempMode: number
  assistantMessagePtr: ChatMessageInterface | null
} {
  // Early return if tempChatMessagesRef is not available
  if (!tempChatMessagesRef) return { tempMode, assistantMessagePtr }

  const { text, t, complete, params } = data
  // console.log({ text, t, complete, params });

  // Get current values from stores
  const $messageGroupId = getStoreValue(messageGroupId)
  const $groupedChatMessages = getStoreValue(groupedChatMessages)
  const $messageId = getStoreValue(messageId)
  const $model = getStoreValue(model)
  const $provider = getStoreValue(provider)

  if ($messageGroupId.length > 0) {
    console.log({ messageGroupId: $messageGroupId })
    if (!Array.isArray($groupedChatMessages[$messageGroupId]))
      return { tempMode, assistantMessagePtr }

    if (tempMode === 0) {
      // INITIAL
      // append user message
      const userMessage = tempChatMessagesRef.getUserMessage()
      //@ts-ignore
      if (userMessage) {
        groupedChatMessages.update((current) => {
          const updated = { ...current }
          updated[$messageGroupId].push(userMessage)
          return updated
        })
      }
      // console.log({ userMessage });
      assistantMessagePtr = {
        role: "assistant",
        username: `${$model}:${$provider}`,
        content: "",
        id: $messageId, // Membuat ID unik untuk pesan
        parentId: userMessage?.id || "", // Menggunakan ID pesan pengguna sebagai parentId
        groupId: $messageGroupId, // Menggunakan groupId saat ini
      }
      // append assistant message
      if (assistantMessagePtr) {
        //@ts-ignore
        groupedChatMessages.update((current) => {
          const updated = { ...current }
          updated[$messageGroupId].push(assistantMessagePtr!)
          return updated
        })
      }

      // update groupedChatMessages
      tempChatMessageCls.set("hidden")
      tempMode = 1
    } else if (tempMode === 1) {
      // UPDATE
      //@ts-ignore
      if (assistantMessagePtr) {
        assistantMessagePtr.content = text
        groupedChatMessages.update((current) => {
          const updated = { ...current }
          // Find and update the assistant message
          const group = updated[$messageGroupId]
          if (group && assistantMessagePtr) {
            const messageIndex = group.findIndex(
              (msg: ChatMessageInterface) => msg.id === assistantMessagePtr!.id
            )
            if (messageIndex !== -1) {
              group[messageIndex] = { ...assistantMessagePtr }
            }
          }
          return updated
        })
      }
    }
  }

  if (complete) {
    tempMode = 0
    setTimeout(() => {
      tempChatMessageCls.set("")
    }, 3000)
  }

  return { tempMode, assistantMessagePtr }
}

// Helper function to get value from a writable store
function getStoreValue<T>(store: Writable<T>): T {
  let value: T | undefined
  const unsubscribe = store.subscribe((v) => {
    value = v
  })
  unsubscribe()
  return value as T
}
