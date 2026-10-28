import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Menu, X, Zap, Cpu, MapPin, Film, Crown, BookOpen } from 'lucide-react';
import { BRAND_INFO } from './data/wiredData';
import SpiralHero from './components/SpiralHero';
import Since1999Section from './components/Since1999Section';
import AiSeoDashboardShowcase from './components/AiSeoDashboardShowcase';
import LegendsWall from './components/LegendsWall';
import WorkScreeningRoom from './components/WorkScreeningRoom';
import YellowFooter from './components/YellowFooter';
import WiredOrbChatbot from './components/WiredOrbChatbot';
import SeoSiteTreeAuthority from './components/SeoSiteTreeAuthority';
import BodyCtaContactCard from './components/BodyCtaContactCard';
import SeoPageIntro from './components/SeoPageIntro';
import { getSeoPageById } from './data/seoPages';
import { parseBlogPath } from './data/blogPosts';
import {
  logTelemetryEvent,
  SITE_TREE_NODES,
  applySeoRouteMeta,
  resolveInitialSeoNodeFromUrl
} from './utils/telemetry';

const WebCreationView = lazy(() => import('./components/WebCreationView'));
const VideoProductionView = lazy(() => import('./components/VideoProductionView'));
const AdminDashboardView = lazy(() => import('./components/AdminDashboardView'));
const VideoLightboxModal = lazy(() => import('./components/VideoLightboxModal'));
const ContactModal = lazy(() => import('./components/ContactModal'));
const BlogView = lazy(() => import('./components/BlogView'));

