
function save_storage(settings = false) {
    let filename = `${settings ? 'settings' : 'chat'} ${new Date().toLocaleString()}.json`.replaceAll(":", "-");
    let data = { "options": { "g4f": "" } };
    for (let i = 0; i < window.appStorage.length; i++) {
        let key = window.appStorage.key(i);
        let item = window.appStorage.getItem(key);
        if (key.startsWith("conversation:")) {
            if (!settings) {
                data[key] = JSON.parse(item);
            }
        } else if (key.startsWith("bucket:")) {
            if (!settings) {
                data[key] = item;
            }
        } else if (settings && !key.endsWith("-form") && !key.endsWith("user")) {
            data["options"][key] = item;
        }
    }
    data = JSON.stringify(data, null, 4);
    const blob = new Blob([data], { type: 'application/json' });
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}
