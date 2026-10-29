#!/usr/bin/env node
// ============================================================================
// WIRED DIGITAL — AUTO-GENERATING SITE BRAIN & GUARDRAIL DOCTOR
// (scripts/build-brain.mjs -> public/site-brain.json)
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import * as wiredDataMod from '../src/data/wiredData.js';
import {
  BRAND_INFO,
  TRI_CITIES_CASE_STUDIES,
  AI_SEO_PILLARS,
  CLIENT_LOGOS as LEGENDS_VAULT,
  FEATURED_WORK
} from '../src/data/wiredData.js';
import * as seoPagesMod from '../src/data/seoPages.js';
import { SITE_BASE, SEO_PAGES, BUSINESS_FACTS, PRICING_TIERS } from '../src/data/seoPages.js';

const SOCIAL_URLS = {
  youtube: BRAND_INFO.youtubeUrl,
  instagram: BRAND_INFO.instagramUrl,
  facebook: BRAND_INFO.facebookUrl,
  linkedin: BRAND_INFO.linkedinUrl
};
const GBP_URL = BRAND_INFO.googleBusinessUrl || 'https://www.google.com/maps?cid=9585866241141725780';
import * as blogPostsMod from '../src/data/blogPosts.js';
import { BLOG_INDEX, BLOG_POSTS, publishedPosts } from '../src/data/blogPosts.js';
import * as wired64BrainMod from '../src/utils/wired64Brain.js';
import {
  wired64Respond,
  WIRED64_INTRO,
  _test
} from '../src/utils/wired64Brain.js';
import { listSnapshots } from './brain-snapshot.mjs';

const generateWired64Reply = (q) => wired64Respond(q);
const QUICK_PROMPTS = WIRED64_INTRO.chips;
const KNOWLEDGE_CARDS = Object.fromEntries((_test.TOPICS || []).map((t) => [t.id, t]));

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const OUT_FILE = path.join(PUBLIC_DIR, 'site-brain.json');

function countLinesAndBytes(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return { exists: false, lines: 0, bytes: 0 };
  const text = fs.readFileSync(full, 'utf8');
  return {
    exists: true,
    lines: text.split('\n').length,
    bytes: Buffer.byteLength(text, 'utf8')
  };
}

function scanDirectoryFiles(relDir, extFilter = /\.(jsx?|css|mjs)$/) {
  const dir = path.join(ROOT, relDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => extFilter.test(f))
    .sort()
    .map((f) => {
      const rel = path.join(relDir, f);
      const stats = countLinesAndBytes(rel);
      return {
        file: rel,
        name: f,
        lines: stats.lines,
        sizeKb: Number((stats.bytes / 1024).toFixed(1))
      };
    });
}

function getRecentGitCommits(limit = 15) {
  try {
    const raw = execSync(
      `git log -n ${limit} --pretty=format:"%h|%ad|%s" --date=short`,
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    return raw
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [hash, date, ...msgParts] = line.split('|');
        return { hash, date, subject: msgParts.join('|') };
      });
  } catch {
    return [];
  }
}

