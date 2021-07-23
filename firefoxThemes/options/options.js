
function drawBackground(colors) {
  const backgroundCanvas = document.getElementById(
    "backgroundImage"
  );
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
  ctx.quadraticCurveTo(w / 1.85, h, w, h / 2);
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
  browser.storage.local.get(["waifuThemes","currentThemeId"])
  .then(({
    waifuThemes, currentThemeId,
  })=> {
    const dokiTheme = waifuThemes.themes.find(
      theme => theme.id === currentThemeId
    );

    if (!dokiTheme) return;

    const colors = dokiTheme.definition.colors;
    drawBackground(colors)
    const newListener = () => {
      drawBackground(colors);
    }
    window.addEventListener('resize', newListener)

  })
})