import { get_conversation_data } from "./get_conversation_data"
import { save_conversation } from "./save_conversation"
import { get_conversation } from "./get_conversation"
export const remove_message = async (conversation_id, index) => {
    const conversation = await get_conversation(conversation_id);
    const old_message = conversation.items[index];
    let new_items = [];
    for (const i in conversation.items) {
        if (i == index - 1) {
            if (!conversation.items[index]?.regenerate) {
                delete conversation.items[i]["regenerate"];
            }
        }
        if (i != index) {
            new_items.push(conversation.items[i])
        }
    }
    conversation.items = new_items;
    const data = get_conversation_data(conversation);
    await save_conversation(conversation_id, data);
    if (conversation.share) {
        const url = `${framework.backendUrl}/backend-api/v2/chat/${conversation.id}`;
        await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data),
        });
    }
    if (Array.isArray(old_message.content)) {
        for (const item of old_message.content) {
            if (item.bucket_id) {
                await framework.delete(item.bucket_id);
            }
        }
    }
};