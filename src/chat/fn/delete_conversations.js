import { hide_sidebar } from "./hide_sidebar";
import { new_conversation } from "./new_conversation";
export const delete_conversations = async () => {
    const remove_keys = [];
    for (let i = 0; i < window.appStorage.length; i++) {
        let key = window.appStorage.key(i);
        if (key.startsWith("conversation:")) {
            remove_keys.push(key);
        }
    }
    remove_keys.forEach((key) => window.appStorage.removeItem(key));
    hide_sidebar();
    await new_conversation();
};
