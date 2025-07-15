import { optionElementsSelector } from "../constant"

export const load_settings_storage = async () => {
    const optionElements = document.querySelectorAll(optionElementsSelector);
    optionElements.forEach((element) => {
        let value = window.appStorage.getItem(element.id);
        if (value == null && element.dataset.value) {
            value = element.dataset.value;
        }
        if (value) {
            switch (element.type) {
                case "checkbox":
                    element.checked = value === "true";
                    break;
                case "select-one":
                    element.value = value;
                    break;
                case "text":
                case "number":
                case "textarea":
                    if (element.id.endsWith("-api_key")) {
                        element.placeholder = value && value.length >= 22 ? (value.substring(0, 12) + "*".repeat(12) + value.substring(value.length - 12)) : "*".repeat(value ? value.length : 0);
                        element.dataset.value = value;
                    } else {
                        element.value = value == null ? element.dataset.value : value;
                    }
                    break;
                default:
                    console.warn("`Unresolved element type:", element.type);
            }
        }
    });
}