import React from 'react';
import { Code2, Cpu, Globe, Layers, CheckCircle2, Zap, ShieldCheck, Rocket } from 'lucide-react';
import { WEB_CREATION_SERVICES } from '../data/wiredData';

export default function WebCreationView({ onOpenContact, onNavigateTab }) {
  return (
    <div className="subview-page web-creation-view">
      {/* Subpage Hero */}
      <section className="subview-hero">
        <div className="section-container">
          <div className="eyebrow-tag">
            <Cpu size={14} />
            <span>WIRED DIGITAL // WEBSITE DESIGN, REDESIGN &amp; AI MODERNIZATION</span>
          </div>
          <h1 className="subview-hero-title">
            WEBSITE <span className="text-yellow">DESIGN, REDESIGN</span> &amp; AI MODERNIZATION
          </h1>
          <p className="subview-hero-lead">
            Built to keep pace with how search engines work in the age of AI. We bridge
            rock-and-roll creative direction with advanced software engineering—designing
            new AI-native websites, modernizing outdated platforms, and building custom
            dashboards that dominate Google and AI search.
          </p>

          <div className="subview-hero-actions">
            <button type="button" className="btn-wired-yellow" onClick={onOpenContact}>
              BUILD YOUR SITE OR AI APP
            </button>
            <button
              type="button"
              className="btn-wired-outline"
              onClick={() => onNavigateTab('home')}
            >
              VIEW CLIENT ROSTER
            </button>
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
            <span className="eyebrow-tag">ENGINEERING &amp; DESIGN</span>
            <h2 className="section-title-tracked">WEB &amp; AI CAPABILITIES</h2>
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