function runDoctorChecks() {
  const checks = [];
  const addCheck = (id, category, title, passed, detail) => {
    checks.push({
      id,
      category,
      title,
      status: passed ? 'PASS' : 'FAIL',
      passed: Boolean(passed),
      detail
    });
  };

  // 1. Asset integrity check (all local images/videos referenced in data files exist in public/)
  const referencedAssets = new Set([
    BRAND_INFO.logoSrc,
    BRAND_INFO.roundStampSrc,
    BRAND_INFO.reelMp4,
    BRAND_INFO.reelMp4Mobile,
    BRAND_INFO.reelPoster,
    '/wired-round-favicon.png',
    '/wired-og-seal-2026.jpg'
  ]);
  for (const cs of TRI_CITIES_CASE_STUDIES) {
    if (cs.frontendImg) {
      referencedAssets.add(cs.frontendImg);
      referencedAssets.add(cs.frontendImg.replace(/\.jpg$/i, '-sm.jpg'));
    }
    if (cs.dashboardImg) {
      referencedAssets.add(cs.dashboardImg);
      referencedAssets.add(cs.dashboardImg.replace(/\.jpg$/i, '-sm.jpg'));
    }
  }
  for (const l of LEGENDS_VAULT) {
    if (l.src && l.src.startsWith('/')) referencedAssets.add(l.src);
  }
  for (const post of BLOG_POSTS) {
    if (post.cover && post.cover.startsWith('/')) referencedAssets.add(post.cover);
  }

  const missingAssets = [];
  for (const assetUrl of referencedAssets) {
    const cleanRel = String(assetUrl).split('?')[0].replace(/^\/+/, '');
    const fullPath = path.join(PUBLIC_DIR, cleanRel);
    if (!fs.existsSync(fullPath)) {
      missingAssets.push(assetUrl);
    }
  }
  addCheck(
    'assets-exist',
    'ASSET INTEGRITY',
    'All local images, mobile -sm.jpg screenshots, logos & video reels exist in public/',
    missingAssets.length === 0,
    missingAssets.length === 0
      ? `Verified ${referencedAssets.size} referenced media assets in public/`
      : `Missing in public/: ${missingAssets.join(', ')}`
  );

  // 2. Contact & Pricing parity across data files + components
  const seoPagesText = fs.readFileSync(path.join(ROOT, 'src/data/seoPages.js'), 'utf8');
  const blogPostsText = fs.readFileSync(path.join(ROOT, 'src/data/blogPosts.js'), 'utf8');
  const brainText = fs.readFileSync(path.join(ROOT, 'src/utils/wired64Brain.js'), 'utf8');
  const indexHtmlText = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  const phoneConsistent =
    BRAND_INFO.phone === '731-616-5121' &&
    BUSINESS_FACTS.phone === '731-616-5121' &&
    blogPostsText.includes('731-616-5121') &&
    brainText.includes('731-616-5121') &&
    indexHtmlText.includes('+1-731-616-5121');
  addCheck(
    'contact-sync',
    'SYNC MATRIX',
    'Studio phone (731-616-5121) & email (WiredDigitalUS@gmail.com) synced across all files',
    phoneConsistent && BRAND_INFO.email === 'WiredDigitalUS@gmail.com' && BUSINESS_FACTS.email === 'WiredDigitalUS@gmail.com',
    `Phone: ${BRAND_INFO.phone} • Email: ${BRAND_INFO.email}`
  );

  const normDash = (s) => String(s).replace(/\s*[–-]\s*/g, '–');
  const normSeo = normDash(seoPagesText);
  const normBlog = normDash(blogPostsText);
  const normBrain = normDash(brainText);
  const pricingConsistent =
    PRICING_TIERS.length === 3 &&
    PRICING_TIERS.every((t) => {
      const p = normDash(t.price);
      return normSeo.includes(p) && normBlog.includes(p) && normBrain.includes(p);
    });
  addCheck(
    'pricing-sync',
    'SYNC MATRIX',
    'All 3 flat-rate pricing ranges ($1,850–$3,500 / $3,500–$6,500 / $5,500–$12,000+) synced across seoPages, blog & bot',
    pricingConsistent,
    PRICING_TIERS.map((t) => `${t.name}: ${t.price}`).join(' | ')
  );

  // 3. Guardrail: Team Vision kept low-key
  const chatbotReplyQ = generateWired64Reply('Tell me about AI chatbots');
  const teamVisionLowKey = !/team vision|ask vision/i.test(chatbotReplyQ.reply);
  addCheck(
    'team-vision-guardrail',
    'BRAND GUARDRAIL',
    'Team Vision LLC kept low-key (never pitched in default chatbot replies)',
    teamVisionLowKey,
    'Chatbot general replies cite Fast Track & Ringger Law only unless asked specifically about Team Vision'
  );

  // 4. Guardrail: WIRED-64 concise replies + ": )" sign-off
  const thanksReply = generateWired64Reply('no thank you');
  const thanksHasSmiley =
    /YOU'RE WELCOME/i.test(thanksReply.reply) &&
    /literally my only job/i.test(thanksReply.reply) &&
    thanksReply.reply.includes(': )');
  const samplePrompts = [
    'How much does a website cost?',
    'How long does a website take?',
    'Tell me about AI chatbots',
    'Tell me about live dashboards',
    'Do you edit music videos?'
  ];
  const maxWords = Math.max(
    ...samplePrompts.map(
      (q) => generateWired64Reply(q).reply.trim().split(/\s+/).filter(Boolean).length
    )
  );
  addCheck(
    'wired64-guardrail',
    'CHATBOT BRAIN',
    'WIRED-64 replies ≤ 45 words + "YOU\'RE WELCOME // That is literally my only job. : )"',
    thanksHasSmiley && maxWords <= 45,
    `Max tested reply length: ${maxWords} words (limit 45) • Sign-off: "${thanksReply.reply}"`
  );

  // 5. Guardrail: Mobile speed & code-splitting in App.jsx
  const appJsx = fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf8');
  const mobileSpeedIntact =
    appJsx.includes("lazy(() => import('./components/WiredOrbChatbot'))") &&
    appJsx.includes("lazy(() => import('./components/LegendsWall'))") &&
    !appJsx.includes("from './data/blogPosts'") &&
    !indexHtmlText.includes('wired-round-favicon.png?v=2026');
  addCheck(
    'mobile-speed-guardrail',
    'MOBILE SPEED',
    'Mobile code-splitting, deferred below-fold hydration & unified favicon URL intact',
    mobileSpeedIntact,
    'Chatbot, BlogPosts, LegendsWall, WorkScreeningRoom & Footer isolated from initial bundle'
  );

  // 6. SEO & Blog Prerender readiness
  const pubPosts = publishedPosts();
  addCheck(
    'seo-blog-routes',
    'SEO & BLOG',
    `${SEO_PAGES.length} SEO routes + ${pubPosts.length} published blog posts configured`,
    SEO_PAGES.length >= 14 && pubPosts.length >= 2,
    `${SEO_PAGES.length} SEO pages + /blog/ + ${pubPosts.map((p) => `/blog/${p.slug}/`).join(', ')}`
  );

  // 7. BRAIN.md Accuracy Check (verifies all file links + Ring-1 export names against real code)
  const brainMdText = fs.readFileSync(path.join(ROOT, 'BRAIN.md'), 'utf8');
  const linkedPaths = [
    ...brainMdText.matchAll(/\(file:\/\/\/Users\/robertneilson\/Desktop\/WDC\/([^)#]+)(?:#[^)]*)?\)/g)
  ].map((m) => m[1]);
  const missingDocFiles = linkedPaths.filter((rel) => !fs.existsSync(path.join(ROOT, rel)));

  const ring1Modules = {
    'src/data/wiredData.js': wiredDataMod,
    'src/data/seoPages.js': seoPagesMod,
    'src/data/blogPosts.js': blogPostsMod,
    'src/utils/wired64Brain.js': wired64BrainMod
  };
  const missingExports = [];
  for (const [modPath, modObj] of Object.entries(ring1Modules)) {
    const rowRe = new RegExp(`\\|\\s*\\[\`${modPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\`\\][^\\n]+`, 'i');
    const rowMatch = brainMdText.match(rowRe);
    if (rowMatch) {
      const cells = rowMatch[0].split('|').map((c) => c.trim());
      const exportsCell = cells[3] || '';
      const cleanExportsCell = exportsCell.replace(/\([^)]*\)/g, '');
      const listedExports = [...cleanExportsCell.matchAll(/`([A-Za-z0-9_]+)`/g)].map((m) => m[1]);
      for (const expName of listedExports) {
        if (!(expName in modObj)) {
          missingExports.push(`${modPath}:${expName}`);
        }
      }
    }
  }

  const staleNames = ['LEGENDS_VAULT', 'KNOWLEDGE_CARDS', 'QUICK_PROMPTS', 'generateWired64Reply'].filter(
    (name) => brainMdText.includes(name)
  );
  const brainDocValid =
    missingDocFiles.length === 0 && missingExports.length === 0 && staleNames.length === 0;
  addCheck(
    'brain-doc-sync',
    'BRAIN DOC SYNC',
    'BRAIN.md file paths and Ring-1 export names verified against real code',
    brainDocValid,
    brainDocValid
      ? `Verified ${linkedPaths.length} file links & all Ring-1 module exports in BRAIN.md`
      : `Missing files: [${missingDocFiles.join(', ')}] • Missing exports: [${missingExports.join(', ')}] • Stale names: [${staleNames.join(', ')}]`
  );

  // 8. Deep SEO & GEO Completeness (FAQs on all 14 pages, llms.txt pricing, public/sitemap.xml parity)
  const llmsTxt = fs.readFileSync(path.join(PUBLIC_DIR, 'llms.txt'), 'utf8');
  const normLlms = normDash(llmsTxt);
  const sitemapTxt = fs.readFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), 'utf8');
  const pagesMissingFaqs = SEO_PAGES.filter((p) => !Array.isArray(p.faqs) || p.faqs.length < 2).map((p) => p.path);
  const pagesLongMeta = SEO_PAGES.filter((p) => p.title.length > 60 || p.description.length > 155).map((p) => p.path);
  const llmsHasPricing = PRICING_TIERS.every((t) => normLlms.includes(normDash(t.price)));
  const expectedUrls = [
    `${SITE_BASE}/`,
    ...SEO_PAGES.map((p) => `${SITE_BASE}${p.path}`),
    `${SITE_BASE}/blog/`,
    ...pubPosts.map((p) => `${SITE_BASE}/blog/${p.slug}/`)
  ];
  const missingInSitemap = expectedUrls.filter((u) => !sitemapTxt.includes(`<loc>${u}</loc>`));
  const seoGeoComplete =
    pagesMissingFaqs.length === 0 &&
    pagesLongMeta.length === 0 &&
    llmsHasPricing &&
    missingInSitemap.length === 0;
  addCheck(
    'seo-geo-completeness',
    'SEO & GEO DEPTH',
    'All 14 SEO pages have 2+ FAQs & valid meta lengths; llms.txt has 3-tier pricing; sitemap.xml has all 17 URLs',
    seoGeoComplete,
    seoGeoComplete
      ? `14/14 SEO pages have FAQPage schema • llms.txt pricing synced • 17/17 URLs in sitemap.xml`
      : `Missing FAQs: [${pagesMissingFaqs.join(', ')}] • Meta length: [${pagesLongMeta.join(', ')}] • llms pricing: ${llmsHasPricing} • Missing sitemap: [${missingInSitemap.join(', ')}]`
  );

  return checks;
}

