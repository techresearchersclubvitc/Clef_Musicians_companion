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





// Text Formatter Component - Girish (Backend)
// Modern, modular implementation with three formatting components

class TextFormatter {
    constructor() {
        this.currentComponent = 1;
        this.initializeElements();
        this.bindEvents();
        this.updateCharCount();
    }

    // Initialize DOM elements
    initializeElements() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.formatBtn = document.getElementById('formatBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.charCount = document.getElementById('charCount');
        this.lineCount = document.getElementById('lineCount');
        this.wordCount = document.getElementById('wordCount');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.ruleCards = document.querySelectorAll('.rule-card');
    }

    // Bind event listeners
    bindEvents() {
        this.inputText.addEventListener('input', () => this.updateCharCount());
        this.formatBtn.addEventListener('click', () => this.formatText());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.copyBtn.addEventListener('click', () => this.copyResult());
        
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchComponent(e.target.dataset.component));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.formatText();
            }
            if (e.ctrlKey && e.key === 'k') {
                this.clearAll();
            }
        });
    }

    // Update character count
    updateCharCount() {
        const count = this.inputText.value.length;
        this.charCount.textContent = count.toLocaleString();
    }

    // Switch between components
    switchComponent(componentNumber) {
        this.currentComponent = parseInt(componentNumber);
        
        // Update tab buttons
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.component === componentNumber);
        });

        // Update rule cards
        this.ruleCards.forEach((card, index) => {
            card.style.display = (index + 1) === this.currentComponent ? 'block' : 'none';
        });

        // Update button text
        const componentNames = ['Alphabetic Only', 'Numbers Only', 'Numeric with *'];
        this.formatBtn.innerHTML = `<i class="fas fa-magic"></i> Format ${componentNames[this.currentComponent - 1]}`;

        this.showToast(`Switched to ${componentNames[this.currentComponent - 1]} formatter`);
    }

    // Get input text
    getInputText() {
        return this.inputText.value;
    }

    // Component 1: Alphabetic characters only
    formatComponent1(text) {
        // Split by lines to preserve newlines
        const lines = text.split('\n');
        
        return lines.map(line => {
            // Keep only alphabetic characters and spaces
            let processed = line.replace(/[^a-zA-Z\s]/g, '');
            
            // Compress multiple spaces to single space
            processed = processed.replace(/\s+/g, ' ');
            
            // Trim leading/trailing spaces
            return processed.trim();
        }).join('\n');
    }

    // Component 2: Numbers and +/- prefixed numbers
    formatComponent2(text) {
        // Split by lines to preserve newlines
        const lines = text.split('\n');
        
        return lines.map(line => {
            // Find all numbers and +/- prefixed numbers
            const matches = line.match(/([+-]?\d+)/g) || [];
            
            // Join with single spaces
            return matches.join(' ');
        }).join('\n');
    }

    // Component 3: Numeric terms with * suffix
    formatComponent3(text) {
        // Split by lines to preserve newlines
        const lines = text.split('\n');
        
        return lines.map(line => {
            // Find numeric terms with * suffix (+6*, -7*, 123*)
            const matches = line.match(/([+-]?\d+\*)/g) || [];
            
            // Join with single spaces
            return matches.join(' ');
        }).join('\n');
    }

    // Main formatting function
    formatText() {
        const inputText = this.getInputText();
        
        if (!inputText.trim()) {
            this.showToast('Please enter some text to format', 'warning');
            this.inputText.focus();
            return;
        }

        // Add loading animation
        this.formatBtn.classList.add('loading');
        this.formatBtn.disabled = true;

        // Simulate processing delay for better UX
        setTimeout(() => {
            try {
                let result;
                
                switch (this.currentComponent) {
                    case 1:
                        result = this.formatComponent1(inputText);
                        break;
                    case 2:
                        result = this.formatComponent2(inputText);
                        break;
                    case 3:
                        result = this.formatComponent3(inputText);
                        break;
                    default:
                        throw new Error('Invalid component selected');
                }

                this.displayResult(result);
                this.showToast('Text formatted successfully!', 'success');
                
            } catch (error) {
                console.error('Formatting error:', error);
                this.showToast('Error formatting text. Please try again.', 'error');
            } finally {
                // Remove loading animation
                this.formatBtn.classList.remove('loading');
                this.formatBtn.disabled = false;
            }
        }, 500);
    }

    // Display formatted result
    displayResult(result) {
        this.outputText.textContent = result;
        
        // Update statistics
        this.updateStatistics(result);
        
        // Add success animation
        this.outputText.classList.add('success');
        setTimeout(() => {
            this.outputText.classList.remove('success');
        }, 600);
    }

    // Update output statistics
    updateStatistics(text) {
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        
        this.lineCount.textContent = lines.length;
        this.wordCount.textContent = words.length;
    }

    // Clear all content
    clearAll() {
        this.inputText.value = '';
        this.outputText.textContent = 'Your formatted text will appear here...';
        this.updateCharCount();
        this.updateStatistics('');
        this.inputText.focus();
        this.showToast('All content cleared');
    }

    // Copy result to clipboard
    async copyResult() {
        const result = this.outputText.textContent;
        
        if (!result || result === 'Your formatted text will appear here...') {
            this.showToast('No result to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(result);
            this.showToast('Result copied to clipboard!');
            
            // Add copy animation
            this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                this.copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Result';
            }, 2000);
            
        } catch (error) {
            console.error('Copy failed:', error);
            this.showToast('Failed to copy. Please try again.', 'error');
        }
    }

    // Show toast notification
    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        
        // Update toast styling based on type
        this.toast.className = 'toast';
        if (type === 'warning') {
            this.toast.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
            this.toast.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${message}</span>`;
        } else if (type === 'error') {
            this.toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            this.toast.innerHTML = `<i class="fas fa-times-circle"></i><span>${message}</span>`;
        } else {
            this.toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            this.toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
        }
        
        this.toast.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    // Utility function to validate input
    validateInput(text) {
        if (!text || typeof text !== 'string') {
            throw new Error('Invalid input: text must be a non-empty string');
        }
        return true;
    }

    // Utility function to clean text (used by all components)
    cleanText(text) {
        return text.trim().replace(/\r\n/g, '\n');
    }
}

// Advanced text processing utilities
class TextProcessor {
    // Compress multiple spaces to single space
    static compressSpaces(text) {
        return text.replace(/\s+/g, ' ');
    }

    // Remove special characters except specified ones
    static removeSpecialChars(text, keepChars = '') {
        const regex = new RegExp(`[^a-zA-Z0-9\\s${keepChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
        return text.replace(regex, '');
    }

    // Extract numbers with optional +/- prefix
    static extractNumbers(text) {
        return text.match(/([+-]?\d+)/g) || [];
    }

    // Extract numeric terms with * suffix
    static extractNumericWithAsterisk(text) {
        return text.match(/([+-]?\d+\*)/g) || [];
    }

    // Preserve line breaks while processing
    static processByLines(text, processor) {
        return text.split('\n').map(processor).join('\n');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.textFormatter = new TextFormatter();
    
    // Add some helpful console messages
    console.log('🎵 Text Formatter Component - Girish (Backend)');
    console.log('📝 Three formatting components available:');
    console.log('   1. Alphabetic Only - Keep letters, remove special chars');
    console.log('   2. Numbers Only - Keep numbers and +/- prefixed');
    console.log('   3. Numeric with * - Keep numbers with * suffix');
    console.log('⌨️  Keyboard shortcuts: Ctrl+Enter to format, Ctrl+K to clear');
    
    // Add demo text for testing
    const demoText = `Hello World! This is a test.
Numbers: 123, +45, -67, 890
Special chars: @#$%^&*()
Multiple    spaces    here
Numeric with *: +6*, -7*, 123*`;

    // Uncomment the line below to pre-fill with demo text
    // document.getElementById('inputText').value = demoText;
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TextFormatter, TextProcessor };
}

