import { makeUpConversationTitle } from "./makeUpConversationTitle"
import { stripMarkdown } from "./stripMarkdown"
import { cleanQuotes } from "./cleanQuotes"
import { isImageModel } from "../../../../global/store/chat/isImageModel"
import type { ConversationInterface } from "../types"
import { updateConversationTitle } from "../../../../global/store/conversation/updateConversationTitle"
import { type RouteApp } from "../../../../components/RouteApp.types"
import * as idb from "idb-keyval"
export async function executeTitleGenerationTask(
  fullText: string,
  $model: string,
  $userPrompt: string,
  $conversation: ConversationInterface | null,
  routeApp: RouteApp
): Promise<void> {
  console.log("performing title generation")
  let title = $userPrompt
  try {
    const newTitle =
      (await makeUpConversationTitle(
        isImageModel($model) ? $userPrompt : fullText,
        $conversation
      )) || ""
    console.log({ newTitle })
    title = newTitle as string
    title = stripMarkdown(title)
    title = cleanQuotes(title)

    const conversation = $conversation as ConversationInterface
    conversation.title = title

    if (title.length === 0) title = $userPrompt
    if (title.length > 250) title = title.slice(0, 250)

    await updateConversationTitle(conversation.id, title)
    if (routeApp) {
      idb.set("updateSidebarItem", conversation)
      routeApp.setRoute(
        `/chat/${conversation.id}?updateSidebarItem=${Date.now()}`
      )
    }
  } catch (error) {
    console.error("Title generation failed", error)
  }

  //   return title
}
