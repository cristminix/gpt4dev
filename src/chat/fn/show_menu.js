import { sidebar } from "../constant";
import { hide_settings } from "./hide_settings";
import { add_url_to_history } from "./add_url_to_history";
export async function show_menu() {
    sidebar.classList.add("shown");
    sidebar.classList.remove("minimized");
    await hide_settings();
    add_url_to_history("#menu");
}