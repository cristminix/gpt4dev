import { add_message_chunk } from "./add_message_chunk"
export async function read_response(response, message_id, provider, finish_message) {
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }
        for (const line of value.split("\n")) {
            if (!line) {
                continue;
            }
            try {
                add_message_chunk(JSON.parse(buffer + line), message_id, provider, finish_message);
                buffer = "";
            } catch {
                buffer += line;
            }
        }
    }
}
