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

        const container = document.createElement('div');
        container.className = 'page-container';

        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-canvas';
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const overlay = document.createElement('canvas');
        overlay.className = 'overlay-canvas';
        overlay.width = viewport.width;
        overlay.height = viewport.height;

        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport }).promise;

        container.appendChild(canvas);
        container.appendChild(overlay);
        pdfViewer.appendChild(container);
    }
}

scanButton.addEventListener('click', () => {
    if (!pdfDoc) return;
    enableEditing();
});

async function enableEditing() {
    const containers = document.querySelectorAll('.page-container');

    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.textContent = 'Scanning...';
    document.body.appendChild(loading);

    for (let i = 0; i < containers.length; i++) {
        const overlay = containers[i].querySelector('.overlay-canvas');
        const fabricCanvas = new fabric.Canvas(overlay, { selection: true });

        const page = await pdfDoc.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1.5 });
        const textContent = await page.getTextContent();

        textContent.items.forEach((item) => {
            const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
            const x = tx[4];
            const y = tx[5];
            const height = Math.hypot(tx[2], tx[3]);
            const rect = new fabric.Rect({
                left: x,
                top: y - height,
                width: item.width * viewport.scale,
                height,
                fill: 'rgba(0, 0, 255, 0.2)',
                stroke: 'blue',
                selectable: true,
            });
            fabricCanvas.add(rect);
        });
    }

    loading.remove();
}
