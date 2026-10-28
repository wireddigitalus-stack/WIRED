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
            {/* Social icons moved to footer only to give the BLOG nav pill room */}
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
