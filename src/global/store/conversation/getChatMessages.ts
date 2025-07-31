export async function getChatMessages(conversationId: string) {
  const responseMessage = await fetch(
    `/llm/conversations/${conversationId}/messages`
  ).then((res) => res.json())
  let chatMessages = []
  console.log("getChatMessages responseMessage", responseMessage)
  if (responseMessage.data) {
    chatMessages = responseMessage.data.map((item: any) => {
      // const { message, participant } = item
      const row = item
      if (item.role === "assistant") {
        const [model, label] = item.username.split(":")
        row.provider = {
          label,
          model,
        }
      }

      return row
    })
  }
  return chatMessages
}