export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return 'home';
    if (window.location.hash === '#admin') return 'admin';
    if (parseBlogPath(window.location.pathname)) return 'blog';
    const initialNode = resolveInitialSeoNodeFromUrl();
    return initialNode?.tab || 'home';
  }); // 'home' | 'web' | 'video' | 'legends' | 'blog' | 'admin'
  const [blogSlug] = useState(() =>
    typeof window === 'undefined' ? null : parseBlogPath(window.location.pathname)?.slug || null
  );
  const [activeSection, setActiveSection] = useState(() => {
    const initialNode = resolveInitialSeoNodeFromUrl();
    return initialNode?.section || null;
  });
  const [activeSeoNodeId, setActiveSeoNodeId] = useState(() => {
    const initialNode = resolveInitialSeoNodeFromUrl();
    return initialNode?.id || 'root';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const showSeoIntro = Boolean(getSeoPageById(activeSeoNodeId)?.showIntro);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const initialNode = resolveInitialSeoNodeFromUrl();
    if (initialNode) {
      applySeoRouteMeta(initialNode);
      if (initialNode.section) {
        setTimeout(() => {
          document.getElementById(initialNode.section)?.scrollIntoView({ behavior: 'smooth' });
        }, 220);
      }
    }

    // Warm-prefetch secondary tab views during browser idle time so tab clicks are 0ms instant
    const prefetchSecondaryViews = () => {
      import('./components/WebCreationView').catch(() => {});
      import('./components/VideoProductionView').catch(() => {});
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(prefetchSecondaryViews, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(idleId);
    }
    const timerId = setTimeout(prefetchSecondaryViews, 1800);
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 200 && Date.now() - (window.__wosSectionJumpTs || 0) > 900) {
        setActiveSection(null);
      }
    };
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setActiveSection(null);
        setActiveTab((prev) => (prev === 'admin' ? 'home' : 'admin'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    // Owner entrance: typing /#admin opens the dashboard without needing a refresh
    const onHashChange = () => {
      if (window.location.hash === '#admin') {
        setActiveSection(null);
        setActiveTab('admin');
        window.scrollTo({ top: 0 });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const handleNavigateTab = (tab) => {
    setActiveTab(tab);
    setActiveSection(null);
    setMobileMenuOpen(false);
    if (tab === 'home') {
      setActiveSeoNodeId('root');
      applySeoRouteMeta(SITE_TREE_NODES.root);
    } else if (tab === 'web') {
      const webNode = SITE_TREE_NODES.services.find((n) => n.id === 'view-web-design');
      if (webNode) {
        setActiveSeoNodeId(webNode.id);
        applySeoRouteMeta(webNode);
      }
    } else if (tab === 'video') {
      const videoNode = SITE_TREE_NODES.services.find((n) => n.id === 'view-video-production');
      if (videoNode) {
        setActiveSeoNodeId(videoNode.id);
        applySeoRouteMeta(videoNode);
      }
    } else if (tab === 'legends') {
      const legendsNode = SITE_TREE_NODES.services.find((n) => n.id === 'view-legends-vault');
      if (legendsNode) {
        setActiveSeoNodeId(legendsNode.id);
        applySeoRouteMeta(legendsNode);
      }
    }
    logTelemetryEvent(
      'NAV_VIEW_SWITCH',
      `Visitor navigated to ${tab.toUpperCase()} view`,
      'engagement',
      tab === 'legends' ? 'legends_vault' : null
    );
    window.scrollTo({ top: 0 });
  };

  const scrollToElementCleanly = (sectionId) => {
    const jump = (behavior) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const top = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 84);
      window.scrollTo({ top, behavior });
    };
    requestAnimationFrame(() => jump('smooth'));
    setTimeout(() => jump('smooth'), 240);
  };

  const handleSelectSeoNode = (node) => {
    if (!node) return;
    setActiveSeoNodeId(node.id);
    const targetTab = node.tab || 'home';
    setActiveTab(targetTab);
    setActiveSection(node.section || null);
    if (node.section) {
      scrollToElementCleanly(node.section);
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  const handleScrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (sectionId === 'legends') {
      handleNavigateTab('legends');
      return;
    }
    const sectionKeyMap = {
      'case-studies': 'case_studies_tricities',
      legends: 'legends_vault'
    };
    logTelemetryEvent(
      'SECTION_JUMP',
      `Visitor jumped to #${sectionId}`,
      'engagement',
      sectionKeyMap[sectionId] || null
    );
    window.__wosSectionJumpTs = Date.now();
    setActiveSection(sectionId);
    setActiveSeoNodeId('root');
    applySeoRouteMeta(SITE_TREE_NODES.root);
    if (activeTab !== 'home') {
      window.scrollTo(0, 0);
      setActiveTab('home');
    }
    scrollToElementCleanly(sectionId);
  };

  return (
    <div className="wired-app-shell">
      {/* ====================================================================
          SLEEK iOS LIQUID-GLASS FLOATING NAVIGATION BAR
         ==================================================================== */}
      <header className={`ios-burton-header-wrap ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="ios-dynamic-island-nav">
          {/* Left: Raven Emblem + WIRED ⚡ DIGITAL */}
          <button
            type="button"
            className="island-brand-pill"
            onClick={() => handleNavigateTab('home')}
            aria-label="Wired Digital Home"
          >
            <div className="island-raven-ring">
              <img
                src={BRAND_INFO.logoSrc}
                alt="Wired Digital Raven Logo"
                className="island-raven-logo"
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <span className="island-brand-title">
              WIRED{' '}
              <svg
                viewBox="0 0 24 36"
                className="inline-yellow-bolt"
                aria-hidden="true"
              >
                <polygon
                  points="15,1 2,20 11,20 7,35 22,15 13,15"
                  fill="#FFEE00"
                />
              </svg>{' '}
              DIGITAL
            </span>
          </button>

          {/* Center: Clean Single-Line iOS Segmented Navigation Pills */}
          <nav className="island-nav-pills" aria-label="Main Navigation">
            <button
              type="button"
              className={`island-pill-btn ${activeTab === 'home' && !activeSection ? 'active' : ''}`}
              onClick={() => handleNavigateTab('home')}
            >
              <span>HOME</span>
            </button>

            <button
              type="button"
              className={`island-pill-btn ${activeTab === 'web' ? 'active' : ''}`}
              onClick={() => handleNavigateTab('web')}
            >
              <Cpu size={13} className="pill-icon-yellow" />
              <span>AI WEB &amp; SEO</span>
            </button>

            <button
              type="button"
              className={`island-pill-btn ${activeTab === 'home' && activeSection === 'case-studies' ? 'active' : ''}`}
              onClick={() => handleScrollToSection('case-studies')}
            >
              <MapPin size={13} className="pill-icon-yellow" />
              <span>LOCAL WORK</span>
            </button>

            <button
              type="button"
              className={`island-pill-btn ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => handleNavigateTab('video')}
            >
              <Film size={13} className="pill-icon-sub" />
              <span>VIDEO</span>
            </button>

            <button
              type="button"
              className={`island-pill-btn ${activeTab === 'legends' ? 'active' : ''}`}
              onClick={() => handleNavigateTab('legends')}
            >
              <Crown size={13} className="pill-icon-sub" />
              <span>LEGENDS</span>
            </button>

            <a
              href="/blog/"
              className={`island-pill-btn ${activeTab === 'blog' ? 'active' : ''}`}
            >
              <BookOpen size={13} className="pill-icon-yellow" />
              <span>BLOG</span>
            </a>
          </nav>

          {/* Right: Socials + Single-Line iOS CTA Pill */}
          <div className="island-right-cluster">
            <a
              href={BRAND_INFO.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="island-social-btn"
              aria-label="YouTube"
              title="YouTube — @WiredDigitalCreative"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {BRAND_INFO.instagramUrl && (

              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="island-social-btn"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

            )}

            <button
              type="button"
              className="island-cta-pill"
              onClick={() => setContactOpen(true)}
            >
              <Zap size={13} fill="#050505" />
              <span>LET&apos;S TALK</span>
            </button>

            <button
              type="button"
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile iOS Glass Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-ios-drawer">
            <button
              type="button"
              className={`mobile-nav-item ${activeTab === 'home' && !activeSection ? 'active' : ''}`}
              onClick={() => handleNavigateTab('home')}
            >
              <Zap size={14} fill="#FFEE00" color="#FFEE00" /> HOME
            </button>
            <button
              type="button"
              className={`mobile-nav-item ${activeTab === 'web' ? 'active' : ''}`}
              onClick={() => handleNavigateTab('web')}
            >
              <Cpu size={14} color="#FFEE00" /> AI SITE DESIGN, REDESIGN &amp; MODERNIZATION (AI-ERA SEO)
            </button>
            <button
              type="button"
              className={`mobile-nav-item ${activeTab === 'home' && activeSection === 'case-studies' ? 'active' : ''}`}
              onClick={() => handleScrollToSection('case-studies')}
            >
              <MapPin size={14} color="#FFEE00" /> RECENT BUILDS (FAST TRACK, TEAM VISION &amp; RINGGER LAW)
            </button>
            <button
              type="button"
              className={`mobile-nav-item ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => handleNavigateTab('video')}
            >
              <Film size={14} color="#FFEE00" /> VIDEO PRODUCTION (GLOBAL EDITING)
            </button>
            <button
              type="button"
              className={`mobile-nav-item ${activeTab === 'legends' ? 'active' : ''}`}
              onClick={() => handleNavigateTab('legends')}
            >
              <Crown size={14} color="#FFEE00" /> WORKING WITH LEGENDS (34)
            </button>
            <a
              href="/blog/"
              className={`mobile-nav-item ${activeTab === 'blog' ? 'active' : ''}`}
            >
              <BookOpen size={14} color="#FFEE00" /> BLOG (PRICING GUIDES &amp; CASE STUDIES)
            </a>
            <button
              type="button"
              className="btn-wired-yellow mobile-drawer-cta"
              onClick={() => {
                setMobileMenuOpen(false);
                setContactOpen(true);
              }}
            >
              START A PROJECT
            </button>
          </div>
        )}
      </header>

      {/* Main Content View */}
      <main className="wired-main-content">
        {/* Landing intro for prerendered city / case-study / service routes */}
        {activeTab !== 'admin' && (
          <SeoPageIntro
            pageId={activeSeoNodeId}
            onOpenContact={() => setContactOpen(true)}
            onNavigateHome={() => handleNavigateTab('home')}
          />
        )}

        {activeTab === 'home' && (
          <>
            {!showSeoIntro && (
              <SpiralHero
                onScrollToSection={handleScrollToSection}
                onNavigateTab={handleNavigateTab}
              />
            )}
            <Since1999Section
              onNavigateTab={handleNavigateTab}
              onOpenVideoModal={(proj) => setActiveVideoModal(proj)}
              onOpenContact={() => setContactOpen(true)}
            />
            <AiSeoDashboardShowcase onOpenContact={() => setContactOpen(true)} />
            <LegendsWall />
            <WorkScreeningRoom
              onOpenVideoModal={(proj) => setActiveVideoModal(proj)}
              onNavigateTab={handleNavigateTab}
            />
          </>
        )}

        {activeTab === 'web' && (
          <Suspense fallback={null}>
            <WebCreationView
              onOpenContact={() => setContactOpen(true)}
              onNavigateTab={handleNavigateTab}
            />
            {/* AiSeoDashboardShowcase intentionally not repeated here — it already
                renders in full on Home (≈11 phone screens), and duplicating it made
                this view ≈29 screens on mobile. Case studies live at Home #case-studies. */}
            <LegendsWall />
          </Suspense>
        )}

        {activeTab === 'video' && (
          <Suspense fallback={null}>
            <VideoProductionView
              onOpenVideoModal={(proj) => setActiveVideoModal(proj)}
              onOpenContact={() => setContactOpen(true)}
              onNavigateTab={handleNavigateTab}
            />
            <LegendsWall />
          </Suspense>
        )}

        {activeTab === 'legends' && (
          <>
            <LegendsWall />
            <WorkScreeningRoom
              onOpenVideoModal={(proj) => setActiveVideoModal(proj)}
              onNavigateTab={handleNavigateTab}
            />
          </>
        )}

        {activeTab === 'blog' && (
          <Suspense fallback={null}>
            <BlogView slug={blogSlug} />
          </Suspense>
        )}

        {activeTab === 'admin' && (
          <Suspense fallback={null}>
            <AdminDashboardView onExitDashboard={() => handleNavigateTab('home')} />
          </Suspense>
        )}

        {/* Always-Visible In-Body Call-to-Action Contact Card */}
        {activeTab !== 'admin' && <BodyCtaContactCard />}
      </main>

      {/* Google Sitelinks, Full Site Tree Architecture & "Website Design Near Me" Authority Hub */}
      {activeTab !== 'admin' && (
        <SeoSiteTreeAuthority
          activeSeoNodeId={activeSeoNodeId}
          onSelectSeoNode={handleSelectSeoNode}
          onOpenContact={() => setContactOpen(true)}
        />
      )}

      {/* Signature Full-Bleed Electric Yellow Footer Finale */}
      {activeTab !== 'admin' && (
        <YellowFooter
          onOpenContact={() => setContactOpen(true)}
          onNavigateTab={handleNavigateTab}
        />
      )}

      {/* Cinema Video Lightbox Modal */}
      {activeVideoModal && (
        <Suspense fallback={null}>
          <VideoLightboxModal
            project={activeVideoModal}
            onClose={() => setActiveVideoModal(null)}
          />
        </Suspense>
      )}

      {/* Project Inquiry / Contact Modal */}
      {contactOpen && (
        <Suspense fallback={null}>
          <ContactModal
            isOpen={contactOpen}
            onClose={() => setContactOpen(false)}
          />
        </Suspense>
      )}

      {/* Floating Shiny Black Orb Lead-Capture Bot + 64-Bit Yellow/Green Retro Terminal */}
      {activeTab !== 'admin' && <WiredOrbChatbot />}
    </div>
  );
}
