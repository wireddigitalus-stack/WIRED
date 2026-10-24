import React, { useEffect, useRef, useState } from 'react';

// In-memory cache so each logo is processed & auto-cropped only once per mode
const processedCache = new Map();

// Logos in 'color-preserve' that have enclosed white counters inside letters (a, e, o, P, R, B)
// where all near-white pixels should be keyed out rather than only border-connected white
const KEY_ALL_WHITE_IDS = new Set([
  'virgin-music',
  'fantasia',
  'paul-anka',
  'henry-mancini',
  'skid-row'
]);

function processLogoToDataUrl(img, item, mode) {
  const cacheKey = `${item.id}:${mode}:v2`;
  if (processedCache.has(cacheKey)) {
    return processedCache.get(cacheKey);
  }

  const maxDim = 580;
  const naturalW = img.naturalWidth || img.width || 300;
  const naturalH = img.naturalHeight || img.height || 200;
  const scale = Math.min(1, maxDim / Math.max(naturalW, naturalH));
  const w = Math.max(1, Math.round(naturalW * scale));
  const h = Math.max(1, Math.round(naturalH * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  if (mode === 'vault') {
    // Classic Vault Mode: remove near-white background softly, keep original ink colors
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a === 0) continue;
      const minC = Math.min(r, g, b);
      if (minC > 235) {
        const fade = Math.max(0, (252 - minC) / 17);
        data[i + 3] = Math.round(a * fade);
      }
    }
  } else if (item.processMode === 'invert-mono') {
    // Dark Stage Mode for Monochrome Black Logos:
    // White background -> transparent; dark ink -> crisp stage white (#F6F6F2)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 10) {
        data[i + 3] = 0;
        continue;
      }
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 238) {
        data[i + 3] = 0;
      } else {
        const darkness = Math.min(1, Math.max(0, (240 - lum) / 215));
        const newAlpha = Math.min(255, Math.round(a * Math.pow(darkness, 0.65)));
        data[i] = 248;
        data[i + 1] = 248;
        data[i + 2] = 244;
        data[i + 3] = newAlpha;
      }
    }
  } else if (item.processMode === 'dual-tone') {
    // Dark Stage Mode for Dual-Tone Logos (Full Devil Jacket, Scorpions, Sony Music, Olivia Newton-John, Primary Wave Home of Legends):
    // 1. Remove white background
    // 2. Keep saturated colors (red, yellow, coral, gold) vibrant
    // 3. Lift dark low-saturation text/emblems to crisp stage white
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 10) {
        data[i + 3] = 0;
        continue;
      }
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const chroma = maxC - minC;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Key out white/near-white background
      if (minC > 228 && chroma < 30) {
        const fade = Math.max(0, (245 - minC) / 17);
        data[i + 3] = Math.round(a * fade);
        if (data[i + 3] < 12) {
          data[i + 3] = 0;
          continue;
        }
      }

      // If pixel is dark and unsaturated (black text or black scorpion), lift to stage white
      if (chroma < 45 && lum < 175) {
        const darkness = Math.min(1, Math.max(0, (185 - lum) / 165));
        data[i] = 248;
        data[i + 1] = 248;
        data[i + 2] = 244;
        data[i + 3] = Math.min(255, Math.round(a * Math.max(0.45, darkness)));
      }
    }
  } else if (item.processMode === 'color-preserve') {
    // Dark Stage Mode for Full-Color Emblems (Def Leppard, KISS, Sun Records, Tesla, RATT, Extreme, PW, eOne)
    if (KEY_ALL_WHITE_IDS.has(item.id)) {
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 10) continue;
        const minC = Math.min(r, g, b);
        const maxC = Math.max(r, g, b);
        if (minC > 222 && maxC - minC < 32) {
          const fade = Math.max(0, (244 - minC) / 22);
          data[i + 3] = Math.round(a * fade);
        }
      }
    } else {
      // Flood-fill from outer borders so enclosed white (Tesla letters, PW circle, KISS/RATT inner borders) stays intact
      const total = w * h;
      const visited = new Uint8Array(total);
      const queue = new Int32Array(total);
      let head = 0;
      let tail = 0;

      const isOuterWhite = (idx) => {
        const p = idx * 4;
        const a = data[p + 3];
        if (a < 20) return true;
        const r = data[p];
        const g = data[p + 1];
        const b = data[p + 2];
        const minC = Math.min(r, g, b);
        const maxC = Math.max(r, g, b);
        return minC > 224 && maxC - minC < 30;
      };

      for (let x = 0; x < w; x++) {
        const topIdx = x;
        const botIdx = (h - 1) * w + x;
        if (isOuterWhite(topIdx) && !visited[topIdx]) {
          visited[topIdx] = 1;
          queue[tail++] = topIdx;
        }
        if (isOuterWhite(botIdx) && !visited[botIdx]) {
          visited[botIdx] = 1;
          queue[tail++] = botIdx;
        }
      }
      for (let y = 0; y < h; y++) {
        const leftIdx = y * w;
        const rightIdx = y * w + (w - 1);
        if (isOuterWhite(leftIdx) && !visited[leftIdx]) {
          visited[leftIdx] = 1;
          queue[tail++] = leftIdx;
        }
        if (isOuterWhite(rightIdx) && !visited[rightIdx]) {
          visited[rightIdx] = 1;
          queue[tail++] = rightIdx;
        }
      }

      while (head < tail) {
        const curr = queue[head++];
        const p = curr * 4;
        data[p + 3] = 0;

        const cx = curr % w;
        const cy = (curr - cx) / w;

        const neighbors = [];
        if (cx > 0) neighbors.push(curr - 1);
        if (cx < w - 1) neighbors.push(curr + 1);
        if (cy > 0) neighbors.push(curr - w);
        if (cy < h - 1) neighbors.push(curr + w);

        for (let n = 0; n < neighbors.length; n++) {
          const ni = neighbors[n];
          if (!visited[ni]) {
            if (isOuterWhite(ni)) {
              visited[ni] = 1;
              queue[tail++] = ni;
            } else {
              const np = ni * 4;
              const minC = Math.min(data[np], data[np + 1], data[np + 2]);
              const maxC = Math.max(data[np], data[np + 1], data[np + 2]);
              if (minC > 195 && maxC - minC < 35) {
                const factor = Math.max(0.15, (228 - minC) / 35);
                data[np + 3] = Math.round(data[np + 3] * factor);
              }
            }
          }
        }
      }
    }

    // Special brightness boost for Primary Wave navy mark in Dark Stage so it pops vividly
    if (item.id === 'primary-wave' && mode === 'dark') {
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 25 && data[i + 2] > data[i]) {
          data[i] = Math.min(255, data[i] + 55);
          data[i + 1] = Math.min(255, data[i + 1] + 95);
          data[i + 2] = Math.min(255, data[i + 2] + 115);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // ==========================================================================
  // AUTO-CROP TIGHT BOUNDING BOX (Removes all dead outer whitespace/padding)
  // ==========================================================================
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  const isVisible = (x, y) => data[(y * w + x) * 4 + 3] > 36;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!isVisible(x, y)) continue;
      // Require at least 2 visible neighbors in 3x3 to ignore stray JPEG dust specks
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          if (nx >= 0 && nx < w && isVisible(nx, ny)) {
            count++;
          }
        }
      }
      if (count >= 2) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX > minX && maxY > minY) {
    // Apply optional per-logo edge trim (e.g. to crop extreme protruding spikes or tiny copyright marks)
    const rawW = maxX - minX + 1;
    const rawH = maxY - minY + 1;
    const trim = item.trim || { top: 0, right: 0, bottom: 0, left: 0 };

    const sx = Math.max(0, Math.round(minX + rawW * (trim.left || 0)) - 2);
    const sy = Math.max(0, Math.round(minY + rawH * (trim.top || 0)) - 2);
    const ex = Math.min(w, Math.round(maxX - rawW * (trim.right || 0)) + 2);
    const ey = Math.min(h, Math.round(maxY - rawH * (trim.bottom || 0)) + 2);

    const cropW = Math.max(1, ex - sx);
    const cropH = Math.max(1, ey - sy);

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropW;
    croppedCanvas.height = cropH;
    const croppedCtx = croppedCanvas.getContext('2d');
    croppedCtx.drawImage(canvas, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

    const url = croppedCanvas.toDataURL('image/png');
    processedCache.set(cacheKey, url);
    return url;
  }

  const url = canvas.toDataURL('image/png');
  processedCache.set(cacheKey, url);
  return url;
}

