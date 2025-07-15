import { optionElementsSelector } from "../constant"
export const register_settings_storage = async () => {
    const optionElements = document.querySelectorAll(optionElementsSelector);
    optionElements.forEach((element) => {
        if (element.type == "textarea") {
            element.addEventListener('input', async (event) => {
                appStorage.setItem(element.id, element.value);
            });
        } else {
            element.addEventListener('change', async (event) => {
                switch (element.type) {
                    case "checkbox":
                        appStorage.setItem(element.id, element.checked);
                        break;
                    case "select-one":
                        appStorage.setItem(element.id, element.value);
                        break;
                    case "text":
                    case "number":
                        appStorage.setItem(element.id, element.value);
                        break;
                    default:
                        console.warn("Unresolved element type");
                }
            });
        }
        if (element.id.endsWith("-api_key")) {
            element.addEventListener('focus', async (event) => {
                if (element.dataset.value) {
                    element.value = element.dataset.value
                }
            });
            element.addEventListener('blur', async (event) => {
                element.dataset.value = element.value;
                if (element.value) {
                    element.placeholder = element.value && element.value.length >= 22 ? (element.value.substring(0, 12) + "*".repeat(12) + element.value.substring(element.value.length - 12)) : "*".repeat(element.value.length);
                } else if (element.placeholder != "api_key") {
                    element.placeholder = "";
                }
                element.value = ""
            });
        }
    });
}