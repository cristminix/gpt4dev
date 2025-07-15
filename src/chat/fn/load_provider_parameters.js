export async function load_provider_parameters(provider) {
    let form_id = `${provider}-form`;
    if (!parameters_storage[provider]) {
        parameters_storage[provider] = JSON.parse(appStorage.getItem(form_id));
    }
    if (parameters_storage[provider]) {
        let provider_forms = document.querySelector(".provider_forms");
        let form_el = document.createElement("form");
        form_el.id = form_id;
        form_el.classList.add("hidden");
        appStorage.setItem(form_el.id, JSON.stringify(parameters_storage[provider]));
        let old_form = document.getElementById(form_id);
        if (old_form) {
            old_form.remove();
        }
        Object.entries(parameters_storage[provider]).forEach(([key, value]) => {
            let el_id = `${provider}-${key}`;
            let saved_value = appStorage.getItem(el_id);
            let input_el;
            let field_el;
            if (typeof value == "boolean") {
                field_el = document.createElement("div");
                field_el.classList.add("field");
                if (saved_value) {
                    field_el.classList.add("saved");
                    saved_value = saved_value == "true";
                } else {
                    saved_value = value;
                }
                field_el.innerHTML = `<span class="label">${key}:</span>
                <input type="checkbox" id="${el_id}" name="${key}">
                <label for="${el_id}" class="toogle" title=""></label>
                <i class="fa-solid fa-xmark"></i>`;
                form_el.appendChild(field_el);
                input_el = field_el.querySelector("input");
                input_el.checked = saved_value;
                input_el.dataset.checked = value ? "true" : "false";
                input_el.onchange = () => {
                    field_el.classList.add("saved");
                    appStorage.setItem(el_id, input_el.checked ? "true" : "false");
                }
            } else if (typeof value == "string" || typeof value == "object"|| typeof value == "number") {
                field_el = document.createElement("div");
                field_el.classList.add("field");
                field_el.classList.add("box");
                if (typeof value == "object" && value != null) {
                    value = JSON.stringify(value, null, 4);
                }
                if (saved_value) {
                    field_el.classList.add("saved");
                } else {
                    saved_value = value;
                }
                let placeholder;
                if (["api_key", "proof_token"].includes(key)) {
                    placeholder = saved_value && saved_value.length >= 22 ? (saved_value.substring(0, 12) + "*".repeat(12) + saved_value.substring(saved_value.length-12)) : value;
                } else {
                    placeholder = value == null ? "null" : value;
                }
                field_el.innerHTML = `<label for="${el_id}" title="">${key}:</label>`;
                if (Number.isInteger(value)) {
                    max = value == 42 || value >= 4096 ? 8192 : value >= 100 ? 4096 : value == 1 ? 10 : 100;
                    step = value >= 1024 ? 8 : 1;
                    field_el.innerHTML += `<input type="range" id="${el_id}" name="${key}" value="${framework.escape(value)}" class="slider" min="0" max="${max}" step="${step}"/><output>${framework.escape(value)}</output>`;
                    field_el.innerHTML += `<i class="fa-solid fa-xmark"></i>`;
                } else if (typeof value == "number") {
                    field_el.innerHTML += `<input type="range" id="${el_id}" name="${key}" value="${framework.escape(value)}" class="slider" min="0" max="2" step="0.1"/><output>${framework.escape(value)}</output>`;
                    field_el.innerHTML += `<i class="fa-solid fa-xmark"></i>`;
                } else {
                    field_el.innerHTML += `<textarea id="${el_id}" name="${key}"></textarea>`;
                    field_el.innerHTML += `<i class="fa-solid fa-xmark"></i>`;
                    input_el = field_el.querySelector("textarea");
                    if (value != null) {
                        input_el.dataset.text = value;
                    }
                    input_el.placeholder = placeholder;
                    if (!["api_key", "proof_token"].includes(key)) {
                        input_el.value = saved_value;
                    } else {
                        input_el.dataset.saved_value = saved_value;
                    }
                    input_el.oninput = () => {
                        field_el.classList.add("saved");
                        appStorage.setItem(el_id, input_el.value);
                        input_el.dataset.saved_value = input_el.value;
                    };
                    input_el.onfocus = () => {
                        if (input_el.dataset.saved_value) {
                            input_el.value = input_el.dataset.saved_value;
                        } else if (["api_key", "proof_token"].includes(key)) {
                            input_el.value = input_el.dataset.text;
                        }
                        input_el.style.height = (input_el.scrollHeight) + "px";
                    }
                    input_el.onblur = () => {
                        input_el.style.removeProperty("height");
                        if (["api_key", "proof_token"].includes(key)) {
                            input_el.value = "";
                        }
                    }
                }
                if (!input_el) {
                    input_el = field_el.querySelector("input");
                    input_el.dataset.value = value;
                    input_el.value = saved_value;
                    input_el.nextElementSibling.value = input_el.value;
                    input_el.oninput = () => {
                        input_el.nextElementSibling.value = input_el.value;
                        field_el.classList.add("saved");
                        appStorage.setItem(input_el.id, input_el.value);
                    };
                }
            }
            form_el.appendChild(field_el);
            let xmark_el = field_el.querySelector(".fa-xmark");
            xmark_el.onclick = () => {
                if (input_el.dataset.checked) {
                    input_el.checked = input_el.dataset.checked == "true";
                } else if (input_el.dataset.value) {
                    input_el.value = input_el.dataset.value;
                    input_el.nextElementSibling.value = input_el.dataset.value;
                } else if (input_el.dataset.text) {
                    input_el.value = input_el.dataset.text;
                }
                delete input_el.dataset.saved_value;
                appStorage.removeItem(el_id);
                field_el.classList.remove("saved");
            }
        });
        provider_forms.appendChild(form_el);
    }
}