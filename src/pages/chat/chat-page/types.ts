export interface MessageTask {
  status: string | boolean
}

export interface ChatMessageInterface {
  role: string
  content: string
  id: string | number
  username: string
  parentId?: string | number
  provider?: {
    model: string
    label: string
    finish: {
      reason: string
    }
  }
}

export interface ConversationInterface {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  system: string
}
