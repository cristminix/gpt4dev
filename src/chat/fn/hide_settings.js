import { settings, sidebar, chat, log_storage } from "../constant"

export async function hide_settings() {
    settings.classList.add("hidden");
    let provider_forms = document.querySelectorAll(".provider_forms from");
    Array.from(provider_forms).forEach((form) => form.classList.add("hidden"));
}