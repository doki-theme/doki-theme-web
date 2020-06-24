import DokiThemeDefinitions from "./DokiThemeDefinitions";
import {registerOptions} from "./ThemeUtils";

function drawBackground() {
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
  ctx.fillStyle = "#4c2e5c";
  ctx.strokeStyle = "#4c2e5c";
  ctx.fill();
  ctx.closePath();
  ctx.stroke();
}


document.addEventListener("DOMContentLoaded", () => {
  registerOptions();
  drawBackground();
  window.addEventListener('resize', () => {
    drawBackground();
  });
})
