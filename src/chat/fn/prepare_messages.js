import { filter_message } from "./filter_message"
// import { register_message_buttons } from "../constant"
export const prepare_messages = (messages, message_index = -1, do_continue = false, do_filter = true) => {
    messages = [...messages]
    let last_message;
    if (message_index != null) {
        console.debug("Messages Index:", message_index);

        // Removes messages after selected
        if (message_index >= 0) {
            messages = messages.filter((_, index) => message_index >= index);
        }
        // Removes none user messages at end
        if (!do_continue) {

            while (last_message = messages.pop()) {
                if (last_message["role"] == "user") {
                    messages.push(last_message);
                    break;
                }
            }
            console.debug("Messages filtered:", messages);
        }
    }
    // Combine assistant messages
    // let last_message;
    // let new_messages = [];
    // messages.forEach((message) => {
    //     message_copy = { ...message };
    //     if (last_message) {
    //         if (last_message["role"] == message["role"] &&  message["role"] == "assistant") {
    //             message_copy["content"] = last_message["content"] + message_copy["content"];
    //             new_messages.pop();
    //         }
    //     }
    //     last_message = message_copy;
    //     new_messages.push(last_message);
    // });
    // messages = new_messages;
    // console.log(2, messages);

    // Insert system prompt as first message
    let final_messages = [];
    if (chatPrompt?.value) {
        final_messages.push({
            "role": "system",
            "content": chatPrompt.value
        });
    }

    // Remove history, only add new user messages
    // The message_index is null on count total tokens
    if (!do_continue && document.getElementById('history')?.checked && do_filter && message_index != null) {
        let filtered_messages = [];
        while (last_message = messages.pop()) {
            if (last_message["role"] == "user") {
                filtered_messages.push(last_message);
            } else {
                break;
            }
        }
        messages = filtered_messages.reverse();
        if (last_message) {
            console.debug("History removed:", messages)
        }
    }

    messages.forEach((new_message, i) => {
        // Copy message first
        new_message = { ...new_message };
        // Include last message, if do_continue
        if (i + 1 == messages.length && do_continue) {
            delete new_message.regenerate;
        }
        // Include only not regenerated messages
        if (new_message) {
            // Remove generated images from content
            if (new_message.content) {
                new_message.content = filter_message(new_message.content);
            }
            // Remove internal fields
            new_message = { role: new_message.role, content: new_message.content };
            // Append message to new messages
            if (do_filter && !new_message.regenerate) {
                final_messages.push(new_message)
            } else if (!do_filter) {
                final_messages.push(new_message)
            }
        }
    });
    console.debug("Final messages:", final_messages)

    return final_messages;
}
