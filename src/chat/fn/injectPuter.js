export async function injectPuter() {
    return new Promise((resolve, reject) => {
        if (window.puter) {
            resolve(puter);
        }
        var tag = document.createElement('script');
        tag.src = "https://js.puter.com/v2/";
        tag.onload = () => {
            resolve(puter);
            if (!localStorage.getItem("puter.auth.token")) {
                puter.auth.signIn().then((res) => {
                    debug.log('Signed in:', res);
                });
            }
        };
        tag.onerror = reject;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
}
