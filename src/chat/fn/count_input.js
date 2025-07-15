import { userInput, inputCount } from "../constant"
import { count_tokens } from "./count_tokens"
import { count_words_and_tokens } from "./count_words_and_tokens"
import { get_selected_model } from "./get_selected_model"
export const count_input = async () => {

    if (window.countTokensEnabled && userInput.value) {
        if (window.matchMedia("(pointer:coarse)")) {
            inputCount.innerText = `(${count_tokens(get_selected_model()?.value, userInput.value)} tokens)`;
        } else {
            inputCount.innerText = count_words_and_tokens(userInput.value, get_selected_model()?.value);
        }
    } else {
        inputCount.innerText = "";
    }
};