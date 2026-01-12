const whiteboard = document.querySelector(".whiteboard");

let drawing = false, erasing = false;

function createwhiteboard(cols, rows, oldValues = []) {
  whiteboard.innerHTML = "";
  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = 1000;
  const cellSize = Math.floor(Math.min(maxWidth / cols, maxHeight / rows));

  for (let r=0; r<rows; r++) {
    for (let c=0; c<cols; c++) {
      const pixel = document.createElement("div");
      pixel.className = "pixel";
      pixel.draggable = false;

      const idx = r*cols + c;
      if (oldValues[idx]) pixel.classList.add("black");

      pixel.addEventListener("mousedown", e => {
        e.preventDefault();
        if (e.button === 0) pixel.classList.add("black");
        if (e.button === 2) pixel.classList.remove("black");
      });

      pixel.addEventListener("mouseover", () => {
        if (drawing) pixel.classList.add("black");
        if (erasing) pixel.classList.remove("black");
      });

      whiteboard.appendChild(pixel);
    }
  }

  whiteboard.style.width = `${cellSize * cols}px`;
  whiteboard.style.height = `${cellSize * rows}px`;
  whiteboard.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  whiteboard.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;

  whiteboard.dataset.cols = cols;
  whiteboard.dataset.rows = rows;
}

// -------------------- EVENT LISTENERS --------------------
document.addEventListener("mousedown", e => { if(e.button===0)drawing=true; if(e.button===2)erasing=true; });
document.addEventListener("mouseup", () => { drawing=false; erasing=false; });

whiteboard.addEventListener("contextmenu", e=>e.preventDefault());


document.addEventListener("DOMContentLoaded", (ev) => {
  createwhiteboard(128, 64)
})