/**
 * Curatorial Monograph Data for Aditya Rathore (CodeX Atelier)
 * 
 * Each publication is a luxury cloth-bound nature monograph volume
 * pairing authentic software engineering projects with breathtaking classical
 * nature landscapes, botanical herbariums, and Venetian gold foil craftsmanship.
 * 
 * Volumes:
 * 1. XMUSIC (X-Music-src) — Nocturne at Moonlit Mountain Lake
 * 2. FRAMEGIT (FrameGIT) — Ancient Pine Grove & Mountain Tributaries
 * 3. XDROP (Xdrop) — Cascading Alpine Falls & Crystal Basin
 * 4. XOPPOR AI (Xoppor-AI) — Alpine Summit at Dawn & Sea of Clouds
 * 5. VAULTOP (VaultOP-Tournaments-Mod) — Tuscan Sunset & Golden Cypress Hills
 * 6. CODEX CLIENT (CodeX-Client-src) — Wild Alpine Herbarium & Edelweiss Meadow
 * 7. YT MEDIA (YT-Media-Downloader) — Sunlit Forest Glade & Golden Flax Field
 */

// Helper to draw Venetian gold leaf decorative border
function drawGoldBorder(ctx, w, h, inset = 55, lineWidth = 2.4) {
  ctx.save();
  ctx.strokeStyle = 'rgba(218, 168, 58, 0.95)'; // Radiant Venetian Gold
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

  // Inner fine hairline
  ctx.strokeStyle = 'rgba(218, 168, 58, 0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(inset + 10, inset + 10, w - (inset + 10) * 2, h - (inset + 10) * 2);

  // Corner decorative rosettes
  const corners = [
    [inset + 5, inset + 5],
    [w - inset - 5, inset + 5],
    [inset + 5, h - inset - 5],
    [w - inset - 5, h - inset - 5],
  ];
  ctx.fillStyle = '#DFBA5A';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Helper for luxurious natural linen cloth & woven fiber texture (warm brown edition)
function applyLinenClothTexture(ctx, w, h) {
  ctx.save();
  // Delicate horizontal linen weft fibers
  ctx.fillStyle = 'rgba(80, 50, 25, 0.045)';
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 1);
  }
  // Delicate vertical warp threads
  for (let x = 0; x < w; x += 4) {
    ctx.fillRect(x, 0, 1, h);
  }
  // Organic fiber flecks
  ctx.fillStyle = 'rgba(70, 40, 18, 0.048)';
  for (let i = 0; i < 2200; i++) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2);
  }
  // Crisp highlight threads
  ctx.fillStyle = 'rgba(255, 245, 230, 0.28)';
  for (let i = 0; i < 1500; i++) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
  }
  ctx.restore();
}

// Helper for linen/parchment grain texture on canvas (backwards compatible)
function applyParchmentGrain(ctx, w, h, count = 2800) {
  applyLinenClothTexture(ctx, w, h);
}

// ----------------------------------------------------------------------
// 7 AUTHENTIC NATURE LANDSCAPES & BOTANICAL ART PLATES
// ----------------------------------------------------------------------

// Plate 1: XMUSIC — Nocturne at Moonlit Mountain Lake
function drawNocturneLake(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Sky: Deep nocturnal sapphire gradient
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, '#09121C');
  sky.addColorStop(0.32, '#112236');
  sky.addColorStop(0.60, '#1C3450');
  sky.addColorStop(0.85, '#284666');
  sky.addColorStop(1, '#1A2F45');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);

  // Starfield
  ctx.fillStyle = '#FFFFFF';
  for (let s = 0; s < 75; s++) {
    const sx = x + (Math.sin(s * 83.3) * 0.5 + 0.5) * w;
    const sy = y + (Math.cos(s * 51.7) * 0.5 + 0.5) * (h * 0.52);
    ctx.globalAlpha = 0.35 + (s % 5) * 0.15;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
  ctx.globalAlpha = 1.0;

  // Luminous Crescent Moon with Atmospheric Halo
  ctx.save();
  const moonX = x + w * 0.74;
  const moonY = y + h * 0.22;
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 110);
  moonGlow.addColorStop(0, 'rgba(255, 245, 215, 0.5)');
  moonGlow.addColorStop(0.5, 'rgba(223, 186, 90, 0.15)');
  moonGlow.addColorStop(1, 'rgba(223, 186, 90, 0)');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFF6D8';
  ctx.shadowColor = 'rgba(255, 246, 216, 0.8)';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(moonX - 12, moonY - 6, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Distant Mountain Ridge 1 (Soft nocturnal violet)
  ctx.fillStyle = '#162330';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.48);
  ctx.bezierCurveTo(x + w * 0.25, y + h * 0.39, x + w * 0.5, y + h * 0.49, x + w * 0.75, y + h * 0.41);
  ctx.bezierCurveTo(x + w * 0.88, y + h * 0.38, x + w * 0.95, y + h * 0.44, x + w, y + h * 0.42);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Mountain Ridge 2 (Deep indigo slate)
  ctx.fillStyle = '#111B26';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.55);
  ctx.bezierCurveTo(x + w * 0.3, y + h * 0.48, x + w * 0.6, y + h * 0.58, x + w, y + h * 0.51);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Still Glacial Mountain Lake
  const lake = ctx.createLinearGradient(x, y + h * 0.55, x, y + h);
  lake.addColorStop(0, '#0C1622');
  lake.addColorStop(0.4, '#132334');
  lake.addColorStop(0.8, '#1A2F45');
  lake.addColorStop(1, '#0A121A');
  ctx.fillStyle = lake;
  ctx.fillRect(x, y + h * 0.55, w, h * 0.45);

  // Moonlight Ripple Reflection path across water
  ctx.save();
  ctx.fillStyle = 'rgba(255, 245, 215, 0.45)';
  for (let r = 0; r < 45; r++) {
    const ry = y + h * 0.56 + r * 7;
    const rw = 12 + r * 4.5 + Math.sin(r * 0.7) * 15;
    const rx = moonX - rw / 2 + Math.sin(r * 0.9) * 8;
    ctx.fillRect(rx, ry, rw, 2.2);
  }
  ctx.restore();

  // Gentle nocturnal water ripple waves
  ctx.save();
  ctx.strokeStyle = 'rgba(223, 186, 90, 0.28)';
  ctx.lineWidth = 1.2;
  for (let wIdx = 0; wIdx < 8; wIdx++) {
    const wy = y + h * 0.62 + wIdx * 24;
    ctx.beginPath();
    ctx.moveTo(x, wy);
    ctx.bezierCurveTo(x + w * 0.3, wy - 5, x + w * 0.7, wy + 5, x + w, wy);
    ctx.stroke();
  }
  ctx.restore();

  // Foreground Alpine Pine Silhouettes
  function drawNocturnePine(cx, cy, th, tw) {
    ctx.save();
    ctx.fillStyle = '#060B10';
    ctx.beginPath();
    ctx.moveTo(cx, cy - th);
    ctx.lineTo(cx - tw * 0.4, cy - th * 0.7);
    ctx.lineTo(cx - tw * 0.2, cy - th * 0.7);
    ctx.lineTo(cx - tw * 0.7, cy - th * 0.35);
    ctx.lineTo(cx - tw * 0.3, cy - th * 0.35);
    ctx.lineTo(cx - tw, cy);
    ctx.lineTo(cx + tw, cy);
    ctx.lineTo(cx + tw * 0.3, cy - th * 0.35);
    ctx.lineTo(cx + tw * 0.7, cy - th * 0.35);
    ctx.lineTo(cx + tw * 0.2, cy - th * 0.7);
    ctx.lineTo(cx + tw * 0.4, cy - th * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Pine grove on left and right shores
  const pines = [
    [x + w * 0.08, y + h * 0.78, 170, 48],
    [x + w * 0.14, y + h * 0.75, 140, 40],
    [x + w * 0.02, y + h * 0.82, 190, 52],
    [x + w * 0.88, y + h * 0.76, 160, 45],
    [x + w * 0.94, y + h * 0.80, 180, 50],
  ];
  pines.forEach(([px, py, th, tw]) => drawNocturnePine(px, py, th, tw));

  // Shoreline Wild Reeds
  ctx.strokeStyle = '#05090D';
  ctx.lineWidth = 1.8;
  for (let rd = 0; rd < 35; rd++) {
    const rx = x + w * 0.20 + rd * 8;
    const ry = y + h * 0.90;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + Math.sin(rd * 0.5) * 8, ry - 35 - (rd % 3) * 12);
    ctx.stroke();
  }

  ctx.restore();
}

