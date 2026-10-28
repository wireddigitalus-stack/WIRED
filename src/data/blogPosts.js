// ============================================================================
// WIRED DIGITAL BLOG — single source of truth for blog posts.
// Used by the React BlogView AND scripts/prerender.mjs (static HTML for
// Google + AI crawlers). Keep free of JSX / browser APIs.
//
// draft: true  → page is built at its URL for review, but is NOINDEX,
//                hidden from /blog/ and left out of sitemap.xml.
// draft: false → published: listed on /blog/, indexed, added to sitemap.
//
// Inline formatting inside text: **bold** and [link text](/path/)
// ============================================================================

export const BLOG_AUTHOR = {
  name: 'Rob Neilson',
  role: 'Founder & Creative Director, Wired Digital',
  bio: 'Rob has been building websites since 1999, has worked full-time in the music industry since 2015, and runs Wired Digital from Bristol, VA/TN. He designs and codes every site, dashboard and AI chatbot the studio ships.',
  image: '/wired-round-favicon.png'
};

export const BLOG_INDEX = {
  path: '/blog/',
  title: 'Blog: Websites, Local SEO & AI Search | Wired Digital',
  description:
    'Straight answers on website costs, local SEO, AI search and real client results from a Bristol, VA/TN web design studio. Written by Rob Neilson.',
  h1: 'The Wired Digital Blog',
  intro:
    'Plain-English answers about websites, local SEO, AI search and what actually brings in customers, with real numbers from real Tri-Cities projects.'
};

