
import { custom_model, modelProvider } from "../constant.js";
export function get_selected_model() {
    if (custom_model.value) {
        return custom_model;
    } else if (modelProvider.selectedIndex >= 0) {
        return modelProvider.options[modelProvider.selectedIndex];
    } else if (modelSelect.selectedIndex >= 0) {
        model = modelSelect.options[modelSelect.selectedIndex];
        if (model.value) {
            return model;
        }
    }
}