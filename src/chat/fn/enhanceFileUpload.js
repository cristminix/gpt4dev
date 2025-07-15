import framework from "./framework";
import { upload_files } from "./upload_files";
// Enhance the existing file upload functionality
export function enhanceFileUpload() {
    // Add visual feedback when files are being processed
    const originalUploadFiles = upload_files;
    window.upload_files = async function (fileInput) {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'file-upload-loading';
        loadingIndicator.innerHTML = `
            <div class="upload-spinner"></div>
            <p>${framework.translate("Uploading files...")}</p>
        `;
        document.body.appendChild(loadingIndicator);

        try {
            await originalUploadFiles(fileInput);
        } finally {
            // Remove loading indicator
            document.body.removeChild(loadingIndicator);
        }
    };

    // Add CSS for loading indicator
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .file-upload-loading {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--blur-bg);
            border-radius: var(--border-radius-1);
            padding: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .upload-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid var(--colour-3);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spinner 0.8s linear infinite;
        }
        
        .file-upload-loading p {
            margin: 0;
            color: var(--colour-3);
        }
    `;
    document.head.appendChild(loadingStyles);
}
