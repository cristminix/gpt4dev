import type { ChatMessageInterface, ConversationInterface } from "../types"
import type { Writable } from "svelte/store"
import { createMessageId } from "./createMessageId"
import { makeUpConversationTitle } from "./makeUpConversationTitle"
import { stripMarkdown } from "./stripMarkdown"
import { cleanQuotes } from "./cleanQuotes"
import { createConversation } from "@/global/store/conversation/createConversation"
import { updateConversation } from "@/global/store/conversation/updateConversation"
import { v1 } from "uuid"
import { createProviderUsername } from "@/global/store/conversation/createProviderUsername"
import { createChatMessage } from "@/global/store/conversation/createChatMessage"
import { createMessageGroup } from "@/global/store/conversation/createMessageGroup"

export async function processDone(
  fullText: string,
  id: string,
  tempConversation: Writable<any[]>,
  conversation: Writable<ConversationInterface | null>,
  userPrompt: Writable<string>,
  model: Writable<string>,
  provider: Writable<string>,
  chatMessages: Writable<ChatMessageInterface[]>,
  isProcessing: Writable<boolean>,
  messageTasks: Writable<Record<string, any>>,
  params: { id?: string } | null,
  routeApp: any,
  getMessageTask: (id: string) => any,
  updateMessageTask: (id: string, status: boolean) => void,
  shouldPerformTitleGeneration: () => boolean,
  $conversation: ConversationInterface | null,
  $userPrompt: string,
  $model: string,
  $provider: string,
  $chatMessages: ChatMessageInterface[],
  $messageTasks: Record<string, any>,
  messageGroupId: Writable<string>,
  $messageGroupId: string,
  isRegenerate: boolean,
  messageGroupIds: Writable<string[]>,
  $messageGroupIds: string[]
) {
  const task = getMessageTask(id)
  if (task) {
    if (task.status === "onProcess") {
      setTimeout(async () => {
        if (fullText.length === 0) {
          isProcessing.update(() => false)
          updateMessageTask(id, true)
          alert("text is empty")
          return
        }
        tempConversation.update((o) => o.concat(fullText))
        const newConversation = { ...$conversation } as ConversationInterface
        let title = $userPrompt
        if ($userPrompt.length > 250) title = $userPrompt.slice(0, 250)
        let chatMessagesData = [...$chatMessages] as any[]

        if (params?.id === "new") {
          if (shouldPerformTitleGeneration()) {
            const newTitle =
              (await makeUpConversationTitle(
                fullText,
                $model,
                $provider,
                $conversation
              )) || ""
            title = newTitle as string
            title = stripMarkdown(title)
            title = cleanQuotes(title)
            if (title.length === 0) title = $userPrompt
            if (title.length > 250) title = title.slice(0, 250)
          }
          newConversation.title = title
          chatMessagesData = chatMessagesData.slice(1)
        }

        console.log("saving to storage")
        // add system message to conversation
        // add option enable or disable system message to conversation
        // create conversation
        // create user message
        // create assistant message
        // GET LAST MESSAGE GROUPID
        let groupId = $messageGroupId

        if (params?.id === "new") {
          await createConversation(newConversation)
          // create message group with conversation id
          // got groupId
          groupId = v1()
          const messageGroup = await createMessageGroup(
            groupId,
            newConversation.id
          )
          console.log({ messageGroup })
          // {groupId} = messageGroupId
          messageGroupId.update(() => groupId)

          const newMessagesGroupIds = [...$messageGroupIds, groupId]
          messageGroupIds.update(() => newMessagesGroupIds)
        }
        const userMessage: ChatMessageInterface = {
          role: "user",
          content: $userPrompt,
          username: "lalisa",
          id,
          groupId,
          parentId: newConversation.id,
        }
        const assistantMessage: ChatMessageInterface = {
          role: "assistant",
          content: fullText,
          id: createMessageId(),
          parentId: id,
          groupId,
          username: `${$model}:${$provider}`,
        }
        chatMessagesData.push(userMessage)
        chatMessagesData.push(assistantMessage)

        const uMsg = await createChatMessage(userMessage, newConversation.id)
        const aMsg = await createChatMessage(
          assistantMessage,
          newConversation.id
        )
        console.log({ uMsg, aMsg })
        if (params?.id !== "new") {
          chatMessages.update(() => chatMessagesData)
          console.log("conversation id is not new")
        } else {
          if (routeApp) {
            routeApp.navigate(`/chat/${newConversation.id}`)
          }
        }
        isProcessing.update(() => false)
      }, 512)
      updateMessageTask(id, true)
    } else {
      console.log("Message already saved", getMessageTask(id), $messageTasks)
    }
  } else {
    console.log(`No message task correspond to ${id}`)
  }
}
