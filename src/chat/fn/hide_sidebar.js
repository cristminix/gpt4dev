import { settings, sidebar, chat, log_storage } from "../constant"
import { hide_settings } from "./hide_settings"
export async function hide_sidebar(remove_shown = false) {
    if (remove_shown && window.innerWidth < 640) { // Only apply on mobile
        sidebar.classList.remove("shown");
    }
    settings.classList.add("hidden");
    // chat.classList.remove("hidden");
    // log_storage.classList.add("hidden");
    await hide_settings();
    if (window.location.hash.endsWith("#menu") || window.location.pathname.endsWith("#settings")) {
        history.back();
    }
}