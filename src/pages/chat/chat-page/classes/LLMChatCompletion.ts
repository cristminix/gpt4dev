import {
  type ChatMessageInterface,
  type ConversationInterface,
  type ReasoningResponse,
} from "../types"
export class LLMCompletion {
  lastRequestDate = Date.now()
  fullText = ""
  reasoningText = ""
  errorText = ""
  response: Promise<Response> | undefined
  isFinalized: boolean = false
  apiUrl: string = "/api/backend-api/v2/conversation"
  apiKey: string = ""
  onFinalizeMessageCallback: (text: string) => void = (text: string) => {}
  onUpdateMessageCallback: (text: string) => void = (text: string) => {}
  onReasoningCallback: (text: string, token: string) => void = (
    text: string
  ) => {}
  onPreviewCallback: (text: string) => void = (text: string) => {}
  onErroCallback: (text: string) => void = (text: string) => {
    console.error(text)
  }
  updateMessage(text: string) {
    // do update
    this.onUpdateMessageCallback(text)
  }
  finalizeMessage(hasError = false) {
    if (!this.isFinalized) {
      // do last parsed message
      this.onFinalizeMessageCallback(this.fullText)
    }
  }
  setApiKey(apiKey: string) {
    this.apiKey = apiKey
  }
  getReasoningText(resp: ReasoningResponse): string {
    if (resp.token) return resp.token
    if (resp.status) return resp.status
    if (resp.label) return resp.label
    return ""
  }
  onError(errorMessage: string) {
    console.error(errorMessage)
    this.onErroCallback(errorMessage)
  }
  async completion(
    provider: string,
    model: string,
    messages: ChatMessageInterface[],
    messageId: string,
    conversation: ConversationInterface,
    isRegenerate: boolean
  ) {
    let oldRequestDate = this.lastRequestDate
    const now = Date.now()
    if (!oldRequestDate) {
      oldRequestDate = now
    }
    const differenceInMilliseconds = now - oldRequestDate

    await new Promise((resolve) =>
      setTimeout(resolve, 512 - differenceInMilliseconds)
    )
    // const OPENAI_API_KEY = getProviderApiKey(provider)
    this.fullText = ""
    this.reasoningText = ""
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        action: "next",
        api_key: this.apiKey,
        aspect_ratio: "16:9",
        model, // or 'gpt-3.5-turbo'
        messages: messages,
        stream: true, // Enable streaming
        provider,
        id: messageId,
        conversation_id: conversation.id,
        conversation,
        download_media: true,
      }),
    })
    if (!response.ok) {
      this.onError("Error fetching response:" + response.statusText)
      return
    }
    const reader = response.body?.getReader()
    if (!reader) {
      this.onError("Error: Unable to get response reader")
      return
    }
    let reasoningText = ""
    while (true) {
      let buffer = ""

      const { done, value } = await reader.read()
      if (done) {
        this.finalizeMessage()
        break
      }

      buffer += new TextDecoder().decode(value)

      for (const line of buffer.split("\n")) {
        if (!line) {
          continue
        }
        let resp
        try {
          resp = JSON.parse(line)
        } catch (error) {
          // Skip invalid JSON lines
          continue
        }
        if (resp) {
          // console.log(resp)

          switch (resp.type) {
            case "log":
              break
            case "provider":
              break
            case "content":
              this.fullText += resp.content
              // console.log(line)
              this.updateMessage(this.fullText)

              break
            case "finish":
              const reason = resp.finish.reason
              this.finalizeMessage()
              break

            case "parameters":
              break
            case "error":
              this.errorText = resp.message
              this.onErroCallback(this.errorText)
              break
            case "preview":
              this.onPreviewCallback(resp.preview)

              break
            case "conversation":
              try {
                // const { message_history } = resp.conversation[provider]
                // const lastMessage = message_history[message_history.length - 1]
                // // tmpFullText = tmpFullText
                // fullText = lastMessage
                // finalizeMessage()
              } catch (error) {
                console.error("Error accessing conversation data:", error)
              }

              break
            case "reasoning":
              const token = this.getReasoningText(resp)
              this.reasoningText += token
              this.onReasoningCallback(this.reasoningText, token)
              break
          }
        } else {
          alert("no response")
        }
      }
    }
  }
}
