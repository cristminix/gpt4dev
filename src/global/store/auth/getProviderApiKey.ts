export function getProviderApiKey(provider: string): string {
  if (
    provider === "HuggingSpaces" ||
    provider === "HuggingFaceInference" ||
    provider === "HuggingFaceAPI" ||
    provider === "HuggingFaceMedia"
  ) {
    return localStorage.getItem("HuggingFace-api_key") || ""
  }
  if (provider.startsWith("PuterJS")) {
    return localStorage.getItem("puter.auth.token") || ""
  }
  return ""
}
