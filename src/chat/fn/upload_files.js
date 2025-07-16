
import { paperclip, inputCount } from "../constant";
import { handle_ask } from "./handle_ask";
export async function upload_files(fileInput) {
    const bucket_id = generateUUID();
    paperclip.classList.add("blink");

    const formData = new FormData();
    Array.from(fileInput.files).forEach(file => {
        formData.append('files', file);
    });
    const response = await fetch(framework.backendUrl + "/backend-api/v2/files/" + bucket_id, {
        method: 'POST',
        body: formData
    });
    const result = await response.json()
    const count = result.files.length + result.media.length;
    inputCount.innerText = framework.translate('{0} File(s) uploaded successfully').replace('{0}', count);
    if (result.files.length > 0) {
        let do_refine = document.getElementById("refine")?.checked;
        connectToSSE(`${framework.backendUrl}/backend-api/v2/files/${bucket_id}`, do_refine, bucket_id);
    } else {
        paperclip.classList.remove("blink");
        fileInput.value = "";
    }
    if (result.media) {
        const media = [];
        result.media.forEach((part) => {
            part = part.name ? part : { name: part };
            const url = `${framework.backendUrl}/files/${bucket_id}/media/${part.name}`;
            media.push({ bucket_id: bucket_id, url: url, ...part });
        });
        await handle_ask(false, media);
    }
}
