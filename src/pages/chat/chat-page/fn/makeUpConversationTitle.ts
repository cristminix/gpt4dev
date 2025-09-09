import { getProviderApiKey } from "@/global/store/auth/getProviderApiKey"
import { createMessageId } from "./createMessageId"

export async function makeUpConversationTitle(
  lastMessage: string,
  model: string,
  provider: string,
  conversation: any
) {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  let tmpFullText = ""
  return new Promise(async (resolve, reject) => {
    const OPENAI_API_KEY = getProviderApiKey(provider)

    const response = await fetch("/api/backend-api/v2/conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        action: "next",
        api_key: OPENAI_API_KEY,
        aspect_ratio: "16:9",
        conversation: null,
        model: model, // or 'gpt-3.5-turbo'
        messages: [
          {
            role: "user",
            content:
              "Please provide the answer to the following question without any additional context or explanations,Generate one title with a relevant emoji for this text: \n" +
              lastMessage +
              ",give one result only without quotes, make sure to include an emoji",
          },
        ],
        stream: true, // Enable streaming
        provider: provider,
        id: createMessageId(),
        conversation_id: conversation.id,
        download_media: true,
      }),
    })
    //@ts-ignore
    const reader = response.body.getReader()
    let line = ""
    let reasoningText = ""
    while (true) {
      let buffer = ""

      const { done, value } = await reader.read()
      // console.log("reading response", done, value)
      if (done) {
        resolve(tmpFullText)
        break
      }

      buffer += new TextDecoder().decode(value)
      let resp

      let previewText = ""
      for (const line of buffer.split("\n")) {
        if (!line) {
          continue
        }
        try {
          resp = JSON.parse(line)
        } catch (error) {
          console.error("Error parsing JSON:", error)
        }
        if (resp) {
          // console.log(resp)

          switch (resp.type) {
            case "log":
              break
            case "provider":
              break
            case "content":
              tmpFullText += resp.content
              // resolve(tmpFullText)

              // console.log(line)

              break
            case "finish":
              const reason = resp.finish.reason
              resolve(tmpFullText)

            case "parameters":
              break
            case "error":
              tmpFullText = resp.message
              resolve(tmpFullText)

              break
            case "preview":
              break
            case "conversation":
              try {
                const { message_history } = resp.conversation[provider]
                const lastMessage = message_history[message_history.length - 1]
                tmpFullText = lastMessage.content
                resolve(tmpFullText)
              } catch (error) {
                // console.error("Error accessing conversation data:", error)
              }

              break
            case "reasoning":
              break
          }
        } else {
          alert("no response")
        }
      }

      //   await new Promise((r) => setTimeout(r, 512))
    }
    // return fullText
    // reject("No response from API")
  })
}
