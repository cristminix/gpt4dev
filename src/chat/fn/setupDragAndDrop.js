// Create drag-and-drop zones
export function setupDragAndDrop() {
    const dropZone = document.createElement('div');
    dropZone.className = 'file-drop-zone hidden';
    dropZone.innerHTML = `
        <div class="file-drop-content">
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <p>Drop files here to upload</p>
        </div>
    `;
    document.querySelector('.container').appendChild(dropZone);

    // Add CSS for drop zone
    const dropZoneStyles = document.createElement('style');
    dropZoneStyles.textContent = `
        .file-drop-zone {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .file-drop-zone.active {
            opacity: 1;
            pointer-events: auto;
        }
        
        .file-drop-zone.drag-over {
            background-color: rgba(139, 61, 255, 0.3);
        }
        
        .file-drop-content {
            background-color: var(--blur-bg);
            border: 2px dashed var(--accent);
            border-radius: var(--border-radius-1);
            padding: 40px;
            text-align: center;
            color: var(--colour-3);
            max-width: 80%;
        }
        
        .file-drop-content i {
            font-size: 48px;
            margin-bottom: 20px;
            color: var(--accent);
        }
        
        .file-drop-content p {
            font-size: 18px;
            margin: 0;
        }
        
        /* Add highlight to chat area when dragging */
        .chat-body.drag-highlight {
            border: 2px dashed var(--accent);
            background-color: rgba(139, 61, 255, 0.1);
        }
    `;
    document.head.appendChild(dropZoneStyles);

    // Handle drag and drop events
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('active');
        dropZone.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');

        // Check if the drag left the document
        const rect = dropZone.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (
            x < rect.left ||
            x >= rect.right ||
            y < rect.top ||
            y >= rect.bottom
        ) {
            dropZone.classList.remove('active');
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        dropZone.classList.remove('active');
        dropZone.classList.remove('drag-over');
        chatBody.classList.remove('drag-highlight');

        if (e.dataTransfer.files.length > 0) {
            // Handle image files
            const imageFiles = Array.from(e.dataTransfer.files).filter(file =>
                file.type.startsWith('image/')
            );

            if (imageFiles.length > 0) {
                imageFiles.forEach(file => {
                    image_storage[URL.createObjectURL(file)] = file;
                });
                renderMediaSelect();
                mediaSelect.classList.remove('hidden');
            }

            // Handle other files
            const otherFiles = Array.from(e.dataTransfer.files).filter(file =>
                !file.type.startsWith('image/')
            );

            if (otherFiles.length > 0) {
                // Create a new FileList-like object
                const dataTransfer = new DataTransfer();
                otherFiles.forEach(file => dataTransfer.items.add(file));

                // Set the files to the file input
                fileInput.files = dataTransfer.files;

                // Trigger the change event
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        }
    };

    // Add event listeners to document
    document.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('active');
        chatBody.classList.add('drag-highlight');
    });

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    // Add specific handling for chat body
    chatBody.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        chatBody.classList.add('drag-highlight');
    });

    chatBody.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        chatBody.classList.remove('drag-highlight');
    });

    // NEW: Add a click handler to hide the drop zone when clicked outside
    dropZone.addEventListener('click', (e) => {
        if (e.target === dropZone) {
            dropZone.classList.remove('active');
            dropZone.classList.remove('drag-over');
            chatBody.classList.remove('drag-highlight');
        }
    });

    // NEW: Add a global escape key handler to hide the drop zone
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropZone.classList.remove('active');
            dropZone.classList.remove('drag-over');
            chatBody.classList.remove('drag-highlight');
        }
    });

    // NEW: Force hide drop zone when window loses focus
    window.addEventListener('blur', () => {
        dropZone.classList.remove('active');
        dropZone.classList.remove('drag-over');
        chatBody.classList.remove('drag-highlight');
    });

    // NEW: Add a safety cleanup function that runs periodically
    setInterval(() => {
        // If no drag is happening but the zone is still active, hide it
        if (!document.querySelector('.drag-highlight') && dropZone.classList.contains('active')) {
            dropZone.classList.remove('active');
            dropZone.classList.remove('drag-over');
        }
    }, 2000);
}