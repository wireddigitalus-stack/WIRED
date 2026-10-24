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
  ArrowRightLeft
} from 'lucide-react';
import {
  TRI_CITIES_CASE_STUDIES,
  AI_SEO_PILLARS,
  TRI_CITIES_MARKETS
} from '../data/wiredData';

export default function AiSeoDashboardShowcase({ onOpenContact }) {
  const [activeDemoTab, setActiveDemoTab] = useState('auto'); // 'auto' | 'cre' | 'geo'
  const [fastTrackView, setFastTrackView] = useState('split'); // 'split' | 'dash' | 'front'
  const [visionView, setVisionView] = useState('split'); // 'split' | 'ai' | 'front'
  const [cardModes, setCardModes] = useState({
    'fast-track-bristol': 'primary',
    'team-vision-llc': 'primary'
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
          <h2 className="ai-main-heading">
            WEBSITE <span className="text-yellow">DESIGN, REDESIGN &amp; AI MODERNIZATION</span>
          </h2>

          <p className="ai-sub-lead">
            Search engines are evolving faster than ever. As{' '}
            <strong>Google AI Overviews, ChatGPT, Gemini, and Perplexity</strong>{' '}
            transform how customers discover businesses, static legacy websites are
            getting left behind. We design, redesign, and modernize websites to keep
            pace with AI-era search—combining{' '}
            <strong>Generative Engine Optimization (GEO)</strong>,{' '}
            <strong>custom-trained 24/7 AI lead concierges</strong>, and{' '}
            <strong>live custom admin dashboards</strong> built around your business.
          </p>
        </div>

        {/* ====================================================================
            INTERACTIVE iOS × TIM BURTON LIVE DASHBOARD, AI CHATBOT & GEO STAGE
           ==================================================================== */}
        <div className="ios-dashboard-stage">
          {/* Top macOS / iOS Glass Window Bar */}
          <div className="ios-window-topbar">
            <div className="ios-window-dots">
              <span className="dot-red" />
              <span className="dot-yellow" />
              <span className="dot-green" />
              <span className="window-title-mono">
                WIRED_OS // LIVE CLIENT PLATFORMS, CUSTOM DASHBOARDS &amp; 24/7 AI AGENTS
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
                <span>Fast Track: Front-End + Live Admin Dash</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeDemoTab === 'cre'}
                className={`ios-seg-btn ${activeDemoTab === 'cre' ? 'active' : ''}`}
                onClick={() => setActiveDemoTab('cre')}
              >
                <Building2 size={13} />
                <span>Team Vision: 24/7 AI Space Advisor + CRE Site</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeDemoTab === 'geo'}
                className={`ios-seg-btn ${activeDemoTab === 'geo' ? 'active' : ''}`}
                onClick={() => setActiveDemoTab('geo')}
              >
                <Sparkles size={13} />
                <span>AI-Era Search &amp; GEO Telemetry</span>
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
                          src: '/fasttrack-frontend.png',
                          title: 'Fast Track Automotive — Customer Front-End Website',
                          subtitle: '2528 Volunteer Pkwy, Bristol, TN • High-Speed AI/GEO Dealership Platform',
                          altSrc: '/fasttrack-admin-dash.png',
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
                          src="/fasttrack-frontend.png"
                          alt="Fast Track Automotive Bristol TN Public Website Front-End"
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
                          src: '/fasttrack-admin-dash.png',
                          title: 'Fast Track Automotive — Custom Live Admin & Telemetry Dashboard',
                          subtitle: 'Real-Time Visitor Click Stream, Credit App Alerts, Hourly Traffic & Lot Rankings',
                          altSrc: '/fasttrack-frontend.png',
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
                          src="/fasttrack-admin-dash.png"
                          alt="Fast Track Automotive Custom Live Admin Dashboard"
                          className="ft-cropped-ui-img"
                        />
                      </div>

                      <div className="ft-screen-caption-strip">
                        <span>🟢 2,751 Visits / 4,591 Actions</span>
                        <span>•</span>
                        <span>💳 47 Credit Apps</span>
                        <span>•</span>
                        <span>🔥 Live Click Stream &amp; Lot Rank</span>
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
                                src: '/fasttrack-admin-dash.png',
                                title: 'Fast Track Automotive — Custom Live Admin & Telemetry Dashboard',
                                subtitle: 'Real-Time Visitor Click Stream, Credit App Alerts, Hourly Traffic & Lot Rankings',
                                altSrc: '/fasttrack-frontend.png',
                                altTitle: 'Fast Track Automotive — Customer Front-End Website',
                                altSubtitle: '2528 Volunteer Pkwy, Bristol, TN',
                                swapLabel: 'Switch to Public Front-End'
                              }
                            : {
                                src: '/fasttrack-frontend.png',
                                title: 'Fast Track Automotive — Customer Front-End Website',
                                subtitle: '2528 Volunteer Pkwy, Bristol, TN • High-Speed AI/GEO Dealership Platform',
                                altSrc: '/fasttrack-admin-dash.png',
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
                              ? '/fasttrack-admin-dash.png'
                              : '/fasttrack-frontend.png'
                          }
                          alt="Fast Track Automotive Platform Screen"
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
                      <span className="ft-stat-lbl">Monthly Visits (4,591 Actions)</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">47</span>
                      <span className="ft-stat-lbl">Online Credit Applications</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">1,719</span>
                      <span className="ft-stat-lbl">Vehicle Inventory Clicks</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">Live Stream</span>
                      <span className="ft-stat-lbl">QR Flyers • Calls • Fuel Calc • Lot Rank</span>
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

            {/* TAB 2: TEAM VISION LLC (FLAGSHIP FRONT-END + 24/7 CUSTOM-TRAINED "ASK VISION" AI SPACE ADVISOR) */}
            {activeDemoTab === 'cre' && (
              <div className="ft-showcase-wrapper">
                <div className="ft-showcase-toolbar">
                  <div className="ft-toolbar-left">
                    <span className="live-green-pill">● 24/7 CUSTOM-TRAINED AI AGENT // DOWNTOWN BRISTOL</span>
                    <span className="ft-toolbar-sub">
                      Custom-trained on every Vision LLC property—matching tenants to spaces in under 2 minutes &amp; capturing leads 24/7.
                    </span>
                  </div>

                  <div className="ft-view-switcher" role="group" aria-label="Team Vision Screen View">
                    <button
                      type="button"
                      className={`ft-view-btn ${visionView === 'split' ? 'active' : ''}`}
                      onClick={() => setVisionView('split')}
                    >
                      <ArrowRightLeft size={13} />
                      <span>Split: Front-End + 24/7 AI Chatbot</span>
                    </button>
                    <button
                      type="button"
                      className={`ft-view-btn ${visionView === 'ai' ? 'active' : ''}`}
                      onClick={() => setVisionView('ai')}
                    >
                      <Bot size={13} />
                      <span>24/7 &ldquo;Ask VISION&rdquo; AI Advisor</span>
                    </button>
                    <button
                      type="button"
                      className={`ft-view-btn ${visionView === 'front' ? 'active' : ''}`}
                      onClick={() => setVisionView('front')}
                    >
                      <Monitor size={13} />
                      <span>Flagship Front-End</span>
                    </button>
                  </div>
                </div>

                {visionView === 'split' && (
                  <div className="ft-dual-stage-grid">
                    {/* LEFT SCREEN: Team Vision Flagship Front-End */}
                    <div
                      className="ft-screen-card"
                      onClick={() =>
                        setLightboxImage({
                          src: '/teamvision-frontend.png',
                          title: 'Team Vision LLC — Commercial Real Estate Flagship Front-End',
                          subtitle: '#1 Commercial Property Owner in Downtown Bristol • Tri-Cities CRE Authority',
                          altSrc: '/teamvision-ai-advisor.png',
                          altTitle: 'Team Vision LLC — 24/7 Custom-Trained "Ask VISION" AI Space Advisor',
                          altSubtitle: 'Trained on All Properties • Matches Tenants in Under 2 Minutes & Captures Leads 24/7',
                          swapLabel: 'Switch to 24/7 AI Space Advisor'
                        })
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill">01 // CRE FLAGSHIP FRONT-END</span>
                          <span className="ft-route-mono">teamvisionllc.com</span>
                        </div>
                        <button type="button" className="ft-zoom-chip" aria-label="Expand Team Vision Front-End">
                          <Maximize2 size={12} />
                          <span>EXPAND</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport">
                        <img
                          src="/teamvision-frontend.png"
                          alt="Team Vision LLC Commercial Real Estate Front-End"
                          className="ft-cropped-ui-img"
                        />
                      </div>

                      <div className="ft-screen-caption-strip">
                        <span>🏢 #1 Downtown Bristol CRE Owner</span>
                        <span>•</span>
                        <span>📍 Bristol • Kingsport • JC • Abingdon</span>
                      </div>
                    </div>

                    {/* CENTER AI PIPELINE CONNECTOR */}
                    <div className="ft-pipeline-bridge" aria-hidden="true">
                      <div className="pipeline-line" />
                      <div className="pipeline-pulse-badge">
                        <Bot size={14} />
                        <span>24/7 AI LEAD BOT</span>
                      </div>
                      <div className="pipeline-line" />
                    </div>

                    {/* RIGHT SCREEN: 24/7 Custom-Trained "Ask VISION" AI Space Advisor & Portfolio */}
                    <div
                      className="ft-screen-card highlight-dash"
                      onClick={() =>
                        setLightboxImage({
                          src: '/teamvision-ai-advisor.png',
                          title: 'Team Vision LLC — 24/7 Custom-Trained "Ask VISION" AI Space Advisor',
                          subtitle: 'Trained on All Properties • Matches Tenants in Under 2 Minutes & Captures Leads 24/7',
                          altSrc: '/teamvision-frontend.png',
                          altTitle: 'Team Vision LLC — Commercial Real Estate Flagship Front-End',
                          altSubtitle: '#1 Commercial Property Owner in Downtown Bristol • Tri-Cities CRE Authority',
                          swapLabel: 'Switch to Flagship Front-End'
                        })
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill yellow">02 // 24/7 CUSTOM-TRAINED AI ADVISOR</span>
                          <span className="ft-route-mono">Ask VISION Space Matcher</span>
                        </div>
                        <button type="button" className="ft-zoom-chip" aria-label="Expand Team Vision AI Advisor">
                          <Maximize2 size={12} />
                          <span>EXPAND</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport">
                        <img
                          src="/teamvision-ai-advisor.png"
                          alt="Team Vision LLC Ask VISION 24/7 AI Chatbot and Portfolio"
                          className="ft-cropped-ui-img"
                        />
                      </div>

                      <div className="ft-screen-caption-strip">
                        <span>Trained on All Properties</span>
                        <span>•</span>
                        <span><Zap size={11} fill="#FFEE00" color="#FFEE00" style={{ verticalAlign: '-1px', marginRight: '3px' }} />5-Question Space Match (&lt;2 Min)</span>
                        <span>•</span>
                        <span>24/7 Lead Capture</span>
                      </div>
                    </div>
                  </div>
                )}

                {(visionView === 'ai' || visionView === 'front') && (
                  <div className="ft-single-focus-stage">
                    <div
                      className="ft-screen-card single-large highlight-dash"
                      onClick={() =>
                        setLightboxImage(
                          visionView === 'ai'
                            ? {
                                src: '/teamvision-ai-advisor.png',
                                title: 'Team Vision LLC — 24/7 Custom-Trained "Ask VISION" AI Space Advisor',
                                subtitle: 'Trained on All Properties • Matches Tenants in Under 2 Minutes & Captures Leads 24/7',
                                altSrc: '/teamvision-frontend.png',
                                altTitle: 'Team Vision LLC — Commercial Real Estate Flagship Front-End',
                                altSubtitle: '#1 Commercial Property Owner in Downtown Bristol',
                                swapLabel: 'Switch to Flagship Front-End'
                              }
                            : {
                                src: '/teamvision-frontend.png',
                                title: 'Team Vision LLC — Commercial Real Estate Flagship Front-End',
                                subtitle: '#1 Commercial Property Owner in Downtown Bristol • Tri-Cities CRE Authority',
                                altSrc: '/teamvision-ai-advisor.png',
                                altTitle: 'Team Vision LLC — 24/7 Custom-Trained "Ask VISION" AI Space Advisor',
                                altSubtitle: 'Trained on All Properties • Matches Tenants in Under 2 Minutes & Captures Leads 24/7',
                                swapLabel: 'Switch to 24/7 AI Space Advisor'
                              }
                        )
                      }
                    >
                      <div className="ft-screen-label-bar">
                        <div className="ft-screen-badge-group">
                          <span className="ft-step-pill yellow">
                            {visionView === 'ai'
                              ? '24/7 CUSTOM-TRAINED "ASK VISION" AI SPACE ADVISOR & PORTFOLIO'
                              : 'COMMERCIAL REAL ESTATE FLAGSHIP FRONT-END'}
                          </span>
                          <span className="ft-route-mono">teamvisionllc.com</span>
                        </div>
                        <button type="button" className="ft-zoom-chip">
                          <Maximize2 size={12} />
                          <span>FULLSCREEN ZOOM</span>
                        </button>
                      </div>

                      <div className="ft-screen-viewport large-viewport">
                        <img
                          src={
                            visionView === 'ai'
                              ? '/teamvision-ai-advisor.png'
                              : '/teamvision-frontend.png'
                          }
                          alt="Team Vision LLC Platform Screen"
                          className="ft-cropped-ui-img"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="ft-showcase-footer-bar">
                  <div className="ft-kpi-pills-row">
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">24/7 AI</span>
                      <span className="ft-stat-lbl">Custom-Trained on Every Property</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">&lt; 2 Min</span>
                      <span className="ft-stat-lbl">5-Question Tenant Space Match</span>
                    </div>
                    <div className="ft-mini-stat">
                      <span className="ft-stat-val">120–54K sq ft</span>
                      <span className="ft-stat-lbl">Office • CoWork • Retail • Industrial</span>
                    </div>
                  </div>

                  <div className="ft-footer-cta-group">
                    <a
                      href="https://www.teamvisionllc.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-mini-outline"
                    >
                      <span>Visit TeamVisionLLC.com</span>
                      <ExternalLink size={12} />
                    </a>
                    <button type="button" className="btn-mini-yellow" onClick={onOpenContact}>
                      Build a Custom AI Lead Concierge &amp; Site →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: AI-ERA SEARCH & GENERATIVE SEO (GEO) TELEMETRY */}
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
                          <span className="good-badge">Tri-Cities #1</span>
                          <span>Hyper-local authority across Bristol VA/TN, Johnson City &amp; Kingsport</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right: Live AI Search & Local Telemetry Metrics */}
                <div className="demo-panel-card telemetry-card">
                  <div className="demo-panel-head">
                    <span className="panel-kicker">LIVE GENERATIVE SEO (GEO) TELEMETRY</span>
                    <span className="live-green-pill">● ACTIVE AI INDEXING</span>
                  </div>

                  <div className="telemetry-bars">
                    <div className="telemetry-row">
                      <div className="telemetry-label-row">
                        <span>Google Local Pack &amp; Organic (Tri-Cities TN/VA)</span>
                        <span className="telemetry-val">98 / 100</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: '98%' }} />
                      </div>
                    </div>

                    <div className="telemetry-row">
                      <div className="telemetry-label-row">
                        <span>ChatGPT / OpenAI Local Entity Citation Score</span>
                        <span className="telemetry-val">96 / 100</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div className="telemetry-row">
                      <div className="telemetry-label-row">
                        <span>Google Gemini &amp; AI Overviews Authority</span>
                        <span className="telemetry-val">97 / 100</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: '97%' }} />
                      </div>
                    </div>

                    <div className="telemetry-row">
                      <div className="telemetry-label-row">
                        <span>Mobile Conversion &amp; 24/7 AI Funnel Velocity</span>
                        <span className="telemetry-val">+310% Lift</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: '94%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="telemetry-footer-note">
                    <span>Built with automated Schema.org graphs, local geo-coordinates &amp; AI-readable endpoints.</span>
                    <button type="button" className="btn-mini-yellow" onClick={onOpenContact}>
                      Request Free Site Audit →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ====================================================================
            REAL RECENT TRI-CITIES WEB & AI CASE STUDIES (FAST TRACK & TEAM VISION)
           ==================================================================== */}
        <div className="tricities-casestudies-block" id="case-studies">
          <div className="casestudies-header">
            <span className="eyebrow-tag">
              <MapPin size={14} />
              <span>PROVEN IN THE TRI-CITIES // LIVE PRODUCTION PLATFORMS</span>
            </span>
            <h3 className="section-title-tracked">RECENT TRI-CITIES BUILDS &amp; MODERNIZATIONS</h3>
            <p className="legends-subtitle">
              Explore two of our recent custom-engineered platforms in Bristol, TN/VA—designed
              and modernized with custom live telemetry dashboards, 24/7 property-trained AI
              lead concierges, and AI-era Generative SEO.
            </p>
          </div>

          <div className="casestudies-grid-2">
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
                <article key={cs.id} className="casestudy-ios-card">
                  {/* Sleek Header Bar */}
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
                      <span>https://www.{cs.domain}</span>
                      <ExternalLink size={12} />
                    </a>
                    <span className="cs-live-tag">{cs.previewStats.status}</span>
                  </div>

                  {/* Visual Telemetry Preview Banner */}
                  <div className="cs-visual-preview">
                    <div className="cs-preview-badge">{cs.badge}</div>
                    <div className="cs-preview-title-row">
                      <div>
                        <h4>{cs.name}</h4>
                        <span className="cs-location-sub">
                          <MapPin size={12} /> {cs.location}
                        </span>
                      </div>
                      <a
                        href={cs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cs-launch-circle"
                        aria-label={`Visit ${cs.name}`}
                      >
                        <ArrowUpRight size={20} />
                      </a>
                    </div>

                    {/* Interactive Cropped Dual-Screen PiP Deck for Both Fast Track & Team Vision */}
                    {cs.frontendImg && cs.dashboardImg && (
                      <div className="cs-interactive-screen-deck">
                        <div className="cs-deck-tabs">
                          <button
                            type="button"
                            className={`cs-deck-tab ${isPrimary ? 'active' : ''}`}
                            onClick={() => toggleCardMode(cs.id, 'primary')}
                          >
                            {cs.id === 'team-vision-llc' ? <Bot size={12} /> : <Activity size={12} />}
                            <span>{cs.primaryTabLabel}</span>
                          </button>
                          <button
                            type="button"
                            className={`cs-deck-tab ${!isPrimary ? 'active' : ''}`}
                            onClick={() => toggleCardMode(cs.id, 'secondary')}
                          >
                            <Monitor size={12} />
                            <span>{cs.secondaryTabLabel}</span>
                          </button>
                          <button
                            type="button"
                            className="cs-deck-expand"
                            onClick={openCardLightbox}
                          >
                            <Maximize2 size={11} />
                            <span>Zoom</span>
                          </button>
                        </div>

                        <div className="cs-layered-screens" onClick={openCardLightbox}>
                          <img
                            src={mainImg}
                            alt={`${cs.name} primary preview`}
                            className="cs-primary-screen-img"
                          />
                          <img
                            src={pipImg}
                            alt={`${cs.name} secondary preview`}
                            className="cs-secondary-pip-img"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardMode(cs.id, isPrimary ? 'secondary' : 'primary');
                            }}
                            title={`Click to swap to ${isPrimary ? cs.secondaryTabLabel : cs.primaryTabLabel}`}
                          />
                          <span className="cs-pip-badge">
                            {isPrimary
                              ? `Swap to ${cs.secondaryTabLabel} ↗`
                              : `Swap to ${cs.primaryTabLabel} ↗`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Mini Metric Pills */}
                    <div className="cs-metrics-row">
                      {cs.metrics.map((m) => (
                        <div key={m.label} className="cs-metric-pill">
                          <span className="cs-m-val">{m.value}</span>
                          <span className="cs-m-lbl">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Study Details */}
                  <div className="cs-card-content">
                    <h5 className="cs-headline">{cs.headline}</h5>
                    <p className="cs-summary">{cs.summary}</p>

                    <ul className="cs-feature-list">
                      {cs.features.map((feat) => (
                        <li key={feat}>
                          <CheckCircle2 size={15} className="check-yellow" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="cs-card-actions">
                      <a
                        href={cs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-wired-yellow cs-visit-btn"
                      >
                        <span>LAUNCH LIVE SITE ({cs.domain.toUpperCase()})</span>
                        <ExternalLink size={14} />
                      </a>
                      <button
                        type="button"
                        className="btn-wired-outline cs-inquire-btn"
                        onClick={onOpenContact}
                      >
                        BUILD ONE LIKE THIS
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            3 CORE AI REVENUE PILLARS + TRI-CITIES LOCAL SEO COVERAGE
           ==================================================================== */}
        <div className="ai-pillars-grid-3">
          {AI_SEO_PILLARS.map((pillar) => (
            <div key={pillar.id} className="ai-pillar-ios-card">
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
            </div>
          ))}
        </div>

        {/* Tri-Cities Local SEO Authority Strip */}
        <div className="tricities-seo-belt">
          <div className="seo-belt-top">
            <div>
              <span className="eyebrow-tag">REGIONAL DOMINANCE + NATIONAL REACH</span>
              <h3>TRI-CITIES AI &amp; GENERATIVE SEO COVERAGE</h3>
            </div>
            <button type="button" className="btn-wired-yellow" onClick={onOpenContact}>
              DOMINATE YOUR LOCAL MARKET
            </button>
          </div>

          <div className="tricities-cities-grid">
            {TRI_CITIES_MARKETS.map((m) => (
              <div key={m.city} className="city-seo-card">
                <div className="city-card-head">
                  <MapPin size={15} className="text-yellow" />
                  <h4>{m.city}</h4>
                </div>
                <p className="city-focus">{m.focus}</p>
                <span className="city-highlight">{m.highlight}</span>
              </div>
            ))}
          </div>
        </div>
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