// Plate 2: FRAMEGIT — Ancient Pine Grove & Mountain Tributaries
function drawMatsuPineLandscape(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Sky: Celadon & morning golden mist
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, '#526658');
  sky.addColorStop(0.35, '#88A28E');
  sky.addColorStop(0.6, '#D2DCC2');
  sky.addColorStop(0.8, '#EFE6BE');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);

  // Distant Japanese Mountain Peaks
  ctx.fillStyle = '#47534A';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.52);
  ctx.lineTo(x + w * 0.18, y + h * 0.31);
  ctx.lineTo(x + w * 0.32, y + h * 0.43);
  ctx.lineTo(x + w * 0.52, y + h * 0.25);
  ctx.lineTo(x + w * 0.72, y + h * 0.41);
  ctx.lineTo(x + w * 0.88, y + h * 0.28);
  ctx.lineTo(x + w, y + h * 0.41);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Mountain Ridge 2 (Moss Green with waterfall)
  ctx.fillStyle = '#364336';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.61);
  ctx.bezierCurveTo(x + w * 0.25, y + h * 0.47, x + w * 0.45, y + h * 0.57, x + w * 0.65, y + h * 0.45);
  ctx.bezierCurveTo(x + w * 0.85, y + h * 0.39, x + w * 0.95, y + h * 0.51, x + w, y + h * 0.49);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Waterfall ribbon branching like natural tributaries
  ctx.fillStyle = 'rgba(235, 248, 242, 0.88)';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.48, y + h * 0.45);
  ctx.lineTo(x + w * 0.495, y + h * 0.78);
  ctx.lineTo(x + w * 0.518, y + h * 0.78);
  ctx.lineTo(x + w * 0.492, y + h * 0.45);
  ctx.fill();

  // Secondary stream tributary branch
  ctx.beginPath();
  ctx.moveTo(x + w * 0.505, y + h * 0.60);
  ctx.bezierCurveTo(x + w * 0.56, y + h * 0.66, x + w * 0.60, y + h * 0.72, x + w * 0.64, y + h * 0.82);
  ctx.lineTo(x + w * 0.66, y + h * 0.82);
  ctx.bezierCurveTo(x + w * 0.62, y + h * 0.72, x + w * 0.58, y + h * 0.66, x + w * 0.515, y + h * 0.60);
  ctx.fill();

  // River mist pool at bottom of waterfall
  const waterMist = ctx.createRadialGradient(x + w * 0.5, y + h * 0.78, 10, x + w * 0.5, y + h * 0.78, 95);
  waterMist.addColorStop(0, 'rgba(240, 250, 245, 0.80)');
  waterMist.addColorStop(1, 'rgba(240, 250, 245, 0)');
  ctx.fillStyle = waterMist;
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y + h * 0.78, 95, 0, Math.PI * 2);
  ctx.fill();

  // Valley Basin (Ochre & Moss)
  ctx.fillStyle = '#263224';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.75);
  ctx.bezierCurveTo(x + w * 0.4, y + h * 0.69, x + w * 0.7, y + h * 0.83, x + w, y + h * 0.73);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Sweeping Ancient Japanese Pine (Matsu) with Root Architecture
  ctx.save();
  ctx.strokeStyle = '#20140A';
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 20, y + h * 0.95);
  ctx.bezierCurveTo(x + w * 0.15, y + h * 0.82, x + w * 0.22, y + h * 0.64, x + w * 0.35, y + h * 0.55);
  ctx.stroke();

  // Secondary ancient boughs
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.22, y + h * 0.68);
  ctx.bezierCurveTo(x + w * 0.32, y + h * 0.70, x + w * 0.42, y + h * 0.63, x + w * 0.52, y + h * 0.65);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + w * 0.28, y + h * 0.60);
  ctx.bezierCurveTo(x + w * 0.35, y + h * 0.51, x + w * 0.42, y + h * 0.47, x + w * 0.56, y + h * 0.49);
  ctx.stroke();

  // Pine needle cloud clusters
  function drawPineCluster(px, py, radius) {
    ctx.fillStyle = '#142419';
    for (let c = 0; c < 5; c++) {
      ctx.beginPath();
      ctx.arc(px + (c - 2) * (radius * 0.35), py + Math.sin(c) * 4, radius * 0.46, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawPineCluster(x + w * 0.35, y + h * 0.55, 34);
  drawPineCluster(x + w * 0.44, y + h * 0.51, 30);
  drawPineCluster(x + w * 0.56, y + h * 0.49, 38);
  drawPineCluster(x + w * 0.52, y + h * 0.65, 36);
  drawPineCluster(x + w * 0.40, y + h * 0.66, 32);
  ctx.restore();

  // White Cranes in flight
  ctx.strokeStyle = '#FAF7F0';
  ctx.lineWidth = 2.2;
  const cranes = [
    [x + w * 0.72, y + h * 0.28, 20],
    [x + w * 0.78, y + h * 0.24, 16],
    [x + w * 0.83, y + h * 0.27, 14],
  ];
  cranes.forEach(([cx, cy, span]) => {
    ctx.beginPath();
    ctx.moveTo(cx - span / 2, cy);
    ctx.quadraticCurveTo(cx - span / 4, cy - 8, cx, cy);
    ctx.quadraticCurveTo(cx + span / 4, cy - 8, cx + span / 2, cy);
    ctx.stroke();
  });

  ctx.restore();
}

// Plate 3: XDROP — Cascading Alpine Falls & Crystal Basin
function drawCascadeFalls(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Sky: Crisp Azure Mountain Morning Sky
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, '#3E688A');
  sky.addColorStop(0.35, '#6896BA');
  sky.addColorStop(0.65, '#BFD9EB');
  sky.addColorStop(0.85, '#E5F1F8');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);

  // Towering Granite Canyon Cliffs
  ctx.fillStyle = '#2C353D';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w * 0.38, y);
  ctx.lineTo(x + w * 0.42, y + h * 0.55);
  ctx.lineTo(x, y + h * 0.65);
  ctx.fill();

  ctx.fillStyle = '#37424C';
  ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w * 0.58, y);
  ctx.lineTo(x + w * 0.54, y + h * 0.55);
  ctx.lineTo(x + w, y + h * 0.62);
  ctx.fill();

  // Cascading Torrential Waterfall
  const fallGrad = ctx.createLinearGradient(x + w * 0.45, y, x + w * 0.52, y + h * 0.75);
  fallGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  fallGrad.addColorStop(0.5, 'rgba(230, 245, 252, 0.92)');
  fallGrad.addColorStop(1, 'rgba(215, 240, 250, 0.88)');
  ctx.fillStyle = fallGrad;
  ctx.beginPath();
  ctx.moveTo(x + w * 0.46, y);
  ctx.lineTo(x + w * 0.52, y);
  ctx.lineTo(x + w * 0.56, y + h * 0.72);
  ctx.lineTo(x + w * 0.42, y + h * 0.72);
  ctx.closePath();
  ctx.fill();

  // Water Foaming Streaks in Falls
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 1.8;
  for (let f = 0; f < 8; f++) {
    const fx = x + w * 0.45 + f * 10;
    ctx.beginPath();
    ctx.moveTo(fx, y + 20);
    ctx.lineTo(fx + Math.sin(f * 1.5) * 6, y + h * 0.70);
    ctx.stroke();
  }

  // Billowing White Mist Cloud at Waterfall Base
  const mist = ctx.createRadialGradient(x + w * 0.49, y + h * 0.72, 15, x + w * 0.49, y + h * 0.72, 130);
  mist.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  mist.addColorStop(0.4, 'rgba(240, 250, 255, 0.75)');
  mist.addColorStop(0.8, 'rgba(230, 245, 255, 0.3)');
  mist.addColorStop(1, 'rgba(230, 245, 255, 0)');
  ctx.fillStyle = mist;
  ctx.beginPath();
  ctx.arc(x + w * 0.49, y + h * 0.72, 130, 0, Math.PI * 2);
  ctx.fill();

  // Subtle Morning Rainbow Arc in Waterfall Mist
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 215, 120, 0.35)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x + w * 0.52, y + h * 0.74, 90, Math.PI * 1.05, Math.PI * 1.65);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(120, 220, 200, 0.25)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + w * 0.52, y + h * 0.74, 95, Math.PI * 1.05, Math.PI * 1.65);
  ctx.stroke();
  ctx.restore();

  // Crystalline Turquoise Glacial Basin
  const pool = ctx.createLinearGradient(x, y + h * 0.72, x, y + h);
  pool.addColorStop(0, '#1E5868');
  pool.addColorStop(0.4, '#2B7588');
  pool.addColorStop(0.8, '#184755');
  pool.addColorStop(1, '#0F303B');
  ctx.fillStyle = pool;
  ctx.fillRect(x, y + h * 0.72, w, h * 0.28);

  // River Stones and Mountain Ferns in Foreground
  ctx.fillStyle = '#18241D';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.88);
  ctx.bezierCurveTo(x + w * 0.25, y + h * 0.82, x + w * 0.75, y + h * 0.94, x + w, y + h * 0.86);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // River Irises / Fern fronds
  ctx.fillStyle = '#2D6B42';
  for (let fn = 0; fn < 12; fn++) {
    const fnX = x + 35 + fn * 24;
    const fnY = y + h * 0.92;
    ctx.beginPath();
    ctx.moveTo(fnX, fnY);
    ctx.quadraticCurveTo(fnX - 12, fnY - 30, fnX - 4, fnY - 55);
    ctx.quadraticCurveTo(fnX + 4, fnY - 30, fnX, fnY);
    ctx.fill();
  }

  ctx.restore();
}

