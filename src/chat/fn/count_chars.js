export function count_chars(text) {
    return text.match(/[^\s\p{P}]/gu)?.length || 0;
}