export const BLOG_POSTS = [
  // --------------------------------------------------------------------------
  {
    slug: 'website-cost-tri-cities',
    draft: true,
    title: 'How Much Does a Website Cost in the Tri-Cities? (2026)',
    description:
      'Real 2026 website pricing for Bristol, Johnson City, Kingsport and Abingdon businesses: what freelancers, agencies and custom studios charge, and why.',
    h1: 'How Much Does a Website Cost in the Tri-Cities? (2026 Pricing Guide)',
    datePublished: '2026-10-27',
    dateModified: '2026-10-27',
    readMinutes: 7,
    cover: '/wired-og-seal-2026.jpg',
    coverAlt: 'Wired Digital, Bristol VA/TN web design studio',
    tags: ['Pricing', 'Website Design', 'Tri-Cities'],
    related: ['view-web-design', 'city-bristol', 'city-johnson-city', 'city-kingsport'],
    blocks: [
      {
        type: 'p',
        text: 'It is the first question almost every business owner asks me, and it is the one most web designers avoid answering in public. So here is a straight answer for businesses in **Bristol, Johnson City, Kingsport and Abingdon**, based on what I quote and what I see other options charging around the region.'
      },
      {
        type: 'callout',
        text: '**Short answer:** most small and mid-size Tri-Cities businesses should expect to spend **$1,850 to $6,500** for a professionally built website. Simple template sites can cost less; custom software like live dashboards or AI tools costs more.'
      },
      { type: 'h2', text: 'Typical website prices in the Tri-Cities' },
      {
        type: 'p',
        text: 'These are typical ranges, not quotes. Every project is different, but this is the landscape a local business owner is shopping in:'
      },
      {
        type: 'table',
        head: ['Option', 'Typical price', 'What you usually get'],
        rows: [
          ['DIY builder (Wix, Squarespace)', '$200 – $600 / year', 'You build it yourself from a template. Monthly fees never stop.'],
          ['Freelancer', '$800 – $2,500', 'A template-based site, often WordPress. Quality varies a lot.'],
          ['Local agency', '$2,500 – $6,000+', 'A designed site, usually WordPress, often with a monthly retainer.'],
          ['Custom studio (like us)', '$1,850 – $6,500', 'Hand-built, fast site with local SEO and AI-search setup included.'],
          ['Custom software / dashboards', '$5,500 – $25,000+', 'Live admin dashboards, AI chatbots, booking or inventory systems.']
        ]
      },
      { type: 'h2', text: 'What actually drives the price' },
      {
        type: 'p',
        text: 'Two websites can look similar on a phone and be thousands of dollars apart. The difference is almost always in these five things:'
      },
      {
        type: 'ol',
        items: [
          '**Number of pages.** A 5-page site for a contractor is a different job than a 25-page site for a medical practice with a page for every service.',
          '**Custom design vs. template.** A template is cheaper up front. A custom design fits your brand and is usually much faster on phones.',
          '**Writing.** If you supply the words, it costs less. If the words need to be written and organized for Google, that is real work.',
          '**Features.** Quote forms, booking, online payments, an AI chatbot or a live admin dashboard each add cost, and each can pay for itself.',
          '**SEO setup.** Page titles, structured data, Google Business Profile alignment and AI-search setup take time. Cheap sites usually skip all of it.'
        ]
      },
      { type: 'h2', text: 'What we charge, and what is included' },
      {
        type: 'p',
        text: 'I publish my pricing because I think you should know the range before you ever pick up the phone. Every project is quoted flat-rate after a free consultation, with **no forced monthly retainer**.'
      },
      {
        type: 'ul',
        items: [
          '**Local Launch & Website Modernization: $1,850 – $3,500.** A custom, mobile-first site (or a rebuild of an outdated one) with local SEO and AI-search structure built in.',
          '**Growth Website + 24/7 AI Chatbot: $3,500 – $6,500.** A larger site plus an AI assistant trained on your business that answers questions and captures leads after hours.',
          '**Custom Platform + Live Admin Dashboard: $5,500 – $12,000+.** Everything above, plus a private dashboard that shows visitors, clicks, calls and leads in real time.'
        ]
      },
      {
        type: 'p',
        text: 'For a real example of that top tier, see how a [live dashboard worked for Fast Track Automotive in Bristol](/blog/fast-track-automotive-first-30-days/).'
      },
      { type: 'h2', text: 'The hidden costs to ask about' },
      {
        type: 'p',
        text: 'The build price is only part of the picture. Before you sign with anyone, ask about these:'
      },
      {
        type: 'ul',
        items: [
          '**Hosting.** Fast modern hosting for a small site is often very cheap. Be cautious of $50–$150 per month "hosting" that is really a retainer.',
          '**Plugin and theme renewals.** WordPress sites often depend on paid plugins that renew every year.',
          '**Who owns the site.** Make sure you own your domain and your code. Some builders and agencies make it hard to leave.',
          '**Updates.** Find out what small text and photo changes cost after launch.',
          '**Redesign cost.** A cheap site that needs replacing in two years is not cheap.'
        ]
      },
      { type: 'h2', text: 'Is a cheap website worth it?' },
      {
        type: 'p',
        text: 'Sometimes, yes. If you are just starting out and mostly need a phone number and hours online, a simple site is fine. But for most established businesses, the website is the first impression for nearly every new customer. A slow, outdated site quietly sends people to the competitor down the road, and you never find out it happened.'
      },
      {
        type: 'p',
        text: 'The right question is not "what is the cheapest website?" It is "what will bring in enough new customers to pay for itself?" For most Tri-Cities businesses I work with, one or two extra jobs a month covers the whole project within the first year.'
      },
      { type: 'h2', text: 'How to get an accurate quote' },
      {
        type: 'p',
        text: 'Have these ready and any designer can give you a real number instead of a guess:'
      },
      {
        type: 'ul',
        items: [
          'Your current website address, if you have one',
          'The services you want people to find you for',
          'The cities or areas you serve',
          'Features you know you need (quote form, booking, chatbot, payments)',
          'Your timeline'
        ]
      },
      {
        type: 'p',
        text: 'If you are in Bristol, Johnson City, Kingsport or Abingdon and want a straight quote, call or text me at **731-616-5121** or use the project form below. I will tell you honestly which tier you need, even if it is the smallest one.'
      }
    ],
    faqs: [
      {
        q: 'How much does a small business website cost in Bristol, TN?',
        a: 'Most small businesses in Bristol and the Tri-Cities spend between $1,850 and $6,500 for a professionally built website. Simple template sites cost less, and custom features like dashboards or AI chatbots cost more.'
      },
      {
        q: 'Do I have to pay a monthly fee for my website?',
        a: 'Not with Wired Digital. Projects are flat-rate with no forced retainer. You will still have small hosting and domain costs, and optional monthly SEO or marketing support is available.'
      },
      {
        q: 'How long does a website take to build?',
        a: 'Most custom websites launch in 2 to 4 weeks. Sites with a live admin dashboard or AI chatbot usually take 3 to 6 weeks.'
      }
    ]
  },

  // --------------------------------------------------------------------------
  {
    slug: 'fast-track-automotive-first-30-days',
    draft: true,
    title: 'Fast Track Automotive: 30 Days of Live Dashboard Data',
    description:
      'What a new dealership website and live admin dashboard showed in its first 30 days in Bristol, TN: 2,751+ visits, 1,719 vehicle clicks and 47 credit apps.',
    h1: 'Fast Track Automotive: What 30 Days of Live Dashboard Data Showed',
    datePublished: '2026-10-27',
    dateModified: '2026-10-27',
    readMinutes: 6,
    cover: '/fasttrack-admin-dash.jpg',
    coverAlt: 'Fast Track Automotive live admin dashboard built by Wired Digital',
    tags: ['Case Study', 'Dashboards', 'Automotive', 'Bristol TN'],
    related: ['case-fasttrack', 'view-custom-dashboards', 'city-bristol'],
    blocks: [
      {
        type: 'p',
        text: '[Fast Track Automotive](https://www.fasttrackbristoltn.com/) is a pre-owned dealership at 2528 Volunteer Parkway in Bristol, TN. Like most independent lots, they had a website that showed their inventory but told them almost nothing about what shoppers were actually doing on it.'
      },
      {
        type: 'p',
        text: 'We built them two things: a fast, mobile-first showroom website, and a private admin dashboard that shows live shopper activity. Here is what the first 30 days of data looked like, and what it taught us.'
      },
      { type: 'h2', text: 'The numbers from the first 30 days' },
      {
        type: 'table',
        head: ['Metric', 'First 30 days'],
        rows: [
          ['Tracked visits', '2,751+'],
          ['Visitor actions (clicks, taps, form steps)', '4,591'],
          ['Vehicle clicks', '1,719'],
          ['Financing clicks', '164'],
          ['Online credit applications', '47'],
          ['Tracked phone calls from the site', '15'],
          ['Shoppers on mobile', 'About 70%']
        ]
      },
      {
        type: 'callout',
        text: '**47 credit applications in 30 days** means 47 people who were serious enough to hand over their information, and the dealership saw each one the moment it came in.'
      },
      { type: 'h2', text: 'What the dashboard shows the owner' },
      {
        type: 'p',
        text: 'The dashboard is not a generic analytics report. It is built around the questions a dealer actually asks:'
      },
      {
        type: 'ul',
        items: [
          '**Live click stream.** Every vehicle view, phone tap and credit-app step as it happens, with a sound alert for new leads.',
          '**Hottest vehicles on the lot.** A live ranking of the units shoppers click most, across 39 vehicles in inventory.',
          '**Hourly traffic.** When shoppers are actually browsing, so staffing and follow-up can match.',
          '**Lead tracking.** Calls, credit applications, QR window-flyer scans and even fuel-calculator use, all in one place.',
          '**CSV export.** One click to hand lead data to the sales team.'
        ]
      },
      { type: 'h2', text: 'Three things the data taught us' },
      { type: 'h3', text: '1. Phones are the showroom' },
      {
        type: 'p',
        text: 'About 70% of shoppers browsed on a phone. That is why the site was designed mobile-first, with big tap targets, fast-loading photos and the call button always within reach. A desktop-first dealer site loses most of its audience before the first photo loads.'
      },
      { type: 'h3', text: '2. The most-clicked vehicles are not always the ones you expect' },
      {
        type: 'p',
        text: 'The live ranking put a Jeep Wrangler Unlimited at the top and an F-150 XLT right behind it. Seeing real demand helps decide which vehicles to feature, which to price aggressively and which to put on social media.'
      },
      { type: 'h3', text: '3. Speed of follow-up matters more than volume' },
      {
        type: 'p',
        text: 'A credit application is most valuable in the first few minutes. Instant alerts mean the team can call while the shopper is still on the site, instead of finding the lead in an inbox hours later.'
      },
      { type: 'h2', text: 'Why a custom dashboard instead of off-the-shelf tools' },
      {
        type: 'p',
        text: 'General analytics tools are built for marketers, not car dealers. They report sessions and bounce rates. A custom dashboard reports the things that sell cars: which vehicles, which shoppers, which leads and how fast. There are also no per-seat software fees, because the dashboard belongs to the dealership.'
      },
      { type: 'h2', text: 'Could this work for your business?' },
      {
        type: 'p',
        text: 'The same approach works anywhere customers browse before they buy: other dealerships, equipment rentals, real estate, contractors with project galleries, or any business with a catalog of products or services. The dashboard is built around whatever your "inventory" is.'
      },
      {
        type: 'p',
        text: 'Projects with a custom live dashboard typically run **$5,500 to $12,000+**. You can see the full breakdown in [how much a website costs in the Tri-Cities](/blog/website-cost-tri-cities/), or read more about [custom dashboards](/custom-dashboards/).'
      }
    ],
    faqs: [
      {
        q: 'What does a dealership admin dashboard track?',
        a: 'The Fast Track dashboard tracks live visitor activity, vehicle clicks, financing clicks, credit applications, phone calls, QR flyer scans and hourly traffic, and ranks the most-viewed vehicles on the lot.'
      },
      {
        q: 'Does a custom dashboard have monthly software fees?',
        a: 'There are no per-seat software fees. The dashboard is built for and owned by the business; ongoing hosting and database costs are usually small.'
      }
    ]
  }
];

