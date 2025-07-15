const iframe_container = document.querySelector(".hljs-iframe-container");
const iframe = document.querySelector(".hljs-iframe");
const iframe_close = Object.assign(document.createElement("button"), {
    className: "hljs-iframe-close",
    innerHTML: '<i class="fa-regular fa-x"></i>',
});
iframe_close.onclick = () => {
    iframe_container.classList.add("hidden");
    iframe.src = "";
}
iframe_container.appendChild(iframe_close);

export class HtmlRenderPlugin {
    constructor(options = {}) {
        self.hook = options.hook;
        self.callback = options.callback
    }
    "after:highlightElement"({
        el,
        text
    }) {
        if (!el.classList.contains("language-html")) {
            return;
        }
        let button = Object.assign(document.createElement("button"), {
            innerHTML: '<i class="fa-regular fa-folder-open"></i>',
            className: "hljs-iframe-button",
        });
        el.parentElement.appendChild(button);
        button.onclick = async () => {
            let newText = text;
            if (hook && typeof hook === "function") {
                newText = hook(text, el) || text
            }
            iframe.src = `data:text/html;charset=utf-8,${encodeURIComponent(newText)}`;
            iframe_container.classList.remove("hidden");
            if (typeof callback === "function") return callback(newText, el);
        }
    }
}