# PDF Editing Demo

This is a simple web application that allows uploading a PDF and viewing it in the browser. Clicking **Scan** overlays each page with editable shapes using [fabric.js](http://fabricjs.com/). The app highlights detected text boxes as movable rectangles. True element detection for diagrams is not implemented, but the framework is provided for experimentation.

## Usage

1. Open `index.html` in a modern browser.
2. Select a PDF file using the upload input.
3. Click **Scan** to enable editing. Detected text areas are highlighted and can be resized or moved.

## Development

This project uses CDN builds of `pdf.js` and `fabric.js`.
