console.log('Content script loaded on:', window.location.href);
const PDF_JS_VERSION = '3.11.174'; // Use a specific version
const PDF_JS_BASE_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}`;

async function loadPdfJs() {
    if (window.pdfjsLib) {
        return;
    }

    const script = document.createElement('script');
    script.src = `${PDF_JS_BASE_URL}/pdf.min.js`;
    document.head.appendChild(script);

    await new Promise(resolve => {
        script.onload = resolve;
    });

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDF_JS_BASE_URL}/pdf.worker.min.js`;
}

async function extractTextFromPdf() {
    await loadPdfJs();

    const pdfUrl = window.location.href;
    const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarizePdf') {
        (async () => {
            try {
                chrome.runtime.sendMessage({ action: 'updateStatus', message: 'Extracting text from PDF...' });
                const text = await extractTextFromPdf();
                chrome.runtime.sendMessage({ action: 'getTextResponse', text: text });
            } catch (error) {
                console.error('Error extracting PDF text:', error);
                chrome.runtime.sendMessage({ action: 'summarizationError', error: 'Failed to extract text from PDF.' });
            }
        })();
        return true; // Indicates that sendResponse will be called asynchronously
    } else if (request.action === 'getText') {
        (async () => {
            const text = await extractTextFromPdf();
            sendResponse({ text: text });
        })();
        return true; // Indicates that sendResponse will be called asynchronously
    }
});