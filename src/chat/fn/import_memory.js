import { inputCount } from "../constant";
export function import_memory() {
    if (!window.appStorage.getItem("mem0-api_key")) {
        return;
    }
    hide_sidebar();

    let count = 0;
    let user_id = window.appStorage.getItem("user") || window.appStorage.getItem("mem0-user_id");
    if (!user_id) {
        user_id = generateUUID();
        window.appStorage.setItem("mem0-user_id", user_id);
    }
    inputCount.innerText = framework.translate("Importing conversations...");
    let conversations = [];
    for (let i = 0; i < window.appStorage.length; i++) {
        if (window.appStorage.key(i).startsWith("conversation:")) {
            let conversation = window.appStorage.getItem(window.appStorage.key(i));
            conversations.push(JSON.parse(conversation));
        }
    }
    conversations.sort((a, b) => (a.updated || 0) - (b.updated || 0));
    async function add_conversation_to_memory(i) {
        if (i > conversations.length - 1) {
            return;
        }
        let body = JSON.stringify(conversations[i]);
        const response = await fetch(`${framework.backendUrl}/backend-api/v2/memory/${user_id}`, {
            method: 'POST',
            body: body,
            headers: {
                "content-type": "application/json",
                "x_api_key": window.appStorage.getItem("mem0-api_key")
            }
        });
        const result = await response.json();
        count += result.count;
        inputCount.innerText = framework.translate('{0} Messages were imported').replace("{0}", count);
        add_conversation_to_memory(i + 1);
    }
    add_conversation_to_memory(0)
}