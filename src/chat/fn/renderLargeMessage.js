
















export function renderLargeMessage(container, content, chunkSize = 50) {
    if (content.length <= chunkSize * 100) {
        container.innerHTML = content;
        return;
    }

    // Split content into chunks
    const lines = content.split("\n");
    const chunks = [];
    const buffer = [];
    for (let i = 0; i < lines.length; i += 1) {
        buffer.push(lines[i]);
        if (buffer.length >= chunkSize || i === lines.length - 1) {
            chunks.push(buffer.join("\n"));
            buffer.length = 0; // Clear the buffer
        }
    }

    // Render chunks progressively
    let index = 0;
    container.innerHTML = chunks[0];

    const renderNextChunk = () => {
        index++;
        if (index < chunks.length) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = chunks[index];
            while (tempDiv.firstChild) {
                container.appendChild(tempDiv.firstChild);
            }
            setTimeout(renderNextChunk, 10);
        }
    };

    setTimeout(renderNextChunk, 10);
}
