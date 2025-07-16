import { add_pinned } from "./fn/add_pinned.js";
import {
    chatBody,
    userInput,
    codeButton,
    box_conversations,
    stop_generating,
    regenerate_button,
    sidebar,
    sidebar_buttons,
    sendButton,
    addButton,
    imageInput,
    mediaSelect,
    imageSelect,
    cameraInput,
    audioButton,
    linkButton,
    fileInput,
    microLabel,
    inputCount,
    providerSelect,
    modelSelect,
    modelProvider,
    custom_model,
    chatPrompt,
    settings,
    chat,
    album,
    log_storage,
    switchInput,
    searchButton,
    paperclip,
    hide_systemPrompt,
    slide_systemPrompt_icon,
    optionElementsSelector,
    translationSnipptes,
    login_urls_storage,
    modelTags,
} from "./constant.js";
import { enhanceFileUpload } from "./fn/enhanceFileUpload.js";
import { formatFileSize } from "./fn/formatFileSize.js";

import framework from "./fn/framework.js";
import { get_api_key_by_provider } from "./fn/get_api_key_by_provider.js";
import { get_conversation_data } from "./fn/get_conversation_data.js";
import { get_message_id } from "./fn/get_message_id.js";
import { get_recognition_language } from "./fn/get_recognition_language.js";
import { injectPuter } from "./fn/injectPuter.js";
import { load_provider_login_urls } from "./fn/load_provider_login_urls.js";
import { load_version } from "./fn/load_version.js";
import { merge_messages } from "./fn/merge_messages.js";
import { read_response } from "./fn/read_response.js";
import { safe_load_conversation } from "./fn/safe_load_conversation.js";
import { set_conversation_title } from "./fn/set_conversation_title.js";
import { toLocaleDateString } from "./fn/toLocaleDateString.js";
import { count_words_and_tokens } from "./fn/count_words_and_tokens.js";
import { new_conversation } from "./fn/new_conversation.js"
import { setupDragAndDrop } from "./fn/setupDragAndDrop.js";
import { set_conversation } from "./fn/set_conversation"
import { on_load } from "./fn/on_load.js";
import { get_conversation } from "./fn/get_conversation"
import { on_api } from "./fn/on_api.js";
import { load_conversations } from "./fn/load_conversations.js";
import { load_conversation } from "./fn/load_conversation.js";
import { count_tokens } from "./fn/count_tokens.js";
import { get_selected_model } from "./fn/get_selected_model.js";
import { count_input } from "./fn/count_input.js";
import { load_provider_models } from "./fn/load_provider_models.js";
import { initListeners } from "./fn/initListeners"
import { ask_gpt } from "./fn/ask_gpt.js";
translationSnipptes.push.apply(translationSnipptes, Object.values(modelTags));


framework.init({
    translations: true
});

window.provider_storage = {};
window.message_storage = {};
window.controller_storage = {};
window.content_storage = {};
window.error_storage = {};
window.synthesize_storage = {};
window.title_storage = {};
window.parameters_storage = {};
window.finish_storage = {};
window.usage_storage = {};
window.continue_storage = {};
window.reasoning_storage = {};
window.title_ids_storage = {};
window.image_storage = {};
window.is_demo = false;
window.wakeLock = null;
window.countTokensEnabled = true;
window.privateConversation = null;
window.suggestions = null;
window.lastUpdated = null;
window.mediaRecorder = null;
window.mediaChunks = [];
window.stopRecognition = () => { };
window.providerModelSignal = null;
window.new_conversation = new_conversation
window.set_conversation = set_conversation
window.appStorage = window.localStorage || {
    setItem: (key, value) => self[key] = value,
    getItem: (key) => self[key],
    removeItem: (key) => delete self[key],
    length: 0
}
window.appStorage = appStorage;

const iframe_container = document.querySelector(".hljs-iframe-container");
const iframe = document.querySelector(".hljs-iframe");
const iframe_close = Object.assign(document.createElement("button"), {
    className: "hljs-iframe-close",
    innerHTML: '<i class="fa-regular fa-x"></i>',
});
iframe_close.onclick = () => {
    iframe_container.classList.add("hidden");
    iframe.src = "";
}
iframe_container.appendChild(iframe_close);



