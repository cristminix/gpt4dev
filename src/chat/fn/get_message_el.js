export const get_message_el = (el) => {
    let message_el = el;
    while(!(message_el.classList.contains('message')) && message_el.parentElement) {
        message_el = message_el.parentElement;
    }
    if (message_el.classList.contains('message')) {
        return message_el;
    }
}