import React, { useState } from 'react';
import {
  Code2,
  Cpu,
  Globe,
  Layers,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Rocket,
  Search,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  AlertTriangle,
  Activity,
  Bot,
  Film,
  Megaphone
} from 'lucide-react';
import { WEB_CREATION_SERVICES } from '../data/wiredData';
import { addLead, logTelemetryEvent } from '../utils/telemetry';
import { normalizeDomain, runWebsiteDiagnostic } from '../utils/websiteDiagnostic';

export default function WebCreationView({ onOpenContact, onNavigateTab }) {
  // Interactive On-Page 60-Second Website AI & Search Grader State
  const [scanUrl, setScanUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [blueprintSent, setBlueprintSent] = useState(false);

  // Interactive Before / After AI Modernization Slider State (0 to 100)
  const [sliderPos, setSliderPos] = useState(50);

  const handleRunGrader = async (e) => {
    e.preventDefault();
    const { cleanDomain } = normalizeDomain(scanUrl);
    if (!cleanDomain) return;

    setIsScanning(true);
    setBlueprintSent(false);
    logTelemetryEvent('WEBSITE_GRADER_SCAN', `Scanned URL: ${cleanDomain}`, 'ai_geo');

    const report = await runWebsiteDiagnostic(scanUrl);
    setIsScanning(false);
    if (report) {
      setScanResult(report);
    }
  };

  const handleSendBlueprintLead = (e) => {
    e.preventDefault();
    if (!leadPhone.trim() && !leadContact.trim()) return;
    const combinedContact = [leadPhone.trim(), leadContact.trim()]
      .filter(Boolean)
      .join(' • ');
    addLead({
      source: 'On-Page 60-Second AI Website Grader',
      name: leadName.trim() || `Website Grader Lead (${scanResult?.domain || 'Site Scan'})`,
      phone: leadPhone.trim(),
      email: leadContact.trim(),
      contact: combinedContact,
      companyUrl: scanResult?.fullUrl || scanUrl.trim(),
      service: 'AI Website Design, Redesign & Modernization + GEO',
      urgency: 'Ready to Start (This Month)',
      details: `Requested full AI & Search Modernization Blueprint after scanning ${scanResult?.domain || scanUrl}.`
    });
    setBlueprintSent(true);
  };

  return (
    <div className="subview-page web-creation-view">
      {/* Subpage Hero */}
      <section className="subview-hero">
        <div className="section-container">
          <div className="eyebrow-tag">
            <Cpu size={14} />
            <span>WIRED DIGITAL // AI WEBSITE DESIGN, REDESIGN, CUSTOM APPS &amp; GENERATIVE SEO (GEO)</span>
          </div>
          <h1 className="subview-hero-title">
            WEBSITE <span className="text-yellow">DESIGN, REDESIGN</span> &amp; AI MODERNIZATION
          </h1>
          <p className="subview-hero-lead web-hero-lead-structured">
            <span className="web-hero-lead-top">
              Engineered with as high-end <strong>SEO &amp; Generative Engine Optimization (GEO)</strong> architecture as it gets—built for maximum organic visibility across{' '}
              <strong>Google Search, ChatGPT, Google AI Overviews, Gemini, and Perplexity</strong> in{' '}
              <strong>Bristol, Johnson City, Kingsport, Abingdon, and nationwide</strong>.
            </span>{' '}
            <span className="web-hero-lead-cols">
              <span className="web-hero-lead-card">
                When you partner with Wired Digital, you are investing in{' '}
                <strong>25+ years of real-world experience (Est. 1999)</strong> and a relentless track
                record of <strong>staying ahead of every major technology wave</strong>—from early web
                and mobile to custom apps, live telemetry dashboards, and AI-era search.
              </span>{' '}
              <span className="web-hero-lead-card web-hero-lead-card--gold">
                We aren&apos;t cheap bargain-bin template builders, and we aren&apos;t a bloated agency marking up 10
                middlemen: we deliver{' '}
                <span className="text-yellow">
                  high-impact custom engineering at straightforward, flat-rate
                  pricing—with web, apps, software, AI &amp; full-service digital marketing all under one roof.
                </span>
              </span>
            </span>
          </p>

          <div className="subview-hero-actions">
            <button type="button" className="btn-wired-yellow" onClick={onOpenContact}>
              BUILD YOUR SITE OR AI APP
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          COMPETITIVE MOAT: ALL SKILLS UNDER 1 ROOF VS. LOCAL WORDPRESS SHOPS
         ==================================================================== */}
      <section className="boutique-under-one-roof-section">
        <div className="section-container">
          <div className="boutique-roof-shell">
            <div className="boutique-roof-top">
              <div>
                <span className="eyebrow-tag">
                  <ShieldCheck size={14} />
                  <span>WHY NO LOCAL AGENCY CAN MATCH THIS STACK // EST. 1999</span>
                </span>
                <h2 className="section-title-tracked" style={{ marginTop: '0.5rem' }}>
                  ALL SKILLS <span className="text-yellow">UNDER ONE ROOF</span>
                </h2>
                <p className="boutique-roof-lead">
                  Most web shops in <strong>Bristol, Johnson City, and Kingsport</strong> are either
                  promotional/WordPress template agencies installing slow plugins and locking you into
                  monthly retainers, or big traditional ad agencies charging $25K+ to coordinate four
                  different subcontractors.
                </p>
                <p className="boutique-roof-sublead">
                  At <strong>Wired Digital</strong> (and as a partner in Bristol-based AI &amp; native
                  iOS app studio{' '}
                  <a
                    href="https://app4thatholdings.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow"
                    style={{ textDecoration: 'underline' }}
                  >
                    <strong>App4That Holdings</strong>
                  </a>
                  ), we engineer your <strong>custom website, live admin dashboard, 24/7 AI lead chatbot, native apps, and Generative SEO (GEO)</strong> directly in-house—with custom video creative included in our top-tier full-service marketing packages.
                </p>
              </div>

              <div className="boutique-value-comparison-box">
                <div className="boutique-compare-tier">
                  <span className="tier-pill bad">
                    <AlertTriangle size={11} /> TYPICAL LOCAL WORDPRESS / PROMO SHOPS
                  </span>
                  <p>
                    Bloated WordPress themes, 30+ fragile plugins, hidden pricing behind sales calls,
                    static contact forms, and zero custom AI chatbots or live owner telemetry dashboards.
                  </p>
                </div>

                <div className="boutique-compare-tier">
                  <span className="tier-pill bad">
                    <AlertTriangle size={11} /> TRADITIONAL MULTI-VENDOR AD AGENCIES
                  </span>
                  <p>
                    $15,000–$35,000+ markups and forced monthly retainers because you are paying
                    separate middlemen for web dev, custom software, SEO, and marketing campaigns.
                  </p>
                </div>

                <div className="boutique-compare-tier highlight-tier">
                  <span className="tier-pill gold">
                    <Zap size={11} fill="#050505" /> WIRED DIGITAL // ALL SKILLS UNDER 1 ROOF
                  </span>
                  <p>
                    <strong>25+ Years Ahead of the Curve (Est. 1999):</strong> Sub-0.4s custom React
                    websites, live <code>/admin</code> telemetry dashboards, 24/7 custom-trained AI
                    concierges, native iOS/AI apps (Partner in <strong>App4That Holdings</strong>), and
                    top-tier full-service marketing—at straightforward flat-rate pricing.
                  </p>
                </div>
              </div>
            </div>

            <div className="under-one-roof-grid">
              <div className="roof-skill-card">
                <Code2 size={20} className="text-yellow" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4>Sub-0.4s Custom Web &amp; Redesigns</h4>
                  <p>Pure custom React &amp; edge architecture—never slow WordPress or Wix templates.</p>
                </div>
              </div>

              <div className="roof-skill-card">
                <Activity size={20} className="text-yellow" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4>Live Owner Admin Dashboards</h4>
                  <p>Real-time visitor click streams, lead pipelines &amp; CRM portals (Fast Track &amp; Ringger Law).</p>
                </div>
              </div>

              <div className="roof-skill-card">
                <Bot size={20} className="text-yellow" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4>24/7 Custom-Trained AI Chatbots</h4>
                  <p>Trained on your exact properties, inventory &amp; services to match buyers 24/7 (Team Vision LLC).</p>
                </div>
              </div>

              <div className="roof-skill-card">
                <Cpu size={20} className="text-yellow" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4>Native iOS &amp; AI Apps (App4That Partner)</h4>
                  <p>Partner in Bristol-based App4That Holdings—engineering native Apple iOS &amp; Google Vertex AI apps.</p>
                </div>
              </div>

              <div className="roof-skill-card">
                <Globe size={20} className="text-yellow" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4>High-End SEO &amp; Generative AI (GEO)</h4>
                  <p>5-node Schema.org @graph + /llms.txt built for maximum visibility in Google Local Pack, ChatGPT &amp; Gemini.</p>
                </div>
              </div>

              <div className="roof-skill-card">
                <Megaphone size={20} className="text-yellow" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4>Top-Tier Full-Service Marketing</h4>
                  <p>Omnichannel growth, brand identity, ad funnels &amp; custom commercial video in top-tier packages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          NEW PILLAR 2A: LIVE ON-PAGE "60-SECOND WEBSITE AI & SEARCH GRADER"
         ==================================================================== */}
      <section className="live-website-grader-section" id="website-grader">
        <div className="section-container">
          <div className="grader-console-card">
            <div className="grader-console-header">
              <div>
                <span className="eyebrow-tag">
                  <Sparkles size={14} />
                  <span>INTERACTIVE DIAGNOSTIC // 60-SECOND AI &amp; SEARCH GRADER</span>
                </span>
                <h2 className="grader-title">
                  IS YOUR CURRENT WEBSITE <span className="text-yellow">INVISIBLE TO AI SEARCH?</span>
                </h2>
                <p className="grader-subtitle">
                  Enter your website URL below to test how your current platform performs against
                  modern speed, Schema.org JSON-LD entity structure, and ChatGPT / Google AI
                  Overviews citation standards.
                </p>
              </div>
              <div className="grader-live-badge">
                <span className="rec-dot" />
                <span>WIRED_OS // DIAGNOSTIC READY</span>
              </div>
            </div>

            <form className="grader-input-bar" onSubmit={handleRunGrader}>
              <div className="grader-url-field-wrap">
                <Search size={18} className="grader-search-icon" />
                <input
                  type="text"
                  className="grader-url-input"
                  placeholder="Enter your website URL (e.g., yourbusiness.com)..."
                  value={scanUrl}
                  onChange={(e) => setScanUrl(e.target.value)}
                  aria-label="Website URL to scan"
                />
              </div>
              <button type="submit" className="btn-wired-yellow grader-submit-btn" disabled={isScanning}>
                {isScanning ? 'SCANNING DOM & AI SCHEMA...' : 'RUN AI & SEO DIAGNOSTIC →'}
              </button>
            </form>

            {scanResult && (
              <div className="grader-results-panel">
                <div className="grader-results-top">
                  <div className="grader-target-info">
                    <span className="grader-target-kicker">DIAGNOSTIC REPORT FOR:</span>
                    <strong className="grader-target-domain">{scanResult.domain.toUpperCase()}</strong>
                  </div>
                  <div className="grader-score-badges">
                    <div className={`grader-score-pill ${scanResult.isVerifiedWired ? 'modernized' : 'legacy'}`}>
                      <span>{scanResult.isVerifiedWired ? 'VERIFIED AI READINESS:' : 'SCANNED AI READINESS:'}</span>
                      <strong>{scanResult.overallGrade}</strong>
                    </div>
                    <ArrowRight size={16} className="text-yellow" />
                    <div className="grader-score-pill modernized">
                      <span>{scanResult.isVerifiedWired ? 'ARCHITECTURE:' : 'POST-MODERNIZATION TARGET:'}</span>
                      <strong>{scanResult.upgradedGrade}</strong>
                    </div>
                  </div>
                </div>

                {scanResult.summaryBanner && (
                  <div className="grader-blueprint-success">
                    <CheckCircle2 size={18} className="text-yellow" />
                    <span>{scanResult.summaryBanner}</span>
                  </div>
                )}

                <div className="grader-metrics-grid">
                  {scanResult.metrics.map((m) => (
                    <div key={m.label} className={`grader-metric-card ${m.passed ? 'passed-card' : ''}`}>
                      <span className={`grader-metric-status ${m.passed ? 'passed' : ''}`}>{m.status}</span>
                      <h4>{m.label}</h4>
                      <div className="grader-metric-compare">
                        <div className={`metric-line ${m.passed ? 'good' : 'bad'}`}>
                          <span>{m.currentLabel || 'Scanned State:'}</span>
                          <strong>{m.current}</strong>
                        </div>
                        <div className="metric-line good">
                          <span>{m.targetLabel || 'Wired AI Upgrade:'}</span>
                          <strong>{m.target}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!blueprintSent ? (
                  <form className="grader-blueprint-capture" onSubmit={handleSendBlueprintLead}>
                    <div className="blueprint-capture-copy">
                      <strong>
                        {scanResult.isVerifiedWired
                          ? 'Want WIRED DIGITAL to build this exact A+ (99/100) Wired AI Architecture for your business?'
                          : `Want WIRED DIGITAL to send a custom Modernization Blueprint for ${scanResult.domain}?`}
                      </strong>
                      <span>Dispatches directly to the WIRED_OS Command Center.</span>
                    </div>
                    <div className="blueprint-capture-inputs">
                      <input
                        type="text"
                        placeholder="Your Name / Business *"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        required
                        className="grader-lead-input"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        required
                        className="grader-lead-input"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        value={leadContact}
                        onChange={(e) => setLeadContact(e.target.value)}
                        required
                        className="grader-lead-input"
                      />
                      <button type="submit" className="btn-wired-yellow">
                        SEND MY BLUEPRINT →
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grader-blueprint-success">
                    <CheckCircle2 size={18} className="text-yellow" />
                    <span>
                      <strong>BLUEPRINT REQUEST LOCKED!</strong> Dispatched directly to the WIRED_OS Command Center.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          NEW PILLAR 2B: INTERACTIVE "BEFORE VS. AFTER AI MODERNIZATION" SLIDER
         ==================================================================== */}
      <section className="before-after-modernization-section">
        <div className="section-container">
          <div className="subview-section-head">
            <span className="eyebrow-tag">
              <SlidersHorizontal size={14} />
              <span>VISUAL &amp; ARCHITECTURAL TRANSFORMATION</span>
            </span>
            <h2 className="section-title-tracked">
              BEFORE &amp; AFTER <span className="text-yellow">AI SITE MODERNIZATION</span>
            </h2>
            <p className="subview-hero-lead" style={{ marginTop: '0.6rem' }}>
              Drag the comparison slider or click below to see the difference between a slow,
              invisible legacy template website and a custom-engineered Wired Digital AI platform.
            </p>
          </div>

          <div className="modernization-slider-stage">
            <div className="modernization-quick-toggles">
              <button
                type="button"
                className={`mod-toggle-btn ${sliderPos <= 25 ? 'active-legacy' : ''}`}
                onClick={() => setSliderPos(15)}
              >
                <AlertTriangle size={14} />
                <span>SHOW OUTDATED LEGACY SITE</span>
              </button>
              <button
                type="button"
                className={`mod-toggle-btn ${sliderPos > 25 && sliderPos < 75 ? 'active-split' : ''}`}
                onClick={() => setSliderPos(50)}
              >
                <SlidersHorizontal size={14} />
                <span>50 / 50 SPLIT COMPARISON</span>
              </button>
              <button
                type="button"
                className={`mod-toggle-btn ${sliderPos >= 75 ? 'active-wired' : ''}`}
                onClick={() => setSliderPos(88)}
              >
                <Zap size={14} />
                <span>SHOW WIRED AI MODERNIZATION</span>
              </button>
            </div>

            <div className="modernization-split-grid">
              {/* LEFT SIDE: OUTDATED LEGACY TEMPLATE */}
              <div
                className="mod-column legacy-col"
                style={{
                  opacity: sliderPos > 80 ? 0.45 : 1,
                  transform: sliderPos < 30 ? 'scale(1.01)' : 'scale(1)'
                }}
              >
                <div className="mod-col-header bad">
                  <span className="mod-status-pill bad">BEFORE // OUTDATED LEGACY TEMPLATE</span>
                  <span className="mod-score-tag">LOAD: 4.8s • AI SCORE: 14/100</span>
                </div>
                <div className="mod-col-body">
                  <h3>Generic WordPress / Wix Template Bloat</h3>
                  <ul className="mod-feature-list">
                    <li>
                      <span className="mod-tag bad">SLOW MOBILE UX</span>
                      <p>4.8-second load times and clunky mobile menus that lose over 60% of phone traffic before the page renders.</p>
                    </li>
                    <li>
                      <span className="mod-tag bad">INVISIBLE TO AI</span>
                      <p>Zero Schema.org JSON-LD entity graphs—meaning ChatGPT, Google AI Overviews, and Perplexity skip right over your business.</p>
                    </li>
                    <li>
                      <span className="mod-tag bad">DEAD LEAD FORMS</span>
                      <p>Static &ldquo;Contact Us&rdquo; forms with no 24/7 AI advisor to answer customer questions at night or on weekends.</p>
                    </li>
                    <li>
                      <span className="mod-tag bad">ZERO TELEMETRY</span>
                      <p>Flying blind with no custom admin dashboard showing which products, properties, or services customers are clicking.</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* RIGHT SIDE: WIRED DIGITAL AI-MODERNIZED PLATFORM */}
              <div
                className="mod-column wired-col"
                style={{
                  opacity: sliderPos < 20 ? 0.55 : 1,
                  transform: sliderPos > 70 ? 'scale(1.01)' : 'scale(1)'
                }}
              >
                <div className="mod-col-header good">
                  <span className="mod-status-pill good">
                    <Zap size={12} fill="#050505" /> AFTER // WIRED AI-MODERNIZED SITE
                  </span>
                  <span className="mod-score-tag gold">LOAD: 0.36s • AI SCORE: 99/100</span>
                </div>
                <div className="mod-col-body">
                  <h3>Custom-Engineered AI &amp; GEO Revenue Engine</h3>
                  <ul className="mod-feature-list">
                    <li>
                      <span className="mod-tag good">SUB-0.4s VELOCITY</span>
                      <p>Instant edge-cached architecture with iOS Liquid Glass tactile polish and 99+ Google Core Web Vitals.</p>
                    </li>
                    <li>
                      <span className="mod-tag good">HIGH-END SEO &amp; GEO</span>
                      <p>Full JSON-LD Entity Graph + <code>/llms.txt</code> manifest engineered for top-tier ChatGPT, Gemini, and Google Local Pack visibility.</p>
                    </li>
                    <li>
                      <span className="mod-tag good">24/7 AI CONCIERGE</span>
                      <p>Custom-trained 24/7 AI advisor (like Team Vision LLC &amp; WIRED-64) that qualifies and captures leads while you sleep.</p>
                    </li>
                    <li>
                      <span className="mod-tag good">LIVE ADMIN DASH</span>
                      <p>Custom backend telemetry dashboard (like Fast Track Bristol) tracking live clicks, leads, and ROI in real time.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="modernization-range-bar">
              <span className="range-lbl">LEGACY SITE</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="modernization-range-input"
                aria-label="Comparison emphasis slider"
              />
              <span className="range-lbl gold">WIRED AI SITE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Engineering Pillars Strip */}
      <section className="web-tech-strip">
        <div className="section-container">
          <div className="tech-pillars-row">
            <div className="tech-pillar-box">
              <div className="tech-icon-wrap">
                <Cpu size={22} />
              </div>
              <div>
                <h3>AI-Native Architecture</h3>
                <p>Custom LLM workflows, intelligent search, automated content engines, and smart user experiences.</p>
              </div>
            </div>

            <div className="tech-pillar-box">
              <div className="tech-icon-wrap">
                <Zap size={22} />
              </div>
              <div>
                <h3>Sub-Second Performance</h3>
                <p>Engineered for instant load times, 99+ Core Web Vitals, and zero template bloat on mobile &amp; desktop.</p>
              </div>
            </div>

            <div className="tech-pillar-box">
              <div className="tech-icon-wrap">
                <Layers size={22} />
              </div>
              <div>
                <h3>Bespoke UI/UX Artistry</h3>
                <p>Every layout, interaction, and graphic element is custom-crafted to command attention and convert.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Web & AI Engineering Services */}
      <section className="subview-services-section">
        <div className="section-container">
          <div className="subview-section-head">
            <span className="eyebrow-tag">ALL SKILLS UNDER 1 ROOF // 25+ YEARS OF DIGITAL FIREPOWER</span>
            <h2 className="section-title-tracked">CUSTOM WEB, AI, APPS, GEO &amp; MARKETING</h2>
          </div>

          <div className="services-bento-grid">
            {WEB_CREATION_SERVICES.map((srv, idx) => (
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

      {/* Process / How We Build Section */}
      <section className="web-process-section">
        <div className="section-container">
          <div className="subview-section-head">
            <span className="eyebrow-tag">THE WIRED METHOD</span>
            <h2 className="section-title-tracked wired-method-singleline">
              CREATIVE + INTELLIGENT + FAST
            </h2>
          </div>

          <div className="process-steps-grid">
            <div className="process-step-card">
              <span className="step-badge">PHASE 01 // CREATIVE</span>
              <h3>Brand &amp; UI Art Direction</h3>
              <p>
                We define a bold visual language, custom graphics, and frictionless user
                journey tailored to your brand or artist catalog.
              </p>
            </div>
            <div className="process-step-card">
              <span className="step-badge">PHASE 02 // INTELLIGENT</span>
              <h3>Full-Stack &amp; AI Engineering</h3>
              <p>
                Custom front-end and cloud architecture, AI-powered automation, and
                data-driven marketing funnels built to scale.
              </p>
            </div>
            <div className="process-step-card">
              <span className="step-badge">PHASE 03 // FAST</span>
              <h3>Launch, Optimize &amp; Scale</h3>
              <p>
                Rapid deployment, SEO &amp; conversion tuning, and ongoing partnership
                backed by 25+ years of digital leadership.
              </p>
            </div>
          </div>

          <div className="subview-bottom-banner">
            <div>
              <h3>Ready to Launch an Unforgettable Website or AI Web Application?</h3>
              <p>Let&apos;s build something custom, intelligent, and lightning-fast for your business or catalog.</p>
            </div>
            <div className="subview-banner-btns">
              <button type="button" className="btn-wired-yellow" onClick={onOpenContact}>
                REQUEST A PROJECT CONSULTATION
              </button>
              <button
                type="button"
                className="btn-wired-outline"
                onClick={() => onNavigateTab('home')}
              >
                BACK TO HOME
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