regenerate_button.addEventListener("click", async () => {
    regenerate_button.classList.add("regenerate-hidden");
    setTimeout(() => regenerate_button.classList.remove("regenerate-hidden"), 3000);
    const all_pinned = document.querySelectorAll(".buttons button.pinned")
    if (all_pinned.length > 0) {
        all_pinned.forEach((el) => ask_gpt(get_message_id(), -1, true, el.dataset.provider, el.dataset.model, "variant"));
    } else {
        await ask_gpt(get_message_id(), -1, true, null, null, "variant");
    }
});

stop_generating.addEventListener("click", async () => {
    regenerate_button.classList.remove("regenerate-hidden");
    stop_generating.classList.add("stop_generating-hidden");
    let key;
    for (key in controller_storage) {
        if (!controller_storage[key].signal.aborted) {
            console.log(`aborted ${window.conversation_id} #${key}`);
            try {
                controller_storage[key].abort();
            } finally {
                let message = message_storage[key];
                if (message) {
                    content_storage[key].inner.innerHTML += " [aborted]";
                    message_storage[key] += " [aborted]";
                }
            }
        }
    }
    await safe_load_conversation(window.conversation_id, false);
});

document.querySelector(".media-player .fa-x").addEventListener("click", () => {
    const media_player = document.querySelector(".media-player");
    media_player.classList.remove("show");
    const audio = document.querySelector(".media-player audio");
    media_player.removeChild(audio);
});

document.getElementById("close_provider_forms").addEventListener("click", async () => {
    const provider_forms = document.querySelector(".provider_forms");
    provider_forms.classList.add("hidden");
    chat.classList.remove("hidden");
});






initListeners(translationSnipptes)






let autoScrollEnabled = true;

// setInterval(() => {
//     // Auto-scroll if enabled
//     if (autoScrollEnabled) {
//         chatBody.scrollTop = chatBody.scrollHeight;
//     }
// }, 1000);

chatBody.addEventListener('scroll', () => {
    const atBottom = chatBody.scrollTop + chatBody.clientHeight >= chatBody.scrollHeight - 10;
    autoScrollEnabled = atBottom && chatBody.clientHeight > 0;
});

const hide_input = document.querySelector(".chat-toolbar .hide-input");
hide_input.addEventListener("click", async (e) => {
    const icon = hide_input.querySelector("i");
    const func = icon.classList.contains("fa-angles-down") ? "add" : "remove";
    const remv = icon.classList.contains("fa-angles-down") ? "remove" : "add";
    icon.classList[func]("fa-angles-up");
    icon.classList[remv]("fa-angles-down");
    document.querySelector(".chat-footer .user-input").classList[func]("hidden");
    document.querySelector(".chat-footer .buttons").classList[func]("hidden");
});
/*
sidebar_buttons.forEach((el) => el.addEventListener("click", async () => {
    // Animate sidebar buttons
    sidebar_buttons.forEach((el) => {
        el.classList.toggle("rotated");
    });
    // For desktop
    if (window.innerWidth >= 640) {
        // Toggle between shown and minimized only
        if (sidebar.classList.contains("shown")) {
            // Change from shown to minimized
            sidebar.classList.remove("shown");
            sidebar.classList.add("minimized");
        } else {
            // Change from minimized to shown
            sidebar.classList.remove("minimized");
            sidebar.classList.add("shown");
        }
    }
    // For mobile
    else {
        if (sidebar.classList.contains("shown")) {
            // Hide sidebar on mobile
            sidebar.classList.remove("shown");
        } else {
            // Show sidebar on mobile
            sidebar.classList.add("shown");
        }
    }
}));
*/
let countFocus = userInput;

