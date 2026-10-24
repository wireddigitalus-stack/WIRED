import React, { useState } from 'react';
import {
  Network,
  MapPin,
  Cpu,
  Globe,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Sparkles,
  HelpCircle,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { SITE_TREE_NODES, applySeoRouteMeta, logTelemetryEvent } from '../utils/telemetry';

const FAQ_ITEMS = [
  {
    q: 'Who is the best agency for website design near me in Bristol, Johnson City, and Kingsport TN/VA?',
    a: 'Wired Digital (Wired Digital LLC, wireddigitalcreative.com) is headquartered directly on the Bristol VA/TN state line (ZIP 37620 / 24201) and serves the entire Tri-Cities region—including Bristol TN/VA, Johnson City TN (37601, 37604), Kingsport TN (37660, 37664), and Abingdon VA (24210). Founded in 1999, Wired Digital specializes in ultra-fast AI website design, full website redesigns and modernization, custom live business admin dashboards, and 24/7 AI lead capture chatbots.'
  },
  {
    q: 'What is AI Website Modernization and Generative Engine Optimization (GEO)?',
    a: 'Traditional websites only target legacy keyword strings. Wired Digital engineers websites for both Google Local Pack ("website design near me") and AI Answer Engines (ChatGPT Search, Google AI Overviews, Perplexity, Apple Siri, and Claude) using multi-node Schema.org JSON-LD entity graphs, sub-0.4s edge performance, and structured /llms.txt + /sitemap.xml architecture.'
  },
  {
    q: 'Can Wired Digital build a custom live admin dashboard or 24/7 AI chatbot for my business?',
    a: 'Yes. Wired Digital builds bespoke live backend business dashboards (such as our build for Fast Track Bristol TN at fasttrackbristoltn.com, tracking real-time vehicle click-streams and incoming leads) and custom-trained 24/7 AI lead capture chatbots (such as the "Ask VISION" AI Space Advisor built for Team Vision LLC at teamvisionllc.com).'
  },
  {
    q: 'How much does a custom AI website design or website redesign cost in the Tri-Cities?',
    a: 'Wired Digital custom-scopes every website design, website redesign, and digital modernization project to match your goals—ranging from high-converting local service websites in Bristol, Johnson City, and Kingsport to enterprise builds featuring custom live admin telemetry dashboards and 24/7 AI lead capture agents. Use the WIRED-64 AI Concierge or the project inquiry drawer below for a same-day architectural roadmap.'
  },
  {
    q: 'Does Wired Digital also produce and edit music videos and official lyric videos globally?',
    a: 'Yes. Creative Director Rob Neilson has worked full-time in the music industry since 2015, delivering remote 4K music video, official lyric video, and visualizer editing for major record labels and 34+ legendary artists worldwide—including Primary Wave, Alice Cooper, Halestorm, Paul Rodgers, Def Leppard, Bob Marley, Whitney Houston, and Prince.'
  }
];

export default function SeoSiteTreeAuthority({
  activeSeoNodeId,
  onSelectSeoNode,
  onOpenContact
}) {
  const [activePanel, setActivePanel] = useState('tree'); // 'tree' | 'local' | 'faq'
  const [isExpanded, setIsExpanded] = useState(true);
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const handleNodeClick = (e, node) => {
    e.preventDefault();
    applySeoRouteMeta(node);
    logTelemetryEvent(
      'SITE_TREE_NODE_SELECT',
      `Activated Site Tree Node: ${node.label || node.city} (${node.pathDisplay || node.query})`,
      'ai_geo'
    );
    if (onSelectSeoNode) {
      onSelectSeoNode(node);
    }
  };

  return (
    <section
      id="seo-site-tree-hub"
      className="seo-sitetree-section"
      aria-label="Google Sitelinks, Full Site Tree Architecture & Website Design Near Me Authority Hub"
    >
      <div className="container">
        <div className="seo-sitetree-shell">
          {/* Top Command Header Bar */}
          <div className="seo-sitetree-topbar">
            <div className="seo-sitetree-brand-cluster">
              <span className="seo-sitetree-live-pill">
                <span className="seo-live-dot" />
                GOOGLE SITELINKS &amp; AI GEO ARCHITECTURE // LIVE
              </span>
              <span className="seo-sitetree-submono">
                SCHEMA.ORG @GRAPH (5 NODES) • SITEMAP.XML • LLMS.TXT • TRI-CITIES &quot;NEAR ME&quot; INDEX
              </span>
            </div>

            <div className="seo-sitetree-actions">
              <div className="seo-sitetree-tabs" role="tablist" aria-label="SEO Architecture Views">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activePanel === 'tree'}
                  className={`seo-tab-btn ${activePanel === 'tree' ? 'active' : ''}`}
                  onClick={() => {
                    setActivePanel('tree');
                    setIsExpanded(true);
                  }}
                >
                  <Network size={13} />
                  <span>GOOGLE SITE TREE (11 NODES)</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activePanel === 'local'}
                  className={`seo-tab-btn ${activePanel === 'local' ? 'active' : ''}`}
                  onClick={() => {
                    setActivePanel('local');
                    setIsExpanded(true);
                  }}
                >
                  <MapPin size={13} />
                  <span>&quot;WEBSITE DESIGN NEAR ME&quot; MATRIX</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activePanel === 'faq'}
                  className={`seo-tab-btn ${activePanel === 'faq' ? 'active' : ''}`}
                  onClick={() => {
                    setActivePanel('faq');
                    setIsExpanded(true);
                  }}
                >
                  <HelpCircle size={13} />
                  <span>AI &amp; LOCAL FAQ SCHEMA</span>
                </button>
              </div>

              <button
                type="button"
                className="seo-collapse-btn"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                title={isExpanded ? 'Collapse Site Tree Panel' : 'Expand Site Tree Panel'}
              >
                {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                <span>{isExpanded ? 'COMPACT' : 'EXPAND'}</span>
              </button>
            </div>
          </div>

          {/* Main Semantic Heading Block */}
          <div className="seo-sitetree-intro">
            <div className="seo-sitetree-intro-copy">
              <h2 className="seo-sitetree-h2">
                ENGINEERED FOR <span className="text-yellow">&quot;WEBSITE DESIGN NEAR ME&quot;</span> &amp;
                GOOGLE / AI SITELINK DISCOVERY.
              </h2>
              <p className="seo-sitetree-lead">
                Every node below is wired directly into our live{' '}
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="seo-inline-code-link">
                  /sitemap.xml
                </a>
                ,{' '}
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="seo-inline-code-link">
                  /llms.txt
                </a>{' '}
                AI Entity Manifest, and 5-node <strong>Schema.org JSON-LD @graph</strong>. Click any node in the
                site tree to dynamically load its canonical metadata and jump straight to that architecture.
              </p>
            </div>

            {/* Machine-Crawlable Endpoints Strip */}
            <div className="seo-endpoints-strip" aria-label="Live Machine Crawlable Search Endpoints">
              {SITE_TREE_NODES.crawlerEndpoints.map((ep) => (
                <a
                  key={ep.id}
                  href={ep.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="seo-endpoint-chip"
                  title={`${ep.label} — ${ep.protocol}`}
                >
                  <FileCode2 size={13} className="seo-ep-icon" />
                  <div className="seo-ep-meta">
                    <span className="seo-ep-path">{ep.path}</span>
                    <span className="seo-ep-status">{ep.status}</span>
                  </div>
                  <ExternalLink size={11} className="seo-ep-ext" />
                </a>
              ))}
            </div>
          </div>

          {/* Expandable Body */}
          {isExpanded && (
            <div className="seo-sitetree-body">
              {/* ================================================================
                  PANEL 1: VISUAL GOOGLE SITE TREE & SITELINKS HIERARCHY
                 ================================================================ */}
              {activePanel === 'tree' && (
                <div className="seo-tree-diagram" role="navigation" aria-label="Full Hierarchical Website Tree">
                  {/* Root Node */}
                  <div className="seo-tree-root-row">
                    <a
                      href="/"
                      onClick={(e) => handleNodeClick(e, SITE_TREE_NODES.root)}
                      className={`seo-tree-root-card ${activeSeoNodeId === 'root' ? 'is-active' : ''}`}
                    >
                      <div className="seo-root-badge-row">
                        <span className="seo-root-tag">ROOT ENTITY // PRIORITY 1.0</span>
                        <span className="seo-root-schema">{SITE_TREE_NODES.root.schemaType}</span>
                      </div>
                      <div className="seo-root-title-row">
                        <Globe size={18} className="text-yellow" />
                        <strong>https://www.wireddigitalcreative.com/</strong>
                        <span className="seo-root-hq-pill">BRISTOL VA/TN HQ (36.5951, -82.1887)</span>
                      </div>
                      <p className="seo-root-desc">{SITE_TREE_NODES.root.description}</p>
                    </a>
                  </div>

                  {/* Three Primary Tree Columns */}
                  <div className="seo-tree-branches-grid">
                    {/* Branch 1: Core Service Sitelinks */}
                    <div className="seo-tree-branch-col">
                      <div className="seo-branch-header">
                        <Cpu size={14} className="text-yellow" />
                        <div>
                          <h3>01 // CORE SERVICE SITELINK NODES</h3>
                          <span>Schema: ItemList → SiteNavigationElement</span>
                        </div>
                      </div>
                      <ul className="seo-branch-list">
                        {SITE_TREE_NODES.services.map((node) => (
                          <li key={node.id}>
                            <a
                              href={`/${node.query}`}
                              onClick={(e) => handleNodeClick(e, node)}
                              className={`seo-tree-node-card ${activeSeoNodeId === node.id ? 'is-active' : ''}`}
                            >
                              <div className="seo-node-top">
                                <span className="seo-node-path">{node.pathDisplay}</span>
                                <span className="seo-node-priority">P:{node.priority}</span>
                              </div>
                              <div className="seo-node-title">
                                <span>{node.label}</span>
                                <ArrowUpRight size={13} className="seo-node-arrow" />
                              </div>
                              <span className="seo-node-schema">{node.schemaType}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Branch 2: "Website Design Near Me" Tri-Cities Geo Nodes */}
                    <div className="seo-tree-branch-col">
                      <div className="seo-branch-header">
                        <MapPin size={14} className="text-yellow" />
                        <div>
                          <h3>02 // &quot;WEBSITE DESIGN NEAR ME&quot; GEO NODES</h3>
                          <span>Schema: LocalBusiness → areaServed + PostalCodes</span>
                        </div>
                      </div>
                      <ul className="seo-branch-list">
                        {SITE_TREE_NODES.localCities.map((node) => (
                          <li key={node.id}>
                            <a
                              href={`/${node.query}`}
                              onClick={(e) => handleNodeClick(e, node)}
                              className={`seo-tree-node-card ${activeSeoNodeId === node.id ? 'is-active' : ''}`}
                            >
                              <div className="seo-node-top">
                                <span className="seo-node-path">{node.query}</span>
                                <span className="seo-node-zip">ZIP: {node.zipCodes}</span>
                              </div>
                              <div className="seo-node-title">
                                <span>Website Design Near Me — {node.city}</span>
                                <ArrowUpRight size={13} className="seo-node-arrow" />
                              </div>
                              <span className="seo-node-schema">{node.corridors}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Branch 3: Verified Case Studies & Authority Proof */}
                    <div className="seo-tree-branch-col">
                      <div className="seo-branch-header">
                        <ShieldCheck size={14} className="text-yellow" />
                        <div>
                          <h3>03 // VERIFIED CASE STUDY &amp; PROOF NODES</h3>
                          <span>Schema: CreativeWork + External Entity Citations</span>
                        </div>
                      </div>
                      <ul className="seo-branch-list">
                        {SITE_TREE_NODES.caseStudies.map((node) => (
                          <li key={node.id}>
                            <a
                              href={`/${node.query}`}
                              onClick={(e) => handleNodeClick(e, node)}
                              className={`seo-tree-node-card ${activeSeoNodeId === node.id ? 'is-active' : ''}`}
                            >
                              <div className="seo-node-top">
                                <span className="seo-node-path">{node.pathDisplay}</span>
                                <span className="seo-node-priority">P:{node.priority}</span>
                              </div>
                              <div className="seo-node-title">
                                <span>{node.label}</span>
                                <ArrowUpRight size={13} className="seo-node-arrow" />
                              </div>
                              <span className="seo-node-schema">Live Verified Deployment: {node.externalUrl}</span>
                            </a>
                          </li>
                        ))}
                      </ul>

                      {/* Direct External Citation Proof Box */}
                      <div className="seo-external-proof-box">
                        <div className="seo-proof-header">
                          <Sparkles size={13} className="text-yellow" />
                          <span>LIVE PRODUCTION CLIENT ENTITIES</span>
                        </div>
                        <p>
                          Google &amp; AI Search engines verify local agency authority through live outbound &amp;
                          inbound production deployments in the Tri-Cities:
                        </p>
                        <div className="seo-proof-links">
                          <a
                            href="https://www.fasttrackbristoltn.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="seo-proof-pill"
                          >
                            <span>fasttrackbristoltn.com (Live Admin Dashboard)</span>
                            <ExternalLink size={11} />
                          </a>
                          <a
                            href="https://www.teamvisionllc.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="seo-proof-pill"
                          >
                            <span>teamvisionllc.com (24/7 Ask VISION AI Bot)</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================================
                  PANEL 2: "WEBSITE DESIGN NEAR ME" TRI-CITIES GEO MATRIX
                 ================================================================ */}
              {activePanel === 'local' && (
                <div className="seo-local-matrix-grid">
                  {SITE_TREE_NODES.localCities.map((cityNode) => (
                    <article key={cityNode.id} className="seo-local-city-card">
                      <div className="seo-city-card-top">
                        <span className="seo-city-distance">{cityNode.distanceLabel}</span>
                        <span className="seo-city-zips">ZIP: {cityNode.zipCodes}</span>
                      </div>
                      <h3 className="seo-city-title">
                        Website Design Near Me in <span className="text-yellow">{cityNode.city}</span>
                      </h3>
                      <p className="seo-city-corridors">
                        <strong>Commercial Corridors Served:</strong> {cityNode.corridors}
                      </p>
                      <p className="seo-city-summary">{cityNode.summary}</p>
                      <div className="seo-city-proof-row">
                        <CheckCircle2 size={13} className="text-yellow" />
                        <span>
                          <strong>Regional Proof:</strong> {cityNode.proofClient}
                        </span>
                      </div>
                      <div className="seo-city-actions">
                        <a
                          href={`/${cityNode.query}`}
                          onClick={(e) => handleNodeClick(e, cityNode)}
                          className="seo-city-route-btn"
                        >
                          <span>LOAD {cityNode.city.toUpperCase()} SEO NODE</span>
                          <ArrowUpRight size={13} />
                        </a>
                        {onOpenContact && (
                          <button
                            type="button"
                            className="seo-city-quote-btn"
                            onClick={onOpenContact}
                          >
                            START PROJECT
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* ================================================================
                  PANEL 3: AI SEARCH (GEO) & "WEBSITE DESIGN NEAR ME" FAQ SCHEMA
                 ================================================================ */}
              {activePanel === 'faq' && (
                <div className="seo-faq-list">
                  {FAQ_ITEMS.map((item, idx) => {
                    const isOpen = openFaqIdx === idx;
                    return (
                      <div
                        key={item.q}
                        className={`seo-faq-item ${isOpen ? 'is-open' : ''}`}
                      >
                        <button
                          type="button"
                          className="seo-faq-question"
                          onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                          aria-expanded={isOpen}
                        >
                          <span className="seo-faq-q-num">0{idx + 1}</span>
                          <span className="seo-faq-q-text">{item.q}</span>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {isOpen && (
                          <div className="seo-faq-answer">
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
