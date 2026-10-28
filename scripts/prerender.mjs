// ============================================================================
// Build-time prerender for Google + AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, OAI-SearchBot) that do not execute JavaScript.
//
// For every page in src/data/seoPages.js this writes dist/<path>/index.html
// with its own <title>, meta description, canonical, Open Graph tags,
// page-level JSON-LD and the full readable page copy inside #root.
// React replaces #root on load, so the live design is unchanged.
// Also regenerates dist/sitemap.xml from the same data.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SEO_PAGES,
  SITE_BASE,
  BUSINESS_FACTS,
  canonicalFor
} from '../src/data/seoPages.js';
import {
  BLOG_POSTS,
  BLOG_INDEX,
  BLOG_AUTHOR,
  blogPostPath,
  publishedPosts,
  renderBlogIndexHtml,
  renderBlogPostHtml
} from '../src/data/blogPosts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST, 'index.html');

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const ORG_ID = `${SITE_BASE}/#organization`;
const WEBSITE_ID = `${SITE_BASE}/#website`;

function setTag(html, regex, replacement, label, pageId) {
  if (!regex.test(html)) {
    console.warn(`  ⚠ [${pageId}] could not find ${label} in template`);
    return html;
  }
  return html.replace(regex, replacement);
}

function buildPageJsonLd(page) {
  const url = canonicalFor(page);
  const home = SEO_PAGES.find((p) => p.id === 'root');
  const graph = [];

  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: home.breadcrumb, item: canonicalFor(home) }
  ];
  if (page.id !== 'root') {
    if (page.kind === 'case') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Work',
        item: `${SITE_BASE}/#case-studies`
      });
    }
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: page.breadcrumb,
      item: url
    });
  }

  graph.push({
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    breadcrumb: { '@id': `${url}#breadcrumbs` }
  });

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumbs`,
    itemListElement: breadcrumbItems
  });

  if (page.kind === 'service' || page.kind === 'city') {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: page.h1,
      description: page.description,
      serviceType: page.serviceType || 'Website design',
      url,
      provider: { '@id': ORG_ID },
      areaServed: page.cityName
        ? { '@type': 'City', name: page.breadcrumb }
        : { '@type': 'AdministrativeArea', name: 'Tri-Cities TN/VA' }
    });
  }

  if (page.kind === 'case') {
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${url}#case-study`,
      name: page.h1,
      description: page.description,
      url,
      image: page.image ? `${SITE_BASE}${page.image}` : undefined,
      creator: { '@id': ORG_ID },
      about: {
        '@type': 'Organization',
        name: page.clientName,
        url: page.clientUrl
      }
    });
  }

  if (page.faqs && page.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function buildStaticBody(page) {
  const deferred = page.showIntro ? '' : ' seo-static--deferred';
  const sections = page.sections
    .map(
      (s) => `
          <div class="seo-intro-block">
            <h2>${esc(s.h2)}</h2>
            ${(s.body || []).map((b) => `<p>${esc(b)}</p>`).join('\n            ')}
            ${
              s.bullets
                ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
                : ''
            }
          </div>`
    )
    .join('');

  const faqs = page.faqs.length
    ? `
        <div class="seo-intro-faqs">
          <h2>Common questions</h2>
          ${page.faqs
            .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
            .join('\n          ')}
        </div>`
    : '';

  const crumbs =
    page.id === 'root'
      ? ''
      : `<nav class="seo-intro-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › <span aria-current="page">${esc(
          page.breadcrumb
        )}</span></nav>`;

  const clientLink = page.clientUrl
    ? `<a class="btn-wired-outline" href="${esc(page.clientUrl)}" target="_blank" rel="noopener noreferrer">VISIT LIVE SITE</a>`
    : '';

  const siteNav = SEO_PAGES.filter((p) => p.id !== page.id)
    .map((p) => `<a href="${p.path}">${esc(p.breadcrumb)}</a>`)
    .join(' ');

  return `
    <section class="seo-page-intro seo-static${deferred}" aria-labelledby="seo-page-intro-h1">
      <div class="section-container">
        ${crumbs}
        <div class="seo-intro-card">
          <span class="seo-intro-eyebrow">${esc(page.eyebrow)}</span>
          <h1 id="seo-page-intro-h1" class="seo-intro-h1">${esc(page.h1)}</h1>
          ${page.intro.map((p) => `<p class="seo-intro-lead">${esc(p)}</p>`).join('\n          ')}
          <div class="seo-intro-actions">
            <a class="btn-wired-yellow" href="mailto:${BUSINESS_FACTS.email}">START A PROJECT</a>
            <a class="btn-wired-outline" href="${BUSINESS_FACTS.phoneHref}">CALL OR TEXT ${BUSINESS_FACTS.phone}</a>
            ${clientLink}
          </div>
          <div class="seo-intro-sections">${sections}
          </div>${faqs}
          <p class="seo-static-nav">${esc(BUSINESS_FACTS.name)} (${esc(
            BUSINESS_FACTS.legalName
          )}) • ${esc(BUSINESS_FACTS.hq)} • ${esc(BUSINESS_FACTS.email)} • ${esc(
            BUSINESS_FACTS.phone
          )}</p>
          <nav class="seo-static-nav" aria-label="Site pages">${siteNav}</nav>
        </div>
      </div>
    </section>`;
}

function renderDoc(template, doc) {
  const { id, url, title, description, ld, body, noindex, ogType, image } = doc;
  let html = template;

  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`, 'title', id);
  html = setTag(html, /(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`, 'meta description', id);
  html = setTag(html, /(<link\s+rel="canonical"[^>]*href=")[^"]*(")/, `$1${url}$2`, 'canonical', id);
  html = setTag(html, /(property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`, 'og:url', id);
  html = setTag(html, /(property="og:title"\s+content=")[^"]*(")/, `$1${esc(title)}$2`, 'og:title', id);
  html = setTag(html, /(property="og:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`, 'og:description', id);
  html = setTag(html, /(name="twitter:title"\s+content=")[^"]*(")/, `$1${esc(title)}$2`, 'twitter:title', id);
  html = setTag(html, /(name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`, 'twitter:description', id);
  if (ogType) {
    html = setTag(html, /(property="og:type"\s+content=")[^"]*(")/, `$1${ogType}$2`, 'og:type', id);
  }
  if (image) {
    const abs = `${SITE_BASE}${image}`;
    html = html
      .replace(/(property="og:image"\s+content=")[^"]*(")/, `$1${abs}$2`)
      .replace(/(property="og:image:secure_url"\s+content=")[^"]*(")/, `$1${abs}$2`)
      .replace(/(name="twitter:image"\s+content=")[^"]*(")/, `$1${abs}$2`);
  }
  if (noindex) {
    html = html
      .replace(/(<meta\s+name="robots"\s+content=")[^"]*(")/, '$1noindex, nofollow$2')
      .replace(/(<meta\s+name="googlebot"\s+content=")[^"]*(")/, '$1noindex, nofollow$2');
  }
  html = setTag(
    html,
    /(<script type="application\/ld\+json" id="ld-page">)[\s\S]*?(<\/script>)/,
    `$1\n${ld}\n    $2`,
    'ld-page JSON-LD',
    id
  );
  html = setTag(html, /<!--seo-static-->/, body, 'seo-static placeholder', id);
  return html;
}

function renderPage(template, page) {
  return renderDoc(template, {
    id: page.id,
    url: canonicalFor(page),
    title: page.title,
    description: page.description,
    ld: buildPageJsonLd(page),
    body: buildStaticBody(page),
    image: page.image
  });
}

// ------------------------------------------------------------------ BLOG
function blogBreadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item }))
  };
}

function buildBlogIndexJsonLd() {
  const url = `${SITE_BASE}${BLOG_INDEX.path}`;
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Blog',
          '@id': `${url}#blog`,
          url,
          name: BLOG_INDEX.h1,
          description: BLOG_INDEX.description,
          publisher: { '@id': ORG_ID },
          blogPost: publishedPosts().map((p) => ({
            '@type': 'BlogPosting',
            headline: p.h1,
            url: `${SITE_BASE}${blogPostPath(p)}`,
            datePublished: p.datePublished
          }))
        },
        blogBreadcrumb([
          ['Home', `${SITE_BASE}/`],
          ['Blog', url]
        ])
      ]
    },
    null,
    2
  );
}

function buildBlogPostJsonLd(post) {
  const url = `${SITE_BASE}${blogPostPath(post)}`;
  const graph = [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      mainEntityOfPage: url,
      headline: post.h1,
      description: post.description,
      image: `${SITE_BASE}${post.cover}`,
      datePublished: post.datePublished,
      dateModified: post.dateModified || post.datePublished,
      inLanguage: 'en-US',
      keywords: post.tags.join(', '),
      author: {
        '@type': 'Person',
        '@id': `${SITE_BASE}/#founder`,
        name: BLOG_AUTHOR.name,
        jobTitle: BLOG_AUTHOR.role,
        url: `${SITE_BASE}/`
      },
      publisher: { '@id': ORG_ID },
      isPartOf: { '@id': `${SITE_BASE}${BLOG_INDEX.path}#blog` }
    },
    blogBreadcrumb([
      ['Home', `${SITE_BASE}/`],
      ['Blog', `${SITE_BASE}${BLOG_INDEX.path}`],
      [post.h1, url]
    ])
  ];
  if (post.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: post.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

const wrapStatic = (inner) =>
  `\n    <section class="seo-page-intro blog-view seo-static"><div class="section-container">${inner}</div></section>`;

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const priority = { home: '1.0', service: '0.9', city: '0.9', case: '0.8' };
  const urls = SEO_PAGES.map(
    (p) => `  <url>
    <loc>${canonicalFor(p)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.kind === 'home' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${priority[p.kind] || '0.7'}</priority>${
      p.image
        ? `
    <image:image><image:loc>${SITE_BASE}${p.image}</image:loc></image:image>`
        : ''
    }
  </url>`
  ).join('\n');
  const posts = publishedPosts();
  const blogUrls = posts.length
    ? [
        `  <url>\n    <loc>${SITE_BASE}${BLOG_INDEX.path}</loc>\n    <lastmod>${posts[0].dateModified || posts[0].datePublished}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
        ...posts.map(
          (p) =>
            `  <url>\n    <loc>${SITE_BASE}${blogPostPath(p)}</loc>\n    <lastmod>${p.dateModified || p.datePublished}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n    <image:image><image:loc>${SITE_BASE}${p.cover}</image:loc></image:image>\n  </url>`
        )
      ].join('\n')
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}${blogUrls ? `\n${blogUrls}` : ''}
</urlset>
`;
}

function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('✖ dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  console.log(`\nPrerendering ${SEO_PAGES.length} SEO pages…`);

  for (const page of SEO_PAGES) {
    if (page.title.length > 60) console.warn(`  ⚠ [${page.id}] title ${page.title.length} chars`);
    if (page.description.length > 155)
      console.warn(`  ⚠ [${page.id}] description ${page.description.length} chars`);

    const html = renderPage(template, page);
    const outDir = page.path === '/' ? DIST : path.join(DIST, page.path);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);

    const words = buildStaticBody(page)
      .replace(/<[^>]+>/g, ' ')
      .split(/\s+/)
      .filter(Boolean).length;
    console.log(`  ✓ ${page.path.padEnd(32)} ${String(words).padStart(4)} words`);
  }

  // Blog index + posts
  const hasPublished = publishedPosts().length > 0;
  const blogDocs = [
    {
      id: 'blog-index',
      path: BLOG_INDEX.path,
      url: `${SITE_BASE}${BLOG_INDEX.path}`,
      title: BLOG_INDEX.title,
      description: BLOG_INDEX.description,
      ld: buildBlogIndexJsonLd(),
      body: wrapStatic(renderBlogIndexHtml()),
      noindex: !hasPublished
    },
    ...BLOG_POSTS.map((post) => ({
      id: post.slug,
      path: blogPostPath(post),
      url: `${SITE_BASE}${blogPostPath(post)}`,
      title: post.title,
      description: post.description,
      ld: buildBlogPostJsonLd(post),
      body: wrapStatic(renderBlogPostHtml(post)),
      noindex: Boolean(post.draft),
      ogType: 'article',
      image: post.cover
    }))
  ];
  for (const doc of blogDocs) {
    if (doc.title.length > 60) console.warn(`  ⚠ [${doc.id}] title ${doc.title.length} chars`);
    if (doc.description.length > 155) console.warn(`  ⚠ [${doc.id}] description ${doc.description.length} chars`);
    const outDir = path.join(DIST, doc.path);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), renderDoc(template, doc));
    const words = doc.body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log(`  ✓ ${doc.path.padEnd(32)} ${String(words).padStart(4)} words${doc.noindex ? '  (noindex draft)' : ''}`);
  }

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap());
  console.log('  ✓ /sitemap.xml regenerated\n');
}

if (process.argv.includes('--sitemap-only')) {
  process.stdout.write(buildSitemap());
} else {
  main();
}
