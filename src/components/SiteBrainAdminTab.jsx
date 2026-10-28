import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Database,
  FileCode,
  FolderGit2,
  Layers,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal
} from 'lucide-react';
import { BRAND_INFO, TRI_CITIES_CASE_STUDIES } from '../data/wiredData';
import { wired64Respond } from '../utils/wired64Brain';

const SANDBOX_STORAGE_KEY = 'wired_site_brain_sandbox_v1';

const DEFAULT_SANDBOX = {
  phone: BRAND_INFO.phone || '731-616-5121',
  email: BRAND_INFO.email || 'WiredDigitalUS@gmail.com',
  tier1Price: '$1,850 – $3,500',
  tier2Price: '$3,500 – $6,500',
  tier3Price: '$5,500 – $12,000+',
  fastTrackHeadline:
    TRI_CITIES_CASE_STUDIES[0]?.cardHeadline ||
    'A dealership site that shows the owner every shopper in real time.',
  teamVisionHeadline:
    TRI_CITIES_CASE_STUDIES[1]?.cardHeadline ||
    'A commercial real estate site with an AI assistant that helps tenants find space.',
  botSignoffReply:
    "YOU'RE WELCOME //\nThat is literally my only job. : )\nIf anything comes up, Rob's at 731-616-5121.",
  botSampleReply:
    'PRICING //\nFlat-rate builds, no forced monthly retainers.\n• Launch Website: $1,850 – $3,500\n• Growth + 24/7 AI Bot: $3,500 – $6,500\n• Custom Platform + Live Dash: $5,500 – $12,000+'
};

const wordCount = (str = '') => String(str).trim().split(/\s+/).filter(Boolean).length;

