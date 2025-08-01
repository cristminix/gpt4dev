export async function deleteChatMessage(conversationId: string, id: number) {
  const responseMessage = await fetch(
    `/llm/conversations/${conversationId}/messages/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json())

  console.log("getChatMessages responseMessage", responseMessage)

  return responseMessage.success
}
