import { get_conversation } from "./get_conversation"
const delete_conversation = async (conversation_id) => {
    const conversation = await get_conversation(conversation_id);
    for (const message of conversation.items) {
        if (Array.isArray(message.content)) {
            for (const item of message.content) {
                if (item.bucket_id) {
                    await framework.delete(item.bucket_id);
                }
            }
        }
    }
    if (conversation.share) {
        await framework.delete(conversation.id);
    }
    window.appStorage.removeItem(`conversation:${conversation_id}`);

    if (window.conversation_id == conversation_id) {
        await new_conversation();
    }

    await load_conversations();
};