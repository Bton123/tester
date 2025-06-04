# PDF Editing Demo

This is a simple web application that allows uploading a PDF and viewing it in the browser. You can navigate the document one page at a time and press **Scan This Page** to highlight detected rectangles and circles using [fabric.js](http://fabricjs.com/). Text areas appear as movable rectangles. Diagram detection is not fully implemented yet, but the framework is provided for experimentation.

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
   - Start a simple HTTP server and navigate to `http://localhost:8000`:
     ```bash
     python3 -m http.server
     ```

## Usage

1. Select a PDF file using the upload input.
2. Use **Prev** and **Next** to switch pages.
3. Click **Scan This Page** to enable editing for the page in view. Detected rectangles and circles become editable.

## Development

This project uses CDN builds of `pdf.js` and `fabric.js`.
