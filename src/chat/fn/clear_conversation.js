import {chatBody} from "../constant"

export const clear_conversation = async () => {
    let messages = chatBody.getElementsByTagName(`ul`);

    while (messages.length > 0) {
        chatBody.removeChild(messages[0]);
    }
};