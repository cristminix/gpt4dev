export function is_stopped() {
    if (stop_generating.classList.contains('stop_generating-hidden')) {
        return true;
    }
    return false;
}