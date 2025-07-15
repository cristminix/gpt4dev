import { generateUUID } from "./generateUUID"
import { load_conversations } from "./load_conversations"
import { hide_sidebar } from "./hide_sidebar"
import { say_hello } from "./say_hello"
import { clear_conversation } from "./clear_conversation"
import { chatPrompt } from "../constant"
import { add_url_to_history } from "./add_url_to_history"
import framework from "./framework"
export const new_conversation = async (isPrivate = false) => {
    if (window.location.hash) {
        add_url_to_history("#new");
    }
    window.conversation_id = isPrivate ? null : generateUUID();
    document.title = window.title || document.title;
    document.querySelector(".chat-top-panel .convo-title").innerText = isPrivate ? framework.translate("Private Conversation") : framework.translate("New Conversation");

    suggestions = null;
    await clear_conversation();
    if (chatPrompt) {
        chatPrompt.value = document.getElementById("systemPrompt")?.value;
    }
    load_conversations();
    hide_sidebar(true);
    say_hello();
};