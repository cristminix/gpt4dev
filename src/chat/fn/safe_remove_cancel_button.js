import { stop_generating } from "../constant"
export async function safe_remove_cancel_button() {
    const controller_storage = window.controller_storage
    for (let key in controller_storage) {
        if (!controller_storage[key].signal.aborted) {
            return;
        }
    }
    stop_generating.classList.add("stop_generating-hidden");
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
    }
}
