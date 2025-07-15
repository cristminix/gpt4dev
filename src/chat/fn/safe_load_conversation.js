import { get_conversation } from "./get_conversation"
import { load_conversation } from "./load_conversation"
export async function safe_load_conversation(conversation_id) {
    let is_running = false;
    for (const key in window.controller_storage) {
        if (!window.controller_storage[key].signal.aborted) {
            is_running = true;
            break;
        }
    }
    if (!is_running) {
        let conversation = await get_conversation(conversation_id);
        return await load_conversation(conversation);
    }
}
