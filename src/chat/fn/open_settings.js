export function open_settings() {
    if (settings.classList.contains("hidden")) {
        chat.classList.add("hidden");
        sidebar.classList.remove("shown");
        settings.classList.remove("hidden");
        add_url_to_history("#settings");
    } else {
        settings.classList.add("hidden");
        chat.classList.remove("hidden");
        add_url_to_history(window.conversation_id ? `#${window.conversation_id}` : window.location.search);
    }
    log_storage.classList.add("hidden");
}