import { count_words_and_tokens } from "./count_words_and_tokens";
import framework from "./framework";
import { highlight } from "./highlight";
import { render_reasoning } from "./render_reasoning"
import { renderLargeMessage } from "./renderLargeMessage"
export function update_message(content_map, message_id, content = null) {
    console.log("update_message called", content, window.reasoning_storage[message_id])
    // Clear previous timeouts
    content_map.update_timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    content_map.update_timeouts = [];

    // Create new timeout
    content_map.update_timeouts.push(setTimeout(() => {
        // Existing function body
        if (!content) {
            if (window.reasoning_storage[message_id] && window.message_storage[message_id]) {
                content = render_reasoning(window.reasoning_storage[message_id], true) + framework.markdown(window.message_storage[message_id]);
            } else if (window.reasoning_storage[message_id]) {
                content = render_reasoning(window.reasoning_storage[message_id]);
            } else {
                content = framework.markdown(window.message_storage[message_id]);
            }

            // Find last element for cursor placement
            let lastElement, lastIndex = null;
            for (const element of ['</p>', '</code></pre>', '</p>\n</li>\n</ol>', '</li>\n</ol>', '</li>\n</ul>']) {
                const index = content.lastIndexOf(element);
                if (index - element.length > lastIndex) {
                    lastElement = element;
                    lastIndex = index;
                }
            }
            if (lastIndex) {
                content = content.substring(0, lastIndex) + '<span class="cursor"></span>' + lastElement;
            }
        }

        if (error_storage[message_id]) {
            content += framework.markdown(`${framework.translate('**An error occured:**')} ${error_storage[message_id]}`);
        }

        // Use progressive rendering for large content
        if (content.length > 10000) {
            renderLargeMessage(content_map.inner, content);
        } else {
            content_map.inner.innerHTML = content;
        }

        if (countTokensEnabled) {
            content_map.count.innerText = count_words_and_tokens(
                (window.reasoning_storage[message_id] ? window.reasoning_storage[message_id].text : "")
                + message_storage[message_id],
                window.provider_storage[message_id]?.model);
        }

        highlight(content_map.inner);
    }, 100));
}
;