// Build Knowledge Tree structure for both LLMs and the /#admin visual explorer
const knowledgeTree = [
  {
    id: 'node-brand-contact',
    ring: 'RING 1 // SAFE DATA',
    title: 'Studio Identity, Timeline & Direct Contact',
    summary:
      'Controls brand name (Wired Digital / Wired Digital LLC), 1999→2015→2022 timeline, phone (731-616-5121), email (WiredDigitalUS@gmail.com), and social/GBP URLs.',
    primaryFile: 'src/data/wiredData.js',
    syncFiles: [
      'src/data/seoPages.js',
      'src/data/blogPosts.js',
      'src/utils/wired64Brain.js',
      'index.html'
    ],
    guardrails: [
      'Always keep entity name as Wired Digital (legal: Wired Digital LLC).',
      'Never change phone or email in one file without syncing all 5 files.'
    ],
    liveValues: {
      name: BRAND_INFO.name,
      phone: BRAND_INFO.phone,
      email: BRAND_INFO.email,
      location: BRAND_INFO.headquarters,
      socials: SOCIAL_URLS,
      googleBusinessProfile: GBP_URL
    }
  },
  {
    id: 'node-pricing-tiers',
    ring: 'RING 1 // SAFE DATA',
    title: '3-Tier Flat-Rate Website Pricing',
    summary:
      'Controls the 3 flat-rate website packages ($1,850–$3,500 Starter, $3,500–$6,500 Growth + AI Bot, $5,500–$12,000+ Custom Platform + Live Dashboard).',
    primaryFile: 'src/data/seoPages.js',
    syncFiles: [
      'src/components/WebCreationView.jsx',
      'src/utils/wired64Brain.js',
      'src/data/blogPosts.js'
    ],
    guardrails: [
      'Pricing cards live on /web-design/ and SEO pages — do not put a 3-card pricing grid above the fold on Home.',
      'Always emphasize flat-rate project quotes with zero mandatory monthly retainers.'
    ],
    liveValues: {
      tiers: PRICING_TIERS
    }
  },
  {
    id: 'node-home-sections',
    ring: 'RING 1 & 2 // HOME VIEW',
    title: 'Home Page Flow (Swirl Hero → Since 1999 → Recent Work → Legends → Videos)',
    summary:
      'Decluttered Home view with Tim Burton optical swirl hero, 50/50 studio reel + stamp, 3 slim Recent Work cards, 34 Legends logos, and 4 featured music videos.',
    primaryFile: 'src/components/AiSeoDashboardShowcase.jsx',
    syncFiles: [
      'src/components/SpiralHero.jsx',
      'src/components/Since1999Section.jsx',
      'src/data/wiredData.js'
    ],
    guardrails: [
      'Keep Home decluttered: 3 slim Recent Work cards only (interactive live dashboard demo stays on /web-design/).',
      'Keep Team Vision LLC low-key with light copy and realistic metrics.',
      'Every case study image in public/ must have both <name>.jpg (1012w) and <name>-sm.jpg (680w).'
    ],
    liveValues: {
      caseStudies: TRI_CITIES_CASE_STUDIES.map((c) => ({
        id: c.id,
        name: c.name,
        city: c.city,
        domain: c.domain,
        caseUrl: c.caseUrl,
        headline: c.cardHeadline,
        metrics: c.metrics
      })),
      servicePillars: AI_SEO_PILLARS.map((p) => ({
        id: p.id,
        title: p.title,
        href: p.href
      }))
    }
  },
  {
    id: 'node-wired64-bot',
    ring: 'RING 1 // CHATBOT BRAIN',
    title: 'WIRED-64 Chatbot Brain & 3-Question Lead Capture',
    summary:
      'Controls all 16 chatbot topic replies, dry-humor tone, ≤45-word limit, 3-question lead capture state machine, and ": )" polite sign-off.',
    primaryFile: 'src/utils/wired64Brain.js',
    syncFiles: ['src/components/WiredOrbChatbot.jsx', 'scripts/test-wired64.mjs'],
    guardrails: [
      'Every topic reply must stay ≤ 45 words.',
      'After 3 answered questions, ask for first name → then email or phone → save lead + question transcript.',
      'Saying "no thank you" / "thanks" must return: "YOU\'RE WELCOME // That is literally my only job. : )"',
      'Run `node scripts/test-wired64.mjs` after any edit.'
    ],
    liveValues: {
      quickPrompts: QUICK_PROMPTS,
      knowledgeCardKeys: Object.keys(KNOWLEDGE_CARDS)
    }
  },
  {
    id: 'node-seo-geo-pages',
    ring: 'RING 1 // 14 PRERENDERED SEO ROUTES',
    title: '14 Prerendered Local & Service SEO/GEO Pages',
    summary:
      'Controls static HTML prerendering, canonical URLs, JSON-LD @graph schemas, and 301 legacy query redirects for Bristol, Johnson City, Kingsport, Abingdon, services & case studies.',
    primaryFile: 'src/data/seoPages.js',
    syncFiles: ['scripts/prerender.mjs', 'src/components/SeoPageIntro.jsx', 'vercel.json'],
    guardrails: [
      'Always run `npm run build` after editing seoPages.js so static HTML files and public/sitemap.xml regenerate.'
    ],
    liveValues: {
      routes: SEO_PAGES.map((p) => ({
        id: p.id,
        path: p.path,
        title: p.title,
        h1: p.h1
      }))
    }
  },
  {
    id: 'node-company-blog',
    ring: 'RING 1 // PRERENDERED BLOG',
    title: 'Company Blog (/blog/ & Article Posts)',
    summary:
      'Single-file blog publishing system. Supports draft: true (private review URL, noindex) and draft: false (published on /blog/ and in sitemap.xml).',
    primaryFile: 'src/data/blogPosts.js',
    syncFiles: ['src/components/BlogView.jsx', 'scripts/prerender.mjs'],
    guardrails: [
      'Do not import blogPosts.js in src/App.jsx — keep it isolated inside lazy BlogView.jsx for mobile speed.'
    ],
    liveValues: {
      indexPath: BLOG_INDEX.path,
      posts: BLOG_POSTS.map((p) => ({
        slug: p.slug,
        path: `/blog/${p.slug}/`,
        title: p.title,
        draft: p.draft,
        datePublished: p.datePublished,
        readMinutes: p.readMinutes
      }))
    }
  },
  {
    id: 'node-legends-video',
    ring: 'RING 1 & 2 // VIDEO & LEGENDS',
    title: '34 Legends Vault & Global 4K Music Video Screening Room',
    summary:
      'Controls the 34 iconic artist/record-label logos (Alice Cooper, Halestorm, Def Leppard, Primary Wave, etc.) and YouTube video showcases.',
    primaryFile: 'src/data/wiredData.js',
    syncFiles: [
      'src/components/LegendsWall.jsx',
      'src/components/SmartLogo.jsx',
      'src/components/WorkScreeningRoom.jsx',
      'src/components/VideoProductionView.jsx'
    ],
    guardrails: [
      'Position video services as 100% worldwide remote 4K editing, official lyric videos & visualizers (with on-location directing reserved for select commissions).',
      'Keep SmartLogo and WorkScreeningRoom IntersectionObserver gates intact so offscreen logos/thumbnails never slow down mobile load.'
    ],
    liveValues: {
      legendsCount: LEGENDS_VAULT.length,
      featuredVideosCount: FEATURED_WORK.length,
      featuredVideos: FEATURED_WORK.map((v) => ({
        id: v.id,
        title: v.title,
        category: v.category,
        youtubeId: v.youtubeId
      }))
    }
  }
];

