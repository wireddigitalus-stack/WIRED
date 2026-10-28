import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  ExternalLink,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  Building2,
  Car,
  Maximize2,
  Monitor,
  Activity,
  Bot,
  X,
  ArrowRightLeft,
  Search,
  ArrowRight,
  Scale
} from 'lucide-react';
import {
  TRI_CITIES_CASE_STUDIES,
  AI_SEO_PILLARS
} from '../data/wiredData';
import MobileMore from './MobileMore';

const toSmallImg = (src) => (src ? src.replace(/\.jpg$/i, '-sm.jpg') : src);

export default function AiSeoDashboardShowcase({ onOpenContact, variant = 'home' }) {
  // 'home'  → slim Recent Work cards + service cards + city links
  // 'demo'  → interactive live client dashboard demo (shown on /web-design/)
  const isDemo = variant === 'demo';
  // Mobile progressive-disclosure state (no effect on desktop — see .m-* utilities in styles.css)
  const [introOpen, setIntroOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [casesIntroOpen, setCasesIntroOpen] = useState(false);
  const [openCases, setOpenCases] = useState({});
  const [openPillars, setOpenPillars] = useState({});
  const [citiesOpen, setCitiesOpen] = useState(false);
  const toggleKey = (setter, key) => setter((prev) => ({ ...prev, [key]: !prev[key] }));

  const [activeDemoTab, setActiveDemoTab] = useState('auto'); // 'auto' | 'cre' | 'law' | 'geo'
  const [fastTrackView, setFastTrackView] = useState('split'); // 'split' | 'dash' | 'front'
  const [visionView, setVisionView] = useState('split'); // 'split' | 'ai' | 'front'
  const [ringgerView, setRinggerView] = useState('split'); // 'split' | 'dash' | 'front'
  const [cardModes, setCardModes] = useState({
    'fast-track-bristol': 'primary',
    'team-vision-llc': 'primary',
    'ringger-law': 'primary'
  });
  const [compareMode, setCompareMode] = useState('after'); // 'before' | 'after'
  const [lightboxImage, setLightboxImage] = useState(null);

  const toggleCardMode = (id, mode) => {
    setCardModes((prev) => ({ ...prev, [id]: mode }));
  };

  return (
    <section className="ai-seo-showcase-section" id="ai-seo">
      <div className="section-container">
        {/* Section Header */}
        <div className="ai-section-header">
          <span className="eyebrow-tag" style={{ marginBottom: '0.6rem' }}>
            <Sparkles size={14} />
            <span>{isDemo ? 'SEE IT LIVE' : 'WEBSITES • AI • LOCAL SEO'}</span>
          </span>
          {isDemo ? (
            <h2 className="ai-main-heading">
              CLIENT DASHBOARDS <span className="text-yellow">IN ACTION</span>
            </h2>
          ) : (
            <h2 className="ai-main-heading">
              WEBSITE <span className="text-yellow">DESIGN, REDESIGN &amp; AI MODERNIZATION</span>
            </h2>
          )}
          <p className="ai-sub-lead">
            {isDemo ? (
              <>
                Click through real client front-ends and the private dashboards behind them. Every
                customer action on the public site shows up in the owner&apos;s dashboard.
              </>
            ) : (
              <>
                Fast, custom websites built to win on <strong>Google and in AI search</strong>, plus AI
                chatbots and live dashboards when your business needs them.
              </>
            )}
          </p>
        </div>

        {isDemo && (
          <>
        {/* Mobile-only teaser: the live dashboard demo is opt-in on phones (the same
            three clients are also shown as swipeable case studies just below) */}
        <div className="m-only m-demo-teaser">
          <MobileMore
            open={demoOpen}
            onToggle={() => setDemoOpen((v) => !v)}
            moreLabel="Open the live dashboard demo"
            lessLabel="Close the dashboard demo"
            controls="wired-os-demo-stage"
            className="m-more-btn--panel"
          />
        </div>

        {/* ====================================================================
            INTERACTIVE iOS × TIM BURTON LIVE DASHBOARD, AI CHATBOT & GEO STAGE
           ==================================================================== */}
        <div
          id="wired-os-demo-stage"
          className={`ios-dashboard-stage m-collapse ${demoOpen ? 'is-open' : ''}`}
        >
          {/* Top macOS / iOS Glass Window Bar */}
          <div className="ios-window-topbar">
            <div className="ios-window-dots">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
              <span className="window-title-mono">
                LIVE CLIENT DASHBOARDS
              </span>
            </div>

            {/* Segmented iOS Pill Switcher */}
            <div className="ios-segmented-control" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeDemoTab === 'auto'}
                className={`ios-seg-btn ${activeDemoTab === 'auto' ? 'active' : ''}`}
                onClick={() => setActiveDemoTab('auto')}
              >
                <Car size={13} />
                <span>Fast Track Automotive</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeDemoTab === 'law'}
                className={`ios-seg-btn ${activeDemoTab === 'law' ? 'active' : ''}`}
                onClick={() => setActiveDemoTab('law')}
              >
                <Scale size={13} />
                <span>Ringger Law</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeDemoTab === 'geo'}
                className={`ios-seg-btn ${activeDemoTab === 'geo' ? 'active' : ''}`}
                onClick={() => setActiveDemoTab('geo')}
              >
                <Sparkles size={13} />
                <span>AI Search (GEO)</span>
              </button>
            </div>
          </div>

          {/* Dashboard Body */}
          <div className="ios-dashboard-body">
            {/* TAB 1: FAST TRACK AUTOMOTIVE (FRONT-END + CUSTOM LIVE ADMIN DASHBOARD) */}
            {activeDemoTab === 'auto' && (
              <div className="ft-showcase-wrapper">
                <div className="ft-showcase-toolbar">
                  <div className="ft-toolbar-left">
                    <span className="ft-toolbar-sub">
                      Every customer action on the public site streams into the custom admin dashboard in real time.
                    </span>
                  </div>

                  <div className="ft-view-switcher" role="group" aria-label="Fast Track Screen View">
                    <button
                      type="button"
                      className={`ft-view-btn ${fastTrackView === 'split' ? 'active' : ''}`}
                      onClick={() => setFastTrackView('split')}
                    >
                      <ArrowRightLeft size={13} />
                      <span>Split: Front-End + Dash</span>
                    </button>
                    <button
                      type="button"
                      className={`ft-view-btn ${fastTrackView === 'dash' ? 'active' : ''}`}
                      onClick={() => setFastTrackView('dash')}
                    >
                      <Activity size={13} />
                      <span>Custom Admin Dashboard</span>
                    </button>
                    <button
                      type="button"
                      className={`ft-view-btn ${fastTrackView === 'front' ? 'active' : ''}`}
                      onClick={() => setFastTrackView('front')}
                    >
                      <Monitor size={13} />
                      <span>Public Front-End</span>
                    </button>
                  </div>
                </div>

                {fastTrackView === 'split' && (
                  <div className="ft-dual-stage-grid">
                    {/* LEFT SCREEN: Customer-Facing Front-End */}
                    <div
                      className="ft-screen-card"
                      onClick={() =>
                        setLightboxImage({
                          src: '/fasttrack-frontend.jpg',
                          title: 'Fast Track Automotive — Customer Front-End Website',
                          subtitle: '2528 Volunteer Pkwy, Bristol, TN • High-Speed AI/GEO Dealership Platform',
                          altSrc: '/fasttrack-admin-dash.jpg',
                          altTitle: 'Fast Track Automotive — Custom Live Admin & Telemetry Dashboard',
                          altSubtitle: 'Real-Time Visitor Click Stream, Credit App Alerts, Hourly Traffic & Lot Rankings',
                          swapLabel: 'Switch to Live Admin Dashboard'
                        })
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill">01 // PUBLIC FRONT-END</span>
                          <span className="ft-route-mono">fasttrackbristoltn.com</span>
                        </div>
                        <button type="button" className="ft-zoom-chip" aria-label="Expand Front-End Image">
                          <Maximize2 size={12} />
                          <span>EXPAND</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport">
                        <img
                          src="/fasttrack-frontend.jpg"
                          alt="Fast Track Automotive Bristol TN Public Website Front-End"
                          loading="lazy"
                          decoding="async"
                          className="ft-cropped-ui-img"
                        />
                      </div>

                      <div className="ft-screen-caption-strip">
                        <span><Zap size={11} fill="#FFEE00" color="#FFEE00" style={{ verticalAlign: '-1px', marginRight: '3px' }} />High-Converting Showroom</span>
                        <span>•</span>
                        <span>Instant Credit &amp; Inventory Funnel</span>
                        <span>•</span>
                        <span>Bristol TN GEO Schema</span>
                      </div>
                    </div>

                    {/* CENTER DATA PIPELINE CONNECTOR */}
                    <div className="ft-pipeline-bridge" aria-hidden="true">
                      <div className="pipeline-line" />
                      <div className="pipeline-pulse-badge">
                        <Zap size={14} fill="#050505" />
                        <span>LIVE SYNC</span>
                      </div>
                      <div className="pipeline-line" />
                    </div>

                    {/* RIGHT SCREEN: Custom Live Admin & Telemetry Dashboard */}
                    <div
                      className="ft-screen-card highlight-dash"
                      onClick={() =>
                        setLightboxImage({
                          src: '/fasttrack-admin-dash.jpg',
                          title: 'Fast Track Automotive — Custom Live Admin & Telemetry Dashboard',
                          subtitle: 'Real-Time Visitor Click Stream, Credit App Alerts, Hourly Traffic & Lot Rankings',
                          altSrc: '/fasttrack-frontend.jpg',
                          altTitle: 'Fast Track Automotive — Customer Front-End Website',
                          altSubtitle: '2528 Volunteer Pkwy, Bristol, TN • High-Speed AI/GEO Dealership Platform',
                          swapLabel: 'Switch to Public Front-End'
                        })
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill yellow">02 // CUSTOM LIVE ADMIN DASHBOARD</span>
                          <span className="ft-route-mono">fasttrackbristoltn.com/admin</span>
                        </div>
                        <button type="button" className="ft-zoom-chip" aria-label="Expand Admin Dashboard Image">
                          <Maximize2 size={12} />
                          <span>EXPAND</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport">
                        <img
                          src="/fasttrack-admin-dash.jpg"
                          alt="Fast Track Automotive Custom Live Admin Dashboard"
                          loading="lazy"
                          decoding="async"
                          className="ft-cropped-ui-img"
                        />
                      </div>

                      <div className="ft-screen-caption-strip">
                        <span>🟢 FIRST 30 DAYS: 2,751 Visits / 4,591 Actions</span>
                        <span>•</span>
                        <span>💳 47 Credit Apps</span>
                        <span>•</span>
                        <span>🔥 1,719 Vehicle Clicks</span>
                      </div>
                    </div>
                  </div>
                )}

                {(fastTrackView === 'dash' || fastTrackView === 'front') && (
                  <div className="ft-single-focus-stage">
                    <div
                      className="ft-screen-card single-large highlight-dash"
                      onClick={() =>
                        setLightboxImage(
                          fastTrackView === 'dash'
                            ? {
                                src: '/fasttrack-admin-dash.jpg',
                                title: 'Fast Track Automotive — Custom Live Admin & Telemetry Dashboard',
                                subtitle: 'Real-Time Visitor Click Stream, Credit App Alerts, Hourly Traffic & Lot Rankings',
                                altSrc: '/fasttrack-frontend.jpg',
                                altTitle: 'Fast Track Automotive — Customer Front-End Website',
                                altSubtitle: '2528 Volunteer Pkwy, Bristol, TN',
                                swapLabel: 'Switch to Public Front-End'
                              }
                            : {
                                src: '/fasttrack-frontend.jpg',
                                title: 'Fast Track Automotive — Customer Front-End Website',
                                subtitle: '2528 Volunteer Pkwy, Bristol, TN • High-Speed AI/GEO Dealership Platform',
                                altSrc: '/fasttrack-admin-dash.jpg',
                                altTitle: 'Fast Track Automotive — Custom Live Admin & Telemetry Dashboard',
                                altSubtitle: 'Real-Time Visitor Click Stream, Credit App Alerts, Hourly Traffic & Lot Rankings',
                                swapLabel: 'Switch to Live Admin Dashboard'
                              }
                        )
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill yellow">
                            {fastTrackView === 'dash'
                              ? 'CUSTOM LIVE ADMIN & TELEMETRY DASHBOARD'
                              : 'PUBLIC CUSTOMER-FACING FRONT-END'}
                          </span>
                          <span className="ft-route-mono">
                            {fastTrackView === 'dash'
                              ? 'fasttrackbristoltn.com/admin'
                              : 'fasttrackbristoltn.com'}
                          </span>
                        </div>
                        <button type="button" className="ft-zoom-chip">
                          <Maximize2 size={12} />
                          <span>FULLSCREEN ZOOM</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport large-viewport">
                        <img
                          src={
                            fastTrackView === 'dash'
                              ? '/fasttrack-admin-dash.jpg'
                              : '/fasttrack-frontend.jpg'
                          }
                          alt="Fast Track Automotive Platform Screen"
                          loading="lazy"
                          decoding="async"
                          className="ft-cropped-ui-img"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="ft-showcase-footer-bar">
                  <div className="ft-kpi-pills-row">
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">2,751</span>
                      <span className="ft-stat-lbl">First 30 Days: Visits (4,591 Actions)</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">47</span>
                      <span className="ft-stat-lbl">First 30 Days: Online Credit Apps</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">1,719</span>
                      <span className="ft-stat-lbl">First 30 Days: Inventory Clicks</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">First 30 Days</span>
                      <span className="ft-stat-lbl">Live Stream • QR Flyers • Calls • Lot Rank</span>
                    </div>
                  </div>

                  <div className="ft-footer-cta-group">
                    <a
                      href="https://www.fasttrackbristoltn.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-mini-outline"
                    >
                      <span>Visit FastTrackBristolTN.com</span>
                      <ExternalLink size={12} />
                    </a>
                    <button type="button" className="btn-mini-yellow" onClick={onOpenContact}>
                      Build a Custom Site + Dashboard Like This →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: RINGGER LAW (PUBLIC LEGAL FRONT-END + 24/7 DEBT TRIAGE AI + LIVE DATABASE CRM /ADMIN) */}
            {activeDemoTab === 'law' && (
              <div className="ft-showcase-wrapper">
                <div className="ft-showcase-toolbar">
                  <div className="ft-toolbar-left">
                    <span className="live-green-pill">● LIVE DATABASE LEGAL CRM + 24/7 DEBT TRIAGE AI // JACKSON &amp; WEST TN</span>
                    <span className="ft-toolbar-sub">
                      Pairs an urgent foreclosure/garnishment funnel &amp; 24/7 AI intake bot with a live attorney CRM tracking signed court packets &amp; $64.50/click CPC value.
                    </span>
                  </div>

                  <div className="ft-view-switcher" role="group" aria-label="Ringger Law Screen View">
                    <button
                      type="button"
                      className={`ft-view-btn ${ringgerView === 'split' ? 'active' : ''}`}
                      onClick={() => setRinggerView('split')}
                    >
                      <ArrowRightLeft size={13} />
                      <span>Split: Front-End + Legal CRM</span>
                    </button>
                    <button
                      type="button"
                      className={`ft-view-btn ${ringgerView === 'dash' ? 'active' : ''}`}
                      onClick={() => setRinggerView('dash')}
                    >
                      <Activity size={13} />
                      <span>Executive Command Center (/admin)</span>
                    </button>
                    <button
                      type="button"
                      className={`ft-view-btn ${ringgerView === 'front' ? 'active' : ''}`}
                      onClick={() => setRinggerView('front')}
                    >
                      <Monitor size={13} />
                      <span>Public Site + 24/7 AI Triage</span>
                    </button>
                  </div>
                </div>

                {ringgerView === 'split' && (
                  <div className="ft-dual-stage-grid">
                    {/* LEFT SCREEN: Ringger Law Public Legal Front-End + 24/7 Debt Triage AI */}
                    <div
                      className="ft-screen-card"
                      onClick={() =>
                        setLightboxImage({
                          src: '/ringgerlaw-frontend.jpg',
                          title: 'Ringger Law — Public Legal Platform & 24/7 "West TN Debt Triage" AI Advisor',
                          subtitle: 'Serving Jackson & West Tennessee Since 1981 • Chapter 7 ($0 Down) & Chapter 13 Foreclosure/Repo Protection',
                          altSrc: '/ringgerlaw-admin-dash.jpg',
                          altTitle: 'Ringger Law — Executive Command Center (/admin): Live Lead CRM, Court Intakes & Traffic Attribution',
                          altSubtitle: 'Live Database CRM • Urgent Foreclosure/Repo Triage • Signed Court Intake Packets • $64.50/Click CPC Attribution',
                          swapLabel: 'Switch to Live Legal CRM (/admin)'
                        })
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill">01 // PUBLIC SITE + 24/7 DEBT TRIAGE AI</span>
                          <span className="ft-route-mono">ringgerlaw.com</span>
                        </div>
                        <button type="button" className="ft-zoom-chip" aria-label="Expand Ringger Law Front-End">
                          <Maximize2 size={12} />
                          <span>EXPAND</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport">
                        <img
                          src="/ringgerlaw-frontend.jpg"
                          alt="Ringger Law Public Legal Platform and 24/7 West TN Debt Triage AI"
                          className="ft-cropped-ui-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="ft-screen-caption-strip">
                        <span>⚖️ Serving West TN Since 1981</span>
                        <span>•</span>
                        <span>🤖 24/7 Debt Triage AI Bot</span>
                        <span>•</span>
                        <span>⚡ Urgent Automatic Stay Funnel</span>
                      </div>
                    </div>

                    {/* CENTER DATABASE CRM CONNECTOR */}
                    <div className="ft-pipeline-bridge" aria-hidden="true">
                      <div className="pipeline-line" />
                      <div className="pipeline-pulse-badge">
                        <Zap size={14} fill="#050505" />
                        <span>LIVE CRM</span>
                      </div>
                      <div className="pipeline-line" />
                    </div>

                    {/* RIGHT SCREEN: Ringger Law Executive Command Center (/admin) */}
                    <div
                      className="ft-screen-card highlight-dash"
                      onClick={() =>
                        setLightboxImage({
                          src: '/ringgerlaw-admin-dash.jpg',
                          title: 'Ringger Law — Executive Command Center (/admin): Live Lead CRM, Court Intakes & Traffic Attribution',
                          subtitle: 'Live Database CRM • Urgent Foreclosure/Repo Triage • Signed Court Intake Packets • $64.50/Click CPC Attribution',
                          altSrc: '/ringgerlaw-frontend.jpg',
                          altTitle: 'Ringger Law — Public Legal Platform & 24/7 "West TN Debt Triage" AI Advisor',
                          altSubtitle: 'Serving Jackson & West Tennessee Since 1981 • Chapter 7 ($0 Down) & Chapter 13 Foreclosure/Repo Protection',
                          swapLabel: 'Switch to Public Site + 24/7 AI'
                        })
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill yellow">02 // EXECUTIVE COMMAND CENTER (/ADMIN)</span>
                          <span className="ft-route-mono">ringgerlaw.com/admin</span>
                        </div>
                        <button type="button" className="ft-zoom-chip" aria-label="Expand Ringger Law Admin Dashboard">
                          <Maximize2 size={12} />
                          <span>EXPAND</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport">
                        <img
                          src="/ringgerlaw-admin-dash.jpg"
                          alt="Ringger Law Executive Command Center Live Lead CRM and Court Intakes"
                          className="ft-cropped-ui-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="ft-screen-caption-strip">
                        <span>🟢 3,800+ Sessions (90-Day Cross-Section)</span>
                        <span>•</span>
                        <span>🔴 Emergency Foreclosure/Repo Triage</span>
                        <span>•</span>
                        <span>💰 $64.50/Click CPC Value</span>
                      </div>
                    </div>
                  </div>
                )}

                {(ringgerView === 'dash' || ringgerView === 'front') && (
                  <div className="ft-single-focus-stage">
                    <div
                      className="ft-screen-card single-large highlight-dash"
                      onClick={() =>
                        setLightboxImage(
                          ringgerView === 'dash'
                            ? {
                                src: '/ringgerlaw-admin-dash.jpg',
                                title: 'Ringger Law — Executive Command Center (/admin): Live Lead CRM, Court Intakes & Traffic Attribution',
                                subtitle: 'Live Database CRM • Urgent Foreclosure/Repo Triage • Signed Court Intake Packets • $64.50/Click CPC Attribution',
                                altSrc: '/ringgerlaw-frontend.jpg',
                                altTitle: 'Ringger Law — Public Legal Platform & 24/7 "West TN Debt Triage" AI Advisor',
                                altSubtitle: 'Serving Jackson & West Tennessee Since 1981',
                                swapLabel: 'Switch to Public Site + 24/7 AI'
                              }
                            : {
                                src: '/ringgerlaw-frontend.jpg',
                                title: 'Ringger Law — Public Legal Platform & 24/7 "West TN Debt Triage" AI Advisor',
                                subtitle: 'Serving Jackson & West Tennessee Since 1981 • Chapter 7 ($0 Down) & Chapter 13 Foreclosure/Repo Protection',
                                altSrc: '/ringgerlaw-admin-dash.jpg',
                                altTitle: 'Ringger Law — Executive Command Center (/admin): Live Lead CRM, Court Intakes & Traffic Attribution',
                                altSubtitle: 'Live Database CRM • Urgent Foreclosure/Repo Triage • Signed Court Intake Packets',
                                swapLabel: 'Switch to Live Legal CRM (/admin)'
                              }
                        )
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill yellow">
                            {ringgerView === 'dash'
                              ? 'EXECUTIVE COMMAND CENTER (/ADMIN): LIVE LEAD CRM & COURT INTAKES'
                              : 'PUBLIC LEGAL PLATFORM + 24/7 "WEST TN DEBT TRIAGE" AI ADVISOR'}
                          </span>
                          <span className="ft-route-mono">
                            {ringgerView === 'dash' ? 'ringgerlaw.com/admin' : 'ringgerlaw.com'}
                          </span>
                        </div>
                        <button type="button" className="ft-zoom-chip">
                          <Maximize2 size={12} />
                          <span>FULLSCREEN ZOOM</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport large-viewport">
                        <img
                          src={ringgerView === 'dash' ? '/ringgerlaw-admin-dash.jpg' : '/ringgerlaw-frontend.jpg'}
                          alt="Ringger Law Platform Screen"
                          className="ft-cropped-ui-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="ft-showcase-footer-bar">
                  <div className="ft-kpi-pills-row">
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">3,800+ (90 Days)</span>
                      <span className="ft-stat-lbl">90-Day Cross-Section • Ads, Organic &amp; AI</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">24/7 AI + CRM</span>
                      <span className="ft-stat-lbl">Auto-Qualifies Chapter 7 vs. 13</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">$64.50 / Click</span>
                      <span className="ft-stat-lbl">Live Legal CPC Value Attribution</span>
                    </div>
                  </div>

                  <div className="ft-footer-cta-group">
                    <a
                      href="https://www.ringgerlaw.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-mini-outline"
                    >
                      <span>Visit RinggerLaw.com</span>
                      <ExternalLink size={12} />
                    </a>
                    <button type="button" className="btn-mini-yellow" onClick={onOpenContact}>
                      Build a Custom CRM, 24/7 AI &amp; Site →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AI-ERA SEARCH & GENERATIVE SEO (GEO) TELEMETRY */}
            {activeDemoTab === 'geo' && (
              <div className="demo-grid-view">
                {/* Left: Before vs After AI Site Modernization Toggle */}
                <div className="demo-panel-card">
                  <div className="demo-panel-head">
                    <span className="panel-kicker">LIVE ARCHITECTURE COMPARISON</span>
                    <div className="before-after-toggle">
                      <button
                        type="button"
                        className={compareMode === 'before' ? 'active-old' : ''}
                        onClick={() => setCompareMode('before')}
                      >
                        Old Template Site
                      </button>
                      <button
                        type="button"
                        className={compareMode === 'after' ? 'active-new' : ''}
                        onClick={() => setCompareMode('after')}
                      >
                        <Zap size={12} fill="#FFEE00" color="#FFEE00" style={{ verticalAlign: '-1px', marginRight: '4px' }} />
                        Wired AI Modernization
                      </button>
                    </div>
                  </div>

                  {compareMode === 'before' ? (
                    <div className="comparison-state old-state">
                      <h4>Typical Outdated Wix / WordPress Business Site</h4>
                      <ul className="comparison-list">
                        <li>
                          <span className="bad-badge">4.8s Load</span>
                          <span>Bloated templates that lose 60%+ of mobile visitors</span>
                        </li>
                        <li>
                          <span className="bad-badge">Invisible to AI</span>
                          <span>Zero JSON-LD entity graphs for ChatGPT, Gemini, or Perplexity</span>
                        </li>
                        <li>
                          <span className="bad-badge">No AI / Dash</span>
                          <span>Zero 24/7 trained AI chatbot or live click-stream telemetry</span>
                        </li>
                        <li>
                          <span className="bad-badge">Weak Local SEO</span>
                          <span>Generic pages buried below competitors in Bristol, Kingsport &amp; JC</span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="comparison-state new-state">
                      <h4><Zap size={14} fill="#FFEE00" color="#FFEE00" style={{ verticalAlign: '-2px', marginRight: '5px' }} />Wired Digital AI-Modernized Platform + Custom AI &amp; Dashboards</h4>
                      <ul className="comparison-list">
                        <li>
                          <span className="good-badge">&lt;0.5s Load</span>
                          <span>Sub-second edge architecture with 99+ Core Web Vitals</span>
                        </li>
                        <li>
                          <span className="good-badge">GEO Ready</span>
                          <span>Structured AI Entity Schema cited by ChatGPT, Gemini &amp; Google AI</span>
                        </li>
                        <li>
                          <span className="good-badge">24/7 AI + Dash</span>
                          <span>Custom-trained AI lead chatbots &amp; live telemetry dashboards</span>
                        </li>
                        <li>
                          <span className="good-badge">High-End SEO</span>
                          <span>Hyper-local &amp; GEO authority across Bristol VA/TN, Johnson City &amp; Kingsport</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right: Live AI Search & Local Telemetry Metrics */}
                <div className="demo-panel-card telemetry-card">
                  <div className="demo-panel-head">
                    <span className="panel-kicker">GEO TARGET PROFILE (ILLUSTRATIVE)</span>
                    <span className="live-green-pill">● EXAMPLE TARGETS</span>
                  </div>

                  <div className="telemetry-bars">
                    <div className="telemetry-row">
                      <div className="telemetry-label-row">
                        <span>Google Local Pack &amp; Organic (Tri-Cities TN/VA)</span>
                        <span className="telemetry-val">Target 98</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: '98%' }} />
                      </div>
                    </div>

                    <div className="telemetry-row">
                      <div className="telemetry-label-row">
                        <span>ChatGPT / OpenAI Local Entity Citation Score</span>
                        <span className="telemetry-val">Target 96</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div className="telemetry-row">
                      <div className="telemetry-label-row">
                        <span>Google Gemini &amp; AI Overviews Authority</span>
                        <span className="telemetry-val">Target 97</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: '97%' }} />
                      </div>
                    </div>

                    <div className="telemetry-row">
                      <div className="telemetry-label-row">
                        <span>Real Result: Fast Track Credit Apps (First 30 Days)</span>
                        <span className="telemetry-val">47 Apps</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="telemetry-footer-note">
                    <span>Target scores are illustrative goals, not measured client results. Built with Schema.org graphs, local geo-coordinates &amp; AI-readable endpoints.</span>
                    <button type="button" className="btn-mini-yellow" onClick={onOpenContact}>
                      Request Free Site Audit →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

          </>
        )}

        {/* ====================================================================
            REAL RECENT WEB & AI CASE STUDIES (FAST TRACK, TEAM VISION & RINGGER LAW)
           ==================================================================== */}
        {!isDemo && (
        <div className="tricities-casestudies-block" id="case-studies">
          <div className="casestudies-header">
            <span className="eyebrow-tag">
              <MapPin size={14} />
              <span>RECENT WORK</span>
            </span>
            <h3 className="section-title-tracked">REAL BUSINESSES. REAL RESULTS.</h3>
            <p className="legends-subtitle">
              Live websites, dashboards and AI tools we&apos;ve built for Tennessee and Virginia
              businesses.
            </p>
            <span className="m-only m-swipe-hint">
              Swipe to see all {TRI_CITIES_CASE_STUDIES.length} projects →
            </span>
          </div>

          <div className="casestudies-grid-2 m-swipe-row">
            {TRI_CITIES_CASE_STUDIES.map((cs) => {
              const mode = cardModes[cs.id] || 'primary';
              const isPrimary = mode === 'primary';
              const mainImg = isPrimary ? cs.dashboardImg : cs.frontendImg;
              const pipImg = isPrimary ? cs.frontendImg : cs.dashboardImg;

              const openCardLightbox = () => {
                setLightboxImage({
                  src: mainImg,
                  title: isPrimary ? cs.primaryTitle : cs.secondaryTitle,
                  subtitle: isPrimary ? cs.primarySubtitle : cs.secondarySubtitle,
                  altSrc: pipImg,
                  altTitle: isPrimary ? cs.secondaryTitle : cs.primaryTitle,
                  altSubtitle: isPrimary ? cs.secondarySubtitle : cs.primarySubtitle,
                  swapLabel: isPrimary
                    ? `Switch to ${cs.secondaryTabLabel}`
                    : `Switch to ${cs.primaryTabLabel}`
                });
              };

              return (
                <article key={cs.id} className="casestudy-ios-card cs-card-slim">
                  <div className="cs-browser-bar">
                    <div className="ios-window-dots">
                      <span className="dot-red" />
                      <span className="dot-yellow" />
                      <span className="dot-green" />
                    </div>
                    <a
                      href={cs.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cs-url-pill"
                    >
                      <span>{cs.domain}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="cs-visual-preview">
                    <div className="cs-tag-row">
                      {cs.cardTags.map((t) => (
                        <span key={t} className="cs-preview-badge">{t}</span>
                      ))}
                    </div>
                    <div className="cs-preview-title-row">
                      <div>
                        <h4>{cs.name.replace(/\s*\(Est\. \d{4}\)/, '')}</h4>
                        <span className="cs-location-sub">
                          <MapPin size={12} /> {cs.city}
                        </span>
                      </div>
                    </div>

                    {cs.frontendImg && cs.dashboardImg && (
                      <div className="cs-interactive-screen-deck">
                        <div
                          className="cs-layered-screens"
                          onClick={openCardLightbox}
                          title="Click to enlarge"
                        >
                          <img
                            src={mainImg}
                            srcSet={`${toSmallImg(mainImg)} 680w, ${mainImg} 1012w`}
                            sizes="(max-width: 768px) 220px, 480px"
                            alt={`${cs.name} ${isPrimary ? cs.primaryTabLabel : cs.secondaryTabLabel}`}
                            className="cs-primary-screen-img"
                            loading="lazy"
                            decoding="async"
                          />
                          <img
                            src={toSmallImg(pipImg)}
                            alt={`${cs.name} ${isPrimary ? cs.secondaryTabLabel : cs.primaryTabLabel}`}
                            className="cs-secondary-pip-img"
                            loading="lazy"
                            decoding="async"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardMode(cs.id, isPrimary ? 'secondary' : 'primary');
                            }}
                            title={`Swap to ${isPrimary ? cs.secondaryTabLabel : cs.primaryTabLabel}`}
                          />
                          <span className="cs-pip-badge" aria-hidden="true">⇄</span>
                        </div>
                      </div>
                    )}

                    <div className="cs-metrics-row">
                      {cs.metrics.map((m) => (
                        <div key={m.label} className="cs-metric-pill">
                          <span className="cs-m-val">{m.value}</span>
                          <span className="cs-m-lbl">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="cs-card-content">
                    <h5 className="cs-headline">{cs.cardHeadline}</h5>
                    <p className="cs-summary">{cs.cardSummary}</p>

                    <div className="cs-card-actions">
                      <a href={cs.caseUrl} className="btn-wired-yellow cs-visit-btn">
                        <span>VIEW CASE STUDY</span>
                        <ArrowUpRight size={14} />
                      </a>
                      <a
                        href={cs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-wired-outline cs-inquire-btn"
                      >
                        <span>VISIT SITE</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        )}

        {!isDemo && (
          <>
            <div className="ai-pillars-grid-3">
              {AI_SEO_PILLARS.map((pillar) => (
                <a key={pillar.id} href={pillar.href} className="ai-pillar-ios-card ai-pillar-link">
                  <span className="pillar-tag-mono">{pillar.tag}</span>
                  <h4>{pillar.title}</h4>
                  <p>{pillar.description}</p>
                  <ul>
                    {pillar.bullets.map((b) => (
                      <li key={b}>
                        <Zap size={13} className="text-yellow" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="ai-pillar-more">Learn more →</span>
                </a>
              ))}
            </div>

            <p className="tricities-city-line">
              <MapPin size={14} className="text-yellow" />
              <span>
                Serving <a href="/bristol-tn-va-web-design/">Bristol</a> ·{' '}
                <a href="/johnson-city-tn-web-design/">Johnson City</a> ·{' '}
                <a href="/kingsport-tn-web-design/">Kingsport</a> ·{' '}
                <a href="/abingdon-va-web-design/">Abingdon</a> and clients nationwide.
              </span>
            </p>
          </>
        )}
      </div>

      {/* High-Resolution Image Lightbox Modal for Inspecting Any Project Screen */}
      {lightboxImage && (
        <div
          className="modal-backdrop"
          onClick={() => setLightboxImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="screen-lightbox-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="video-modal-header">
              <div>
                <span className="modal-kicker">{lightboxImage.subtitle}</span>
                <h3 className="modal-title">{lightboxImage.title}</h3>
              </div>
              <div className="modal-header-actions">
                {lightboxImage.altSrc && (
                  <button
                    type="button"
                    className="ft-swap-modal-btn"
                    onClick={() =>
                      setLightboxImage({
                        src: lightboxImage.altSrc,
                        title: lightboxImage.altTitle,
                        subtitle: lightboxImage.altSubtitle,
                        altSrc: lightboxImage.src,
                        altTitle: lightboxImage.title,
                        altSubtitle: lightboxImage.subtitle,
                        swapLabel: `Switch to ${lightboxImage.title.split('—')[1]?.trim() || 'Other View'}`
                      })
                    }
                  >
                    <ArrowRightLeft size={13} />
                    <span>{lightboxImage.swapLabel || 'Switch Screen View'}</span>
                  </button>
                )}
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setLightboxImage(null)}
                  aria-label="Close preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="screen-lightbox-body">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="screen-lightbox-img"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
