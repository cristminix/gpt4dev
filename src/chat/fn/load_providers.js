import { get_modelTags } from "./get_modelTags"
import { providerSelect, login_urls_storage, settings } from "../constant";
import { load_provider_login_urls } from "./load_provider_login_urls"
import { load_settings } from "./load_settings"
import framework from "./framework";
// import { login_urls_storage } from "./login_urls_storage"
export function load_providers(providers, provider_options, providersListContainer) {
    providers.sort((a, b) => a.label.localeCompare(b.label));
    providers.forEach((provider) => {
        let option = document.createElement("option");
        option.value = provider.name;
        option.dataset.label = provider.label;
        option.text = provider.label
            + get_modelTags(provider)
            + (provider.nodriver ? " (Browser)" : "")
            + (provider.hf_space ? " (HuggingSpace)" : "")
            + (!provider.nodriver && provider.auth ? " (Auth)" : "");
        if (provider.parent)
            option.dataset.parent = provider.parent;
        providerSelect.appendChild(option);

        if (provider.parent && provider.name != "PuterJS") {
            if (!login_urls_storage[provider.parent]) {
                login_urls_storage[provider.parent] = [provider.label, provider.login_url, [provider.name], provider.auth];
            } else {
                login_urls_storage[provider.parent][2].push(provider.name);
            }
        } else if (provider.login_url) {
            const name = provider.parent || provider.name;
            if (!login_urls_storage[name]) {
                login_urls_storage[name] = [provider.label, provider.login_url, [name, provider.name], provider.auth];
            } else {
                login_urls_storage[name][0] = provider.label;
                login_urls_storage[name][1] = provider.login_url;
            }
        }
    });

    let providersContainer = document.createElement("div");
    providersContainer.classList.add("field", "collapsible");
    providersContainer.innerHTML = `
        <div class="collapsible-header">
            <span class="label">${framework.translate('Providers (Enable/Disable)')}</span>
            <i class="fa-solid fa-chevron-down"></i>
        </div>
        <div class="collapsible-content hidden"></div>
    `;
    settings.querySelector(".paper").appendChild(providersContainer);

    providers.forEach((provider) => {
        if (!provider.parent || provider.name == "PuterJS") {
            const name = provider.parent || provider.name;
            let option = document.createElement("div");
            option.classList.add("provider-item");
            let api_key = appStorage.getItem(`${name}-api_key`);
            option.innerHTML = `
                <span class="label">Enable ${provider.label}</span>
                <input id="Provider${name}" type="checkbox" name="Provider${name}" value="${name}" class="provider" ${provider.active_by_default || api_key ? 'checked="checked"' : ''}/>
                <label for="Provider${name}" class="toogle" title="Remove provider from dropdown"></label>
            `;
            option.querySelector("input").addEventListener("change", (event) => load_provider_option(event.target, name));
            providersContainer.querySelector(".collapsible-content").appendChild(option);
            provider_options[name] = option;
        }
    });

    providersContainer.querySelector(".collapsible-header").addEventListener('click', (e) => {
        providersContainer.querySelector(".collapsible-content").classList.toggle('hidden');
        providersContainer.querySelector(".collapsible-header").classList.toggle('active');
    });
    load_provider_login_urls(providersListContainer);
    load_settings(provider_options);
}