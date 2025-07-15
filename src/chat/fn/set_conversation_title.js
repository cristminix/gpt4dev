import { sanitize } from "./sanitize";

export async function set_conversation_title(conversation_id, title) {
    conversation = await get_conversation(conversation_id);
    conversation.new_title = title;
    delete conversation.share;
    const new_id = sanitize(title, " ");
    if (new_id && !appStorage.getItem(`conversation:${new_id}`)) {
        appStorage.removeItem(`conversation:${conversation.id}`);
        title_ids_storage[conversation_id] = new_id;
        conversation.backup = conversation.backup || conversation.id;
        conversation.id = new_id;
        add_url_to_history(`#${new_id}`);
    }
    appStorage.setItem(
        `conversation:${conversation.id}`,
        JSON.stringify(conversation)
    );
}