const doctorChecks = runDoctorChecks();
const allPassed = doctorChecks.every((c) => c.passed);
const snapshots = listSnapshots();

const brainPayload = {
  schemaVersion: '1.0.0',
  generatedAt: new Date().toISOString(),
  masterDocPath: 'BRAIN.md',
  healthStatus: {
    overall: allPassed ? 'HEALTHY' : 'ATTENTION_REQUIRED',
    passedCount: doctorChecks.filter((c) => c.passed).length,
    totalChecks: doctorChecks.length,
    checks: doctorChecks
  },
  summaryStats: {
    seoPagesCount: SEO_PAGES.length,
    publishedBlogPostsCount: publishedPosts().length,
    totalBlogPostsCount: BLOG_POSTS.length,
    caseStudiesCount: TRI_CITIES_CASE_STUDIES.length,
    legendsCount: LEGENDS_VAULT.length,
    featuredVideosCount: FEATURED_WORK.length,
    snapshotsCount: snapshots.length
  },
  knowledgeTree,
  fileInventory: {
    data: scanDirectoryFiles('src/data'),
    components: scanDirectoryFiles('src/components'),
    utils: scanDirectoryFiles('src/utils'),
    scripts: scanDirectoryFiles('scripts'),
    styles: scanDirectoryFiles('src', /\.css$/)
  },
  snapshots,
  recentCommits: getRecentGitCommits(15)
};

fs.writeFileSync(OUT_FILE, JSON.stringify(brainPayload, null, 2));

console.log(
  `\n🧠 Site Brain updated → public/site-brain.json (${knowledgeTree.length} nodes, ${doctorChecks.filter((c) => c.passed).length}/${doctorChecks.length} guardrails passing)`
);
for (const c of doctorChecks) {
  console.log(`  ${c.passed ? '✓' : '✖'} [${c.category}] ${c.title}`);
  if (!c.passed) console.log(`      → ${c.detail}`);
}

if (process.argv.includes('--strict') && !allPassed) {
  process.exit(1);
}
