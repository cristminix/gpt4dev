import type { ChatMessageInterface } from "../types"
import { createMessageId } from "./createMessageId"
import { createMessageGroup } from "@/global/store/conversation/createMessageGroup"
import { createChatMessage } from "@/global/store/conversation/createChatMessage"
import { updateChatMessage } from "@/global/store/conversation/updateChatMessage"
import jquery from "jquery"
import type { Writable } from "svelte/store"
import { messageId } from "@/global/store/conversation/messageStore"

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
  $regeneratePromptMessages: ChatMessageInterface[]
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
        // USE SAME MODEL
        // regeneratePromptMessages
        console.log({ regeneratePromptMessages: $regeneratePromptMessages })
        if ($regenerateUsingSameModelProvider) {
        } else {
        }

        isProcessing.update(() => false)
        updateMessageGroupMessages()
      }, 25)

      updateMessageTask(id, true)
    } else {
      // console.log("Message already saved", getMessageTask(id), $messageTasks)
    }
  } else {
    // console.log(`No message task correspond to ${id}`)
  }
  // isRegenerate.update(() => false);
}
