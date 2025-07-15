import { custom_model, modelProvider, modelSelect, providerSelect } from "../constant"
import { injectPuter } from "./injectPuter"
import { load_puter_models } from "./load_puter_models"
import { load_fallback_models } from "./load_fallback_models"
import { get_modelTags } from "./get_modelTags"
import { api } from "./api"
export async function load_provider_models(provider = null) {
    if (!provider) {
        provider = providerSelect.value;
    }
    if (provider == "Live") {
        modelSelect.classList.add("hidden");
        modelProvider.classList.remove("hidden");
        await load_fallback_models();
        return;
    }
    if (!custom_model.value) {
        custom_model.classList.add("hidden");
    }
    if (provider.startsWith("Custom") || custom_model.value) {
        modelProvider.classList.add("hidden");
        modelSelect.classList.add("hidden");
        custom_model.classList.remove("hidden");
        return;
    }
    modelProvider.name = `model[${provider}]`;
    if (!provider) {
        modelProvider.classList.add("hidden");
        if (custom_model.value) {
            modelSelect.classList.add("hidden");
            custom_model.classList.remove("hidden");
        } else {
            modelSelect.classList.remove("hidden");
            custom_model.classList.add("hidden");
        }
        return;
    }
    if (provider.startsWith("Puter")) {
        await injectPuter();
        if (provider == "Puter") {
            await load_puter_models();
            return;
        }
    }
    function set_provider_models(models) {
        modelProvider.innerHTML = '';
        modelSelect.classList.add("hidden");
        if (!custom_model.value) {
            custom_model.classList.add("hidden");
            modelProvider.classList.remove("hidden");
        }
        let defaultIndex = 0;
        function add_options(group, models) {
            models.forEach((model, i) => {
                if (!model.models) {
                    let option = document.createElement('option');
                    option.value = model.model;
                    option.dataset.label = model.model;
                    option.text = model.label + (model.count > 1 ? ` (${model.count}+)` : "") + get_modelTags(model);
                    group.appendChild(option);
                    if (model.default) {
                        defaultIndex = i;
                    }
                } else {
                    let optgroup = document.createElement('optgroup');
                    optgroup.label = model.group;
                    add_options(optgroup, model.models);
                    modelProvider.appendChild(optgroup);
                }
            });
        }
        if (Array.isArray(models)) {
            add_options(modelProvider, models);
            modelProvider.selectedIndex = defaultIndex;
        }
        const optgroup = document.createElement('optgroup');
        optgroup.label = "Favorites:";
        const favorites = JSON.parse(appStorage.getItem("favorites") || "{}");
        const selected = favorites[provider] || {};
        Object.keys(selected).forEach((key) => {
            const option = document.createElement('option');
            option.value = key;
            option.text = key;
            const value_option = modelProvider.querySelector(`option[value="${key}"]`)
            if (value_option) {
                option.text = value_option.text;
            }
            optgroup.appendChild(option);
            if (optgroup.childElementCount > 5) {
                delete selected[optgroup.firstChild.value];
                optgroup.removeChild(optgroup.firstChild);
            }
        });
        favorites[provider] = selected;
        appStorage.setItem("favorites", JSON.stringify(favorites));
        optgroup.lastChild?.setAttribute("selected", "selected");
        modelProvider.appendChild(optgroup);
    }
    let models = appStorage.getItem(`${provider}:models`);
    if (models) {
        models = JSON.parse(models);
        set_provider_models(models);
    }
    models = await api('models', provider);
    if (models) {
        set_provider_models(models);
        appStorage.setItem(`${provider}:models`, JSON.stringify(models));
    } else {
        modelProvider.classList.add("hidden");
        custom_model.classList.remove("hidden")
    }
};