// ---------------------------------------------------------------- helpers
export const blogPostPath = (post) => `/blog/${post.slug}/`;

export const publishedPosts = () =>
  BLOG_POSTS.filter((p) => !p.draft).sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );

export const findPostBySlug = (slug) => BLOG_POSTS.find((p) => p.slug === slug) || null;

export function parseBlogPath(pathname = '') {
  const m = String(pathname).match(/^\/blog(?:\/([a-z0-9-]+))?\/?$/i);
  if (!m) return null;
  return { slug: m[1] || null };
}

const escHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Escapes text, then converts **bold** and [text](url) to HTML. */
export function renderInline(text = '') {
  return escHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const external = /^https?:\/\//i.test(href);
      return `<a href="${href}"${
        external ? ' target="_blank" rel="noopener noreferrer"' : ''
      }>${label}</a>`;
    });
}

export const stripInline = (text = '') =>
  String(text)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

/** Renders a post's blocks to an HTML string (shared by React + prerender). */
export function renderBlocksHtml(blocks = []) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'h2':
          return `<h2>${escHtml(b.text)}</h2>`;
        case 'h3':
          return `<h3>${escHtml(b.text)}</h3>`;
        case 'p':
          return `<p>${renderInline(b.text)}</p>`;
        case 'callout':
          return `<div class="blog-callout"><p>${renderInline(b.text)}</p></div>`;
        case 'ul':
          return `<ul>${b.items.map((i) => `<li>${renderInline(i)}</li>`).join('')}</ul>`;
        case 'ol':
          return `<ol>${b.items.map((i) => `<li>${renderInline(i)}</li>`).join('')}</ol>`;
        case 'table':
          return `<div class="blog-table-wrap"><table><thead><tr>${b.head
            .map((h) => `<th>${escHtml(h)}</th>`)
            .join('')}</tr></thead><tbody>${b.rows
            .map((r) => `<tr>${r.map((c) => `<td>${renderInline(c)}</td>`).join('')}</tr>`)
            .join('')}</tbody></table></div>`;
        default:
          return '';
      }
    })
    .join('\n');
}

