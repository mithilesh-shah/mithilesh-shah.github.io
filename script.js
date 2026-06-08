const routes = [...document.querySelectorAll("[data-route]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const researchGroup = document.querySelector('[data-group="research"]');

function setRoute(route) {
  const activeRoute = panels.some((panel) => panel.dataset.panel === route) ? route : "about";

  routes.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.route === activeRoute);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === activeRoute);
  });

  if (researchGroup) {
    researchGroup.classList.toggle("is-open", ["research", "working", "pipeline"].includes(activeRoute));
  }
}

function readRoute() {
  setRoute(window.location.hash.replace("#", "") || "about");
}

window.addEventListener("hashchange", readRoute);
readRoute();

const orbCanvas = document.querySelector("#math-orb");
const waveCanvas = document.querySelector("#name-wave");
const latticeCanvas = document.querySelector("#name-lattice");
const fieldCanvas = document.querySelector("#field-canvas");
const orb = orbCanvas.getContext("2d");
const wave = waveCanvas.getContext("2d");
const lattice = latticeCanvas.getContext("2d");
const field = fieldCanvas.getContext("2d");
let orbDpr = 1;
let waveDpr = 1;
let latticeDpr = 1;
let fieldDpr = 1;
const modeDuration = 30000;
const modeCount = 4;

function resizeCanvas(canvas, context, cssWidth, cssHeight) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return dpr;
}

function resize() {
  const orbRect = orbCanvas.getBoundingClientRect();
  orbDpr = resizeCanvas(orbCanvas, orb, orbRect.width, orbRect.height);

  const waveRect = waveCanvas.getBoundingClientRect();
  waveDpr = resizeCanvas(waveCanvas, wave, waveRect.width, waveRect.height);

  const latticeRect = latticeCanvas.getBoundingClientRect();
  latticeDpr = resizeCanvas(latticeCanvas, lattice, latticeRect.width, latticeRect.height);

  const stageLeft = window.innerWidth > 820 ? 350 : 0;
  const fieldWidth = window.innerWidth - stageLeft;
  const fieldHeight = window.innerHeight;
  fieldCanvas.style.width = `${fieldWidth}px`;
  fieldCanvas.style.height = `${fieldHeight}px`;
  fieldDpr = resizeCanvas(fieldCanvas, field, fieldWidth, fieldHeight);
}

window.addEventListener("resize", resize);
resize();

function drawIdentityLissajous(cx, cy, radius, t) {
  orb.save();
  orb.translate(cx, cy);
  orb.rotate(Math.sin(t * 0.22) * 0.18);

  for (let layer = 0; layer < 6; layer += 1) {
    orb.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.01) {
      const x = Math.sin(3 * a + t * (0.36 + layer * 0.02)) * radius * (0.54 + layer * 0.055);
      const y = Math.sin(4 * a + layer * 0.7 - t * 0.28) * radius * (0.28 + layer * 0.04);
      if (a === 0) orb.moveTo(x, y);
      else orb.lineTo(x, y);
    }
    orb.strokeStyle = layer % 2 ? "rgba(194,65,45,0.32)" : "rgba(85,118,232,0.34)";
    orb.lineWidth = 1.1;
    orb.stroke();
  }

  for (let x = -radius * 0.9; x <= radius * 0.9; x += 18) {
    orb.beginPath();
    orb.moveTo(x, -radius * 0.18 + Math.sin(t + x) * 6);
    orb.lineTo(x + Math.sin(t * 0.7 + x) * 10, radius * 0.18 + Math.cos(t + x) * 6);
    orb.strokeStyle = "rgba(20,20,20,0.1)";
    orb.stroke();
  }

  orb.restore();
}

function drawIdentityRose(cx, cy, radius, t) {
  orb.save();
  orb.translate(cx, cy);
  orb.rotate(t * 0.18);

  for (let layer = 0; layer < 5; layer += 1) {
    orb.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.012) {
      const k = 3 + layer;
      const r = radius * (0.24 + layer * 0.11) * Math.cos(k * a + t * (0.28 + layer * 0.03));
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (a === 0) orb.moveTo(x, y);
      else orb.lineTo(x, y);
    }
    orb.strokeStyle = layer % 2 ? "rgba(194,65,45,0.34)" : "rgba(255,255,255,0.42)";
    orb.lineWidth = 1.1;
    orb.stroke();
  }

  orb.restore();
}

