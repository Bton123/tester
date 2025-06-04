const fileInput = document.getElementById('file-input');
const pdfViewer = document.getElementById('pdf-viewer');
const scanButton = document.getElementById('scan-button');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');
let pdfDoc = null;
let currentPage = 1;
let fabricCanvas = null;

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        pdfDoc = await pdfjsLib.getDocument(url).promise;
        currentPage = 1;
        renderPage(currentPage);
        updatePageInfo();
    }
});

async function renderPage(pageNum) {
    pdfViewer.innerHTML = '';
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    canvas.className = 'pdf-canvas';
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    pdfViewer.appendChild(canvas);
    fabricCanvas = null;
}

function updatePageInfo() {
    pageInfo.textContent = `${currentPage} / ${pdfDoc.numPages}`;
}

scanButton.addEventListener('click', () => {
    if (!pdfDoc) return;
    enableEditing(currentPage);
});

prevButton.addEventListener('click', () => {
    if (!pdfDoc || currentPage === 1) return;
    currentPage--;
    renderPage(currentPage);
    updatePageInfo();
});

nextButton.addEventListener('click', () => {
    if (!pdfDoc || currentPage === pdfDoc.numPages) return;
    currentPage++;
    renderPage(currentPage);
    updatePageInfo();
});

async function enableEditing(pageNum) {
    const canvas = document.querySelector('.pdf-canvas');
    const dataURL = canvas.toDataURL();
    fabricCanvas = new fabric.Canvas(canvas, { selection: true });
    fabric.Image.fromURL(dataURL, img => {
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas));
    });
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });
    const opList = await page.getOperatorList();
    parseOperatorList(opList, viewport, fabricCanvas);
}

function parseOperatorList(opList, viewport, fabricCanvas) {
    const DrawOPS = { moveTo: 0, lineTo: 1, curveTo: 2, closePath: 3 };
    const { fnArray, argsArray } = opList;
    for (let i = 0; i < fnArray.length; i++) {
        const fn = fnArray[i];
        const args = argsArray[i];
        if (fn === pdfjsLib.OPS.rectangle) {
            const [x, y, w, h] = args;
            const [vx1, vy1, vx2, vy2] = viewport.convertToViewportRectangle([x, y, x + w, y + h]);
            const rect = new fabric.Rect({
                left: Math.min(vx1, vx2),
                top: Math.min(vy1, vy2),
                width: Math.abs(vx2 - vx1),
                height: Math.abs(vy2 - vy1),
                fill: 'rgba(0,0,255,0.1)',
                stroke: 'blue',
            });
            fabricCanvas.add(rect);
        } else if (fn === pdfjsLib.OPS.constructPath) {
            const [drawOp, [pathBuffer], minMax] = args;
            if (!pathBuffer || !minMax) continue;
            const ops = [];
            for (let j = 0; j < pathBuffer.length;) {
                const op = pathBuffer[j++];
                ops.push(op);
                if (op === DrawOPS.moveTo || op === DrawOPS.lineTo) {
                    j += 2;
                } else if (op === DrawOPS.curveTo) {
                    j += 6;
                }
            }
            if (ops.length === 6 && ops[0] === DrawOPS.moveTo && ops[5] === DrawOPS.closePath && ops.slice(1,5).every(o => o === DrawOPS.curveTo)) {
                const [vx1, vy1, vx2, vy2] = viewport.convertToViewportRectangle(minMax);
                const ellipse = new fabric.Ellipse({
                    left: Math.min(vx1, vx2),
                    top: Math.min(vy1, vy2),
                    rx: Math.abs(vx2 - vx1) / 2,
                    ry: Math.abs(vy2 - vy1) / 2,
                    fill: 'rgba(255,0,0,0.1)',
                    stroke: 'red',
                });
                fabricCanvas.add(ellipse);
            }
        }
    }
}