userInput.addEventListener("keyup", count_input);
chatPrompt.addEventListener("keyup", count_input);
chatPrompt.addEventListener("focus", function () {
    countFocus = chatPrompt;
    count_input();
});
chatPrompt.addEventListener("input", function () {
    countFocus = userInput;
    count_input();
});
window.addEventListener("hashchange", (event) => {
    iframe_container.classList.add("hidden");
    iframe.src = "";
    const conversation_id = window.location.hash.replace("#", "");
    if (conversation_id == "menu" || conversation_id == "settings") {
        if (conversation_id == "settings") {
            open_settings();
        }
        return;
    }
    hide_sidebar(true);
    if (conversation_id && conversation_id != "new") {
        window.conversation_id = conversation_id;
        set_conversation(conversation_id);
    } else {
        window.conversation_id = generateUUID();
        new_conversation();
    }
});
window.addEventListener('load', async function () {
    await on_load(translationSnipptes, appStorage);
    await on_api(appStorage);

    let conversation = await get_conversation(window.conversation_id, appStorage);
    if (conversation && !conversation.share) {
        return await load_conversation(conversation, appStorage);
    }
    const response = await fetch(`${framework.backendUrl}/backend-api/v2/chat/${window.conversation_id}`, {
        headers: { 'accept': 'application/json' },
    });
    if (!response.ok) {
        return await load_conversation(conversation);
    }
    conversation = await response.json();
    if (conversation.id == window.conversation_id) {
        await save_conversation(conversation.id, conversation);
        await load_conversations();
    }
    await load_conversation(window.conversation_id);

    // Set default sidebar state based on screen size
    if (window.innerWidth >= 640) { // 40em = 640px
        sidebar.classList.add("shown");
        sidebar.classList.remove("minimized");
    } else {
        sidebar.classList.remove("shown");
    }
    // Ensure sidebar is shown by default on desktop
    if (window.innerWidth >= 640) { // 40em = 640px
        sidebar.classList.add("shown");
        sidebar.classList.remove("minimized");
    }

});

let refreshOnHidden = true;
document.addEventListener("visibilitychange", () => {
    refreshOnHidden = !document.hidden;
});
setInterval(async () => {
    if (!refreshOnHidden || !window.conversation_id) {
        return;
    }
    let conversation = await get_conversation(window.conversation_id);
    if (!conversation || !conversation.share) {
        return
    }
    const response = await fetch(`${framework.backendUrl}/backend-api/v2/chat/${conversation.id}`, {
        headers: {
            'accept': 'application/json',
            'if-none-match': conversation.updated,
        },
    });
    if (response.status == 200) {
        const new_conversation = await response.json();
        if (conversation.id == window.conversation_id && new_conversation.updated != conversation.updated) {
            conversation = new_conversation;
            await save_conversation(conversation.id, conversation);
        }
    }
    if (lastUpdated != conversation.updated) {
        await load_conversations();
        await load_conversation(conversation);
    }
}, 5000);

window.addEventListener('pywebviewready', async function () {
    await on_api();
});

imageInput.onclick = () => {
    mediaSelect.classList.toggle("hidden");
}

mediaSelect.querySelector(".close").onclick = () => {
    if (Object.values(image_storage).length) {
        Object.entries(image_storage).forEach(async ([object_url, file]) => {
            if (file instanceof File) {
                URL.revokeObjectURL(object_url)
            } else if (file.bucket_id) {
                await framework.delete(file.bucket_id);
            }
        });
        image_storage = {};
        renderMediaSelect();
    } else {
        mediaSelect.classList.add("hidden");
    }
}

[imageSelect, cameraInput].forEach((el) => {
    el.addEventListener('change', async () => {
        if (el.files.length) {
            Array.from(el.files).forEach((file) => {
                image_storage[URL.createObjectURL(file)] = file;
            });
            el.value = "";
            renderMediaSelect();
        }
    });
});

