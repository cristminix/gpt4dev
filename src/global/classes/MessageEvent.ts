import type { MessageEventInterface } from "./types"

export const MessageEvent = (name: string, data: any = null): MessageEventInterface => {
  return { name, data: data ? data : null }
}
