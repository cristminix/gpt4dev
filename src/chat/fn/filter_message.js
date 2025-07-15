import { filter_message_content } from "./filter_message_content"
export function filter_message(text) {
    if (Array.isArray(text) || !text) {
        return text;
    }
    // Remove images from text
    return filter_message_content(text.replaceAll(
        /!\[.*?\]\(.*?\)/gm, ""
    ))
}