export async function save_conversation(conversation_id, conversation) {
    if (!conversation_id) {
        privateConversation = conversation;
        return;
    }
    appStorage.setItem(
        `conversation:${conversation_id}`,
        JSON.stringify(conversation)
    );
}