import { makeUpConversationTitle } from "./makeUpConversationTitle"
import { stripMarkdown } from "./stripMarkdown"
import { cleanQuotes } from "./cleanQuotes"
import { isImageModel } from "../../../../global/store/chat/isImageModel"
import type { ConversationInterface } from "../types"
import { updateConversationTitle } from "../../../../global/store/conversation/updateConversationTitle"
import { type RouteApp } from "../../../../components/RouteApp.types"
import * as idb from "idb-keyval"
import type { Writable } from "svelte/store"
export async function executeTitleGenerationTask(
  fullText: string,
  $model: string,
  $userPrompt: string,
  $conversation: ConversationInterface | null,
  routeApp: RouteApp,
  conversation: Writable<ConversationInterface | null>
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

    const conversationSet = $conversation as ConversationInterface
    conversationSet.title = title

    if (title.length === 0) title = $userPrompt
    if (title.length > 250) title = title.slice(0, 250)

    await updateConversationTitle(conversationSet.id, title)
    conversation.update((o: any) => ({ ...o, title }))
    document.title = title
    if (routeApp) {
      idb.set("updateSidebarItem", conversationSet)
      routeApp.setRoute(
        `/chat/${conversationSet.id}?updateSidebarItem=${Date.now()}`
      )
    }
  } catch (error) {
    console.error("Title generation failed", error)
  }

  //   return title
}
