import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Check,
  Copy,
  Send,
  ChevronDown,
  ChevronUp,
  Zap,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Cpu,
  LayoutDashboard,
  Film,
  Globe,
  Megaphone
} from 'lucide-react';
import { BRAND_INFO } from '../data/wiredData';
import { addLead, logTelemetryEvent } from '../utils/telemetry';

const QUICK_SERVICES = [
  {
    id: 'ai-web',
    label: 'AI Website Design, Redesign & Modernization',
    shortLabel: 'AI Web & Modernization',
    icon: Cpu
  },
  {
    id: 'marketing',
    label: 'Full-Service Marketing & Brand Growth',
    shortLabel: 'Full-Service Marketing',
    icon: Megaphone
  },
  {
    id: 'ai-dash',
    label: 'Custom Live Dashboard / 24/7 AI Lead Chatbot',
    shortLabel: 'Custom Dash & 24/7 AI Bot',
    icon: LayoutDashboard
  },
  {
    id: 'geo-seo',
    label: 'Tri-Cities Local SEO & AI Search (GEO)',
    shortLabel: 'AI-Era Search (GEO)',
    icon: Globe
  },
  {
    id: 'video',
    label: 'Global Remote Music & Lyric Video Editing',
    shortLabel: 'Global Video Editing',
    icon: Film
  }
];

