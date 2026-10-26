import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Play, ShieldCheck } from 'lucide-react';

const VEVO_RESTRICTED_VIDEO_IDS = new Set([
  'DkTGpDq6Pcg',
  'GCzKaAv8aFA',
  'v55qwxhF1UA',
  'w54CeorgMu4',
  'qlMV56gJLYY',
  'DF8po26yGho'
]);

export default function VideoLightboxModal({ project, onClose }) {
  const iframeRef = useRef(null);
  const [embedBlocked, setEmbedBlocked] = useState(false);

  const sendDisableCaptions = () => {
    try {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      win.postMessage(JSON.stringify({ event: 'listening' }), '*');
      win.postMessage(JSON.stringify({ event: 'command', func: 'unloadModule', args: ['captions'] }), '*');
      win.postMessage(JSON.stringify({ event: 'command', func: 'unloadModule', args: ['cc'] }), '*');
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    setEmbedBlocked(false);
    if (!project) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleYtMessage = (event) => {
      if (!event.origin || !event.origin.includes('youtube.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.event === 'onError' && (data.info === 101 || data.info === 150 || data.info === 153)) {
          setEmbedBlocked(true);
        }
        if (data?.event === 'onReady' || data?.event === 'onStateChange' || data?.event === 'infoDelivery') {
          sendDisableCaptions();
        }
      } catch {
        // Ignore non-JSON messages
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('message', handleYtMessage);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('message', handleYtMessage);
    };
  }, [project, onClose]);

  if (!project) return null;

  const isVevoProtected =
    !project.localVideo &&
    Boolean(
      project.vevoRestricted ||
        embedBlocked ||
        (project.youtubeId && VEVO_RESTRICTED_VIDEO_IDS.has(project.youtubeId))
    );

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
          ) : isVevoProtected ? (
            <div className="yt-vevo-cinema-fallback modal-vevo-stage">
              <img
                src={`https://i.ytimg.com/vi/${project.youtubeId}/hqdefault.jpg`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://i.ytimg.com/vi/${project.youtubeId}/0.jpg`;
                }}
                alt={project.title}
                className="yt-vevo-fallback-bg"
              />
              <div className="yt-vevo-fallback-overlay">
                <span className="yt-vevo-shield-pill">
                  <ShieldCheck size={14} />
                  <span>VEVO / MAJOR-LABEL COPYRIGHT PROTECTION // DIRECT YOUTUBE STREAM</span>
                </span>
                <h3 className="yt-vevo-fallback-title">{project.shortTitle || project.title}</h3>
                <p className="yt-vevo-fallback-sub">
                  VEVO &amp; major record label licensing require this official release to stream
                  directly on YouTube.
                </p>
                <div className="yt-vevo-fallback-actions">
                  <a
                    href={project.youtubeUrl || `https://www.youtube.com/watch?v=${project.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wired-yellow yt-vevo-watch-btn"
                  >
                    <Play size={16} fill="#050505" stroke="#050505" />
                    <span>WATCH OFFICIAL VEVO RELEASE ON YOUTUBE</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&rel=0&cc_load_policy=0&iv_load_policy=3&enablejsapi=1`}
              onLoad={sendDisableCaptions}
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
