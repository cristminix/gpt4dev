export function filter_message_content(text) {
    if (Array.isArray(text) || !text) {
        return text;
    }
    return text.replace(/ \[aborted\]$/g, "").replace(/ \[error\]$/g, "")
}
