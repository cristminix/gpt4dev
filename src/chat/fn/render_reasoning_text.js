export function render_reasoning_text(reasoning) {
    return `${reasoning.label ? reasoning.label :'Reasoning 🧠'}: ${reasoning.status}\n\n${reasoning.text}\n\n`;
}