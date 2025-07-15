import { showNotification } from "./showNotification"
import { fallback_clipboard } from "./fallback_clipboard"
import { chatBody } from "../constant"
export async function register_message_images() {
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
                showNotification("Text copied to clipboard");
            } catch (e) {
                console.error(e);
                console.error("Clipboard API writeText() failed! Fallback to document.exec(\"copy\")...");
                try {
                    fallback_clipboard(copyText);
                    showNotification("Text copied to clipboard");
                } catch (fallbackError) {
                    console.error("Fallback clipboard also failed:", fallbackError);
                    showNotification("Failed to copy text", "error");
                }
            }
            el.classList.add("clicked");
            setTimeout(() => el.classList.remove("clicked"), 1000);
        });
    });
}
