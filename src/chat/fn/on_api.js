import { load_version } from "./load_version";
import { codeButton, settings, slide_systemPrompt_icon, providerSelect, searchButton, switchInput, hide_systemPrompt } from "../constant"
import framework from "./framework";
import { api } from "./api";
import { get_recognition_language } from "./get_recognition_language"
import { load_provider_models } from "./load_provider_models"
import { load_provider_login_urls } from "./load_provider_login_urls";
import { load_settings } from "./load_settings";
import { handle_ask } from "./handle_ask";
import { load_providers } from "./load_providers"
let stopRecognition = () => { };

export
    async function on_api() {
    const appStorage = window.appStorage
    load_version();
    let prompt_lock = false;
    userInput.addEventListener("keydown", async (evt) => {
        if (prompt_lock) return;
        // If not mobile and not shift enter
        let do_enter = userInput.value.endsWith("\n\n\n\n");
        if (do_enter || !window.matchMedia("(pointer:coarse)").matches && evt.keyCode === 13 && !evt.shiftKey) {
            evt.preventDefault();
            console.log("pressed enter");
            prompt_lock = true;
            setTimeout(() => prompt_lock = false, 3000);
            await handle_ask(!do_enter);
        }
    });
    let timeoutBlur = null;
    userInput.addEventListener("focus", async (evt) => {
        userInput.style.height = "100%";
    });
    userInput.addEventListener("blur", async (evt) => {
        timeoutBlur = setTimeout(() => userInput.style.height = "", 200);
    });
    codeButton.addEventListener("click", async () => {
        clearTimeout(timeoutBlur);
        userInput.value = userInput.value.trim() ? userInput.value.trim() + "\n```\n" : "```\n";
        userInput.focus();
    });
    sendButton.addEventListener(`click`, async () => {
        console.log("clicked send");
        if (prompt_lock) return;
        prompt_lock = true;
        setTimeout(() => prompt_lock = false, 3000);
        stopRecognition();
        await handle_ask();
    });
    addButton.addEventListener(`click`, async () => {
        stopRecognition();
        await handle_ask(false);
    });
    userInput.addEventListener(`click`, async () => {
        stopRecognition();
    });

    let providersListContainer = document.createElement("div");
    providersListContainer.classList.add("field", "collapsible");
    providersListContainer.innerHTML = `
        <div class="collapsible-header">
            <span class="label">${framework.translate('Providers API key')}</span>
            <i class="fa-solid fa-chevron-down"></i>
        </div>
        <div class="collapsible-content api-key hidden"></div>
    `;
    settings.querySelector(".paper").appendChild(providersListContainer);

    providersListContainer.querySelector(".collapsible-header").addEventListener('click', (e) => {
        providersListContainer.querySelector(".collapsible-content").classList.toggle('hidden');
        providersListContainer.querySelector(".collapsible-header").classList.toggle('active');
    });

    let provider_options = [];
    api("models").then((models) => {
        models.forEach((model) => {
            is_demo = model.demo;
        });
        if (is_demo) {
            providerSelect.innerHTML += `
                <option value="DeepSeekAPI">DeepSeek Provider</option>
                <option value="Cloudflare">Cloudflare</option>
                <option value="PerplexityLabs">Perplexity Labs</option>
                <option value="Together">Together</option>
                <option value="GeminiPro">Gemini Pro</option>
                <option value="Video">Video Provider</option>
                <option value="HuggingFace">HuggingFace</option>
                <option value="HuggingFaceMedia">HuggingFace (Image/Video Generation)</option>
                <option value="HuggingSpace">HuggingSpace</option>
                <option value="HuggingChat">HuggingChat</option>`;
            document.getElementById("refine")?.parentElement.classList.add("hidden")
            const track_usage = document.getElementById("track_usage");
            track_usage.checked = true;
            track_usage.disabled = true;
            Array.from(modelSelect.querySelectorAll(':not([data-providers])')).forEach((option) => {
                if (!option.disabled && option.value) {
                    option.remove();
                }
            });
            load_provider_login_urls(providersListContainer);
            load_settings(provider_options);
        } else {
            api("providers").then((providers) => load_providers(providers, provider_options, providersListContainer));
        }
        load_provider_models(appStorage.getItem("provider"));
    }).catch(async (e) => {
        console.log(e)
        const providerValue = appStorage.getItem("provider") || "Live";
        providerSelect.innerHTML = `<option value="Live" ${providerValue == "Live" ? "selected" : ""}>Pollinations AI (live)</option>
            <option value="Puter" ${providerValue == "Puter" ? "selected" : ""}>Puter.js AI (live)</option>`;
        await load_provider_models(providerSelect.value);
        await load_provider_login_urls(providersListContainer);
        await load_settings(provider_options);
    });

    const update_systemPrompt_icon = (checked) => {
        slide_systemPrompt_icon.classList[checked ? "remove" : "add"]("fa-angles-up");
        slide_systemPrompt_icon.classList[checked ? "add" : "remove"]("fa-angles-down");
        chatPrompt.classList[checked ? "add" : "remove"]("hidden");
    };
    if (appStorage.getItem("hide_systemPrompt") == "true") {
        update_systemPrompt_icon(true);
    }
    slide_systemPrompt_icon.addEventListener("click", () => {
        update_systemPrompt_icon(slide_systemPrompt_icon.classList.contains("fa-angles-up"));
    });
    hide_systemPrompt.addEventListener('change', async (event) => {
        update_systemPrompt_icon(event.target.checked);
    });
    const userInputHeight = appStorage.getItem("userInput-height");
    if (userInputHeight) {
        userInput.style.maxHeight = `${userInputHeight}px`;
    }
    const darkMode = document.getElementById("darkMode");
    if (darkMode) {
        darkMode.addEventListener('change', async (event) => {
            if (event.target.checked) {
                document.body.classList.remove("white");
            } else {
                document.body.classList.add("white");
            }
        });
    }

    const method = switchInput.checked ? "add" : "remove";
    searchButton.classList[method]("active");
    document.getElementById('recognition-language').placeholder = await get_recognition_language();
}
