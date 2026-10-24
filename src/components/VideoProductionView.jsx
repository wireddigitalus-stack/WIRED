import React from 'react';
import { Film, Play, Sparkles, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { BRAND_INFO, VIDEO_PRODUCTION_SERVICES, FEATURED_WORK } from '../data/wiredData';

export default function VideoProductionView({ onOpenVideoModal, onOpenContact, onNavigateTab }) {
  return (
    <div className="subview-page video-production-view">
      {/* Subpage Hero */}
      <section className="subview-hero">
        <div className="section-container">
          <div className="eyebrow-tag">
            <Film size={14} />
            <span>WIRED DIGITAL // VIDEO PRODUCTION &amp; VISUAL ARTISTRY</span>
          </div>
          <h1 className="subview-hero-title">
            ROCK-AND-ROLL <span className="text-yellow">VIDEO PRODUCTION</span> FOR LEGENDS
          </h1>
          <p className="subview-hero-lead">
            Founded in Jackson, TN in 1999, working full-time in the music industry since
            2015, and now based in Bristol (VA/TN) since 2022—delivering global remote music
            video editing, official lyric videos, visualizers, and tour promos for
            multi-platinum artists, iconic catalogs, and major record labels worldwide
            (with on-location directing &amp; shooting reserved for select high-end
            flagship commissions).
          </p>

          <div className="subview-hero-actions">
            <button type="button" className="btn-wired-yellow" onClick={onOpenContact}>
              BOOK A VIDEO PROJECT
            </button>
            <a
              href={BRAND_INFO.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wired-outline"
            >
              <span>OFFICIAL YOUTUBE CHANNEL</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Studio Reel Spotlight */}
      <section className="subview-reel-strip">
        <div className="section-container">
          <div className="subview-reel-card">
            <div className="subview-reel-media">
              <video
                src={BRAND_INFO.reelMp4}
                poster={BRAND_INFO.reelPoster}
                autoPlay
                muted
                loop
                playsInline
                className="subview-reel-video"
              />
              <div className="video-halftone-overlay" />
              <button
                type="button"
                className="reel-center-play-btn"
                onClick={() =>
                  onOpenVideoModal({
                    title: 'Wired Digital — Studio Director\'s Showreel',
                    role: 'Directed & Edited by Rob Neilson',
                    category: 'STUDIO REEL',
                    localVideo: BRAND_INFO.reelMp4
                  })
                }
              >
                <Play size={24} fill="#050505" stroke="#050505" />
                <span>WATCH STUDIO REEL</span>
              </button>
            </div>

            <div className="subview-reel-info">
              <span className="reel-kicker">CREATIVE DIRECTOR: ROB NEILSON</span>
              <h2>From RED Cinema Shoots to Custom Animated Lyric Worlds</h2>
              <p>
                Whether cutting a multi-cam rock collaboration for{' '}
                <strong>Halestorm &amp; Paul Rodgers</strong>, crafting custom-animated
                lyric visuals for <strong>Alice Cooper</strong>, or directing the VEVO
                music video that helped land <strong>Full Devil Jacket</strong> their
                record deal with <strong>eOne</strong>, Wired Digital delivers broadcast
                and arena-ready visuals with unmistakable edge.
              </p>
              <div className="reel-stats-grid">
                <div className="reel-stat-box">
                  <span className="stat-num">1999</span>
                  <span className="stat-label">Wired Digital Est.</span>
                </div>
                <div className="reel-stat-box">
                  <span className="stat-num">2015</span>
                  <span className="stat-label">Full-Time Music Industry</span>
                </div>
                <div className="reel-stat-box">
                  <span className="stat-num">34+</span>
                  <span className="stat-label">Legendary Artists &amp; Labels</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Video & Creative Services Grid */}
      <section className="subview-services-section">
        <div className="section-container">
          <div className="subview-section-head">
            <span className="eyebrow-tag">CAPABILITIES</span>
            <h2 className="section-title-tracked">PRODUCTION SERVICES</h2>
          </div>

          <div className="services-bento-grid">
            {VIDEO_PRODUCTION_SERVICES.map((srv, idx) => (
              <div key={srv.title} className="service-bento-card">
                <div className="service-card-index">0{idx + 1}</div>
                <span className="service-card-sub">{srv.subtitle}</span>
                <h3 className="service-card-title">{srv.title}</h3>
                <p className="service-card-desc">{srv.description}</p>
                <ul className="service-highlights-list">
                  {srv.highlights.map((pt) => (
                    <li key={pt}>
                      <CheckCircle2 size={15} className="check-yellow" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Releases Grid */}
      <section className="subview-featured-grid-section">
        <div className="section-container">
          <div className="subview-section-head">
            <span className="eyebrow-tag">SPOTLIGHT RELEASES</span>
            <h2 className="section-title-tracked">FEATURED PRODUCTIONS</h2>
          </div>

          <div className="featured-mini-grid">
            {FEATURED_WORK.map((item) => (
              <div
                key={item.id}
                className="featured-mini-card"
                onClick={() => onOpenVideoModal(item)}
              >
                <div className="mini-card-thumb">
                  <img
                    src={item.thumbnail}
                    onError={(e) => {
                      if (e.currentTarget.src !== item.fallbackThumb) {
                        e.currentTarget.src = item.fallbackThumb;
                      }
                    }}
                    alt={item.title}
                  />
                  <div className="mini-card-play">
                    <Play size={20} fill="#050505" stroke="#050505" />
                  </div>
                  <span className="mini-card-badge">{item.category}</span>
                </div>
                <div className="mini-card-content">
                  <h3>{item.shortTitle}</h3>
                  <p>{item.description}</p>
                  <span className="mini-watch-cta">
                    Watch in Theater Mode <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="subview-bottom-banner">
            <div>
              <h3>Need a Music Video, Visualizer, or Tour Promo Campaign?</h3>
              <p>Direct collaboration with Creative Director Rob Neilson—fast, intelligent, and built to stand out.</p>
            </div>
            <div className="subview-banner-btns">
              <button type="button" className="btn-wired-yellow" onClick={onOpenContact}>
                START YOUR VIDEO PROJECT
              </button>
              <button
                type="button"
                className="btn-wired-outline"
                onClick={() => onNavigateTab('home')}
              >
                BACK TO FULL OVERVIEW
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
