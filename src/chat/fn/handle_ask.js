import { scroll_to_bottom } from "./scroll_to_bottom"
import { count_input } from "./count_input"
import { add_conversation } from "./add_conversation"
import { add_message } from "./add_message";
import { get_message_id } from "./get_message_id";
import framework from "./framework";
import { count_words_and_tokens } from "./count_words_and_tokens";
import { get_selected_model } from "./get_selected_model";
import { highlight } from "./highlight";
import { ask_gpt } from "./ask_gpt";
import { connectToSSE } from "./connectToSSE";
export const handle_ask = async (do_ask_gpt = true, message = null) => {
    await scroll_to_bottom();
    let countTokensEnabled = true
    if (!message) {
        message = userInput.value.trim();
        if (!message) {
            return;
        }
        userInput.value = "";
        await count_input()
    }

    // Is message a url?
    const expression = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gi;
    const regex = new RegExp(expression);
    if (!Array.isArray(message) && message.match(regex)) {
        paperclip.classList.add("blink");
        const blob = new Blob([JSON.stringify([{ url: message }])], { type: 'application/json' });
        const file = new File([blob], 'downloads.json', { type: 'application/json' }); // Create File object
        let formData = new FormData();
        formData.append('files', file); // Append as a file
        const bucket_id = generateUUID();
        await fetch(`${framework.backendUrl}/backend-api/v2/files/${bucket_id}`, {
            method: 'POST',
            body: formData
        });
        connectToSSE(`${framework.backendUrl}/backend-api/v2/files/${bucket_id}`, false, bucket_id); //Retrieve and refine
        return;
    }
    if (!message.length) {
        return;
    }

    await add_conversation(window.conversation_id);
    let message_index = await add_message(window.conversation_id, "user", message);
    let message_id = get_message_id();

    // create assistant chat buble
    /*
      
    */

    const message_el = document.createElement("ul");
    message_el.classList.add("mt-16");
    message_el.classList.add("message");

    message_el.classList.add("space-y-5");
    message_el.dataset.index = message_index;
    message_el.innerHTML = `
        <li class="py-2 sm:py-4 user text-gray-800 dark:text-white bordered border">
          <div class="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div class="max-w-2xl flex gap-x-2 sm:gap-x-4">
              <span class="shrink-0 inline-flex items-center justify-center size-9.5 rounded-full bg-gray-600">
       
                <span class="text-sm font-medium text-white">AZ</span>
              </span>

              <div class="grow mt-2 space-y-3content">
                <p class="content_inner">
                 ${framework.markdown(message)}
                </p>
                <div class="count">
                ${countTokensEnabled ? count_words_and_tokens(message, get_selected_model()?.value) : ""}
            </div>
              </div>
            </div>
          </div>
        </li>
    `;
    chatBody.appendChild(message_el);
    highlight(message_el);
    if (do_ask_gpt) {
        const all_pinned = document.querySelectorAll(".buttons button.pinned")
        if (all_pinned.length > 0) {
            all_pinned.forEach((el, idx) => ask_gpt(
                idx == 0 ? message_id : get_message_id(),
                -1,
                idx != 0,
                el.dataset.provider,
                el.dataset.model
            ));
        } else {
            await ask_gpt(message_id, -1, false, null, null, "next", message);
        }
    } else {
        await safe_load_conversation(window.conversation_id, true);
        await load_conversations();
    }
};
