import { add_url_to_history } from "./add_url_to_history"
import { save_conversation } from "./save_conversation"
import { get_conversation_data } from "./get_conversation_data"
import { chatPrompt } from "../constant"
export async function add_conversation(conversation_id) {
    if (!conversation_id) {
        privateConversation = {
            id: conversation_id,
            title: "",
            added: Date.now(),
            system: chatPrompt?.value,
            items: [],
        }
        return;
    }
    if (appStorage.getItem(`conversation:${conversation_id}`) == null) {
        await save_conversation(conversation_id, get_conversation_data({
            id: conversation_id,
            title: "",
            added: Date.now(),
            system: chatPrompt?.value,
            items: [],
        }));
    }
    add_url_to_history(`#${conversation_id}`);
}