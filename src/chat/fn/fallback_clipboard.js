export function fallback_clipboard (text) {
    var textBox = document.createElement("textarea");
    textBox.value = text;
    textBox.style.top = "0";
    textBox.style.left = "0";
    textBox.style.position = "fixed";
    document.body.appendChild(textBox);
    textBox.focus();
    textBox.select();
    try {
        var success = document.execCommand('copy');
        var msg = success ? 'succeeded' : 'failed';
        console.log('Clipboard Fallback: Copying text command ' + msg);
    } catch (e) {
        console.error('Clipboard Fallback: Unable to copy', e);
    }
    document.body.removeChild(textBox);
}