// Plate 4: XOPPOR AI — Alpine Summit at Dawn & Sea of Valley Clouds
function drawSummitDawn(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Sky: Radiant High Alpine Sunrise Gradient
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, '#2D2845');
  sky.addColorStop(0.28, '#6B4A68');
  sky.addColorStop(0.55, '#BA6E65');
  sky.addColorStop(0.72, '#ECA271');
  sky.addColorStop(0.88, '#FDE3A2');
  sky.addColorStop(1, '#FFF5D0');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);

  // Rising Sun Disc
  ctx.save();
  const sunX = x + w * 0.65;
  const sunY = y + h * 0.38;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 8, sunX, sunY, 150);
  sunGlow.addColorStop(0, '#FFFFFF');
  sunGlow.addColorStop(0.25, 'rgba(255, 238, 175, 0.85)');
  sunGlow.addColorStop(0.65, 'rgba(245, 175, 100, 0.35)');
  sunGlow.addColorStop(1, 'rgba(235, 130, 80, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Distant Jagged Alpine Peaks piercing the horizon
  ctx.fillStyle = '#45384D';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.48);
  ctx.lineTo(x + w * 0.16, y + h * 0.32);
  ctx.lineTo(x + w * 0.28, y + h * 0.44);
  ctx.lineTo(x + w * 0.45, y + h * 0.26);
  ctx.lineTo(x + w * 0.62, y + h * 0.42);
  ctx.lineTo(x + w * 0.80, y + h * 0.29);
  ctx.lineTo(x + w * 0.94, y + h * 0.40);
  ctx.lineTo(x + w, y + h * 0.36);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Rose-gold morning alpenglow on snow peaks
  ctx.fillStyle = 'rgba(255, 235, 215, 0.85)';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.45, y + h * 0.26);
  ctx.lineTo(x + w * 0.39, y + h * 0.37);
  ctx.lineTo(x + w * 0.45, y + h * 0.33);
  ctx.lineTo(x + w * 0.52, y + h * 0.38);
  ctx.fill();

  // Sea of Golden Valley Clouds (Mer de Nuages)
  const clouds = ctx.createLinearGradient(x, y + h * 0.46, x, y + h * 0.76);
  clouds.addColorStop(0, 'rgba(255, 245, 230, 0.95)');
  clouds.addColorStop(0.4, 'rgba(245, 215, 190, 0.85)');
  clouds.addColorStop(0.8, 'rgba(215, 175, 170, 0.65)');
  clouds.addColorStop(1, 'rgba(165, 130, 150, 0.2)');
  ctx.fillStyle = clouds;

  for (let c = 0; c < 9; c++) {
    const cx = x + c * (w / 7.5);
    const cy = y + h * 0.54 + Math.sin(c * 1.2) * 22;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 95, 42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Massive Mountain Summit Crag in Foreground
  ctx.fillStyle = '#251E28';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.72);
  ctx.lineTo(x + w * 0.35, y + h * 0.60);
  ctx.lineTo(x + w * 0.58, y + h * 0.76);
  ctx.lineTo(x + w * 0.85, y + h * 0.68);
  ctx.lineTo(x + w, y + h * 0.82);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Lichen and stone texture on summit rocks
  ctx.fillStyle = '#C78C48';
  for (let l = 0; l < 18; l++) {
    const lx = x + w * 0.05 + l * 42;
    const ly = y + h * 0.75 + Math.sin(l * 1.8) * 25;
    ctx.beginPath();
    ctx.arc(lx, ly, 4 + (l % 4) * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soaring Mountain Eagle / Falcon riding the morning thermals
  ctx.save();
  ctx.strokeStyle = '#18121C';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  const ex = x + w * 0.38;
  const ey = y + h * 0.36;
  ctx.beginPath();
  ctx.moveTo(ex - 28, ey + 4);
  ctx.quadraticCurveTo(ex - 12, ey - 10, ex, ey);
  ctx.quadraticCurveTo(ex + 12, ey - 10, ex + 28, ey + 4);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

// Plate 5: VAULTOP — Tuscan Sunset, Rolling Cypress Hills & Olive Orchards
function drawTuscanLandscape(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Sky: Warm Tuscan sunset gradient
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, '#56728C');
  sky.addColorStop(0.32, '#D8986E');
  sky.addColorStop(0.55, '#F5CD8A');
  sky.addColorStop(0.72, '#FFF1D0');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);

  // Glowing Sun Disc
  const sun = ctx.createRadialGradient(x + w * 0.68, y + h * 0.36, 4, x + w * 0.68, y + h * 0.36, 130);
  sun.addColorStop(0, 'rgba(255, 255, 245, 0.98)');
  sun.addColorStop(0.28, 'rgba(255, 225, 140, 0.65)');
  sun.addColorStop(1, 'rgba(255, 200, 100, 0)');
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(x + w * 0.68, y + h * 0.36, 130, 0, Math.PI * 2);
  ctx.fill();

  // Distant Mountain Ridge 1 (Soft violet atmospheric haze)
  ctx.fillStyle = '#8F7A89';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.48);
  ctx.bezierCurveTo(x + w * 0.25, y + h * 0.43, x + w * 0.5, y + h * 0.51, x + w * 0.75, y + h * 0.44);
  ctx.bezierCurveTo(x + w * 0.88, y + h * 0.41, x + w * 0.95, y + h * 0.46, x + w, y + h * 0.44);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Distant Ridge 2 (Misty terracotta lavender)
  ctx.fillStyle = '#A4887A';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.53);
  ctx.bezierCurveTo(x + w * 0.3, y + h * 0.49, x + w * 0.6, y + h * 0.57, x + w, y + h * 0.51);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Rolling Tuscan Hill 1 (Golden Ochre Earth)
  ctx.fillStyle = '#C69446';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.61);
  ctx.bezierCurveTo(x + w * 0.2, y + h * 0.55, x + w * 0.45, y + h * 0.67, x + w * 0.7, y + h * 0.59);
  ctx.bezierCurveTo(x + w * 0.85, y + h * 0.54, x + w * 0.95, y + h * 0.61, x + w, y + h * 0.59);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Rolling Tuscan Hill 2 (Warm Olive & Terracotta)
  ctx.fillStyle = '#7B8446';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.73);
  ctx.bezierCurveTo(x + w * 0.35, y + h * 0.65, x + w * 0.7, y + h * 0.75, x + w, y + h * 0.67);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Foreground Hill (Rich Tuscan Terracotta Earth)
  ctx.fillStyle = '#623322';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.85);
  ctx.bezierCurveTo(x + w * 0.25, y + h * 0.77, x + w * 0.6, y + h * 0.87, x + w, y + h * 0.79);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Cypress Trees Helper
  function drawCypress(cx, cy, treeH, treeW) {
    ctx.save();
    ctx.fillStyle = '#172415';
    ctx.beginPath();
    ctx.moveTo(cx, cy - treeH);
    ctx.bezierCurveTo(cx - treeW, cy - treeH * 0.6, cx - treeW * 0.9, cy - treeH * 0.2, cx - treeW * 0.4, cy);
    ctx.lineTo(cx + treeW * 0.4, cy);
    ctx.bezierCurveTo(cx + treeW * 0.9, cy - treeH * 0.2, cx + treeW, cy - treeH * 0.6, cx, cy - treeH);
    ctx.fill();
    ctx.restore();
  }

  // Draw groves of Cypress trees across hill ridges
  const cypresses = [
    [x + w * 0.18, y + h * 0.60, 95, 15],
    [x + w * 0.21, y + h * 0.59, 108, 16],
    [x + w * 0.235, y + h * 0.60, 85, 13],
    [x + w * 0.52, y + h * 0.66, 75, 12],
    [x + w * 0.545, y + h * 0.65, 88, 14],
    [x + w * 0.78, y + h * 0.71, 120, 19],
    [x + w * 0.81, y + h * 0.70, 135, 21],
    [x + w * 0.84, y + h * 0.72, 105, 17],
    [x + w * 0.08, y + h * 0.83, 140, 23],
    [x + w * 0.11, y + h * 0.82, 160, 25],
    [x + w * 0.14, y + h * 0.84, 125, 20],
  ];
  cypresses.forEach(([cx, cy, th, tw]) => drawCypress(cx, cy, th, tw));

  // Golden atmospheric valley mist
  const mist = ctx.createLinearGradient(x, y + h * 0.54, x, y + h * 0.84);
  mist.addColorStop(0, 'rgba(255, 235, 190, 0.28)');
  mist.addColorStop(0.5, 'rgba(255, 220, 160, 0.16)');
  mist.addColorStop(1, 'rgba(255, 210, 140, 0)');
  ctx.fillStyle = mist;
  ctx.fillRect(x, y + h * 0.52, w, h * 0.35);

  ctx.restore();
}

