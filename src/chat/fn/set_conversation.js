import { add_url_to_history } from "./add_url_to_history"
import { clear_conversation } from "./clear_conversation"
import { play_last_message } from "./play_last_message"
import { load_conversations } from "./load_conversations"
import { load_conversation } from "./load_conversation"
import { hide_sidebar } from "./hide_sidebar"
import { get_conversation } from "./get_conversation"
export const set_conversation = async (conversation_id) => {
    if (title_ids_storage[conversation_id]) {
        conversation_id = title_ids_storage[conversation_id];
    }
    add_url_to_history(`#${conversation_id}`);
    window.conversation_id = conversation_id;

    window.suggestions = null;
    await clear_conversation();
    await load_conversation(await get_conversation(conversation_id));
    play_last_message();
    load_conversations();
    hide_sidebar(true);
};