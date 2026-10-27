import React from 'react';
import { ArrowUpRight, ChevronRight, Phone, Zap } from 'lucide-react';
import { getSeoPageById, BUSINESS_FACTS } from '../data/seoPages';

/**
 * On-page landing intro for prerendered SEO routes (city, case-study and
 * service pages without their own view). Renders the exact same copy that
 * scripts/prerender.mjs bakes into static HTML, so humans, Googlebot and
 * non-JS AI crawlers all see equivalent content.
 */
export default function SeoPageIntro({ pageId, onOpenContact, onNavigateHome }) {
  const page = getSeoPageById(pageId);
  if (!page || !page.showIntro) return null;

  return (
    <section className="seo-page-intro" aria-labelledby="seo-page-intro-h1">
      <div className="section-container">
        <nav className="seo-intro-breadcrumb" aria-label="Breadcrumb">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome?.();
            }}
          >
            Home
          </a>
          <ChevronRight size={12} aria-hidden="true" />
          <span aria-current="page">{page.breadcrumb}</span>
        </nav>

        <div className="seo-intro-card">
          <span className="seo-intro-eyebrow">{page.eyebrow}</span>
          <h1 id="seo-page-intro-h1" className="seo-intro-h1">
            {page.h1}
          </h1>
          {page.intro.map((p) => (
            <p key={p} className="seo-intro-lead">
              {p}
            </p>
          ))}

          <div className="seo-intro-actions">
            <button type="button" className="btn-wired-yellow" onClick={onOpenContact}>
              <Zap size={14} fill="#050505" />
              <span>START A PROJECT</span>
            </button>
            <a href={BUSINESS_FACTS.phoneHref} className="btn-wired-outline">
              <Phone size={14} />
              <span>CALL OR TEXT {BUSINESS_FACTS.phone}</span>
            </a>
            {page.clientUrl && (
              <a
                href={page.clientUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wired-outline"
              >
                <span>VISIT LIVE SITE</span>
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          <div className="seo-intro-sections">
            {page.sections.map((s) => (
              <div key={s.h2} className="seo-intro-block">
                <h2>{s.h2}</h2>
                {(s.body || []).map((b) => (
                  <p key={b}>{b}</p>
                ))}
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {page.faqs.length > 0 && (
            <div className="seo-intro-faqs">
              <h2>Common questions</h2>
              {page.faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
