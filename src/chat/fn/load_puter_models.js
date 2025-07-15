import { modelSelect, modelProvider } from "../constant"
import { get_modelTags } from "./get_modelTags"
export async function load_puter_models() {
    modelSelect.classList.add("hidden");
    modelProvider.classList.remove("hidden");
    modelProvider.name = `model[Puter]`;
    const response = await fetch("https://api.puter.com/puterai/chat/models/");
    let models = await response.json();
    models = models.models;
    models.push("dall-e-3");
    models = models.filter((model) => !model.includes("/") && !["abuse", "costly", "fake", "model-fallback-test-1"].includes(model));
    modelProvider.innerHTML = models.map((model) => `<option value="${model}">${model + get_modelTags({
        image: model.includes('FLUX') || model.includes('dall-e-3'),
        vision: ['gpt', 'o1', 'o3', 'o4'].includes(model.split('-')[0]) || model.includes('vision'),
    })}</option>`).join("");
}