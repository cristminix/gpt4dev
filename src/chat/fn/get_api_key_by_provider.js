
export function get_api_key_by_provider(provider) {
    let api_key = null;
    if (provider) {
        if (provider == "AnyProvider") {
            return {
                "PollinationsAI": appStorage.getItem("PollinationsAI-api_key"),
                "HuggingFace": appStorage.getItem("HuggingFace-api_key"),
                "Together": appStorage.getItem("Together-api_key"),
                "GeminiPro": appStorage.getItem("GeminiPro-api_key"),
                "OpenRouter": appStorage.getItem("OpenRouter-api_key"),
                "Groq": appStorage.getItem("Groq-api_key"),
                "DeepInfra": appStorage.getItem("DeepInfra-api_key"),
                "Replicate": appStorage.getItem("Replicate-api_key"),
                "PuterJS": appStorage.getItem("puter.auth.token"),
            };
        }
        api_key = document.querySelector(`.${provider}-api_key`)?.id || null;
        if (api_key == null) {
            api_key = document.getElementById(`${provider}-api_key`)?.id || null;
        }
        if (api_key) {
            api_key = appStorage.getItem(api_key);
        }
        if (!api_key && provider.startsWith("Puter") && localStorage.getItem('puter.auth.token')) {
            return localStorage.getItem("puter.auth.token");
        }
    }
    return api_key;
}
