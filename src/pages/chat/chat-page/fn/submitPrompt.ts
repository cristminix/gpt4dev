import { createMessageId } from "./createMessageId"
import type { ChatMessageInterface } from "../types"
import type { Writable } from "svelte/store"

export function submitPrompt(
  userMessageContent: string,
  systemMessage: string,
  chatMessages: Writable<ChatMessageInterface[]>,
  messageTasks: Writable<Record<string, any>>,
  messageId: Writable<string>,
  userPrompt: Writable<string>,
  model: Writable<string>,
  provider: Writable<string>,
  promptMessages: Writable<ChatMessageInterface[]>,
  isProcessing: Writable<boolean>,
  chatConfig: any,
  params: { id?: string } | null,
  addMessageTask: (id: string) => void,
  getModelConfig: () => any,
  $chatMessages: ChatMessageInterface[],
  messageGroupId: Writable<string>,
  $messageGroupId: string
) {
  const { attachChatHistoryToUserPrompt } = chatConfig
  messageTasks.update(() => ({}));

  const id = createMessageId()
  messageId.update(() => id)
  addMessageTask(id)
  let messages = [
    {
      role: "user",
      content: userMessageContent,
      id: createMessageId(),
      username: "user",
    },
  ]

  let previousMessages: ChatMessageInterface[] = []
  let isNewConversation = params?.id === "new"
  if (!isNewConversation) {
    previousMessages = $chatMessages.filter((msg) => msg.role !== "system")
    if ($messageGroupId.length > 0) {
      console.log("must filter previous messages")
      previousMessages = previousMessages.filter(msg => msg.groupId === $messageGroupId)
    }
    messages = [
      ...previousMessages.map((message) => ({
        role: message.role,
        content: message.content,
        id: message.id as string,
        username: message.username,
      })),
      {
        role: "user",
        content: userMessageContent,
        id: createMessageId() as string,
        username: "user",
      },
    ]
  }
  if (systemMessage.length > 0) {
    messages.push({
      role: "system",
      content: systemMessage,
      id: createMessageId(),
      username: "system",
    })
  }
  if (attachChatHistoryToUserPrompt) {
    console.log("attachChatHistoryToUserPrompt is enabled")
    let messageHistory = ""
    if (!isNewConversation) {
      previousMessages = $chatMessages.filter((msg) => msg.role !== "system")
      if ($messageGroupId.length > 0) {
        console.log("must filter previous messages")
        previousMessages = previousMessages.filter(msg => msg.groupId === $messageGroupId)
      }
      messageHistory = `[Chat History]`
      previousMessages.forEach((message) => {
        messageHistory += `\n${message.role}: ${message.content}`
      })

      messages = [
        {
          role: "user",
          content: `${messageHistory}\n\n${userMessageContent}`,
          id: createMessageId(),
          username: "user",
        },
      ]
    }
  }

  console.log("onSubmitPrompt", userMessageContent, messages)
  // return
  userPrompt.update(() => userMessageContent)
  const modelConfig = getModelConfig()
  model.update(() => modelConfig.model)
  provider.update(() => modelConfig.provider)
  // @ts-ignore
  promptMessages.update(() => messages)
  console.log("submit prompt", userMessageContent)
  console.log(modelConfig)
  isProcessing.update(() => false)
  setTimeout(() => {
    isProcessing.update(() => true)
  }, 256)
}
