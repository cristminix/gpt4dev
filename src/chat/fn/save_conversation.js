export async function save_conversation(conversation_id, conversation) {
    if (!conversation_id) {
        privateConversation = conversation;
        return;
    }
    window.appStorage.setItem(
        `conversation:${conversation_id}`,
        JSON.stringify(conversation)
    );
}