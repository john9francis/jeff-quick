const whiteboard = document.querySelector(".whiteboard");

let drawing = false;
let erasing = false;
const BRUSH_RADIUS = 4;
const WHITEBOARD_SIZE_X = 500;
const WHITEBOARD_SIZE_Y = 200;

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
        paint(idx, BRUSH_RADIUS, e.button === 0);
      });

      pixel.addEventListener("mouseover", () => {
        if (drawing) paint(idx, BRUSH_RADIUS, true);
        if (erasing) paint(idx, BRUSH_RADIUS, false);
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

      if (Math.sqrt(dr * dr + dc * dc) > radius) continue; // circular brush

      const i = r * cols + c;
      const p = whiteboard.children[i];
      if (!p) continue;

      p.classList[add ? "add" : "remove"]("black");
    }
  }
}

/* -------- global mouse state -------- */
document.addEventListener("mousedown", e => {
  if (e.button === 0) drawing = true;
  if (e.button === 2) erasing = true;
});

document.addEventListener("mouseup", () => {
  drawing = false;
  erasing = false;
});

whiteboard.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("DOMContentLoaded", () => {
  createwhiteboard(WHITEBOARD_SIZE_X, WHITEBOARD_SIZE_Y);
});
