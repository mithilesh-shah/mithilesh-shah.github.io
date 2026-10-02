const fieldCanvas = document.querySelector("#geometry-field");
const figureCanvas = document.querySelector("#identity-figure");
const field = fieldCanvas.getContext("2d");
const figure = figureCanvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let fieldDpr = 1;
let figureDpr = 1;
let animationFrame = null;

function resizeCanvas(canvas, context) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return dpr;
}

function resize() {
  fieldDpr = resizeCanvas(fieldCanvas, field);
  figureDpr = resizeCanvas(figureCanvas, figure);
  draw(performance.now());
}

function drawField(time) {
  const w = fieldCanvas.width / fieldDpr;
  const h = fieldCanvas.height / fieldDpr;
  const t = reduceMotion.matches ? 0.8 : time * 0.00035;

  field.clearRect(0, 0, w, h);
  field.lineWidth = 1;

  for (let y = 36; y < h; y += 38) {
    field.beginPath();
    for (let x = -30; x <= w + 30; x += 6) {
      const u = x / Math.max(w, 1);
      const bend =
        Math.sin(u * Math.PI * 4 + t * 2.1 + y * 0.018) * 12 +
        Math.cos(u * Math.PI * 9 - t * 1.4) * 5;
      const yy = y + bend;
      if (x === -30) field.moveTo(x, yy);
      else field.lineTo(x, yy);
    }
    field.strokeStyle = y % 76 === 0 ? "rgba(180, 71, 53, 0.18)" : "rgba(49, 95, 159, 0.11)";
    field.stroke();
  }

  const cx = w * 0.73;
  const cy = h * 0.42;
  const scale = Math.min(w, h) * 0.32;
  for (let ring = 0; ring < 9; ring += 1) {
    field.beginPath();
    field.ellipse(
      cx,
      cy,
      scale * (0.2 + ring * 0.075),
      scale * (0.08 + ring * 0.035),
      t + ring * 0.24,
      0,
      Math.PI * 2
    );
    field.strokeStyle = ring % 3 === 0 ? "rgba(39, 113, 94, 0.18)" : "rgba(23, 23, 23, 0.08)";
    field.stroke();
  }
}

function drawFigure(time) {
  const w = figureCanvas.width / figureDpr;
  const h = figureCanvas.height / figureDpr;
  const t = reduceMotion.matches ? 1.2 : time * 0.001;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.42;

  figure.clearRect(0, 0, w, h);
  figure.save();
  figure.translate(cx, cy);
  figure.rotate(Math.sin(t * 0.28) * 0.12);

  for (let layer = 0; layer < 7; layer += 1) {
    figure.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.012; a += 0.012) {
      const r =
        radius *
        (0.36 + layer * 0.064) *
        (1 + Math.sin(5 * a + t * (0.65 + layer * 0.08)) * 0.13);
      const x = Math.cos(a) * r;
      const y = Math.sin(a * 1.04) * r * 0.82;
      if (a === 0) figure.moveTo(x, y);
      else figure.lineTo(x, y);
    }
    figure.strokeStyle = layer % 2 === 0 ? "rgba(49, 95, 159, 0.58)" : "rgba(180, 71, 53, 0.44)";
    figure.lineWidth = 1.25;
    figure.stroke();
  }

  const nodes = Array.from({ length: 34 }, (_, index) => {
    const angle = index * 2.39996 + t * 0.12;
    const r = radius * (0.12 + ((index * 11) % 29) / 38);
    return {
      x: Math.cos(angle) * r,
      y: Math.sin(angle * 1.27) * r * 0.78,
    };
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (distance < radius * 0.36) {
        figure.beginPath();
        figure.moveTo(nodes[i].x, nodes[i].y);
        figure.lineTo(nodes[j].x, nodes[j].y);
        figure.strokeStyle = `rgba(23, 23, 23, ${0.12 * (1 - distance / (radius * 0.36))})`;
        figure.lineWidth = 1;
        figure.stroke();
      }
    }
  }

  nodes.forEach((node, index) => {
    figure.beginPath();
    figure.arc(node.x, node.y, index % 8 === 0 ? 2.8 : 1.8, 0, Math.PI * 2);
    figure.fillStyle = index % 8 === 0 ? "rgba(39, 113, 94, 0.86)" : "rgba(23, 23, 23, 0.52)";
    figure.fill();
  });

  figure.restore();
}

function draw(time) {
  drawField(time);
  drawFigure(time);
}

function animate(time) {
  draw(time);
  if (!reduceMotion.matches) {
    animationFrame = requestAnimationFrame(animate);
  }
}

function restartAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = null;
  animate(performance.now());
}

window.addEventListener("resize", resize);
reduceMotion.addEventListener("change", restartAnimation);
resize();
restartAnimation();
