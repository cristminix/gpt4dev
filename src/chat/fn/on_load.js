import { upload_files } from "./upload_files";
import framework from "./framework";
import { count_input } from "./count_input"
import { load_conversations } from "./load_conversations"
import { box_conversations, sidebar } from "../constant"
import { HtmlRenderPlugin } from "../classes/HtmlRenderPlugin"
import { generateUUID } from "./generateUUID"
export async function on_load(translationSnipptes, appStorage) {
    translationSnipptes.forEach((snippet) => framework.translate(snippet));
    count_input();
    if (window.location.hash == "#settings") {
        open_settings();
        await load_conversations(appStorage);
        return;
    }
    const conversation_id = window.location.hash.replace("#", "");
    if (conversation_id && conversation_id != "new" && conversation_id != "menu") {
        window.conversation_id = conversation_id;
    } else {
        window.conversation_id = generateUUID();
    }
    chatPrompt.value = document.getElementById("systemPrompt")?.value || "";
    let chat_params = new URLSearchParams(window.location.query);
    if (chat_params.get("prompt")) {
        userInput.value = chat_params.get("prompt");
        userInput.style.height = "100%";
        userInput.focus();
        await load_conversations();
    } else if (!conversation_id) {
        await new_conversation();
    } else {
        await load_conversations(appStorage);
    }
    hljs.addPlugin(new HtmlRenderPlugin())
    hljs.addPlugin(new CopyButtonPlugin());
    // Ensure sidebar is shown by default on desktop
    if (window.innerWidth >= 640) {
        sidebar.classList.add("shown");
        sidebar.classList.remove("minimized");
    }
}