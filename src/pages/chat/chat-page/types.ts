export interface ChatMessageInterface {
  id: number | string
  role: string
  content: string
  username: string
  provider?: {
    model: string
    label: string
  }
}

export interface ConversationInterface {
  id: string
  title: string
  createdAt?: Date | string
  updatedAt?: Date | string
}
