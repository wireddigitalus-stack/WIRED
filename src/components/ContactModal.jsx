import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Mail } from 'lucide-react';
import { BRAND_INFO } from '../data/wiredData';

export default function ContactModal({ isOpen, onClose }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'AI Website Design, Redesign & Modernization + Generative SEO (GEO)',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem('wired_digital_leads') || '[]');
      const modalLead = {
        id: `lead_${Date.now()}`,
        createdAt: new Date().toISOString(),
        source: 'Header / Modal Lead Form',
        status: 'NEW',
        priority: 'HIGH',
        name: formState.name,
        contact: formState.email,
        companyUrl: '',
        service: formState.projectType,
        urgency: 'Ready to Start',
        details: formState.message
      };
      localStorage.setItem('wired_digital_leads', JSON.stringify([modalLead, ...existing]));
    } catch {
      // Ignore storage errors
    }
    const subject = encodeURIComponent(
      `[Wired Digital Inquiry] ${formState.projectType} — ${formState.name}`
    );
    const body = encodeURIComponent(
      `Name / Business: ${formState.name}\nEmail: ${formState.email}\nService Requested: ${formState.projectType}\n\nProject Details & Goals:\n${formState.message}`
    );
    window.location.href = `mailto:${BRAND_INFO.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="contact-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <div className="contact-header-brand">
            <img src={BRAND_INFO.logoSrc} alt="Wired Digital" className="modal-raven-icon" />
            <div>
              <span className="modal-kicker">BRISTOL VA/TN (TRI-CITIES) &amp; GLOBAL // EST. 1999</span>
              <h3 className="modal-title">START YOUR PROJECT OR AI SITE AUDIT</h3>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close contact modal"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="contact-success-view">
            <CheckCircle2 size={44} className="success-icon-yellow" />
            <h4>Your Email Client Is Ready!</h4>
            <p>
              Or reach out directly anytime at{' '}
              <a href={`mailto:${BRAND_INFO.email}`}>{BRAND_INFO.email}</a>
            </p>
            <button
              type="button"
              className="btn-wired-yellow"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
            >
              DONE
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="wd-name">YOUR NAME / BUSINESS / ARTIST</label>
                <input
                  id="wd-name"
                  type="text"
                  required
                  placeholder="e.g. Bristol Business / Label / Artist"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="wd-email">EMAIL ADDRESS</label>
                <input
                  id="wd-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="wd-type">WHAT ARE WE BUILDING TOGETHER?</label>
              <select
                id="wd-type"
                value={formState.projectType}
                onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
              >
                <option value="AI Website Design, Redesign & Modernization + Generative SEO (GEO)">
                  AI Website Design, Redesign &amp; Modernization + Generative SEO (GEO)
                </option>
                <option value="Full-Service Marketing, Brand Strategy & Growth Campaigns">
                  Full-Service Marketing, Brand Strategy &amp; Growth Campaigns
                </option>
                <option value="Custom Business Dashboard + Tri-Cities Local & AI Search">
                  Custom Business Dashboard + Tri-Cities AI Search (Bristol / JC / Kingsport)
                </option>
                <option value="Global Remote Music Video / Official Lyric Video Editing">
                  Global Remote Music Video / Official Lyric Video Editing
                </option>
                <option value="High-End Commissioned Directing / Custom Creative">
                  High-End Commissioned Production / Custom Creative
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="wd-msg">CURRENT WEBSITE URL OR PROJECT GOALS</label>
              <textarea
                id="wd-msg"
                rows={4}
                required
                placeholder="Share your current website URL (if requesting an AI website redesign / modernization or custom dashboard) or tell us about your global video editing project..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              />
            </div>

            <div className="contact-form-footer">
              <div className="direct-email-hint">
                <Mail size={14} />
                <span>Direct: </span>
                <a href={`mailto:${BRAND_INFO.email}`}>{BRAND_INFO.email}</a>
              </div>
              <button type="submit" className="btn-wired-yellow">
                <Send size={15} />
                <span>SEND INQUIRY</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