audioButton.addEventListener('click', async (event) => {
    const i = audioButton.querySelector("i");
    if (mediaRecorder) {
        i.classList.remove("fa-stop");
        i.classList.add("fa-microphone");
        mediaRecorder.stop();
        if (mediaRecorder.stream) {
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        mediaRecorder = null;
        if (providerSelect.value == "Live") {
            await add_conversation(window.conversation_id);
            await ask_gpt(get_message_id(), -1, false, "Live", "openai-audio", "next");
        }
        return;
    }

    i.classList.remove("fa-microphone");
    i.classList.add("fa-stop");

    stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });

    if (providerSelect.value == "Live") {
        mediaRecorder = new Recorder(stream);
        mediaRecorder.start();
        return;
    }

    if (!MediaRecorder.isTypeSupported('audio/webm')) {
        console.warn('audio/webm is not supported');
    }
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
    });

    mediaRecorder.addEventListener('dataavailable', async event => {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'file-upload-loading';
        loadingIndicator.innerHTML = `
            <div class="upload-spinner"></div>
            <p>${framework.translate("Uploading audio...")}</p>
        `;
        document.body.appendChild(loadingIndicator);
        const formData = new FormData();
        formData.append('files', event.data);
        const bucket_id = generateUUID();
        const response = await fetch(framework.backendUrl + "/backend-api/v2/files/" + bucket_id, {
            method: 'POST',
            body: formData,
            headers: {
                "x-recognition-language": await get_recognition_language()
            }
        });
        document.body.removeChild(loadingIndicator);
        if (!response.ok) {
            inputCount.innerText = framework.translate("Error uploading audio");
            return;
        }
        const result = await response.json()
        if (result.media) {
            const media = [];
            result.media.forEach((part) => {
                part = part.name ? part : { name: part };
                const url = `${framework.backendUrl}/files/${bucket_id}/media/${part.name}`;
                media.push({ bucket_id: bucket_id, url: url, ...part });
            });
            await handle_ask(false, media);
        }
    });

    mediaRecorder.start()
});

linkButton.addEventListener('click', async (event) => {
    const i = audioButton.querySelector("i");
    const link = prompt("Please enter a link");
    if (!link || link.startsWith("http") === false) {
        inputCount.innerText = framework.translate("Invalid link");
        return;
    }
    image_storage[link] = link;
    renderMediaSelect();
});

fileInput.addEventListener('click', async (event) => {
    fileInput.value = '';
});

cameraInput?.addEventListener("click", (e) => {
    if (window?.pywebview) {
        e.preventDefault();
        pywebview.api.take_picture();
    }
});

imageSelect?.addEventListener("click", (e) => {
    if (window?.pywebview) {
        e.preventDefault();
        pywebview.api.choose_image();
    }
});

fileInput.addEventListener('change', async (event) => {
    if (fileInput.files.length) {
        type = fileInput.files[0].name.split('.').pop()
        if (type == "har") {
            return await upload_cookies();
        } else if (type != "json") {
            await upload_files(fileInput);
        }
        fileInput.dataset.type = type
        if (type == "json") {
            const reader = new FileReader();
            reader.addEventListener('load', async (event) => {
                const data = JSON.parse(event.target.result);
                if (data.options && "g4f" in data.options) {
                    let count = 0;
                    Object.keys(data).forEach(key => {
                        if (key == "options") {
                            Object.keys(data[key]).forEach(keyOption => {
                                appStorage.setItem(keyOption, data[key][keyOption]);
                                count += 1;
                            });
                        } else if (!localStorage.getItem(key)) {
                            if (key.startsWith("conversation:")) {
                                appStorage.setItem(key, JSON.stringify(data[key]));
                                count += 1;
                            } else {
                                appStorage.setItem(key, data[key]);
                            }
                        }
                    });
                    await load_conversations();
                    await load_settings_storage();
                    fileInput.value = "";
                    inputCount.innerText = framework.translate('{0} Conversations/Settings were imported successfully').replace('{0}', count);
                } else {
                    is_cookie_file = data.api_key;
                    if (Array.isArray(data)) {
                        data.forEach((item) => {
                            if (item.domain && item.name && item.value) {
                                is_cookie_file = true;
                            }
                        });
                    }
                    if (is_cookie_file) {
                        await upload_cookies();
                    } else {
                        await upload_files(fileInput);
                    }
                }
            });
            reader.readAsText(fileInput.files[0]);
        }
    }
});

if (!window.matchMedia("(pointer:coarse)").matches) {
    document.getElementById("image").setAttribute("multiple", "multiple");
}

chatPrompt?.addEventListener("input", async () => {
    await save_system_message();
});