function drawIdentityHyperbolic(cx, cy, radius, t) {
  orb.save();
  orb.translate(cx, cy);
  orb.rotate(Math.sin(t * 0.18) * 0.25);

  for (let i = -7; i <= 7; i += 1) {
    orb.beginPath();
    for (let x = -radius; x <= radius; x += 3) {
      const y = (i * radius * 0.12) + Math.tanh(x / radius * 2.2) * radius * 0.32 + Math.sin(t + i) * 3;
      if (x === -radius) orb.moveTo(x, y);
      else orb.lineTo(x, y);
    }
    orb.strokeStyle = i % 2 ? "rgba(85,118,232,0.28)" : "rgba(30,30,30,0.22)";
    orb.stroke();

    orb.beginPath();
    for (let y = -radius; y <= radius; y += 3) {
      const x = (i * radius * 0.12) + Math.tanh(y / radius * 2.2) * radius * 0.32 + Math.cos(t + i) * 3;
      if (y === -radius) orb.moveTo(x, y);
      else orb.lineTo(x, y);
    }
    orb.strokeStyle = i % 2 ? "rgba(194,65,45,0.2)" : "rgba(255,255,255,0.18)";
    orb.stroke();
  }

  orb.restore();
}

function drawIdentityTriangulation(cx, cy, radius, t) {
  const nodes = Array.from({ length: 26 }, (_, index) => {
    const a = index * 2.399 + t * (0.08 + (index % 3) * 0.012);
    const r = radius * (0.16 + ((index * 7) % 17) / 20);
    return {
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a * 1.3) * r * 0.78,
    };
  });

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < radius * 0.44) {
        orb.beginPath();
        orb.moveTo(nodes[i].x, nodes[i].y);
        orb.lineTo(nodes[j].x, nodes[j].y);
        orb.strokeStyle = `rgba(20,20,20,${0.18 * (1 - d / (radius * 0.44))})`;
        orb.stroke();
      }
    }
  }

  nodes.forEach((node, index) => {
    orb.beginPath();
    orb.arc(node.x, node.y, index % 6 === 0 ? 2.8 : 1.9, 0, Math.PI * 2);
    orb.fillStyle = index % 6 === 0 ? "rgba(194,65,45,0.55)" : "rgba(255,255,255,0.58)";
    orb.fill();
  });

}

function drawIdentityFigure(time, mode) {
  const w = orbCanvas.width / orbDpr;
  const h = orbCanvas.height / orbDpr;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.45;
  const t = time * 0.001;

  orb.clearRect(0, 0, w, h);

  if (mode === 1) drawIdentityRose(cx, cy, radius, t);
  else if (mode === 2) drawIdentityHyperbolic(cx, cy, radius, t);
  else if (mode === 3) drawIdentityTriangulation(cx, cy, radius, t);
  else drawIdentityLissajous(cx, cy, radius, t);
}

function getMode(time) {
  return Math.floor(time / modeDuration) % modeCount;
}

