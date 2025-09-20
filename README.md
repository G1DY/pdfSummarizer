# pdfSummarizer

This is a Chrome extension designed to summarize PDF documents directly within your browser. It allows users to quickly get a concise overview of lengthy PDF content.

## Features Implemented

*   **PDF Content Extraction:** Utilizes PDF.js to parse and extract text from PDF documents displayed in the browser.
*   **Text Chunking:** Efficiently breaks down large text content into manageable chunks for processing, handled by `utils/chunker.js`.
*   **Content Summarization:** Sends extracted text to an external AI service (as implemented in `summarizer.js`) to generate concise summaries.
*   **User-Friendly Interface:** Provides a simple popup interface (`popup.html`, `popup.js`, `popup.css`) for initiating summarization and displaying results.
*   **Background Processing:** Handles background tasks and communication between different parts of the extension (`background.js`).

## Technologies Used

*   **HTML, CSS, JavaScript:** Standard web technologies for building the extension's UI and logic.
*   **PDF.js (pdf.min.js, pdf.worker.min.js):** A JavaScript library for parsing and rendering PDF files.
*   **Chrome Extension API:** For browser integration and functionality.
*   **External AI Summarization Service:** (Assumed, based on `summarizer.js` functionality) An external API is used for the actual summarization process. The specific service would be configured within `summarizer.js`.

## Setup and Run Instructions

To install and run this extension in your Chrome or Chromium-based browser:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/pdfSummarizer.git
    cd pdfSummarizer
    ```
2.  **Open Chrome/Brave/Edge and navigate to Extensions:**
    *   Type `chrome://extensions` (or `brave://extensions`, `edge://extensions`) in your browser's address bar and press Enter.
3.  **Enable Developer Mode:**
    *   Toggle the "Developer mode" switch, usually located in the top right corner of the extensions page.
4.  **Load the unpacked extension:**
    *   Click on the "Load unpacked" button.
    *   Navigate to the directory where you cloned this repository (`pdfSummarizer/`) and select it.
5.  **Pin the extension (optional but recommended):**
    *   Click on the puzzle piece icon (Extensions icon) in your browser toolbar.
    *   Find "pdfSummarizer" and click the pin icon next to it to make it visible in your toolbar.

## How to Use:

1.  Open any PDF document in your browser.
2.  Click on the "pdfSummarizer" extension icon in your browser toolbar.
3.  The popup will display the summary of the PDF content.

## Notes on AI Usage (Tools and Contexts)

The core summarization functionality relies on an external Artificial Intelligence service. The `summarizer.js` script is responsible for sending the extracted PDF text to this service and receiving the generated summary. The specific AI model or API used is configured within `summarizer.js`. This approach allows the extension to leverage powerful, up-to-date summarization models without embedding them directly within the extension, keeping the extension lightweight and flexible.
