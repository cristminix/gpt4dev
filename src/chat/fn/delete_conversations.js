export const delete_conversations = async () => {
    const remove_keys = [];
    for (let i = 0; i < appStorage.length; i++){
        let key = appStorage.key(i);
        if (key.startsWith("conversation:")) {
            remove_keys.push(key);
        }
    }
    remove_keys.forEach((key)=>appStorage.removeItem(key));
    hide_sidebar();
    await new_conversation();
};
