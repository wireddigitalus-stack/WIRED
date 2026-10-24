import React, { useRef, useState } from 'react';
import { Maximize2, Sparkles, Film, TrendingUp, Cpu, Megaphone, ShieldCheck, Layers } from 'lucide-react';
import { BRAND_INFO } from '../data/wiredData';

export default function Since1999Section({ onNavigateTab, onOpenVideoModal, onOpenContact }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="since-1999-section" id="about">
      <div className="since-split-grid">
        {/* LEFT 50%: High-Contrast Studio Reel Video */}
        <div className="since-video-column">
          <div className="studio-monitor-frame">
            <video
              ref={videoRef}
              className="since-bg-video"
              poster={BRAND_INFO.reelPoster}
              autoPlay
              muted
              loop
              playsInline
              onClick={togglePlay}
            >
              <source src={BRAND_INFO.reelMp4} type="video/mp4" />
              <source src={BRAND_INFO.reelMov} type="video/quicktime" />
            </video>

            {/* Halftone Dot Matrix Overlay */}
            <div className="video-halftone-overlay" aria-hidden="true" />
            <div className="video-vignette-overlay" aria-hidden="true" />

            <div className="studio-hud-top">
              <span className="hud-rec-badge">
                <span className="rec-dot" />
                STUDIO REEL // EST. 1999
              </span>
              <span className="hud-timecode">BRISTOL VA/TN × GLOBAL</span>
            </div>

            <div className="studio-hud-bottom">
              <button
                type="button"
                className="hud-control-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause Studio Reel' : 'Play Studio Reel'}
              >
                {isPlaying ? 'PAUSE LOOP' : 'PLAY LOOP'}
              </button>
              <button
                type="button"
                className="hud-control-btn hud-expand-btn"
                onClick={() =>
                  onOpenVideoModal({
                    title: 'Wired Digital — Studio Director\'s Reel',
                    role: 'Rob Neilson — Creative Director',
                    category: 'STUDIO SHOWREEL',
                    localVideo: BRAND_INFO.reelMp4
                  })
                }
              >
                <Maximize2 size={13} />
                <span>EXPAND REEL</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT 50%: Iconic Circular Wired Digital Stamp + Manifesto */}
        <div className="since-content-column">
          <div className="since-content-inner">
            <div className="wired-stamp-wrapper" title="Wired Digital Creative — Est. 1999">
              <img
                src={BRAND_INFO.roundStampSrc}
                alt="Wired Digital — Creative + Intelligent + Fast — Est. 1999"
                className="wired-round-stamp-img"
              />
            </div>

            <h2 className="since-heading">SINCE 1999</h2>

            <p className="since-manifesto">
              <strong>Wired Digital Creative</strong> bridges{' '}
              <strong>rock-and-roll artistry</strong> with{' '}
              <strong>advanced AI software engineering</strong>. Founded in{' '}
              <strong>Jackson, TN in 1999</strong> and now based in{' '}
              <strong>Bristol (VA/TN) since 2022</strong>, we specialize in{' '}
              <span className="highlight-yellow">
                website design, redesign, and full-stack AI modernization
              </span>
              —engineered to keep pace with the fast-changing way search engines work
              in the age of AI. We pair{' '}
              <strong>full-service marketing</strong> and{' '}
              <strong>Generative SEO (GEO + Local SEO)</strong> with{' '}
              <strong>custom business dashboards</strong> to drive revenue across the
              Tri-Cities and nationwide, while working full-time in the music industry
              since 2015 delivering{' '}
              <strong>global remote music &amp; lyric video editing</strong> for major
              record labels and Hall-of-Fame catalogs worldwide.
            </p>

            {/* 25+ Years Ahead of the Tech Curve • Boutique Under-One-Roof Callout */}
            <div className="since-boutique-callout">
              <div className="since-boutique-header">
                <span className="since-boutique-badge">
                  <ShieldCheck size={13} />
                  <span>25+ YEARS AHEAD OF THE TECH CURVE // ALL SKILLS UNDER 1 ROOF</span>
                </span>
              </div>
              <p className="since-boutique-copy">
                When you partner with Wired Digital, you are investing in{' '}
                <strong>25+ years of real-world experience</strong> and a relentless track
                record of <strong>staying ahead of every major technology wave</strong>—from
                early web and mobile to 4K broadcast media, custom apps, and AI-era search.
                We aren&apos;t cheap bargain-bin template builders, and we aren&apos;t a
                bloated agency marking up 10 middlemen: we deliver{' '}
                <span className="highlight-yellow">
                  high-impact custom engineering and creative at straightforward,
                  real-world pricing—with web, apps, software, AI, video &amp; digital
                  marketing all under one roof
                </span>{' '}
                working directly with Creative Director <strong>Rob Neilson</strong>.
              </p>
            </div>

            <div className="since-pillar-pills">
              <button
                type="button"
                className="pillar-pill"
                onClick={() => onNavigateTab('web')}
              >
                <Cpu size={14} />
                <span>AI Site Design, Redesign &amp; Modernization</span>
              </button>
              <button
                type="button"
                className="pillar-pill"
                onClick={() => onNavigateTab('web')}
              >
                <Megaphone size={14} />
                <span>Full-Service Marketing</span>
              </button>
              <button
                type="button"
                className="pillar-pill"
                onClick={() => onNavigateTab('web')}
              >
                <TrendingUp size={14} />
                <span>AI-Era Search &amp; Generative SEO (GEO)</span>
              </button>
              <button
                type="button"
                className="pillar-pill"
                onClick={() => onNavigateTab('video')}
              >
                <Film size={14} />
                <span>Global Remote Video Editing</span>
              </button>
            </div>

            <div className="since-cta-row">
              <button
                type="button"
                className="btn-wired-yellow"
                onClick={() => onNavigateTab('web')}
              >
                LEARN MORE
              </button>
              <button
                type="button"
                className="btn-wired-outline"
                onClick={onOpenContact}
              >
                START A PROJECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