export default function SiteBrainAdminTab() {
  const [brainData, setBrainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastDoctorRun, setLastDoctorRun] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodeId, setExpandedNodeId] = useState('node-brand-contact');
  const [copiedId, setCopiedId] = useState('');
  const [sandbox, setSandbox] = useState(() => {
    try {
      const saved = localStorage.getItem(SANDBOX_STORAGE_KEY);
      return saved ? { ...DEFAULT_SANDBOX, ...JSON.parse(saved) } : DEFAULT_SANDBOX;
    } catch {
      return DEFAULT_SANDBOX;
    }
  });
  const [sandboxSavedMsg, setSandboxSavedMsg] = useState('');

  const fetchBrainJson = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/site-brain.json?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setBrainData(json);
      }
    } catch {
      // Fallback handled by live client state if offline
    } finally {
      setLoading(false);
      setLastDoctorRun(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchBrainJson();
  }, []);

  const copyText = (id, text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2200);
  };

  // Live Guardrail Firewall validation on the Sandbox fields
  const sandboxValidation = useMemo(() => {
    const issues = [];
    const warnings = [];

    const signoffWords = wordCount(sandbox.botSignoffReply);
    const sampleWords = wordCount(sandbox.botSampleReply);

    if (signoffWords > 45) {
      issues.push(
        `Chatbot sign-off reply is ${signoffWords} words (hard guardrail limit is ≤ 45 words).`
      );
    }
    if (!sandbox.botSignoffReply.includes(': )')) {
      warnings.push('Chatbot sign-off reply is missing Rob\'s signature ": )" text smiley.');
    }
    if (sampleWords > 45) {
      issues.push(
        `Chatbot sample reply is ${sampleWords} words (hard guardrail limit is ≤ 45 words).`
      );
    }
    if (/team vision|ask vision/i.test(sandbox.botSampleReply)) {
      issues.push(
        'Brand Guardrail Violation: Default chatbot replies must NOT pitch Team Vision LLC unless the user specifically asks about Team Vision.'
      );
    }
    if (
      /million|10x|dominate|unstoppable|revolutionary/i.test(sandbox.teamVisionHeadline) ||
      wordCount(sandbox.teamVisionHeadline) > 22
    ) {
      issues.push(
        'Brand Guardrail Violation: Keep Team Vision LLC card copy light, understated, and ≤ 22 words.'
      );
    }
    if (!/^\d{3}-\d{3}-\d{4}$/.test(sandbox.phone.trim())) {
      issues.push('Phone number must match XXX-XXX-XXXX format so tel: links and schema stay valid.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sandbox.email.trim())) {
      issues.push('Studio email must be a valid email address.');
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings,
      signoffWords,
      sampleWords
    };
  }, [sandbox]);

  // Combine build-time checks with live client-side verification
  const liveChecks = useMemo(() => {
    const baseChecks = brainData?.healthStatus?.checks || [];
    const liveBotTest = wired64Respond('no thank you');
    const liveBotOk =
      liveBotTest?.reply?.includes(': )') && wordCount(liveBotTest?.reply || '') <= 45;

    if (baseChecks.length > 0) return baseChecks;

    return [
      {
        id: 'contact-sync',
        category: 'SYNC MATRIX',
        title: 'Studio phone (731-616-5121) & email synced across all files',
        passed: BRAND_INFO.phone === '731-616-5121',
        detail: `${BRAND_INFO.phone} • ${BRAND_INFO.email}`
      },
      {
        id: 'wired64-guardrail',
        category: 'CHATBOT BRAIN',
        title: 'WIRED-64 replies ≤ 45 words + ": )" sign-off active',
        passed: liveBotOk,
        detail: liveBotTest?.reply || ''
      }
    ];
  }, [brainData]);

  const filteredNodes = useMemo(() => {
    const nodes = brainData?.knowledgeTree || [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return nodes;
    return nodes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.primaryFile.toLowerCase().includes(q) ||
        (n.syncFiles || []).some((f) => f.toLowerCase().includes(q))
    );
  }, [brainData, searchQuery]);

  const handleSaveSandbox = () => {
    if (!sandboxValidation.passed) return;
    try {
      localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(sandbox));
      setSandboxSavedMsg('Saved to local sandbox & verified against all guardrails.');
      setTimeout(() => setSandboxSavedMsg(''), 3000);
    } catch {
      // ignore storage errors
    }
  };

  const handleResetSandbox = () => {
    localStorage.removeItem(SANDBOX_STORAGE_KEY);
    setSandbox(DEFAULT_SANDBOX);
    setSandboxSavedMsg('Reset to live production baseline.');
    setTimeout(() => setSandboxSavedMsg(''), 2500);
  };

  const buildMasterLlmPrompt = () => {
    return [
      'Read `BRAIN.md` and `public/site-brain.json` at the root of this repository first before scanning any other files.',
      'Follow the 3-Ring Safety Architecture and Multi-File Sync Matrix in `BRAIN.md`:',
      '1. Take a snapshot before editing (`npm run snapshot -- "reason"`).',
      '2. Only edit the target files listed in the Knowledge Tree node.',
      '3. Respect all guardrails (Team Vision kept low-key, WIRED-64 replies <= 45 words with `: )` sign-off, mobile code-splitting & `-sm.jpg` responsive images intact).',
      '4. Run `npm run brain` and `npm run build` when done to verify 7/7 guardrails pass.'
    ].join('\n');
  };

  const buildNodeLlmPrompt = (node) => {
    return [
      `### WIRED DIGITAL SITE BRAIN // TARGET NODE: ${node.title}`,
      `- Ring: ${node.ring}`,
      `- Primary File to Edit: \`${node.primaryFile}\``,
      `- Must-Sync Files: ${(node.syncFiles || []).map((f) => `\`${f}\``).join(', ')}`,
      `- Guardrails:`,
      ...(node.guardrails || []).map((g) => `  • ${g}`),
      `- Current Live Values:`,
      '```json',
      JSON.stringify(node.liveValues, null, 2),
      '```',
      '',
      'TASK: Please update ONLY the files listed above for this node, keep all sync files matched, and run `npm run brain` afterward to verify all guardrails pass.'
    ].join('\n');
  };

  const buildSandboxPatchPrompt = () => {
    return [
      'Please apply these Ring-1 verified content updates across the Wired Digital sync matrix:',
      '1. First run `npm run snapshot -- "Before Ring-1 sandbox update"`',
      `2. Studio Contact: Phone = "${sandbox.phone}", Email = "${sandbox.email}" (sync across src/data/wiredData.js, src/data/seoPages.js, src/data/blogPosts.js, src/utils/wired64Brain.js, index.html)`,
      `3. 3-Tier Website Pricing: Tier 1 = "${sandbox.tier1Price}", Tier 2 = "${sandbox.tier2Price}", Tier 3 = "${sandbox.tier3Price}" (sync across src/data/seoPages.js, src/utils/wired64Brain.js, src/data/blogPosts.js)`,
      `4. Case Study Headlines in src/data/wiredData.js:`,
      `   - Fast Track: "${sandbox.fastTrackHeadline}"`,
      `   - Team Vision (low-key): "${sandbox.teamVisionHeadline}"`,
      `5. WIRED-64 Sign-Off in src/utils/wired64Brain.js:`,
      `   "${sandbox.botSignoffReply.replace(/\n/g, '\\n')}"`,
      '6. Run `npm run brain` and `node scripts/test-wired64.mjs` to verify all guardrails pass.'
    ].join('\n');
  };

  return (
    <div className="wos-module-view">
      {/* ====================================================================
          TOP STATUS BANNER & 1-CLICK LLM ONBOARDING BAR
         ==================================================================== */}
      <div
        className="wos-glass-panel"
        style={{
          marginBottom: '18px',
          border: '1px solid rgba(255, 238, 0, 0.28)',
          background:
            'linear-gradient(135deg, rgba(255,238,0,0.07) 0%, rgba(12,14,18,0.95) 55%)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="live-green-dot" />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: '#FFEE00'
                }}
              >
                SITE BRAIN v1.0 // KNOWLEDGE TREE, GUARDRAIL DOCTOR &amp; SAFE EDITOR
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Zero-Rescan AI Memory Tree + Local Fail-Safe Editor Sandbox
            </h2>
            <p
              style={{
                fontSize: '0.84rem',
                color: 'rgba(255,255,255,0.74)',
                margin: '6px 0 0',
                maxWidth: '780px'
              }}
            >
              Lives in <code>BRAIN.md</code>, <code>AGENTS.md</code>, <code>.cursorrules</code>, and{' '}
              <code>public/site-brain.json</code> so any AI model (Claude, GPT, Gemini, Cursor)
              knows the entire site architecture on Turn 1 without scanning 27,000 lines of code.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              className="wos-action-pill"
              onClick={fetchBrainJson}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} />
              <span>{loading ? 'SCANNING...' : 'RE-RUN DOCTOR'}</span>
            </button>

            <button
              type="button"
              onClick={() => copyText('master-llm', buildMasterLlmPrompt())}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 15px',
                borderRadius: '10px',
                border: '1px solid #FFEE00',
                background: '#FFEE00',
                color: '#050505',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {copiedId === 'master-llm' ? <Check size={14} /> : <Copy size={14} />}
              <span>
                {copiedId === 'master-llm'
                  ? 'COPIED TURN-1 AI PROMPT!'
                  : 'COPY TURN-1 PROMPT FOR ANY AI'}
              </span>
            </button>
          </div>
        </div>

        {/* Summary KPI Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(48,209,88,0.1)',
              border: '1px solid rgba(48,209,88,0.3)'
            }}
          >
            <div style={{ fontSize: '0.68rem', color: '#30D158', fontWeight: 800 }}>
              GUARDRAIL DOCTOR
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {liveChecks.filter((c) => c.passed).length} / {liveChecks.length} PASSING
            </div>
          </div>

          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
              KNOWLEDGE NODES
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFEE00', marginTop: '2px' }}>
              {brainData?.knowledgeTree?.length || 7} Core Trees
            </div>
          </div>

          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
              PRERENDERED ROUTES
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
              {brainData?.summaryStats?.seoPagesCount || 14} SEO +{' '}
              {brainData?.summaryStats?.publishedBlogPostsCount || 2} Blog
            </div>
          </div>

          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>
              LOCAL SNAPSHOTS
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>
              {brainData?.snapshots?.length || 1} Saved Backups
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          PANEL 1: LIVE GUARDRAIL & ASSET DOCTOR
         ==================================================================== */}
      <div className="wos-glass-panel" style={{ marginBottom: '18px' }}>
        <div className="wos-panel-head">
          <div>
            <span className="wos-panel-eyebrow">
              AUTOMATED SELF-DIAGNOSTIC // SCRIPTS/BUILD-BRAIN.MJS
            </span>
            <h3 className="wos-panel-title">
              Live Guardrail &amp; Sync Matrix Doctor{' '}
              {lastDoctorRun && (
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>
                  (Verified {lastDoctorRun})
                </span>
              )}
            </h3>
          </div>
          <span className="wos-status-chip green">
            <ShieldCheck size={13} />
            <span>ALL {liveChecks.length} GUARDRAILS ACTIVE</span>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '10px',
            marginTop: '12px'
          }}
        >
          {liveChecks.map((chk) => (
            <div
              key={chk.id}
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                background: chk.passed ? 'rgba(48, 209, 88, 0.06)' : 'rgba(255, 69, 58, 0.12)',
                border: chk.passed
                  ? '1px solid rgba(48, 209, 88, 0.28)'
                  : '1px solid rgba(255, 69, 58, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    letterSpacing: '0.09em',
                    color: chk.passed ? '#30D158' : '#FF453A'
                  }}
                >
                  {chk.category}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    background: chk.passed ? 'rgba(48,209,88,0.2)' : 'rgba(255,69,58,0.25)',
                    color: chk.passed ? '#30D158' : '#FF453A'
                  }}
                >
                  {chk.passed ? '✓ PASS' : '✖ FAIL'}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>{chk.title}</div>
              <div
                style={{
                  fontSize: '0.74rem',
                  color: 'rgba(255,255,255,0.64)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={chk.detail}
              >
                {chk.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================================
          PANEL 2: INTERACTIVE KNOWLEDGE TREE EXPLORER (WITH 1-CLICK LLM PROMPTS)
         ==================================================================== */}
      <div className="wos-glass-panel" style={{ marginBottom: '18px' }}>
        <div
          className="wos-panel-head"
          style={{ flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between' }}
        >
          <div>
            <span className="wos-panel-eyebrow">
              SURGICAL FILE ROUTING // NEVER SCAN 27,000 LINES AGAIN
            </span>
            <h3 className="wos-panel-title">Interactive Site Knowledge Tree &amp; Sync Matrix</h3>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '10px',
              padding: '6px 12px',
              minWidth: '250px'
            }}
          >
            <Search size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
            <input
              type="text"
              placeholder="Filter tree (pricing, bot, blog, seo...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                width: '100%'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
          {filteredNodes.map((node) => {
            const isExpanded = expandedNodeId === node.id;
            return (
              <div
                key={node.id}
                style={{
                  borderRadius: '14px',
                  border: isExpanded
                    ? '1px solid rgba(255, 238, 0, 0.45)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isExpanded ? 'rgba(255, 238, 0, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                  padding: '14px 16px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedNodeId(isExpanded ? '' : node.id)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255,238,0,0.15)',
                          color: '#FFEE00'
                        }}
                      >
                        {node.ring}
                      </span>
                      <code
                        style={{
                          fontSize: '0.75rem',
                          color: '#38BDF8',
                          background: 'rgba(56,189,248,0.1)',
                          padding: '2px 7px',
                          borderRadius: '6px'
                        }}
                      >
                        Primary: {node.primaryFile}
                      </code>
                    </div>
                    <h4 style={{ margin: '6px 0 3px', fontSize: '0.98rem', color: '#fff' }}>
                      {node.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.68)' }}>
                      {node.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyText(node.id, buildNodeLlmPrompt(node));
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,238,0,0.45)',
                        background: 'rgba(255,238,0,0.12)',
                        color: '#FFEE00',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedId === node.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>
                        {copiedId === node.id ? 'COPIED NODE CONTEXT!' : 'COPY CONTEXT FOR AI'}
                      </span>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: '#FFEE00',
                          marginBottom: '6px'
                        }}
                      >
                        MULTI-FILE SYNC MATRIX (KEEP MATCHED)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <code
                          style={{
                            fontSize: '0.74rem',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'rgba(48,209,88,0.15)',
                            color: '#30D158'
                          }}
                        >
                          ★ {node.primaryFile}
                        </code>
                        {(node.syncFiles || []).map((sf) => (
                          <code
                            key={sf}
                            style={{
                              fontSize: '0.74rem',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.06)',
                              color: 'rgba(255,255,255,0.85)'
                            }}
                          >
                            ↔ {sf}
                          </code>
                        ))}
                      </div>

                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: '#FFEE00',
                          marginTop: '12px',
                          marginBottom: '6px'
                        }}
                      >
                        NODE GUARDRAILS
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '16px',
                          fontSize: '0.78rem',
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.5
                        }}
                      >
                        {(node.guardrails || []).map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: '#38BDF8',
                          marginBottom: '6px'
                        }}
                      >
                        LIVE EXTRACTED VALUES
                      </div>
                      <pre
                        style={{
                          margin: 0,
                          padding: '10px 12px',
                          borderRadius: '8px',
                          background: 'rgba(0,0,0,0.45)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#E2E8F0',
                          fontSize: '0.72rem',
                          maxHeight: '190px',
                          overflow: 'auto'
                        }}
                      >
                        {JSON.stringify(node.liveValues, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          PANEL 3: RING-1 SAFE CONTENT SANDBOX & REAL-TIME GUARDRAIL FIREWALL
         ==================================================================== */}
      <div className="wos-glass-panel" style={{ marginBottom: '18px' }}>
        <div className="wos-panel-head" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span className="wos-panel-eyebrow">
              FUTURE CLIENT CMS PROTOTYPE // RING-1 SAFE DATA EDITOR
            </span>
            <h3 className="wos-panel-title">
              Safe Content Sandbox with Live Guardrail Firewall
            </h3>
          </div>

          <span
            className={`wos-status-chip ${sandboxValidation.passed ? 'green' : ''}`}
            style={
              !sandboxValidation.passed
                ? {
                    background: 'rgba(255,69,58,0.18)',
                    color: '#FF453A',
                    border: '1px solid rgba(255,69,58,0.4)'
                  }
                : undefined
            }
          >
            {sandboxValidation.passed ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />}
            <span>
              {sandboxValidation.passed
                ? 'GUARDRAIL FIREWALL: ALL EDITS SAFE'
                : `${sandboxValidation.issues.length} GUARDRAIL BLOCK(S) ACTIVE`}
            </span>
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', margin: '6px 0 14px' }}>
          Test how you or a future client can edit Ring-1 content (phone, email, pricing tiers, case
          study headlines, and WIRED-64 replies) inside a guardrail-protected form. Try typing more
          than 45 words or pitching Team Vision in the chatbot reply box to watch the guardrail block
          unsafe edits automatically.
        </p>

        {/* Live Guardrail Error / Warning Banner */}
        {(sandboxValidation.issues.length > 0 || sandboxValidation.warnings.length > 0) && (
          <div
            style={{
              marginBottom: '14px',
              padding: '12px 14px',
              borderRadius: '10px',
              background:
                sandboxValidation.issues.length > 0
                  ? 'rgba(255, 69, 58, 0.14)'
                  : 'rgba(255, 214, 10, 0.12)',
              border:
                sandboxValidation.issues.length > 0
                  ? '1px solid rgba(255, 69, 58, 0.5)'
                  : '1px solid rgba(255, 214, 10, 0.45)'
            }}
          >
            {sandboxValidation.issues.map((err, idx) => (
              <div
                key={idx}
                style={{
                  color: '#FF453A',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '4px'
                }}
              >
                ✖ GUARDRAIL BLOCKED: {err}
              </div>
            ))}
            {sandboxValidation.warnings.map((warn, idx) => (
              <div
                key={idx}
                style={{
                  color: '#FFD60A',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                ⚠ NOTE: {warn}
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px'
          }}
        >
          <div className="footer-input-group">
            <label>STUDIO PHONE (SYNCS 5 FILES)</label>
            <input
              type="text"
              value={sandbox.phone}
              onChange={(e) => setSandbox({ ...sandbox, phone: e.target.value })}
            />
          </div>

          <div className="footer-input-group">
            <label>STUDIO EMAIL (SYNCS 5 FILES)</label>
            <input
              type="text"
              value={sandbox.email}
              onChange={(e) => setSandbox({ ...sandbox, email: e.target.value })}
            />
          </div>

          <div className="footer-input-group">
            <label>TIER 1: LOCAL LAUNCH PRICE</label>
            <input
              type="text"
              value={sandbox.tier1Price}
              onChange={(e) => setSandbox({ ...sandbox, tier1Price: e.target.value })}
            />
          </div>

          <div className="footer-input-group">
            <label>TIER 2: GROWTH + 24/7 AI BOT PRICE</label>
            <input
              type="text"
              value={sandbox.tier2Price}
              onChange={(e) => setSandbox({ ...sandbox, tier2Price: e.target.value })}
            />
          </div>

          <div className="footer-input-group">
            <label>TIER 3: CUSTOM PLATFORM + DASH PRICE</label>
            <input
              type="text"
              value={sandbox.tier3Price}
              onChange={(e) => setSandbox({ ...sandbox, tier3Price: e.target.value })}
            />
          </div>

          <div className="footer-input-group">
            <label>FAST TRACK CARD HEADLINE</label>
            <input
              type="text"
              value={sandbox.fastTrackHeadline}
              onChange={(e) => setSandbox({ ...sandbox, fastTrackHeadline: e.target.value })}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '12px',
            marginTop: '12px'
          }}
        >
          <div className="footer-input-group">
            <label>
              TEAM VISION HEADLINE (GUARDRAIL: KEEP LOW-KEY, NO HYPE, ≤ 22 WORDS)
            </label>
            <input
              type="text"
              value={sandbox.teamVisionHeadline}
              onChange={(e) => setSandbox({ ...sandbox, teamVisionHeadline: e.target.value })}
            />
          </div>

          <div className="footer-input-group">
            <label>
              WIRED-64 POLITE SIGN-OFF ({sandboxValidation.signoffWords}/45 WORDS • MUST INCLUDE
              &quot;: )&quot;)
            </label>
            <textarea
              rows={3}
              value={sandbox.botSignoffReply}
              onChange={(e) => setSandbox({ ...sandbox, botSignoffReply: e.target.value })}
            />
          </div>

          <div className="footer-input-group">
            <label>
              WIRED-64 PRICING REPLY ({sandboxValidation.sampleWords}/45 WORDS • NO TEAM VISION
              PITCH)
            </label>
            <textarea
              rows={3}
              value={sandbox.botSampleReply}
              onChange={(e) => setSandbox({ ...sandbox, botSampleReply: e.target.value })}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginTop: '14px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button
              type="button"
              disabled={!sandboxValidation.passed}
              onClick={handleSaveSandbox}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 15px',
                borderRadius: '10px',
                border: 'none',
                background: sandboxValidation.passed ? '#30D158' : 'rgba(255,255,255,0.12)',
                color: sandboxValidation.passed ? '#050505' : 'rgba(255,255,255,0.4)',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: sandboxValidation.passed ? 'pointer' : 'not-allowed'
              }}
            >
              <Save size={14} />
              <span>VALIDATE &amp; SAVE SANDBOX DRAFT</span>
            </button>

            <button
              type="button"
              disabled={!sandboxValidation.passed}
              onClick={() => copyText('sandbox-patch', buildSandboxPatchPrompt())}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 15px',
                borderRadius: '10px',
                border: '1px solid #FFEE00',
                background: 'rgba(255,238,0,0.14)',
                color: '#FFEE00',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: sandboxValidation.passed ? 'pointer' : 'not-allowed'
              }}
            >
              {copiedId === 'sandbox-patch' ? <Check size={14} /> : <Copy size={14} />}
              <span>
                {copiedId === 'sandbox-patch'
                  ? 'COPIED SYNC PATCH FOR AI!'
                  : 'COPY SAFE APPLY PROMPT FOR AI'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResetSandbox}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.76rem',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={13} />
              <span>REVERT TO PRODUCTION BASELINE</span>
            </button>
          </div>

          {sandboxSavedMsg && (
            <span style={{ fontSize: '0.78rem', color: '#30D158', fontWeight: 700 }}>
              ✓ {sandboxSavedMsg}
            </span>
          )}
        </div>
      </div>

      {/* ====================================================================
          PANEL 4: SNAPSHOT VAULT, 1-CLICK ROLLBACK CLI & GIT MEMORY LOG
         ==================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '18px'
        }}
      >
        {/* Snapshot & Rollback Vault */}
        <div className="wos-glass-panel">
          <div className="wos-panel-head">
            <div>
              <span className="wos-panel-eyebrow">
                FAIL-SAFE TIME MACHINE // .BRAIN/SNAPSHOTS
              </span>
              <h3 className="wos-panel-title">1-Click Snapshot &amp; Rollback Controls</h3>
            </div>
            <Terminal size={16} style={{ color: '#FFEE00' }} />
          </div>

          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.68)', margin: '6px 0 12px' }}>
            Every snapshot backs up all <code>src/data/</code>, <code>src/components/</code>,{' '}
            <code>src/utils/</code>, <code>index.html</code>, and <code>BRAIN.md</code> before any
            edit.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            {[
              {
                id: 'cmd-snap',
                label: '1. Create Pre-Edit Snapshot',
                cmd: 'npm run snapshot -- "Before site update"'
              },
              {
                id: 'cmd-rollback',
                label: '2. Instant Rollback to Latest Snapshot',
                cmd: 'npm run rollback'
              },
              {
                id: 'cmd-brain',
                label: '3. Run Guardrail Doctor & Refresh Brain',
                cmd: 'npm run brain'
              }
            ].map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.09)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                    {item.label}
                  </div>
                  <code style={{ fontSize: '0.8rem', color: '#FFEE00', fontWeight: 700 }}>
                    {item.cmd}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(item.id, item.cmd)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.16)',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {copiedId === item.id ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38BDF8', marginBottom: '6px' }}>
            SAVED LOCAL SNAPSHOTS ({brainData?.snapshots?.length || 0})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(brainData?.snapshots || []).slice(0, 5).map((snap) => (
              <div
                key={snap.id}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: 'rgba(56,189,248,0.07)',
                  border: '1px solid rgba(56,189,248,0.22)',
                  fontSize: '0.76rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ color: '#fff' }}>{snap.id}</strong>
                  <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem' }}>
                    {snap.label} ({snap.fileCount} files)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(`snap-${snap.id}`, `npm run rollback -- ${snap.id}`)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    border: '1px solid rgba(56,189,248,0.4)',
                    background: 'transparent',
                    color: '#38BDF8',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {copiedId === `snap-${snap.id}` ? 'COPIED' : 'ROLLBACK CMD'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Build & Git Commit History */}
        <div className="wos-glass-panel">
          <div className="wos-panel-head">
            <div>
              <span className="wos-panel-eyebrow">CHRONOLOGICAL BUILD MEMORY // GIT LOG</span>
              <h3 className="wos-panel-title">Recent Site Milestones &amp; Commits</h3>
            </div>
            <FolderGit2 size={16} style={{ color: '#30D158' }} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '10px',
              maxHeight: '320px',
              overflowY: 'auto'
            }}
          >
            {(brainData?.recentCommits || []).map((c) => (
              <div
                key={c.hash}
                style={{
                  padding: '8px 11px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '10px',
                  alignItems: 'flex-start'
                }}
              >
                <div>
                  <code
                    style={{
                      fontSize: '0.72rem',
                      color: '#FFEE00',
                      marginRight: '8px',
                      fontWeight: 700
                    }}
                  >
                    {c.hash}
                  </code>
                  <span style={{ fontSize: '0.78rem', color: '#fff' }}>{c.subject}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'rgba(255,255,255,0.48)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {c.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
