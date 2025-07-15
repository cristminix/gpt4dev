export function count_tokens(model, text, prompt_tokens = 0) {
    if (!text) {
        return 0;
    }
    if (model) {
        if (window.llamaTokenizer)
            if (model.startsWith("llama") || model.startsWith("codellama")) {
                return llamaTokenizer.encode(text).length;
            }
        if (window.mistralTokenizer)
            if (model.startsWith("mistral") || model.startsWith("mixtral")) {
                return mistralTokenizer.encode(text).length;
            }
    }
    if (window.GPTTokenizer_cl100k_base && window.GPTTokenizer_o200k_base) {
        if (model?.startsWith("gpt-4o") || model?.startsWith("o1")) {
            return GPTTokenizer_o200k_base?.encode(text, model).length;
        } else {
            model = model?.startsWith("gpt-3") ? "gpt-3.5-turbo" : "gpt-4"
            return GPTTokenizer_cl100k_base?.encode(text, model).length;
        }
    } else {
        return prompt_tokens;
    }
}