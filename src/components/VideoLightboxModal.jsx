import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function VideoLightboxModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="video-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="video-modal-header">
          <div>
            <span className="modal-kicker">{project.category || 'SCREENING ROOM'}</span>
            <h3 className="modal-title">{project.title}</h3>
          </div>
          <div className="modal-header-actions">
            {project.youtubeUrl && (
              <a
                href={project.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-yt-link"
              >
                <span>Open on YouTube</span>
                <ExternalLink size={14} />
              </a>
            )}
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close video player"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="video-modal-stage">
          {project.localVideo ? (
            <video
              src={project.localVideo}
              controls
              autoPlay
              loop
              playsInline
              className="modal-video-element"
            />
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0`}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="modal-video-iframe"
            />
          )}
        </div>
      </div>
    </div>
  );
}