export default function SmartLogo({ item, mode = 'dark', className = '' }) {
  const cacheKey = `${item.id}:${mode}:v2`;
  const [renderedSrc, setRenderedSrc] = useState(() => processedCache.get(cacheKey) || null);
  const [shouldProcess, setShouldProcess] = useState(() => processedCache.has(cacheKey));
  const imgRef = useRef(null);

  useEffect(() => {
    if (processedCache.has(cacheKey)) {
      setRenderedSrc(processedCache.get(cacheKey));
      setShouldProcess(true);
      return;
    }
    if (shouldProcess) return;

    const el = imgRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldProcess(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldProcess(true);
          observer.disconnect();
        }
      },
      { rootMargin: '550px 0px' }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [cacheKey, shouldProcess]);

  useEffect(() => {
    if (!shouldProcess || !item.src || item.processMode === 'svg-custom') return;

    if (processedCache.has(cacheKey)) {
      setRenderedSrc(processedCache.get(cacheKey));
      return;
    }

    if (item.src.endsWith('.svg')) {
      setRenderedSrc(item.src);
      return;
    }

    let isMounted = true;
    let idleHandle = null;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      if (!isMounted) return;
      const runProcess = () => {
        if (!isMounted) return;
        try {
          const dataUrl = processLogoToDataUrl(img, item, mode);
          setRenderedSrc(dataUrl);
        } catch {
          setRenderedSrc(item.src);
        }
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(runProcess, { timeout: 250 });
      } else {
        idleHandle = setTimeout(runProcess, 0);
      }
    };
    img.onerror = () => {
      if (isMounted) setRenderedSrc(item.src);
    };
    img.src = item.src;

    return () => {
      isMounted = false;
      if (idleHandle !== null) {
        if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleHandle);
        } else {
          clearTimeout(idleHandle);
        }
      }
    };
  }, [shouldProcess, item, mode, cacheKey]);

  const customScale = item.scale || 1;

  // Custom Vector SVG for "The Legendary Count Basie Orchestra" (tightly cropped viewBox)
  if (item.processMode === 'svg-custom') {
    const fg = mode === 'dark' ? '#F6F6F2' : '#0A0A0A';
    const keyBg = mode === 'dark' ? '#0A0A0A' : '#FFFFFF';
    return (
      <svg
        viewBox="6 10 236 78"
        className={`smart-logo-svg ${className}`}
        style={customScale !== 1 ? { transform: `scale(${customScale})` } : undefined}
        role="img"
        aria-label={item.name}
      >
        <g transform="translate(8, 12)">
          <path
            d="M0,0 H42 C58,0 68,8 68,19 C68,27 62,33 53,35 C64,37 72,44 72,54 C72,66 60,74 42,74 H0 Z"
            fill={fg}
          />
          <rect x="4" y="6" width="16" height="9" fill={keyBg} />
          <rect x="4" y="18" width="16" height="9" fill={keyBg} />
          <rect x="4" y="30" width="16" height="9" fill={keyBg} />
          <rect x="4" y="42" width="16" height="9" fill={keyBg} />
          <rect x="4" y="54" width="16" height="9" fill={keyBg} />
          <rect x="4" y="13" width="10" height="4" fill={fg} />
          <rect x="4" y="25" width="10" height="4" fill={fg} />
          <rect x="4" y="49" width="10" height="4" fill={fg} />
        </g>
        <text
          x="90"
          y="29"
          fill={fg}
          fontFamily="'Anton', 'Impact', sans-serif"
          fontSize="14.5"
          letterSpacing="1.6"
        >
          THE LEGENDARY
        </text>
        <text
          x="90"
          y="56"
          fill={fg}
          fontFamily="'Anton', 'Impact', sans-serif"
          fontSize="27.5"
          letterSpacing="1.2"
        >
          COUNT BASIE
        </text>
        <text
          x="90"
          y="82"
          fill={fg}
          fontFamily="'Anton', 'Impact', sans-serif"
          fontSize="24.5"
          letterSpacing="1.8"
        >
          ORCHESTRA
        </text>
      </svg>
    );
  }

  const isSvg = item.src && item.src.endsWith('.svg');

  return (
    <img
      ref={imgRef}
      src={renderedSrc || item.src}
      alt={item.name}
      loading="lazy"
      decoding="async"
      style={customScale !== 1 ? { transform: `scale(${customScale})` } : undefined}
      className={`smart-logo-img ${isSvg && mode === 'dark' ? 'svg-invert-dark' : ''} ${className}`}
    />
  );
}
