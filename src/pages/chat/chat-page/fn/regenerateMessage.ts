import type { ChatMessageInterface } from "../types"
import { getModelConfig } from "@/global/store/chat/getModelConfig"
import { createMessageId } from "./createMessageId"
import { v1 } from "uuid"
import jquery from "jquery"
import type { Writable } from "svelte/store"

export async function onRegenerateMessage(
  message: ChatMessageInterface,
  lastMessageId: Writable<string>,
  chatMessages: Writable<ChatMessageInterface[]>,
  $chatMessages: ChatMessageInterface[],
  messageGroupId: Writable<string>,
  $messageGroupId: string,
  groupedChatMessages: Writable<Record<string, ChatMessageInterface[]>>,
  $groupedChatMessages: Record<string, ChatMessageInterface[]>,
  regeneratePromptMessages: Writable<ChatMessageInterface[]>,
  messageTasks: Writable<Record<string, any>>,
  $messageTasks: Record<string, any>,
  messageId: Writable<string>,
  userPrompt: Writable<string>,
  model: Writable<string>,
  provider: Writable<string>,
  isProcessing: Writable<boolean>,
  isRegenerate: Writable<boolean>,
  useLastMessageId: Writable<boolean>,
  $useLastMessageId: boolean,
  addMessageTask: (id: string) => void
) {
  console.log("regenerate message", { message })
  let messageToResend: ChatMessageInterface = message
  lastMessageId.update(() => messageToResend.id)
  // chek if provider and model are same
  const modelConfig = getModelConfig()

  let useSameProviderAndModel = false
  let dontCreateMessageGroup = false
  let dontAppendMessages = false
  const [lastModel, lastProvider] = message.username.split(":")
  if (
    modelConfig.model === lastModel &&
    modelConfig.provider === lastProvider
  ) {
    useSameProviderAndModel = true
    dontCreateMessageGroup = true
    dontAppendMessages = true
  }
  // console.log({ useSameProviderAndModel })
  // return
  // check if assistant message
  if (message.role != "user") {
    const [realMessage] = $chatMessages.filter(
      (msg) => msg.id === message.parentId
    )
    messageToResend = realMessage
  }
  if (messageToResend) {
    console.log({ messageToResend })
  }
  let previousMessage: ChatMessageInterface[] = []
  for (const msg of $chatMessages.filter((msg) => msg.role !== "system")) {
    previousMessage.push({ ...msg })
  }
  if ($messageGroupId.length > 0) {
    previousMessage = []
    for (const msg of $groupedChatMessages[$messageGroupId]) {
      previousMessage.push({ ...msg })
    }
  }

  // console.log({ previousMessage });

  // trim messages data
  const msgIndex = previousMessage.findIndex(
    (item) => item.id === messageToResend.id
  )
  if (msgIndex > -1) {
    //@ts-ignore
    const messagesInRange: ChatMessageInterface[] = []
    for (const msg of previousMessage.slice(0, msgIndex + 1)) {
      messagesInRange.push({ ...msg })
    }
    const systemMessage: string = jquery("#chatPrompt").val()
    let messagesToSendInConversation: ChatMessageInterface[] = []
    const systemMessages = []
    if (systemMessage.length > 0) {
      systemMessages.push({
        role: "system",
        content: systemMessage,
        id: createMessageId(),
        username: "system",
        parentId: "",
        groupId: "",
      })
    }
    messagesToSendInConversation = [...systemMessages, ...messagesInRange]
    console.log({ messagesToSendInConversation })
    // regeneratePromptMessages.update(()=>[])
    //@ts-ignore
    // regeneratePromptMessages.update(() => messagesToSendInConversation)
    const newGroupId = v1()
    // test append message with new groupId
    const messagesToAppend = [
      ...systemMessages,
      ...messagesInRange.map((msg) => {
        const newMsg = { ...msg }

        if (!useSameProviderAndModel) newMsg.groupId = newGroupId
        return newMsg
      }),
    ]

    if (!useSameProviderAndModel) {
      // create new message group
      useLastMessageId.update(() => false)

      chatMessages.update((o: ChatMessageInterface[]) => {
        const messages = [...o, ...messagesToAppend]
        // console.log({ messages });
        return messages
      })
      messageGroupId.update(() => newGroupId)
      console.log({
        messagesInRange,
        //   messagesToSendInConversation,
        messagesToAppend,
        //   chatMessages: $chatMessages,
      })
    } else {
      useLastMessageId.update(() => true)
    }

    // console.log("onSubmitPrompt", userMessageContent, messages);
    // return
    // const id = createMessageId()
    // setTimeout(() => {
    messageTasks.update(() => ({}))
    messageId.update(() => messageToResend.id)
    addMessageTask(messageToResend.id)

    userPrompt.update(() => messageToResend.content)
    model.update(() => modelConfig.model)
    provider.update(() => modelConfig.provider)
    // @ts-ignore
    regeneratePromptMessages.update(() => messagesToAppend)
    console.log("submit prompt", messageToResend.content)
    console.log(modelConfig)
    isProcessing.update(() => false)
    isRegenerate.update(() => true)
    setTimeout(() => {
      isProcessing.update(() => true)
    }, 256)
    // }, 1000);
  }
}
