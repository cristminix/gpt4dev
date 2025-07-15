export async function get_conversation(conversation_id, appStorage) {
    if (!conversation_id) {
        return privateConversation;
    }
    let conversation = await JSON.parse(
        window.appStorage.getItem(`conversation:${conversation_id}`)
    );
    return conversation;
}