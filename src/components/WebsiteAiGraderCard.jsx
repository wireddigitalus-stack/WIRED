import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Globe,
  Cpu,
  Bot,
  Activity,
  X,
  RotateCcw,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { addLead, logTelemetryEvent } from '../utils/telemetry';
import { normalizeDomain, runWebsiteDiagnostic } from '../utils/websiteDiagnostic';

const QUICK_PRESETS = [
  {
    label: 'Wired Digital',
    domain: 'wireddigitalcreative.com',
    tag: 'OUR SITE'
  },
  {
    label: 'Fast Track Bristol',
    domain: 'fasttrackbristoltn.com',
    tag: 'CLIENT'
  },
  {
    label: 'Ringger Law',
    domain: 'ringgerlaw.com',
    tag: 'CLIENT'
  },
  {
    label: 'Sample Legacy Site',
    domain: 'sample-wordpress-agency.com',
    tag: 'LEGACY DEMO'
  }
];

const SCAN_STEPS = [
  'Measuring Mobile Edge Velocity & LCP...',
  'Inspecting Schema.org JSON-LD @graph...',
  'Checking ChatGPT, Gemini & Perplexity GEO Signals...'
];

const METRIC_ICONS = [Activity, Cpu, Globe, Bot];

function parseNumericScore(gradeStr = '', isVerified = false) {
  if (isVerified) return 99;
  const match = String(gradeStr).match(/\((\d+)\s*\/\s*100\)/);
  if (match) return Number(match[1]);
  return 62;
}

function extractLetterGrade(gradeStr = '', isVerified = false) {
  if (isVerified) return 'A+';
  const letter = String(gradeStr).split('(')[0].trim();
  return letter || 'C';
}

function ScoreRing({ score, letter, label, tone = 'green' }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(10, Math.min(100, score));
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`ios-grader-ring-card tone-${tone}`}>
      <div className="ios-ring-svg-wrap">
        <svg viewBox="0 0 64 64" className="ios-ring-svg" aria-hidden="true">
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="ios-ring-track"
            strokeWidth="5.5"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            className="ios-ring-progress"
            strokeWidth="5.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="ios-ring-center">
          <strong className="ios-ring-num">{score}</strong>
          <span className="ios-ring-sub">/100</span>
        </div>
      </div>
      <div className="ios-ring-meta">
        <span className="ios-ring-kicker">{label}</span>
        <strong className="ios-ring-grade">{letter} GRADE</strong>
      </div>
    </div>
  );
}

