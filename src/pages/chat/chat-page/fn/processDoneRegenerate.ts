import type { ChatMessageInterface } from "../types"
import { createMessageId } from "./createMessageId"
import { createMessageGroup } from "@/global/store/conversation/createMessageGroup"
import { createChatMessage } from "@/global/store/conversation/createChatMessage"
import { updateChatMessage } from "@/global/store/conversation/updateChatMessage"
import jquery from "jquery"
import type { Writable } from "svelte/store"
import { messageId } from "@/global/store/conversation/messageStore"
import type TempChatMessages from "../../TempChatMessages.svelte"

export async function processDoneRegenerate(
  fullText: string,
  id: string,
  getMessageTask: (id: string) => any,
  $conversation: any,
  regenerateUsingSameModelProvider: Writable<boolean>,
  $regenerateUsingSameModelProvider: boolean,
  messageGroupId: Writable<string>,
  $messageGroupId: string,
  groupedChatMessages: Writable<Record<string, ChatMessageInterface[]>>,
  $groupedChatMessages: Record<string, ChatMessageInterface[]>,
  model: Writable<string>,
  $model: string,
  provider: Writable<string>,
  $provider: string,
  lastGeneratedAssistantMessageId: Writable<string>,
  $lastGeneratedAssistantMessageId: string,
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
  reloadChat: () => void,
  $useChatBuffer: boolean,
  $chatBufferGroupId: string,
  $regeneratePromptMessages: ChatMessageInterface[],
  tempChatMessagesRef: TempChatMessages
) {
  console.log("processDoneRegenerate", fullText, id)
  const task = getMessageTask(id)
  console.log({ task })

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
        // GET userMessage
        if (tempChatMessagesRef) {
          const userMessage = tempChatMessagesRef.getUserMessage()
          if (userMessage) {
            // USE SAME MODEL
            // regeneratePromptMessages
            const assistantMessageId = $lastGeneratedAssistantMessageId
            console.log({ regeneratePromptMessages: $regeneratePromptMessages })
            if ($regenerateUsingSameModelProvider) {
              const assistantMessage: ChatMessageInterface = {
                role: "assistant",
                content: fullText,
                id: assistantMessageId,
                parentId: userMessage.id,
                groupId: $messageGroupId,
                username: `${$model}:${$provider}`,
              }
              console.log(assistantMessage)

              const aMsg = await updateChatMessage(
                assistantMessage,
                $conversation.id
              )
              /*
              let chatMessagesData = [...$chatMessages] as any[]

              const aMsgIndex = chatMessagesData.findIndex(
                (msg) => msg.id === aMsg.id
              )
              // console.log({ aMsgIndex }, chatMessagesData[aMsgIndex])
              if (aMsgIndex !== -1) {
                chatMessagesData[aMsgIndex] = {
                  ...chatMessagesData[aMsgIndex],
                  ...aMsg,
                }
              }
              */
              if (!$useChatBuffer) {
                // chatMessages.update(() => chatMessagesData)
              }
            } else {
              await createMessageGroup(
                $messageGroupId,
                //@ts-ignore
                $conversation.id
              )
              // console.log({ messageGroup })
              const groupMessages = [...$groupedChatMessages[$messageGroupId]]
              const assistantMessage: ChatMessageInterface = {
                role: "assistant",
                content: fullText,
                id: assistantMessageId,
                parentId: userMessage.id,
                groupId: $messageGroupId,
                username: `${$model}:${$provider}`,
              }
              console.log(assistantMessage)
              // remove last assistant message
              groupMessages.pop()
              for (const nMsg of groupMessages) {
                const nMsgFiltered = {
                  id: nMsg.id,
                  groupId: nMsg.groupId,
                }
                console.log("createChatMessage", nMsgFiltered)
                const uMsg = await createChatMessage(nMsg, $conversation.id)
                console.log({ uMsg })
              }
              console.log("createChatMessage", assistantMessage)

              const aMsg = await createChatMessage(
                assistantMessage,
                $conversation.id
              )
              console.log({ aMsg })

              if (!$useChatBuffer) {
                // chatMessages.update(() => chatMessagesData)
              }
            }
          }
        }

        isProcessing.update(() => false)
        // updateMessageGroupMessages()
      }, 25)

      updateMessageTask(id, true)
    } else {
      // console.log("Message already saved", getMessageTask(id), $messageTasks)
    }
  } else {
    console.log(`No message task correspond to ${id}`)
    isProcessing.update(() => false)
  }
  // isRegenerate.update(() => false);
}
