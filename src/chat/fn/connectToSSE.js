export
    function connectToSSE(url, do_refine, bucket_id) {
    const eventSource = new EventSource(url);
    eventSource.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.error) {
            inputCount.innerText = `${framework.translate('Error:')} ${data.error.message}`;
            paperclip.classList.remove("blink");
            fileInput.value = "";
        } else if (data.action == "load") {
            inputCount.innerText = `${framework.translate('Read data:')} ${formatFileSize(data.size)}`;
        } else if (data.action == "refine") {
            inputCount.innerText = `${framework.translate('Refine data:')} ${formatFileSize(data.size)}`;
        } else if (data.action == "download") {
            inputCount.innerText = `${framework.translate('Download:')} ${data.count} files`;
        } else if (data.action == "done") {
            if (do_refine) {
                connectToSSE(`${framework.backendUrl}/backend-api/v2/files/${encodeURIComponent(bucket_id)}?refine_chunks_with_spacy=true`, false, bucket_id);
                return;
            }
            fileInput.value = "";
            paperclip.classList.remove("blink");
            if (!data.size) {
                inputCount.innerText = framework.translate("No content found");
                return
            }
            appStorage.setItem(`bucket:${bucket_id}`, data.size);
            inputCount.innerText = framework.translate("Files are loaded successfully");

            const url = `${framework.backendUrl}/backend-api/v2/files/${encodeURIComponent(bucket_id)}`;
            const media = [{ bucket_id: bucket_id, url: url }];
            await handle_ask(false, media);
        }
    };
    eventSource.onerror = (event) => {
        eventSource.close();
        paperclip.classList.remove("blink");
    }
}