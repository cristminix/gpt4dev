export function renderMediaSelect() {
    const oldImages = mediaSelect.querySelectorAll("a:has(img)");
    oldImages.forEach((el) => el.remove());
    Object.entries(image_storage).forEach(async ([object_url, file]) => {
        const bucket_id = generateUUID();
        const link = document.createElement("a");
        link.title = file.name;
        const img = document.createElement("img");
        img.src = object_url;
        img.onclick = async () => {
            img.remove();
            delete image_storage[object_url];
            await framework.delete(item.bucket_id);
        }
        img.onload = () => {
            link.title += `\n${img.naturalWidth}x${img.naturalHeight}`;
        };
        img.onerror = () => {
            img.remove();
            delete image_storage[object_url];
        }
        link.appendChild(img);
        mediaSelect.appendChild(link);
        if (file instanceof File && window.location.protocol == "https:") {
            const formData = new FormData();
            formData.append('files', file);
            const response = await fetch(framework.backendUrl + "/backend-api/v2/files/" + bucket_id, {
                method: 'POST',
                body: formData
            });
            const result = await response.json()
            if (result.media) {
                const media = [];
                result.media.forEach((part) => {
                    part = part.name ? part : { name: part };
                    const url = `${framework.backendUrl ? framework.backendUrl : window.location.origin}/files/${bucket_id}/media/${part.name}`;
                    image_storage[url.replaceAll("/media/", "/thumbnail/")] = { bucket_id: bucket_id, url: url, ...part };
                });
            }
            delete image_storage[object_url];
        }
    });
}