function drawNameWave(time, mode) {
  const w = waveCanvas.width / waveDpr;
  const h = waveCanvas.height / waveDpr;
  const t = time * 0.001;

  wave.clearRect(0, 0, w, h);
  wave.save();
  wave.globalCompositeOperation = "multiply";

  if (mode === 1) {
    wave.translate(w * 0.5, h * 0.5);
    for (let turn = 0; turn < 3; turn += 1) {
      wave.beginPath();
      for (let a = 0; a < Math.PI * 8; a += 0.06) {
        const r = 5 + a * (3.2 + turn * 0.35);
        const x = Math.cos(a + t * 0.35 + turn) * r;
        const y = Math.sin(a + t * 0.35 + turn) * r * 0.48;
        if (a === 0) wave.moveTo(x, y);
        else wave.lineTo(x, y);
      }
      wave.strokeStyle = turn === 1 ? "rgba(194,65,45,0.2)" : "rgba(85,118,232,0.24)";
      wave.lineWidth = 1.1;
      wave.stroke();
    }
    wave.restore();
    return;
  }

  if (mode === 2) {
    for (let y = 14; y < h; y += 16) {
      wave.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const v = Math.sin(x * 0.028 + y * 0.09 + t) + Math.cos(x * 0.011 - t * 0.7);
        const yy = y + v * 5;
        if (x === 0) wave.moveTo(x, yy);
        else wave.lineTo(x, yy);
      }
      wave.strokeStyle = "rgba(20,20,20,0.12)";
      wave.lineWidth = 1;
      wave.stroke();
    }
    wave.restore();
    return;
  }

  if (mode === 3) {
    wave.translate(w * 0.5, h * 0.52);
    for (let orbit = 0; orbit < 5; orbit += 1) {
      wave.beginPath();
      const rx = w * (0.22 + orbit * 0.055);
      const ry = h * (0.13 + orbit * 0.03);
      wave.ellipse(0, 0, rx, ry, Math.sin(t * 0.35 + orbit) * 0.7, 0, Math.PI * 2);
      wave.strokeStyle = orbit % 2 === 0 ? "rgba(12,12,12,0.15)" : "rgba(194,65,45,0.16)";
      wave.stroke();
    }
    wave.restore();
    return;
  }

  for (let band = 0; band < 4; band += 1) {
    wave.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const u = x / w;
      const y =
        h * (0.36 + band * 0.11) +
        Math.sin(u * Math.PI * (2.4 + band * 0.8) + t * (0.9 + band * 0.18)) * (12 - band) +
        Math.cos(u * Math.PI * 7 - t * 0.75) * 3;
      if (x === 0) wave.moveTo(x, y);
      else wave.lineTo(x, y);
    }
    wave.strokeStyle = band % 2 === 0 ? "rgba(85,118,232,0.26)" : "rgba(194,65,45,0.2)";
    wave.lineWidth = 1.2;
    wave.stroke();
  }

  wave.beginPath();
  for (let a = 0; a <= Math.PI * 2 + 0.04; a += 0.04) {
    const x = w * 0.48 + Math.sin(a * 3 + t * 0.7) * w * 0.38;
    const y = h * 0.5 + Math.sin(a * 2 - t * 0.85) * h * 0.28;
    if (a === 0) wave.moveTo(x, y);
    else wave.lineTo(x, y);
  }
  wave.strokeStyle = "rgba(30,30,30,0.18)";
  wave.lineWidth = 1;
  wave.stroke();
  wave.restore();
}

const latticePoints = Array.from({ length: 24 }, (_, index) => ({
  x: (index % 6) / 5,
  y: Math.floor(index / 6) / 3,
  phase: index * 0.73,
}));

function drawNameLattice(time, mode) {
  const w = latticeCanvas.width / latticeDpr;
  const h = latticeCanvas.height / latticeDpr;
  const t = time * 0.001;
  const nodes = latticePoints.map((point, index) => {
    if (mode === 1) {
      const a = point.phase + t * 0.28;
      const r = 18 + index * 3.6;
      return {
        x: w * 0.5 + Math.cos(a) * r,
        y: h * 0.5 + Math.sin(a * 1.7) * r * 0.42,
      };
    }
    if (mode === 2) {
      const x = 18 + point.x * (w - 36);
      return {
        x,
        y: 20 + point.y * (h - 40) + Math.sin(x * 0.03 + t + point.phase) * 12,
      };
    }
    if (mode === 3) {
      const a = point.phase + t * (0.12 + (index % 4) * 0.025);
      return {
        x: w * 0.5 + Math.cos(a) * (36 + (index % 6) * 18),
        y: h * 0.5 + Math.sin(a) * (22 + Math.floor(index / 6) * 18),
      };
    }
    return {
      x: 18 + point.x * (w - 36) + Math.sin(t * 0.7 + point.phase) * 7,
      y: 18 + point.y * (h - 36) + Math.cos(t * 0.6 + point.phase) * 7,
    };
  });

  lattice.clearRect(0, 0, w, h);
  lattice.save();
  lattice.globalCompositeOperation = "multiply";

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (distance < 74) {
        lattice.beginPath();
        lattice.moveTo(nodes[i].x, nodes[i].y);
        lattice.lineTo(nodes[j].x, nodes[j].y);
        lattice.strokeStyle = `rgba(12,12,12,${0.08 * (1 - distance / 74)})`;
        lattice.lineWidth = 1;
        lattice.stroke();
      }
    }
  }

  nodes.forEach((node, index) => {
    lattice.beginPath();
    lattice.arc(node.x, node.y, index % 5 === 0 ? 2.8 : 2, 0, Math.PI * 2);
    lattice.fillStyle = index % 5 === 0 ? "rgba(194,65,45,0.3)" : "rgba(20,20,20,0.18)";
    lattice.fill();
  });

  lattice.restore();
}

