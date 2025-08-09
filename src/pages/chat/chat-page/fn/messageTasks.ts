import type { Writable } from "svelte/store"
import type { MessageTask } from "../types"

export function addMessageTask(
  id: string,
  messageTasks: Writable<Record<string, MessageTask>>,
  $messageTasks: Record<string, MessageTask>
) {
  const exists = Object.keys($messageTasks).includes(id)
  if (!exists) {
    messageTasks.update((o) => ({ ...o, [id]: { status: "onProcess" } }))
  }
  console.log({ $messageTasks })
}

export function updateMessageTask(
  id: string,
  status: boolean,
  messageTasks: Writable<Record<string, MessageTask>>,
  $messageTasks: Record<string, MessageTask>
) {
  const exists = Object.keys($messageTasks).includes(id)
  if (exists) {
    const newData: Record<string, MessageTask> = {
      ...$messageTasks,
    }
    newData[id] = { status }
    messageTasks.update(() => newData)
  }
  console.log({ exists, $messageTasks })
}

export function getMessageTask(
  id: string,
  $messageTasks: Record<string, MessageTask>
) {
  const exists = Object.keys($messageTasks).includes(id)
  console.log({ $messageTasks })
  if (exists) {
    return $messageTasks[id]
  }
  return null
}
