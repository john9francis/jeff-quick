const whiteboard = document.querySelector(".whiteboard");

let drawing = false;
let erasing = false;
let lastIdx = null;

const BRUSH_RADIUS = 1; // 0 = skinny, 1 = slightly thicker

function createwhiteboard(cols, rows, oldValues = []) {
  whiteboard.innerHTML = "";

  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = 1000;
  const cellSize = Math.floor(Math.min(maxWidth / cols, maxHeight / rows));

  whiteboard.dataset.cols = cols;
  whiteboard.dataset.rows = rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.draggable = false;

      const idx = r * cols + c;
      pixel.dataset.idx = idx;

      if (oldValues[idx]) pixel.classList.add("black");

      pixel.addEventListener("mousedown", e => {
        e.preventDefault();
        lastIdx = idx;
        drawLine(lastIdx, idx, BRUSH_RADIUS, e.button === 0);
      });

      pixel.addEventListener("mouseover", () => {
        if (drawing) {
          drawLine(lastIdx, idx, BRUSH_RADIUS, true);
          lastIdx = idx;
        }
        if (erasing) {
          drawLine(lastIdx, idx, BRUSH_RADIUS, false);
          lastIdx = idx;
        }
      });

      whiteboard.appendChild(pixel);
    }
  }

  whiteboard.style.width = `${cellSize * cols}px`;
  whiteboard.style.height = `${cellSize * rows}px`;
  whiteboard.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  whiteboard.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
}

function paint(idx, radius, add) {
  const cols = Number(whiteboard.dataset.cols);
  const rows = Number(whiteboard.dataset.rows);

  const r0 = Math.floor(idx / cols);
  const c0 = idx % cols;

  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      const r = r0 + dr;
      const c = c0 + dc;
      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      if (Math.sqrt(dr * dr + dc * dc) > radius) continue;

      const i = r * cols + c;
      whiteboard.children[i]
        ?.classList[add ? "add" : "remove"]("black");
    }
  }
}

function drawLine(idx0, idx1, radius, add) {
  if (idx0 === null) {
    paint(idx1, radius, add);
    return;
  }

  const cols = Number(whiteboard.dataset.cols);

  let x0 = idx0 % cols;
  let y0 = Math.floor(idx0 / cols);
  let x1 = idx1 % cols;
  let y1 = Math.floor(idx1 / cols);

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    paint(y0 * cols + x0, radius, add);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx)  { err += dx; y0 += sy; }
  }
}

/* ---------- global mouse state ---------- */
document.addEventListener("mousedown", e => {
  if (e.button === 0) drawing = true;
  if (e.button === 2) erasing = true;
});

document.addEventListener("mouseup", () => {
  drawing = false;
  erasing = false;
  lastIdx = null;
});

whiteboard.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("DOMContentLoaded", () => {
  createwhiteboard(128, 64);
});
