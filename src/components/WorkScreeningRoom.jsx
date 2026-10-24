import React, { useState } from 'react';
import { Play, ExternalLink, Heart, Film, Maximize2, Globe } from 'lucide-react';
import { BRAND_INFO, FEATURED_WORK } from '../data/wiredData';

export default function WorkScreeningRoom({ onOpenVideoModal, onNavigateTab }) {
  const [inlinePlayingId, setInlinePlayingId] = useState(null);
  const [likedIds, setLikedIds] = useState({
    'halestorm-shooting-star': true,
    'alice-cooper-lyric-video': true,
    'full-devil-jacket-music-video': true,
    'full-devil-jacket-killers-video': true
  });

  const toggleLike = (id) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="work-screening-section" id="work">
      <div className="section-container work-narrow-container">
        {/* Headline with Global Remote Editing Positioning */}
        <div className="work-header">
          <div className="eyebrow-tag">
            <Globe size={14} className="eyebrow-icon" />
            <span>WORLDWIDE REMOTE POST-PRODUCTION, LYRIC VIDEOS &amp; FLAGSHIP REELS</span>
          </div>
          <h2 className="section-title-tracked">SOME OF OUR WORK</h2>
          <p className="legends-subtitle">
            Delivering global remote <strong>4K music video editing, official kinetic lyric videos, and visualizers</strong> for
            major record labels and rock royalty worldwide—including{' '}
            <strong>Halestorm, Paul Rodgers, Alice Cooper, and Full Devil Jacket</strong> (with on-location directing reserved for select flagship commissions).
          </p>
        </div>

        <div className="work-cards-stack">
          {FEATURED_WORK.map((project) => {
            const isPlayingInline = inlinePlayingId === project.id;
            const isLiked = !!likedIds[project.id];

            return (
              <article key={project.id} className="work-showcase-card">
                {/* TOP: Full-Width 16:9 Widescreen Video Frame */}
                <div className="work-card-media">
                  {isPlayingInline ? (
                    <div className="work-inline-iframe-wrap">
                      <iframe
                        src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0`}
                        title={project.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="work-inline-iframe"
                      />
                    </div>
                  ) : (
                    <div
                      className="work-thumb-trigger"
                      onClick={() => setInlinePlayingId(project.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInlinePlayingId(project.id);
                        }
                      }}
                      aria-label={`Play ${project.title}`}
                    >
                      <img
                        src={project.thumbnail}
                        onLoad={(e) => {
                          if (
                            e.currentTarget.naturalWidth <= 120 &&
                            project.fallbackThumb &&
                            e.currentTarget.src !== project.fallbackThumb
                          ) {
                            e.currentTarget.src = project.fallbackThumb;
                          }
                        }}
                        onError={(e) => {
                          if (project.fallbackThumb && e.currentTarget.src !== project.fallbackThumb) {
                            e.currentTarget.src = project.fallbackThumb;
                          }
                        }}
                        alt={project.title}
                        className="work-thumb-img"
                      />
                      <div className="work-thumb-gradient" />

                      <span className="work-category-badge">{project.category}</span>

                      <div className="work-play-circle">
                        <Play size={26} fill="#FFFFFF" stroke="#FFFFFF" className="play-triangle-offset" />
                      </div>
                    </div>
                  )}
                </div>

                {/* UNDERNEATH: Credits, Title, Description & Actions */}
                <div className="work-card-body">
                  <div className="work-card-top">
                    <div className="work-author-row">
                      <div className="work-author-avatar">
                        <img src={BRAND_INFO.logoSrc} alt="Rob Neilson" />
                      </div>
                      <div className="work-author-meta">
                        <span className="author-name">Rob Neilson</span>
                        <span className="author-sub">
                          {project.role} • {project.date}
                        </span>
                      </div>
                    </div>

                    <h3
                      className="work-card-title"
                      onClick={() => setInlinePlayingId(project.id)}
                    >
                      {project.title}
                    </h3>

                    <p className="work-card-desc">{project.description}</p>

                    <div className="work-card-tags">
                      {project.tags.map((tag) => (
                        <span key={tag} className="work-tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="work-card-footer">
                    <div className="work-footer-actions">
                      <button
                        type="button"
                        className="work-action-link primary"
                        onClick={() => onOpenVideoModal(project)}
                      >
                        <Maximize2 size={13} />
                        <span>THEATER MODE</span>
                      </button>
                      <a
                        href={project.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="work-action-link"
                      >
                        <span>YOUTUBE</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>

                    <button
                      type="button"
                      className={`work-heart-btn ${isLiked ? 'liked' : ''}`}
                      onClick={() => toggleLike(project.id)}
                      aria-label="Favorite project"
                    >
                      <Heart
                        size={16}
                        fill={isLiked ? '#FF3B30' : 'none'}
                        stroke={isLiked ? '#FF3B30' : '#FF453A'}
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Iconic Oversized Yellow YouTube CTA Button */}
        <div className="youtube-giant-cta-wrap">
          <a
            href={BRAND_INFO.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-youtube-giant"
          >
            View More Projects On YouTube
          </a>

          <div className="work-secondary-links">
            <button
              type="button"
              className="link-explore-subpage"
              onClick={() => onNavigateTab('web')}
            >
              Explore AI Website Design, Redesign &amp; Modernization →
            </button>
            <span className="dot-sep">•</span>
            <button
              type="button"
              className="link-explore-subpage"
              onClick={() => onNavigateTab('video')}
            >
              Explore Global Remote Video Editing Services →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
