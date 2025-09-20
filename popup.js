document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const modeSelect = document.getElementById('mode');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const statusDiv = document.getElementById('status');
    const summaryOutput = document.getElementById('summaryOutput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Load settings
    chrome.storage.sync.get(['geminiApiKey', 'summarizationMode'], (result) => {
        if (result.geminiApiKey) {
            apiKeyInput.value = result.geminiApiKey;
        }
        if (result.summarizationMode) {
            modeSelect.value = result.summarizationMode;
        }
    });

    // Save settings
    saveSettingsBtn.addEventListener('click', () => {
        const geminiApiKey = apiKeyInput.value;
        const summarizationMode = modeSelect.value;
        chrome.storage.sync.set({ geminiApiKey, summarizationMode }, () => {
            statusDiv.textContent = 'Settings saved!';
            setTimeout(() => statusDiv.textContent = '', 3000);
        });
    });

    summarizeBtn.addEventListener('click', () => {
        summaryOutput.textContent = '';
        statusDiv.textContent = 'Extracting text from PDF...';
        summarizeBtn.disabled = true;
        copyBtn.disabled = true;
        downloadBtn.disabled = true;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab.url.endsWith('.pdf')) {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    files: ['content.js']
                }, () => {
                    chrome.tabs.sendMessage(activeTab.id, { action: 'summarizePdf' });
                });
            } else {
                statusDiv.textContent = 'Please open a PDF file to summarize.';
                summarizeBtn.disabled = false;
            }
        });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'displaySummary') {
            statusDiv.textContent = '';
            summaryOutput.textContent = request.summary;
            summarizeBtn.disabled = false;
            copyBtn.disabled = false;
            downloadBtn.disabled = false;
        } else if (request.action === 'updateStatus') {
            statusDiv.textContent = request.message;
        } else if (request.action === 'summarizationError') {
            statusDiv.textContent = `Error: ${request.error}`;
            summarizeBtn.disabled = false;
            copyBtn.disabled = true;
            downloadBtn.disabled = true;
        }
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(summaryOutput.textContent).then(() => {
            statusDiv.textContent = 'Summary copied to clipboard!';
            setTimeout(() => statusDiv.textContent = '', 3000);
        }).catch(err => {
            statusDiv.textContent = 'Failed to copy summary.';
            console.error('Failed to copy: ', err);
        });
    });

    downloadBtn.addEventListener('click', () => {
        const summaryText = summaryOutput.textContent;
        const blob = new Blob([summaryText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: 'pdf_summary.txt',
            saveAs: true
        });
    });
});