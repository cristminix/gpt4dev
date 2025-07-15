import { clear_conversations } from "./clear_conversations"
import { toLocaleDateString } from "./toLocaleDateString"
import framework from "./framework"
import { box_conversations } from "../constant";
export const load_conversations = async () => {
    let conversations = [];
    const appStorage = window.appStorage
    for (let i = 0; i < appStorage.length; i++) {
        if (appStorage.key(i).startsWith("conversation:")) {
            let conversation = appStorage.getItem(appStorage.key(i));
            conversations.push(JSON.parse(conversation));
        }
    }
    conversations.sort((a, b) => (b.updated || 0) - (a.updated || 0));
    await clear_conversations();
    conversations.forEach((conversation) => {
        // const length = conversation.items.map((item) => (
        //     !item.content.toLowerCase().includes("hello") &&
        //     !item.content.toLowerCase().includes("hi") &&
        //     item.content
        // ) ? 1 : 0).reduce((a,b)=>a+b, 0);
        // if (!length) {
        //     appStorage.removeItem(`conversation:${conversation.id}`);
        //     return;
        // }
        const shareIcon = conversation.share ? '<i class="fa-solid fa-qrcode"></i>' : '';
        let convo = document.createElement("div");
        convo.classList.add("convo", "text-gray-800", "dark:text-white");
        convo.id = `convo-${conversation.id}`;
        convo.innerHTML = `
            <div class="left" onclick="set_conversation('${conversation.id}')">
                <i class="fa-regular fa-comments"></i>
                <span class="datetime">${conversation.updated ? toLocaleDateString(conversation.updated) : ""}</span>
                <span class="convo-title">${shareIcon} ${framework.escape(conversation.new_title ? conversation.new_title : conversation.title)}</span>
            </div>
            <i onclick="show_option('${conversation.id}')" class="fa-solid fa-ellipsis-vertical" id="conv-${conversation.id}"></i>
            <div id="cho-${conversation.id}" class="choise" style="display:none;">
                <i onclick="delete_conversation('${conversation.id}')" class="fa-solid fa-trash"></i>
                <i onclick="hide_option('${conversation.id}')" class="fa-regular fa-x"></i>
            </div>
        `;
        box_conversations.appendChild(convo);
    });
};
