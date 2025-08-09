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
  $messageTasks: Record<string, any>
) {
  const task = getMessageTask(id)
  if (task) {
    if (task.status === "onProcess") {
      setTimeout(async () => {
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
        let groupId = v1()
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
          username: `${$provider}:${$model}`,
        }
        chatMessagesData.push(userMessage)
        chatMessagesData.push(assistantMessage)

        console.log("saving to storage")
        // add system message to conversation
        // add option enable or disable system message to conversation
        // create conversation
        // create user message
        // create assistant message

        if (params?.id === "new") {
          await createConversation(newConversation)

          if (routeApp) {
            routeApp.navigate(`/chat/${newConversation.id}`)
          }
        } else {
          // const [c, m] = await updateConversation(
          //   newConversation,
          //   chatMessagesData
          // )
          chatMessages.update(() => chatMessagesData)
          console.log("conversation id is not new")
        }
        await createChatMessage(userMessage, newConversation.id)
        await createChatMessage(assistantMessage, newConversation.id)
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