const pointCount = 58;
const points = Array.from({ length: pointCount }, (_, index) => {
  const angle = (index / pointCount) * Math.PI * 2;
  const band = index % 4;
  return {
    angle,
    band,
    speed: 0.08 + (index % 9) * 0.012,
    phase: index * 0.51,
  };
});

function drawFieldNetwork(time, w, h, t, cx, cy, scale) {
  const projected = points.map((point, index) => {
    const a = point.angle + t * point.speed;
    const b = point.phase + t * 0.23;
    const r = scale * (0.34 + point.band * 0.12 + Math.sin(b) * 0.035);
    const x = cx + Math.cos(a) * r + Math.sin(a * 3 + t) * 22;
    const y = cy + Math.sin(a * 1.7) * r * 0.62 + Math.cos(b) * 18;
    return { x, y, index };
  });

  for (let i = 0; i < projected.length; i += 1) {
    for (let j = i + 1; j < projected.length; j += 1) {
      const dx = projected[i].x - projected[j].x;
      const dy = projected[i].y - projected[j].y;
      const distance = Math.hypot(dx, dy);
      if (distance < 118) {
        field.beginPath();
        field.moveTo(projected[i].x, projected[i].y);
        field.lineTo(projected[j].x, projected[j].y);
        field.strokeStyle = `rgba(88,221,255,${0.11 * (1 - distance / 118)})`;
        field.stroke();
      }
    }
  }

  projected.forEach((point, index) => {
    field.beginPath();
    field.arc(point.x, point.y, index % 7 === 0 ? 2.6 : 1.6, 0, Math.PI * 2);
    field.fillStyle = index % 5 === 0 ? "rgba(194,65,45,0.7)" : "rgba(230,230,230,0.56)";
    field.fill();
  });

  field.beginPath();
  for (let x = 0; x <= w; x += 5) {
    const y = h * 0.78 + Math.sin(x * 0.018 + t * 1.7) * 20 + Math.sin(x * 0.006 - t) * 32;
    if (x === 0) field.moveTo(x, y);
    else field.lineTo(x, y);
  }
  field.strokeStyle = "rgba(194,65,45,0.2)";
  field.lineWidth = 1.4;
  field.stroke();
}

function drawFieldSpiral(w, h, t, cx, cy, scale) {
  for (let arm = 0; arm < 5; arm += 1) {
    field.beginPath();
    for (let a = 0; a < Math.PI * 10; a += 0.035) {
      const r = a * scale * 0.018;
      const x = cx + Math.cos(a + arm * 1.26 + t * 0.18) * r;
      const y = cy + Math.sin(a + arm * 1.26 + t * 0.18) * r * 0.62;
      if (a === 0) field.moveTo(x, y);
      else field.lineTo(x, y);
    }
    field.strokeStyle = arm % 2 === 0 ? "rgba(88,221,255,0.13)" : "rgba(194,65,45,0.12)";
    field.lineWidth = 1.2;
    field.stroke();
  }

  for (let i = 0; i < 42; i += 1) {
    const a = i * 0.92 + t * 0.25;
    const r = scale * (0.16 + i * 0.011);
    field.beginPath();
    field.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.62, 1.6, 0, Math.PI * 2);
    field.fillStyle = i % 6 === 0 ? "rgba(194,65,45,0.58)" : "rgba(230,230,230,0.4)";
    field.fill();
  }
}

