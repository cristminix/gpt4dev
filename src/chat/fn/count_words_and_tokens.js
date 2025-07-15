import { count_chars } from "./count_chars";
import framework from "./framework";
import { filter_message } from "./filter_message";
import { count_words } from "./count_words";
import { count_tokens } from "./count_tokens";
export function count_words_and_tokens(text, model, completion_tokens, prompt_tokens) {
    if (Array.isArray(text) || !text) {
        return "";
    }
    text = filter_message(text);
    return `(${count_words(text)} ${framework.translate('words')}, ${count_chars(text)} ${framework.translate('chars')}, ${completion_tokens ? completion_tokens : count_tokens(model, text, prompt_tokens)} ${framework.translate('tokens')})`;
}