export default function WebsiteAiGraderCard({
  className = '',
  kicker = 'INTERACTIVE DIAGNOSTIC // 60-SECOND AI & SEARCH GRADER',
  titleLead = 'IS YOUR CURRENT WEBSITE',
  titleHighlight = 'INVISIBLE TO AI SEARCH?',
  subtitle = 'Enter your website URL below—or tap a 1-click preset—to test mobile speed, Schema.org JSON-LD structure, and ChatGPT / Google AI citation readiness.'
}) {
  const [scanUrl, setScanUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIdx, setScanStepIdx] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [blueprintSent, setBlueprintSent] = useState(false);

  useEffect(() => {
    if (!isScanning) {
      setScanStepIdx(0);
      return undefined;
    }
    const interval = setInterval(() => {
      setScanStepIdx((prev) => (prev + 1) % SCAN_STEPS.length);
    }, 320);
    return () => clearInterval(interval);
  }, [isScanning]);

  const executeScan = async (targetRawUrl) => {
    const { cleanDomain } = normalizeDomain(targetRawUrl);
    if (!cleanDomain) return;

    setScanUrl(cleanDomain);
    setIsScanning(true);
    setBlueprintSent(false);
    logTelemetryEvent('WEBSITE_GRADER_SCAN', `Scanned URL: ${cleanDomain}`, 'ai_geo');

    const report = await runWebsiteDiagnostic(cleanDomain);
    setIsScanning(false);
    if (report) {
      setScanResult(report);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeScan(scanUrl);
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

  const currentScore = scanResult
    ? parseNumericScore(scanResult.overallGrade, scanResult.isVerifiedWired)
    : 0;
  const currentLetter = scanResult
    ? extractLetterGrade(scanResult.overallGrade, scanResult.isVerifiedWired)
    : '';

  return (
    <div className={`grader-console-card ios-grader-shell ${className}`.trim()}>
      {/* Top iOS Window Chrome Bar */}
      <div className="ios-grader-chrome-bar">
        <div className="ios-grader-chrome-left">
          <div className="ios-traffic-dots" aria-hidden="true">
            <span className="dot-red" />
            <span className="dot-amber" />
            <span className="dot-green" />
          </div>
          <span className="ios-chrome-kicker">
            <Sparkles size={12} />
            <span>{kicker}</span>
          </span>
        </div>

        <div className="grader-live-badge ios-live-pill">
          <span className="rec-dot" />
          <span>{isScanning ? 'SCANNING LIVE DOM...' : 'WIRED_OS // DIAGNOSTIC READY'}</span>
        </div>
      </div>

      {/* Main Header + Engine Badges */}
      <div className="ios-grader-header">
        <div className="ios-grader-title-col">
          <h2 className="grader-title ios-grader-h2">
            {titleLead} <span className="text-yellow">{titleHighlight}</span>
          </h2>
          <p className="grader-subtitle ios-grader-sub">{subtitle}</p>
        </div>

        <div className="ios-grader-engines-row" aria-label="Audited AI & Search Engines">
          <span className="ios-engine-chip">
            <Globe size={12} /> Google AI &amp; Local Pack
          </span>
          <span className="ios-engine-chip">
            <Bot size={12} /> ChatGPT &amp; Perplexity
          </span>
          <span className="ios-engine-chip">
            <Cpu size={12} /> Schema.org @graph
          </span>
          <span className="ios-engine-chip">
            <Zap size={12} /> &lt;0.4s Edge Speed
          </span>
        </div>
      </div>

      {/* iOS Spotlight Search Capsule */}
      <form className="ios-spotlight-search-bar" onSubmit={handleFormSubmit}>
        <div className="ios-spotlight-input-wrap">
          <span className="ios-protocol-pill" aria-hidden="true">
            <Search size={15} className="ios-search-icon" />
            <span className="ios-https-label">https://</span>
          </span>
          <input
            type="text"
            className="ios-spotlight-input"
            placeholder="yourbusiness.com"
            value={scanUrl}
            onChange={(e) => setScanUrl(e.target.value)}
            aria-label="Website URL to scan"
          />
          {scanUrl && !isScanning && (
            <button
              type="button"
              className="ios-clear-input-btn"
              onClick={() => {
                setScanUrl('');
                setScanResult(null);
              }}
              aria-label="Clear URL"
              title="Clear URL"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="btn-wired-yellow ios-spotlight-submit-btn"
          disabled={isScanning}
        >
          <Zap size={15} fill="#050505" />
          <span>{isScanning ? 'SCANNING...' : 'RUN AI DIAGNOSTIC →'}</span>
        </button>
      </form>

      {/* 1-Tap Quick Benchmark Pills */}
      <div className="ios-preset-pills-row">
        <span className="ios-preset-label">1-TAP INSTANT TEST:</span>
        <div className="ios-preset-chips-scroll">
          {QUICK_PRESETS.map((preset) => {
            const isActive =
              scanResult?.domain?.toLowerCase() === preset.domain.toLowerCase();
            return (
              <button
                key={preset.domain}
                type="button"
                className={`ios-preset-chip ${isActive ? 'active' : ''}`}
                onClick={() => executeScan(preset.domain)}
                disabled={isScanning}
              >
                <span className={`ios-preset-tag ${preset.tag === 'LEGACY DEMO' ? 'legacy' : ''}`}>
                  {preset.tag}
                </span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Multi-Step Scanning HUD */}
      {isScanning && (
        <div className="ios-scanning-hud" role="status" aria-live="polite">
          <div className="ios-scanning-top">
            <span className="ios-scan-spinner" />
            <strong>{SCAN_STEPS[scanStepIdx]}</strong>
            <span className="ios-scan-domain-tag">{normalizeDomain(scanUrl).cleanDomain}</span>
          </div>
          <div className="ios-scanning-bar-track">
            <div className="ios-scanning-bar-fill" />
          </div>
        </div>
      )}

      {/* iOS Health-Ring Style Diagnostic Results Panel */}
      {scanResult && !isScanning && (
        <div className="grader-results-panel ios-results-stage">
          {/* Top Score Ring Summary Bar */}
          <div className="ios-results-summary-card">
            <div className="ios-summary-domain-col">
              <div className="ios-domain-badge-row">
                <span
                  className={`ios-domain-status-pill ${
                    scanResult.isVerifiedWired ? 'verified' : 'legacy'
                  }`}
                >
                  {scanResult.isVerifiedWired ? (
                    <>
                      <ShieldCheck size={12} /> VERIFIED WIRED AI ARCHITECTURE
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={12} /> AI &amp; SEARCH UPGRADE OPPORTUNITY
                    </>
                  )}
                </span>
                <button
                  type="button"
                  className="ios-reset-scan-btn"
                  onClick={() => {
                    setScanResult(null);
                    setScanUrl('');
                  }}
                >
                  <RotateCcw size={11} /> Reset
                </button>
              </div>

              <div className="ios-domain-headline">
                <Globe size={18} className="text-yellow" />
                <strong>{scanResult.domain.toLowerCase()}</strong>
              </div>

              <p className="ios-domain-summary-copy">
                {scanResult.summaryBanner ||
                  `We audited ${scanResult.domain} across Mobile Edge Speed, Schema.org JSON-LD entity structure, ChatGPT/Google AI citation signals, and 24/7 AI lead capture.`}
              </p>
            </div>

            <div className="ios-rings-comparison-cluster">
              <ScoreRing
                score={currentScore}
                letter={currentLetter}
                label={scanResult.isVerifiedWired ? 'VERIFIED SCORE' : 'CURRENT SCORE'}
                tone={scanResult.isVerifiedWired ? 'green' : 'amber'}
              />
              {!scanResult.isVerifiedWired && (
                <>
                  <div className="ios-ring-arrow-bridge" aria-hidden="true">
                    <span>WIRED UPGRADE</span>
                    <ArrowRight size={18} className="text-yellow" />
                  </div>
                  <ScoreRing
                    score={99}
                    letter="A+"
                    label="WIRED AI TARGET"
                    tone="green"
                  />
                </>
              )}
            </div>
          </div>

          {/* 4 iOS Bento Metric Cards */}
          <div className="grader-metrics-grid ios-metrics-bento">
            {scanResult.metrics.map((m, idx) => {
              const IconComp = METRIC_ICONS[idx % METRIC_ICONS.length];
              return (
                <div
                  key={m.label}
                  className={`grader-metric-card ios-metric-bento-card ${
                    m.passed ? 'passed-card' : ''
                  }`}
                >
                  <div className="ios-metric-card-top">
                    <span className="ios-metric-icon-box">
                      <IconComp size={15} />
                    </span>
                    <span className={`grader-metric-status ${m.passed ? 'passed' : ''}`}>
                      {m.status}
                    </span>
                  </div>

                  <h4>{m.label}</h4>

                  <div className="ios-metric-rows">
                    <div className={`ios-metric-row ${m.passed ? 'good' : 'bad'}`}>
                      <span className="ios-row-kicker">{m.currentLabel || 'Current'}</span>
                      <strong>{m.current}</strong>
                    </div>
                    <div className="ios-metric-row good target-row">
                      <span className="ios-row-kicker">
                        <Zap size={10} fill="currentColor" /> {m.targetLabel || 'Wired AI'}
                      </span>
                      <strong>{m.target}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom iOS Blueprint Action Bar */}
          {!blueprintSent ? (
            <form className="grader-blueprint-capture ios-blueprint-bar" onSubmit={handleSendBlueprintLead}>
              <div className="blueprint-capture-copy">
                <strong>
                  {scanResult.isVerifiedWired
                    ? 'Want WIRED DIGITAL to engineer this exact A+ (99/100) AI Architecture for your business?'
                    : `Get a Custom AI & Search Modernization Blueprint for ${scanResult.domain}`}
                </strong>
                <span>Sent straight from our studio — flat-rate pricing, zero middlemen.</span>
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
                <button type="submit" className="btn-wired-yellow ios-blueprint-submit">
                  <span>SEND MY BLUEPRINT →</span>
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
  );
}
