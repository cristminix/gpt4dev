// @ts-nocheck
import { get_conversation } from "./get_conversation"
import { register_message_images } from "./register_message_images"
import { log_storage } from "../constant"
import framework from "./framework";
import { update_message } from "./update_message"
import { save_conversation } from "./save_conversation"
import { get_conversation_data } from "./get_conversation_data"
import { scroll_to_bottom } from "./scroll_to_bottom"
import { render_reasoning } from "./render_reasoning"
import { api } from "./api";
export async function add_message_chunk(message, message_id, provider, finish_message = null) {
    const content_map = window.content_storage[message_id];
    if (message.type == "conversation") {
        const conversation = await get_conversation(window.conversation_id);
        if (!conversation.data) {
            conversation.data = {};
        }
        for (const [key, value] of Object.entries(message.conversation)) {
            conversation.data[key] = value;
        }
        await save_conversation(window.conversation_id, get_conversation_data(conversation));
    } else if (message.type == "auth") {
        window.error_storage[message_id] = message.message
        content_map.inner.innerHTML += framework.markdown(`${framework.translate('**An error occured:**')} ${message.message}`);
        let provider = window.provider_storage[message_id]?.name;
        let configEl = document.querySelector(`.settings .${provider}-api_key`);
        if (configEl) {
            configEl = configEl.parentElement.cloneNode(true);
            content_map.content.appendChild(configEl);
            await register_settings_storage();
        }
    } else if (message.type == "provider") {
        window.provider_storage[message_id] = message.provider;
        let provider_el = content_map.content.querySelector('.provider');
        provider_el.innerHTML = `
            <a href="${message.provider.url}" target="_blank">
                ${message.provider.label ? message.provider.label : message.provider.name}
            </a>
            ${message.provider.model ? ' ' + framework.translate('with') + ' ' + message.provider.model : ''}
        `;
    } else if (message.type == "message") {
        console.error(message.message)
        await api("log", { ...message, provider: provider_storage[message_id] });
    } else if (message.type == "error") {
        content_map.update_timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
        content_map.update_timeouts = [];
        window.error_storage[message_id] = message.message
        console.error(message.message);
        content_map.inner.innerHTML += framework.markdown(`${framework.translate('**An error occured:**')} ${message.message}`);
        if (finish_message) {
            await finish_message();
        }
        let p = document.createElement("p");
        p.innerText = message.error;
        log_storage.appendChild(p);
        await api("log", { ...message, provider: provider_storage[message_id] });
    } else if (message.type == "preview") {
        let img;
        if (img = content_map.inner.querySelector("img")) {
            if (img.complete) {
                const backup = img.src;
                img.src = message.urls;
                img.onerror = () => img.src = backup;
            }
        } else {
            content_map.inner.innerHTML = framework.markdown(message.preview);
            await register_message_images();
        }
    } else if (message.type == "content") {
        message_storage[message_id] += message.content;
        if (message.urls) {
            const div = document.createElement("div");
            div.innerHTML = framework.markdown(message.content);
            const media = div.querySelector("img, video")
            content_map.inner.appendChild(div);
            let cursorDiv = content_map.inner.querySelector(".cursor");
            if (cursorDiv) cursorDiv.parentNode.removeChild(cursorDiv);
        } else if (message.content) {
            update_message(content_map, message_id, null);
        }
    } else if (message.type == "log") {
        let p = document.createElement("p");
        p.innerText = message.log;
        log_storage.appendChild(p);
    } else if (message.type == "synthesize") {
        window.synthesize_storage[message_id] = message.synthesize;
    } else if (message.type == "title") {
        window.title_storage[message_id] = message.title;
    } else if (message.type == "login") {
        update_message(content_map, message_id, framework.markdown(message.login), scroll);
    } else if (message.type == "finish") {
        window.finish_storage[message_id] = message.finish;
    } else if (message.type == "continue") {
        window.continue_storage[message_id] = message;
    } else if (message.type == "usage") {
        window.usage_storage[message_id] = message.usage;
    } else if (message.type == "reasoning") {
        if (!window.reasoning_storage[message_id]) {
            window.reasoning_storage[message_id] = message;
            window.reasoning_storage[message_id].text = "";
            if (message.is_thinking && window.message_storage[message_id]) {
                window.reasoning_storage[message_id].text = message_storage[message_id];
                window.message_storage[message_id] = "";
            }
        } else if (typeof message.status !== 'undefined') {
            window.reasoning_storage[message_id].status = message.status;
        } if (message.label) {
            window.reasoning_storage[message_id].label = message.label;
        } if (message.token) {
            window.reasoning_storage[message_id].text += message.token;
        }
        let reasoning_body = content_map.inner.querySelector(".reasoning_body") || content_map.inner;
        reasoning_body.classList.remove("reasoning_body");
        reasoning_body.innerHTML = render_reasoning(reasoning_storage[message_id]);
    } else if (message.type == "parameters") {
        if (!parameters_storage[provider]) {
            parameters_storage[provider] = {};
        }
        Object.entries(message.parameters).forEach(([key, value]) => {
            parameters_storage[provider][key] = value;
        });
    } else if (message.type == "suggestions") {
        suggestions = message.suggestions;
    }
    scroll_to_bottom()
}