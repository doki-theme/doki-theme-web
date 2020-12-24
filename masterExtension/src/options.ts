import {registerOptions} from "./ThemeUtils";

let previousListener: () => void;

function drawBackground(colors?: any) {
  const backgroundCanvas = document.getElementById(
    "backgroundImage"
  )!!;
  // @ts-ignore
  const ctx = backgroundCanvas.getContext("2d");
  if (!ctx) return;
  const mainCanvas = document.getElementById("main");
  if (!mainCanvas) {
    return;
  }

  const boundingRect = mainCanvas.getBoundingClientRect();
  const w = boundingRect.width;
  const h = boundingRect.height;

  backgroundCanvas.setAttribute('width', String(w));
  backgroundCanvas.setAttribute('height', String(h))


  ctx.clearRect(0, 0, w, h);
  ctx.beginPath();
  ctx.moveTo(0, h * 0.85);
  ctx.quadraticCurveTo(w / 1.85, h, w, 0);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);

  const color = colors && colors.headerColor || '#4c2e5c'
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}

document.addEventListener("DOMContentLoaded", () => {
  registerOptions(newTheme => {
    drawBackground(newTheme.colors)
    window.removeEventListener('resize', previousListener)
    const newListener = () => {
      drawBackground(newTheme.colors);
    }
    previousListener = newListener
    window.addEventListener('resize', newListener)
  });
  drawBackground();
  const listener = () => {
    drawBackground();
  };
  previousListener = listener;
  window.addEventListener('resize', listener);
})
