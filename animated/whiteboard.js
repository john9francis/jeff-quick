function setupCanvas(canvas) {
  const ctx = canvas.getContext("2d");

  // Resize canvas to parent container
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  window.addEventListener("resize", resize);
  resize();

  let drawing = false;
  let erasing = false;
  let lastX = 0;
  let lastY = 0;
  const BRUSH_SIZE = 6;

  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  canvas.addEventListener("mousedown", e => {
    drawing = true;
    const pos = getMousePos(e);
    lastX = pos.x;
    lastY = pos.y;
    if (e.button === 2) erasing = true;
  });

  canvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    const pos = getMousePos(e);
    ctx.strokeStyle = erasing ? "#fff" : "#000";
    ctx.lineWidth = BRUSH_SIZE;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;
  });

  canvas.addEventListener("mouseup", () => {
    drawing = false;
    erasing = false;
  });

  // Disable right-click menu
  canvas.addEventListener("contextmenu", e => e.preventDefault());
}

// Initialize hero and section canvases
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("canvas").forEach(setupCanvas);
});
