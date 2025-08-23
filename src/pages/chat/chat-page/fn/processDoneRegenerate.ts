import type { ChatMessageInterface } from "../types"
import { createMessageId } from "./createMessageId"
import { createMessageGroup } from "@/global/store/conversation/createMessageGroup"
import { createChatMessage } from "@/global/store/conversation/createChatMessage"
import { updateChatMessage } from "@/global/store/conversation/updateChatMessage"
import jquery from "jquery"
import type { Writable } from "svelte/store"

export async function processDoneRegenerate(
  fullText: string,
  id: string,
  getMessageTask: (id: string) => any,
  $conversation: any,
  useLastMessageId: Writable<boolean>,
  $useLastMessageId: boolean,
  messageGroupId: Writable<string>,
  $messageGroupId: string,
  groupedChatMessages: Writable<Record<string, ChatMessageInterface[]>>,
  $groupedChatMessages: Record<string, ChatMessageInterface[]>,
  model: Writable<string>,
  $model: string,
  provider: Writable<string>,
  $provider: string,
  lastMessageId: Writable<string>,
  $lastMessageId: string,
  chatMessages: Writable<ChatMessageInterface[]>,
  $chatMessages: ChatMessageInterface[],
  isProcessing: Writable<boolean>,
  updateMessageGroupMessages: () => Promise<void>,
  updateMessageTask: (id: string, status: boolean) => void,
  $messageTasks: Record<string, any>,
  toasts: any,
  $userPrompt: string,
  hasError: boolean,
  errorMessage: string,
  reloadChat: () => void
) {
  // console.log("processDoneRegenerate", fullText, id)
  const task = getMessageTask(id)

  if (task && $conversation) {
    if (task.status === "onProcess") {
      setTimeout(async () => {
        if (fullText.length === 0) {
          isProcessing.update(() => false)
          updateMessageTask(id, true)
          toasts.doToast(
            "error",
            errorMessage.length > 0 ? errorMessage : "text is empty"
          )
          jquery("#userInput").val($userPrompt)
          reloadChat()
          return
        }
        if (!$useLastMessageId) {
          const messageGroup = await createMessageGroup(
            $messageGroupId,
            //@ts-ignore
            $conversation.id
          )
          console.log({ messageGroup })
        }
        const messages = $groupedChatMessages[$messageGroupId]
        const userMessage: ChatMessageInterface = messages[messages.length - 1]
        const assistantMessage: ChatMessageInterface = {
          role: "assistant",
          content: fullText,
          id: createMessageId(),
          parentId: id,
          groupId: $messageGroupId,
          username: `${$model}:${$provider}`,
        }
        let chatMessagesData = [...$chatMessages] as any[]
        if (!$useLastMessageId) {
          for (const nMsg of messages) {
            const uMsg = await createChatMessage(nMsg, $conversation.id)
            console.log({ uMsg })
          }
        }
        if (!$useLastMessageId) {
          const aMsg = await createChatMessage(
            assistantMessage,
            $conversation.id
          )
          console.log({ aMsg })
          chatMessagesData.push(assistantMessage)
        } else {
          assistantMessage.id = $lastMessageId
          const aMsg = await updateChatMessage(
            assistantMessage,
            $conversation.id
          )
          console.log({ aMsg })
          //  $chatMessages.findIndex((item) => item.id === id)

          const aMsgIndex = chatMessagesData.findIndex(
            (msg) => msg.id === aMsg.id
          )
          console.log({ aMsgIndex }, chatMessagesData[aMsgIndex])
          if (aMsgIndex !== -1) {
            chatMessagesData[aMsgIndex] = {
              ...chatMessagesData[aMsgIndex],
              ...aMsg,
            }
          }

          // const filtered = chatMessagesData.filter((msg) => msg.id === aMsg.id)
          // if (filtered.length > 0) {
          //   filtered[0] = aMsg
          // }
        }
        chatMessages.update(() => chatMessagesData)
        isProcessing.update(() => false)
        // setTimeout(() => {
        updateMessageGroupMessages()
        // }, 512)
      }, 25)

      updateMessageTask(id, true)
    } else {
      console.log("Message already saved", getMessageTask(id), $messageTasks)
    }
  } else {
    console.log(`No message task correspond to ${id}`)
  }
  // isRegenerate.update(() => false);
}
