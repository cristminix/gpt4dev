export async function getConversations() {
  const response = await fetch("/llm/conversations").then((res) => res.json())
  return response.data || []
}
