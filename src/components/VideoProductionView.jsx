import React, { useState, useRef } from 'react';
import {
  Film,
  Play,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Search,
  SkipBack,
  SkipForward,
  ListVideo,
  Tv,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  BRAND_INFO,
  VIDEO_PRODUCTION_SERVICES,
  FEATURED_WORK,
  YOUTUBE_CHANNEL_DATA
} from '../data/wiredData';

export default function VideoProductionView({ onOpenVideoModal, onOpenContact, onNavigateTab }) {
  const theaterPlayerRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoId, setActiveVideoId] = useState(YOUTUBE_CHANNEL_DATA.videos[0].videoId);
  const [autoPlayEmbed, setAutoPlayEmbed] = useState(false);
  const [embedPlaylistMode, setEmbedPlaylistMode] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const filteredVideos = YOUTUBE_CHANNEL_DATA.videos.filter((vid) => {
    const matchesCat = activeCategory === 'all' || vid.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      vid.title.toLowerCase().includes(q) ||
      vid.artist.toLowerCase().includes(q) ||
      vid.badge.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const activeVideoObj =
    YOUTUBE_CHANNEL_DATA.videos.find((v) => v.videoId === activeVideoId) ||
    filteredVideos[0] ||
    YOUTUBE_CHANNEL_DATA.videos[0];

  const activePlaylistObj =
    YOUTUBE_CHANNEL_DATA.playlists.find((p) => p.id === activeCategory) ||
    YOUTUBE_CHANNEL_DATA.playlists[0];

  const currentListForNav = filteredVideos.length > 0 ? filteredVideos : YOUTUBE_CHANNEL_DATA.videos;
  const currentIdx = currentListForNav.findIndex((v) => v.videoId === activeVideoObj.videoId);

  const handleSelectChannelVideo = (vid) => {
    setEmbedPlaylistMode(false);
    setActiveVideoId(vid.videoId);
    setAutoPlayEmbed(true);
    theaterPlayerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handlePrevVideo = () => {
    if (currentListForNav.length === 0) return;
    const prevIdx = (currentIdx - 1 + currentListForNav.length) % currentListForNav.length;
    setEmbedPlaylistMode(false);
    setActiveVideoId(currentListForNav[prevIdx].videoId);
    setAutoPlayEmbed(true);
  };

  const handleNextVideo = () => {
    if (currentListForNav.length === 0) return;
    const nextIdx = (currentIdx + 1) % currentListForNav.length;
    setEmbedPlaylistMode(false);
    setActiveVideoId(currentListForNav[nextIdx].videoId);
    setAutoPlayEmbed(true);
  };

  const visibleGridVideos =
    showAllVideos || searchQuery.trim().length > 0 ? filteredVideos : filteredVideos.slice(0, 12);

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
                    title: "Wired Digital — Studio Director's Showreel",
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

      {/* ====================================================================
          OFFICIAL @WIREDDIGITALCREATIVE YOUTUBE CHANNEL BROADCAST & VIDEO FEED
         ==================================================================== */}
      <section className="yt-channel-feed-section" id="youtube-feed">
        <div className="section-container">
          <div className="yt-channel-shell">
            {/* Top Channel Header Bar */}
            <div className="yt-channel-header">
              <div className="yt-channel-identity">
                <div className="yt-avatar-ring">
                  <img
                    src={BRAND_INFO.logoSrc}
                    alt="Wired Digital Creative YouTube"
                    className="yt-avatar-img"
                  />
                </div>
                <div className="yt-channel-meta">
                  <div className="yt-live-badge-row">
                    <span className="yt-live-pulse-dot" />
                    <span className="yt-live-kicker">
                      OFFICIAL YOUTUBE CHANNEL FEED // {YOUTUBE_CHANNEL_DATA.handle}
                    </span>
                  </div>
                  <h2 className="yt-channel-title">
                    WIRED DIGITAL <span className="text-yellow">YOUTUBE BROADCAST DECK</span>
                  </h2>
                  <p className="yt-channel-sub">
                    36 Official Music Videos, Custom Lyric Videos &amp; Artist Promo Reels — stream
                    directly below or explore the full playlist catalog on YouTube.
                  </p>
                </div>
              </div>

              <div className="yt-channel-header-actions">
                <button
                  type="button"
                  className={`yt-mode-toggle-btn ${embedPlaylistMode ? 'active' : ''}`}
                  onClick={() => setEmbedPlaylistMode(!embedPlaylistMode)}
                  title="Switch between Individual Video Embed and Full YouTube Playlist Player"
                >
                  <ListVideo size={15} />
                  <span>{embedPlaylistMode ? 'SINGLE VIDEO MODE' : 'PLAYLIST PLAYER MODE'}</span>
                </button>
                <a
                  href={YOUTUBE_CHANNEL_DATA.subscribeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="yt-subscribe-btn"
                >
                  <Tv size={15} />
                  <span>SUBSCRIBE ON YOUTUBE</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Main 16:9 Embedded YouTube Broadcast Theater */}
            <div className="yt-broadcast-theater" ref={theaterPlayerRef}>
              <div className="yt-iframe-stage">
                <iframe
                  key={
                    embedPlaylistMode
                      ? `pl_${activePlaylistObj.playlistId}`
                      : `vid_${activeVideoObj.videoId}_${autoPlayEmbed}`
                  }
                  src={
                    embedPlaylistMode
                      ? `https://www.youtube.com/embed/videoseries?list=${activePlaylistObj.playlistId}&rel=0`
                      : `https://www.youtube.com/embed/${activeVideoObj.videoId}?autoplay=${autoPlayEmbed ? 1 : 0}&rel=0`
                  }
                  title={activeVideoObj.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="yt-broadcast-iframe"
                />
              </div>

              {/* Active Broadcast Control & Telemetry Bar Underneath 16:9 Player */}
              <div className="yt-now-playing-bar">
                <div className="yt-now-playing-info">
                  <div className="yt-np-badges">
                    <span className="yt-np-live-pill">NOW PLAYING</span>
                    <span className="yt-np-cat-pill">{activeVideoObj.badge}</span>
                    <span className="yt-np-views-pill">
                      {activeVideoObj.artist} • {activeVideoObj.views} • {activeVideoObj.duration}
                    </span>
                  </div>
                  <h3 className="yt-np-title">{activeVideoObj.title}</h3>
                </div>

                <div className="yt-now-playing-controls">
                  <button
                    type="button"
                    className="yt-nav-btn"
                    onClick={handlePrevVideo}
                    title="Previous Video in Feed"
                  >
                    <SkipBack size={15} />
                    <span>PREV</span>
                  </button>
                  <button
                    type="button"
                    className="yt-nav-btn"
                    onClick={handleNextVideo}
                    title="Next Video in Feed"
                  >
                    <span>NEXT</span>
                    <SkipForward size={15} />
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideoObj.videoId}&list=${activeVideoObj.playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="yt-watch-direct-btn"
                  >
                    <span>OPEN ON YOUTUBE</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Category Playlist Filter Tabs + Instant Artist Search */}
            <div className="yt-feed-toolbar">
              <div className="yt-playlist-tabs" role="tablist">
                {YOUTUBE_CHANNEL_DATA.playlists.map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === pl.id}
                    className={`yt-pl-tab-btn ${activeCategory === pl.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveCategory(pl.id);
                      setShowAllVideos(false);
                    }}
                  >
                    {pl.shortLabel}
                  </button>
                ))}
              </div>

              <div className="yt-search-box">
                <Search size={15} className="yt-search-icon" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artist or title (Alice Cooper, Halestorm, Def Leppard, Tesla...)"
                  className="yt-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="yt-search-clear"
                    onClick={() => setSearchQuery('')}
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            {/* Stacked 16:9 YouTube Channel Feed Grid */}
            <div className="yt-feed-grid">
              {visibleGridVideos.map((vid) => {
                const isPlaying = vid.videoId === activeVideoObj.videoId && !embedPlaylistMode;
                return (
                  <article
                    key={vid.videoId}
                    className={`yt-feed-card ${isPlaying ? 'is-playing' : ''}`}
                    onClick={() => handleSelectChannelVideo(vid)}
                  >
                    <div className="yt-card-thumb-wrap">
                      <img
                        src={`https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`}
                        alt={vid.title}
                        loading="lazy"
                        className="yt-card-thumb-img"
                      />
                      <div className="yt-card-play-center">
                        <Play size={18} fill="#050505" stroke="#050505" />
                      </div>
                      <span className="yt-card-badge">{vid.badge}</span>
                      <span className="yt-card-duration">{vid.duration}</span>
                      {isPlaying && <span className="yt-card-playing-tag">NOW PLAYING</span>}
                    </div>

                    <div className="yt-card-body">
                      <div className="yt-card-meta-row">
                        <span className="yt-card-artist">{vid.artist}</span>
                        <span className="yt-card-views">{vid.views}</span>
                      </div>
                      <h4 className="yt-card-title">{vid.title}</h4>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Expand All 36 Channel Videos Button + Direct Playlist Links */}
            {filteredVideos.length > 12 && !searchQuery.trim() && (
              <div className="yt-feed-LoadMore-row">
                <button
                  type="button"
                  className="yt-expand-feed-btn"
                  onClick={() => setShowAllVideos(!showAllVideos)}
                >
                  {showAllVideos ? (
                    <>
                      <span>SHOW FEWER VIDEOS</span>
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      <span>VIEW ALL {filteredVideos.length} CHANNEL VIDEOS</span>
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
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
