// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

// DOM elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const pdfUploadArea = document.getElementById('pdf-upload-area');
const pdfFileInput = document.getElementById('pdf-file-input');
const pdfFileInfo = document.getElementById('pdf-file-info');
const pdfFileName = document.getElementById('pdf-file-name');
const pdfFileSize = document.getElementById('pdf-file-size');
const extractPdfButton = document.getElementById('extract-pdf-button');
const pdfProgressContainer = document.getElementById('pdf-progress-container');
const pdfProgressBar = document.getElementById('pdf-progress-bar');
const pdfProgressText = document.getElementById('pdf-progress-text');

const imageUploadArea = document.getElementById('image-upload-area');
const imageFileInput = document.getElementById('image-file-input');
const imageFileInfo = document.getElementById('image-file-info');
const imageFileName = document.getElementById('image-file-name');
const imageFileSize = document.getElementById('image-file-size');
const extractImageButton = document.getElementById('extract-image-button');
const imageProgressContainer = document.getElementById('image-progress-container');
const imageProgressBar = document.getElementById('image-progress-bar');
const imageProgressText = document.getElementById('image-progress-text');

const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-button');
const downloadButton = document.getElementById('download-button');
const clearButton = document.getElementById('clear-button');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Tab switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Update active tab button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update active tab content
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// PDF file handling
pdfUploadArea.addEventListener('click', () => {
    pdfFileInput.click();
});

pdfUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    pdfUploadArea.classList.add('dragover');
});

pdfUploadArea.addEventListener('dragleave', () => {
    pdfUploadArea.classList.remove('dragover');
});

pdfUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    pdfUploadArea.classList.remove('dragover');

    if (e.dataTransfer.files.length) {
        handlePdfFile(e.dataTransfer.files[0]);
    }
});

pdfFileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handlePdfFile(e.target.files[0]);
    }
});

function handlePdfFile(file) {
    if (file.type !== 'application/pdf') {
        showNotification('Please upload a valid PDF file', 'error');
        return;
    }

    pdfFileName.textContent = file.name;
    pdfFileSize.textContent = formatFileSize(file.size);
    pdfFileInfo.classList.add('active');

    // Store the file for later use
    window.currentPdfFile = file;
}

extractPdfButton.addEventListener('click', extractPdfText);

async function extractPdfText() {
    if (!window.currentPdfFile) {
        showNotification('No PDF file selected', 'error');
        return;
    }

    extractPdfButton.disabled = true;
    pdfProgressContainer.classList.add('active');
    pdfProgressBar.style.width = '0%';
    pdfProgressText.textContent = 'Loading PDF...';

    try {
        const fileReader = new FileReader();

        fileReader.onload = async function() {
            const typedarray = new Uint8Array(this.result);

            // Loading the document
            pdfProgressText.textContent = 'Loading PDF document...';
            const loadingTask = pdfjsLib.getDocument(typedarray);
            const pdf = await loadingTask.promise;

            let fullText = '';
            const numPages = pdf.numPages;

            // Process each page
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const progress = (pageNum / numPages) * 100;
                pdfProgressBar.style.width = `${progress}%`;
                pdfProgressText.textContent = `Processing page ${pageNum} of ${numPages}...`;

                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();

                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            // Display the result
            resultText.textContent = fullText;
            resultContainer.classList.add('active');

            // Scroll to result
            resultContainer.scrollIntoView({ behavior: 'smooth' });

            showNotification('Text extracted successfully', 'success');

            // Reset UI
            extractPdfButton.disabled = false;
            pdfProgressContainer.classList.remove('active');
        };

        fileReader.readAsArrayBuffer(window.currentPdfFile);
    } catch (error) {
        console.error('Error extracting PDF text:', error);
        showNotification('Error extracting PDF text', 'error');
        extractPdfButton.disabled = false;
        pdfProgressContainer.classList.remove('active');
    }
}

// Image file handling
imageUploadArea.addEventListener('click', () => {
    imageFileInput.click();
});

imageUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadArea.classList.add('dragover');
});

imageUploadArea.addEventListener('dragleave', () => {
    imageUploadArea.classList.remove('dragover');
});

imageUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadArea.classList.remove('dragover');

    if (e.dataTransfer.files.length) {
        handleImageFile(e.dataTransfer.files[0]);
    }
});

imageFileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleImageFile(e.target.files[0]);
    }
});

function handleImageFile(file) {
    // Check if the file is an image (any format)
    if (!file.type.match(/image.*/)) {
        showNotification('Please upload a valid image file', 'error');
        return;
    }

    imageFileName.textContent = file.name;
    imageFileSize.textContent = formatFileSize(file.size);
    imageFileInfo.classList.add('active');

    // Store the file for later use
    window.currentImageFile = file;
}

extractImageButton.addEventListener('click', extractImageText);

async function extractImageText() {
    if (!window.currentImageFile) {
        showNotification('No image file selected', 'error');
        return;
    }

    extractImageButton.disabled = true;
    imageProgressContainer.classList.add('active');
    imageProgressBar.style.width = '0%';
    imageProgressText.textContent = 'Initializing OCR...';

    try {
        const result = await Tesseract.recognize(
            window.currentImageFile,
            'eng',
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        imageProgressBar.style.width = `${progress}%`;
                        imageProgressText.textContent = `Extracting text: ${progress}%`;
                    }
                }
            }
        );

        // Display the result
        resultText.textContent = result.data.text;
        resultContainer.classList.add('active');

        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth' });

        showNotification('Text extracted successfully', 'success');

        // Reset UI
        extractImageButton.disabled = false;
        imageProgressContainer.classList.remove('active');
    } catch (error) {
        console.error('Error extracting image text:', error);
        showNotification('Error extracting image text', 'error');
        extractImageButton.disabled = false;
        imageProgressContainer.classList.remove('active');
    }
}

// Result actions
copyButton.addEventListener('click', () => {
    const text = resultText.textContent;
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Text copied to clipboard', 'success');
        })
        .catch(err => {
            console.error('Error copying text: ', err);
            showNotification('Failed to copy text', 'error');
        });
});

downloadButton.addEventListener('click', () => {
    const text = resultText.textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Text downloaded successfully', 'success');
});

clearButton.addEventListener('click', () => {
    resultText.textContent = '';
    resultContainer.classList.remove('active');

    // Reset file inputs
    pdfFileInput.value = '';
    imageFileInput.value = '';
    pdfFileInfo.classList.remove('active');
    imageFileInfo.classList.remove('active');

    // Clear stored files
    window.currentPdfFile = null;
    window.currentImageFile = null;

    showNotification('Results cleared', 'info');
});

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type) {
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;

    // Update icon based on type
    const icon = notification.querySelector('i');
    if (type === 'success') {
        icon.className = 'bi bi-check-circle';
    } else if (type === 'error') {
        icon.className = 'bi bi-exclamation-circle';
    } else if (type === 'info') {
        icon.className = 'bi bi-info-circle';
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
