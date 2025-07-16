import { save_conversation } from "./save_conversation";
export async function save_system_message() {
    if (!window.conversation_id) {
        return;
    }
    const conversation = await get_conversation(window.conversation_id);
    if (conversation) {
        conversation.system = chatPrompt?.value;
        await save_conversation(window.conversation_id, get_conversation_data(conversation));
    }
}
