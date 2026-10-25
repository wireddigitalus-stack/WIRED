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
              preload="metadata"
              autoPlay
              muted
              loop
              playsInline
              onClick={togglePlay}
            >
              <source src={BRAND_INFO.reelMp4} type="video/mp4" />
            </video>

            {/* Halftone Dot Matrix Overlay */}
            <div className="video-halftone-overlay" aria-hidden="true" />
            <div className="video-vignette-overlay" aria-hidden="true" />

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

            <p className="since-manifesto">
              <strong>Wired Digital Creative</strong> bridges{' '}
              <strong>rock-and-roll artistry</strong> with{' '}
              <strong>advanced AI software engineering</strong>. Founded in{' '}
              <strong>Jackson, TN in 1999</strong> and headquartered in{' '}
              <strong>Bristol (VA/TN) since 2022</strong>, we specialize in{' '}
              <span className="highlight-yellow">
                AI website design, redesign, custom apps, and full-stack modernization
              </span>
              —engineered to keep pace with how search engines work in the age of{' '}
              <strong>ChatGPT, Google AI Overviews, Gemini, and Perplexity</strong>. We pair{' '}
              <strong>full-service digital marketing</strong> and{' '}
              <strong>Generative Engine Optimization (GEO + Local SEO)</strong> with{' '}
              <strong>custom live business dashboards &amp; 24/7 AI lead concierges</strong> across{' '}
              <strong>Bristol, Johnson City, Kingsport, Abingdon</strong>, and nationwide—while
              working full-time in the music industry since 2015 delivering{' '}
              <strong>global remote 4K music &amp; lyric video editing</strong> for major record
              labels and 34+ Hall-of-Fame catalogs worldwide.
            </p>

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
