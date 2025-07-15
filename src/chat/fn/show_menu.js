export async function show_menu() {
    sidebar.classList.add("shown");
    sidebar.classList.remove("minimized");
    await hide_settings();
    add_url_to_history("#menu");
}