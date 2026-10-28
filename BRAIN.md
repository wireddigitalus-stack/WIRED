# WIRED DIGITAL — SITE BRAIN & MASTER KNOWLEDGE TREE (`BRAIN.md`)

> **READ THIS FIRST (FOR ANY LLM, AGENT, OR NEW CHAT SESSION):**
> Before scanning the codebase, read this file + [`public/site-brain.json`](file:///Users/robertneilson/Desktop/WDC/public/site-brain.json). Together they map every route, component, data source, sync dependency, and non-negotiable guardrail on **Wired Digital (`https://www.wireddigitalcreative.com/`)** so you never have to grep 27,000 lines of code.

---

## 1. Studio Identity & Core Facts (Single Source of Truth)

- **Brand Name**: `Wired Digital` (Legal: `Wired Digital LLC` / Alternate: `Wired Digital Creative`)
- **Domain**: `https://www.wireddigitalcreative.com/`
- **Founder**: Rob Neilson — Creative Director, Principal AI Web Engineer & Lead Video Editor
- **Timeline**: Founded **1999** (Jackson, TN) • Full-time in the music industry since **2015** • Headquartered in **Bristol, VA/TN (Tri-Cities)** since **2022**
- **Direct Contact**: Phone/Text `731-616-5121` (`tel:+17316165121`) • Email `WiredDigitalUS@gmail.com`
- **3-Tier Flat-Rate Website Pricing**:
  1. **Starter / Redesign**: `$1,850 – $3,500` (5–8 pages, mobile-first, local SEO & AI search schema, ~2–3 weeks)
  2. **Business Growth + AI Chatbot**: `$3,500 – $6,500` (8–15 pages, 24/7 custom-trained AI lead chatbot, city/service pages, ~3–5 weeks)
  3. **Custom Platform + Live Admin Dashboard**: `$5,500 – $12,000+` (live owner telemetry/CRM dashboard, custom calculators/funnels, ~4–6 weeks)
  - *Note*: Simple 1–3 page sites start around `$1,200 – $1,800`. **Zero mandatory monthly retainers.**

---

## 2. 3-Ring Knowledge Tree (Where Everything Lives)

- **Ring 1 — Safe Data & Content**: the 4 data files below. Edit here first.
- **Ring 2 — UI Components**: view/section components (edit with care, keep visuals & animations intact).
- **Ring 3 — Core Engine (locked unless explicitly asked)**: `src/App.jsx` (routing + lazy chunks), `scripts/prerender.mjs`, `scripts/build-brain.mjs`, `scripts/brain-snapshot.mjs`, `vite.config.js`, `vercel.json`.

### Ring 1 — Safe Data & Content Layer (Client/Admin Editable — Edit Here First!)
95% of content, pricing, SEO, blog, and chatbot updates live in these 4 structured files:

| File | Controls What | Key Exports |
| :--- | :--- | :--- |
| [`src/data/wiredData.js`](file:///Users/robertneilson/Desktop/WDC/src/data/wiredData.js) | Brand contact info, 3 Home case studies, 3 AI/SEO pillars, 34 Legends Vault logos, 4 featured YouTube videos | `BRAND_INFO` (incl. social + `googleBusinessUrl`), `TRI_CITIES_CASE_STUDIES`, `AI_SEO_PILLARS`, `CLIENT_LOGOS` (34 legends), `FEATURED_WORK`, `YOUTUBE_CHANNEL_DATA` |
| [`src/data/seoPages.js`](file:///Users/robertneilson/Desktop/WDC/src/data/seoPages.js) | All 14 prerendered SEO/GEO landing pages, titles, meta descriptions, FAQs, and 3 pricing tiers (`PRICING_TIERS`) | `SITE_BASE`, `BUSINESS_FACTS`, `PRICING_TIERS`, `SEO_PAGES`, `getSeoPageById`, `canonicalFor`, `findSeoPageByPath` |
| [`src/data/blogPosts.js`](file:///Users/robertneilson/Desktop/WDC/src/data/blogPosts.js) | Company blog index (`/blog/`) and all blog articles (`/blog/<slug>/`), including `draft: true/false` flag | `BLOG_AUTHOR`, `BLOG_INDEX`, `BLOG_POSTS`, `renderBlogPostHtml` |
| [`src/utils/wired64Brain.js`](file:///Users/robertneilson/Desktop/WDC/src/utils/wired64Brain.js) | `WIRED-64` chatbot brain: 16 topic handlers, 3-question lead capture state machine, polite sign-off, knowledge cards | `wired64Respond`, `createChatState`, `formatScanSummary`, `WIRED64_INTRO`, `PHONE`, `EMAIL` (topics live in internal `TOPICS` array) |

### Ring 2 — UI Components, Routing & Build Engine

| Area | File | Notes & Line Guidance |
| :--- | :--- | :--- |
| **App Shell & Nav** | [`src/App.jsx`](file:///Users/robertneilson/Desktop/WDC/src/App.jsx) | Floating iOS Dynamic Island nav, tab routing (`home`, `web`, `video`, `legends`, `blog`, `admin`), lazy chunk boundaries |
| **Home Top Swirl Banner** | [`src/components/SpiralHero.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/SpiralHero.jsx) | Tim Burton optical swirl SVG + `WIRED ⚡ DIGITAL` lockup + `creative + intelligent + fast` tagline |
| **Home 50/50 Reel + Stamp** | [`src/components/Since1999Section.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/Since1999Section.jsx) | Left: studio reel loop (`wired-reel-360.mp4` mobile / `wired-reel-720.mp4` desktop). Right: circular stamp + `SINCE 1999` manifesto |
| **Recent Work & Live Demo** | [`src/components/AiSeoDashboardShowcase.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/AiSeoDashboardShowcase.jsx) | `variant="home"` → 3 slim Recent Work cards + 3 service cards + city links. `variant="demo"` → interactive live dashboard demo (shown on `/web-design/`) |
| **Web Design Subpage** | [`src/components/WebCreationView.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/WebCreationView.jsx) | `/web-design/` view, 6-pillar bento grid, before/after slider, embedded `WebsiteAiGraderCard` |
| **Video Subpage** | [`src/components/VideoProductionView.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/VideoProductionView.jsx) | `/video-production/` view, playlists (`Official Music Videos`, `Lyric Videos`, `Promo`), client quote calculator |
| **34 Legends Vault** | [`src/components/LegendsWall.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/LegendsWall.jsx) + [`src/components/SmartLogo.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/SmartLogo.jsx) | 34 iconic artist/label logos with automatic canvas background removal & `IntersectionObserver` lazy gate |
| **Video Screening Room** | [`src/components/WorkScreeningRoom.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/WorkScreeningRoom.jsx) | 4 featured widescreen music/lyric videos with viewport-gated YouTube thumbnails |
| **In-Body CTA Card** | [`src/components/BodyCtaContactCard.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/BodyCtaContactCard.jsx) | Always-visible direct contact card (`#direct-contact-card`) above the footer on every public view |
| **SEO Authority Hub & Intro** | [`src/components/SeoPageIntro.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/SeoPageIntro.jsx) + [`src/components/SeoSiteTreeAuthority.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/SeoSiteTreeAuthority.jsx) | Prerendered city/service/case-study intro card + bottom sitemap authority hub |
| **Blog View** | [`src/components/BlogView.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/BlogView.jsx) | Renders `/blog/` and `/blog/<slug>/` using the shared HTML renderer from `blogPosts.js` |
| **WIRED-64 Chatbot UI** | [`src/components/WiredOrbChatbot.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/WiredOrbChatbot.jsx) | Floating black orb + retro 64-bit terminal UI; delegates brain logic to `src/utils/wired64Brain.js` |
| **Admin Command Center** | [`src/components/AdminDashboardView.jsx`](file:///Users/robertneilson/Desktop/WDC/src/components/AdminDashboardView.jsx) | `/#admin` (or `Cmd+Shift+D`) PIN-protected owner dashboard: Overview, Leads CRM, Analytics, SEO/GEO Reports, and **Site Brain & Safe Editor** |
| **Prerender & Brain Scripts** | [`scripts/prerender.mjs`](file:///Users/robertneilson/Desktop/WDC/scripts/prerender.mjs), [`scripts/build-brain.mjs`](file:///Users/robertneilson/Desktop/WDC/scripts/build-brain.mjs), [`scripts/brain-snapshot.mjs`](file:///Users/robertneilson/Desktop/WDC/scripts/brain-snapshot.mjs) | Generates static HTML for all 17 routes + `sitemap.xml`, builds `public/site-brain.json`, runs guardrail checks, and manages snapshots |

---

## 3. "If You Change X → Also Update Y" Sync Matrix

1. **Changing Pricing Tiers (`$1,850–$3,500`, `$3,500–$6,500`, `$5,500–$12,000+`)**:
   - Update `PRICING_TIERS` in [`src/data/seoPages.js`](file:///Users/robertneilson/Desktop/WDC/src/data/seoPages.js)
   - Update the `pricing` topic in the `TOPICS` array of [`src/utils/wired64Brain.js`](file:///Users/robertneilson/Desktop/WDC/src/utils/wired64Brain.js)
   - Update pricing callout/table in [`src/data/blogPosts.js`](file:///Users/robertneilson/Desktop/WDC/src/data/blogPosts.js) (`website-cost-tri-cities`)
2. **Changing Phone (`731-616-5121`) or Email (`WiredDigitalUS@gmail.com`)**:
   - Update `BRAND_INFO` in [`src/data/wiredData.js`](file:///Users/robertneilson/Desktop/WDC/src/data/wiredData.js)
   - Update `BUSINESS_FACTS` in [`src/data/seoPages.js`](file:///Users/robertneilson/Desktop/WDC/src/data/seoPages.js), `PHONE` in [`src/data/blogPosts.js`](file:///Users/robertneilson/Desktop/WDC/src/data/blogPosts.js), `PHONE` / `EMAIL` in [`src/utils/wired64Brain.js`](file:///Users/robertneilson/Desktop/WDC/src/utils/wired64Brain.js), and JSON-LD in [`index.html`](file:///Users/robertneilson/Desktop/WDC/index.html)
3. **Adding a New Blog Post**:
   - Add an entry to `BLOG_POSTS` in [`src/data/blogPosts.js`](file:///Users/robertneilson/Desktop/WDC/src/data/blogPosts.js) (`draft: true` to preview privately at `/blog/<slug>/`, `draft: false` to publish + auto-include in `/blog/` and `sitemap.xml`)
   - Run `npm run build`
4. **Adding or Editing a Case Study Screenshot**:
   - Place both `<name>.jpg` (`1012×484`) and `<name>-sm.jpg` (`680w` mobile optimized) in `public/`

---

## 4. Non-Negotiable Guardrails (Never Violate These)

1. **Keep Team Vision LLC Low-Key**:
   - Team Vision LLC (`teamvisionllc.com`) is a light portfolio example on the Recent Work card and `/work/team-vision/` only. Never pitch it in the hero, never feature it in default chatbot replies (unless the user explicitly asks about `Team Vision`), and never use inflated claims.
2. **Keep the Home Page Decluttered**:
   - Home shows the 3 slim "Recent Work" cards (`variant="home"` in `AiSeoDashboardShowcase.jsx`). The heavy interactive live dashboard demo (`variant="demo"`) and `WebsiteAiGraderCard` belong on `/web-design/` (`WebCreationView.jsx`), not on Home.
3. **WIRED-64 Chatbot Rules (`node scripts/test-wired64.mjs` Must Always Pass)**:
   - Replies must be **short and concise (`≤ 45 words`)** with a light touch of dry humor.
   - After **3 answered questions**, gently ask for the visitor's **first name**, then their **email or phone**, and save the lead + full question transcript via `addLead()`.
   - When a user says `"no thank you"` / `"thanks"`, reply with: `"YOU'RE WELCOME // That is literally my only job. : )"` (with the space text smiley `: )`).
4. **Mobile Speed Guardrails**:
   - Never import `blogPosts.js`, `WiredOrbChatbot`, `LegendsWall`, `WorkScreeningRoom`, `BodyCtaContactCard`, `SeoSiteTreeAuthority`, or `YellowFooter` eagerly in the critical path of `src/App.jsx`.
   - Always keep `srcSet` (`-sm.jpg 680w`) on case study images and `IntersectionObserver` gates on `WorkScreeningRoom` and `SmartLogo`.
5. **Zero Visual or Animation Loss**:
   - Never degrade the Tim Burton swirl hero, iOS liquid-glass aesthetic, `#FFEE00` electric yellow accents, or studio animations.

---

## 5. Commands for Verification, Snapshots & Rollbacks

- **`npm run brain`** — Scans the codebase, updates `public/site-brain.json`, and runs all automated Guardrail & Asset Doctor checks.
- **`npm run snapshot -- "optional label"`** — Saves a timestamped backup of all Ring-1 data & brain files into `.brain/snapshots/`.
- **`npm run rollback`** (or `npm run rollback -- <snapshot-id>`) — Restores the last known-good snapshot in 1 second and re-verifies.
- **`npm run build`** — Runs `build-brain.mjs`, `vite build`, and `prerender.mjs` (generating all 17 static SEO/blog routes + `sitemap.xml`).
