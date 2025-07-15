
export function add_pinned(selected_provider, selected_model, save = true) {
    if (save) {
        const all_pinned_saved = JSON.parse(appStorage.getItem("pinned") || "[]");
        appStorage.setItem("pinned", JSON.stringify([{
            provider: selected_provider?.value,
            model: selected_model?.value,
        }, ...all_pinned_saved]));
    }
    const pinned = document.createElement("button");
    pinned.classList.add("pinned");
    if (selected_provider) pinned.dataset.provider = selected_provider.value || selected_provider;
    if (selected_model) pinned.dataset.model = selected_model.value || selected_model;
    pinned.innerHTML = `
        <span>
        ${selected_provider && selected_provider.dataset ? selected_provider.dataset.label || selected_provider.text : selected_provider}
        ${selected_provider && selected_model ? "/" : ""}
        ${selected_model && selected_model.dataset ? selected_model.dataset.label || selected_model.text : selected_model}
        </span>
        <i class="fa-regular fa-circle-xmark"></i>`;
    pinned.addEventListener("click", () => {
        pin_container.removeChild(pinned);
        let all_pinned = JSON.parse(appStorage.getItem("pinned") || "[]");
        all_pinned = all_pinned.filter((el) => {
            return el.provider != pinned.dataset.provider || el.model != pinned.dataset.model;
        });
        appStorage.setItem("pinned", JSON.stringify(all_pinned));
    });
    all_pinned = pin_container.querySelectorAll(".pinned");
    while (all_pinned.length > 4) {
        pin_container.removeChild(all_pinned[0]);
        all_pinned = pin_container.querySelectorAll(".pinned");
    }
    pin_container.appendChild(pinned);
}
