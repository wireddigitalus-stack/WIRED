import React, { useState } from 'react';
import {
  Zap,
  Mail,
  Phone,
  Check,
  Copy,
  CheckCircle2,
  Cpu,
  LayoutDashboard,
  Megaphone,
  Film,
  MapPin,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { BRAND_INFO } from '../data/wiredData';
import { addLead, logTelemetryEvent } from '../utils/telemetry';

const BODY_CTA_CHIPS = [
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

export default function BodyCtaContactCard() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    companyUrl: '',
    service: BODY_CTA_CHIPS[0].label
  });

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(BRAND_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleChipSelect = (label) => {
    setFormState((prev) => ({ ...prev, service: label }));
    logTelemetryEvent(
      'BODY_CTA_CHIP_SELECT',
      `Selected service "${label}" in In-Body CTA Contact Card`,
      'engagement',
      'body_cta_card'
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name.trim() || (!formState.phone.trim() && !formState.email.trim())) return;

    const combinedContact = [formState.phone.trim(), formState.email.trim()]
      .filter(Boolean)
      .join(' • ');

    addLead({
      source: 'In-Body CTA Contact Card',
      status: 'NEW',
      priority: 'HIGH',
      name: formState.name.trim(),
      phone: formState.phone.trim(),
      email: formState.email.trim(),
      contact: combinedContact,
      companyUrl: formState.companyUrl.trim(),
      service: formState.service,
      urgency: 'Ready to Start (This Month)',
      details: `In-Body Contact Card Inquiry for ${formState.service}`
    });
    setSubmitted(true);
  };

  return (
    <section
      className="body-cta-contact-section"
      id="direct-contact-card"
      aria-label="Start a Project — Direct Contact Card with Wired Digital"
    >
      <div className="section-container">
        <div className="body-cta-bento-card">
          {/* LEFT COLUMN: Direct Wired Digital Authority + 1-Tap Phone & Email */}
          <div className="body-cta-info-col">
            <div className="body-cta-live-badge">
              <span className="rec-dot" />
              <span>DIRECT TO WIRED DIGITAL // EST. 1999</span>
            </div>

            <h2 className="body-cta-heading">
              LET&apos;S BUILD SOMETHING{' '}
              <span className="text-yellow">UNFORGETTABLE.</span>
            </h2>

            <p className="body-cta-lead m-hide">
              With <strong>Wired Digital</strong>, you&apos;re getting{' '}
              <strong>over 25 years of staying ahead of the tech curve</strong>—bringing{' '}
              <strong>
                custom AI website design, site modernization, Generative SEO (GEO), live
                admin dashboards, 24/7 AI chatbots, full-service marketing, and 4K video
              </strong>{' '}
              together under one roof. Zero agency middlemen, whether you&apos;re right
              here in the Tri-Cities (Bristol, VA/TN) or partnering remotely worldwide.
            </p>
            {/* Phone-length version of the same pitch */}
            <p className="body-cta-lead m-only">
              <strong>25+ years ahead of the tech curve.</strong> Web, AI, SEO, marketing
              and 4K video under one roof—no agency middlemen, in the Tri-Cities or worldwide.
            </p>

            {/* Direct Contact Action Tiles */}
            <div className="body-cta-direct-tiles">
              <a
                href={BRAND_INFO.phoneHref}
                className="body-cta-direct-tile"
                onClick={() =>
                  logTelemetryEvent(
                    'DIRECT_PHONE_CLICK',
                    'Clicked Call/Text 731-616-5121 in Body CTA Card',
                    'conversion',
                    'body_cta_card'
                  )
                }
              >
                <div className="body-cta-tile-icon">
                  <Phone size={18} />
                </div>
                <div className="body-cta-tile-text">
                  <span className="body-cta-tile-kicker">CALL OR TEXT WIRED DIGITAL</span>
                  <strong className="body-cta-tile-val">{BRAND_INFO.phone}</strong>
                </div>
              </a>

              <div className="body-cta-direct-tile email-tile">
                <div className="body-cta-tile-icon">
                  <Mail size={18} />
                </div>
                <div className="body-cta-tile-text">
                  <span className="body-cta-tile-kicker">DIRECT STUDIO EMAIL</span>
                  <a
                    href={`mailto:${BRAND_INFO.email}`}
                    className="body-cta-tile-val email-link"
                  >
                    {BRAND_INFO.email}
                  </a>
                </div>
                <button
                  type="button"
                  className="body-cta-copy-btn"
                  onClick={handleCopyEmail}
                  title="Copy Studio Email"
                >
                  {copiedEmail ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedEmail ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>

            {/* Trust & Market Strip */}
            <div className="body-cta-trust-pills">
              <span className="body-cta-trust-item">
                <MapPin size={13} className="text-yellow" />
                <span>Bristol • Johnson City • Kingsport • Abingdon &amp; Nationwide</span>
              </span>
              <span className="body-cta-trust-item">
                <ShieldCheck size={13} className="text-yellow" />
                <span>Flat-Rate Pricing • Same-Day Response</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Always-Open 30-Second Inline Project Brief Form */}
          <div className="body-cta-form-col">
            {submitted ? (
              <div className="body-cta-success-box">
                <CheckCircle2 size={46} className="success-icon-yellow" />
                <h3>Project Brief Locked &amp; Dispatched!</h3>
                <p>
                  Thanks, <strong>{formState.name}</strong>! Your inquiry for{' '}
                  <span className="text-yellow">{formState.service}</span> has been
                  dispatched directly to the <strong>WIRED_OS Command Center</strong>.
                </p>
                <p className="body-cta-success-contact">
                  Direct Call or Text: <a href={BRAND_INFO.phoneHref}>{BRAND_INFO.phone}</a>
                  {' • '}
                  Email: <a href={`mailto:${BRAND_INFO.email}`}>{BRAND_INFO.email}</a>
                </p>
                <button
                  type="button"
                  className="btn-wired-yellow"
                  onClick={() => {
                    setSubmitted(false);
                    setFormState({
                      name: '',
                      phone: '',
                      email: '',
                      companyUrl: '',
                      service: BODY_CTA_CHIPS[0].label
                    });
                  }}
                >
                  SEND ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form className="body-cta-form" onSubmit={handleSubmit}>
                <div className="body-cta-form-header">
                  <span className="body-cta-form-kicker">
                    <Sparkles size={13} className="text-yellow" />
                    <span>30-SECOND PROJECT BRIEF // INSTANT DISPATCH</span>
                  </span>
                  <h3>Start Your Project or Request a Free Site Audit</h3>
                </div>

                {/* 1-Tap Service Chips */}
                <div className="body-cta-field-group">
                  <label className="body-cta-label">WHAT WE&apos;RE BUILDING</label>
                  <div className="body-cta-chips-grid">
                    {BODY_CTA_CHIPS.map((chip) => {
                      const isSelected = formState.service === chip.label;
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          className={`body-cta-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => handleChipSelect(chip.label)}
                        >
                          <span>{chip.shortLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Phone Row */}
                <div className="body-cta-input-row">
                  <div className="body-cta-field-group">
                    <label htmlFor="body-cta-name" className="body-cta-label">
                      NAME OR BUSINESS *
                    </label>
                    <input
                      id="body-cta-name"
                      type="text"
                      required
                      placeholder="Name, Business, or Artist"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="body-cta-input"
                    />
                  </div>

                  <div className="body-cta-field-group">
                    <label htmlFor="body-cta-phone" className="body-cta-label">
                      PHONE NUMBER *
                    </label>
                    <input
                      id="body-cta-phone"
                      type="tel"
                      required
                      placeholder="(423) 555-0199"
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      className="body-cta-input"
                    />
                  </div>
                </div>

                {/* Email Address & Website URL Row */}
                <div className="body-cta-input-row">
                  <div className="body-cta-field-group">
                    <label htmlFor="body-cta-email" className="body-cta-label">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      id="body-cta-email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="body-cta-input"
                    />
                  </div>

                  <div className="body-cta-field-group">
                    <label htmlFor="body-cta-url" className="body-cta-label">
                      WEBSITE URL (OPTIONAL)
                    </label>
                    <input
                      id="body-cta-url"
                      type="text"
                      placeholder="yourbusiness.com"
                      value={formState.companyUrl}
                      onChange={(e) =>
                        setFormState({ ...formState, companyUrl: e.target.value })
                      }
                      className="body-cta-input"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-wired-yellow body-cta-submit-btn">
                  <Zap size={16} fill="#050505" />
                  <span>SEND DIRECT TO WIRED DIGITAL →</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