function drawFieldContours(w, h, t) {
  for (let y = 44; y < h; y += 38) {
    field.beginPath();
    for (let x = -20; x <= w + 20; x += 5) {
      const v = Math.sin(x * 0.013 + t * 0.8) + Math.cos(y * 0.032 - t * 0.55);
      const yy = y + v * 16 + Math.sin((x + y) * 0.009 + t) * 7;
      if (x === -20) field.moveTo(x, yy);
      else field.lineTo(x, yy);
    }
    field.strokeStyle = y % 76 === 0 ? "rgba(194,65,45,0.14)" : "rgba(230,230,230,0.075)";
    field.lineWidth = 1;
    field.stroke();
  }

  for (let x = 60; x < w; x += 120) {
    field.beginPath();
    field.arc(x + Math.sin(t + x) * 20, h * 0.48 + Math.cos(t * 0.8 + x) * 80, 18, 0, Math.PI * 2);
    field.strokeStyle = "rgba(88,221,255,0.1)";
    field.stroke();
  }
}

function drawFieldOrbitMap(w, h, t, cx, cy, scale) {
  for (let ring = 0; ring < 9; ring += 1) {
    field.beginPath();
    const rx = scale * (0.15 + ring * 0.07);
    const ry = rx * (0.38 + Math.sin(t * 0.2 + ring) * 0.04);
    field.ellipse(cx, cy, rx, ry, Math.sin(t * 0.16 + ring) * 1.2, 0, Math.PI * 2);
    field.strokeStyle = ring % 3 === 0 ? "rgba(194,65,45,0.13)" : "rgba(88,221,255,0.1)";
    field.stroke();
  }

  for (let i = 0; i < 36; i += 1) {
    const a = i * 0.61 + t * (0.18 + (i % 4) * 0.02);
    const r = scale * (0.2 + (i % 9) * 0.055);
    field.beginPath();
    field.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.42, i % 8 === 0 ? 2.8 : 1.5, 0, Math.PI * 2);
    field.fillStyle = i % 8 === 0 ? "rgba(194,65,45,0.68)" : "rgba(230,230,230,0.42)";
    field.fill();
  }
}

function drawField(time, mode) {
  const w = fieldCanvas.width / fieldDpr;
  const h = fieldCanvas.height / fieldDpr;
  const t = time * 0.001;
  const cx = w * 0.58;
  const cy = h * 0.52;
  const scale = Math.min(w, h) * 0.34;

  field.clearRect(0, 0, w, h);

  field.strokeStyle = "rgba(255,255,255,0.045)";
  field.lineWidth = 1;
  for (let x = 40; x < w; x += 74) {
    field.beginPath();
    field.moveTo(x, 0);
    field.lineTo(x + Math.sin(t + x) * 20, h);
    field.stroke();
  }

  if (mode === 1) drawFieldSpiral(w, h, t, cx, cy, scale);
  else if (mode === 2) drawFieldContours(w, h, t);
  else if (mode === 3) drawFieldOrbitMap(w, h, t, cx, cy, scale);
  else drawFieldNetwork(time, w, h, t, cx, cy, scale);

  field.fillStyle = "rgba(255,255,255,0.08)";
  field.font = "12px Roboto, Arial, sans-serif";
  const labels = [
    "network: y = f(markets, climate, technology)",
    "spiral: r = a + b theta",
    "contours: z = sin(x) + cos(y)",
    "orbit map: x(t), y(t)"
  ];
  field.fillText(labels[mode], Math.max(28, w - 330), h - 44);
}

function animate(time) {
  const mode = getMode(time);
  document.documentElement.dataset.animationMode = String(mode);
  drawIdentityFigure(time, mode);
  drawNameWave(time, mode);
  drawNameLattice(time, mode);
  drawField(time, mode);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
