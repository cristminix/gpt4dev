import { box_conversations, regenerate_button } from "../constant";
import { filter_message_content } from "./filter_message_content"
import { merge_messages } from "./merge_messages"
import framework from "./framework";
import { count_words_and_tokens } from "./count_words_and_tokens"
import { prepare_messages } from "./prepare_messages"
import { register_message_buttons } from "./register_message_buttons"
import { highlight } from "./highlight";
import { render_reasoning } from "./render_reasoning"
export const load_conversation = async (conversation, appStorage, suggestions) => {
    if (!conversation) {
        return;
    }
    let lastUpdated = conversation.updated;
    let messages = conversation?.items || [];
    console.debug("Conversation:", conversation.id)

    let conversation_title = conversation.new_title || conversation.title;
    let title = conversation_title ? `${conversation_title} - G4F` : window.title;
    if (title) {
        document.title = title;
    }
    const chatHeader = document.querySelector(".chat-top-panel .convo-title");
    if (conversation.share) {
        chatHeader.innerHTML = '<i class="fa-solid fa-qrcode"></i> ' + framework.escape(conversation_title);
    } else if (window.conversation_id) {
        chatHeader.innerText = conversation_title;
    }

    if (chatPrompt) {
        chatPrompt.value = conversation.system || "";
    }

    let elements = [];
    let last_model = null;
    let providers = [];
    let buffer = "";
    let completion_tokens = 0;

    messages.forEach((item, i) => {
        if (item.continue) {
            elements.pop();
        } else {
            buffer = "";
        }
        buffer = filter_message_content(buffer);
        let new_content = filter_message_content(item.content);
        buffer = merge_messages(buffer, new_content);
        last_model = item.provider?.model;
        providers.push(item.provider?.name);
        let next_i = parseInt(i) + 1;
        let next_provider = item.provider ? item.provider : (messages.length > next_i ? messages[next_i].provider : null);
        let provider_label = item.provider?.label ? item.provider.label : item.provider?.name;
        let provider_link = item.provider?.name ? `<a href="${item.provider.url}" target="_blank">${provider_label}</a>` : "";
        let provider = provider_link ? `
            <div class="provider" data-provider="${item.provider.name}">
                ${provider_link}
                ${item.provider.model ? ' ' + framework.translate('with') + ' ' + item.provider.model : ''}
            </div>
        ` : "";
        let synthesize_url = "";
        let synthesize_params;
        let synthesize_provider;
        let text = Array.isArray(buffer) && buffer.length ? buffer[0].text : buffer;
        if (!text) {
            text = item.reasoning ? item.reasoning.text : "";
        }
        if (text) {
            if (!framework.backendUrl) {
                synthesize_params = (new URLSearchParams({ input: text, voice: "alloy" })).toString();
                synthesize_url = `https://www.openai.fm/api/generate?${synthesize_params}`;
            } else {
                if (item.synthesize) {
                    synthesize_params = item.synthesize.data
                    synthesize_provider = item.synthesize.provider;
                } else {
                    synthesize_params = { text: text }
                    synthesize_provider = "Gemini";
                }
                synthesize_params = (new URLSearchParams(synthesize_params)).toString();
                synthesize_url = `${framework.backendUrl}/backend-api/v2/synthesize/${synthesize_provider}?${synthesize_params}`;
            }
        }
        const file = new File([text], 'message.md', { type: 'text/plain' });
        const objectUrl = URL.createObjectURL(file);

        let add_buttons = [];
        // Find buttons to add
        let actions = ["variant"]
        // Add continue button if possible
        if (buffer && item.role == "assistant" && !Array.isArray(buffer)) {
            let reason = "stop";
            // Read finish reason from conversation
            if (item.finish && item.finish.reason) {
                reason = item.finish.reason;
            }
            let lines = buffer.trim().split("\n");
            let lastLine = lines[lines.length - 1];
            // Has a stop or error token at the end
            if (lastLine.endsWith("[aborted]") || lastLine.endsWith("[error]")) {
                reason = "error";
                // Has an even number of start or end code tags
            } else if (reason == "stop" && buffer.split("```").length - 1 % 2 === 1) {
                reason = "length";
            }
            if (reason != "stop") {
                actions.push("continue")
            }
        }
        if (item.role === "assistant") {

            add_buttons.push(`
            <button class="hidden"><i class="fa-solid fa-qrcode"></i></button>
            <button class="hidden"><i class="fa-brands fa-whatsapp"></i></button>
            <button title="Read out loud"><i class="fa-solid fa-volume-high"></i></i></button>
            <button class="hidden"><i class="fa-solid fa-print"></i></button>
            <button class="hidden"><i class="fa-solid fa-file-export"></i></button>
            <button title="Copy to clipboard"><i class="fa-regular fa-clipboard"></i></button>
            <button class="hidden"><i class="fa-solid fa-plus"></i></button>
        `);
            if (actions.includes("continue")) {
                if (messages.length >= i - 1) {
                    add_buttons.push(`<button title="Continue response" class="continue_button">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                </button>`);
                }

            }
            if (actions.includes("variant")) {
                add_buttons.push(`<button title="Regenerate" class="regenerate_button">
                <i class="fa-solid fa-rotate"></i>
            </button>`);
            }

        }

        let countTokensEnabled = window.appStorage.getItem("countTokens") != "false";
        let next_usage;
        let prompt_tokens;

        if (countTokensEnabled) {
            if (!item.continue) {
                completion_tokens = 0;
            }
            completion_tokens += item.usage?.completion_tokens ? item.usage.completion_tokens : 0;
            next_usage = messages.length > next_i ? messages[next_i].usage : null;
            prompt_tokens = next_usage?.prompt_tokens ? next_usage?.prompt_tokens : 0
        }
        console.log(`${item.role}`)
        if (item.role === "assistant") {
            elements.push(`
                        <ul class="text-gray-800 dark:text-white mt-8 space-y-5 message${item.regenerate ? " regenerate" : ""}" data-index="${i}" data-object_url="${objectUrl}" data-synthesize_url="${synthesize_url}">
                            <li class="${item.role} max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">
                                ${item.role == "assistant" ? gpt_image : user_image}
                                ${item.role == "assistant"
                    ? `<i class="fa-regular fa-phone-arrow-down-left"></i>`
                    : `<i class="fa-regular fa-phone-arrow-up-right"></i>`
                }
                                <div class="space-y-3">
                                    <div class="content mb-1.5 text-gray-800 dark:text-white">
                                        ${provider}
                                <div class="content_inner">
                                    ${item.reasoning ? render_reasoning(item.reasoning, true) : ""}
                                    ${framework.markdown(buffer)}
                                </div>
                                <div class="chat-item-footer">
                                <div class="count hidden">
                                    ${countTokensEnabled ? count_words_and_tokens(
                    item.reasoning ? item.reasoning.text + text : text,
                    next_provider?.model, completion_tokens, prompt_tokens
                ) : ""}
                                    
                                </div>${add_buttons.join("")}
                                    </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    `);
        } else {
            elements.push(`
            <ul class=" text-gray-800 dark:text-white mt-16 space-y-5 message${item.regenerate ? " regenerate" : ""}" data-index="${i}" data-object_url="${objectUrl}" data-synthesize_url="${synthesize_url}">
                <li class="${item.role} max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto text-right">
                   
                    
                    <div class="space-y-3">
                        <div class="content mb-1.5 text-gray-800 dark:text-white">
                            ${provider}
                    <div class="content_inner_user">
                        ${framework.markdown(buffer)}
                    </div>
                    <div class="count hidden">
                        ${countTokensEnabled ? count_words_and_tokens(
                item.reasoning ? item.reasoning.text + text : text,
                next_provider?.model, completion_tokens, prompt_tokens
            ) : ""}
                    </div>
                        </div>
                    </div>
                </li>
            </ul>
        `);
        }

    });
    chatBody.innerHTML = elements.join("");

    chatBody.querySelectorAll("video").forEach((el) => {
        el.onloadedmetadata = () => {
            if (el.videoWidth > 0) {
                el.muted = true;
                el.loop = true;
                el.autoplay = true;
                el.play()
            } else {
                el.style.width = "300px";
                el.style.height = "40px";
            }
        }
    });
    let countTokensEnabled = true
    if (suggestions) {
        /*
        <li class="py-2 sm:py-4">
          <div class="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div class="max-w-2xl flex gap-x-2 sm:gap-x-4">
              <div>
                <div class="text-end">
                  <button type="button" class="ms-1.5 mb-1.5 py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-lg border border-blue-600 bg-white text-blue-600 align-middle hover:bg-blue-50 focus:outline-hidden focus:bg-blue-50 text-sm dark:bg-neutral-900 dark:text-blue-500 dark:border-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400 dark:focus:text-blue-400 dark:focus:border-blue-400">
                    What is the use of Tailwind CSS?
                  </button>
                  <button type="button" class="ms-1.5 mb-1.5 py-2 px-3 inline-flex justify-center items-center gap-x-2 rounded-lg border border-blue-600 bg-white text-blue-600 align-middle hover:bg-blue-50 focus:outline-hidden focus:bg-blue-50 text-sm dark:bg-neutral-900 dark:text-blue-500 dark:border-blue-500 dark:hover:text-blue-400 dark:hover:border-blue-400 dark:focus:text-blue-400 dark:focus:border-blue-400">
                    What is the difference between Tailwind CSS and CSS?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
        */
        const suggestions_el = document.createElement("ul");
        suggestions_el.classList.add("suggestions");
        suggestions_el.classList.add("py-2", "sm:py-4");
        const suggestion_items = document.createElement("div");
        suggestion_items.classList.add("max-w-4xl", "px-4", "sm:px-6", "lg:px-8", "mx-auto");
        const suggestion_buttons = document.createElement("div");
        suggestion_buttons.classList.add("max-w-2xl", "flex", "gap-x-2", "sm:gap-x-4");

        const suggestion_cnt = document.createElement("div");

        const suggestion_cnt_02 = document.createElement("div");
        suggestion_cnt_02.classList.add("text-end");

        suggestion_buttons.appendChild(suggestion_cnt);
        suggestion_buttons.appendChild(suggestion_cnt_02);
        suggestion_items.appendChild(suggestion_buttons);
        suggestions_el.appendChild(suggestion_items);

        suggestions.forEach((suggestion) => {
            const el = document.createElement("div");
            el.classList.add("ms-1.5", "mb-1.5", "py-2", "px-3", "inline-flex", "justify-center", "items-center", "gap-x-2", "rounded-lg", "border", "border-blue-600", "bg-white", "text-blue-600", "align-middle", "hover:bg-blue-50", "focus:outline-hidden", "focus:bg-blue-50", "text-sm", "dark:bg-neutral-900", "dark:text-blue-500", "dark:border-blue-500", "dark:hover:text-blue-400", "dark:hover:border-blue-400", "dark:focus:text-blue-400", "dark:focus:border-blue-400");
            el.innerHTML = `<button>${framework.escape(suggestion)}</button> <i class="fa-solid fa-turn-up"></i>`;
            el.onclick = async () => {
                suggestions = null;
                await handle_ask(true, suggestion);
            }
            suggestion_cnt_02.appendChild(el);
        });
        chatBody.appendChild(suggestions_el);
    } else if (countTokensEnabled && window.GPTTokenizer_cl100k_base) {
        let filtered = prepare_messages(messages, null, true, false);
        filtered = filtered.filter((item) => !Array.isArray(item.content) && item.content);
        if (filtered.length > 0) {
            last_model = last_model?.startsWith("gpt-3") ? "gpt-3.5-turbo" : "gpt-4"
            let count_total = GPTTokenizer_cl100k_base?.encodeChat(filtered, last_model).length
            if (count_total > 0) {
                const count_total_el = document.createElement("ul");
                count_total_el.classList.add("mt-16", "space-y-5", "message");
                count_total_el.innerHTML = `<li class="text-gray-800 dark:text-white max-w-4xl py-2 px-4 sm:px-6 lg:px-8 mx-auto flex gap-x-2 sm:gap-x-4">${framework.translate("{0} total tokens").replace("{0}", count_total)}</li>`;
                chatBody.appendChild(count_total_el);
            }
        }
    }

    await register_message_buttons();
    highlight(chatBody);
    regenerate_button.classList.remove("regenerate-hidden");
    // chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
};