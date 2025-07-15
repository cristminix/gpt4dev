import framework from "./framework";
// import { login_urls_storage } from "./login_urls_storage"
export function load_provider_login_urls(providersListContainer) {
    let login_urls_storage = ""; //ramework.get("login_urls_storage");
    for (let [name, [label, login_url, childs, auth]] of Object.entries(login_urls_storage)) {
        if (!login_url && !is_demo) {
            continue;
        }
        let providerBox = document.createElement("div");
        providerBox.classList.add("field", "box");
        childs = childs.map((child) => `${child}-api_key`).join(" ");
        const placeholder = `placeholder="${name == "HuggingSpace" ? "zerogpu_token" : "api_key"}"`;
        const input_id = name == "PuterJS" ? "puter.auth.token" : `${name}-api_key`;
        providerBox.innerHTML = `
            <label for="${input_id}" class="label" title="">${label}:</label>
            <input type="text" id="${input_id}" name="${name}[api_key]" class="${childs}" ${placeholder} autocomplete="off"/>
        ` + (login_url ? `<a href="${login_url}" target="_blank" title="Login to ${label}">${framework.translate('Get API key')}</a>` : "");
        if (auth) {
            providerBox.querySelector("input").addEventListener("input", (event) => {
                const input = document.getElementById(`Provider${name}`);
                input.checked = !!event.target.value;
                load_provider_option(input, name);
            });
        }
        providersListContainer.querySelector(".collapsible-content").appendChild(providerBox);
    }
}
