export function get_conversation_data(conversation) {
    conversation.updated = Date.now();
    return conversation;
}
