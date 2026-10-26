import React, { useState } from 'react';
import { Zap, Sun } from 'lucide-react';
import { CLIENT_LOGOS, PRIMARY_WAVE_SPOTLIGHT } from '../data/wiredData';
import SmartLogo from './SmartLogo';
import MobileMore from './MobileMore';

const CATEGORIES = [
  { id: 'all', label: `ALL LEGENDS (${CLIENT_LOGOS.length})` },
  { id: 'rock', label: 'ROCK & METAL ICONS' },
  { id: 'labels', label: 'LABELS & CATALOGS' },
  { id: 'icons', label: 'POP & TIMELESS ICONS' }
];

export default function LegendsWall() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [stageMode, setStageMode] = useState('dark'); // 'dark' | 'vault'
  // Mobile: show the first 12 logos (3 × 4 grid) with a "Show all" toggle
  const [showAllLogos, setShowAllLogos] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const MOBILE_LOGO_LIMIT = 12;

  const filteredLogos =
    activeCategory === 'all'
      ? CLIENT_LOGOS
      : CLIENT_LOGOS.filter((item) => item.category === activeCategory);

  return (
    <section className="legends-section" id="legends">
      <div className="section-container">
        {/* Section Header matching Screenshot 3 */}
        <div className="legends-header">
          <div className="eyebrow-tag">
            <Zap size={13} fill="#FFEE00" color="#FFEE00" />
            <span>TRUSTED BY ROCK &amp; POP ROYALTY • FULL-TIME IN THE MUSIC INDUSTRY SINCE 2015</span>
          </div>
          <h2 className="section-title-tracked">WORKING WITH LEGENDS</h2>
          <p
            id="legends-intro-copy"
            className={`legends-subtitle m-clamp ${introOpen ? 'is-open' : ''}`}
            style={{ '--m-lines': 3 }}
          >
            Trusted by <strong>34+ Hall-of-Fame rock icons, estates, and major record labels</strong>—including{' '}
            <strong>Primary Wave, Alice Cooper, Def Leppard, Halestorm, Paul Rodgers, Bob Marley, Whitney Houston, and Prince</strong>—for
            4K music videos, official lyric videos, visualizers, and custom digital experiences.
          </p>
          <MobileMore
            open={introOpen}
            onToggle={() => setIntroOpen((v) => !v)}
            controls="legends-intro-copy"
          />

          {/* Controls Bar: Category Filter + Dark Stage / Classic Vault Toggle */}
          <div className="legends-controls-bar">
            <div className="legends-filter-tabs" role="tablist" aria-label="Filter client legends">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`legend-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="stage-mode-switcher" aria-label="Switch Logo Wall Backdrop">
              <button
                type="button"
                className={`stage-mode-btn ${stageMode === 'dark' ? 'active' : ''}`}
                onClick={() => setStageMode('dark')}
                title="High-Voltage Dark Stage View"
              >
                <Zap size={13} />
                <span>DARK STAGE</span>
              </button>
              <button
                type="button"
                className={`stage-mode-btn ${stageMode === 'vault' ? 'active' : ''}`}
                onClick={() => setStageMode('vault')}
                title="Classic High-Contrast White/Yellow Vault View"
              >
                <Sun size={13} />
                <span>CLASSIC VAULT</span>
              </button>
            </div>
          </div>
        </div>

        {/* Signature Yellow-Bordered Rounded Vault Frame */}
        <div className={`legends-vault-frame mode-${stageMode}`}>
          {/* Featured Primary Wave — "The Home of Legends" Centerpiece + Ribbon */}
          <div className="vault-featured-partner">
            <div className="vault-pw-banner">
              <SmartLogo item={PRIMARY_WAVE_SPOTLIGHT} mode={stageMode} className="pw-spotlight-img" />
            </div>
          </div>

          <div className="vault-top-ribbon">
            <span className="vault-ribbon-line" />
            <span className="vault-ribbon-text">
              MAJOR CATALOG PARTNERS • HALL OF FAME ARTISTS • ICONIC ESTATES
            </span>
            <span className="vault-ribbon-line" />
          </div>

          <div
            id="legends-bento-grid"
            className={`legends-bento-grid m-limit ${showAllLogos ? 'is-open' : ''}`}
          >
            {filteredLogos.map((item) => (
              <div
                key={item.id}
                className={`legend-logo-card mode-${stageMode}`}
                title={`${item.name} — ${item.role}`}
              >
                <div className="legend-logo-canvas-wrap">
                  <SmartLogo item={item} mode={stageMode} />
                </div>
                <div className="legend-card-meta">
                  <span className="legend-artist-name">{item.name}</span>
                  <span className="legend-artist-role">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
          {filteredLogos.length > MOBILE_LOGO_LIMIT && (
            <MobileMore
              open={showAllLogos}
              onToggle={() => setShowAllLogos((v) => !v)}
              moreLabel={`Show all ${filteredLogos.length} legends`}
              lessLabel="Show fewer"
              controls="legends-bento-grid"
              className="m-more-btn--center"
            />
          )}
        </div>
      </div>
    </section>
  );
}
