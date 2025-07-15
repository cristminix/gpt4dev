import framework from "./framework";
import { api } from "./api";
export async function load_version() {
    let new_version = document.querySelector(".new_version");
    if (new_version) return;
    let text = "version ~ ";
    api("version").then((versions) => {
        window.title = 'G4F - ' + versions["version"];
        if (document.title == "G4F Chat") {
            document.title = window.title;
        }
        if (versions["latest_version"] && versions["version"] != versions["latest_version"]) {
            let release_url = 'https://github.com/xtekky/gpt4free/releases/latest';
            let title = `${framework.translate('New version:')} ${versions["latest_version"]}`;
            text += `<a href="${release_url}" target="_blank" title="${title}">${versions["version"]}</a> 🆕`;
            new_version = document.createElement("div");
            new_version.classList.add("new_version");
            const link = `<a href="${release_url}" target="_blank" title="${title}">v${versions["latest_version"]}</a>`;
            new_version.innerHTML = `G4F ${link}&nbsp;&nbsp;🆕`;
            new_version.addEventListener("click", () => new_version.parentElement.removeChild(new_version));
            document.body.appendChild(new_version);
        } else {
            text += versions["version"];
        }
        // document.getElementById("version_text").innerHTML = text
    }).catch((e) => {
        console.error("Error loading version:", e);
        fetch("https://api.github.com/repos/xtekky/gpt4free/releases/latest").then((response) => response.json()).then((data) => {
            document.getElementById("version_text").innerText = text + data.tag_name;
        });
    });
    setTimeout(load_version, 1000 * 60 * 60); // 1 hour
}
