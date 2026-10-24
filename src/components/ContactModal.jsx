import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Mail,
  Phone,
  Cpu,
  LayoutDashboard,
  Megaphone,
  Film,
  Zap
} from 'lucide-react';
import { BRAND_INFO } from '../data/wiredData';
import { addLead } from '../utils/telemetry';

const MODAL_SERVICE_CHIPS = [
  {
    id: 'ai-web',
    label: 'AI Website Design, Redesign & Modernization',
    shortLabel: '⚡ AI Website / Modernization',
    icon: Cpu
  },
  {
    id: 'ai-dash',
    label: 'Custom Live Dashboard / 24/7 AI Lead Chatbot',
    shortLabel: '📊 Custom Dash / 24/7 AI Bot',
    icon: LayoutDashboard
  },
  {
    id: 'geo-marketing',
    label: 'AI Search (GEO), Local SEO & Full-Service Marketing',
    shortLabel: '🚀 GEO / SEO & Marketing',
    icon: Megaphone
  },
  {
    id: 'video',
    label: 'Global Remote Music & Lyric Video Editing',
    shortLabel: '🎬 4K Music / Lyric Video',
    icon: Film
  }
];

export default function ContactModal({ isOpen, onClose }) {
  const [formState, setFormState] = useState({
    name: '',
    contact: '',
    companyUrl: '',
    projectType: MODAL_SERVICE_CHIPS[0].label,
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
    addLead({
      source: 'Quick Project Modal',
      status: 'NEW',
      priority: 'HIGH',
      name: formState.name.trim(),
      contact: formState.contact.trim(),
      companyUrl: formState.companyUrl.trim(),
      service: formState.projectType,
      urgency: 'Ready to Start (This Month)',
      details:
        formState.message.trim() ||
        `Quick Modal Inquiry for ${formState.projectType}`
    });
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="contact-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <div className="contact-header-brand">
            <img src={BRAND_INFO.logoSrc} alt="Wired Digital" className="modal-raven-icon" />
            <div>
              <span className="modal-kicker">30-SECOND PROJECT BRIEF // DIRECT TO ROB NEILSON</span>
              <h3 className="modal-title">LET&apos;S BUILD SOMETHING UNFORGETTABLE</h3>
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
            <CheckCircle2 size={46} className="success-icon-yellow" />
            <h4>Project Brief Locked &amp; Dispatched!</h4>
            <p>
              Thanks, <strong>{formState.name}</strong>! Your inquiry for{' '}
              <span className="text-yellow">{formState.projectType}</span> has been saved to our
              cloud database and sent directly to Creative Director <strong>Rob Neilson</strong>.
            </p>
            <p className="last-resort-phone-note" style={{ marginTop: '10px' }}>
              Email: <a href={`mailto:${BRAND_INFO.email}`}>{BRAND_INFO.email}</a>
              {' • '}
              <span>
                Time-sensitive / last-resort direct line:{' '}
                <a href={BRAND_INFO.phoneHref}>{BRAND_INFO.phone}</a>
              </span>
            </p>
            <button
              type="button"
              className="btn-wired-yellow"
              style={{ marginTop: '16px' }}
              onClick={() => {
                setSubmitted(false);
                setFormState({
                  name: '',
                  contact: '',
                  companyUrl: '',
                  projectType: MODAL_SERVICE_CHIPS[0].label,
                  message: ''
                });
                onClose();
              }}
            >
              DONE
            </button>
          </div>
        ) : (
          <form className="contact-form cool-easy-modal-form" onSubmit={handleSubmit}>
            {/* 1-Tap Project Type Chips */}
            <div className="form-group">
              <label>1. TAP WHAT WE&apos;RE BUILDING TOGETHER:</label>
              <div className="modal-chip-selector-grid">
                {MODAL_SERVICE_CHIPS.map((chip) => {
                  const isSelected = formState.projectType === chip.label;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      className={`modal-service-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => setFormState({ ...formState, projectType: chip.label })}
                    >
                      <span>{chip.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2 Simple Required Fields */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="wd-name">2. YOUR NAME OR BUSINESS *</label>
                <input
                  id="wd-name"
                  type="text"
                  required
                  placeholder="Name, Business, or Artist"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="wd-contact">3. BEST EMAIL OR MOBILE # *</label>
                <input
                  id="wd-contact"
                  type="text"
                  required
                  placeholder="you@company.com or (423) 555-0199"
                  value={formState.contact}
                  onChange={(e) => setFormState({ ...formState, contact: e.target.value })}
                />
              </div>
            </div>

            {/* Optional Website URL + Optional Quick Note */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="wd-url">CURRENT WEBSITE URL (OPTIONAL)</label>
                <input
                  id="wd-url"
                  type="text"
                  placeholder="yourbusiness.com (if you have one)"
                  value={formState.companyUrl}
                  onChange={(e) => setFormState({ ...formState, companyUrl: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="wd-msg">QUICK PROJECT NOTE (OPTIONAL)</label>
                <input
                  id="wd-msg"
                  type="text"
                  placeholder="Goals, timeline, or track details..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                />
              </div>
            </div>

            <div className="contact-form-footer">
              <div className="direct-contact-stack">
                <div className="direct-email-hint">
                  <Mail size={13} />
                  <span>Email: </span>
                  <a href={`mailto:${BRAND_INFO.email}`}>{BRAND_INFO.email}</a>
                </div>
                <div className="last-resort-phone-hint">
                  <Phone size={12} />
                  <span>Last-resort / urgent text or call: </span>
                  <a href={BRAND_INFO.phoneHref}>{BRAND_INFO.phone}</a>
                </div>
              </div>
              <button type="submit" className="btn-wired-yellow">
                <Zap size={15} fill="#050505" />
                <span>SEND TO ROB NEILSON →</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
