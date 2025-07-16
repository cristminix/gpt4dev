// @ts-nocheck
export function add_url_to_history(url) {
    if (!window?.pywebview) {
        try {
            history.pushState({}, null, url);
        } catch (e) {
            console.error(e);
        }
    }
}
