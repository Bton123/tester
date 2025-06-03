const fileInput = document.getElementById('file-input');
const pdfViewer = document.getElementById('pdf-viewer');
const scanButton = document.getElementById('scan-button');
let pdfDoc = null;

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        pdfDoc = await pdfjsLib.getDocument(url).promise;
        renderPDF();
    }
});

async function renderPDF() {
    pdfViewer.innerHTML = '';
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.className = 'page-canvas';
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        pdfViewer.appendChild(canvas);
    }
}

scanButton.addEventListener('click', () => {
    if (!pdfDoc) return;
    enableEditing();
});

function enableEditing() {
    const canvases = document.querySelectorAll('.page-canvas');
    canvases.forEach((canvas) => {
        const fabricCanvas = new fabric.Canvas(canvas, { selection: true });
        // Placeholder: actual element detection not implemented
        // Example: Add a movable circle for demonstration
        const circle = new fabric.Circle({
            left: 50,
            top: 50,
            radius: 30,
            fill: 'rgba(255,0,0,0.3)',
            stroke: 'red',
        });
        fabricCanvas.add(circle);
    });
}