// Plate 6: CODEX CLIENT — Wild Alpine Herbarium & Edelweiss Meadow
function drawAlpineBotanicalLandscape(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Sky: Crisp Alpine Morning Gradient
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, '#566E7A');
  sky.addColorStop(0.35, '#8EA8B6');
  sky.addColorStop(0.65, '#D5E4EC');
  sky.addColorStop(1, '#EEF5F8');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);

  // Jagged Alpine Peaks
  ctx.fillStyle = '#3E4954';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.52);
  ctx.lineTo(x + w * 0.22, y + h * 0.23); // Summit 1
  ctx.lineTo(x + w * 0.38, y + h * 0.39);
  ctx.lineTo(x + w * 0.58, y + h * 0.17); // Highest summit
  ctx.lineTo(x + w * 0.78, y + h * 0.37);
  ctx.lineTo(x + w * 0.92, y + h * 0.25);
  ctx.lineTo(x + w, y + h * 0.37);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Snow on Peaks
  ctx.fillStyle = 'rgba(250, 252, 255, 0.92)';
  ctx.beginPath();
  ctx.moveTo(x + w * 0.22, y + h * 0.23);
  ctx.lineTo(x + w * 0.15, y + h * 0.34);
  ctx.lineTo(x + w * 0.22, y + h * 0.29);
  ctx.lineTo(x + w * 0.28, y + h * 0.33);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + w * 0.58, y + h * 0.17);
  ctx.lineTo(x + w * 0.49, y + h * 0.30);
  ctx.lineTo(x + w * 0.58, y + h * 0.25);
  ctx.lineTo(x + w * 0.67, y + h * 0.32);
  ctx.fill();

  // Alpine Meltwater Lake (Reflective turquoise)
  const lake = ctx.createLinearGradient(x, y + h * 0.53, x, y + h * 0.72);
  lake.addColorStop(0, '#265C64');
  lake.addColorStop(0.5, '#377780');
  lake.addColorStop(1, '#569EA8');
  ctx.fillStyle = lake;
  ctx.fillRect(x, y + h * 0.53, w, h * 0.19);

  // Alpine Meadow Plateau (Foreground)
  ctx.fillStyle = '#263E2D';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.70);
  ctx.bezierCurveTo(x + w * 0.35, y + h * 0.63, x + w * 0.7, y + h * 0.73, x + w, y + h * 0.67);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Botanical Herbarium: Wild Fern Fronds
  function drawFernFrond(fx, fy, angle, len) {
    ctx.save();
    ctx.translate(fx, fy);
    ctx.rotate(angle);
    ctx.strokeStyle = '#436B4D';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.5, -20, len, 0);
    ctx.stroke();

    ctx.fillStyle = '#5A8A65';
    for (let p = 15; p < len - 10; p += 14) {
      ctx.beginPath();
      ctx.ellipse(p, -8, 6, 2.5, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(p, 8, 6, 2.5, 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawFernFrond(x + w * 0.15, y + h * 0.88, -0.6, 120);
  drawFernFrond(x + w * 0.22, y + h * 0.89, -0.3, 140);
  drawFernFrond(x + w * 0.82, y + h * 0.88, 0.4, 130);
  drawFernFrond(x + w * 0.75, y + h * 0.90, 0.65, 110);

  // Alpine Edelweiss Blossoms
  function drawEdelweiss(ex, ey, sz) {
    ctx.save();
    ctx.fillStyle = '#F4F7F2';
    for (let b = 0; b < 8; b++) {
      const rot = (b / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(
        ex + Math.cos(rot) * (sz * 0.55),
        ey + Math.sin(rot) * (sz * 0.55),
        sz * 0.55,
        sz * 0.22,
        rot,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    // Golden Stamen Center
    ctx.fillStyle = '#DFBA5A';
    for (let st = 0; st < 6; st++) {
      const stAng = (st / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(ex + Math.cos(stAng) * 4, ey + Math.sin(stAng) * 4, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  drawEdelweiss(x + w * 0.32, y + h * 0.82, 22);
  drawEdelweiss(x + w * 0.38, y + h * 0.85, 26);
  drawEdelweiss(x + w * 0.68, y + h * 0.83, 24);

  ctx.restore();
}

// Plate 7: YT MEDIA — Sunlit Forest Glade & Wild Flax Field
function drawFlaxFieldLandscape(ctx, x, y, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Sky: Summer afternoon sky with clouds
  const sky = ctx.createLinearGradient(x, y, x, y + h);
  sky.addColorStop(0, '#568AB6');
  sky.addColorStop(0.42, '#9EC5E2');
  sky.addColorStop(0.68, '#E2EFF7');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, w, h);

  // Soft cumulus clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  const clouds = [
    [x + w * 0.25, y + h * 0.22, 95, 42],
    [x + w * 0.32, y + h * 0.19, 115, 52],
    [x + w * 0.72, y + h * 0.27, 125, 46],
    [x + w * 0.82, y + h * 0.25, 98, 40],
  ];
  clouds.forEach(([cx, cy, rx, ry]) => {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Distant Farmhouse & Tree Line
  ctx.fillStyle = '#4D6B42';
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.51);
  ctx.bezierCurveTo(x + w * 0.35, y + h * 0.48, x + w * 0.7, y + h * 0.53, x + w, y + h * 0.50);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.fill();

  // Flax Field Midground (Vibrant Azure & Meadow Green)
  const fieldGrad = ctx.createLinearGradient(x, y + h * 0.51, x, y + h);
  fieldGrad.addColorStop(0, '#477552');
  fieldGrad.addColorStop(0.35, '#528BAA'); // Sea of blue flax blossoms
  fieldGrad.addColorStop(0.7, '#395E3F');
  fieldGrad.addColorStop(1, '#27422C');
  ctx.fillStyle = fieldGrad;
  ctx.fillRect(x, y + h * 0.51, w, h * 0.49);

  // Stippled blue flax blossoms across the midground
  for (let i = 0; i < 650; i++) {
    const fx = x + Math.random() * w;
    const fy = y + h * 0.52 + Math.random() * (h * 0.32);
    const rad = 1.5 + (fy - (y + h * 0.52)) * 0.016;
    ctx.fillStyle = (i % 4 === 0) ? '#D8E8F5' : ((i % 3 === 0) ? '#629BC2' : '#7CB1D4');
    ctx.beginPath();
    ctx.arc(fx, fy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Botanical Foreground: Delicate Flax Stalks with Azure Blossoms
  function drawFlaxStalk(baseX, baseY, targetX, targetY) {
    ctx.save();
    ctx.strokeStyle = '#3E663B';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.quadraticCurveTo((baseX + targetX) / 2 + 15, (baseY + targetY) / 2, targetX, targetY);
    ctx.stroke();

    // 5-petaled Blue Flax Flower
    ctx.fillStyle = '#6BA4CC';
    for (let p = 0; p < 5; p++) {
      const pAngle = (p / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(
        targetX + Math.cos(pAngle) * 9,
        targetY + Math.sin(pAngle) * 9,
        9,
        5.5,
        pAngle,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    // White eye
    ctx.fillStyle = '#FAF7F0';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawFlaxStalk(x + w * 0.12, y + h, x + w * 0.16, y + h * 0.72);
  drawFlaxStalk(x + w * 0.22, y + h, x + w * 0.26, y + h * 0.68);
  drawFlaxStalk(x + w * 0.78, y + h, x + w * 0.74, y + h * 0.70);
  drawFlaxStalk(x + w * 0.88, y + h, x + w * 0.84, y + h * 0.74);

  ctx.restore();
}

// ----------------------------------------------------------------------
// 7 PRODUCTION MONOGRAPH PUBLICATIONS
// ----------------------------------------------------------------------

export const MONOGRAPHS_DATA = [
  // 1. XMUSIC (X-Music-src) — Nocturne at Moonlit Mountain Lake
  {
    id: 'x-music',
    title: 'XMUSIC',
    subtitle: 'Native In-Game Audio & Streaming Engine',
    author: 'Aditya Rathore',
    publisher: 'CodeX Atelier Editions',
    edition: 'Fabric Monorepo · 15+ Versions Baseline',
    year: '2025',
    stars: 5,
    desc: 'A high-performance native Minecraft music player mod engineered on Fabric. Streams crystal-clear audio from YouTube, Spotify, and local playlists directly within the world without performance overhead or alt-tab disruption. Features a monorepo architecture spanning 15+ Minecraft version baselines with custom GLSL HUD rendering.',
    tech: ['Java 21', 'Fabric API', 'Mixins', 'Gradle Monorepo', 'WaterMedia API', 'GLSL'],
    liveURL: 'https://github.com/Code-Xceed/X-Music-src',
    demoURL: 'https://codex-music-show.vercel.app',
    natureBlend: 0.0,
    chapters: [
      'Native In-Game Streaming Architecture',
      'Multi-Version Monorepo (1.21 - 26.2)',
      'Thread-Safe Audio Buffer Management',
      'Custom Themed HUD & In-Game GUI',
      'WaterMedia & Source Stream Resolvers',
      'Open-Source Distribution & Modrinth',
    ],
    edge: '#CCB599',
    backBg: '#D8C2A8',
    backInk: '24,18,11',
    spineBg: '#C8B093',
    spineInk: '#18120B',
    spineFont: '600 36px "Bodoni Moda", serif',
    front: (ctx, w, h) => {
      // Warm Antique Fawn & Hazelnut Cloth Ground ("a bit little brown side")
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.48, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 2.4);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 17px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLLECTION NATURE & ATELIER  ·  VOL. I', w / 2, 92);

      // Fine Art Nature Plate: Nocturne Lake (Thumbnail preserved 100%)
      const pw = w - 150;
      const ph = 760;
      const px = 75;
      const py = 115;
      drawNocturneLake(ctx, px, py, pw, ph);

      // Gilded Bevel Frame around Landscape
      ctx.save();
      ctx.strokeStyle = '#DFBA5A';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(223, 186, 90, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 6, py + 6, pw - 12, ph - 12);
      ctx.restore();

      // Lower Monograph Block: Typography
      const textCenterY = py + ph + 130;
      ctx.fillStyle = '#18120B';
      ctx.font = '400 82px "Bodoni Moda", "Didot", serif';
      ctx.textAlign = 'center';
      ctx.fillText('XMUSIC', w / 2, textCenterY);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = 'italic 300 28px "Cormorant Garamond", serif';
      ctx.fillText('Native In-Game Audio & Streaming Engine', w / 2, textCenterY + 54);

      ctx.fillStyle = '#DFBA5A';
      ctx.font = '18px serif';
      ctx.fillText('❧   ✦   🌲   ✦   ❧', w / 2, textCenterY + 104);

      ctx.fillStyle = '#18120B';
      ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ADITYA RATHORE', w / 2, h - 165);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 20px "Cinzel", serif';
      ctx.fillText('FABRIC ARCHITECTURE · OPEN SOURCE', w / 2, h - 120);
    },
    spine: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#C8B093');
      grad.addColorStop(0.5, '#DAC5AC');
      grad.addColorStop(1, '#C2A88B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);

      ctx.fillStyle = '#DFBA5A';
      ctx.fillRect(w / 2 - 32, 90, 64, 2.5);
      ctx.fillRect(w / 2 - 32, 98, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 100, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 92, 64, 2.5);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = '600 36px "Bodoni Moda", serif';
      ctx.fillText('XMUSIC  —  ADITYA RATHORE', 0, 12);
      ctx.restore();
    },
    back: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.5, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 1.6);

      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = 'italic 300 32px "Cormorant Garamond", serif';
      ctx.fillText('“Sound in games is not background noise;', w / 2, 380);
      ctx.fillText('it is the emotional architecture of the world.”', w / 2, 425);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = '300 22px "Plus Jakarta Sans", sans-serif';
      const blurb = [
        'Multi-version Fabric monorepo supporting 15+ MC releases.',
        'High-fidelity asynchronous audio streaming from YouTube & Spotify.',
        'Zero-overhead audio thread management with bespoke UI overlay.',
      ];
      blurb.forEach((line, i) => {
        ctx.fillText(line, w / 2, 540 + i * 44);
      });

      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(w / 2 - 120, h - 260, 240, 110);
      ctx.strokeStyle = 'rgba(199, 146, 56, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w / 2 - 120, h - 260, 240, 110);

      ctx.fillStyle = '#18120B';
      let bx = w / 2 - 100;
      while (bx < w / 2 + 100) {
        const bw = 2 + Math.random() * 5;
        ctx.fillRect(bx, h - 245, bw, 65);
        bx += bw + 2 + Math.random() * 3;
      }
      ctx.font = '500 16px "Plus Jakarta Sans", monospace';
      ctx.fillText('MODRINTH · X-MUSIC', w / 2, h - 165);
    },
  },

  // 2. FRAMEGIT (FrameGIT) — Ancient Pine Grove & Mountain Tributaries
  {
    id: 'framegit',
    title: 'FRAMEGIT',
    subtitle: 'Version Control for Creative Video Professionals',
    author: 'Aditya Rathore',
    publisher: 'FrameGit Infrastructure',
    edition: 'v1.0.0 Architecture · FastCDC + CAS Engine',
    year: '2025',
    stars: 5,
    desc: 'Content-addressed version control built specifically for terabyte-scale creative video projects. Bridges the gap between software engineering workflows and NLE timelines, providing Git-style commit trees, non-destructive timeline rollback, and visual diffing natively inside Adobe Premiere Pro and Blackmagic DaVinci Resolve.',
    tech: ['Node.js 22', 'Electron', 'FastCDC CAS', 'DAG Trees', 'Premiere Pro UXP', 'DaVinci Scripting'],
    liveURL: 'https://github.com/Code-Xceed/FrameGIT',
    natureBlend: 0.18,
    chapters: [
      'FastCDC Content-Defined Chunking',
      'Content-Addressed Storage (CAS)',
      'Directed Acyclic Graph (DAG) Trees',
      'Premiere Pro UXP & CEP Extension',
      'DaVinci Resolve Python Scripting API',
      'Visual Timeline Diffing & Rollback',
    ],
    edge: '#CCB599',
    backBg: '#D8C2A8',
    backInk: '24,18,11',
    spineBg: '#C8B093',
    spineInk: '#18120B',
    spineFont: '600 36px "Bodoni Moda", serif',
    front: (ctx, w, h) => {
      // Warm Antique Fawn & Hazelnut Cloth Ground ("a bit little brown side")
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.48, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 2.4);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 17px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLLECTION NATURE & ATELIER  ·  VOL. II', w / 2, 92);

      // Fine Art Nature Plate: Ancient Matsu Pine & River Tributaries (Thumbnail preserved 100%)
      const pw = w - 150;
      const ph = 760;
      const px = 75;
      const py = 115;
      drawMatsuPineLandscape(ctx, px, py, pw, ph);

      // Gilded Bevel Frame around Landscape
      ctx.save();
      ctx.strokeStyle = '#DFBA5A';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(223, 186, 90, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 6, py + 6, pw - 12, ph - 12);
      ctx.restore();

      // Lower Monograph Block: Typography
      const textCenterY = py + ph + 130;
      ctx.fillStyle = '#18120B';
      ctx.font = '400 80px "Bodoni Moda", "Didot", serif';
      ctx.textAlign = 'center';
      ctx.fillText('FRAMEGIT', w / 2, textCenterY);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = 'italic 300 27px "Cormorant Garamond", serif';
      ctx.fillText('Version Control for Creative Video Professionals', w / 2, textCenterY + 54);

      ctx.fillStyle = '#DFBA5A';
      ctx.font = '18px serif';
      ctx.fillText('❧   ✦   🌿   ✦   ❧', w / 2, textCenterY + 104);

      ctx.fillStyle = '#18120B';
      ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ADITYA RATHORE', w / 2, h - 165);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 20px "Cinzel", serif';
      ctx.fillText('FASTCDC CAS + DAG · ELECTRON ENGINE', w / 2, h - 120);
    },
    spine: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#C8B093');
      grad.addColorStop(0.5, '#DAC5AC');
      grad.addColorStop(1, '#C2A88B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);

      ctx.fillStyle = '#DFBA5A';
      ctx.fillRect(w / 2 - 32, 90, 64, 2.5);
      ctx.fillRect(w / 2 - 32, 98, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 100, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 92, 64, 2.5);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = '600 36px "Bodoni Moda", serif';
      ctx.fillText('FRAMEGIT  —  ADITYA RATHORE', 0, 12);
      ctx.restore();
    },
    back: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.5, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 1.6);

      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = 'italic 300 32px "Cormorant Garamond", serif';
      ctx.fillText('“Terabytes of binary cinema;', w / 2, 380);
      ctx.fillText('now commanded with mathematical elegance.”', w / 2, 425);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = '300 22px "Plus Jakarta Sans", sans-serif';
      const blurb = [
        'Content-Addressed Storage eliminates multi-GB duplicate renders.',
        'Seamless integration for Adobe Premiere Pro & DaVinci Resolve.',
        'Non-destructive visual timeline diffing with single-click rollback.',
      ];
      blurb.forEach((line, i) => {
        ctx.fillText(line, w / 2, 540 + i * 44);
      });

      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(w / 2 - 120, h - 260, 240, 110);
      ctx.strokeStyle = 'rgba(199, 146, 56, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w / 2 - 120, h - 260, 240, 110);

      ctx.fillStyle = '#18120B';
      let bx = w / 2 - 100;
      while (bx < w / 2 + 100) {
        const bw = 2 + Math.random() * 5;
        ctx.fillRect(bx, h - 245, bw, 65);
        bx += bw + 2 + Math.random() * 3;
      }
      ctx.font = '500 16px "Plus Jakarta Sans", monospace';
      ctx.fillText('FRAME-GIT · CAS-DAG', w / 2, h - 165);
    },
  },

  // 3. XDROP (Xdrop) — Cascading Alpine Falls & Crystal Basin
  {
    id: 'xdrop',
    title: 'XDROP',
    subtitle: 'Universal Social Media & Web Asset Importer',
    author: 'Aditya Rathore',
    publisher: 'CodeX Atelier Suite',
    edition: 'Desktop Companion · DaVinci & Adobe NLEs',
    year: '2025',
    stars: 5,
    desc: 'Cross-editor companion utility that turns hours of searching, downloading, and converting into an instant 1-click workflow. Automatically detects video and audio URLs, extracts pristine streams via yt-dlp and FFmpeg, and injects them directly into active timelines and project bins across DaVinci Resolve, Premiere Pro, and After Effects.',
    tech: ['Python', 'FastAPI', 'WebSockets', 'PyWebView', 'React', 'yt-dlp', 'FFmpeg'],
    liveURL: 'https://github.com/Code-Xceed/Xdrop',
    natureBlend: 0.35,
    chapters: [
      'Universal Media URL Inspection',
      'High-Throughput FFmpeg Transcoding',
      'DaVinciResolveScript API Automation',
      'Adobe ExtendScript Pipeline Integration',
      'Reactive WebSockets HUD (PyWebView)',
      'Direct Timeline & Bin Insertion',
    ],
    edge: '#CCB599',
    backBg: '#D8C2A8',
    backInk: '24,18,11',
    spineBg: '#C8B093',
    spineInk: '#18120B',
    spineFont: '600 36px "Bodoni Moda", serif',
    front: (ctx, w, h) => {
      // Warm Antique Fawn & Hazelnut Cloth Ground ("a bit little brown side")
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.48, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 2.4);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 17px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLLECTION NATURE & ATELIER  ·  VOL. III', w / 2, 92);

      // Fine Art Nature Plate: Cascading Alpine Falls (Thumbnail preserved 100%)
      const pw = w - 150;
      const ph = 760;
      const px = 75;
      const py = 115;
      drawCascadeFalls(ctx, px, py, pw, ph);

      // Gilded Bevel Frame around Landscape
      ctx.save();
      ctx.strokeStyle = '#DFBA5A';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(223, 186, 90, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 6, py + 6, pw - 12, ph - 12);
      ctx.restore();

      // Lower Monograph Block: Typography
      const textCenterY = py + ph + 130;
      ctx.fillStyle = '#18120B';
      ctx.font = '400 82px "Bodoni Moda", "Didot", serif';
      ctx.textAlign = 'center';
      ctx.fillText('XDROP', w / 2, textCenterY);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = 'italic 300 28px "Cormorant Garamond", serif';
      ctx.fillText('Universal Social Media & Web Asset Importer', w / 2, textCenterY + 54);

      ctx.fillStyle = '#DFBA5A';
      ctx.font = '18px serif';
      ctx.fillText('❧   ✦   🌊   ✦   ❧', w / 2, textCenterY + 104);

      ctx.fillStyle = '#18120B';
      ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ADITYA RATHORE', w / 2, h - 165);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 20px "Cinzel", serif';
      ctx.fillText('FASTAPI · WEBSOCKETS · PYWEBVIEW', w / 2, h - 120);
    },
    spine: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#C8B093');
      grad.addColorStop(0.5, '#DAC5AC');
      grad.addColorStop(1, '#C2A88B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);

      ctx.fillStyle = '#DFBA5A';
      ctx.fillRect(w / 2 - 32, 90, 64, 2.5);
      ctx.fillRect(w / 2 - 32, 98, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 100, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 92, 64, 2.5);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = '600 36px "Bodoni Moda", serif';
      ctx.fillText('XDROP  —  ADITYA RATHORE', 0, 12);
      ctx.restore();
    },
    back: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.5, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 1.6);

      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = 'italic 300 32px "Cormorant Garamond", serif';
      ctx.fillText('“Context switching kills creativity;', w / 2, 380);
      ctx.fillText('drop web assets directly into your timeline.”', w / 2, 425);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = '300 22px "Plus Jakarta Sans", sans-serif';
      const blurb = [
        'Native script API integration for DaVinci Resolve & Adobe.',
        'High-performance asynchronous media extraction via yt-dlp & FFmpeg.',
        'Floating desktop HUD built with React, WebSockets, and PyWebView.',
      ];
      blurb.forEach((line, i) => {
        ctx.fillText(line, w / 2, 540 + i * 44);
      });

      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(w / 2 - 120, h - 260, 240, 110);
      ctx.strokeStyle = 'rgba(199, 146, 56, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w / 2 - 120, h - 260, 240, 110);

      ctx.fillStyle = '#18120B';
      let bx = w / 2 - 100;
      while (bx < w / 2 + 100) {
        const bw = 2 + Math.random() * 5;
        ctx.fillRect(bx, h - 245, bw, 65);
        bx += bw + 2 + Math.random() * 3;
      }
      ctx.font = '500 16px "Plus Jakarta Sans", monospace';
      ctx.fillText('XDROP · MONOREPO', w / 2, h - 165);
    },
  },

  // 4. XOPPOR AI (Xoppor-AI) — Alpine Summit at Dawn & Sea of Clouds
  {
    id: 'xoppor-ai',
    title: 'XOPPOR AI',
    subtitle: 'Autonomous Opportunity Radar & Neural Evaluator',
    author: 'Aditya Rathore',
    publisher: 'CodeX Intelligence Systems',
    edition: 'Autonomous Production Pipeline · Next.js 15',
    year: '2026',
    stars: 5,
    desc: 'Autonomous open-source opportunity radar that constantly scouts 16 platforms across the internet for high-value engineering contracts, startup roles, bounties, and hackathons. Evaluates 1,500+ daily live signals using Google Gemini AI and delivers scored, actionable Opportunity Cards directly to private Telegram channels.',
    tech: ['Next.js 15', 'TypeScript 5.8', 'Google Gemini AI', 'Prisma', 'Tailwind CSS', 'Telegram Bot API'],
    liveURL: 'https://github.com/Code-Xceed/Xoppor-AI',
    natureBlend: 0.52,
    chapters: [
      '16 Multi-Platform Scraping Scouts',
      'Signal Deduplication & Heuristics',
      'Google Gemini Semantic Scoring',
      'Opportunity Card Telegram Dispatcher',
      'Next.js 15 & Prisma Architecture',
      'Strict Zero-Outreach Privacy Radar',
    ],
    edge: '#CCB599',
    backBg: '#D8C2A8',
    backInk: '24,18,11',
    spineBg: '#C8B093',
    spineInk: '#18120B',
    spineFont: '600 36px "Bodoni Moda", serif',
    front: (ctx, w, h) => {
      // Warm Antique Fawn & Hazelnut Cloth Ground ("a bit little brown side")
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.48, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 2.4);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 17px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLLECTION NATURE & ATELIER  ·  VOL. IV', w / 2, 92);

      // Fine Art Nature Plate: Summit Dawn over Sea of Clouds (Thumbnail preserved 100%)
      const pw = w - 150;
      const ph = 760;
      const px = 75;
      const py = 115;
      drawSummitDawn(ctx, px, py, pw, ph);

      // Gilded Bevel Frame around Landscape
      ctx.save();
      ctx.strokeStyle = '#DFBA5A';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(223, 186, 90, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 6, py + 6, pw - 12, ph - 12);
      ctx.restore();

      // Lower Monograph Block: Typography
      const textCenterY = py + ph + 130;
      ctx.fillStyle = '#18120B';
      ctx.font = '400 78px "Bodoni Moda", "Didot", serif';
      ctx.textAlign = 'center';
      ctx.fillText('XOPPOR AI', w / 2, textCenterY);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = 'italic 300 27px "Cormorant Garamond", serif';
      ctx.fillText('Autonomous Opportunity Radar & AI Evaluator', w / 2, textCenterY + 54);

      ctx.fillStyle = '#DFBA5A';
      ctx.font = '18px serif';
      ctx.fillText('❧   ✦   🦅   ✦   ❧', w / 2, textCenterY + 104);

      ctx.fillStyle = '#18120B';
      ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ADITYA RATHORE', w / 2, h - 165);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 20px "Cinzel", serif';
      ctx.fillText('GOOGLE GEMINI AI · NEXT.JS 15 · PRISMA', w / 2, h - 120);
    },
    spine: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#C8B093');
      grad.addColorStop(0.5, '#DAC5AC');
      grad.addColorStop(1, '#C2A88B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);

      ctx.fillStyle = '#DFBA5A';
      ctx.fillRect(w / 2 - 32, 90, 64, 2.5);
      ctx.fillRect(w / 2 - 32, 98, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 100, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 92, 64, 2.5);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = '600 36px "Bodoni Moda", serif';
      ctx.fillText('XOPPOR AI  —  ADITYA RATHORE', 0, 12);
      ctx.restore();
    },
    back: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.5, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 1.6);

      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = 'italic 300 32px "Cormorant Garamond", serif';
      ctx.fillText('“Opportunity favors the vigilant;', w / 2, 380);
      ctx.fillText('autonomous radar surfaces high-conviction signals.”', w / 2, 425);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = '300 22px "Plus Jakarta Sans", sans-serif';
      const blurb = [
        'Scouts 16 web sources continuously for high-yield engineering leads.',
        'Semantic conviction scoring powered by Google Gemini AI.',
        'Strict zero-outreach research architecture ensuring 100% user autonomy.',
      ];
      blurb.forEach((line, i) => {
        ctx.fillText(line, w / 2, 540 + i * 44);
      });

      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(w / 2 - 120, h - 260, 240, 110);
      ctx.strokeStyle = 'rgba(199, 146, 56, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w / 2 - 120, h - 260, 240, 110);

      ctx.fillStyle = '#18120B';
      let bx = w / 2 - 100;
      while (bx < w / 2 + 100) {
        const bw = 2 + Math.random() * 5;
        ctx.fillRect(bx, h - 245, bw, 65);
        bx += bw + 2 + Math.random() * 3;
      }
      ctx.font = '500 16px "Plus Jakarta Sans", monospace';
      ctx.fillText('XOPPOR · AI-RADAR', w / 2, h - 165);
    },
  },

  // 5. VAULTOP (VaultOP-Tournaments-Mod) — Tuscan Sunset & Golden Cypress Hills
  {
    id: 'vaultop-tournaments',
    title: 'VAULTOP',
    subtitle: 'Official Competitive Tournament Client Mod',
    author: 'Aditya Rathore',
    publisher: 'VaultOP Esports Platform',
    edition: 'Official Competition Client · Fabric 1.21.x',
    year: '2026',
    stars: 5,
    desc: 'The official client companion mod for the VaultOP Tournament Platform. Delivers a seamless competitive arena experience directly inside Minecraft 1.21.x: real-time match countdowns, 1-click tournament queue joining, dynamic event announcements, player stats, and cryptographic matchmaking authentication without leaving the game.',
    tech: ['Minecraft 1.21.x', 'Fabric Loader', 'Netty Networking', 'Secure Auth', 'GLSL UI Shaders'],
    liveURL: 'https://github.com/Code-Xceed/VaultOP-Tournaments-Mod',
    natureBlend: 0.68,
    chapters: [
      'In-Game Tournament Discovery & Signup',
      'Real-Time Matchmaking Queue Sync',
      'Dynamic Event Broadcast Overlays',
      'Competitive Leaderboards & Stat Engine',
      'Hardened Anti-Evasion Authentication',
      'Fabric API Client Architecture',
    ],
    edge: '#CCB599',
    backBg: '#D8C2A8',
    backInk: '24,18,11',
    spineBg: '#C8B093',
    spineInk: '#18120B',
    spineFont: '600 36px "Bodoni Moda", serif',
    front: (ctx, w, h) => {
      // Warm Antique Fawn & Hazelnut Cloth Ground ("a bit little brown side")
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.48, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 2.4);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 17px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLLECTION NATURE & ATELIER  ·  VOL. V', w / 2, 92);

      // Fine Art Nature Plate: Tuscan Sunset & Cypress Hills (Thumbnail preserved 100%)
      const pw = w - 150;
      const ph = 760;
      const px = 75;
      const py = 115;
      drawTuscanLandscape(ctx, px, py, pw, ph);

      // Gilded Bevel Frame around Landscape
      ctx.save();
      ctx.strokeStyle = '#DFBA5A';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(223, 186, 90, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 6, py + 6, pw - 12, ph - 12);
      ctx.restore();

      // Lower Monograph Block: Typography
      const textCenterY = py + ph + 130;
      ctx.fillStyle = '#18120B';
      ctx.font = '400 82px "Bodoni Moda", "Didot", serif';
      ctx.textAlign = 'center';
      ctx.fillText('VAULTOP', w / 2, textCenterY);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = 'italic 300 28px "Cormorant Garamond", serif';
      ctx.fillText('Official Competitive Tournament Client Mod', w / 2, textCenterY + 54);

      ctx.fillStyle = '#DFBA5A';
      ctx.font = '18px serif';
      ctx.fillText('❧   ✦   🌾   ✦   ❧', w / 2, textCenterY + 104);

      ctx.fillStyle = '#18120B';
      ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ADITYA RATHORE', w / 2, h - 165);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 20px "Cinzel", serif';
      ctx.fillText('FABRIC 1.21.X · NETTY INFRASTRUCTURE', w / 2, h - 120);
    },
    spine: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#C8B093');
      grad.addColorStop(0.5, '#DAC5AC');
      grad.addColorStop(1, '#C2A88B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);

      ctx.fillStyle = '#DFBA5A';
      ctx.fillRect(w / 2 - 32, 90, 64, 2.5);
      ctx.fillRect(w / 2 - 32, 98, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 100, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 92, 64, 2.5);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = '600 36px "Bodoni Moda", serif';
      ctx.fillText('VAULTOP  —  ADITYA RATHORE', 0, 12);
      ctx.restore();
    },
    back: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.5, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 1.6);

      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = 'italic 300 32px "Cormorant Garamond", serif';
      ctx.fillText('“True competition demands zero friction;', w / 2, 380);
      ctx.fillText('from queue to arena in a single heartbeat.”', w / 2, 425);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = '300 22px "Plus Jakarta Sans", sans-serif';
      const blurb = [
        'Official client companion for the VaultOP competitive platform.',
        'Real-time match notifications, bracket synchronization, and stats.',
        'Cryptographic anti-evasion authentication for fair tournament play.',
      ];
      blurb.forEach((line, i) => {
        ctx.fillText(line, w / 2, 540 + i * 44);
      });

      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(w / 2 - 120, h - 260, 240, 110);
      ctx.strokeStyle = 'rgba(199, 146, 56, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w / 2 - 120, h - 260, 240, 110);

      ctx.fillStyle = '#18120B';
      let bx = w / 2 - 100;
      while (bx < w / 2 + 100) {
        const bw = 2 + Math.random() * 5;
        ctx.fillRect(bx, h - 245, bw, 65);
        bx += bw + 2 + Math.random() * 3;
      }
      ctx.font = '500 16px "Plus Jakarta Sans", monospace';
      ctx.fillText('VAULTOP · ESPORTS', w / 2, h - 165);
    },
  },

  // 6. CODEX CLIENT (CodeX-Client-src) — Wild Alpine Herbarium & Edelweiss Meadow
  {
    id: 'codex-client',
    title: 'CODEX CLIENT',
    subtitle: 'Archival Fabric Utility & Performance Client',
    author: 'Aditya Rathore',
    publisher: 'CodeX Archival Engineering',
    edition: 'Archival Source Edition · MC 1.21.4',
    year: '2025',
    stars: 5,
    desc: 'A bespoke Minecraft Fabric 1.21.4 utility and performance client built from scratch. Features 12+ modular HUD subsystems including custom ClickGUI, Keystrokes, Armor Status, Aim Assist, and Fullbright, engineered with clean bytecode Mixins and zero garbage collection overhead. Released as an archival open-source reference.',
    tech: ['Java 21', 'Fabric 1.21.4', 'Bytecode Mixins', 'Gradle Kotlin DSL', 'Modular GUI Engine'],
    liveURL: 'https://github.com/Code-Xceed/CodeX-Client-src',
    demoURL: 'https://codexclient.netlify.app',
    natureBlend: 0.84,
    chapters: [
      'Modular Subsystem Architecture',
      'Custom ClickGUI & HUD Rendering',
      'Zero-Allocation Fabric Mixins',
      'Persistent Properties Serialization',
      'Gradle Kotlin DSL Single-Root Build',
      'Archival Open-Source Release',
    ],
    edge: '#CCB599',
    backBg: '#D8C2A8',
    backInk: '24,18,11',
    spineBg: '#C8B093',
    spineInk: '#18120B',
    spineFont: '600 36px "Bodoni Moda", serif',
    front: (ctx, w, h) => {
      // Warm Antique Fawn & Hazelnut Cloth Ground ("a bit little brown side")
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.48, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 2.4);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 17px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLLECTION NATURE & ATELIER  ·  VOL. VI', w / 2, 92);

      // Fine Art Nature Plate: Alpine Peaks & Edelweiss Herbarium (Thumbnail preserved 100%)
      const pw = w - 150;
      const ph = 760;
      const px = 75;
      const py = 115;
      drawAlpineBotanicalLandscape(ctx, px, py, pw, ph);

      // Gilded Bevel Frame around Landscape
      ctx.save();
      ctx.strokeStyle = '#DFBA5A';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(223, 186, 90, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 6, py + 6, pw - 12, ph - 12);
      ctx.restore();

      // Lower Monograph Block: Typography
      const textCenterY = py + ph + 130;
      ctx.fillStyle = '#18120B';
      ctx.font = '400 78px "Bodoni Moda", "Didot", serif';
      ctx.textAlign = 'center';
      ctx.fillText('CODEX CLIENT', w / 2, textCenterY);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = 'italic 300 27px "Cormorant Garamond", serif';
      ctx.fillText('Archival Fabric Utility & Performance Client', w / 2, textCenterY + 54);

      ctx.fillStyle = '#DFBA5A';
      ctx.font = '18px serif';
      ctx.fillText('❧   ✦   🍃   ✦   ❧', w / 2, textCenterY + 104);

      ctx.fillStyle = '#18120B';
      ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ADITYA RATHORE', w / 2, h - 165);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 20px "Cinzel", serif';
      ctx.fillText('MC 1.21.4 · FABRIC MIXINS · GRADLE KTS', w / 2, h - 120);
    },
    spine: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#C8B093');
      grad.addColorStop(0.5, '#DAC5AC');
      grad.addColorStop(1, '#C2A88B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);

      ctx.fillStyle = '#DFBA5A';
      ctx.fillRect(w / 2 - 32, 90, 64, 2.5);
      ctx.fillRect(w / 2 - 32, 98, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 100, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 92, 64, 2.5);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = '600 36px "Bodoni Moda", serif';
      ctx.fillText('CODEX CLIENT  —  ADITYA RATHORE', 0, 12);
      ctx.restore();
    },
    back: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.5, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 1.6);

      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = 'italic 300 32px "Cormorant Garamond", serif';
      ctx.fillText('“A clean codebase left in the open', w / 2, 380);
      ctx.fillText('is infinitely greater than an abandoned secret.”', w / 2, 425);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = '300 22px "Plus Jakarta Sans", sans-serif';
      const blurb = [
        'Single-root Gradle Kotlin DSL build targeting Minecraft 1.21.4.',
        '12+ custom modular subsystems with zero frame overhead.',
        'Published in full as an archival open-source engineering reference.',
      ];
      blurb.forEach((line, i) => {
        ctx.fillText(line, w / 2, 540 + i * 44);
      });

      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(w / 2 - 120, h - 260, 240, 110);
      ctx.strokeStyle = 'rgba(199, 146, 56, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w / 2 - 120, h - 260, 240, 110);

      ctx.fillStyle = '#18120B';
      let bx = w / 2 - 100;
      while (bx < w / 2 + 100) {
        const bw = 2 + Math.random() * 5;
        ctx.fillRect(bx, h - 245, bw, 65);
        bx += bw + 2 + Math.random() * 3;
      }
      ctx.font = '500 16px "Plus Jakarta Sans", monospace';
      ctx.fillText('CODEX · ARCHIVE', w / 2, h - 165);
    },
  },

  // 7. YT MEDIA DOWNLOADER (YT-Media-Downloader) — Sunlit Forest Glade & Wild Flax Field
  {
    id: 'yt-media-downloader',
    title: 'YT MEDIA',
    subtitle: 'High-Fidelity Desktop Stream Harvester',
    author: 'Aditya Rathore',
    publisher: 'CodeX Desktop Utilities',
    edition: 'Desktop Application · Python & CustomTkinter',
    year: '2025',
    stars: 5,
    desc: 'A sleek, modern desktop media harvester built with CustomTkinter and Python. Provides multi-threaded extraction of pristine 4K/8K 60fps video streams, lossless audio isolation (MP3/FLAC/WAV), format probing, and automated disk storage management with zero web advertisements or rate-limiting.',
    tech: ['Python 3', 'CustomTkinter', 'Pillow (PIL)', 'yt-dlp Core', 'FFmpeg', 'Async Pipelines'],
    liveURL: 'https://github.com/Code-Xceed/YT-Media-Downloader',
    natureBlend: 1.0,
    chapters: [
      'CustomTkinter Dark Mode Interface',
      'Multi-Threaded Async Downloader Core',
      'Deep Media Format & Codec Probing',
      'Lossless Audio Extraction Pipelines',
      'Storage Directory & Filename Rules',
      'FFmpeg Transcoding Automation',
    ],
    edge: '#CCB599',
    backBg: '#D8C2A8',
    backInk: '24,18,11',
    spineBg: '#C8B093',
    spineInk: '#18120B',
    spineFont: '600 36px "Bodoni Moda", serif',
    front: (ctx, w, h) => {
      // Warm Antique Fawn & Hazelnut Cloth Ground ("a bit little brown side")
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.48, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 2.4);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 17px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.fillText('COLLECTION NATURE & ATELIER  ·  VOL. VII', w / 2, 92);

      // Fine Art Nature Plate: Sunlit Wild Flax Meadow (Thumbnail preserved 100%)
      const pw = w - 150;
      const ph = 760;
      const px = 75;
      const py = 115;
      drawFlaxFieldLandscape(ctx, px, py, pw, ph);

      // Gilded Bevel Frame around Landscape
      ctx.save();
      ctx.strokeStyle = '#DFBA5A';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(px, py, pw, ph);
      ctx.strokeStyle = 'rgba(223, 186, 90, 0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 6, py + 6, pw - 12, ph - 12);
      ctx.restore();

      // Lower Monograph Block: Typography
      const textCenterY = py + ph + 130;
      ctx.fillStyle = '#18120B';
      ctx.font = '400 80px "Bodoni Moda", "Didot", serif';
      ctx.textAlign = 'center';
      ctx.fillText('YT MEDIA', w / 2, textCenterY);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = 'italic 300 27px "Cormorant Garamond", serif';
      ctx.fillText('High-Fidelity Desktop Stream Harvester', w / 2, textCenterY + 54);

      ctx.fillStyle = '#DFBA5A';
      ctx.font = '18px serif';
      ctx.fillText('❧   ✦   🌸   ✦   ❧', w / 2, textCenterY + 104);

      ctx.fillStyle = '#18120B';
      ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('ADITYA RATHORE', w / 2, h - 165);

      ctx.fillStyle = '#7E5318';
      ctx.font = '300 20px "Cinzel", serif';
      ctx.fillText('PYTHON 3 · CUSTOMTKINTER · YT-DLP', w / 2, h - 120);
    },
    spine: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#C8B093');
      grad.addColorStop(0.5, '#DAC5AC');
      grad.addColorStop(1, '#C2A88B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);

      ctx.fillStyle = '#DFBA5A';
      ctx.fillRect(w / 2 - 32, 90, 64, 2.5);
      ctx.fillRect(w / 2 - 32, 98, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 100, 64, 1);
      ctx.fillRect(w / 2 - 32, h - 92, 64, 2.5);

      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = '600 36px "Bodoni Moda", serif';
      ctx.fillText('YT MEDIA  —  ADITYA RATHORE', 0, 12);
      ctx.restore();
    },
    back: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D7C2');
      grad.addColorStop(0.5, '#D8C2A8');
      grad.addColorStop(1, '#C6AB8C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      applyLinenClothTexture(ctx, w, h);
      drawGoldBorder(ctx, w, h, 55, 1.6);

      ctx.fillStyle = '#18120B';
      ctx.textAlign = 'center';
      ctx.font = 'italic 300 32px "Cormorant Garamond", serif';
      ctx.fillText('“High-fidelity media extraction;', w / 2, 380);
      ctx.fillText('uncompressed streams with zero browser friction.”', w / 2, 425);

      ctx.fillStyle = '#4A3A2F';
      ctx.font = '300 22px "Plus Jakarta Sans", sans-serif';
      const blurb = [
        'Multi-threaded async extraction of 4K/8K 60fps video & lossless audio.',
        'Modern dark mode interface built with CustomTkinter & Pillow.',
        'Automated local media storage routing and FFmpeg stream multiplexing.',
      ];
      blurb.forEach((line, i) => {
        ctx.fillText(line, w / 2, 540 + i * 44);
      });

      ctx.fillStyle = '#FAF6EE';
      ctx.fillRect(w / 2 - 120, h - 260, 240, 110);
      ctx.strokeStyle = 'rgba(199, 146, 56, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(w / 2 - 120, h - 260, 240, 110);

      ctx.fillStyle = '#18120B';
      let bx = w / 2 - 100;
      while (bx < w / 2 + 100) {
        const bw = 2 + Math.random() * 5;
        ctx.fillRect(bx, h - 245, bw, 65);
        bx += bw + 2 + Math.random() * 3;
      }
      ctx.font = '500 16px "Plus Jakarta Sans", monospace';
      ctx.fillText('YT-MEDIA · HARVESTER', w / 2, h - 165);
    },
  },
];
