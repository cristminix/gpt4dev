import { get_conversation } from "./get_conversation.js";
import { get_conversation_data } from "./get_conversation_data.js";
import { save_conversation } from "./save_conversation.js"
export const add_message = async (
    conversation_id, role, content,
    provider = null,
    message_index = -1,
    synthesize_data = null,
    regenerate = false,
    title = null,
    finish = null,
    usage = null,
    reasoning = null,
    do_continue = false
) => {
    const conversation = await get_conversation(conversation_id);
    if (!conversation) {
        return;
    }
    if (title) {
        conversation.title = title;
    } else if (!conversation.title && !Array.isArray(content)) {
        let new_value = content.trim();
        let new_lenght = new_value.indexOf("\n");
        new_lenght = new_lenght > 200 || new_lenght < 0 ? 200 : new_lenght;
        conversation.title = new_value.substring(0, new_lenght);
    }
    const new_message = {
        role: role,
        content: content,
        provider: provider,
    };
    if (synthesize_data) {
        new_message.synthesize = synthesize_data;
    }
    if (regenerate) {
        new_message.regenerate = true;
    }
    if (finish) {
        new_message.finish = finish;
    }
    if (usage) {
        new_message.usage = usage;
    }
    if (reasoning) {
        new_message.reasoning = reasoning;
    }
    if (do_continue) {
        new_message.continue = true;
    }
    if (message_index == -1) {
        conversation.items.push(new_message);
    } else {
        const new_messages = [];
        conversation.items.forEach((item, index) => {
            new_messages.push(item);
            if (index == message_index) {
                new_messages.push(new_message);
            }
        });
        conversation.items = new_messages;
    }
    let data = get_conversation_data(conversation);
    await save_conversation(conversation_id, data);
    if (conversation.share) {
        const url = `${framework.backendUrl}/backend-api/v2/chat/${conversation.id}`;
        fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(data),
        });
    }
    if (message_index == -1) {
        return conversation.items.length - 1;
    } else {
        return message_index + 1;
    }
};