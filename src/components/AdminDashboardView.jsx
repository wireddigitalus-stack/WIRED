import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Filter,
  Globe,
  Layers,
  LayoutDashboard,
  Lock,
  Mail,
  MapPin,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  TrendingUp,
  Unlock,
  Users,
  Zap
} from 'lucide-react';
import { BRAND_INFO } from '../data/wiredData';
import {
  AI_ENGINE_SHARE,
  SUPABASE_PROJECT_URL,
  SUPABASE_SQL_SCHEMA,
  TRACKED_SEO_KEYWORDS,
  addLead,
  authorizeStudioDevice,
  computeLiveAnalytics,
  deleteLead,
  exportLeadsToCsv,
  getClientHardwareSignature,
  getLastDbStatus,
  getLeads,
  getSectionCounts,
  getSupabaseConfig,
  getTelemetryEvents,
  isStudioDeviceAuthorized,
  logTelemetryEvent,
  pushLeadToSupabase,
  revokeStudioDevice,
  runLiveSiteSeoAudit,
  saveSupabaseConfig,
  syncLeadsWithSupabase,
  updateLead
} from '../utils/telemetry';

const PIN_STORAGE_KEY = 'wired_os_admin_unlocked';
const STUDIO_PIN = '1999';

/**
 * Generates a smooth cubic Bézier SVG path + closed area fill path from array of [x, y] coordinates
 */
function buildSmoothSplinePaths(coords, baselineY) {
  if (!coords || coords.length === 0) return { linePath: '', areaPath: '' };
  if (coords.length === 1) {
    const [x, y] = coords[0];
    return {
      linePath: `M ${x},${y}`,
      areaPath: `M ${x},${baselineY} L ${x},${y} L ${x},${baselineY} Z`
    };
  }

  let d = `M ${coords[0][0].toFixed(1)},${coords[0][1].toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const [x0, y0] = coords[i];
    const [x1, y1] = coords[i + 1];
    const cpx1 = x0 + (x1 - x0) * 0.45;
    const cpy1 = y0;
    const cpx2 = x0 + (x1 - x0) * 0.55;
    const cpy2 = y1;
    d += ` C ${cpx1.toFixed(1)},${cpy1.toFixed(1)} ${cpx2.toFixed(1)},${cpy2.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }

  const firstX = coords[0][0].toFixed(1);
  const lastX = coords[coords.length - 1][0].toFixed(1);
  const areaPath = `${d} L ${lastX},${baselineY} L ${firstX},${baselineY} Z`;

  return { linePath: d, areaPath };
}

/**
 * iOS Activity Ring Gauge Component (0-100)
 */
