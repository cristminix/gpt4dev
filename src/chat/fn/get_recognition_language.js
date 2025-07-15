
export async function get_recognition_language() {
    const lang = document.getElementById("recognition-language")?.value;
    if (lang) {
        return lang;
    }
    let locale = navigator.language;
    if (!locale.includes("-")) {
        locale = appStorage.getItem(navigator.language);
        if (locale) {
            return locale;
        }
        const prompt = 'Response the full locale in JSON. Example: {"locale": "en-US"} Language: ' + navigator.language;
        response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?json=true`);
        locale = (await response.json()).locale || navigator.language;
        if (locale.includes("-")) {
            appStorage.setItem(navigator.language, locale);
        }
    }
    return locale;
}
