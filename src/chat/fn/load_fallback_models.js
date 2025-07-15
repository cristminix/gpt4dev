import { custom_model, modelProvider, modelSelect, modelTags } from "../constant"
import { get_modelTags } from "./get_modelTags"
export async function load_fallback_models() {
    modelSelect.classList.add("hidden");
    modelProvider.classList.remove("hidden");
    modelProvider.name = `model[Live]`;
    modelProvider.innerHTML = '';
    fetch("https://text.pollinations.ai/models").then(async (response) => {
        const models = await response.json();
        models.forEach((model) => {
            let option = document.createElement("option");
            option.value = model.name;
            option.text = `${model.name} ${get_modelTags(model)}`;
            if (model.audio) {
                option.dataset.audio = "true";
            }
            modelProvider.appendChild(option);
        });
        const imageResponse = await fetch("https://image.pollinations.ai/models");
        const imageModels = await imageResponse.json();
        imageModels.forEach((model) => {
            let option = document.createElement("option");
            option.value = model;
            option.text = `${model} (${modelTags.image})`;
            option.dataset.image = "true";
            modelProvider.appendChild(option);
        });
    });
}