export function formatPostDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[m - 1]} ${d}, ${y}`;
}

// ------------------------------------------------------- full page markup
// One renderer for both the React BlogView and the static prerender, so the
// HTML crawlers read is identical to what visitors see.
import { getSeoPageById } from './seoPages.js';

const PHONE = '731-616-5121';
const PHONE_HREF = 'tel:+17316165121';

function postCardHtml(post) {
  return `
      <a class="blog-card" href="${blogPostPath(post)}">
        <img class="blog-card-img" src="${post.cover}" alt="${escHtml(post.coverAlt)}" loading="lazy" decoding="async" />
        <div class="blog-card-body">
          <span class="blog-meta">${formatPostDate(post.datePublished)} • ${post.readMinutes} min read</span>
          <h2 class="blog-card-title">${escHtml(post.h1)}</h2>
          <p>${escHtml(post.description)}</p>
          <span class="blog-card-more">Read the post →</span>
        </div>
      </a>`;
}

export function renderBlogIndexHtml() {
  const posts = publishedPosts();
  const list = posts.length
    ? `<div class="blog-grid">${posts.map(postCardHtml).join('')}</div>`
    : `<p class="blog-empty">New posts are on the way. In the meantime, call or text Rob at <a href="${PHONE_HREF}">${PHONE}</a>.</p>`;
  return `
  <div class="blog-shell">
    <nav class="seo-intro-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › <span aria-current="page">Blog</span></nav>
    <header class="blog-index-head">
      <span class="seo-intro-eyebrow">Wired Digital • Bristol, VA/TN</span>
      <h1 class="seo-intro-h1">${escHtml(BLOG_INDEX.h1)}</h1>
      <p class="seo-intro-lead">${escHtml(BLOG_INDEX.intro)}</p>
    </header>
    ${list}
  </div>`;
}

export function renderBlogPostHtml(post) {
  const related = (post.related || [])
    .map((id) => getSeoPageById(id))
    .filter(Boolean)
    .map((p) => `<li><a href="${p.path}">${escHtml(p.h1)}</a></li>`)
    .join('');
  const faqs = (post.faqs || []).length
    ? `
      <section class="seo-intro-faqs blog-faqs">
        <h2>Common questions</h2>
        ${post.faqs.map((f) => `<details><summary>${escHtml(f.q)}</summary><p>${escHtml(f.a)}</p></details>`).join('\n        ')}
      </section>`
    : '';
  const draftBanner = post.draft
    ? `<div class="blog-draft-banner">DRAFT FOR REVIEW: not listed on the blog and hidden from Google until published.</div>`
    : '';
  const updated =
    post.dateModified && post.dateModified !== post.datePublished
      ? ` • Updated ${formatPostDate(post.dateModified)}`
      : '';

  return `
  <article class="blog-shell blog-article">
    ${draftBanner}
    <nav class="seo-intro-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/blog/">Blog</a> › <span aria-current="page">${escHtml(post.tags[0] || 'Post')}</span></nav>
    <header class="blog-post-head">
      <div class="blog-tags">${post.tags.map((t) => `<span class="seo-intro-eyebrow">${escHtml(t)}</span>`).join('')}</div>
      <h1 class="seo-intro-h1">${escHtml(post.h1)}</h1>
      <p class="blog-meta">By <strong>${escHtml(BLOG_AUTHOR.name)}</strong> • ${formatPostDate(post.datePublished)}${updated} • ${post.readMinutes} min read</p>
    </header>
    <img class="blog-cover" src="${post.cover}" alt="${escHtml(post.coverAlt)}" decoding="async" />
    <div class="blog-body">
      ${renderBlocksHtml(post.blocks)}
    </div>
    ${faqs}
    <aside class="blog-author">
      <img src="${BLOG_AUTHOR.image}" alt="${escHtml(BLOG_AUTHOR.name)}" width="56" height="56" loading="lazy" />
      <div>
        <strong>${escHtml(BLOG_AUTHOR.name)}</strong>
        <span>${escHtml(BLOG_AUTHOR.role)}</span>
        <p>${escHtml(BLOG_AUTHOR.bio)}</p>
      </div>
    </aside>
    ${related ? `<nav class="blog-related" aria-label="Related pages"><h2>Related</h2><ul>${related}</ul></nav>` : ''}
    <div class="blog-cta">
      <p><strong>Have a project in mind?</strong> Get a straight answer and a flat-rate quote.</p>
      <div class="seo-intro-actions">
        <a class="btn-wired-yellow" href="#direct-contact-card">START A PROJECT</a>
        <a class="btn-wired-outline" href="${PHONE_HREF}">CALL OR TEXT ${PHONE}</a>
      </div>
    </div>
  </article>`;
}
