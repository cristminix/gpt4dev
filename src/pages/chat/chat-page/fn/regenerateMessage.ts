import type { ChatMessageInterface } from "../types"
import { getModelConfig } from "@/global/store/chat/getModelConfig"
import { createMessageId } from "./createMessageId"
import { v1 } from "uuid"
import jquery from "jquery"
import type { Writable } from "svelte/store"
import { isImageModel } from "@/global/store/chat/isImageModel"
function shouldRegenerateUsingSameModelProvider(
  sourceAssistantMessage: ChatMessageInterface,
  modelConfig: any
) {
  let useSameProviderAndModel = false
  let dontCreateMessageGroup = false
  let dontAppendMessages = false

  const [lastModel, lastProvider] = sourceAssistantMessage.username.split(":")
  if (
    modelConfig.model === lastModel &&
    modelConfig.provider === lastProvider &&
    !isImageModel(modelConfig.model)
  ) {
    useSameProviderAndModel = true
    dontCreateMessageGroup = true
    dontAppendMessages = true
  }
  return [false, dontCreateMessageGroup, dontAppendMessages]
  // return [useSameProviderAndModel, dontCreateMessageGroup, dontAppendMessages]
}
function getUserMessageToGenerate(
  sourceAssistantMessage: ChatMessageInterface,
  $groupedChatMessages: Record<string, ChatMessageInterface[]>,
  $messageGroupId: string
) {
  return $groupedChatMessages[$messageGroupId].find(
    (m) => m.id === sourceAssistantMessage.parentId
  )
}

function getPreviousChatMessages(
  $chatMessages: ChatMessageInterface[],
  $groupedChatMessages: Record<string, ChatMessageInterface[]>,
  $messageGroupId: string
) {
  let previousChatMessages: ChatMessageInterface[] = []
  // POPULATE PREVIOUS MESSAGES

  if ($messageGroupId.length > 0) {
    previousChatMessages = []
    for (const msg of $groupedChatMessages[$messageGroupId]) {
      previousChatMessages.push({ ...msg })
    }
  } else {
    // for (const msg of $chatMessages.filter((msg) => msg.role !== "system")) {
    //   previousChatMessages.push({ ...msg })
    // }
  }
  return previousChatMessages
}
function populateRegenerateChatMessages(
  previousChatMessages: ChatMessageInterface[],
  useSameProviderAndModel: boolean,
  newGroupId: string,
  assistantMessageIndex: number
) {
  //@ts-ignore
  const messagesInRange: ChatMessageInterface[] = []
  for (const msg of previousChatMessages.slice(0, assistantMessageIndex + 1)) {
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
  // console.log({ messagesToSendInConversation })
  // regeneratePromptMessages.update(()=>[])
  //@ts-ignore
  // regeneratePromptMessages.update(() => messagesToSendInConversation)
  // test append message with new groupId
  const regenerateChatMessages = [
    ...systemMessages,
    ...messagesInRange.map((msg) => {
      const newMsg = { ...msg }

      if (!useSameProviderAndModel) newMsg.groupId = newGroupId
      return newMsg
    }),
  ]
  return regenerateChatMessages
}
export async function onRegenerateMessage(
  sourceAssistantMessage: ChatMessageInterface,
  lastGeneratedAssistantMessageId: Writable<string>,
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
  regenerateUsingSameModelProvider: Writable<boolean>,
  $regenerateUsingSameModelProvider: boolean,
  addMessageTask: (id: string) => void,
  messageGroupIds: Writable<string[]>,
  $messageGroupIds: string[]
) {
  // 0 . check source message
  if (!sourceAssistantMessage) {
    alert("User assistant message to regenerate is not available !")
    return
  }
  // - invalid impl : in this line lastGeneratedAssistantMessageId.update(() => assistantMessageToRegenerate.id)
  //
  // 1. copy assistant message that want to regenerate
  let assistantMessageToRegenerate: ChatMessageInterface = {
    ...sourceAssistantMessage,
  }
  console.log({ assistantMessageToRegenerate })
  // 2. chek if provider and model are same
  // 2.1 get current modelConfig
  const modelConfig = getModelConfig()

  const [useSameProviderAndModel, dontCreateMessageGroup, dontAppendMessages] =
    shouldRegenerateUsingSameModelProvider(
      assistantMessageToRegenerate,
      modelConfig
    )
  regenerateUsingSameModelProvider.update(() => useSameProviderAndModel)
  messageTasks.update(() => ({}))

  let userMessageToRegenerate: ChatMessageInterface | undefined =
    getUserMessageToGenerate(
      sourceAssistantMessage,
      $groupedChatMessages,
      $messageGroupId
    )
  if (!userMessageToRegenerate) {
    alert("User message to regenerate is not available !")
    return
  }
  let previousChatMessages: ChatMessageInterface[] = getPreviousChatMessages(
    $chatMessages,
    $groupedChatMessages,
    $messageGroupId
  )

  // console.log({ previousMessage });
  // const assistantMessageToRegenerateId = "0000-0000-0000-0000"
  // trim messages data
  const assistantMessageIndex = previousChatMessages.findIndex(
    (item) => item.id === assistantMessageToRegenerate.id
  )
  const validAssistantMessageInRange = assistantMessageIndex > -1
  if (validAssistantMessageInRange) {
    const newGroupId = v1()
    let copiedGroupMessages: ChatMessageInterface[] = []
    const regenerateChatMessages = [
      ...populateRegenerateChatMessages(
        previousChatMessages,
        useSameProviderAndModel,
        newGroupId,
        assistantMessageIndex
      ),
    ]
    if (!useSameProviderAndModel) {
      copiedGroupMessages = [...regenerateChatMessages].filter(
        (msg) => msg.role !== "system"
      )
    }
    // remove last assistantMessage
    regenerateChatMessages.pop()

    if (!useSameProviderAndModel) {
      // update copied messages group id
      copiedGroupMessages = copiedGroupMessages.map((m) => {
        m.groupId = newGroupId
        return m
      })

      const lastAssistantMessage =
        copiedGroupMessages[copiedGroupMessages.length - 1]
      lastAssistantMessage.username = `${modelConfig.model}:${modelConfig.provider}`
      lastAssistantMessage.id = createMessageId()
      const assistantMessageToRegenerateId = lastAssistantMessage.id
      console.log({ lastAssistantMessage, copiedGroupMessages })
      // update chatMessages
      chatMessages.update((o: ChatMessageInterface[]) => [
        ...o,
        ...copiedGroupMessages,
      ])
      const newMessageId = userMessageToRegenerate.id

      messageId.update(() => newMessageId)
      addMessageTask(newMessageId)
      lastGeneratedAssistantMessageId.update(
        () => assistantMessageToRegenerateId
      )
      // update current messageGroupId
      // messageGroupIds.update([])
      messageGroupIds.update((o) => [...o, newGroupId])
      messageGroupId.update(() => newGroupId)
    } else {
      messageId.update(() => assistantMessageToRegenerate.id)
      addMessageTask(assistantMessageToRegenerate.id)
      lastGeneratedAssistantMessageId.update(
        () => assistantMessageToRegenerate.id
      )
    }
    // clean messageTasks

    // update userPrompt and model config
    userPrompt.update(() => userMessageToRegenerate.content)
    model.update(() => modelConfig.model)
    provider.update(() => modelConfig.provider)
    // @ts-ignore
    regeneratePromptMessages.update(() => regenerateChatMessages)
    isProcessing.update(() => false)
    isRegenerate.update(() => true)
    setTimeout(() => {
      isProcessing.update(() => true)
    }, 256)
  }
}