export default function YellowFooter({ onOpenContact, onNavigateTab }) {
  const [copied, setCopied] = useState(false);
  const [formExpanded, setFormExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    companyUrl: '',
    service: QUICK_SERVICES[0].label,
    urgency: 'Ready to Start (This Month)',
    details: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(BRAND_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleQuickSelectAndOpen = (serviceLabel) => {
    setFormState((prev) => ({ ...prev, service: serviceLabel }));
    setSubmitted(false);
    setFormExpanded(true);
    logTelemetryEvent(
      'FOOTER_LEAD_DRAWER_OPEN',
      `Visitor opened Footer Lead Form for "${serviceLabel}"`,
      'engagement',
      'footer_lead_drawer'
    );
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    const combinedContact = [formState.phone.trim(), formState.email.trim()]
      .filter(Boolean)
      .join(' • ');
    addLead({
      source: 'Footer Collapsible Form',
      status: 'NEW',
      priority: 'HIGH',
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      email: formState.email.trim(),
      contact: combinedContact,
      companyUrl: formState.companyUrl.trim(),
      service: formState.service,
      urgency: 'Ready to Start (This Month)',
      details: `Footer Lead Form Inquiry for ${formState.service}`
    });
    setSubmitted(true);
  };

  const triggerMailtoFallback = () => {
    const subject = encodeURIComponent(
      `[Wired Digital Inquiry] ${formState.service} — ${formState.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formState.name}\nPhone: ${formState.phone}\nEmail: ${formState.email}\nService: ${formState.service}`
    );
    window.location.href = `mailto:${BRAND_INFO.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Pre-Footer Social & Telemetry Strip on Obsidian Canvas */}
      <div className="pre-footer-bar">
        <div className="section-container pre-footer-inner">
          <div className="pre-footer-status">
            <span className="pulse-dot" />
            <span>BRISTOL VA/TN (TRI-CITIES) &amp; GLOBAL REMOTE STUDIO // EST. 1999</span>
          </div>

          <div className="pre-footer-socials">
            <a
              href={BRAND_INFO.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-icon"
              aria-label="Wired Digital on YouTube"
              title="YouTube — @WiredDigitalCreative"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-icon"
              aria-label="Wired Digital on Instagram"
              title="Instagram"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a
              href={BRAND_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-icon"
              aria-label="Wired Digital on Facebook"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Modernized Electric-Yellow Finale Footer with Collapsible iOS Obsidian Lead Drawer */}
      <footer className="yellow-finale-footer" id="contact">
        <div className="footer-modern-shell">
          {/* Top Brand & Gratitude Header Card */}
          <div className="footer-top-bento">
            <div className="footer-gratitude-col">
              <div className="footer-brand-row">
                <img
                  src={BRAND_INFO.roundStampSrc}
                  alt="Wired Digital Est. 1999"
                  className="footer-mini-stamp"
                />
                <div>
                  <span className="footer-kicker-tag">WIRED DIGITAL CREATIVE • SINCE 1999</span>
                  <h3 className="footer-thank-you-title">
                    Thank You to all our Amazing Clients!
                  </h3>
                </div>
              </div>
              <p className="footer-thank-you-copy">
                It&apos;s been an incredible journey, over 25 years of creating cool stuff
                for cool people. And it just keeps getting better. I look forward to the
                next 25!
              </p>
            </div>

            {/* Direct Contact & Quick Copy Pill */}
            <div className="footer-direct-col">
              <span className="footer-direct-label">DIRECT STUDIO LINE</span>
              <div className="footer-email-pill-box">
                <Mail size={16} className="footer-mail-icon" />
                <a href={`mailto:${BRAND_INFO.email}`} className="footer-email-link">
                  {BRAND_INFO.email}
                </a>
                <button
                  type="button"
                  className="footer-copy-btn"
                  onClick={handleCopyEmail}
                  title="Copy email address"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
              <span className="footer-response-note">
                Direct response from Wired Digital
                <br />
                Call or text:{' '}
                <a href={BRAND_INFO.phoneHref} className="footer-last-resort-tel">
                  {BRAND_INFO.phone}
                </a>
              </span>
            </div>
          </div>

          {/* SEXY COLLAPSIBLE iOS OBSIDIAN LEAD CONCIERGE DRAWER */}
          <div className={`footer-lead-Vault ${formExpanded ? 'is-expanded' : ''}`}>
            {/* Collapsible Trigger Header */}
            <div className="lead-vault-header">
              <div className="lead-vault-title-group" onClick={() => setFormExpanded(!formExpanded)}>
                <div className="lead-vault-bolt-badge">
                  <Zap size={16} fill="#FFEE00" color="#FFEE00" />
                </div>
                <div>
                  <div className="lead-vault-eyebrow">
                    <span className="live-green-dot" />
                    <span>START A PROJECT // INSTANT LEAD DISPATCH</span>
                  </div>
                  <h4 className="lead-vault-heading">
                    Ready to modernize your site, build a custom AI dashboard, or create your next music video?
                  </h4>
                </div>
              </div>

              <div className="lead-vault-trigger-actions">
                {!formExpanded && (
                  <div className="lead-quick-chips">
                    {QUICK_SERVICES.map((srv) => {
                      const Icon = srv.icon;
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          className="lead-quick-chip"
                          onClick={() => handleQuickSelectAndOpen(srv.label)}
                        >
                          <Icon size={12} />
                          <span>{srv.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <button
                  type="button"
                  className="lead-vault-toggle-btn"
                  onClick={() => setFormExpanded(!formExpanded)}
                  aria-expanded={formExpanded}
                >
                  <span>{formExpanded ? 'CLOSE FORM' : 'OPEN QUICK LEAD FORM'}</span>
                  {formExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* Smooth Accordion Body */}
            <div className="lead-vault-collapsible">
              <div className="lead-vault-collapsible-inner">
                {submitted ? (
                  <div className="footer-lead-success">
                    <CheckCircle2 size={42} className="success-icon-yellow" />
                    <h4>Lead Logged &amp; Ready for Dispatch!</h4>
                    <p>
                      Thanks, <strong>{formState.name}</strong>! Your project inquiry for{' '}
                      <span className="text-yellow">{formState.service}</span> has been
                      logged in the Wired Digital Lead Vault.
                    </p>
                    <div className="footer-lead-success-btns">
                      <button
                        type="button"
                        className="btn-wired-yellow"
                        onClick={triggerMailtoFallback}
                      >
                        <Send size={14} />
                        <span>SEND INSTANT EMAIL COPY</span>
                      </button>
                      <button
                        type="button"
                        className="btn-wired-outline"
                        onClick={() => {
                          setSubmitted(false);
                          setFormExpanded(false);
                        }}
                      >
                        DONE
                      </button>
                    </div>
                  </div>
                ) : (
                  <form className="footer-lead-form" onSubmit={handleLeadSubmit}>
                    {/* Interactive Service Pill Selector */}
                    <div className="footer-service-selector">
                      <span className="footer-field-label">1. SELECT WHAT WE ARE BUILDING:</span>
                      <div className="footer-service-pills-grid">
                        {QUICK_SERVICES.map((srv) => {
                          const Icon = srv.icon;
                          const isSelected = formState.service === srv.label;
                          return (
                            <button
                              key={srv.id}
                              type="button"
                              className={`footer-srv-pill ${isSelected ? 'active' : ''}`}
                              onClick={() =>
                                setFormState({ ...formState, service: srv.label })
                              }
                            >
                              <Icon size={14} />
                              <span>{srv.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3-Column Fast & Effortless Input Row */}
                    <div className="footer-form-grid-3">
                      <div className="footer-input-group">
                        <label htmlFor="ft-lead-name">2. YOUR NAME OR BUSINESS *</label>
                        <input
                          id="ft-lead-name"
                          type="text"
                          required
                          placeholder="Name, Business, or Artist"
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                        />
                      </div>

                      <div className="footer-input-group">
                        <label htmlFor="ft-lead-phone">3. PHONE NUMBER *</label>
                        <input
                          id="ft-lead-phone"
                          type="tel"
                          required
                          placeholder="(423) 555-0199"
                          value={formState.phone}
                          onChange={(e) =>
                            setFormState({ ...formState, phone: e.target.value })
                          }
                        />
                      </div>

                      <div className="footer-input-group">
                        <label htmlFor="ft-lead-email">4. EMAIL ADDRESS *</label>
                        <input
                          id="ft-lead-email"
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({ ...formState, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Sleek Action & Direct Contact Bar */}
                    <div className="footer-fast-submit-bar">
                      <div className="footer-last-resort-note">
                        <Phone size={13} />
                        <span>
                          Dispatches directly to the WIRED_OS Command Center • Direct Call/Text:{' '}
                          <a href={BRAND_INFO.phoneHref}>{BRAND_INFO.phone}</a>
                        </span>
                      </div>

                      <button type="submit" className="btn-wired-yellow footer-submit-btn">
                        <Zap size={15} fill="#050505" />
                        <span>SEND TO WIRED DIGITAL →</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Clean Modernized Bottom Navigation & Copyright Bar */}
          <div className="footer-bottom-bar">
            <div className="footer-nav-links">
              <button type="button" onClick={() => onNavigateTab('home')}>
                HOME
              </button>
              <span className="footer-dot">•</span>
              <button type="button" onClick={() => onNavigateTab('web')}>
                AI WEB &amp; SEO
              </button>
              <span className="footer-dot">•</span>
              <button type="button" onClick={() => onNavigateTab('video')}>
                VIDEO PRODUCTION
              </button>
              <span className="footer-dot">•</span>
              <button type="button" onClick={onOpenContact}>
                START A PROJECT
              </button>
              {/* WIRED_OS Admin launcher intentionally removed from the public footer.
                  Owner access: visit /#admin (then refresh) or press Cmd/Ctrl + Shift + D. */}
            </div>

            <p className="footer-copyright">
              © MMXXVI WIRED DIGITAL LLC • EST. 1999 • BRISTOL VA/TN &amp; GLOBAL
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
