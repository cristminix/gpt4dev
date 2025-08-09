import type { ChatMessageInterface, ConversationInterface } from "../types"
import type { Writable } from "svelte/store"
import { createMessageId } from "./createMessageId"
import { makeUpConversationTitle } from "./makeUpConversationTitle"
import { stripMarkdown } from "./stripMarkdown"
import { cleanQuotes } from "./cleanQuotes"
import { createConversation } from "@/global/store/conversation/createConversation"
import { updateConversation } from "@/global/store/conversation/updateConversation"

export async function processDone(
  fullText: string,
  id: string | number,
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
  const taskId = typeof id === "number" ? id.toString() : id
  const task = getMessageTask(taskId)
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
        chatMessagesData.push({
          role: "user",
          content: $userPrompt,
          username: "bob",
          id,
        })
        chatMessagesData.push({
          role: "assistant",
          content: fullText,
          id: createMessageId(),
          parentId: id,
          provider: {
            model: $model,
            label: $provider,
            finish: { reason: "stop" },
          },
        })

        console.log("saving to storage")
        if (params?.id === "new") {
          const [c, m] = await createConversation(
            newConversation,
            chatMessagesData
          )
          if (routeApp) {
            routeApp.navigate(`/chat/${newConversation.id}`)
          }
        } else {
          const [c, m] = await updateConversation(
            newConversation,
            chatMessagesData
          )
          chatMessages.update(() => m as ChatMessageInterface[])
          console.log({ m })
        }
        isProcessing.update(() => false)
      }, 512)
      updateMessageTask(taskId, true)
    } else {
      console.log(
        "Message already saved",
        getMessageTask(taskId),
        $messageTasks
      )
    }
  } else {
    console.log(`No message task correspond to ${taskId}`)
  }
}
