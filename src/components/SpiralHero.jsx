import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Cpu, LayoutDashboard, Film } from 'lucide-react';

/**
 * Generates a clean, smooth, razor-sharp Tim Burton optical swirl ribbon path.
 * No noisy displacement filter on the spiral curves—pure hypnotic geometry!
 */
function buildCleanBurtonSwirlPath(turns = 7.5, innerR = 6, spacing = 132, thickness = 66, steps = 720) {
  const maxTheta = turns * Math.PI * 2;
  const outerPoints = [];
  const innerPoints = [];
  const b = spacing / (Math.PI * 2);

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * maxTheta;
    const rCenter = innerR + b * t;
    // Taper gently at the very center so the swirl eye looks like a hand-drawn Tim Burton vortex
    const taper = Math.min(1, t / (Math.PI * 0.85));
    const halfW = (thickness * 0.5) * taper;
    const rOut = rCenter + halfW;
    const rIn = Math.max(0, rCenter - halfW);

    const cos = Math.cos(t);
    const sin = Math.sin(t);

    outerPoints.push(`${(rOut * cos).toFixed(1)},${(rOut * sin).toFixed(1)}`);
    innerPoints.unshift(`${(rIn * cos).toFixed(1)},${(rIn * sin).toFixed(1)}`);
  }

  return `M ${outerPoints.join(' L ')} L ${innerPoints.join(' L ')} Z`;
}

const SWIRL_PATH = buildCleanBurtonSwirlPath(7.5, 4, 134, 68, 720);

export default function SpiralHero({ onScrollToSection, onNavigateTab }) {
  const [surge, setSurge] = useState(false);

  const triggerSurge = () => {
    setSurge(true);
    setTimeout(() => setSurge(false), 650);
  };

  return (
    <section
      className={`site-hero-banner ${surge ? 'voltage-surge' : ''}`}
      aria-label="Wired Digital Hero Banner"
    >
      <div className="site-banner-viewport">
        {/* Clean, Razor-Sharp Tim Burton Optical Swirl SVG */}
        <svg
          className="site-banner-spiral-svg"
          viewBox="-960 -230 1920 460"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            {/* Crisp diagonal halftone newsprint lines inside the white spiral bands */}
            <pattern
              id="cleanHalftoneLines"
              width="5"
              height="5"
              patternTransform="rotate(35 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="5" height="5" fill="#F5F5F2" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="5"
                stroke="#18181C"
                strokeWidth="1.15"
                strokeOpacity="0.28"
              />
            </pattern>

            {/* Subtle 3D studio vignette so the center lockup pops with iOS depth */}
            <radialGradient id="centerStageShade" cx="50%" cy="50%" r="52%">
              <stop offset="0%" stopColor="#040405" stopOpacity="0.58" />
              <stop offset="42%" stopColor="#040405" stopOpacity="0.18" />
              <stop offset="85%" stopColor="#040405" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#040405" stopOpacity="0.45" />
            </radialGradient>

            {/* Torn grunge edge ONLY on the top and bottom horizontal boundaries (matching Screenshot 1) */}
            <clipPath id="tornTopBottomClip">
              <path
                d="M -980,-192
                   L -940,-202 L -905,-188 L -865,-200 L -820,-191 L -785,-204 L -740,-189
                   L -700,-201 L -655,-187 L -610,-203 L -570,-190 L -525,-202 L -480,-188
                   L -435,-204 L -390,-191 L -345,-201 L -300,-187 L -255,-203 L -210,-190
                   L -165,-204 L -120,-189 L -75,-202 L -30,-188 L 15,-204 L 60,-190
                   L 105,-202 L 150,-187 L 195,-203 L 240,-191 L 285,-204 L 330,-189
                   L 375,-201 L 420,-188 L 465,-203 L 510,-190 L 555,-202 L 600,-187
                   L 645,-204 L 690,-191 L 735,-202 L 780,-188 L 825,-203 L 870,-190
                   L 915,-202 L 960,-189 L 980,-195
                   L 980,195
                   L 940,203 L 900,188 L 855,202 L 810,190 L 765,204 L 720,189
                   L 675,201 L 630,187 L 585,203 L 540,190 L 495,202 L 450,188
                   L 405,204 L 360,191 L 315,201 L 270,187 L 225,203 L 180,190
                   L 135,204 L 90,189 L 45,202 L 0,188 L -45,204 L -90,190
                   L -135,202 L -180,187 L -225,203 L -270,191 L -315,204 L -360,189
                   L -405,201 L -450,188 L -495,203 L -540,190 L -585,202 L -630,187
                   L -675,204 L -720,191 L -765,202 L -810,188 L -855,203 L -900,190
                   L -945,202 L -980,192 Z"
              />
            </clipPath>
          </defs>

          <g clipPath="url(#tornTopBottomClip)">
            <rect x="-980" y="-240" width="1960" height="480" fill="#040405" />

            <g className="swirl-continuous-spin">
              <path d={SWIRL_PATH} fill="url(#cleanHalftoneLines)" />
            </g>

            {/* Center studio depth shade so the iOS glass card & yellow title read with 100% clarity */}
            <rect x="-980" y="-240" width="1960" height="480" fill="url(#centerStageShade)" />
          </g>
        </svg>

        {/* Center Stage Lockup: Pure Iconic WIRED ⚡ DIGITAL + creative + intelligent + fast */}
        <div className="site-banner-center-content">
          <div className="ios-hero-glass-Dock">
            <h1
              className="hero-title-lockup"
              onClick={triggerSurge}
              title="Click for High-Voltage Surge"
            >
              <span className="hero-word">WIRED</span>
              <span className="hero-bolt-wrapper" aria-hidden="true">
                <svg viewBox="0 0 68 136" className="hero-lightning-svg">
                  <polygon
                    points="46,7 10,79 36,79 24,135 67,61 40,61"
                    fill="#000000"
                  />
                  <polygon
                    points="42,2 6,74 32,74 20,134 64,56 36,56"
                    fill="#FFEE00"
                    stroke="#050505"
                    strokeWidth="2.5"
                  />
                </svg>
              </span>
              <span className="hero-word">DIGITAL</span>
            </h1>

            {/* Signature Slate/iOS Glass Tagline Bar: creative + intelligent + fast */}
            <div className="hero-tagline-bar">
              <span className="tagline-word">c r e a t i v e</span>
              <span className="tagline-plus">+</span>
              <span className="tagline-word">i n t e l l i g e n t</span>
              <span className="tagline-plus">+</span>
              <span className="tagline-word">f a s t</span>
            </div>
          </div>
        </div>
      </div>

      {/* Positioned Right Below the Header Banner & Directly Above the Video Reel / About Copy */}
      <div className="below-banner-pill-strip">
        <div className="ios-hero-top-pill below-banner-pill">
          <span className="pulse-dot" />
          <span>
            WEBSITE DESIGN, REDESIGN &amp; MODERNIZATION • E-COMMERCE • GENERATIVE SEO (GEO) • CUSTOM AI &amp; DASHBOARDS • FULL-SERVICE MARKETING • VIDEO EDITING
          </span>
        </div>
      </div>
    </section>
  );
}
