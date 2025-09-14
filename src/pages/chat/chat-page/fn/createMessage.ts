import type { ChatMessageInterface } from "../types"

export function createUserMessage(
  id: string,
  content: string,
  username: string,
  groupId: string,
  parentId: string
) {
  const userMessage: ChatMessageInterface = {
    role: "user",
    content,
    id,
    username,
    groupId,
    parentId,
  }
  return userMessage
}
export function createAssistantMessage(
  id: string,
  content: string,
  username: string,
  groupId: string,
  parentId: string
) {
  const userMessage: ChatMessageInterface = {
    role: "assistant",
    content,
    id,
    username,
    groupId,
    parentId,
  }
  return userMessage
}
export function createSystemMessage(
  id: string,
  content: string,
  username: string,
  groupId: string,
  parentId: string
) {
  const userMessage: ChatMessageInterface = {
    role: "system",
    content,
    id,
    username,
    groupId,
    parentId,
  }
  return userMessage
}
