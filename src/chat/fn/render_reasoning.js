import framework from "./framework";
export function render_reasoning(reasoning, final = false) {
    const inner_text = reasoning.text ? `<div class="reasoning_text${final ? " final hidden" : ""}">
        ${framework.markdown(reasoning.text)}
    </div>` : "";
    return `<div class="reasoning_body">
        <div class="reasoning_title">
           <strong>${reasoning.label ? reasoning.label : 'Reasoning <i class="brain">🧠</i>'}: </strong>
           ${typeof reasoning.status === 'string' || reasoning.status instanceof String ? framework.escape(reasoning.status) : '<i class="fas fa-spinner fa-spin"></i>'}
        </div>
        ${inner_text}
    </div>`;
}