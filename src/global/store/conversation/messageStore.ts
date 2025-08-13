import { writable } from "svelte/store"
import type { ChatMessageInterface } from "../../../pages/chat/chat-page/types"

// Store untuk menyimpan message.id dan message.parentId
export const messageId = writable<string | null>(null)
export const messageParentId = writable<string | null>(null)

// Store untuk menyimpan previous message
export const previousMessage = writable<ChatMessageInterface | null>(null)
