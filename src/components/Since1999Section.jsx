import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Sparkles, Film, TrendingUp, Cpu, Megaphone, ShieldCheck, Layers } from 'lucide-react';
import { BRAND_INFO } from '../data/wiredData';
import useIsMobile from '../utils/useIsMobile';

export default function Since1999Section({ onNavigateTab, onOpenVideoModal, onOpenContact }) {
  const videoRef = useRef(null);
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(true);
  // Reel loads only after the page itself has finished loading, so it never competes
  // with the hero, fonts or scripts. Phones get a lighter 360p cut (~340 KB),
  // desktop a 720p cut (~930 KB) — both sit under the halftone overlay anyway.
  const [videoSrc, setVideoSrc] = useState(null);
  const [reelReady, setReelReady] = useState(false);

  useEffect(() => {
    const src = isMobile ? BRAND_INFO.reelMp4Mobile : BRAND_INFO.reelMp4;
    const start = () => setVideoSrc(src);
    if (document.readyState === 'complete') {
      const t = setTimeout(start, 120);
      return () => clearTimeout(t);
    }
    window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, [isMobile]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!videoSrc || !vid) return;
    const attempt = vid.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        // Autoplay blocked (e.g. iOS Low Power Mode) — drop the loader, show poster + PLAY LOOP
        setIsPlaying(false);
        setReelReady(true);
      });
    }
  }, [videoSrc]);

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
              src={videoSrc || undefined}
              preload="auto"
              autoPlay
              muted
              loop
              playsInline
              onPlaying={() => {
                setReelReady(true);
                setIsPlaying(true);
              }}
              onClick={togglePlay}
            />

            {/* Halftone Dot Matrix Overlay */}
            <div className="video-halftone-overlay" aria-hidden="true" />
            <div className="video-vignette-overlay" aria-hidden="true" />

            {/* Subtle loader over the poster until the loop starts */}
            {!reelReady && (
              <div className="since-reel-loader" aria-hidden="true">
                <span className="since-reel-loader-bar" />
              </div>
            )}

            <div className="studio-hud-top">
              <span className="hud-rec-badge">
                <span className="rec-dot" />
                EST. 1999
              </span>
              <span className="hud-timecode">BRISTOL VA/TN × GLOBAL</span>
            </div>

            <div className="studio-hud-bottom">
              <button
                type="button"
                className="hud-control-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause Video Clip' : 'Play Video Clip'}
              >
                {isPlaying ? 'PAUSE LOOP' : 'PLAY LOOP'}
              </button>
              <button
                type="button"
                className="hud-control-btn hud-expand-btn"
                onClick={() =>
                  onOpenVideoModal({
                    title: 'Wired Digital — Official Video Production Reel',
                    role: 'Rob Neilson — Creative Director',
                    category: 'OFFICIAL PRODUCTION REEL',
                    youtubeId: 'i2yjCTNWJPA',
                    youtubeUrl: 'https://youtu.be/i2yjCTNWJPA?si=YdTIsZQN1KPa2Ym1'
                  })
                }
              >
                <Maximize2 size={13} />
                <span>WATCH FULL REEL</span>
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
                fetchPriority="high"
                decoding="async"
              />
            </div>

            <h2 className="since-heading">SINCE 1999</h2>

            <p
              id="since-manifesto-copy"
              className="since-manifesto"
            >
              Founded in 1999. Based in Bristol, VA/TN since 2022. We build{' '}
              <span className="highlight-yellow">fast websites, AI chatbots and live dashboards</span>{' '}
              for local businesses, and since 2015 we&apos;ve edited{' '}
              <strong>music videos for 34+ legendary artists</strong>. You work directly with Rob,
              start to finish.
            </p>

            <div className="since-pillar-pills">
              <button
                type="button"
                className="pillar-pill"
                onClick={() => onNavigateTab('web')}
              >
                <Cpu size={14} />
                <span>Websites &amp; Redesigns</span>
              </button>
              <button
                type="button"
                className="pillar-pill"
                onClick={() => onNavigateTab('web')}
              >
                <Megaphone size={14} />
                <span>Marketing</span>
              </button>
              <button
                type="button"
                className="pillar-pill"
                onClick={() => onNavigateTab('web')}
              >
                <TrendingUp size={14} />
                <span>Local SEO &amp; AI Search</span>
              </button>
              <button
                type="button"
                className="pillar-pill"
                onClick={() => onNavigateTab('video')}
              >
                <Film size={14} />
                <span>Music Video Editing</span>
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
