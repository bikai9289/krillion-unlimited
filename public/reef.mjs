// Original procedural pixel reef; no assets are taken from the reference site.
const noise = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export function reefCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 640; canvas.height = 360;
  const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false;
  const g = c.createLinearGradient(0, 0, 0, 360);
  g.addColorStop(0, '#83e4f2'); g.addColorStop(.13, '#24b4d5'); g.addColorStop(.42, '#086da5'); g.addColorStop(1, '#03142f');
  c.fillStyle = g; c.fillRect(0, 0, 640, 360);
  // Small strip of sky and blocky clouds above the water.
  c.fillStyle = '#83dbf1'; c.fillRect(0, 0, 640, 43);
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(noise(i + 1) * 640), y = Math.floor(noise(i + 99) * 31), w = 6 + Math.floor(noise(i + 65) * 25);
    c.fillStyle = i % 3 ? '#d3f7ff' : '#f0fcff';
    c.fillRect(x, y, w, 5); c.fillRect(x + 5, y - 4, Math.max(4, w - 9), 5);
  }
  c.fillStyle = '#e2ffff'; c.fillRect(0, 42, 640, 2);
  for (let i = 0; i < 150; i++) {
    c.fillStyle = i % 3 ? '#63d7e7' : '#c9faff';
    c.fillRect(Math.floor(noise(i + 91) * 640), 44 + Math.floor(noise(i + 88) * 20), 3 + noise(i + 6) * 14, 1);
  }
  // Underwater light shafts.
  for (let i = 0; i < 8; i++) {
    const x = 90 + i * 68;
    c.fillStyle = '#8ae8f00b'; c.beginPath(); c.moveTo(x, 46); c.lineTo(x + 12, 46); c.lineTo(x + 130, 360); c.lineTo(x + 35, 360); c.fill();
  }
  const rock = (side, layer) => {
    const colors = ['#087dad', '#075789', '#073c68', '#04284b', '#031b37'];
    const width = [210, 168, 128, 95, 64][layer];
    const start = [91, 128, 157, 95, 34][layer];
    c.save(); if (side) { c.translate(640, 0); c.scale(-1, 1); }
    const edge = [];
    for (let y = start; y < 370; y += 7) {
      const breadth = Math.max(10, width - (360 - y) * .24 + (noise(y + layer * 100 + side * 99) - .5) * 23);
      edge.push([Math.floor(breadth), y]);
      c.fillStyle = colors[layer]; c.fillRect(0, y, breadth, 8);
      for (let j = 0; j < 18; j++) {
        const x = Math.floor(noise(y * 13 + j * 11 + layer) * breadth);
        c.fillStyle = j % 3 ? '#2eb3cb19' : '#001a373f';
        c.fillRect(x, y + Math.floor(noise(j + y) * 6), 2 + Math.floor(noise(j + 1) * 9), 1 + Math.floor(noise(j + 9) * 3));
      }
    }
    c.fillStyle = '#40bed14a'; for (const [x, y] of edge) c.fillRect(x - 4, y, 4, 1);
    c.restore();
  };
  for (let layer = 0; layer < 5; layer++) { rock(0, layer); rock(1, layer); }
  const branch = (x, y, len, angle, level, color) => {
    if (level < 0 || len < 2) return;
    const ex = x + Math.cos(angle) * len, ey = y + Math.sin(angle) * len;
    c.strokeStyle = color; c.lineWidth = level > 2 ? 2 : 1;
    c.beginPath(); c.moveTo(Math.round(x), Math.round(y)); c.lineTo(Math.round(ex), Math.round(ey)); c.stroke();
    branch(ex, ey, len * .72, angle - .48, level - 1, color);
    branch(ex, ey, len * .64, angle + .48, level - 1, color);
  };
  for (let side = 0; side < 2; side++) for (let i = 0; i < 24; i++) {
    const x = side ? 640 - noise(i + 531) * 115 : noise(i + 531) * 115;
    const y = 90 + noise(i + 78) * 280;
    branch(x, y, 7 + noise(i + 7) * 14, -Math.PI / 2, 3, ['#06213c', '#0b5471', '#1680a0', '#0d666f'][i % 4]);
  }
  for (let i = 0; i < 200; i++) {
    c.fillStyle = i % 4 ? '#a4edff25' : '#04152e33';
    c.fillRect(Math.floor(noise(i + 200) * 640), 66 + Math.floor(noise(i + 300) * 295), 1, 1);
  }
  return canvas;
}
