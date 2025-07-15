import { modelSelect, providerSelect, settings } from "../constant"
export const load_provider_option = (input, provider_name) => {
    if (input.checked) {
        modelSelect.querySelectorAll(`option[data-disabled_providers*="${provider_name}"]`).forEach(
            (el) => {
                el.dataset.disabled_providers = el.dataset.disabled_providers ? el.dataset.disabled_providers.split(" ").filter((provider) => provider != provider_name).join(" ") : "";
                el.dataset.providers = (el.dataset.providers ? el.dataset.providers + " " : "") + provider_name;
                modelSelect.querySelectorAll(`option[value="${el.value}"]`).forEach((o) => o.removeAttribute("disabled", "disabled"))
            }
        );
        providerSelect.querySelectorAll(`option[value="${provider_name}"]`).forEach(
            (el) => el.removeAttribute("disabled")
        );
        providerSelect.querySelectorAll(`option[data-parent="${provider_name}"]`).forEach(
            (el) => el.removeAttribute("disabled")
        );
        settings.querySelector(`.field:has(#${provider_name}-api_key)`)?.classList.remove("hidden");
        settings.querySelector(`.field:has(#${provider_name}-api_base)`)?.classList.remove("hidden");
    } else {
        modelSelect.querySelectorAll(`option[data-providers*="${provider_name}"]`).forEach(
            (el) => {
                el.dataset.providers = el.dataset.providers ? el.dataset.providers.split(" ").filter((provider) => provider != provider_name).join(" ") : "";
                el.dataset.disabled_providers = (el.dataset.disabled_providers ? el.dataset.disabled_providers + " " : "") + provider_name;
                if (!el.dataset.providers) modelSelect.querySelectorAll(`option[value="${el.value}"]`).forEach((o) => o.setAttribute("disabled", "disabled"))
            }
        );
        providerSelect.querySelectorAll(`option[value="${provider_name}"]`).forEach(
            (el) => el.setAttribute("disabled", "disabled")
        );
        providerSelect.querySelectorAll(`option[data-parent="${provider_name}"]`).forEach(
            (el) => el.setAttribute("disabled", "disabled")
        );
    }
};