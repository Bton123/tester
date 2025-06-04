# PDF Editing Demo

This is a simple web application that allows uploading a PDF and viewing it in the browser. A **Scan** button overlays the pages with editable shapes using [fabric.js](http://fabricjs.com/). The actual detection of PDF elements is not implemented, but the framework is provided for experimentation.

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```
2. **Change into the project directory**
   ```bash
   cd tester
   ```
3. **Open the project**
   - Either open `index.html` directly in a modern browser, **or**
   - Start a simple HTTP server (for example with Python) and navigate to `http://localhost:8000`:
     ```bash
     python3 -m http.server
     ```

## Usage

1. Open `index.html` in a modern browser.
2. Select a PDF file using the upload input.
3. Click **Scan** to enable editing. Placeholder shapes are added for demonstration.

## Development

This project uses CDN builds of `pdf.js` and `fabric.js`.
