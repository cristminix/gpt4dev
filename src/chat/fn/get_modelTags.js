import { modelTags } from "../constant"
import framework from "./framework";
export function get_modelTags(model, add_vision = true) {
    const parts = []
    for (let [name, text] of Object.entries(modelTags)) {
        if (name != "vision" || add_vision) {
            parts.push(model[name] ? ` (${framework.translate(text)})` : "")
        }
    }
    return parts.join("");
}