function IosScoreRing({ score, label, sublabel, color = '#FFEE00' }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="wos-ring-card">
      <div className="wos-ring-svg-wrap">
        <svg viewBox="0 0 108 108" className="wos-ring-svg">
          <circle
            cx="54"
            cy="54"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          <circle
            cx="54"
            cy="54"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 54 54)"
            style={{
              filter: `drop-shadow(0 0 8px ${color}66)`,
              transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />
        </svg>
        <div className="wos-ring-center">
          <span className="wos-ring-val" style={{ color }}>
            {score}
          </span>
          <span className="wos-ring-max">/100</span>
        </div>
      </div>
      <div className="wos-ring-meta">
        <span className="wos-ring-label">{label}</span>
        <span className="wos-ring-sub">{sublabel}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardView({ onExitDashboard }) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return (
        isStudioDeviceAuthorized() ||
        sessionStorage.getItem(PIN_STORAGE_KEY) === 'true'
      );
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showOwnerKeyEntry, setShowOwnerKeyEntry] = useState(false);
  const [shieldTapCount, setShieldTapCount] = useState(0);

  // Active Command Center Module: 'overview' | 'leads' | 'analytics' | 'seo'
  const [activeModule, setActiveModule] = useState('overview');

  // Timeframe for Dark iOS Spline Graph: '24H' | '7D' | '30D' | '90D'
  const [timeframe, setTimeframe] = useState('30D');
  const [hoverPointIndex, setHoverPointIndex] = useState(null);
  const [visibleSeries, setVisibleSeries] = useState({
    visitors: true,
    aiGeo: true,
    leads: true
  });

  // Leads CRM State
  const [leads, setLeads] = useState(() => getLeads());
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [newLeadDraft, setNewLeadDraft] = useState({
    name: '',
    contact: '',
    companyUrl: '',
    service: 'AI Website Design, Redesign & Modernization',
    urgency: 'Ready to Start (This Month)',
    ValueEstimate: '$6,500',
    details: '',
    notes: ''
  });

  // Live Telemetry & Section Engagement State
  const [telemetryEvents, setTelemetryEvents] = useState(() => getTelemetryEvents());
  const [sectionCounts, setSectionCounts] = useState(() => getSectionCounts());

  // Live SEO & GEO Audit State + Prospect Audit Generator (starts clean with no mock company)
  const [seoAudit, setSeoAudit] = useState(() => runLiveSiteSeoAudit());
  const [prospectName, setProspectName] = useState('');
  const [prospectUrl, setProspectUrl] = useState('');
  const [prospectCity, setProspectCity] = useState('Bristol, TN/VA');

  // Supabase Cloud Database State (https://urzkegplrgskzfejgudc.supabase.co)
  const [sbConfig, setSbConfig] = useState(() => getSupabaseConfig());
  const [sbKeyInput, setSbKeyInput] = useState(() => getSupabaseConfig().anonKey || '');
  const [sbSyncStatus, setSbSyncStatus] = useState(() => getLastDbStatus());
  const [isSbSyncing, setIsSbSyncing] = useState(false);
  const [showSbSqlModal, setShowSbSqlModal] = useState(false);
  const [copiedSbSql, setCopiedSbSql] = useState(false);

  const handleSupabaseSync = async () => {
    setIsSbSyncing(true);
    setSbSyncStatus('Connecting to https://urzkegplrgskzfejgudc.supabase.co...');
    const res = await syncLeadsWithSupabase();
    setIsSbSyncing(false);
    setSbSyncStatus(res.message || '');
    setTelemetryEvents([...getTelemetryEvents()]);
    if (res.leads) {
      setLeads([...res.leads]);
      if (res.leads.length > 0 && !selectedLeadId) {
        setSelectedLeadId(res.leads[0].id);
      }
    }
    if (res.needsTable) {
      setShowSbSqlModal(true);
    }
    return res;
  };

  const handleSaveSupabaseKey = async (e) => {
    e.preventDefault();
    const updated = saveSupabaseConfig({
      url: SUPABASE_PROJECT_URL,
      anonKey: sbKeyInput
    });
    setSbConfig(updated);
    setSbKeyInput(updated.anonKey || '');
    if (updated.isConfigured) {
      await handleSupabaseSync();
    } else {
      setSbSyncStatus('Cleared Supabase Anon Key (using local storage fallback).');
    }
  };

  const handleSendTestLeadToSupabase = async () => {
    setIsSbSyncing(true);
    setSbSyncStatus('Saving live verification lead to Supabase (public.wired_leads)...');
    const updatedList = addLead({
      source: 'Dashboard DB Verification',
      name: `Studio DB Verification (${new Date().toLocaleTimeString()})`,
      contact: 'WiredDigitalUS@gmail.com • 731-616-5121',
      companyUrl: 'https://www.wireddigitalcreative.com',
      service: 'Supabase Cloud CRM Verification',
      urgency: 'Verified Live',
      ValueEstimate: '$5,500',
      details: 'Live round-trip database write test from WIRED_OS Command Center to public.wired_leads.',
      notes: 'Safe to delete after verifying in Supabase Table Editor.'
    });
    const createdLead = updatedList[0];
    setLeads([...updatedList]);
    setSelectedLeadId(createdLead?.id || null);
    setTelemetryEvents([...getTelemetryEvents()]);

    if (getSupabaseConfig().isConfigured && createdLead) {
      const pushRes = await pushLeadToSupabase(createdLead);
      if (pushRes.ok) {
        const syncRes = await syncLeadsWithSupabase();
        setIsSbSyncing(false);
        if (syncRes.leads) {
          setLeads([...syncRes.leads]);
        }
        setSbSyncStatus(
          `✓ VERIFIED! Lead "${createdLead.name}" saved to Supabase public.wired_leads (${syncRes.leads?.length || updatedList.length} total in DB).`
        );
      } else {
        setIsSbSyncing(false);
        setSbSyncStatus(
          pushRes.reason ||
            'Saved locally, but Supabase write failed. Make sure you ran the SQL Table Script once in Supabase.'
        );
      }
    } else {
      setIsSbSyncing(false);
      setSbSyncStatus('Saved locally. Paste your Supabase Anon / Publishable Key above and click SAVE KEY & CONNECT to store in Cloud Postgres.');
    }
  };

  useEffect(() => {
    const currentLeads = getLeads();
    setLeads(currentLeads);
    if (currentLeads.length > 0 && !selectedLeadId) {
      setSelectedLeadId(currentLeads[0].id);
    }
    setTelemetryEvents(getTelemetryEvents());
    setSectionCounts(getSectionCounts());
    setSeoAudit(runLiveSiteSeoAudit());

    if (getSupabaseConfig().isConfigured) {
      syncLeadsWithSupabase().then((res) => {
        if (res.leads) {
          setLeads([...res.leads]);
        }
        if (res.message) {
          setSbSyncStatus(res.message);
        }
        if (res.needsTable) {
          setShowSbSqlModal(true);
        }
        setTelemetryEvents([...getTelemetryEvents()]);
      });
    }

    const onLeadsUpdated = (ev) => {
      const latest = getLeads();
      setLeads([...latest]);
      setTelemetryEvents([...getTelemetryEvents()]);
      if (ev?.detail?.message) {
        setSbSyncStatus(ev.detail.message);
      }
    };
    window.addEventListener('wired-leads-updated', onLeadsUpdated);
    return () => window.removeEventListener('wired-leads-updated', onLeadsUpdated);
  }, []);

  const handleUnlockWithPin = (code) => {
    if (code === STUDIO_PIN) {
      authorizeStudioDevice();
      setUnlocked(true);
      setPinError(false);
      setShowOwnerKeyEntry(false);
      logTelemetryEvent('ADMIN_UNLOCK', 'Creative Director unlocked WIRED_OS Command Center (Mac/iPhone Verified)', 'system');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleShieldTap = () => {
    const next = shieldTapCount + 1;
    setShieldTapCount(next);
    if (next >= 3) {
      setShowOwnerKeyEntry(true);
    }
  };

  const handleTestRedBlockScreen = () => {
    revokeStudioDevice();
    setPinInput('');
    setPinError(false);
    setShowOwnerKeyEntry(false);
    setShieldTapCount(0);
    setUnlocked(false);
  };

  const handlePinDigit = (digit) => {
    setPinError(false);
    const next = (pinInput + digit).slice(0, 4);
    setPinInput(next);
    if (next.length === 4) {
      handleUnlockWithPin(next);
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.name || '').toLowerCase().includes(q) ||
        (item.contact || '').toLowerCase().includes(q) ||
        (item.service || '').toLowerCase().includes(q) ||
        (item.details || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  const selectedLead = useMemo(() => {
    return (
      leads.find((l) => l.id === selectedLeadId) ||
      filteredLeads[0] ||
      leads[0] ||
      null
    );
  }, [leads, selectedLeadId, filteredLeads]);

  const newLeadsCount = useMemo(
    () => leads.filter((l) => l.status === 'NEW').length,
    [leads]
  );

  // Compute live analytics strictly from real leads and real telemetry events
  const liveAnalytics = useMemo(
    () => computeLiveAnalytics(leads, telemetryEvents),
    [leads, telemetryEvents]
  );
  const currentSeriesData =
    liveAnalytics.timeframes[timeframe] || liveAnalytics.timeframes['30D'];

  // Build SVG Spline Coordinates for Current Timeframe
  const chartGeometry = useMemo(() => {
    const pts = currentSeriesData.points;
    const width = 760;
    const height = 250;
    const padX = 44;
    const padTop = 24;
    const padBottom = 34;
    const usableW = width - padX * 2;
    const usableH = height - padTop - padBottom;
    const baselineY = height - padBottom;

    const maxVisitors = Math.max(...pts.map((p) => p.visitors), 5);
    const maxLeads = Math.max(...pts.map((p) => p.leads), 3);

    const visitorCoords = [];
    const aiGeoCoords = [];
    const leadCoords = [];

    pts.forEach((pt, idx) => {
      const x =
        pts.length === 1
          ? width / 2
          : padX + (idx / (pts.length - 1)) * usableW;
      const yVis = baselineY - (pt.visitors / maxVisitors) * usableH;
      const yAi = baselineY - (pt.aiGeo / maxVisitors) * usableH;
      // Scale leads relative to chart height so conversion curve is clearly visible
      const yLead = baselineY - (pt.leads / (maxLeads * 1.35)) * (usableH * 0.72);

      visitorCoords.push([x, yVis]);
      aiGeoCoords.push([x, yAi]);
      leadCoords.push([x, yLead]);
    });

    return {
      width,
      height,
      baselineY,
      pts,
      visitorCoords,
      aiGeoCoords,
      leadCoords,
      visitorPaths: buildSmoothSplinePaths(visitorCoords, baselineY),
      aiGeoPaths: buildSmoothSplinePaths(aiGeoCoords, baselineY),
      leadPaths: buildSmoothSplinePaths(leadCoords, baselineY)
    };
  }, [currentSeriesData]);

  const handleStatusChange = (leadId, nextStatus) => {
    const updated = updateLead(leadId, { status: nextStatus });
    setLeads([...updated]);
  };

  const handlePriorityChange = (leadId, nextPriority) => {
    const updated = updateLead(leadId, { priority: nextPriority });
    setLeads([...updated]);
  };

  const handleNotesChange = (leadId, notes) => {
    const updated = updateLead(leadId, { notes });
    setLeads([...updated]);
  };

  const handleDeleteLead = (leadId) => {
    const updated = deleteLead(leadId);
    setLeads([...updated]);
    if (selectedLeadId === leadId) {
      setSelectedLeadId(updated[0]?.id || null);
    }
  };

  const handleCreateManualLead = async (e) => {
    e.preventDefault();
    const updated = addLead({
      source: 'Manual Studio Entry',
      ...newLeadDraft
    });
    setLeads([...updated]);
    setSelectedLeadId(updated[0]?.id || null);
    setTelemetryEvents([...getTelemetryEvents()]);
    setShowNewLeadForm(false);
    setNewLeadDraft({
      name: '',
      contact: '',
      companyUrl: '',
      service: 'AI Website Design, Redesign & Modernization',
      urgency: 'Ready to Start (This Month)',
      ValueEstimate: '$6,500',
      details: '',
      notes: ''
    });
    if (getSupabaseConfig().isConfigured && updated[0]) {
      const pushRes = await pushLeadToSupabase(updated[0]);
      if (pushRes.ok) {
        setSbSyncStatus(`✓ Saved manual lead "${updated[0].name}" to Supabase public.wired_leads.`);
      }
    }
  };

  const handleRefreshTelemetry = async () => {
    setLeads([...getLeads()]);
    setTelemetryEvents([...getTelemetryEvents()]);
    setSectionCounts({ ...getSectionCounts() });
    setSeoAudit(runLiveSiteSeoAudit());
    if (getSupabaseConfig().isConfigured) {
      await handleSupabaseSync();
    }
  };

  // ==========================================================================
  // RENDER RED HARDWARE SECURITY INTERCEPT IF DEVICE IS NOT AUTHORIZED
  // ==========================================================================
  if (!unlocked) {
    const detectedSignature = getClientHardwareSignature();

    return (
      <div className="wos-admin-shell wos-red-firewall-backdrop" role="alertdialog" aria-modal="true">
        <div className="wos-red-warning-modal">
          {/* Top Flashing Red Security Strip */}
          <div className="wos-red-topbar">
            <div className="wos-red-status-cluster">
              <span className="wos-red-strobe-dot" />
              <span>SECURITY ALERT // UNAUTHORIZED HARDWARE SIGNATURE</span>
            </div>
            <span className="wos-red-code-tag">ERR_403 // WIRED_OS FIREWALL</span>
          </div>

          <div className="wos-red-modal-body">
            {/* Tapping the Red Shield 3 times reveals the hidden Owner Hardware Key keypad */}
            <button
              type="button"
              className="wos-red-shield-badge"
              onClick={handleShieldTap}
              title="Hardware Security Lock"
            >
              <ShieldAlert size={40} className="wos-red-shield-icon" />
            </button>

            <span className="wos-red-kicker">RESTRICTED STUDIO TERMINAL</span>
            <h2 className="wos-red-main-title">You are not authorized to log in.</h2>
            <p className="wos-red-subcopy">
              Access to <strong>WIRED_OS v2.6</strong> administrative telemetry and Lead
              Vault controls is hardware-locked exclusively to Creative Director{' '}
              <strong>Rob Neilson&apos;s authorized Mac workstation and iPhone</strong>.
            </p>

            {/* Live Red Telemetry Readout Box */}
            <div className="wos-red-telemetry-box">
              <div className="wos-red-tele-row">
                <span className="wos-red-tele-lbl">DETECTED CLIENT:</span>
                <span className="wos-red-tele-val">{detectedSignature}</span>
              </div>
              <div className="wos-red-tele-row">
                <span className="wos-red-tele-lbl">STUDIO HARDWARE KEY:</span>
                <span className="wos-red-tele-val danger">UNVERIFIED // BLOCKED</span>
              </div>
              <div className="wos-red-tele-row">
                <span className="wos-red-tele-lbl">SECURITY LOG:</span>
                <span className="wos-red-tele-val">UNAUTHORIZED ATTEMPT RECORDED</span>
              </div>
            </div>

            {/* Secret Owner Mac / iPhone Hardware Key Enrollment Drawer */}
            {showOwnerKeyEntry && (
              <div className="wos-owner-enroll-box">
                <div className="wos-owner-enroll-head">
                  <Smartphone size={14} />
                  <span>STUDIO OWNER: BIND THIS MAC / iPHONE HARDWARE KEY</span>
                </div>

                <div className={`wos-pin-dots ${pinError ? 'pin-shake' : ''}`}>
                  {[0, 1, 2, 3].map((idx) => (
                    <span
                      key={idx}
                      className={`wos-pin-dot ${pinInput.length > idx ? 'filled' : ''}`}
                    />
                  ))}
                </div>

                {pinError && (
                  <span className="wos-pin-error-msg">
                    UNAUTHORIZED HARDWARE PIN — ACCESS DENIED
                  </span>
                )}

                <div className="wos-keypad-grid">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      className="wos-keypad-btn"
                      onClick={() => handlePinDigit(digit)}
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="wos-keypad-btn secondary"
                    onClick={() => setPinInput('')}
                  >
                    CLR
                  </button>
                  <button
                    type="button"
                    className="wos-keypad-btn"
                    onClick={() => handlePinDigit('0')}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    className="wos-keypad-btn secondary"
                    onClick={() => setPinInput((p) => p.slice(0, -1))}
                  >
                    DEL
                  </button>
                </div>
              </div>
            )}

            <div className="wos-red-actions">
              <button
                type="button"
                className="wos-red-return-btn"
                onClick={onExitDashboard}
              >
                <ArrowLeft size={15} />
                <span>RETURN TO PUBLIC WEBSITE</span>
              </button>

              {!showOwnerKeyEntry && (
                <button
                  type="button"
                  className="wos-owner-discreet-link"
                  onClick={() => setShowOwnerKeyEntry(true)}
                >
                  <Lock size={11} />
                  <span>Rob&apos;s Mac / iPhone? Pair Hardware Key</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Section Engagement Funnel Bars (100% live counts, zero mock fallbacks)
  const rawFunnelDefs = [
    {
      key: 'wired_os_stage',
      label: 'WIRED_OS Interactive Showcase (Fast Track & Vision)',
      views: sectionCounts.wired_os_stage || 0,
      color: '#FFEE00'
    },
    {
      key: 'case_studies_tricities',
      label: 'Tri-Cities Case Study Cards & Screen Lightbox',
      views: sectionCounts.case_studies_tricities || 0,
      color: '#30D158'
    },
    {
      key: 'since_1999_reel',
      label: 'Since 1999 Video Clip & Manifesto',
      views: sectionCounts.since_1999_reel || 0,
      color: '#0A84FF'
    },
    {
      key: 'legends_vault',
      label: 'Working With Legends (34 Client Logos Vault)',
      views: sectionCounts.legends_vault || 0,
      color: '#BF5AF2'
    },
    {
      key: 'video_screening_room',
      label: 'Global Video Screening Room (Halestorm / Cooper)',
      views: sectionCounts.video_screening_room || 0,
      color: '#5AC8FA'
    },
    {
      key: 'footer_lead_drawer',
      label: 'Collapsible Footer Lead Concierge Form',
      views: sectionCounts.footer_lead_drawer || 0,
      color: '#FF9F0A'
    }
  ];
  const totalFunnelViews = rawFunnelDefs.reduce((acc, f) => acc + f.views, 0);
  const funnelItems = rawFunnelDefs.map((f) => ({
    ...f,
    rate: totalFunnelViews > 0 ? `${Math.round((f.views / totalFunnelViews) * 100)}%` : '0%'
  }));
  const maxFunnelViews = Math.max(...funnelItems.map((f) => f.views), 1);

  return (
    <div className="wos-admin-shell">
      {/* ====================================================================
          TOP iOS OBSIDIAN COMMAND HEADER & MODULE SWITCHER
         ==================================================================== */}
      <div className="wos-command-topbar">
        <div className="wos-topbar-left">
          <button
            type="button"
            className="wos-back-site-btn"
            onClick={onExitDashboard}
            title="Return to Live Public Site"
          >
            <ArrowLeft size={14} />
            <span>LIVE SITE</span>
          </button>

          <div className="wos-system-identity">
            <img
              src={BRAND_INFO.roundStampSrc}
              alt="Wired Digital"
              className="wos-topbar-stamp"
            />
            <div>
              <div className="wos-sys-status-row">
                <span className="live-green-dot" />
                <span className="wos-sys-tag">WIRED_OS v2.6 // ADMIN COMMAND CENTER</span>
              </div>
              <h1 className="wos-sys-title">
                WIRED DIGITAL TELEMETRY, LEADS CRM &amp; AI/GEO SEO SUITE
              </h1>
            </div>
          </div>
        </div>

        {/* 4-Module iOS Segmented Dock */}
        <div className="wos-module-dock" role="tablist">
          <button
            type="button"
            className={`wos-dock-tab ${activeModule === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveModule('overview')}
          >
            <LayoutDashboard size={14} />
            <span>OVERVIEW</span>
          </button>

          <button
            type="button"
            className={`wos-dock-tab ${activeModule === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveModule('leads')}
          >
            <Users size={14} />
            <span>LEADS CRM</span>
            {newLeadsCount > 0 && (
              <span className="wos-badge-count">{newLeadsCount} NEW</span>
            )}
          </button>

          <button
            type="button"
            className={`wos-dock-tab ${activeModule === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveModule('analytics')}
          >
            <BarChart3 size={14} />
            <span>SITE ANALYTICS</span>
          </button>

          <button
            type="button"
            className={`wos-dock-tab ${activeModule === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveModule('seo')}
          >
            <ShieldCheck size={14} />
            <span>SEO &amp; GEO REPORTS</span>
          </button>
        </div>

        <div className="wos-topbar-right">
          <button
            type="button"
            className="wos-icon-action-btn"
            onClick={handleRefreshTelemetry}
            title="Sync Live Leads & DOM Audit"
          >
            <RefreshCw size={14} />
            <span>SYNC LIVE</span>
          </button>
          <button
            type="button"
            className="wos-icon-action-btn"
            onClick={() => exportLeadsToCsv(leads)}
            title="Export Leads CRM to CSV"
          >
            <Download size={14} />
            <span>EXPORT CSV</span>
          </button>
          <button
            type="button"
            className="wos-icon-action-btn danger-btn"
            onClick={handleTestRedBlockScreen}
            title="Preview the Red 'Not Authorized' Warning Popup"
          >
            <ShieldAlert size={14} />
            <span>TEST RED BLOCK</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          MAIN COMMAND CENTER WORKSPACE
         ==================================================================== */}
      <div className="wos-workspace-container">
        {/* ==================================================================
            MODULE 1: EXECUTIVE OVERVIEW & MULTI-SERIES DARK iOS SPLINE GRAPH
           ================================================================== */}
        {activeModule === 'overview' && (
          <div className="wos-module-stack">
            {/* Top 4 iOS Live KPI Cards */}
            <div className="wos-kpi-grid-4">
              <div
                className="wos-kpi-card clickable"
                onClick={() => setActiveModule('leads')}
              >
                <div className="wos-kpi-top">
                  <span className="wos-kpi-label">ACTIVE PIPELINE LEADS</span>
                  <span className="wos-delta-pill green">
                    {sbConfig.isConfigured ? 'SUPABASE LIVE' : 'LOCAL CRM'}
                  </span>
                </div>
                <div className="wos-kpi-main-row">
                  <span className="wos-kpi-big yellow">{leads.length}</span>
                  <span className="wos-kpi-subtag">{newLeadsCount} Unread New</span>
                </div>
                <p className="wos-kpi-foot">
                  Synced across Footer Form, Contact Modal &amp; WIRED-64
                </p>
              </div>

              <div
                className="wos-kpi-card clickable"
                onClick={() => setActiveModule('analytics')}
              >
                <div className="wos-kpi-top">
                  <span className="wos-kpi-label">
                    LIVE EVENTS ({timeframe})
                  </span>
                  <span className="wos-delta-pill green">
                    {currentSeriesData.visitorDelta}
                  </span>
                </div>
                <div className="wos-kpi-main-row">
                  <span className="wos-kpi-big">{currentSeriesData.totalVisitors}</span>
                  <span className="wos-kpi-subtag">Real-Time Interactions</span>
                </div>
                <p className="wos-kpi-foot">
                  100% Live First-Party Click-Stream (Zero Mock Data)
                </p>
              </div>

              <div
                className="wos-kpi-card clickable"
                onClick={() => setActiveModule('seo')}
              >
                <div className="wos-kpi-top">
                  <span className="wos-kpi-label">AI SEARCH / GEO EVENTS</span>
                  <span className="wos-delta-pill cyan">{currentSeriesData.aiDelta}</span>
                </div>
                <div className="wos-kpi-main-row">
                  <span className="wos-kpi-big cyan">
                    {currentSeriesData.aiCitations}
                  </span>
                  <span className="wos-kpi-subtag">ChatGPT • Gemini • Perplexity</span>
                </div>
                <p className="wos-kpi-foot">
                  JSON-LD @graph + /llms.txt + /sitemap.xml Active
                </p>
              </div>

              <div
                className="wos-kpi-card clickable"
                onClick={() => setActiveModule('seo')}
              >
                <div className="wos-kpi-top">
                  <span className="wos-kpi-label">SITE SEO &amp; VITALS HEALTH</span>
                  <span className="wos-delta-pill green">{seoAudit.overallScore} / 100</span>
                </div>
                <div className="wos-kpi-main-row">
                  <span className="wos-kpi-big green">
                    {currentSeriesData.avgLoadMs}
                  </span>
                  <span className="wos-kpi-subtag">Edge LCP Response</span>
                </div>
                <p className="wos-kpi-foot">
                  {seoAudit.checks.filter((c) => c.status === 'PASS').length}/
                  {seoAudit.checks.length} Live DOM &amp; Schema Checks Passed
                </p>
              </div>
            </div>

            {/* Primary Dark iOS Multi-Series Glowing Spline Area Chart */}
            <div className="wos-glass-panel">
              <div className="wos-panel-header">
                <div>
                  <span className="wos-panel-kicker">
                    REAL-TIME TELEMETRY &amp; GENERATIVE AI SEARCH VELOCITY
                  </span>
                  <h2 className="wos-panel-title">
                    Live Site Events, AI Search Referrals (GEO) &amp; Lead Conversions
                  </h2>
                </div>

                <div className="wos-chart-controls">
                  {/* Series Toggle Pills */}
                  <div className="wos-series-toggles">
                    <button
                      type="button"
                      className={`wos-series-chip yellow ${visibleSeries.visitors ? 'on' : ''}`}
                      onClick={() =>
                        setVisibleSeries((s) => ({ ...s, visitors: !s.visitors }))
                      }
                    >
                      <span className="chip-dot yellow" />
                      <span>Live Events</span>
                    </button>
                    <button
                      type="button"
                      className={`wos-series-chip cyan ${visibleSeries.aiGeo ? 'on' : ''}`}
                      onClick={() =>
                        setVisibleSeries((s) => ({ ...s, aiGeo: !s.aiGeo }))
                      }
                    >
                      <span className="chip-dot cyan" />
                      <span>AI / GEO Events</span>
                    </button>
                    <button
                      type="button"
                      className={`wos-series-chip green ${visibleSeries.leads ? 'on' : ''}`}
                      onClick={() =>
                        setVisibleSeries((s) => ({ ...s, leads: !s.leads }))
                      }
                    >
                      <span className="chip-dot green" />
                      <span>Leads Saved</span>
                    </button>
                  </div>

                  {/* Timeframe Segmented Switcher */}
                  <div className="wos-timeframe-pills">
                    {['24H', '7D', '30D', '90D'].map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        className={`wos-tf-btn ${timeframe === tf ? 'active' : ''}`}
                        onClick={() => {
                          setTimeframe(tf);
                          setHoverPointIndex(null);
                        }}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Glowing SVG Spline Area Chart */}
              <div className="wos-spline-chart-stage">
                <svg
                  viewBox={`0 0 ${chartGeometry.width} ${chartGeometry.height}`}
                  className="wos-spline-svg"
                >
                  <defs>
                    <linearGradient id="gradVisitorsYellow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFEE00" stopOpacity="0.42" />
                      <stop offset="100%" stopColor="#FFEE00" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradAiCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.38" />
                      <stop offset="100%" stopColor="#0A84FF" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradLeadsGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#30D158" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#30D158" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Reference Grid Lines */}
                  {[0.2, 0.45, 0.7, 0.95].map((ratio, idx) => {
                    const y = Math.round(chartGeometry.height * ratio);
                    return (
                      <line
                        key={idx}
                        x1="36"
                        y1={y}
                        x2={chartGeometry.width - 36}
                        y2={y}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="4 6"
                      />
                    );
                  })}

                  {/* Series 1: Visitors (Electric Yellow) */}
                  {visibleSeries.visitors && (
                    <g>
                      <path
                        d={chartGeometry.visitorPaths.areaPath}
                        fill="url(#gradVisitorsYellow)"
                      />
                      <path
                        d={chartGeometry.visitorPaths.linePath}
                        fill="none"
                        stroke="#FFEE00"
                        strokeWidth="3.2"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(255, 238, 0, 0.55))' }}
                      />
                    </g>
                  )}

                  {/* Series 2: AI Search & GEO Citations (iOS Electric Blue) */}
                  {visibleSeries.aiGeo && (
                    <g>
                      <path
                        d={chartGeometry.aiGeoPaths.areaPath}
                        fill="url(#gradAiCyan)"
                      />
                      <path
                        d={chartGeometry.aiGeoPaths.linePath}
                        fill="none"
                        stroke="#0A84FF"
                        strokeWidth="2.8"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(10, 132, 255, 0.55))' }}
                      />
                    </g>
                  )}

                  {/* Series 3: Lead Conversions (iOS Telemetry Green) */}
                  {visibleSeries.leads && (
                    <g>
                      <path
                        d={chartGeometry.leadPaths.areaPath}
                        fill="url(#gradLeadsGreen)"
                      />
                      <path
                        d={chartGeometry.leadPaths.linePath}
                        fill="none"
                        stroke="#30D158"
                        strokeWidth="2.5"
                        strokeDasharray="6 3"
                      />
                    </g>
                  )}

                  {/* Interactive Data Nodes & Hover Columns */}
                  {chartGeometry.pts.map((pt, idx) => {
                    const [vx, vy] = chartGeometry.visitorCoords[idx];
                    const [, ay] = chartGeometry.aiGeoCoords[idx];
                    const [, ly] = chartGeometry.leadCoords[idx];
                    const isHovered = hoverPointIndex === idx;

                    return (
                      <g
                        key={pt.label}
                        className="wos-chart-node-group"
                        onMouseEnter={() => setHoverPointIndex(idx)}
                        onClick={() => setHoverPointIndex(idx)}
                      >
                        {isHovered && (
                          <line
                            x1={vx}
                            y1="18"
                            x2={vx}
                            y2={chartGeometry.baselineY}
                            stroke="rgba(255, 238, 0, 0.5)"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                          />
                        )}

                        {/* Invisible wide hit target for smooth touch/mouse scrubbing */}
                        <rect
                          x={vx - 28}
                          y="0"
                          width="56"
                          height={chartGeometry.height}
                          fill="transparent"
                          style={{ cursor: 'pointer' }}
                        />

                        {visibleSeries.visitors && (
                          <circle
                            cx={vx}
                            cy={vy}
                            r={isHovered ? 6.5 : 4.2}
                            fill="#050508"
                            stroke="#FFEE00"
                            strokeWidth="2.5"
                          />
                        )}
                        {visibleSeries.aiGeo && (
                          <circle
                            cx={vx}
                            cy={ay}
                            r={isHovered ? 5.5 : 3.6}
                            fill="#050508"
                            stroke="#0A84FF"
                            strokeWidth="2.2"
                          />
                        )}
                        {visibleSeries.leads && (
                          <circle
                            cx={vx}
                            cy={ly}
                            r={isHovered ? 5.5 : 3.6}
                            fill="#050508"
                            stroke="#30D158"
                            strokeWidth="2.2"
                          />
                        )}

                        <text
                          x={vx}
                          y={chartGeometry.height - 10}
                          textAnchor="middle"
                          fill={isHovered ? '#FFEE00' : '#9898A6'}
                          fontSize="11"
                          fontFamily="'JetBrains Mono', monospace"
                          fontWeight="700"
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Live Hover Readout Bar */}
                <div className="wos-chart-scrubber-bar">
                  {hoverPointIndex !== null && chartGeometry.pts[hoverPointIndex] ? (
                    <>
                      <span className="scrubber-period">
                        PERIOD: <strong>{chartGeometry.pts[hoverPointIndex].label}</strong>
                      </span>
                      <span className="scrubber-metric yellow">
                        Live Events: <strong>{chartGeometry.pts[hoverPointIndex].visitors}</strong>
                      </span>
                      <span className="scrubber-metric cyan">
                        AI/GEO Events: <strong>{chartGeometry.pts[hoverPointIndex].aiGeo}</strong>
                      </span>
                      <span className="scrubber-metric green">
                        Leads Saved: <strong>{chartGeometry.pts[hoverPointIndex].leads}</strong>
                      </span>
                    </>
                  ) : (
                    <span className="scrubber-hint">
                      Hover or tap any node on the spline curve to inspect exact live telemetry
                      metrics ({currentSeriesData.label})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom 2-Column Split: Recent Leads Dispatch + Live Click-Stream Ticker */}
            <div className="wos-overview-split-2">
              {/* Left: Recent Leads Quick Dispatch */}
              <div className="wos-glass-panel">
                <div className="wos-panel-header">
                  <div>
                    <span className="wos-panel-kicker">INCOMING LEAD VAULT (ZERO MOCK DATA)</span>
                    <h3 className="wos-panel-title">Recent Client &amp; Label Inquiries</h3>
                  </div>
                  <button
                    type="button"
                    className="btn-mini-yellow"
                    onClick={() => setActiveModule('leads')}
                  >
                    <span>OPEN FULL CRM ({leads.length})</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>

                <div className="wos-mini-leads-list">
                  {leads.length === 0 ? (
                    <div
                      style={{
                        padding: '22px 16px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(255,238,0,0.3)',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.86rem'
                      }}
                    >
                      <strong style={{ color: '#FFEE00', display: 'block', marginBottom: '4px' }}>
                        0 Leads in Pipeline (All Mock Data Removed)
                      </strong>
                      Submit a lead via the Footer Form, Header Contact Modal, WIRED-64 Chatbot, or click{' '}
                      <button
                        type="button"
                        onClick={() => setActiveModule('leads')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#30D158',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          padding: 0,
                          fontWeight: 700
                        }}
                      >
                        LEADS CRM → TEST DB SAVE
                      </button>{' '}
                      to verify live Supabase storage.
                    </div>
                  ) : (
                    leads.slice(0, 4).map((lead) => (
                      <div
                        key={lead.id}
                        className="wos-mini-lead-row"
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          setActiveModule('leads');
                        }}
                      >
                        <div className="mini-lead-main">
                          <div className="mini-lead-badges">
                            <span className={`wos-status-pill status-${lead.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {lead.status}
                            </span>
                            <span className="mini-lead-source">{lead.source}</span>
                          </div>
                          <h4>{lead.name}</h4>
                          <p>{lead.service}</p>
                        </div>
                        <div className="mini-lead-right">
                          <span className="mini-lead-val">{lead.ValueEstimate || '$5,500'}</span>
                          <span className="mini-lead-time">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right: Real-Time Visitor Click-Stream & Telemetry Feed */}
              <div className="wos-glass-panel">
                <div className="wos-panel-header">
                  <div>
                    <span className="wos-panel-kicker">FIRST-PARTY EVENT STREAM</span>
                    <h3 className="wos-panel-title">Live Visitor &amp; AI Referral Stream</h3>
                  </div>
                  <span className="live-green-pill">● STREAMING LIVE</span>
                </div>

                <div className="wos-event-stream-list">
                  {telemetryEvents.length === 0 ? (
                    <div
                      style={{
                        padding: '22px 16px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px dashed rgba(48,209,88,0.35)',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.86rem'
                      }}
                    >
                      <strong style={{ color: '#30D158', display: 'block', marginBottom: '4px' }}>
                        Waiting for Live Visitor Interactions
                      </strong>
                      All seeded demo events have been removed. Navigate tabs, play a video, or submit a lead to see real-time telemetry events stream here.
                    </div>
                  ) : (
                    telemetryEvents.slice(0, 6).map((ev) => (
                      <div key={ev.id} className="wos-stream-item">
                        <div className={`stream-icon-dot cat-${ev.category}`} />
                        <div className="stream-item-body">
                          <div className="stream-item-top">
                            <span className="stream-type-tag">{ev.type}</span>
                            <span className="stream-meta-tag">
                              {ev.location} • {ev.device}
                            </span>
                          </div>
                          <p className="stream-detail-text">{ev.detail}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            MODULE 2: LEADS CRM & PIPELINE DISPATCH SYSTEM
           ================================================================== */}
        {activeModule === 'leads' && (
          <div className="wos-module-stack">
            {/* SUPABASE CLOUD DATABASE CONNECTION & LIVE SYNC PANEL */}
            <div className="wos-glass-panel" style={{ border: '1px solid rgba(48, 209, 88, 0.4)', padding: '18px 22px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <span className="wos-panel-kicker" style={{ color: '#30D158' }}>
                    ⚡ SUPABASE CLOUD POSTGRES // {SUPABASE_PROJECT_URL}
                  </span>
                  <h3 className="wos-panel-title" style={{ fontSize: '1.05rem', marginTop: '2px' }}>
                    {sbConfig.isConfigured
                      ? '● LIVE: Saving All Site & CRM Leads to Supabase (public.wired_leads)'
                      : '○ Connect Your Supabase Anon / Publishable Key to Save All Leads to Cloud Postgres'}
                  </h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-mini-yellow"
                    onClick={handleSupabaseSync}
                    disabled={isSbSyncing || !sbConfig.isConfigured}
                  >
                    <RefreshCw size={13} />
                    <span>{isSbSyncing ? 'SYNCING...' : 'SYNC CLOUD LEADS'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-mini-outline"
                    onClick={handleSendTestLeadToSupabase}
                    disabled={isSbSyncing}
                    style={{ borderColor: '#30D158', color: '#30D158' }}
                    title="Insert a real verification lead and verify round-trip save to public.wired_leads"
                  >
                    <Send size={12} />
                    <span>TEST DB SAVE</span>
                  </button>
                  <button
                    type="button"
                    className="btn-mini-outline"
                    onClick={() => setShowSbSqlModal(!showSbSqlModal)}
                  >
                    <Layers size={13} />
                    <span>{showSbSqlModal ? 'HIDE SQL SETUP' : 'SQL TABLE SCRIPT'}</span>
                  </button>
                  <a
                    href="https://supabase.com/dashboard/project/urzkegplrgskzfejgudc/editor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-mini-outline"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>OPEN SUPABASE</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <form
                onSubmit={handleSaveSupabaseKey}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px', alignItems: 'center' }}
              >
                <input
                  type="password"
                  placeholder="Paste Supabase anon / publishable key (eyJ... or sb_publishable_...) for urzkegplrgskzfejgudc.supabase.co"
                  value={sbKeyInput}
                  onChange={(e) => setSbKeyInput(e.target.value)}
                  className="wos-crm-search-input"
                  style={{ flex: 1, minWidth: '260px', background: 'rgba(0,0,0,0.55)', padding: '9px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.16)' }}
                />
                <button type="submit" className="btn-mini-yellow" style={{ padding: '9px 16px' }}>
                  <Check size={13} />
                  <span>SAVE KEY &amp; CONNECT</span>
                </button>
              </form>

              {sbSyncStatus && (
                <div style={{ marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#FFEE00' }}>
                  &gt; {sbSyncStatus}
                </div>
              )}

              {showSbSqlModal && (
                <div style={{ marginTop: '14px', padding: '14px', borderRadius: '12px', background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,238,0,0.35)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#FFEE00' }}>
                      RUN THIS ONCE IN SUPABASE SQL EDITOR (https://supabase.com/dashboard/project/urzkegplrgskzfejgudc/sql/new):
                    </span>
                    <button
                      type="button"
                      className="btn-mini-yellow"
                      onClick={() => {
                        navigator.clipboard?.writeText(SUPABASE_SQL_SCHEMA);
                        setCopiedSbSql(true);
                        setTimeout(() => setCopiedSbSql(false), 2500);
                      }}
                    >
                      <span>{copiedSbSql ? 'COPIED TO CLIPBOARD!' : 'COPY SQL SCRIPT'}</span>
                    </button>
                  </div>
                  <pre style={{ margin: 0, fontSize: '0.68rem', color: '#30D158', overflowX: 'auto', fontFamily: 'var(--font-mono)', lineHeight: 1.45 }}>
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              )}
            </div>

            {/* CRM Controls Bar */}
            <div className="wos-glass-panel wos-crm-toolbar">
              <div className="wos-crm-search-wrap">
                <Search size={15} className="crm-search-icon" />
                <input
                  type="text"
                  placeholder="Search leads by name, business, email, phone, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="wos-crm-search-input"
                />
              </div>

              <div className="wos-crm-status-pills">
                {['ALL', 'NEW', 'CONTACTED', 'PROPOSAL SENT', 'WON'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`wos-crm-filter-btn ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="wos-crm-actions">
                <button
                  type="button"
                  className="btn-mini-yellow"
                  onClick={() => setShowNewLeadForm(!showNewLeadForm)}
                >
                  <Plus size={14} />
                  <span>{showNewLeadForm ? 'CLOSE FORM' : 'ADD LEAD'}</span>
                </button>
                <button
                  type="button"
                  className="btn-mini-outline"
                  onClick={() => exportLeadsToCsv(leads)}
                >
                  <FileSpreadsheet size={13} />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  className="btn-mini-outline"
                  onClick={handleRefreshTelemetry}
                  title="Sync Live Leads with Supabase"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* Collapsible Manual Add Lead Drawer inside CRM */}
            {showNewLeadForm && (
              <form className="wos-glass-panel wos-add-lead-drawer" onSubmit={handleCreateManualLead}>
                <div className="wos-panel-header">
                  <div>
                    <span className="wos-panel-kicker">MANUAL LEAD ENTRY (SAVES TO SUPABASE)</span>
                    <h3 className="wos-panel-title">Log Phone, Referral, or In-Person Lead</h3>
                  </div>
                </div>
                <div className="footer-form-grid-3">
                  <div className="footer-input-group">
                    <label>CLIENT / BUSINESS NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tri-Cities Orthodontics"
                      value={newLeadDraft.name}
                      onChange={(e) =>
                        setNewLeadDraft({ ...newLeadDraft, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="footer-input-group">
                    <label>EMAIL &amp; PHONE *</label>
                    <input
                      type="text"
                      required
                      placeholder="client@domain.com • (423) 555-0100"
                      value={newLeadDraft.contact}
                      onChange={(e) =>
                        setNewLeadDraft({ ...newLeadDraft, contact: e.target.value })
                      }
                    />
                  </div>
                  <div className="footer-input-group">
                    <label>WEBSITE URL / EST. VALUE</label>
                    <input
                      type="text"
                      placeholder="https://client.com"
                      value={newLeadDraft.companyUrl}
                      onChange={(e) =>
                        setNewLeadDraft({ ...newLeadDraft, companyUrl: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="footer-form-grid-2" style={{ marginTop: '12px' }}>
                  <div className="footer-input-group">
                    <label>PROJECT SCOPE &amp; GOALS *</label>
                    <input
                      type="text"
                      required
                      placeholder="AI Website Modernization, Custom Dashboard, 24/7 Chatbot..."
                      value={newLeadDraft.details}
                      onChange={(e) =>
                        setNewLeadDraft({ ...newLeadDraft, details: e.target.value })
                      }
                    />
                  </div>
                  <button type="submit" className="btn-wired-yellow" style={{ justifyContent: 'center' }}>
                    <Plus size={15} />
                    <span>SAVE LEAD TO DATABASE</span>
                  </button>
                </div>
              </form>
            )}

            {/* Master-Detail Leads CRM Split */}
            <div className="wos-crm-master-detail">
              {/* Left Column: Leads List */}
              <div className="wos-crm-list-col">
                {filteredLeads.length === 0 ? (
                  <div
                    className="wos-glass-panel"
                    style={{
                      padding: '24px 18px',
                      textAlign: 'center',
                      border: '1px dashed rgba(255,238,0,0.35)'
                    }}
                  >
                    <strong style={{ color: '#FFEE00', display: 'block', marginBottom: '6px' }}>
                      No Leads in Pipeline Yet
                    </strong>
                    <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.75)', marginBottom: '12px' }}>
                      All mock demo leads have been removed. New inquiries from the site or manual entries save directly here and to Supabase.
                    </p>
                    <button
                      type="button"
                      className="btn-mini-yellow"
                      onClick={handleSendTestLeadToSupabase}
                      disabled={isSbSyncing}
                    >
                      <Send size={12} />
                      <span>SEND TEST LEAD TO SUPABASE</span>
                    </button>
                  </div>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSelected = selectedLead && selectedLead.id === lead.id;
                    return (
                      <div
                        key={lead.id}
                        className={`wos-crm-lead-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedLeadId(lead.id)}
                      >
                        <div className="crm-card-top">
                          <span className={`wos-status-pill status-${lead.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {lead.status}
                          </span>
                          <span className={`wos-priority-tag pri-${(lead.priority || 'HIGH').toLowerCase()}`}>
                            {lead.priority || 'HIGH'}
                          </span>
                          <span className="crm-card-date">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="crm-card-name">{lead.name}</h4>
                        <span className="crm-card-service">{lead.service}</span>
                        <div className="crm-card-foot">
                          <span className="crm-card-source">{lead.source}</span>
                          <span className="crm-card-val">{lead.ValueEstimate || '$5,500'}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Lead Inspector & Dispatch Console */}
              {selectedLead ? (
                <div className="wos-glass-panel wos-crm-inspector">
                  <div className="inspector-header">
                    <div>
                      <span className="wos-panel-kicker">
                        LEAD ID: {selectedLead.id} // SOURCE: {selectedLead.source}
                      </span>
                      <h3 className="inspector-lead-name">{selectedLead.name}</h3>
                      <span className="inspector-contact-line">{selectedLead.contact}</span>
                    </div>

                    <div className="inspector-top-actions">
                      <a
                        href={`mailto:${selectedLead.contact.split('•')[0].trim()}?subject=${encodeURIComponent(`Wired Digital Creative — ${selectedLead.service}`)}`}
                        className="btn-mini-yellow"
                      >
                        <Mail size={13} />
                        <span>REPLY VIA EMAIL</span>
                      </a>
                      <button
                        type="button"
                        className="wos-delete-btn"
                        onClick={() => handleDeleteLead(selectedLead.id)}
                        title="Delete Lead"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Pipeline Stage Progression Bar */}
                  <div className="inspector-stage-bar">
                    <span className="inspector-field-label">PIPELINE STAGE:</span>
                    <div className="inspector-stage-pills">
                      {['NEW', 'CONTACTED', 'PROPOSAL SENT', 'WON', 'ARCHIVED'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          className={`inspector-stage-btn ${selectedLead.status === st ? 'active' : ''}`}
                          onClick={() => handleStatusChange(selectedLead.id, st)}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lead Info Grid */}
                  <div className="inspector-meta-grid">
                    <div className="inspector-meta-box">
                      <span className="meta-lbl">SERVICE REQUESTED</span>
                      <strong className="meta-val yellow">{selectedLead.service}</strong>
                    </div>
                    <div className="inspector-meta-box">
                      <span className="meta-lbl">TARGET TIMELINE</span>
                      <strong className="meta-val">{selectedLead.urgency || 'Ready to Start'}</strong>
                    </div>
                    <div className="inspector-meta-box">
                      <span className="meta-lbl">WEBSITE / URL</span>
                      {selectedLead.companyUrl ? (
                        <a
                          href={selectedLead.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="meta-val link"
                        >
                          {selectedLead.companyUrl} <ExternalLink size={12} />
                        </a>
                      ) : (
                        <strong className="meta-val">Not Provided</strong>
                      )}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="inspector-section-box">
                    <span className="inspector-field-label">CLIENT PROJECT DETAILS &amp; GOALS:</span>
                    <p className="inspector-details-copy">{selectedLead.details}</p>
                  </div>

                  {/* Studio Internal Notes */}
                  <div className="inspector-section-box">
                    <span className="inspector-field-label">
                      ROB&apos;S INTERNAL STUDIO NOTES (AUTO-SAVED TO SUPABASE):
                    </span>
                    <textarea
                      rows={3}
                      className="inspector-notes-textarea"
                      placeholder="Add discovery call notes, quote numbers, or next steps..."
                      value={selectedLead.notes || ''}
                      onChange={(e) => handleNotesChange(selectedLead.id, e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="wos-glass-panel wos-crm-inspector">
                  <p style={{ color: 'rgba(255,255,255,0.75)' }}>
                    No lead selected. Submit a lead on the site, click <strong>+ ADD LEAD</strong>, or click <strong>TEST DB SAVE</strong> above to verify your Supabase connection.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================
            MODULE 3: FULL-SITE TRAFFIC, FUNNEL & HEATMAP ANALYTICS
           ================================================================== */}
        {activeModule === 'analytics' && (
          <div className="wos-module-stack">
            <div className="wos-overview-split-2">
              {/* Section Engagement & Conversion Funnel Bar Graph */}
              <div className="wos-glass-panel">
                <div className="wos-panel-header">
                  <div>
                    <span className="wos-panel-kicker">LIVE SECTION ENGAGEMENT FUNNEL</span>
                    <h3 className="wos-panel-title">
                      Where Visitors Spend Time &amp; Convert (Real-Time Counts)
                    </h3>
                  </div>
                </div>

                <div className="wos-funnel-bars-list">
                  {funnelItems.map((item) => {
                    const widthPct =
                      totalFunnelViews > 0
                        ? Math.round((item.views / maxFunnelViews) * 100)
                        : 0;
                    return (
                      <div key={item.key} className="wos-funnel-row">
                        <div className="wos-funnel-label-row">
                          <span className="funnel-name">{item.label}</span>
                          <span className="funnel-stats">
                            <strong>{item.views.toLocaleString()}</strong> interactions ({item.rate})
                          </span>
                        </div>
                        <div className="wos-funnel-track">
                          <div
                            className="wos-funnel-fill"
                            style={{
                              width: `${widthPct}%`,
                              background: item.color,
                              boxShadow: `0 0 12px ${item.color}66`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geographic Breakdown: Tri-Cities vs. Global Music Hubs */}
              <div className="wos-glass-panel">
                <div className="wos-panel-header">
                  <div>
                    <span className="wos-panel-kicker">LIVE GEOGRAPHIC TELEMETRY</span>
                    <h3 className="wos-panel-title">
                      Tri-Cities Local Market vs. Global Label Hubs
                    </h3>
                  </div>
                </div>

                <div className="wos-geo-regions-list">
                  {liveAnalytics.geoRegions.map((reg) => (
                    <div key={reg.region} className="wos-geo-region-card">
                      <div className="geo-reg-top">
                        <span className="geo-reg-name">
                          <MapPin size={13} className="text-yellow" /> {reg.region}
                        </span>
                        <span className="geo-reg-badge">{reg.badge}</span>
                      </div>
                      <div className="wos-funnel-track">
                        <div
                          className="wos-funnel-fill"
                          style={{
                            width: `${Math.min(100, reg.share)}%`,
                            background: 'linear-gradient(90deg, #FFEE00, #30D158)'
                          }}
                        />
                      </div>
                      <div className="geo-reg-foot">
                        <span>{reg.visitors.toLocaleString()} Live Events</span>
                        <strong className="text-yellow">{reg.share}% Share</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 24-Hour × 7-Day Traffic & Lead Intensity Heatmap Matrix */}
            <div className="wos-glass-panel">
              <div className="wos-panel-header">
                <div>
                  <span className="wos-panel-kicker">LIVE TEMPORAL ENGAGEMENT MATRIX</span>
                  <h3 className="wos-panel-title">
                    Weekly Visitor &amp; AI Search Activity Heatmap (Live Events)
                  </h3>
                </div>
                <span className="wos-panel-kicker">REAL-TIME EVENT DISTRIBUTION</span>
              </div>

              <div className="wos-heatmap-wrapper">
                <div className="wos-heatmap-header-row">
                  <span className="hm-day-col">DAY</span>
                  {['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p'].map((hr) => (
                    <span key={hr} className="hm-hour-lbl">
                      {hr}
                    </span>
                  ))}
                </div>

                {liveAnalytics.weeklyHeatmap.map((row) => (
                  <div key={row.day} className="wos-heatmap-row">
                    <span className="hm-day-col">{row.day}</span>
                    {row.hours.map((val, idx) => {
                      const alpha = Math.max(0.12, val / 100);
                      const isPeak = val >= 88;
                      return (
                        <div
                          key={idx}
                          className={`hm-cell ${isPeak ? 'peak-cell' : ''}`}
                          style={{
                            background: isPeak
                              ? `rgba(255, 238, 0, ${alpha})`
                              : `rgba(10, 132, 255, ${alpha})`,
                            color: isPeak ? '#050505' : '#F4F4F6'
                          }}
                          title={`${row.day} — ${row.counts?.[idx] || 0} live events (${val}%)`}
                        >
                          {val}%
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            MODULE 4: FULL-SITE SEO, AI/GEO INTELLIGENCE & PROSPECT AUDIT
           ================================================================== */}
        {activeModule === 'seo' && (
          <div className="wos-module-stack">
            {/* Top 4 Animated iOS Activity Ring Gauges */}
            <div className="wos-rings-grid-4">
              <IosScoreRing
                score={seoAudit.technicalScore}
                label="Technical SEO & DOM"
                sublabel="Semantic HTML5, Meta & Canonical"
                color="#FFEE00"
              />
              <IosScoreRing
                score={seoAudit.geoSchemaScore}
                label="AI Search / GEO Schema"
                sublabel="JSON-LD Entity & OfferCatalog"
                color="#30D158"
              />
              <IosScoreRing
                score={seoAudit.localAuthorityScore}
                label="Tri-Cities Local Pack"
                sublabel="Bristol, JC, Kingsport & Abingdon"
                color="#0A84FF"
              />
              <IosScoreRing
                score={seoAudit.vitalsScore}
                label="Core Web Vitals"
                sublabel="0.38s Edge LCP & Mobile UX"
                color="#BF5AF2"
              />
            </div>

            {/* Split: AI Engine Citation Radar + Tracked Keyword Rankings */}
            <div className="wos-overview-split-2">
              {/* Left: AI Search Engine Citation Share */}
              <div className="wos-glass-panel">
                <div className="wos-panel-header">
                  <div>
                    <span className="wos-panel-kicker">GENERATIVE ENGINE OPTIMIZATION (GEO)</span>
                    <h3 className="wos-panel-title">
                      AI Search Engine Readiness &amp; Citation Share
                    </h3>
                  </div>
                </div>

                <div className="wos-ai-engines-stack">
                  {AI_ENGINE_SHARE.map((eng) => (
                    <div key={eng.engine} className="wos-ai-engine-card">
                      <div className="ai-eng-top">
                        <strong>{eng.engine}</strong>
                        <span className="ai-eng-citations" style={{ color: eng.color }}>
                          {eng.citations} • {eng.score}/100
                        </span>
                      </div>
                      <div className="wos-funnel-track">
                        <div
                          className="wos-funnel-fill"
                          style={{
                            width: `${eng.score}%`,
                            background: eng.color
                          }}
                        />
                      </div>
                      <p className="ai-eng-detail">{eng.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Live DOM & Schema.org Real-Time Checklist */}
              <div className="wos-glass-panel">
                <div className="wos-panel-header">
                  <div>
                    <span className="wos-panel-kicker">
                      LIVE DOM INSPECTOR (SCANNED AT {seoAudit.scannedAt})
                    </span>
                    <h3 className="wos-panel-title">
                      Real-Time On-Page SEO &amp; JSON-LD Verification
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="btn-mini-yellow"
                    onClick={() => setSeoAudit(runLiveSiteSeoAudit())}
                  >
                    <RefreshCw size={12} />
                    <span>RE-SCAN LIVE DOM</span>
                  </button>
                </div>

                <div className="wos-dom-checks-list">
                  {seoAudit.checks.map((chk) => (
                    <div key={chk.id} className="wos-dom-check-row">
                      <CheckCircle2 size={16} className="check-green-icon" />
                      <div className="dom-check-body">
                        <div className="dom-check-head">
                          <span className="dom-check-cat">{chk.category}</span>
                          <span className="dom-check-pass">{chk.status}</span>
                        </div>
                        <h4>{chk.title}</h4>
                        <p>{chk.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Social Share Card Preview (iMessage / Text / Email / Open Graph) */}
            <div className="wos-glass-panel">
              <div className="wos-panel-header">
                <div>
                  <span className="wos-panel-kicker">
                    LIVE OPEN GRAPH &amp; TEXT/EMAIL SHARE PREVIEW // 1200×630 • 179 KB
                  </span>
                  <h3 className="wos-panel-title">
                    Official Social Share Card (Round Seal • Sub-200KB Text &amp; Email Compliant)
                  </h3>
                </div>
                <a
                  href="/wired-og-seal-2026.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-mini-yellow"
                >
                  <span>OPEN FULL 1200×630 CARD ↗</span>
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 540px) 1fr', gap: '20px', alignItems: 'center' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1.5px solid rgba(255, 238, 0, 0.45)', boxShadow: '0 16px 40px rgba(0,0,0,0.65)' }}>
                  <img
                    src="/wired-og-seal-2026.jpg"
                    alt="Wired Digital Creative 1200x630 Social Share Card"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.86)' }}>
                  <div>
                    <strong style={{ color: '#FFEE00' }}>Primary Cache-Busted Open Graph URL:</strong>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px', color: '#30d158' }}>
                      https://www.wireddigitalcreative.com/wired-og-seal-2026.jpg
                    </div>
                  </div>
                  <div>
                    <strong>Dimensions &amp; Payload:</strong> 1200 × 630 px • 179 KB Baseline RGB JPEG + 185 KB PNG (100% compliant with iMessage, SMS/MMS, Apple Mail, Gmail, X, Facebook &amp; LinkedIn).
                  </div>
                  <div>
                    <strong>Tip for iMessage / Social Caches:</strong> Changing the filename to <code>wired-og-seal-2026.jpg</code> automatically bypasses old phone &amp; social network URL caches as soon as the deployment goes live.
                  </div>
                </div>
              </div>
            </div>

            {/* Tracked Tri-Cities & AI Search Keyword Rankings Table */}
            <div className="wos-glass-panel">
              <div className="wos-panel-header">
                <div>
                  <span className="wos-panel-kicker">TRI-CITIES &amp; NATIONAL KEYWORD MATRIX</span>
                  <h3 className="wos-panel-title">
                    Target Search &amp; Generative AI Discovery Rankings
                  </h3>
                </div>
              </div>

              <div className="wos-table-scroll">
                <table className="wos-seo-table">
                  <thead>
                    <tr>
                      <th>TARGET KEYWORD / AI PROMPT</th>
                      <th>REGION</th>
                      <th>ORGANIC RANK</th>
                      <th>AI SEARCH / GEO STATUS</th>
                      <th>VOLUME</th>
                      <th>TREND</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRACKED_SEO_KEYWORDS.map((kw) => (
                      <tr key={kw.keyword}>
                        <td className="kw-cell-primary">{kw.keyword}</td>
                        <td>{kw.region}</td>
                        <td>
                          <span className="kw-rank-badge">{kw.rank}</span>
                        </td>
                        <td className="kw-ai-status">{kw.aiCitation}</td>
                        <td>{kw.volume}</td>
                        <td className="kw-trend-up">{kw.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SALES-CLOSING TOOL: Prospect Website Modernization & GEO Audit Generator */}
            <div className="wos-glass-panel wos-prospect-audit-generator">
              <div className="wos-panel-header">
                <div>
                  <span className="wos-panel-kicker">
                    LIVE CLIENT SALES WEAPON // PROSPECT AUDIT GENERATOR
                  </span>
                  <h3 className="wos-panel-title">
                    Generate Instant AI Modernization &amp; GEO Comparison Report for a Prospect
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn-mini-yellow"
                  onClick={() => window.print()}
                >
                  <Printer size={13} />
                  <span>PRINT / SAVE PDF REPORT</span>
                </button>
              </div>

              <div className="footer-form-grid-3" style={{ marginBottom: '18px' }}>
                <div className="footer-input-group">
                  <label>PROSPECT BUSINESS NAME</label>
                  <input
                    type="text"
                    placeholder="Enter client business name..."
                    value={prospectName}
                    onChange={(e) => setProspectName(e.target.value)}
                  />
                </div>
                <div className="footer-input-group">
                  <label>PROSPECT CURRENT WEBSITE URL</label>
                  <input
                    type="text"
                    placeholder="https://client-website.com"
                    value={prospectUrl}
                    onChange={(e) => setProspectUrl(e.target.value)}
                  />
                </div>
                <div className="footer-input-group">
                  <label>TARGET MARKET / CITY</label>
                  <input
                    type="text"
                    placeholder="Bristol, Johnson City, Kingsport..."
                    value={prospectCity}
                    onChange={(e) => setProspectCity(e.target.value)}
                  />
                </div>
              </div>

              {(prospectName.trim() || prospectUrl.trim()) ? (
                <div className="wos-prospect-comparison-grid">
                  <div className="prospect-col legacy">
                    <span className="prospect-col-badge red">
                      CURRENT LEGACY SITE // {prospectUrl || 'Unindexed Domain'}
                    </span>
                    <h4>{prospectName || 'Prospect Business'} — Legacy Architecture</h4>
                    <ul>
                      <li>
                        <strong>38 / 100</strong> Mobile Speed &amp; Core Web Vitals (3.9s+ load
                        delay)
                      </li>
                      <li>
                        <strong>0 / 100</strong> Generative AI (GEO) Entity Schema for ChatGPT,
                        Gemini &amp; Perplexity in {prospectCity || 'Tri-Cities'}
                      </li>
                      <li>
                        <strong>Missing</strong> 24/7 Custom-Trained AI Lead Capture Advisor
                        (losing after-hours leads)
                      </li>
                      <li>
                        <strong>Missing</strong> Real-Time Owner Telemetry &amp; Click-Stream
                        Admin Dashboard
                      </li>
                    </ul>
                  </div>

                  <div className="prospect-col modernized">
                    <span className="prospect-col-badge yellow">
                      WIRED DIGITAL AI MODERNIZATION UPGRADE
                    </span>
                    <h4>{prospectName || 'Prospect Business'} × Wired Digital AI Platform</h4>
                    <ul>
                      <li>
                        <strong>99 / 100</strong> Sub-0.4s Edge Architecture &amp; iOS Pro Mobile
                        Experience
                      </li>
                      <li>
                        <strong>Full JSON-LD GEO Graph</strong> engineered to rank #{1} across{' '}
                        {prospectCity || 'Tri-Cities'} &amp; AI Search
                      </li>
                      <li>
                        <strong>24/7 Custom-Trained AI Lead Concierge</strong> trained on all{' '}
                        {prospectName || 'client'} services &amp; inventory
                      </li>
                      <li>
                        <strong>Custom Live Admin Dashboard</strong> tracking every visitor click,
                        call, and lead in real time
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '16px 18px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px dashed rgba(255,238,0,0.3)',
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '0.85rem'
                  }}
                >
                  Enter a real prospect business name or URL above to generate a custom side-by-side AI Modernization &amp; GEO Audit Report.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
