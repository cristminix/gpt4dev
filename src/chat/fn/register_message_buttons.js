import { chatBody } from "../constant";
import { get_message_el } from "./get_message_el"
import { load_provider_parameters } from "./load_provider_parameters"
import { remove_message } from "./remove_message"
import { safe_load_conversation } from "./safe_load_conversation"
import { ask_gpt } from "./ask_gpt"
import { get_message_id } from "./get_message_id"
export const register_message_buttons = async () => {
    chatBody.querySelectorAll(".message .content .provider").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        const provider_link = el.querySelector("a");
        provider_link?.addEventListener("click", async (event) => {
            event.preventDefault();
            await load_provider_parameters(el.dataset.provider);
            const provider_forms = document.querySelector(".provider_forms");
            const provider_form = provider_forms.querySelector(`#${el.dataset.provider}-form`);
            if (provider_form) {
                provider_form.classList.remove("hidden");
                provider_forms.classList.remove("hidden");
                chat.classList.add("hidden");
            }
            return false;
        });
    });

    chatBody.querySelectorAll(".message .fa-xmark").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            const message_el = get_message_el(el);
            if (message_el) {
                if ("index" in message_el.dataset) {
                    await remove_message(window.conversation_id, message_el.dataset.index);
                    chatBody.removeChild(message_el);
                }
            }
            await safe_load_conversation(window.conversation_id, false);
        });
    });

    chatBody.querySelectorAll(".message .fa-clipboard").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            let message_el = get_message_el(el);
            let response = await fetch(message_el.dataset.object_url);
            let copyText = await response.text();
            try {
                if (!navigator.clipboard) {
                    throw new Error("navigator.clipboard: Clipboard API unavailable.");
                }
                await navigator.clipboard.writeText(copyText);
            } catch (e) {
                console.error(e);
                console.error("Clipboard API writeText() failed! Fallback to document.exec(\"copy\")...");
                fallback_clipboard(copyText);
            }
            el.classList.add("clicked");
            setTimeout(() => el.classList.remove("clicked"), 1000);
        });
    })

    chatBody.querySelectorAll(".message .fa-file-export").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            const elem = window.document.createElement('a');
            let filename = `chat ${new Date().toLocaleString()}.txt`.replaceAll(":", "-");
            const conversation = await get_conversation(window.conversation_id);
            let buffer = "";
            conversation.items.forEach(message => {
                if (message.reasoning) {
                    buffer += render_reasoning_text(message.reasoning);
                }
                buffer += `${message.role == 'user' ? 'User' : 'Assistant'}: ${message.content.trim()}\n\n`;
            });
            var download = document.getElementById("download");
            download.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(buffer.trim()));
            download.setAttribute("download", filename);
            download.click();
            el.classList.add("clicked");
            setTimeout(() => el.classList.remove("clicked"), 1000);
        });
    })

    chatBody.querySelectorAll(".message .fa-volume-high").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            const message_el = get_message_el(el);
            let audio;
            if (message_el.dataset.synthesize_url) {
                el.classList.add("active");
                setTimeout(() => el.classList.remove("active"), 2000);
                const media_player = document.querySelector(".media-player");
                if (!media_player.classList.contains("show")) {
                    media_player.classList.add("show");
                    audio = new Audio(message_el.dataset.synthesize_url);
                    audio.controls = true;
                    media_player.appendChild(audio);
                } else {
                    audio = media_player.querySelector("audio");
                    audio.src = message_el.dataset.synthesize_url;
                }
                audio.play();
                return;
            }
        });
    });

    chatBody.querySelectorAll(".message .regenerate_button").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            const message_el = get_message_el(el);
            el.classList.add("clicked");
            setTimeout(() => el.classList.remove("clicked"), 1000);
            await ask_gpt(get_message_id(), message_el.dataset.index);
        });
    });

    chatBody.querySelectorAll(".message .continue_button").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            if (!el.disabled) {
                el.disabled = true;
                const message_el = get_message_el(el);
                el.classList.add("clicked");
                setTimeout(() => { el.classList.remove("clicked"); el.disabled = false }, 1000);
                await ask_gpt(get_message_id(), message_el.dataset.index, false, null, null, "continue");
            }
        });
    });

    chatBody.querySelectorAll(".message .fa-whatsapp").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            const text = get_message_el(el).innerText;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        });
    });

    chatBody.querySelectorAll(".message .fa-print").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            const message_el = get_message_el(el);
            el.classList.add("clicked");
            chatBody.scrollTop = 0;
            message_el.classList.add("print");
            setTimeout(() => {
                el.classList.remove("clicked");
                message_el.classList.remove("print");
            }, 1000);
            window.print()
        });
    });

    chatBody.querySelectorAll(".message .fa-qrcode").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            iframe.src = '/qrcode.html' + (window.conversation_id ? `#${window.conversation_id}` : '');
            iframe_container.classList.remove("hidden");
        });
    });

    chatBody.querySelectorAll(".message .reasoning_title").forEach(async (el) => {
        if (el.dataset.click) {
            return
        }
        el.dataset.click = true;
        el.addEventListener("click", async () => {
            let text_el = el.parentElement.querySelector(".reasoning_text");
            if (text_el) {
                text_el.classList.toggle("hidden");
            }
        });
    });
}