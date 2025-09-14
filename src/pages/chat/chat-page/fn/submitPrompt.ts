import { createMessageId } from "./createMessageId"
import type { ChatMessageInterface, ConversationInterface } from "../types"
import type { Writable } from "svelte/store"
import { v1 } from "uuid"
import { getCurrentUser } from "@/global/store/auth/getCurrentUser"
import {
  createUserMessage,
  createSystemMessage,
  createAssistantMessage,
} from "./createMessage"
function preSubmitPrompt(
  isNewConversation: boolean,
  messages: ChatMessageInterface[]
) {
  console.log({ isNewConversation, messages })
}
export async function submitPrompt(
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
  $messageGroupId: string,
  lastGeneratedAssistantMessageId: Writable<string>,
  $conversation: ConversationInterface | null,
  messageGroupIds: Writable<string[]>
) {
  if (!$conversation) return
  let isNewConversation = params?.id === "new"
  const currentUser = await getCurrentUser()

  const { attachChatHistoryToUserPrompt } = chatConfig
  messageTasks.update(() => ({}))
  let groupId = isNewConversation ? v1() : $messageGroupId
  const modelConfig = getModelConfig()

  // const id = createMessageId()
  const newUserMessageId = createMessageId()
  const newAssistantMessageId = createMessageId()
  // const newSystemMessageId = createMessageId()
  messageId.update(() => newUserMessageId)
  lastGeneratedAssistantMessageId.update(() => newAssistantMessageId)
  addMessageTask(newUserMessageId)

  let userMessage = createUserMessage(
    newUserMessageId,
    userMessageContent,
    currentUser.username,
    groupId,
    $conversation.id
  )
  let assistantMessage = createAssistantMessage(
    newAssistantMessageId,
    "",
    `${modelConfig.model}:${modelConfig.provider}`,
    groupId,
    newUserMessageId
  )
  let messages: ChatMessageInterface[] = [userMessage]

  let previousMessages: ChatMessageInterface[] = []
  if (!isNewConversation) {
    previousMessages = $chatMessages.filter((msg) => msg.role !== "system")
    if ($messageGroupId.length > 0) {
      console.log("must filter previous messages")
      previousMessages = previousMessages.filter(
        (msg) => msg.groupId === $messageGroupId
      )
    }
    userMessage = createUserMessage(
      newUserMessageId,
      userMessageContent,
      currentUser.username,
      groupId,
      previousMessages[previousMessages.length - 1].id
    )

    assistantMessage = createAssistantMessage(
      newAssistantMessageId,
      "",
      `${modelConfig.model}:${modelConfig.provider}`,
      groupId,
      newUserMessageId
    )
    //@ts-ignore
    messages = [...previousMessages, userMessage]
  }
  if (systemMessage.length > 0) {
    messages.push(
      createSystemMessage(
        createMessageId(),
        systemMessage,
        "system",
        groupId,
        $conversation.id
      )
    )
  }
  if (attachChatHistoryToUserPrompt) {
    console.log("attachChatHistoryToUserPrompt is enabled")
    let messageHistory = ""
    if (!isNewConversation) {
      previousMessages = $chatMessages.filter((msg) => msg.role !== "system")
      if ($messageGroupId.length > 0) {
        console.log("must filter previous messages")
        previousMessages = previousMessages.filter(
          (msg) => msg.groupId === $messageGroupId
        )
      }
      messageHistory = `[Chat History]`
      previousMessages.forEach((message) => {
        messageHistory += `\n${message.role}: ${message.content}`
      })
      userMessage = createUserMessage(
        newUserMessageId,
        userMessageContent,
        currentUser.username,
        groupId,
        previousMessages[previousMessages.length - 1].id
      )

      assistantMessage = createAssistantMessage(
        newAssistantMessageId,
        "",
        `${modelConfig.model}:${modelConfig.provider}`,
        groupId,
        newUserMessageId
      )
      messages = [
        createUserMessage(
          newUserMessageId,
          `${messageHistory}\n\n${userMessageContent}`,
          currentUser.username,
          groupId,
          previousMessages[previousMessages.length - 1].id
        ),
      ]
    }
  }

  preSubmitPrompt(isNewConversation, messages)

  // console.log("onSubmitPrompt", userMessageContent, messages)
  // return
  userPrompt.update(() => userMessageContent)
  model.update(() => modelConfig.model)
  provider.update(() => modelConfig.provider)
  // @ts-ignore
  promptMessages.update(() => messages)
  // console.log("submit prompt", userMessageContent)
  // console.log(modelConfig)
  isProcessing.update(() => false)

  // update
  if (isNewConversation) {
    messageGroupIds.update(() => [groupId])
    messageGroupId.update(() => groupId)
    chatMessages.update(() => [userMessage, assistantMessage])
  } else {
    const chatMessagesSet = [...$chatMessages, userMessage, assistantMessage]

    //@ts-ignore
    chatMessages.update(() => chatMessagesSet)
  }
  setTimeout(() => {
    isProcessing.update(() => true)
  }, 25)
}
