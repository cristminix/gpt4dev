// import hub from "@huggingface/hub";
import { oauthLoginUrl, oauthHandleRedirectIfPresent,whoAmI } from "@huggingface/hub";

localStorage.removeItem("backendUrl ");
framework.connectToBackend(document.getElementById("connect_status"));

const isIframe = window.self !== window.top;
const newWindowButton = document.getElementById('new_window');
if (isIframe) {
    newWindowButton.classList.remove('hidden');
}

const form = document.querySelector("form");
const input = document.querySelector('form input[name="token"]');
async function check_access_token() {
    const accessToken = input.value;
    if (!accessToken) {
        return true;
    }
    let user;
    try {
        user = await whoAmI({accessToken: accessToken});
    } catch(e) {
        console.log(e);
        input.setCustomValidity("Invalid Access Token.");
        localStorage.removeItem("HuggingFace-api_key");
        if (localStorage.getItem("oauth")) {
            localStorage.removeItem("oauth");
            window.location.href.replace(("" + window.location.href).split("?")[0]);
        }
        return false;
    }
    localStorage.setItem("HuggingFace-api_key", accessToken);
    localStorage.setItem("user", user.name);
    localStorage.setItem("report_error", "true")
    return true;
}
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if(await check_access_token()) {
        window.location.href = "chat/";
    }
});

let oauthResult = localStorage.getItem("oauth");
if (oauthResult) {
    let user;
    try {
        oauthResult = JSON.parse(oauthResult);
        user = await whoAmI({accessToken: oauthResult.accessToken});
    } catch (e) {
        console.error(e);
        oauthResult = null;
        localStorage.removeItem("oauth");
        localStorage.removeItem("HuggingFace-api_key");
    }
}
oauthResult ||= await oauthHandleRedirectIfPresent();
if (oauthResult) {
    localStorage.setItem("oauth", JSON.stringify(oauthResult));
    localStorage.setItem("HuggingFace-api_key", oauthResult.accessToken);
    localStorage.setItem("user", oauthResult.userInfo.fullname);
    document.getElementById("signout").style.display = 'block';
    document.getElementById("signout").onclick = async function() {
        localStorage.removeItem("oauth");
        localStorage.removeItem("HuggingFace-api_key");
        window.location.href.replace(("" + window.location.href).split("?")[0]);
    }
} else {
    localStorage.removeItem("oauth");
    document.getElementById("signin").style.display = 'block';
    document.getElementById("signin").onclick = async function() {
        window.location.href = (await oauthLoginUrl(window.oauthConfig));
    }
}

(async () => {
    const container = document.querySelector('.container');
    const button = document.querySelector('.slide-button');
    const slideIcon = button.querySelector('i');
    button.onclick = () => {
        if (container.classList.contains('-translate-x-full')) {
            container.classList.remove('-translate-x-full');
            slideIcon.classList.remove('fa-arrow-right');
            slideIcon.classList.add('fa-arrow-left');
        } else {
            container.classList.add('-translate-x-full');
            slideIcon.classList.remove('fa-arrow-left');
            slideIcon.classList.add('fa-arrow-right');
        }
    }
})();