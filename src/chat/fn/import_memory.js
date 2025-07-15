export function import_memory() {
    if (!appStorage.getItem("mem0-api_key")) {
        return;
    }
    hide_sidebar();

    let count = 0;
    let user_id = appStorage.getItem("user") || appStorage.getItem("mem0-user_id");
    if (!user_id) {
        user_id = generateUUID();
        appStorage.setItem("mem0-user_id", user_id);
    }
    inputCount.innerText = framework.translate("Importing conversations...");
    let conversations = [];
    for (let i = 0; i < appStorage.length; i++) {
        if (appStorage.key(i).startsWith("conversation:")) {
            let conversation = appStorage.getItem(appStorage.key(i));
            conversations.push(JSON.parse(conversation));
        }
    }
    conversations.sort((a, b) => (a.updated || 0) - (b.updated || 0));
    async function add_conversation_to_memory(i) {
        if (i > conversations.length - 1) {
            return;
        }
        let body = JSON.stringify(conversations[i]);
        response = await fetch(`${framework.backendUrl}/backend-api/v2/memory/${user_id}`, {
            method: 'POST',
            body: body,
            headers: {
                "content-type": "application/json",
                "x_api_key": appStorage.getItem("mem0-api_key")
            }
        });
        const result = await response.json();
        count += result.count;
        inputCount.innerText = framework.translate('{0} Messages were imported').replace("{0}", count);
        add_conversation_to_memory(i + 1);
    }
    add_conversation_to_memory(0)
}