providerSelect.addEventListener("change", () => {
    load_provider_models()
});
modelProvider.addEventListener("change", () => {
    const favorites = appStorage.getItem("favorites") ? JSON.parse(appStorage.getItem("favorites")) : {};
    const selected = favorites[providerSelect.value] || {};
    if (!selected[modelProvider.value]) {
        let option = document.createElement('option');
        option.value = modelProvider.value;
        option.text = modelProvider.querySelector(`option[value="${modelProvider.value}"]`).text;
        option.selected = true;
        const optgroup = modelProvider.querySelector('optgroup:last-child');
        if (optgroup) {
            optgroup.appendChild(option);
            if (optgroup.childElementCount > 5) {
                delete selected[optgroup.firstChild.value];
                optgroup.removeChild(optgroup.firstChild);
            }
        }
    }
    const selected_values = selected[modelProvider.value] ? selected[modelProvider.value] + 1 : 1;
    delete selected[modelProvider.value];
    selected[modelProvider.value] = selected_values;
    favorites[providerSelect.value] = selected;
    appStorage.setItem("favorites", JSON.stringify(favorites));
});
custom_model.addEventListener("change", () => {
    if (!custom_model.value) {
        load_provider_models();
    }
});

document.getElementById("pin").addEventListener("click", async () => {
    const pin_container = document.getElementById("pin_container");
    let selected_provider = providerSelect.options[providerSelect.selectedIndex];
    selected_provider = selected_provider.value ? selected_provider : null;
    const selected_model = get_selected_model();
    add_pinned(selected_provider, selected_model);
});

(async () => {
    JSON.parse(appStorage.getItem("pinned") || "[]").forEach((el) => {
        add_pinned(el.provider, el.model, false);
    });
})();

switchInput.addEventListener("change", () => {
    const method = switchInput.checked ? "add" : "remove";
    searchButton.classList[method]("active");
});
searchButton.addEventListener("click", async () => {
    switchInput.click();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const mircoIcon = microLabel.querySelector("i");
    mircoIcon.classList.add("fa-microphone");
    mircoIcon.classList.remove("fa-microphone-slash");

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let startValue;
    let buffer;
    let lastDebounceTranscript;
    recognition.onstart = function () {
        startValue = userInput.value;
        lastDebounceTranscript = "";
        userInput.readOnly = true;
        buffer = "";
    };
    recognition.onend = function () {
        if (buffer) {
            userInput.value = `${startValue ? startValue + "\n" : ""}${buffer}`;
        }
        if (microLabel.classList.contains("recognition")) {
            recognition.start();
        } else {
            userInput.readOnly = false;
            userInput.focus();
        }
    };
    recognition.onresult = function (event) {
        if (!event.results) {
            return;
        }
        let result = event.results[event.resultIndex];
        let isFinal = result.isFinal && (result[0].confidence > 0);
        let transcript = result[0].transcript;
        if (isFinal) {
            if (transcript == lastDebounceTranscript) {
                return;
            }
            lastDebounceTranscript = transcript;
        }
        if (transcript) {
            inputCount.innerText = transcript;
            if (isFinal) {
                buffer = `${buffer ? buffer + "\n" : ""}${transcript.trim()}`;
            }
        }
    };

    stopRecognition = () => {
        if (microLabel.classList.contains("recognition")) {
            microLabel.classList.remove("recognition");
            recognition.stop();
            userInput.value = `${startValue ? startValue + "\n" : ""}${buffer}`;
            count_input();
            return true;
        }
        return false;
    }

    microLabel.addEventListener("click", async (e) => {
        if (!stopRecognition()) {
            microLabel.classList.add("recognition");
            recognition.lang = await get_recognition_language();
            recognition.start();
        }
    });
}

document.getElementById("showLog").addEventListener("click", () => {
    log_storage.classList.remove("hidden");
    settings.classList.add("hidden");
    log_storage.scrollTop = log_storage.scrollHeight;
});

// Mobile Experience Enhancements

// Create overlay element for sidebar

// Initialize drag and drop
setupDragAndDrop();

enhanceFileUpload();
