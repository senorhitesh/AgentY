import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { MONOGRAPHS_DATA } from '@/data/monographsData';
import NatureBackgroundShader from './NatureBackgroundShader';
import soundManager from '../lib/soundManager';
function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
const OPEN_BTN_OFF = ['opacity-0', 'scale-[0.94]'];
const OPEN_BTN_ON = ['opacity-100', 'scale-100'];
export function BooksShowcase({
  books = MONOGRAPHS_DATA,
  heroTitle = 'Projects',
  navTitle = 'STUDIO PUBLICATIONS · PARIS — TOKYO',
  showNav = true,
  showDetailPanel = true,
  showCarousel = true,
  themeColors,
  className,
  onBookSelect,
  onNavigateBack,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const openBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const dpRef = useRef(null);
  const shiftCarouselRef = useRef(() => {});

  const onBookSelectRef = useRef(onBookSelect);
  useEffect(() => {
    onBookSelectRef.current = onBookSelect;
  }, [onBookSelect]);

  const [uiMode, setUiMode] = useState('hero');
  const [selectedCfg, setSelectedCfg] = useState(null);
  const initialCenter = books[1] || books[0];
  const [activeNature, setActiveNature] = useState(initialCenter?.natureBlend ?? 0.0);
  const [envDimmed, setEnvDimmed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hero word entrance
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvasEl = canvasRef.current;
    if (!root || !canvasEl || !books || books.length === 0) return;

    let cancelled = false;
    const timeouts = [];
    const setT = (fn, ms) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
      return id;
    };

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice =
      RM ||
      window.matchMedia('(max-width: 900px)').matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    class Spring {
      constructor(v, k = 120, d = 14) {
        this.v = v;
        this.t = v;
        this.vel = 0;
        this.k = k;
        this.d = d;
      }
      set(v) {
        this.v = v;
        this.t = v;
        this.vel = 0;
        return this;
      }
      update(dt) {
        const a = this.k * (this.t - this.v) - this.d * this.vel;
        this.vel += a * dt;
        this.v += this.vel * dt;
        return this.v;
      }
    }

    function mkCanvas(w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }

    function drawSpaced(x, text, cx, y, ls) {
      const prev = x.textAlign;
      x.textAlign = 'left';
      const chars = [...text];
      let tot = 0;
      const ws = chars.map((ch) => {
        const w = x.measureText(ch).width;
        tot += w;
        return w;
      });
      tot += ls * (chars.length - 1);
      let px = cx - tot / 2;
      chars.forEach((ch, i) => {
        x.fillText(ch, px, y);
        px += ws[i] + ls;
      });
      x.textAlign = prev;
    }

    function rr(x, px, py, w, h, r) {
      x.beginPath();
      x.moveTo(px + r, py);
      x.arcTo(px + w, py, px + w, py + h, r);
      x.arcTo(px + w, py + h, px, py + h, r);
      x.arcTo(px, py + h, px, py, r);
      x.arcTo(px, py, px + w, py, r);
      x.closePath();
    }

    // WebGL Renderer with High-Aesthetic Atelier Lighting
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: !lowPowerDevice, alpha: true });
    } catch (err) {
      console.warn('BooksShowcase: WebGL renderer failed', err);
      const fail = document.createElement('div');
      fail.className =
        'absolute inset-0 z-50 flex items-center justify-center p-10 text-center text-lg leading-relaxed text-[#968F84]';
      fail.textContent = 'This experience requires WebGL 2.0 to render the 3D monograph volumes.';
      root.appendChild(fail);
      return () => {
        fail.remove();
      };
    }

    const dims = { w: 0, h: 0 };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = !lowPowerDevice;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const ANISO = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0, 0.1, 9.6);

    function envBlob(x, cx, cy, r, rgb, a) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g;
      x.beginPath();
      x.arc(cx, cy, r, 0, Math.PI * 2);
      x.fill();
    }

    // Warm museum skylight environment map
    (function buildEnv() {
      const c = mkCanvas(512, 256);
      const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#FAF6EE');   // Natural gallery skylight
      g.addColorStop(0.45, '#E5DDD0'); // Warm limestone bounce
      g.addColorStop(0.75, '#564638'); // Aged walnut wood grain
      g.addColorStop(1, '#1A1816');   // Deep atelier shadows
      x.fillStyle = g;
      x.fillRect(0, 0, 512, 256);

      envBlob(x, 150, 70, 95, '255,252,245', 0.95);  // Overhead daylight spot
      envBlob(x, 400, 85, 60, '223,186,90', 0.65);   // Warm Venetian Gold Leaf bounce
      envBlob(x, 260, 150, 120, '199,146,56', 0.35); // Raw ochre studio tint

      const tx = new THREE.CanvasTexture(c);
      tx.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromEquirectangular(tx).texture;
      tx.dispose();
      pmrem.dispose();
    })();

    // Minimal natural lighting
    const hemi = new THREE.HemisphereLight(0xFDF9F4, 0x35302A, 0.52);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xFFF7EC, 0.96);
    key.position.set(2.8, 4.8, 5.5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -5.5;
    key.shadow.camera.right = 5.5;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -5;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    scene.add(key);

    const fillLight = new THREE.DirectionalLight(0xE0D8CE, 0.30);
    fillLight.position.set(-3.8, 1.2, 4);
    scene.add(fillLight);

    const rim = new THREE.DirectionalLight(0xDFBA5A, 0.42); // Soft pale gold rim light
    rim.position.set(-1.8, 3.5, -4.5);
    scene.add(rim);

    // Cinematic Museum Spotlight for Detail Mode (Illuminating the book in final position)
    const detailSpot = new THREE.SpotLight(0xFFF1D2, 0);
    detailSpot.position.set(-2.6, 4.0, 4.8);
    detailSpot.angle = Math.PI * 0.28;
    detailSpot.penumbra = 0.88;
    detailSpot.decay = 1.2;
    detailSpot.distance = 18;
    scene.add(detailSpot);
    scene.add(detailSpot.target);

    // Soft atmospheric mist
    const fogColor = new THREE.Color(0xF6F2EB);
    scene.fog = new THREE.FogExp2(fogColor, 0.005);

    // --- 3D Atelier Plinth & Realistic Book Contact Shadows ---
    const landscapeRoot = new THREE.Group();
    scene.add(landscapeRoot);

    // Soft Shadow-Receiving Floor Plane (Transparent so 2D nature shader shines through)
    const floorGeo = new THREE.PlaneGeometry(42, 18);
    floorGeo.rotateX(-Math.PI * 0.5);
    const floorMat = new THREE.ShadowMaterial({
      opacity: 0.18,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -2.1, -2.0);
    floorMesh.receiveShadow = true;
    landscapeRoot.add(floorMesh);

    const bookRoot = new THREE.Group();
    scene.add(bookRoot);

    function tex(c) {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = ANISO;
      return t;
    }

    function loadOrPaint(material, imageURL, paintFallback) {
      material.map = tex(paintFallback());
      material.needsUpdate = true;
      if (!imageURL) return;
      new THREE.TextureLoader().setCrossOrigin('anonymous').load(
        imageURL,
        (t) => {
          if (cancelled) return;
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = ANISO;
          material.map = t;
          material.needsUpdate = true;
        },
        undefined,
        () => console.warn('Cover image fallback used for:', imageURL),
      );
    }

    function noiseTexture(base, amp, scratches) {
      const s = 256;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      const img = x.createImageData(s, s);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = base + (Math.random() - 0.5) * 2 * amp;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      if (scratches) {
        x.strokeStyle = 'rgba(215,200,180,.25)';
        x.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          x.beginPath();
          const y = Math.random() * s;
          x.moveTo(0, y);
          x.lineTo(s, y + (Math.random() - 0.5) * 22);
          x.stroke();
        }
      }
      return new THREE.CanvasTexture(c);
    }

    const laminateBump = noiseTexture(128, 10, true);
    const clothBump = (function () {
      const s = 128;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      x.fillStyle = '#808080';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < s; i += 2) {
        x.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.24)' : 'rgba(0,0,0,.24)';
        x.fillRect(i, 0, 1, s);
        x.fillRect(0, i, s, 1);
      }
      return new THREE.CanvasTexture(c);
    })();

    function striationTexture(vertical) {
      const s = 512;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      x.fillStyle = '#DEC9AB'; // Warm antiquarian deckled rag paper
      x.fillRect(0, 0, s, s);
      let p = 0;
      while (p < s) {
        const w = 1 + Math.random() * 2.4;
        const tone = Math.random();
        x.fillStyle =
          tone < 0.12 ? 'rgba(125,95,65,.55)' : tone < 0.5 ? 'rgba(245,235,215,.6)' : 'rgba(175,150,115,.45)';
        if (vertical) x.fillRect(p, 0, w, s);
        else x.fillRect(0, p, s, w);
        p += w + 0.6 + Math.random() * 1.6;
      }
      for (let i = 0; i < 2600; i++) {
        x.fillStyle = 'rgba(110,85,50,' + (Math.random() * 0.09).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
      }
      return tex(c);
    }
    const striV = striationTexture(true);
    const striH = striationTexture(false);

    // Nature-inspired marbled botanical endpaper with curatorial Ex-Libris seal
    const endpaperTex = (function () {
      const s = 1024;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');

      // Warm antiquarian parchment ground with aged tea-stain patina
      const g = x.createRadialGradient(s / 2, s / 2, 80, s / 2, s / 2, s * 0.72);
      g.addColorStop(0, '#EAE0C8');
      g.addColorStop(0.65, '#DFCBB0');
      g.addColorStop(1, '#CEB594');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);

      // Nature-inspired marbled botanical veins (simulating river currents & mineral swirls)
      x.save();
      for (let i = 0; i < 48; i++) {
        const yBase = (i / 48) * s;
        x.beginPath();
        x.moveTo(0, yBase);
        for (let px = 0; px <= s; px += 24) {
          const wave = Math.sin(px * 0.007 + i * 0.38) * 26 + Math.cos(px * 0.018 - i * 0.28) * 14;
          x.lineTo(px, yBase + wave);
        }
        x.strokeStyle = i % 3 === 0
          ? 'rgba(180, 140, 75, 0.13)' // Antique Venetian gold vein
          : i % 3 === 1
          ? 'rgba(95, 110, 85, 0.10)'  // Organic moss lichen vein
          : 'rgba(115, 80, 48, 0.09)';  // Raw walnut earth vein
        x.lineWidth = 2 + (i % 4);
        x.stroke();
      }
      x.restore();

      // Flecks of raw flax and antique gold leaf motes
      for (let i = 0; i < 2800; i++) {
        x.fillStyle = 'rgba(130, 95, 45,' + (0.03 + Math.random() * 0.08).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.6, 1.6);
      }

      // Elegant Curatorial Ex-Libris Seal in the center
      x.save();
      const cx = s / 2;
      const cy = s / 2;
      x.strokeStyle = 'rgba(168, 121, 40, 0.6)';
      x.lineWidth = 2;
      x.beginPath();
      x.ellipse(cx, cy, 185, 245, 0, 0, Math.PI * 2);
      x.stroke();
      x.strokeStyle = 'rgba(168, 121, 40, 0.35)';
      x.lineWidth = 1;
      x.beginPath();
      x.ellipse(cx, cy, 197, 257, 0, 0, Math.PI * 2);
      x.stroke();

      x.fillStyle = '#A87928';
      x.font = '32px serif';
      x.textAlign = 'center';
      x.fillText('🌿', cx, cy - 135);

      x.fillStyle = '#2A2016';
      x.font = '300 20px "Cinzel", serif';
      x.fillText('EX  LIBRIS', cx, cy - 85);

      x.font = 'italic 400 38px "Bodoni Moda", serif';
      x.fillText('Aditya Rathore', cx, cy - 25);

      x.fillStyle = 'rgba(168, 121, 40, 0.85)';
      x.font = '300 15px "Cinzel", serif';
      x.fillText('ATELIER  MMXXIV', cx, cy + 22);

      x.fillStyle = '#5A442D';
      x.font = 'italic 21px "Cormorant Garamond", serif';
      x.fillText('Collection Nature & Monographies', cx, cy + 68);

      x.fillStyle = 'rgba(120, 95, 65, 0.75)';
      x.font = '300 13px "Cinzel", serif';
      x.fillText('ARS LONGA · NATURA MAGISTRA', cx, cy + 135);
      x.restore();

      // Binding crease shadow on the right (where inside front cover joins the spine)
      const crease = x.createLinearGradient(s - 85, 0, s, 0);
      crease.addColorStop(0, 'rgba(40, 25, 12, 0)');
      crease.addColorStop(1, 'rgba(40, 25, 12, 0.35)');
      x.fillStyle = crease;
      x.fillRect(s - 85, 0, 85, s);

      return tex(c);
    })();

    const blobTex = (function () {
      const s = 256;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(21,20,19,.75)');
      g.addColorStop(1, 'rgba(21,20,19,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    })();

    function paintDefaultFront(x, w, h, o) {
      x.fillStyle = o.bg || '#D8C2A8';
      x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(218,168,58,0.18)';
      for (let i = 0; i < 60; i++) x.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      x.fillStyle = '#18120B';
      x.textAlign = 'center';
      x.font = '400 82px "Bodoni Moda", serif';
      const words = (o.title || '').split(' ');
      let line = '';
      const lines = [];
      words.forEach((word) => {
        const test = line ? line + ' ' + word : word;
        if (x.measureText(test).width > w * 0.8 && line) {
          lines.push(line);
          line = word;
        } else line = test;
      });
      if (line) lines.push(line);
      const startY = h * 0.42 - ((lines.length - 1) * 88) / 2;
      lines.forEach((l, i) => x.fillText(l, w / 2, startY + i * 88));
      x.fillStyle = '#4A3A2F';
      x.font = 'italic 34px "Cormorant Garamond", serif';
      x.fillText(o.author || 'Aditya Rathore', w / 2, startY + lines.length * 88 + 60);
      x.strokeStyle = 'rgba(218,168,58,0.92)';
      x.lineWidth = 2.5;
      x.strokeRect(55, 55, w - 110, h - 110);
    }

    function paintBack(x, w, h, o) {
      x.fillStyle = o.backBg || '#D8C2A8';
      x.fillRect(0, 0, w, h);
      const ink = o.backInk || '24,18,11';
      x.fillStyle = 'rgba(' + ink + ',.5)';
      rr(x, 150, 190, w - 460, 28, 14);
      x.fill();
      for (let i = 0; i < 9; i++) {
        const lw = i === 8 ? w - 560 : w - 300 - Math.random() * 180;
        x.fillStyle = 'rgba(' + ink + ',.2)';
        rr(x, 150, 300 + i * 56, lw, 15, 7);
        x.fill();
      }
      x.fillStyle = 'rgba(218,168,58,.8)';
      x.beginPath();
      x.arc(178, h - 186, 26, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = '#FAF6EE';
      rr(x, w - 330, h - 262, 236, 152, 8);
      x.fill();
      x.fillStyle = '#18120B';
      let bx = w - 310;
      while (bx < w - 118) {
        const bw = 2 + Math.random() * 6;
        if (Math.random() > 0.42) x.fillRect(bx, h - 242, bw, 96);
        bx += bw + 2 + Math.random() * 4;
      }
      x.font = '500 18px "Plus Jakarta Sans", monospace';
      x.textAlign = 'center';
      x.fillText('ARCHIVAL FOLIO', w - 212, h - 124);
      x.textAlign = 'left';
    }

    function paintSpine(x, w, h, o) {
      x.fillStyle = o.spineBg || '#C8B093';
      x.fillRect(0, 0, w, h);
      x.save();
      x.translate(w / 2, h / 2);
      x.rotate(Math.PI / 2);
      x.fillStyle = o.spineInk || '#18120B';
      x.font = o.spineFont || '600 36px "Bodoni Moda", serif';
      drawSpaced(x, (o.title || '').toUpperCase(), -h * 0.1, 15, 6);
      x.globalAlpha = 0.85;
      x.font = '500 24px "Plus Jakarta Sans", sans-serif';
      drawSpaced(x, (o.author || 'ADITYA RATHORE').toUpperCase(), h * 0.325, 9, 4);
      x.globalAlpha = 1;
      x.restore();
      x.fillStyle = '#DFBA5A';
      x.fillRect(w / 2 - 26, 92, 52, 2.5);
      x.fillRect(w / 2 - 26, h - 95, 52, 2.5);
    }

    function trimToWidth(x, text, maxW) {
      if (x.measureText(text).width <= maxW) return text;
      let t = text;
      while (t.length > 1 && x.measureText(t + '...').width > maxW) t = t.slice(0, -1);
      return t + '...';
    }

    function makeIndexPageTex(chapters) {
      const w = 1024;
      const h = 1536;
      const c = mkCanvas(w, h);
      const x = c.getContext('2d');

      // 1. Aged antiquarian tea-stained parchment base with radial patina
      const bgGrad = x.createRadialGradient(w * 0.55, h * 0.48, 120, w * 0.5, h * 0.5, w * 0.85);
      bgGrad.addColorStop(0, '#EFE4D0');   // Warm aged vellum center
      bgGrad.addColorStop(0.55, '#E4D5BC'); // Tea-stained oxidation
      bgGrad.addColorStop(0.85, '#D5BE97'); // Darkened antique edges
      bgGrad.addColorStop(1, '#C7AF85');   // Weathered book rim
      x.fillStyle = bgGrad;
      x.fillRect(0, 0, w, h);

      // 2. Spine gutter depth shadow (simulates the dark crease where pages bind into spine)
      const spineCrease = x.createLinearGradient(0, 0, 95, 0);
      spineCrease.addColorStop(0, 'rgba(40, 28, 16, 0.42)');
      spineCrease.addColorStop(0.3, 'rgba(40, 28, 16, 0.18)');
      spineCrease.addColorStop(1, 'rgba(40, 28, 16, 0)');
      x.fillStyle = spineCrease;
      x.fillRect(0, 0, 95, h);

      // Outer page edge vignette
      const edgeVignette = x.createLinearGradient(w - 75, 0, w, 0);
      edgeVignette.addColorStop(0, 'rgba(80, 55, 30, 0)');
      edgeVignette.addColorStop(1, 'rgba(70, 48, 25, 0.20)');
      x.fillStyle = edgeVignette;
      x.fillRect(w - 75, 0, 75, h);

      // 3. Ancient handmade laid paper lines (laid rag paper texture)
      x.fillStyle = 'rgba(140, 110, 70, 0.038)';
      for (let y = 0; y < h; y += 7) {
        x.fillRect(0, y, w, 1);
      }
      for (let cx = 60; cx < w; cx += 55) {
        x.fillRect(cx, 0, 1.2, h);
      }

      // 4. Natural foxing spots & botanical fiber flecks
      for (let i = 0; i < 3500; i++) {
        const fx = Math.random() * w;
        const fy = Math.random() * h;
        const alpha = (0.02 + Math.random() * 0.08).toFixed(3);
        x.fillStyle = `rgba(110, 75, 35, ${alpha})`;
        x.fillRect(fx, fy, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5);
      }

      // Historical foxing spots
      for (let i = 0; i < 30; i++) {
        const spotX = 80 + Math.random() * (w - 160);
        const spotY = 80 + Math.random() * (h - 160);
        const spotR = 2 + Math.random() * 6;
        const spotGrad = x.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotR);
        spotGrad.addColorStop(0, 'rgba(125, 82, 40, 0.18)');
        spotGrad.addColorStop(0.6, 'rgba(125, 82, 40, 0.08)');
        spotGrad.addColorStop(1, 'rgba(125, 82, 40, 0)');
        x.fillStyle = spotGrad;
        x.beginPath();
        x.arc(spotX, spotY, spotR, 0, Math.PI * 2);
        x.fill();
      }

      // 5. Historic Headpiece: Ancient Botanical Foliage Ornament & Title
      x.save();
      x.fillStyle = '#A87928';
      x.font = '24px serif';
      x.textAlign = 'center';
      x.fillText('❦   EX CODEX ATELIER ARCHIVE   ❦', w / 2, 138);

      // Title in rich aged walnut / iron-gall ink
      x.fillStyle = '#261D15';
      x.font = '400 74px "Bodoni Moda", "Didot", serif';
      x.fillText('INDEX DES MATIÈRES', w / 2, 210);

      // Antique double rule
      x.strokeStyle = 'rgba(168, 121, 40, 0.45)';
      x.lineWidth = 1.8;
      x.beginPath();
      x.moveTo(200, 240);
      x.lineTo(w - 200, 240);
      x.stroke();

      x.strokeStyle = 'rgba(168, 121, 40, 0.25)';
      x.lineWidth = 0.8;
      x.beginPath();
      x.moveTo(250, 247);
      x.lineTo(w - 250, 247);
      x.stroke();
      x.restore();

      // 6. Chapter Listing in Antiquarian Calligraphic Layout
      const list = chapters && chapters.length
        ? chapters
        : ['I. Prolegomena & Nature Chemistry', 'II. Raw Mineral Stratigraphy', 'III. Belgian Flax & Botanical Weaves', 'IV. Curatorial Plates & Archive', 'V. Exhibition Provenance', 'VI. Studio Chronology'];

      let y = 338;
      for (let i = 0; i < list.length; i++) {
        const pageNo = String(9 + i * 16).padStart(3, ' ');
        const left = trimToWidth(x, list[i], 610);

        // Chapter title in rich aged walnut ink
        x.textAlign = 'left';
        x.fillStyle = '#261D15';
        x.font = 'italic 400 40px "Cormorant Garamond", serif';
        x.fillText(left, 155, y);

        // Page number in antique burnished gold
        x.textAlign = 'right';
        x.fillStyle = '#A87928';
        x.font = '600 36px "Bodoni Moda", serif';
        x.fillText(pageNo, w - 155, y);

        // Dotted antique leader line
        x.save();
        x.setLineDash([2, 8]);
        x.strokeStyle = 'rgba(120, 90, 50, 0.28)';
        x.lineWidth = 1.5;
        const textWidth = x.measureText(left).width;
        x.beginPath();
        x.moveTo(165 + textWidth + 15, y - 6);
        x.lineTo(w - 225, y - 6);
        x.stroke();
        x.restore();

        y += 112;
      }

      // Footnote in antique italic
      x.textAlign = 'center';
      x.fillStyle = 'rgba(90, 68, 45, 0.7)';
      x.font = 'italic 20px "Cormorant Garamond", serif';
      x.fillText('—  Typis Atelier Paris · Charta Antiqua MMXXIV  —', w / 2, h - 110);

      return tex(c);
    }

    // Book 3D dimensions
    const N = books.length;
    const VISIBLE = Math.min(3, N);

    const W = 1.42;
    const H = 2.14;
    const T = 0.34;
    const CT = 0.032;
    const OV = 0.05;
    const PAGE_N = lowPowerDevice ? 6 : 10;
    const BACK_PAGE_N = lowPowerDevice ? 3 : 5;
    const PW = W - 0.055;
    const PH = H - 0.03;
    const BLOCK_D = 0.245;
    const BLOCK_Z = -0.0205;
    const PIVOT_Z = T / 2 + CT / 2;
    const BPIVOT_Z = -(T / 2 + CT / 2);
    const HINGE_OVERLAP = 0.05;

    const coverGeo = new THREE.BoxGeometry(W + OV, H + OV * 2, CT);
    const blockGeo = new THREE.BoxGeometry(W - 0.015, H, BLOCK_D);
    const pageGeo = new THREE.PlaneGeometry(PW, PH);
    const spineGeo = new THREE.BoxGeometry(0.028, H + OV * 2, T + CT * 2 + 0.006);
    const hitGeo = new THREE.BoxGeometry(1.8, 2.5, 1.15);
    const blobGeo = new THREE.PlaneGeometry(1, 1);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    function std(o) {
      return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.02 }, o));
    }

    const paperFlat = std({ color: 0xDECDB0, roughness: 0.98, envMapIntensity: 0.1 });
    const striMatV = std({ map: striV, bumpMap: striV, bumpScale: 0.0025, roughness: 0.96, envMapIntensity: 0.12 });
    const striMatH = std({ map: striH, bumpMap: striH, bumpScale: 0.0025, roughness: 0.96, envMapIntensity: 0.12 });
    const endpaperMat = std({ map: endpaperTex, roughness: 0.92, envMapIntensity: 0.15 });
    const pageMats = [0xEDE1CB, 0xE5D6BD, 0xDECDB0].map((c) =>
      std({ color: c, roughness: 0.98, envMapIntensity: 0.1, side: THREE.DoubleSide }),
    );

    const bookInstances = [];
    const hitMeshes = [];

    function buildBook(cfg, index) {
      const root = new THREE.Group();
      const float = new THREE.Group();
      root.add(float);
      bookRoot.add(root);

      const indexPageMat = std({ map: makeIndexPageTex(cfg.chapters), roughness: 0.92, envMapIntensity: 0.2, side: THREE.DoubleSide });

      const edgeColor = cfg.edge ?? '#CCB599';
      const mEdge = std({ color: edgeColor, bumpMap: clothBump, bumpScale: 0.004, roughness: 0.82, envMapIntensity: 0.18 });
      const mFront = std({ bumpMap: clothBump, bumpScale: 0.005, roughness: 0.84, envMapIntensity: 0.16 });
      const mBack = std({ bumpMap: clothBump, bumpScale: 0.005, roughness: 0.84, envMapIntensity: 0.16 });
      const mSpine = std({ bumpMap: clothBump, bumpScale: 0.006, roughness: 0.82, envMapIntensity: 0.18 });

      loadOrPaint(mFront, cfg.images?.front ?? cfg.coverURL ?? null, () => {
        const c = mkCanvas(1024, 1536);
        const ctx = c.getContext('2d');
        if (cfg.front) cfg.front(ctx, 1024, 1536);
        else paintDefaultFront(ctx, 1024, 1536, { title: cfg.title, author: cfg.author, bg: cfg.spineBg ?? cfg.backBg ?? '#D8C2A8' });
        return c;
      });
      loadOrPaint(mBack, cfg.images?.back ?? null, () => {
        const c = mkCanvas(1024, 1536);
        const ctx = c.getContext('2d');
        if (cfg.back) cfg.back(ctx, 1024, 1536);
        else paintBack(ctx, 1024, 1536, { backBg: cfg.backBg ?? '#D8C2A8', backInk: cfg.backInk ?? '24,18,11' });
        return c;
      });
      loadOrPaint(mSpine, cfg.images?.spine ?? null, () => {
        const c = mkCanvas(220, 1536);
        const ctx = c.getContext('2d');
        if (cfg.spine) cfg.spine(ctx, 220, 1536);
        else
          paintSpine(ctx, 220, 1536, {
            spineBg: cfg.spineBg ?? cfg.backBg ?? '#C8B093',
            spineInk: cfg.spineInk ?? '#18120B',
            spineFont: cfg.spineFont ?? '600 36px "Bodoni Moda", serif',
            title: cfg.title,
            author: cfg.author,
          });
        return c;
      });

      const backPivot = new THREE.Group();
      backPivot.position.set(-W / 2 - HINGE_OVERLAP, 0, BPIVOT_Z);
      const backMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, endpaperMat, mBack]);
      backMesh.position.x = (W + OV) / 2;
      backMesh.castShadow = backMesh.receiveShadow = true;
      backPivot.add(backMesh);
      float.add(backPivot);

      const pivot = new THREE.Group();
      pivot.position.set(-W / 2 - HINGE_OVERLAP, 0, PIVOT_Z);
      const frontMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, mFront, endpaperMat]);
      frontMesh.position.x = (W + OV) / 2;
      frontMesh.castShadow = frontMesh.receiveShadow = true;
      pivot.add(frontMesh);
      float.add(pivot);

      const spine = new THREE.Mesh(spineGeo, mSpine);
      spine.position.set(-W / 2 - 0.013, 0, 0);
      spine.castShadow = true;
      float.add(spine);

      const block = new THREE.Mesh(blockGeo, [striMatV, paperFlat, striMatH, striMatH, paperFlat, paperFlat]);
      block.position.set(-0.0075, 0, BLOCK_Z);
      block.castShadow = block.receiveShadow = true;
      float.add(block);

      const pages = [];
      const pageF = [];
      for (let i = 0; i < PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.02, 0, 0.166 - i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, i === 0 ? indexPageMat : pageMats[i % 3]);
        pm.position.x = PW / 2;
        pp.add(pm);
        pp.visible = false;
        float.add(pp);
        pages.push(pp);
        pageF.push(0.3 * Math.pow(1 - i / PAGE_N, 2.6));
      }

      const pagesB = [];
      const pageFB = [];
      for (let i = 0; i < BACK_PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.02, 0, -0.166 + i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, pageMats[i % 3]);
        pm.position.x = PW / 2;
        pp.add(pm);
        pp.visible = false;
        float.add(pp);
        pagesB.push(pp);
        pageFB.push(0.3 * Math.pow(1 - i / BACK_PAGE_N, 2.6));
      }

      const blob = new THREE.Mesh(
        blobGeo,
        new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.38, depthWrite: false }),
      );
      blob.scale.set(3.1, 3.9, 1);
      blob.position.set(0.1, -0.3, -0.85);
      blob.renderOrder = -5;
      root.add(blob);

      const hit = new THREE.Mesh(hitGeo, hitMat);
      float.add(hit);

      const springs = {
        px: new Spring(0, 17, 6.8),
        py: new Spring(0, 17, 6.8),
        pz: new Spring(0, 17, 6.8),
        rx: new Spring(0, 17, 6.8),
        ry: new Spring(0, 17, 6.8),
        rz: new Spring(0, 17, 6.8),
        sc: new Spring(1, 17, 6.8),
        tiltX: new Spring(0, 120, 13),
        tiltY: new Spring(0, 120, 13),
        lift: new Spring(0, 120, 13),
        cover: new Spring(0, 90, 12),
        coverB: new Spring(0, 90, 12),
        drag: new Spring(0, 160, 16),
      };

      const b = {
        cfg,
        index,
        root,
        float,
        pivot,
        backPivot,
        frontMesh,
        spine,
        block,
        pages,
        pageF,
        pagesB,
        pageFB,
        hit,
        springs,
        phase: Math.random() * 6.28,
        slotScale: 1,
        hitEdge: null,
        scr: { x: 0, y: 0 },
        orbY: 0,
        orbYv: 0,
        orbPhase: 'idle',
        orbTarget: 0,
        orbXs: new Spring(0, 60, 12),
        exit: null,
      };
      bookInstances.push(b);
      return b;
    }
    books.forEach(buildBook);
    const bookByHit = (m) => bookInstances.find((b) => b.hit === m);

    // Floating Nature Petals & Botanical Leaflets (Detail View)
    const goldFlakes = {
      items: [],
      anchor: null,
      activate(book) {
        this.anchor = book;
        this.items.forEach((l) => {
          l.kick.set(
            -l.hx * 0.6 + (Math.random() - 0.5) * 1.2,
            -l.hy * 0.6 + (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 0.8
          );
          l.s.t = l.size;
          l.mesh.visible = true;
        });
      },
      deactivate() {
        this.items.forEach((l) => {
          l.s.t = 0;
        });
      },
      push(dx, dy) {
        if (!this.anchor) return;
        this.items.forEach((l) => {
          l.kick.x += dx * 2.8 * Math.random();
          l.kick.y += -dy * 2.8 * Math.random();
        });
      },
      update(dt, t) {
        if (!this.anchor) return;
        const ap = this.anchor.root.position;
        const w = RM ? 0.15 : 1;
        this.items.forEach((l) => {
          l.kick.multiplyScalar(Math.exp(-1.15 * dt));
          l.mesh.position.set(
            ap.x + l.hx + Math.sin(t * l.sp + l.ph) * 0.48 * w + l.kick.x,
            ap.y + l.hy + Math.cos(t * l.sp * 0.83 + l.ph * 1.3) * 0.38 * w + l.kick.y,
            ap.z * 0.4 + l.hz + Math.sin(t * l.sp * 0.6 + l.ph) * 0.28 + l.kick.z,
          );
          l.mesh.rotation.x += l.rv.x * dt * (0.35 + w);
          l.mesh.rotation.y += l.rv.y * dt * (0.35 + w);
          l.mesh.rotation.z += l.rv.z * dt * (0.35 + w);
          const s = l.s.update(dt);
          l.mesh.scale.setScalar(Math.max(s, 0.0001));
          if (l.s.t === 0 && s < 0.01) l.mesh.visible = false;
        });
      },
    };

    (function buildNaturePetals() {
      // 1. Organic Curved Wildflower Petal Shape
      const petalShape = new THREE.Shape();
      petalShape.moveTo(0, -0.45);
      petalShape.bezierCurveTo(0.26, -0.25, 0.36, 0.12, 0, 0.52);
      petalShape.bezierCurveTo(-0.36, 0.12, -0.26, -0.25, 0, -0.45);
      const petalGeo = new THREE.ShapeGeometry(petalShape, 10);

      // 2. Slender Willow / Botanical Leaflet Shape
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, -0.55);
      leafShape.bezierCurveTo(0.18, -0.2, 0.18, 0.22, 0, 0.65);
      leafShape.bezierCurveTo(-0.18, 0.22, -0.18, -0.2, 0, -0.55);
      const leafGeo = new THREE.ShapeGeometry(leafShape, 10);

      // Botanical Nature Petal & Leaf Color Palette:
      // Rose Petal, Tuscan Poppy Terracotta, Wild Chamomile Ivory, Flax Azure, Sage Leaf, Ginkgo Gold, Alpine Lavender
      const petalColors = [
        0xECA89E, // Soft Rose Petal
        0xC9644D, // Tuscan Terracotta Poppy
        0xF6EDDD, // Wild Chamomile Blossom Ivory
        0x789BBF, // Belgian Flax Flower Azure
        0x6F8C68, // Alpine Sage Leaf Green
        0xE5BC52, // Autumn Ginkgo Gold
        0x9E8EA8, // Maritime Lavender
        0xDFBA5A, // Venetian Gold Pollen
      ];

      const TOTAL_PETALS = 22;
      for (let i = 0; i < TOTAL_PETALS; i++) {
        const isLeaf = i % 3 === 0;
        const geo = isLeaf ? leafGeo : petalGeo;
        const color = petalColors[i % petalColors.length];
        const mat = std({
          color,
          roughness: 0.65,
          metalness: 0.08,
          envMapIntensity: 0.55,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.90,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.visible = false;
        bookRoot.add(mesh);

        // Disperse comfortably around the open volume in 3D
        const angle = (i / TOTAL_PETALS) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const radius = 0.9 + Math.random() * 2.8;
        const hx = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.9;
        const hy = (Math.random() - 0.5) * 3.8;
        const hz = -0.8 + Math.random() * 2.4;

        goldFlakes.items.push({
          mesh,
          hx,
          hy,
          hz,
          sp: 0.18 + Math.random() * 0.38,
          ph: Math.random() * Math.PI * 2,
          rv: new THREE.Vector3(
            (Math.random() - 0.5) * 1.1,
            (Math.random() - 0.5) * 1.3,
            (Math.random() - 0.5) * 0.9,
          ),
          kick: new THREE.Vector3(),
          size: 0.11 + Math.random() * 0.16,
          s: new Spring(0, 52, 9),
        });
      }
    })();

    // Layout slots
    const state = { mode: 'hero', selected: null, hovered: null, pillLock: null, kbIndex: -1 };
    const SLOTS = { hero: [], detail: null, portrait: false };

    function computeSlots() {
      const a = dims.w / Math.max(1, dims.h);
      const portrait = a < 0.85;
      // Refined smaller scale for books so background sky, rays, and header have ample space
      const baseFit = portrait ? clamp(a / 1.08, 0.32, 0.64) : clamp(a / 1.62, 0.44, 0.84);
      const fit = baseFit * 0.86;
      bookRoot.scale.setScalar(fit);
      bookRoot.position.y = -(1 - fit) * 0.16;
      SLOTS.portrait = portrait;

      SLOTS.hero = SLOTS.portrait
        ? [
          { p: [-1.22, -0.48, -0.10], r: [-0.045, 0.38, 0.16], s: 0.94 },
          { p: [0.18, -0.18, 0.55], r: [-0.05, -0.09, -0.035], s: 1.04 },
          { p: [1.44, -0.52, -0.30], r: [-0.045, -0.40, -0.16], s: 0.94 },
        ]
        : [
          { p: [-1.88, -0.46, -0.10], r: [-0.045, 0.38, 0.16], s: 0.92 },
          { p: [0.20, -0.26, 0.55], r: [-0.05, -0.09, -0.035], s: 1.02 },
          { p: [2.14, -0.52, -0.30], r: [-0.045, -0.40, -0.16], s: 0.92 },
        ];

      if (!showDetailPanel) {
        SLOTS.detail = { p: [0, -0.05, 0.75], r: [0.02, -0.34, 0.05], s: SLOTS.portrait ? 1.25 : 1.45 };
        return;
      }

      if (SLOTS.portrait) {
        const T13 = 0.23087;
        const camZp = 9.9;
        const zw = 0.85 * fit;
        const rootY = -(1 - fit) * 0.16;
        // Position monograph book in the upper region of the screen (~28% from top, comfortably lower)
        const midPx = Math.max(140, Math.min(dims.h * 0.28, 255));
        const yw = 0.1 + (1 - (2 * midPx) / dims.h) * T13 * (camZp - zw);
        // Substantially larger monograph scale on mobile so the book feels grand and prominent
        const s = clamp(a * 2.9, 1.28, 1.48);
        SLOTS.detail = { p: [0, (yw - rootY) / fit, 0.85], r: [-0.02, -0.4, 0.06], s };
      } else {
        // Desktop / Landscape: Position monograph book in the center of the left column (~25% viewport width)
        // With bookRoot scaled by `fit`, p[0] = -2.75 centers the open volume elegantly in the left half
        SLOTS.detail = {
          p: [-2.75, 0.02, 1.38],
          r: [0.015, -0.38, 0.05],
          s: 1.50,
        };
      }
    }

    function setTargets(b, slot) {
      const s = b.springs;
      s.px.t = slot.p[0];
      s.py.t = slot.p[1];
      s.pz.t = slot.p[2];
      s.rx.t = slot.r[0];
      s.ry.t = slot.r[1];
      s.rz.t = slot.r[2];
      b.slotScale = slot.s;
    }

    const EASE = {
      hold: () => 1,
      outQuad: (t) => 1 - (1 - t) * (1 - t),
      outQuint: (t) => 1 - Math.pow(1 - t, 5),
      inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    };
    const LIFT = 0.38;
    const CLEAR = 4.2;

    function playY(b, segs) {
      b.exit = { segs, i: 0, t: 0 };
    }
    function stepY(b, dt) {
      const ex = b.exit;
      const s = b.springs;
      ex.t += dt;
      let seg = ex.segs[ex.i];
      while (seg && ex.t >= seg.d) {
        ex.t -= seg.d;
        s.py.v = seg.to;
        if (seg.end) seg.end();
        seg = ex.segs[++ex.i];
      }
      if (seg) s.py.v = seg.from + (seg.to - seg.from) * seg.ease(ex.t / seg.d);
      else b.exit = null;
      s.py.t = s.py.v;
      s.py.vel = 0;
    }
    function pinInPlace(b) {
      const s = b.springs;
      s.px.t = s.px.v;
      s.pz.t = s.pz.v;
      s.rx.t = s.rx.v;
      s.ry.t = s.ry.v;
      s.rz.t = s.rz.v;
    }
    function sendOut(b, i, delay) {
      const y0 = SLOTS.hero[i].p[1];
      const here = b.springs.py.v;
      const apex = y0 + LIFT;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 0.28, from: here, to: apex, ease: EASE.outQuad },
        { d: 0.9, from: apex, to: y0 - CLEAR, ease: EASE.inOutSine, end: () => { b.root.visible = false; } },
      ]);
    }
    function bringBack(b, i, delay) {
      const here = b.springs.py.v;
      b.root.visible = true;
      b.orbY = 0;
      b.orbYv = 0;
      b.orbTarget = 0;
      b.orbPhase = 'idle';
      b.orbXs.set(0);
      b.springs.cover.set(0);
      b.springs.coverB.set(0);
      b.springs.drag.set(0);
      const slot = SLOTS.hero[i];
      if (slot) setTargets(b, slot);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 1.0, from: here, to: slot ? slot.p[1] : 0, ease: EASE.outQuint },
      ]);
    }

    function windowIndices(start, total, count) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push((start + i) % total);
      return arr;
    }
    let carouselStart = 0;
    let currentWindow = windowIndices(0, N, VISIBLE);
    let carouselBusy = false;

    function rebuildHitMeshes() {
      hitMeshes.length = 0;
      currentWindow.forEach((bi) => hitMeshes.push(bookInstances[bi].hit));
    }

    function applyMode() {
      if (state.mode === 'hero' || state.mode === 'closing') {
        currentWindow.forEach((bi, i) => {
          const slot = SLOTS.hero[i];
          if (slot) setTargets(bookInstances[bi], slot);
        });
      } else if (state.selected) {
        setTargets(state.selected, SLOTS.detail);
      }
    }

    function shiftCarousel(dir) {
      if (carouselBusy || state.mode !== 'hero' || N <= VISIBLE) return;
      soundManager.play('drag');
      carouselBusy = true;
      // Guarantee all books in hero mode maintain clean forward-facing orientation
      bookInstances.forEach((bk) => {
        bk.orbY = 0;
        bk.orbYv = 0;
        bk.orbPhase = 'idle';
        bk.orbTarget = 0;
        bk.orbXs.set(0);
        bk.springs.cover.set(0);
        bk.springs.coverB.set(0);
        bk.springs.drag.set(0);
      });
      const outgoing = currentWindow;
      carouselStart = (((carouselStart + dir) % N) + N) % N;
      const incoming = windowIndices(carouselStart, N, VISIBLE);

      const toHide = outgoing.filter((bi) => !incoming.includes(bi));

      toHide.forEach((bi) => {
        const oldIdx = outgoing.indexOf(bi);
        const slot = SLOTS.hero[oldIdx];
        const b = bookInstances[bi];
        if (slot) b.springs.px.t = slot.p[0] - dir * 6.5;
      });
      setT(() => toHide.forEach((bi) => { bookInstances[bi].root.visible = false; }), 650);

      incoming.forEach((bi, i) => {
        const slot = SLOTS.hero[i];
        if (!slot) return;
        const b = bookInstances[bi];
        const alreadyOnScreen = outgoing.includes(bi);
        b.root.visible = true;
        if (!alreadyOnScreen) {
          b.springs.px.set(slot.p[0] + dir * 6.5);
          b.springs.py.set(slot.p[1]);
          b.springs.pz.set(slot.p[2]);
          b.springs.rx.set(slot.r[0]);
          b.springs.ry.set(slot.r[1]);
          b.springs.rz.set(slot.r[2]);
          b.springs.sc.set(slot.s * 0.92);
        }
        setTargets(b, slot);
      });

      currentWindow = incoming;
      const centerBook = books[incoming[1]];
      if (centerBook && typeof centerBook.natureBlend === 'number') {
        setActiveNature(centerBook.natureBlend);
      }
      rebuildHitMeshes();
      setT(() => { carouselBusy = false; }, 700);
    }
    shiftCarouselRef.current = shiftCarousel;

    const camX = new Spring(0, 13, 6.5);
    const camY = new Spring(0.1, 13, 6.5);
    const camZ = new Spring(9.6, 13, 6.5);
    const lookX = new Spring(0, 13, 6.5);
    const lookY = new Spring(0, 13, 6.5);
    const parX = new Spring(0, 60, 10);
    const parY = new Spring(0, 60, 10);

    function camTo(mode) {
      if (mode === 'detail') {
        camX.t = 0;
        camZ.t = SLOTS.portrait ? 10.4 : 9.6;
        lookX.t = 0;
        lookY.t = SLOTS.portrait ? 0 : 0.02;
      } else {
        camX.t = 0;
        camZ.t = 9.6;
        lookX.t = 0;
        lookY.t = 0;
      }
    }

    const pillX = new Spring(0, 190, 23);
    const pillY = new Spring(0, 190, 23);
    let pillOn = false;
    function showPill() {
      const el = openBtnRef.current;
      if (!el) return;
      el.classList.remove(...OPEN_BTN_OFF);
      el.classList.add(...OPEN_BTN_ON);
      pillOn = true;
    }
    function hidePill() {
      const el = openBtnRef.current;
      if (el) {
        el.classList.remove(...OPEN_BTN_ON);
        el.classList.add(...OPEN_BTN_OFF);
      }
      pillOn = false;
    }

    function open(book) {
      if (state.mode !== 'hero' || !book) return;
      soundManager.play('pageTurn');
      state.mode = 'opening';
      setUiMode('opening');
      state.selected = book;
      state.pillLock = null;
      state.kbIndex = -1;
      hidePill();
      book.exit = null;
      root.classList.add('bs-transit');
      setSelectedCfg(book.cfg);
      if (book.cfg && typeof book.cfg.natureBlend === 'number') {
        setActiveNature(book.cfg.natureBlend);
      }
      onBookSelectRef.current?.(book.cfg);
      computeSlots();

      let out = 0;
      currentWindow.forEach((bi, i) => {
        const b = bookInstances[bi];
        if (b !== book) sendOut(b, i, out++ * 0.08);
      });

      // Synchronize the environmental dimming and spotlight warming right as the book lifts and travels
      setT(() => {
        if (state.mode === 'opening' || state.mode === 'detail') {
          setEnvDimmed(true);
        }
      }, 140);

      setT(() => {
        if (state.mode !== 'opening' && state.mode !== 'detail') return;
        book.orbY = RM ? 0 : -6.2832;
        book.orbYv = RM ? 0 : 3;
        book.orbPhase = 'return';
        book.orbTarget = 0;
        book.orbXs.set(0);
        applyMode();
        camTo('detail');
      }, 760);
      setT(() => goldFlakes.activate(book), 1000);
      setT(() => {
        if (state.mode === 'opening') {
          currentWindow.forEach((bi) => {
            const sibling = bookInstances[bi];
            if (sibling !== book) {
              sibling.exit = null;
              sibling.root.visible = false;
            }
          });
          root.classList.add('bs-detail-open');
          state.mode = 'detail';
          setUiMode('detail');
        }
      }, 1400);
    }

    function close() {
      if (state.mode !== 'detail') return;
      state.mode = 'closing';
      setUiMode('closing');
      root.classList.remove('bs-detail-open');
      onBookSelectRef.current?.(null);
      goldFlakes.deactivate();
      orbit.drag = false;
      const b = state.selected;
      if (b) {
        // Normalize orbY to [-PI, PI] and smoothly return directly to 0 (front cover facing forward)
        b.orbY = ((b.orbY % 6.2831853) + 6.2831853) % 6.2831853;
        if (b.orbY > Math.PI) b.orbY -= 6.2831853;
        b.orbTarget = 0;
        b.orbYv = 0;
        b.orbPhase = 'return';
        b.orbXs.t = 0;
        b.springs.cover.t = 0;
        b.springs.coverB.t = 0;
        b.springs.drag.t = 0;
      }

      // Gracefully ease out the spotlight and dimming as the monograph departs
      setT(() => {
        setEnvDimmed(false);
      }, 160);

      setT(() => {
        root.classList.remove('bs-transit');
        applyMode();
        camTo('hero');
        let back = 0;
        currentWindow.forEach((bi, i) => {
          const bk = bookInstances[bi];
          if (bk !== b) bringBack(bk, i, 0.85 + back++ * 0.1);
          else {
            const slot = SLOTS.hero[i];
            if (slot) setTargets(bk, slot);
          }
        });
        const centerBook = books[currentWindow[1]];
        if (centerBook && typeof centerBook.natureBlend === 'number') {
          setActiveNature(centerBook.natureBlend);
        }
      }, 250);
      setT(() => {
        if (state.mode === 'closing') {
          state.mode = 'hero';
          setUiMode('hero');
          // Forcibly guarantee that all books in the showcase are in pristine front-facing hero state
          bookInstances.forEach((bk) => {
            bk.orbY = 0;
            bk.orbYv = 0;
            bk.orbTarget = 0;
            bk.orbPhase = 'idle';
            bk.orbXs.set(0);
            bk.springs.cover.set(0);
            bk.springs.coverB.set(0);
            bk.springs.drag.set(0);
          });
          state.selected = null;
          setSelectedCfg(null);
        }
      }, 1600);
    }

    const onCloseClick = () => close();
    closeBtnRef.current?.addEventListener('click', onCloseClick);

    // Pointer hand & drag physics
    const ptr = {
      ndcX: 0,
      ndcY: 0,
      cx: 0,
      cy: 0,
      lastX: 0,
      lastY: 0,
      down: false,
      downX: 0,
      downY: 0,
      moved: 0,
      t0: 0,
      type: 'mouse',
      seen: false,
      id: null,
    };
    const isTouch = () => ptr.type === 'touch' || ptr.type === 'pen';
    let dragBook = null;
    let rayBook = null;
    const orbit = { drag: false, dxAcc: 0, dyAcc: 0 };
    const ray = new THREE.Raycaster();
    const tmpV = new THREE.Vector3();

    const canvas = canvasEl;
    const onContextMenu = (e) => e.preventDefault();
    canvas.addEventListener('contextmenu', onContextMenu);

    const onPointerLeave = () => {
      rayBook = null;
      state.pillLock = null;
      state.kbIndex = -1;
    };
    canvas.addEventListener('pointerleave', onPointerLeave);

    const localXY = (e) => {
      const r = root.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onPointerMove = (e) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      const { x: cx, y: cy } = localXY(e);
      const dxN = (cx - ptr.lastX) / dims.w;
      const dyN = (cy - ptr.lastY) / dims.h;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      if (state.mode === 'detail') goldFlakes.push(dxN, dyN);
      if (ptr.down && dragBook) {
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
        dragBook.springs.drag.t = clamp(((ptr.downX - cx) / dims.w) * 3.4, 0, 1.0);
      }
      if (ptr.down && orbit.drag) {
        orbit.dxAcc += dxN;
        orbit.dyAcc += dyN;
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
      }
    };
    canvas.addEventListener('pointermove', onPointerMove);

    const onPointerDown = (e) => {
      if (ptr.id !== null) return;
      root.focus({ preventScroll: true });
      ptr.id = e.pointerId;
      const { x: cx, y: cy } = localXY(e);
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      castRay();
      if (state.mode === 'hero' && rayBook) {
        ptr.down = true;
        dragBook = rayBook;
        ptr.downX = cx;
        ptr.downY = cy;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvas.setPointerCapture(e.pointerId);
      } else if (state.mode === 'detail' && rayBook === state.selected) {
        ptr.down = true;
        orbit.drag = true;
        orbit.dxAcc = 0;
        orbit.dyAcc = 0;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvas.setPointerCapture(e.pointerId);
      } else {
        state.pillLock = null;
        state.kbIndex = -1;
      }
    };
    canvas.addEventListener('pointerdown', onPointerDown);

    const onPointerUp = (e) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      orbit.drag = false;
      if (dragBook) {
        const slop = isTouch() ? 26 : 14;
        const limit = isTouch() ? 650 : 450;
        const wasDrag = ptr.moved > slop;
        dragBook.springs.drag.t = 0;
        if (!wasDrag && state.mode === 'hero' && performance.now() - ptr.t0 < limit) open(dragBook);
        dragBook = null;
      }
      ptr.down = false;
      if (isTouch()) rayBook = null;
    };
    window.addEventListener('pointerup', onPointerUp);

    const cancelPointer = (e) => {
      if (e && ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      ptr.down = false;
      orbit.drag = false;
      if (dragBook) {
        dragBook.springs.drag.t = 0;
        dragBook = null;
      }
      if (isTouch()) rayBook = null;
    };
    window.addEventListener('pointercancel', cancelPointer);
    canvas.addEventListener('lostpointercapture', cancelPointer);

    const onKeydown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName) || e.target?.isContentEditable) return;
      if (e.key === 'Escape' && state.mode === 'detail') {
        close();
        return;
      }
      if (state.mode !== 'hero') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.shiftKey) {
          shiftCarousel(e.key === 'ArrowRight' ? 1 : -1);
        } else {
          const d = e.key === 'ArrowRight' ? 1 : -1;
          state.kbIndex = ((state.kbIndex < 0 ? (d > 0 ? -1 : 1) : state.kbIndex) + d + VISIBLE) % VISIBLE;
          state.pillLock = null;
        }
        e.preventDefault();
      }
      if (e.key === 'Enter' && state.hovered) open(state.hovered);
    };
    window.addEventListener('keydown', onKeydown);

    function castRay() {
      ray.setFromCamera({ x: ptr.ndcX, y: ptr.ndcY }, camera);
      const hits = ray.intersectObjects(hitMeshes, false);
      if (hits.length) {
        rayBook = bookByHit(hits[0].object);
        const lp = rayBook.hit.worldToLocal(hits[0].point.clone());
        rayBook.hitEdge = clamp((lp.x / 0.9) * 0.5 + 0.5, 0, 1);
      } else {
        rayBook = null;
      }
    }

    // Animation loop with delta clamping
    const idle = RM ? 0 : 1;
    const DETAIL_OPEN_ANGLE = 0.88;
    const DETAIL_OPEN_SWAY = 0.035;

    function screenPos(b) {
      b.root.getWorldPosition(tmpV).project(camera);
      b.scr.x = (tmpV.x * 0.5 + 0.5) * dims.w;
      b.scr.y = (-tmpV.y * 0.5 + 0.5) * dims.h;
    }

    function tickBook(b, dt, t) {
      const s = b.springs;
      const isHov = state.hovered === b;
      const inDetail = state.mode === 'detail' && state.selected === b;
      const orbitActive = state.selected === b && state.mode !== 'hero';

      let activity = 0;
      if (orbitActive) {
        if (orbit.drag && inDetail) {
          const step = orbit.dxAcc * 6.5;
          orbit.dxAcc = 0;
          b.orbY += step;
          b.orbYv = clamp(b.orbYv * 0.5 + (step / Math.max(dt, 0.001)) * 0.5, -14, 14);
          b.orbXs.t = clamp(b.orbXs.t + orbit.dyAcc * 3.2, -0.55, 0.55);
          orbit.dyAcc = 0;
          b.orbPhase = 'drag';
        } else {
          b.orbXs.t = 0;
          if (b.orbPhase === 'drag') {
            if (Math.abs(b.orbYv) > 0.6) b.orbPhase = 'spin';
            else {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          }
          if (b.orbPhase === 'spin') {
            b.orbYv *= Math.exp(-0.9 * dt);
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbYv) < 0.5) {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          } else if (b.orbPhase === 'return') {
            const acc = 28 * (b.orbTarget - b.orbY) - 10 * b.orbYv;
            b.orbYv += acc * dt;
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbTarget - b.orbY) < 0.005 && Math.abs(b.orbYv) < 0.02) {
              b.orbY = b.orbTarget;
              b.orbYv = 0;
              b.orbPhase = 'idle';
            }
          }
        }
        const distRest = Math.abs(b.orbY - Math.round(b.orbY / 6.2832) * 6.2832);
        activity = clamp(Math.abs(b.orbYv) * 1.5 + (orbit.drag ? 1 : 0) + distRest * 2, 0, 1);
      } else {
        // Orbit is NOT active (book is in hero showcase, or returning)
        // Active safety: continuously and smoothly pull orbY and orbYv directly to 0!
        if (b.orbY !== 0 || b.orbYv !== 0 || b.orbPhase !== 'idle') {
          b.orbY += (0 - b.orbY) * Math.min(1.0, dt * 14.0);
          b.orbYv *= Math.max(0, 1.0 - dt * 14.0);
          if (Math.abs(b.orbY) < 0.001) {
            b.orbY = 0;
            b.orbYv = 0;
            b.orbPhase = 'idle';
            b.orbTarget = 0;
          }
        }
        b.orbXs.t = 0;
      }
      b.orbXs.update(dt);

      let coverBase = 0;
      if (inDetail) coverBase = DETAIL_OPEN_ANGLE + Math.sin(t * 0.8 + b.phase) * DETAIL_OPEN_SWAY * idle;
      const fan = orbitActive ? clamp(b.orbYv * 0.16, 0, 0.75) : 0;
      const fanB = orbitActive ? clamp(-b.orbYv * 0.16, 0, 0.75) : 0;
      let coverBBase = 0;
      if (inDetail) coverBBase = 0.2 + Math.sin(t * 0.8 + b.phase + 1.7) * 0.02 * idle;

      if (isHov && ptr.seen && state.mode === 'hero') {
        const dxN = (ptr.cx - b.scr.x) / (dims.w * 0.25);
        const dyN = (b.scr.y - ptr.cy) / (dims.h * 0.3);
        s.tiltY.t = clamp(dxN * 0.28, -0.15, 0.15);
        s.tiltX.t = clamp(-dyN * 0.1, -0.09, 0.1);
        s.lift.t = 0.3;
        coverBase = 0;
      } else {
        s.tiltY.t = 0;
        s.tiltX.t = 0;
        s.lift.t = 0;
      }
      s.cover.t = coverBase + fan;
      s.coverB.t = coverBBase + fanB;
      s.sc.t = b.slotScale * (isHov && state.mode === 'hero' ? 1.09 : 1);

      s.px.update(dt);
      if (b.exit) stepY(b, dt);
      else s.py.update(dt);
      s.pz.update(dt);
      s.rx.update(dt);
      s.ry.update(dt);
      s.rz.update(dt);
      s.sc.update(dt);
      s.tiltX.update(dt);
      s.tiltY.update(dt);
      s.lift.update(dt);
      s.cover.update(dt);
      s.coverB.update(dt);
      s.drag.update(dt);

      b.float.position.y = Math.sin(t * 0.7 + b.phase) * 0.035 * idle;
      b.float.rotation.z = Math.sin(t * 0.9 + b.phase * 1.7) * 0.006 * idle;

      b.root.position.set(s.px.v, s.py.v, s.pz.v + s.lift.v);
      const sway = inDetail ? Math.sin(t * 0.45 + b.phase) * 0.035 * idle * (1 - activity) : 0;
      const swing = clamp(-s.px.vel * 0.12, -0.5, 0.5);
      b.root.rotation.set(s.rx.v + s.tiltX.v + b.orbXs.v, s.ry.v + s.tiltY.v + b.orbY + sway + swing, s.rz.v);
      b.root.scale.setScalar(Math.max(s.sc.v, 0.001));

      const ang = Math.max(0, s.cover.v + s.drag.v);
      const angB = Math.max(0, s.coverB.v);
      b.pivot.rotation.y = -ang;
      b.pivot.position.z = PIVOT_Z + ang * 0.022;
      b.backPivot.rotation.y = angB;
      b.backPivot.position.z = BPIVOT_Z - angB * 0.022;
      b.spine.rotation.y = -ang * 0.16 + angB * 0.16;
      b.block.scale.z = 1 - (ang + angB) * 0.05;
      b.block.position.z = BLOCK_Z - ang * 0.006 + angB * 0.006;
      const isFrontOpen = ang > 0.015;
      for (let i = 0; i < PAGE_N; i++) {
        b.pages[i].visible = isFrontOpen;
        if (isFrontOpen) {
          const fl = (inDetail ? idle : 0) * Math.sin(t * 1.15 + b.phase + i * 0.6) * 0.003 * (1 - i / PAGE_N);
          b.pages[i].rotation.y = -(ang * b.pageF[i] + Math.max(0, fl));
        }
      }
      const isBackOpen = angB > 0.015;
      for (let i = 0; i < BACK_PAGE_N; i++) {
        b.pagesB[i].visible = isBackOpen;
        if (isBackOpen) {
          b.pagesB[i].rotation.y = angB * b.pageFB[i];
        }
      }
    }

    let rafId = 0;
    let isInViewport = true;
    let lastClockTime = performance.now();
    const animStartTime = performance.now();
    let prevHoveredBook = null;

    function animate(timestamp = performance.now()) {
      if (cancelled || !isInViewport || document.hidden) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);

      const dt = Math.min(Math.max(0.001, (timestamp - lastClockTime) * 0.001), 0.05);
      lastClockTime = timestamp;
      const t = (timestamp - animStartTime) * 0.001;

      if (ptr.seen && (ptr.type === 'mouse' || ptr.down)) castRay();
      let hov = null;
      if (state.mode === 'hero') {
        const kb = state.kbIndex >= 0 ? bookInstances[currentWindow[state.kbIndex]] : null;
        hov = rayBook || state.pillLock || kb || null;
      } else if (state.mode === 'detail') {
        hov = rayBook === state.selected ? rayBook : null;
      }
      if (state.mode === 'hero' && hov && hov !== prevHoveredBook && ptr.type !== 'touch' && !ptr.down) {
        soundManager.play('hover');
      }
      prevHoveredBook = hov;
      state.hovered = hov;
      let cur = 'default';
      if (state.mode === 'hero' && hov) cur = 'pointer';
      else if (state.mode === 'detail' && state.selected) {
        if (orbit.drag) cur = 'grabbing';
        else if (rayBook === state.selected) cur = 'grab';
      }
      canvas.style.cursor = cur;
      canvas.dataset.cursor = cur;

      bookInstances.forEach((b) => screenPos(b));
      bookInstances.forEach((b) => tickBook(b, dt, t));
      goldFlakes.update(dt, t);

      parX.t = RM ? 0 : ptr.ndcX * 0.02;
      parY.t = RM ? 0 : -ptr.ndcY * 0.012;
      bookRoot.rotation.y = parX.update(dt);
      bookRoot.rotation.x = parY.update(dt);

      // Natural subtle plinth parallax shift
      landscapeRoot.position.x = -parX.v * 1.2;
      landscapeRoot.position.y = parY.v * 0.4;

      // Smooth gradual fade for fog and lighting in detail view (cinematic ~1.2s fade)
      const isDetailEnv = state.mode === 'opening' || state.mode === 'detail';
      const targetFogHex = isDetailEnv ? 0xD0C8BD : 0xF6F2EB;
      scene.fog.color.lerp(new THREE.Color(targetFogHex), Math.min(1.0, dt * 1.8));
      scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, isDetailEnv ? 0.0072 : 0.005, Math.min(1.0, dt * 1.8));
      hemi.intensity = THREE.MathUtils.lerp(hemi.intensity, isDetailEnv ? 0.42 : 0.52, Math.min(1.0, dt * 1.8));
      key.intensity = THREE.MathUtils.lerp(key.intensity, isDetailEnv ? 0.84 : 0.96, Math.min(1.0, dt * 1.8));

      // Cinematic spotlight dynamically tracking the inspected volume
      if (state.selected) {
        detailSpot.target.position.copy(state.selected.root.position);
      }
      if (SLOTS.portrait) {
        detailSpot.position.set(0, 3.8, 5.0);
      } else {
        detailSpot.position.set(-2.7, 4.2, 5.0);
      }
      detailSpot.intensity = THREE.MathUtils.lerp(
        detailSpot.intensity,
        isDetailEnv ? (SLOTS.portrait ? 2.2 : 2.6) : 0.0,
        Math.min(1.0, dt * 2.2)
      );

      camera.position.set(camX.update(dt), camY.update(dt), camZ.update(dt));
      camera.lookAt(lookX.update(dt), lookY.update(dt), 0);

      if (state.mode === 'hero' && state.hovered && ptr.seen && !isTouch() && !(ptr.down && ptr.moved > 14)) {
        const tx = ptr.cx;
        const ty = ptr.cy + 34;
        if (!pillOn) {
          pillX.set(tx);
          pillY.set(ty);
        }
        pillX.t = tx;
        pillY.t = ty;
        if (openBtnRef.current) {
          openBtnRef.current.style.left = pillX.update(dt) + 'px';
          openBtnRef.current.style.top = pillY.update(dt) + 'px';
        }
        if (!pillOn) showPill();
      } else {
        hidePill();
      }

      renderer.render(scene, camera);
    }

    function resumeAnimation() {
      if (!rafId && !cancelled && isInViewport && !document.hidden) animate();
    }

    function relayout() {
      const r = root.getBoundingClientRect();
      dims.w = root.offsetWidth || Math.max(1, Math.round(r.width));
      dims.h = root.offsetHeight || Math.max(1, Math.round(r.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
      renderer.setSize(dims.w, dims.h);
      camera.aspect = dims.w / dims.h;
      camera.updateProjectionMatrix();
      computeSlots();
      applyMode();
      camTo(state.mode === 'detail' || state.mode === 'opening' ? 'detail' : 'hero');
    }

    relayout();
    currentWindow.forEach((bi, i) => {
      const b = bookInstances[bi];
      const slot = SLOTS.hero[i];
      const s = b.springs;
      s.px.set(slot.p[0]);
      s.py.set(slot.p[1] - 3.9);
      s.pz.set(slot.p[2]);
      s.rx.set(slot.r[0]);
      s.ry.set(slot.r[1]);
      s.rz.set(slot.r[2] + 0.35 * (i === 1 ? -1 : Math.sign(slot.p[0])));
      s.sc.set(slot.s);
      b.slotScale = slot.s;
      setT(() => setTargets(b, slot), 240 + i * 150);
    });
    bookInstances.forEach((b, idx) => {
      if (!currentWindow.includes(idx)) b.root.visible = false;
    });
    rebuildHitMeshes();
    camTo('hero');
    animate();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) resumeAnimation();
        else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '160px' },
    );
    visibilityObserver.observe(root);

    const onVisibilityChange = () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        resumeAnimation();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onWindowResize = () => relayout();
    let orientationTimeout = null;
    const onOrientation = () => {
      relayout();
      orientationTimeout = setT(relayout, 250);
    };
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', onOrientation);
    let visualViewportHandler = null;
    if (window.visualViewport) {
      visualViewportHandler = () => relayout();
      window.visualViewport.addEventListener('resize', visualViewportHandler);
    }
    const ro = new ResizeObserver(() => relayout());
    ro.observe(root);

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      timeouts.forEach((id) => clearTimeout(id));
      if (orientationTimeout) clearTimeout(orientationTimeout);

      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      ro.disconnect();
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('orientationchange', onOrientation);
      if (visualViewportHandler && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', visualViewportHandler);
      }
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', cancelPointer);
      window.removeEventListener('keydown', onKeydown);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('lostpointercapture', cancelPointer);
      closeBtnRef.current?.removeEventListener('click', onCloseClick);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => {
              if (v && v.isTexture) v.dispose();
            });
            m.dispose();
          });
        }
      });
      scene.environment?.dispose();
      scene.environment = null;
      renderer.dispose();
    };
  }, [books, showDetailPanel]);

  // Luxury Atelier Color Palette Tokens
  const themeVars = {
    '--bs-bg-light': themeColors?.bgLight ?? themeColors?.bg ?? '#FBF9F5',
    '--bs-fg-light': themeColors?.foregroundLight ?? '#151413',
    '--bs-dark': '#131211',
    '--bs-cream': '#FAF8F5',
    '--bs-gold': '#DFBA5A',
    '--bs-ochre': '#C79238',
    '--bs-sienna': '#B85032',
    '--bs-muted': '#9E978E',
    '--bs-border': 'rgba(21, 20, 19, 0.08)',
  };

  const panelVisible = uiMode === 'detail';
  const heroWordVisible = mounted && uiMode === 'hero';
  const canCarousel = showCarousel && books.length > 3;

  const delayMap = {
    50: 'delay-[50ms]',
    130: 'delay-[130ms]',
    210: 'delay-[210ms]',
    270: 'delay-[270ms]',
    330: 'delay-[330ms]',
  };

  const dpChild = (delayMs) =>
    panelVisible
      ? `opacity-100 translate-y-0 transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${delayMap[delayMs] || ''}`
      : 'opacity-0 translate-y-[28px] transition-[opacity,transform] duration-[280ms] ease-out';

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-label={`${heroTitle} publication showcase`}
      data-state={uiMode}
      className={cn(
        'book-showcase relative isolate w-full h-[100svh] min-h-[700px] overflow-hidden outline-none [container-type:size] select-none [-webkit-tap-highlight-color:transparent]',
        'transition-colors duration-700 ease-out text-[#151413]',
        className,
      )}
      style={themeVars}
    >
      {/* Dynamic 2D Nature Shader: Fluid Physics, Nature Landscapes & Cursor Reveal */}
      <NatureBackgroundShader
        isDetail={envDimmed}
        activeNature={activeNature}
        className="z-[0]"
      />

      {/* Cinematic Glow Spotlight behind the Book in Final Detail Position (Desktop) */}
      <div
        className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          envDimmed ? 'opacity-100' : 'opacity-0'
        } max-md:hidden`}
        style={{
          background:
            'radial-gradient(ellipse 52vw 58vh at 27% 48%, rgba(255, 238, 185, 0.48) 0%, rgba(223, 186, 90, 0.24) 32%, rgba(199, 146, 56, 0.08) 58%, transparent 76%)',
        }}
      />
      {/* Mobile Cinematic Glow Spotlight (Upper Center) */}
      <div
        className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          envDimmed ? 'opacity-100' : 'opacity-0'
        } md:hidden`}
        style={{
          background:
            'radial-gradient(ellipse 92vw 46vh at 50% 28%, rgba(255, 238, 185, 0.48) 0%, rgba(223, 186, 90, 0.24) 32%, rgba(199, 146, 56, 0.08) 58%, transparent 76%)',
        }}
      />

      {/* Atmospheric Dimming Archival Vignette for Detail View (1.2s Cinematic Fade) */}
      <div
        className={`pointer-events-none absolute inset-0 z-[1] transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          envDimmed
            ? 'opacity-100'
            : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(24, 20, 17, 0.18) 0%, rgba(12, 10, 8, 0.46) 100%)',
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
        }}
      />

      {/* Background Architectural Word: 'Projects' (Positioned lower and significantly bigger) */}
      <div
        className={`pointer-events-none absolute left-1/2 top-[8%] xs:top-[9%] sm:top-[11%] md:top-[12%] lg:top-[13%] z-[2] -translate-x-1/2 select-none transition-all duration-700 ease-out w-full max-w-[100vw] text-center px-2 sm:px-4 overflow-hidden ${
          heroWordVisible ? 'translate-y-0 opacity-100' : uiMode === 'hero' ? 'translate-y-[40px] opacity-0' : '-translate-y-12 opacity-0'
        }`}
      >
        <span
          className={cn(
            'inline-block whitespace-nowrap font-bodoni font-light leading-[0.82] transition-colors duration-700',
            'text-[clamp(4.6rem,22vw,24rem)] sm:text-[clamp(5.6rem,23.5vw,26rem)] lg:text-[clamp(6.2rem,25vw,28.5rem)]',
            'tracking-[0.015em] sm:tracking-[0.035em] md:tracking-[0.05em]',
            'text-[#151413]/[0.32] drop-shadow-[0_1px_2px_rgba(255,255,255,0.90)] drop-shadow-[0_2px_10px_rgba(21,20,19,0.08)]',
          )}
        >
          {heroTitle}
        </span>
      </div>

      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-[3] block h-full w-full touch-none" />

      {books.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8 text-center text-sm text-current opacity-60">
          No monograph publications loaded.
        </div>
      )}

      {/* Carousel Prev / Next Controls - Pure Artisanal Washi Deckled Seals (No Text) */}
      {canCarousel && (
        <>
          <button
            type="button"
            data-sfx="drag"
            aria-label="Previous monograph publication"
            onClick={() => shiftCarouselRef.current(-1)}
            className={`group cursor-pointer absolute left-3 sm:left-6 md:left-8 top-1/2 z-30 -translate-y-1/2 inline-flex items-center justify-center w-11 h-9 sm:w-14 sm:h-12 -rotate-2 hover:rotate-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95 [-webkit-tap-highlight-color:transparent] [clip-path:polygon(0%_8%,3%_1.5%,11%_4.5%,21%_1%,34%_3%,48%_0.8%,62%_3%,76%_1.2%,88%_3.5%,97%_1%,100%_8%,98%_24%,100%_42%,97.5%_56%,99.5%_72%,97%_86%,100%_94%,94%_99%,82%_97%,68%_99.5%,52%_97.5%,38%_99.5%,24%_97%,12%_99%,3%_96%,0%_92%,2.5%_76%,0.8%_58%,2.8%_42%,1.2%_26%,2.5%_12%)] [background:repeating-linear-gradient(118deg,rgba(199,146,56,0.04)_0px_2px,transparent_2px_7px),radial-gradient(130%_150%_at_30%_20%,#FFFDF9_0%,#F6EFE3_58%,#EBDDC4_100%)] [filter:drop-shadow(0_2px_3px_rgba(21,20,19,0.12))_drop-shadow(0_10px_22px_rgba(21,20,19,0.16))] hover:[filter:drop-shadow(0_3px_5px_rgba(21,20,19,0.15))_drop-shadow(0_14px_30px_rgba(199,146,56,0.30))] border border-[#C79238]/35 ${
              uiMode === 'hero' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {/* Calligraphic Artisanal Quill Arrow */}
            <svg
              viewBox="0 0 32 16"
              fill="none"
              className="h-4 w-7 text-[#151413] transition-all duration-300 group-hover:text-[#C79238] group-hover:-translate-x-1"
            >
              <path d="M28 8H4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              <path d="M10 3.5L3.5 8l6.5 4.5" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="28" cy="8" r="1.5" fill="#C79238" />
            </svg>
          </button>

          <button
            type="button"
            data-sfx="drag"
            aria-label="Next monograph publication"
            onClick={() => shiftCarouselRef.current(1)}
            className={`group cursor-pointer absolute right-3 sm:right-6 md:right-8 top-1/2 z-30 -translate-y-1/2 inline-flex items-center justify-center w-11 h-9 sm:w-14 sm:h-12 rotate-2 hover:rotate-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95 [-webkit-tap-highlight-color:transparent] [clip-path:polygon(0%_8%,3%_1.5%,11%_4.5%,21%_1%,34%_3%,48%_0.8%,62%_3%,76%_1.2%,88%_3.5%,97%_1%,100%_8%,98%_24%,100%_42%,97.5%_56%,99.5%_72%,97%_86%,100%_94%,94%_99%,82%_97%,68%_99.5%,52%_97.5%,38%_99.5%,24%_97%,12%_99%,3%_96%,0%_92%,2.5%_76%,0.8%_58%,2.8%_42%,1.2%_26%,2.5%_12%)] [background:repeating-linear-gradient(118deg,rgba(199,146,56,0.04)_0px_2px,transparent_2px_7px),radial-gradient(130%_150%_at_30%_20%,#FFFDF9_0%,#F6EFE3_58%,#EBDDC4_100%)] [filter:drop-shadow(0_2px_3px_rgba(21,20,19,0.12))_drop-shadow(0_10px_22px_rgba(21,20,19,0.16))] hover:[filter:drop-shadow(0_3px_5px_rgba(21,20,19,0.15))_drop-shadow(0_14px_30px_rgba(199,146,56,0.30))] border border-[#C79238]/35 ${
              uiMode === 'hero' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            {/* Calligraphic Artisanal Quill Arrow */}
            <svg
              viewBox="0 0 32 16"
              fill="none"
              className="h-4 w-7 text-[#151413] transition-all duration-300 group-hover:text-[#C79238] group-hover:translate-x-1"
            >
              <path d="M4 8h24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              <path d="M22 3.5L28.5 8l-6.5 4.5" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="4" cy="8" r="1.5" fill="#C79238" />
            </svg>
          </button>
        </>
      )}

      {/* Top Subtle Atelier Navigation Hint towards Hero Section */}
      {uiMode === 'hero' && onNavigateBack && (
        <button
          type="button"
          onClick={() => {
            soundManager.play('hold');
            onNavigateBack();
          }}
          className="group cursor-pointer absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-all duration-300 pointer-events-auto select-none"
        >
          <svg
            className="w-3.5 h-3.5 text-[#151413]/60 group-hover:text-[#C79238] transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M17 11l-5-5-5 5M17 18l-5-5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.24em] uppercase text-[#151413]/70 group-hover:text-[#C79238] transition-colors">
            Atelier · Return
          </span>
        </button>
      )}

      {/* Trailing Open Pill (Deckled Japanese Washi Rag Paper Slip) */}
      <button
        ref={openBtnRef}
        data-sfx="pageTurn"
        tabIndex={-1}
        aria-hidden="true"
        className={
          'absolute left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2 rotate-[-1.5deg] px-[36px] pb-[16px] pt-[14px] ' +
          'font-cinzel text-[13px] font-semibold uppercase tracking-[0.18em] text-[#151413] pointer-events-none ' +
          'transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[left,top,opacity,transform] ' +
          '[clip-path:polygon(0%_1%,8%_0.8%,16%_5.5%,25%_3%,33%_5%,42%_2.5%,50%_4.8%,58%_0.5%,66%_5.5%,75%_6%,83%_1.2%,92%_6%,100%_0.8%,98%_20%,97%_40%,99.5%_60%,98.5%_80%,100%_96.5%,92%_99.5%,83%_95.5%,75%_95%,67%_96.5%,58%_93.5%,50%_98%,42%_99.5%,33%_93.5%,25%_94%,17%_93.5%,8%_93%,0%_94%,0.4%_80%,1.2%_60%,3.8%_40%,3.5%_20%)] ' +
          '[background:repeating-linear-gradient(92deg,rgba(199,146,56,0.04)_0px_2px,transparent_2px_6px),radial-gradient(125%_150%_at_28%_0%,#FFFDF8_0%,#F8F3E8_58%,#EDE3CE_100%)] ' +
          '[filter:drop-shadow(0_2px_2px_rgba(21,20,19,0.18))_drop-shadow(0_12px_24px_rgba(21,20,19,0.28))] ' +
          OPEN_BTN_OFF.join(' ')
        }
      >
        Inspect
      </button>

      {/* Close Detail View Button (Archival Light Honey Washi Seal with Gold Trim) */}
      <button
        ref={closeBtnRef}
        type="button"
        aria-label="Return to archive view"
        className={`group cursor-pointer absolute left-1/2 top-7 z-40 -translate-x-1/2 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rotate-1 hover:rotate-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95 [-webkit-tap-highlight-color:transparent]
        [clip-path:polygon(4%_12%,12%_4%,25%_6%,38%_2%,50%_5%,62%_2%,75%_6%,88%_4%,96%_12%,98%_25%,95%_38%,99%_50%,95%_62%,98%_75%,96%_88%,88%_96%,75%_94%,62%_98%,50%_95%,38%_98%,25%_94%,12%_96%,4%_88%,2%_75%,5%_62%,1%_50%,5%_38%,2%_25%)]
        [background:repeating-linear-gradient(118deg,rgba(199,146,56,0.06)_0px_2px,transparent_2px_7px),radial-gradient(130%_150%_at_30%_20%,#F8F2E4_0%,#EFE4CF_58%,#E2D0B5_100%)]
        border-2 border-[#C79238]/60
        [filter:drop-shadow(0_2px_5px_rgba(21,20,19,0.18))_drop-shadow(0_10px_24px_rgba(21,20,19,0.20))]
        hover:[filter:drop-shadow(0_4px_8px_rgba(21,20,19,0.22))_drop-shadow(0_14px_32px_rgba(199,146,56,0.38))]
        hover:border-[#DFBA5A]
        max-md:left-auto max-md:right-5 max-md:top-5 max-md:translate-x-0 ${
          uiMode === 'detail' ? 'pointer-events-auto opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-90'
        }`}
      >
        {/* Calligraphic Antique Cross with Venetian Gold Central Pip */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 text-[#1C1712] transition-all duration-300 group-hover:text-[#C79238] group-hover:rotate-90"
        >
          <path
            d="M6.5 6.5L17.5 17.5M6.5 17.5L17.5 6.5"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="1.6" fill="#C79238" />
        </svg>
      </button>

      {/* Archival Detail Panel (Curatorial Project Dossier) */}
      {showDetailPanel && (
        <div
          ref={dpRef}
          aria-live="polite"
          className={`absolute z-[15] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            panelVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none delay-[300ms]'
          } max-md:left-1/2 max-md:right-auto max-md:top-auto max-md:bottom-12 max-md:-translate-x-1/2 max-md:translate-y-0 max-md:w-[min(540px,90vw)] max-md:overflow-visible no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 max-md:p-0 max-md:pointer-events-auto md:right-[5%] lg:right-[7%] xl:right-[9%] md:top-1/2 md:-translate-y-1/2 md:w-[min(540px,44%)] md:pointer-events-none`}
        >
          {/* 1. Project Title (Luminous Warm Ivory & Venetian Gold Depth) */}
          <h2
            className={`font-bodoni font-light text-[#FDFBF7] text-[clamp(32px,4.4vw,66px)] leading-[0.98] tracking-[-0.025em] drop-shadow-[0_2px_14px_rgba(223,186,90,0.25)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] ${dpChild(50)}`}
          >
            {selectedCfg?.title}
          </h2>

          {/* 2. Project Description (Warm Archival Linen Tone) */}
          <p
            className={`mt-3.5 sm:mt-5 max-w-[52ch] font-sans font-normal text-[#E2DACB] text-[clamp(14px,1.08vw,16.5px)] leading-[1.74] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] ${dpChild(130)}`}
          >
            {selectedCfg?.desc}
          </p>

          {/* 3. Major Technologies Used (Light Warm Honey/Vellum Specimen Tags) */}
          <div className={`mt-5 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3 pointer-events-auto ${dpChild(210)}`}>
            {(selectedCfg?.tech || ['Three.js', 'WebGL', 'GLSL Shaders', 'React', 'Tailwind CSS']).map((techItem) => (
              <span
                key={techItem}
                className="group/tag inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-[#C79238]/50 [background:repeating-linear-gradient(115deg,rgba(199,146,56,0.06)_0px_1.5px,transparent_1.5px_6px),radial-gradient(130%_140%_at_25%_20%,#F7F1E4_0%,#ECE1CD_60%,#E0CEB2_100%)] [filter:drop-shadow(0_1.5px_3px_rgba(21,20,19,0.12))] hover:[filter:drop-shadow(0_3px_10px_rgba(199,146,56,0.30))] hover:border-[#C79238]/85 hover:-translate-y-0.5 transition-all duration-300 ease-out"
              >
                {/* Miniature Antique Venetian Gold Star ✦ */}
                <span className="font-serif text-[11px] leading-none text-[#B88228] select-none transition-transform duration-300 group-hover/tag:scale-125">
                  ✦
                </span>
                <span className="font-cinzel text-[11px] sm:text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#262018]">
                  {techItem}
                </span>
              </span>
            ))}
          </div>

          {/* 4. Live Project & Source CTAs (Radiant Venetian Gold Leaf Cartouches) */}
          <div className={`mt-6 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4 ${dpChild(270)}`}>
            <a
              href={selectedCfg?.liveURL || selectedCfg?.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group pointer-events-auto relative inline-flex items-center gap-3 px-7 py-3.5 sm:px-8 sm:py-4 -rotate-1 hover:rotate-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95 [-webkit-tap-highlight-color:transparent]
              [clip-path:polygon(0%_12%,1.8%_4%,5%_6%,12%_1.5%,25%_4%,38%_1%,50%_3.5%,62%_1%,75%_4%,88%_1.5%,95%_5%,98.2%_3%,100%_12%,99%_32%,100%_52%,99%_72%,100%_88%,98.2%_97%,95%_95%,88%_98.5%,75%_96%,62%_99%,50%_96.5%,38%_99%,25%_96%,12%_98.5%,5%_95%,1.8%_97%,0%_88%,1%_70%,0%_50%,1%_30%)]
              [background:repeating-linear-gradient(118deg,rgba(255,255,255,0.10)_0px_2px,transparent_2px_7px),radial-gradient(135%_160%_at_28%_18%,#ECC76F_0%,#D49E38_55%,#B0771E_100%)]
              border-2 border-[#FFE28A]
              [filter:drop-shadow(0_3px_6px_rgba(21,20,19,0.22))_drop-shadow(0_12px_28px_rgba(199,146,56,0.35))]
              hover:border-[#FFF5CC]
              hover:[background:radial-gradient(135%_160%_at_28%_18%,#FFF0BA_0%,#E5B246_55%,#C48B25_100%)]
              hover:[filter:drop-shadow(0_4px_12px_rgba(223,186,90,0.48))_drop-shadow(0_18px_42px_rgba(199,146,56,0.42))]"
            >
              {/* Left Golden Atelier Seal / Ornament */}
              <span className="font-serif text-[15px] text-[#18140E] transition-colors duration-300">
                ❧
              </span>

              {/* Label */}
              <span className="font-cinzel text-[11.5px] sm:text-[12.5px] font-bold tracking-[0.22em] uppercase text-[#18140E] transition-colors duration-300">
                View Repository
              </span>

              {/* Calligraphic Diagonal Arrow */}
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4 text-[#18140E] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
              >
                <path
                  d="M5.5 14.5L14.5 5.5M6.5 5.5h8v8"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="14.5" cy="5.5" r="1.3" fill="currentColor" />
              </svg>
            </a>

            {/* Optional Live Demo / Showcase Link */}
            {selectedCfg?.demoURL && (
              <a
                href={selectedCfg.demoURL}
                target="_blank"
                rel="noopener noreferrer"
                className="group pointer-events-auto relative inline-flex items-center gap-2.5 px-6 py-3.5 sm:px-7 sm:py-4 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95 [-webkit-tap-highlight-color:transparent]
                border border-[#C79238]/60 [background:rgba(21,20,19,0.45)] backdrop-blur-md
                hover:border-[#DFBA5A] hover:bg-[#151413]/70
                [filter:drop-shadow(0_3px_8px_rgba(0,0,0,0.35))]"
              >
                <span className="font-serif text-[12px] text-[#DFBA5A] transition-transform duration-300 group-hover:scale-125">
                  ✦
                </span>
                <span className="font-cinzel text-[11.5px] sm:text-[12px] font-semibold tracking-[0.20em] uppercase text-[#FBF9F5]">
                  Live Demo
                </span>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-3.5 w-3.5 text-[#DFBA5A] transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                >
                  <path
                    d="M5.5 14.5L14.5 5.5M6.5 5.5h8v8"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksShowcase;
