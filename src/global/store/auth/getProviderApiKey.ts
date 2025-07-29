export function getProviderApiKey(provider: string): string | null {
    if(provider === "HuggingSpaces" || provider === "HuggingFaceInference" || provider === "HuggingFaceAPI"|| provider === "HuggingFaceMedia") {
        return localStorage.getItem("HuggingFace-api_key");
    }
    return ""
}