export async function upload_cookies() {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    response = await fetch(framework.backendUrl + "/backend-api/v2/upload_cookies", {
        method: 'POST',
        body: formData,
    });
    if (response.status == 200) {
        inputCount.innerText = framework.translate("{0} File(s) uploaded successfully").replace('{0}', file.name);
    }
    fileInput.value = "";
}