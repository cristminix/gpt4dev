import { get_selected_model } from "./get_selected_model";
import { providerSelect, stop_generating, modelSelect, modelProvider, regenerate_button } from "../constant"
import { get_conversation } from "./get_conversation"
import { requestWakeLock } from "./requestWakeLock"
import { prepare_messages } from "./prepare_messages"
import { add_message } from "./add_message"
import { load_conversation } from "./load_conversation"
import { load_conversations } from "./load_conversations"
import { hide_sidebar } from "./hide_sidebar"
import { play_last_message } from "./play_last_message"
import { safe_remove_cancel_button } from "./safe_remove_cancel_button"
import { get_api_key_by_provider } from "./get_api_key_by_provider"
import { settings, switchInput } from "../constant";
import { api } from "./api";
import framework from "./framework";
import { highlight } from "./highlight";
import { safe_load_conversation } from "./safe_load_conversation"
import { register_message_images } from "./register_message_images"
import { register_message_buttons } from "./register_message_buttons"
export const ask_gpt = async (message_id, message_index = -1, regenerate = false, provider = null, model = null, action = null, message = null) => {
    if (!model && !provider) {
        model = get_selected_model()?.value || null;
        provider = providerSelect.options[providerSelect.selectedIndex]?.value;
    }
    let conversation = await get_conversation(window.conversation_id);
    if (!conversation) {
        return;
    }
    const message_storage = window.message_storage;
    const controller_storage = window.controller_storage
    const content_storage = window.content_storage
    const mediaChunks = window.mediaChunks
    const countTokensEnabled = window.countTokensEnabled
    const image_storage = window.image_storage
    const synthesize_storage = window.synthesize_storage
    const finish_storage = window.finish_storage
    await requestWakeLock();
    let messages = prepare_messages(conversation.items, message_index, action == "continue");
    message_storage[message_id] = "";
    stop_generating.classList.remove("stop_generating-hidden");

    let suggestions_el = chatBody.querySelector('.suggestions');
    suggestions_el ? suggestions_el.remove() : null;
    if (countTokensEnabled) {
        let count_total = chatBody.querySelector('.count_total');
        count_total ? count_total.parentElement.removeChild(count_total) : null;
    }

    const message_el = document.createElement("ul");
    message_el.classList.add("mt-8", "message");
    if (message_index != -1 || regenerate) {
        message_el.classList.add("regenerate");
    }

    message_el.classList.add("space-y-5");
    message_el.dataset.index = message_index;
    // INITIAL_ASSISTANT_MESSAGE

    message_el.innerHTML = `
       <li class=" max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4 text-gray-800 dark:text-white" >
${gpt_image}
          <div class="space-y-3 content">
            <div class="provider" data-provider="${provider}"></div>
            <div class="content_inner"><span class="cursor"></span></div>
            <div class="count"></div>
          </div>
        </li>
    `;

    if (message_index == -1) {
        chatBody.appendChild(message_el);
    } else {
        const parent_message = chatBody.querySelector(`.message[data-index="${message_index}"]`);
        if (!parent_message) {
            return;
        }
        parent_message.after(message_el);
    }

    let content_el = message_el.querySelector('.content');
    let content_map = content_storage[message_id] = {
        container: message_el,
        content: content_el,
        inner: content_el.querySelector('.content_inner'),
        count: content_el.querySelector('.count'),
        update_timeouts: [],
        message_index: message_index,
    }
    async function finish_message() {
        content_map.update_timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
        content_map.update_timeouts = [];
        if (!error_storage[message_id] && message_storage[message_id]) {
            const html = framework.markdown(message_storage[message_id]);
            content_map.inner.innerHTML = html;
            highlight(content_map.inner);
        }
        if (message_storage[message_id] || reasoning_storage[message_id]?.status || reasoning_storage[message_id]?.text) {
            const message_provider = message_id in provider_storage ? provider_storage[message_id] : null;
            let usage = {};
            if (usage_storage[message_id]) {
                usage = usage_storage[message_id];
            }
            // Calculate usage if we don't have it jet
            if (countTokensEnabled && document.getElementById("track_usage").checked && !usage.prompt_tokens && window.GPTTokenizer_cl100k_base) {
                const prompt_token_model = model?.startsWith("gpt-3") ? "gpt-3.5-turbo" : "gpt-4"
                const filtered = messages.filter((item) => !Array.isArray(item.content) && item.content);
                const prompt_tokens = GPTTokenizer_cl100k_base?.encodeChat(filtered, prompt_token_model).length;
                const completion_tokens = count_tokens(message_provider?.model, message_storage[message_id])
                    + (reasoning_storage[message_id] ? count_tokens(message_provider?.model, reasoning_storage[message_id].text) : 0);
                usage = {
                    ...usage,
                    prompt_tokens: prompt_tokens,
                    completion_tokens: completion_tokens,
                    total_tokens: prompt_tokens + completion_tokens
                }
            }
            // It is not regenerated, if it is the first response to a new question
            if (regenerate && message_index == -1) {
                let conversation = await get_conversation(window.conversation_id);
                regenerate = conversation.items[conversation.items.length - 1]["role"] != "user";
            }
            // Create final message content
            const final_message = message_storage[message_id]
                + (error_storage[message_id] ? " [error]" : "")
                + (stop_generating.classList.contains('stop_generating-hidden') ? " [aborted]" : "")
            // Save message in local storage
            message_index = await add_message(
                window.conversation_id,
                "assistant",
                final_message,
                message_provider,
                message_index,
                synthesize_storage[message_id],
                regenerate,
                title_storage[message_id],
                finish_storage[message_id],
                usage,
                reasoning_storage[message_id],
                action == "continue"
            );
            delete message_storage[message_id];
            delete reasoning_storage[message_id];
            delete synthesize_storage[message_id];
            delete title_storage[message_id];
            delete finish_storage[message_id];
            delete usage_storage[message_id];
            // Send usage to the server
            if (document.getElementById("track_usage").checked) {
                usage = {
                    model: message_provider?.model,
                    provider: message_provider?.name,
                    ...usage
                };
                const user = localStorage.getItem("user");
                if (user) {
                    usage = { user: user, ...usage };
                }
                api("usage", usage);
            }
        }
        // Update controller storage
        if (controller_storage[message_id]) {
            delete controller_storage[message_id];
        }
        // Reload conversation if no error
        if (!error_storage[message_id]) {
            if (await safe_load_conversation(window.conversation_id)) {
                play_last_message(); // Play last message async
                const new_message = chatBody.querySelector(`[data-index="${message_index}"]`)
                new_message ? new_message.scrollIntoView({ behavior: "smooth", block: "end" }) : null;
            }
        }
        let cursorDiv = message_el.querySelector(".cursor");
        if (cursorDiv) cursorDiv.parentNode.removeChild(cursorDiv);
        await safe_remove_cancel_button();
        await register_message_images();
        await register_message_buttons();
        await load_conversations();
        regenerate_button.classList.remove("regenerate-hidden");
    }
    const media = [];
    if (provider == "Puter" || provider == "Live") {
        if (mediaChunks.length > 0) {
            const data = await toBase64(mediaChunks.pop());
            media.push({
                "type": "input_audio",
                "input_audio": {
                    "data": data.split(",")[1],
                    "format": "wav"
                }
            });
        }
        for (const file of Object.values(image_storage)) {
            media.push({
                "type": "image_url",
                "image_url": {
                    "url": await toUrl(file)
                }
            });
        }
        messages = messages.map((message) => {
            return {
                role: message.role,
                content: Array.isArray(message.content) ? message.content.map((item) => {
                    return {
                        type: "text",
                        text: item.text || ""
                    }
                }) : message.content
            }
        });
    }
    let last_message;
    if (messages.length > 0) {
        last_message = messages[messages.length - 1];
        last_message.content = media.length > 0 ? [
            { "type": "text", "text": last_message.content },
            ...media
        ] : last_message.content;
    } else {
        messages = media;
    }
    if (!message) {
        message = last_message?.content;
    }
    if (provider == "Puter") {
        if (model == "dall-e-3" || model.includes("FLUX")) {
            puter.ai.txt2img(message, false).then(async (image) => {
                let dirName = puter.randName();
                let fileName = sanitize(message, " ") + ".png";
                await puter.fs.mkdir(dirName);
                let site;
                try {
                    site = await puter.hosting.create(dirName, dirName);
                } catch {
                    site = await puter.hosting.get(dirName);
                }
                await puter.fs.write(`${dirName}/${fileName}`, await fetch(image.src).then((response) => response.blob()));
                const url = `https://${site.subdomain}.puter.site/${encodeURIComponent(fileName)}`;
                await add_message(
                    window.conversation_id,
                    "assistant",
                    `[![${sanitize(message, ' ')}](${url})](${url})`,
                    null,
                    message_index,
                );
                await load_conversation(await get_conversation(conversation_id));
                safe_remove_cancel_button();
                load_conversations();
                hide_sidebar();
            }).catch((error) => {
                safe_remove_cancel_button();
                console.error("Error on generate image:", error);
            });
            return;
        }
        puter.ai.chat(messages = messages, { "model": model }, false)
            .then(async (response) => {
                await add_message(
                    window.conversation_id,
                    "assistant",
                    response.message.content,
                    null,
                    message_index,
                    null,
                    null,
                    null,
                    null,
                    null,
                    response.message.reasoning_content ? { text: response.message.reasoning_content, status: "" } : null
                );
                await load_conversation(await get_conversation(conversation_id));
                safe_remove_cancel_button();
                load_conversations();
                hide_sidebar();
            })
            .catch((error) => {
                safe_remove_cancel_button();
                console.error("Error on generate text:", error);
            });
        return;
    } else if (provider == "Live") {
        async function generate_text(prompt, model) {
            let content
            const apiKey = localStorage.getItem("PollinationsAI-api_key");
            let headers = apiKey ? { "Authorization": apiKey } : {};
            headers = { "Content-Type": "application/json", ...headers };
            let seed = regenerate ? Math.floor(Date.now() / 1000) : "";
            if (prompt == "hello") {
                seed = "";
            }
            let textUrl = `https://text.pollinations.ai/openai`;
            let method = "POST";
            let body = {
                messages: messages,
                model: model,
                seed: seed
            };
            if (model == "openai-audio") {
                body.audio = { voice: "alloy", format: "mp3" };
                body.modalities = ["text", "audio"];
            }
            await fetch(textUrl, { method: method, body: JSON.stringify(body), headers: headers })
                .then(async (response) => {
                    if (!response.ok) {
                        content_map.inner.innerHTML = framework.markdown(`${framework.translate('**An error occured:**')} ${await response.text()}`);
                        safe_remove_cancel_button();
                        return;
                    }
                    const mimeType = response.headers.get("Content-Type");
                    let result;
                    if (mimeType && mimeType.startsWith("text/")) {
                        content = await response.text();
                    } else if (mimeType && mimeType.startsWith("audio/")) {
                        content = `<audio controls src="${textUrl}"></audio>`
                    } else if (mimeType && mimeType.startsWith("application/json")) {
                        result = await response.json();
                        if (result.choices[0].message.audio) {
                            content = `<audio controls></audio>`;
                            content = `${content}\n\n${result.choices[0].message.audio.transcript}`
                        } else {
                            content = result.choices[0].message.content;
                        }
                    } else {
                        content = `<iframe src="${textUrl}"></iframe>`;
                    }
                    await add_message(
                        window.conversation_id,
                        "assistant",
                        content,
                        { name: providerSelect.options[providerSelect.selectedIndex]?.text, model: result?.model || model },
                        message_index,
                        null,
                        regenerate,
                        null,
                        null,
                        result?.usage || null,
                        result?.choices[0].message.reasoning_content ? { text: result.choices[0].message.reasoning_content, status: "" } : null
                    );
                    await load_conversation(await get_conversation(conversation_id));
                    safe_remove_cancel_button();
                    play_last_message(result);
                    load_conversations();
                    hide_sidebar();
                })
                .catch((error) => {
                    safe_remove_cancel_button();
                    console.error("Error on generate text:", error);
                });
            return;
        }
        async function generate_image(prompt, model) {
            let seed = Math.floor(Date.now() / 1000);
            seed = `&seed=${seed}`;
            if (prompt == "hello") {
                seed = "";
            }
            const image = `https://image.pollinations.ai/prompt/${encodeURI(prompt)}?model=${encodeURIComponent(model)}${seed}&nologo=true`;
            await fetch(image)
                .then(async (response) => {
                    if (!response.ok) {
                        content_map.inner.innerHTML = framework.markdown(`${framework.translate('**An error occured:**')} ${await response.text()}`);
                        safe_remove_cancel_button();
                        return;
                    }
                    await add_message(
                        window.conversation_id,
                        "assistant",
                        `[![${sanitize(message, ' ')}](${image})](${image})`,
                        null,
                        message_index,
                    );
                    await load_conversation(await get_conversation(conversation_id));
                    safe_remove_cancel_button();
                    load_conversations();
                    hide_sidebar();
                })
                .catch((error) => {
                    console.error("Error on generate image:", error);
                    safe_remove_cancel_button();
                });
        }
        if (modelProvider.options[modelProvider.selectedIndex]?.dataset.image) {
            return generate_image(message, model);
        }
        return generate_text(message, model);
    }
    try {
        let apiKey;
        if (is_demo && !provider) {
            apiKey = localStorage.getItem("HuggingFace-api_key");
        } else {
            apiKey = get_api_key_by_provider(provider);
        }
        const downloadMedia = document.getElementById("download_media")?.checked;
        let apiBase;
        if (provider == "Custom") {
            apiBase = document.getElementById("api_base")?.value;
            if (!apiBase) {
                provider = "";
            }
        }
        const ignored = Array.from(settings.querySelectorAll("input.provider:not(:checked)")).map((el) => el.value);
        const extraBody = {};
        for (const el of document.getElementById(`${provider}-form`)?.querySelectorAll(".saved input, .saved textarea") || []) {
            let value = el.type == "checkbox" ? el.checked : el.value;
            try {
                value = await JSON.parse(value);
            } catch (e) {
            }
            extraBody[el.name] = value;
        };
        const isAutomaticOrientation = appStorage.getItem("automaticOrientation") != "false";
        const aspectRatio = isAutomaticOrientation ? (window.innerHeight > window.innerWidth ? "9:16" : "16:9") : null;
        let conversationData = null;
        if (provider == "AnyProvider") {
            conversationData = conversation.data;
        } else if (provider && conversation.data && provider in conversation.data) {
            conversationData = conversation.data[provider];
        }
        controller_storage[message_id] = new AbortController();
        await api("conversation", {
            id: message_id,
            conversation_id: window.conversation_id,
            conversation: conversationData,
            model: model,
            web_search: switchInput.checked,
            provider: provider,
            messages: messages,
            action: action,
            download_media: downloadMedia,
            api_key: apiKey,
            api_base: apiBase,
            ignored: ignored,
            aspect_ratio: aspectRatio,
            ...extraBody
        }, Object.values(image_storage), message_id, finish_message);
    } catch (e) {
        console.error(e);
    }
};