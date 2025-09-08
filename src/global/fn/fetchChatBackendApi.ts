export async function fetchChatBackendApi(
  url: string,
  options: RequestInit = {}
) {
  return await fetch(url, options)
}
