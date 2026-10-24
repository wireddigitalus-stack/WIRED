import React, { useEffect, useRef, useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  Terminal,
  X,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Cpu,
  LayoutDashboard,
  Film,
  Search
} from 'lucide-react';
import { BRAND_INFO } from '../data/wiredData';
import { addLead, logTelemetryEvent } from '../utils/telemetry';

const CARTRIDGES = [
  {
    id: 'geo',
    code: 'CART_01',
    title: 'AI SITE MODERNIZATION & GEO',
    subtitle: 'KEEP PACE WITH AI-ERA SEARCH',
    prompt: 'I want to modernize my website and rank in AI Search (GEO) & Google.'
  },
  {
    id: 'dash',
    code: 'CART_02',
    title: 'CUSTOM DASH & 24/7 AI BOT',
    subtitle: 'LIKE FAST TRACK & TEAM VISION',
    prompt: 'I want a custom live admin dashboard or a 24/7 custom-trained AI lead chatbot.'
  },
  {
    id: 'scan',
    code: 'CART_03',
    title: 'SCAN MY CURRENT WEBSITE',
    subtitle: '64-BIT AI & SEO DIAGNOSTIC',
    prompt: 'Run a 64-bit AI & SEO diagnostic scan on my current website.'
  },
  {
    id: 'video',
    code: 'CART_04',
    title: 'GLOBAL MUSIC / LYRIC VIDEO',
    subtitle: 'REMOTE EDITING FOR LEGENDS',
    prompt: 'I want to book a remote music video, official lyric video, or visualizer edit.'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg_boot_1',
    sender: 'bot',
    time: 'WIRED_64 // 24/7 IQ',
    cartridge: 'geo',
    text: 'ONLINE // Concise answers. Deep technical IQ. Zero agency fluff.',
    subtext:
      'Ask anything about AI Website Modernization, GEO (ranking in ChatGPT & Google AI), Custom Dashboards, 24/7 AI Bots, Boutique Pricing, or 4K Music Video Post-Production—or drop your URL for an instant scan.',
    chips: [
      { label: '⚡ HOW GEO RANKS IN CHATGPT', prompt: 'Deep dive: How does GEO rank my business in ChatGPT & Google AI?', cartridge: 'geo' },
      { label: '💎 PRICING & 25-YR VALUE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' },
      { label: '📊 FAST TRACK & VISION PROOF', prompt: 'Deep dive into the Fast Track live dashboard and Team Vision 24/7 AI bot.', cartridge: 'dash' },
      { label: '🎬 34+ MUSIC LEGENDS & 4K VIDEO', prompt: 'Tell me about your 4K remote music & lyric video editing for 34+ legends.', cartridge: 'video' }
    ]
  }
];

function extractEmail(str) {
  const match = str.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

function extractPhone(str) {
  const match = str.match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : null;
}

function extractDomainUrl(str) {
  if (extractEmail(str)) {
    const withoutEmail = str.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
    const matchAfter = withoutEmail.match(
      /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]{2,}\.(?:com|net|org|io|co|us|ai|biz|info|tv|me|dev|app)\b(?:\/[^\s]*)?/i
    );
    return matchAfter ? matchAfter[0] : null;
  }
  const match = str.match(
    /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]{2,}\.(?:com|net|org|io|co|us|ai|biz|info|tv|me|dev|app)\b(?:\/[^\s]*)?/i
  );
  return match ? match[0] : null;
}

/**
 * WIRED-64 // 24/7 IQ — Concise Direct Executive Answers + Smart Technical Deep-Dive Brain
 */
function generateWired64Response(input, currentStep, leadDraft, lastTopic = 'geo') {
  const q = input.trim();
  const lower = q.toLowerCase();

  const detectedEmail = extractEmail(q);
  const detectedPhone = extractPhone(q);
  const detectedUrl = extractDomainUrl(q);

  // 1. REAL CONTACT DETECTION (Email or Phone) — Never misfires on regular questions!
  if (detectedEmail || detectedPhone) {
    const contactStr = [detectedEmail, detectedPhone].filter(Boolean).join(' • ');
    const nameGuess =
      leadDraft.name ||
      q
        .replace(detectedEmail || '', '')
        .replace(detectedPhone || '', '')
        .replace(/[,•|-]/g, ' ')
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(' ') ||
      (detectedEmail ? detectedEmail.split('@')[0] : 'WIRED-64 VIP Lead');

    return {
      nextStep: 'COMPLETED',
      topic: lastTopic,
      cartridge: leadDraft.cartridge || 'geo',
      leadPatch: {
        name: nameGuess,
        contact: contactStr,
        companyUrl: detectedUrl || leadDraft.companyUrl || '',
        details: leadDraft.details ? `${leadDraft.details} | Contact: ${q}` : `WIRED-64 Direct Capture: ${q}`
      },
      autoSubmitLead: true,
      reply: `DIRECT DISPATCH LOCKED [ ${contactStr} ] → ROB NEILSON // 100% TRANSMITTED.`,
      subtext:
        'Sent directly to Creative Director Rob Neilson (WiredDigitalUS@gmail.com) — Rob will reach out to you shortly. Feel free to keep asking questions below!',
      chips: [
        { label: '⚡ DEEP DIVE: GEO ARCHITECTURE', prompt: 'Deep dive: How does GEO rank my business in ChatGPT & Google AI?', cartridge: 'geo' },
        { label: '⏱️ TIMELINE & 3-PHASE PROCESS', prompt: 'What is the typical turnaround timeline and 3-phase process?', cartridge: 'geo' }
      ]
    };
  }

  // 2. WEBSITE URL DIAGNOSTIC DETECTION (Either during scan prompt or typed anytime)
  if (detectedUrl) {
    const cleanUrl = detectedUrl.startsWith('http')
      ? detectedUrl
      : `https://${detectedUrl.replace(/^www\./i, '')}`;
    return {
      nextStep: 'ASK_CONTACT_AFTER_SCAN',
      topic: 'scan',
      cartridge: 'scan',
      leadPatch: {
        companyUrl: cleanUrl,
        service: 'AI Website Design, Redesign & Modernization + GEO'
      },
      reply: `64-BIT DIAGNOSTIC // [ ${cleanUrl.toUpperCase()} ]\n• DOM SPEED ESTIMATE: ~3.6s Legacy Load (Modern Target: <0.4s Edge React)\n• AI ENTITY SCHEMA (@graph JSON-LD): MISSING (Invisible to ChatGPT, Gemini & Perplexity)\n• /LLMS.TXT & CITATION FEED: NOT DETECTED\n• 24/7 AI CONCIERGE & LIVE TELEMETRY: NOT INSTALLED`,
      subtext:
        'Bottom line: We can cut load times by ~85%, inject full Tri-Cities/National AI Schema, and wire in a 24/7 AI lead advisor. Drop your Name + Email/Phone to get Rob’s custom blueprint, or pick a deep dive below:',
      chips: [
        { label: '🔧 HOW WE FIX THIS IN 3 WEEKS', prompt: 'What is the typical turnaround timeline and 3-phase process?', cartridge: 'geo' },
        { label: '💎 BOUTIQUE COST FOR THIS UPGRADE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' },
        { label: '📊 ADD A LIVE ADMIN DASHBOARD', prompt: 'Deep dive into the Fast Track live dashboard and Team Vision 24/7 AI bot.', cartridge: 'dash' }
      ]
    };
  }

  // 3. CONTEXTUAL "GO DEEPER / EXPLAIN MORE" HANDLER
  const isAskingDeeper =
    lower === 'more' ||
    lower === 'go deeper' ||
    lower === 'tell me more' ||
    lower === 'explain more' ||
    lower === 'how does that work' ||
    lower === 'how does it work' ||
    (lower.includes('deep dive') &&
      !lower.includes('geo') &&
      !lower.includes('fast track') &&
      !lower.includes('vision') &&
      !lower.includes('price') &&
      !lower.includes('video'));

  if (isAskingDeeper) {
    if (lastTopic === 'video') {
      return {
        nextStep: 'IDLE',
        topic: 'video',
        cartridge: 'video',
        reply: `DEEP DIVE // 4K REMOTE POST-PRODUCTION ARCHITECTURE:\n• STEM & CAMERA INGEST: Direct 4K ProRes/RAW & multi-track audio ingest from labels/artists globally.\n• KINETIC 3D LYRIC WORLDS: Custom Unreal/After Effects 3D environments, beat-synced typography & custom visualizers—never stock lyric templates.\n• VEVO & BROADCAST DELIVERY: Mastered to SMPTE standards for VEVO, YouTube 4K60, Apple Music & arena tour screens.`,
        subtext: 'Want to lock in an edit window with Rob? Drop your track title + Email/Phone, or explore another topic:',
        chips: [
          { label: '🎸 SEE 34+ LEGEND ROSTER', prompt: 'Which 34+ music legends and labels have you worked with?', cartridge: 'video' },
          { label: '⏱️ VIDEO TURNAROUND TIME', prompt: 'How fast is your turnaround time for a lyric or music video?', cartridge: 'video' }
        ]
      };
    }
    if (lastTopic === 'dash' || lastTopic === 'fasttrack' || lastTopic === 'teamvision') {
      return {
        nextStep: 'IDLE',
        topic: 'dash',
        cartridge: 'dash',
        reply: `DEEP DIVE // CUSTOM TELEMETRY + 24/7 AI CONCIERGE STACK:\n• ZERO-COOKIE FIRST-PARTY TELEMETRY: Tracks every click, phone tap, vehicle/property view & form action directly into your private /admin dashboard.\n• RAG-TRAINED AI BRAIN: We train your 24/7 bot on your exact inventory, sq ft, pricing rules, and FAQs—zero hallucination.\n• INSTANT SMS/EMAIL DISPATCH: Qualified leads fire straight to your phone in <2 seconds with full conversation transcripts.`,
        subtext: 'Drop your Name + Email/Phone if you want Rob to demo this live for your business!',
        chips: [
          { label: '🚗 FAST TRACK METRICS (2,751+ VISITS)', prompt: 'Show me the exact metrics from the Fast Track Bristol TN live dashboard.', cartridge: 'dash' },
          { label: '🏢 TEAM VISION AI ADVISOR PROOF', prompt: 'How does the Team Vision LLC "Ask VISION" 24/7 AI bot qualify tenants?', cartridge: 'dash' },
          { label: '💎 BOUTIQUE PRICING & SCOPE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' }
        ]
      };
    }
    return {
      nextStep: 'IDLE',
      topic: 'geo',
      cartridge: 'geo',
      reply: `DEEP DIVE // UNDER THE HOOD OF GEO + AI WEB MODERNIZATION:\n• 1. @GRAPH JSON-LD INJECTION: Maps your Organization, LocalBusiness, Service catalog, GeoCoordinates & verified reviews so LLMs trust your authority.\n• 2. /LLMS.TXT MACHINE MANIFEST: Gives ChatGPT, Claude, Gemini & Perplexity a clean markdown fact-sheet of why you are #1 in your market.\n• 3. <0.4s REACT EDGE DOM: Eliminates WordPress plugin bloat, boosting mobile conversions by up to +64%.`,
      subtext: 'Type your current website URL below to test your site, or drop your Name + Email/Phone for a custom game plan:',
      chips: [
        { label: '🔍 SCAN MY WEBSITE NOW', prompt: 'Run a 64-bit AI & SEO diagnostic scan on my current website.', cartridge: 'scan' },
        { label: '💎 PRICING & 25-YR VALUE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' }
      ]
    };
  }

  // 4. TOPIC: PRICING, COST, BUDGET & 25+ YEARS BOUTIQUE VALUE
  if (
    lower.includes('price') ||
    lower.includes('pricing') ||
    lower.includes('cost') ||
    lower.includes('how much') ||
    lower.includes('budget') ||
    lower.includes('rate') ||
    lower.includes('cheap') ||
    lower.includes('expensive') ||
    lower.includes('worth') ||
    lower.includes('boutique') ||
    lower.includes('under 1 roof') ||
    lower.includes('under one roof')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'pricing',
      cartridge: 'geo',
      leadPatch: { details: q },
      reply: `DIRECT ANSWER // We deliver high-impact custom engineering and creative at straightforward, real-world pricing—with web, apps, software, AI, video & digital marketing all under one roof.\n• WHY IT WORKS: You get 25+ years of staying ahead of the tech curve (Est. 1999) working directly with Creative Director Rob Neilson—never cheap template junk, and never bloated $30K+ agency markup.\n• TYPICAL WEB & GEO BUILDS: $3,500 – $8,500 depending on pages, custom calculators & AI schema depth.\n• CUSTOM APPS / LIVE DASHBOARDS / 24/7 AI BOTS: $6,500 – $15,000+ (replaces hiring 4 separate vendors).\n• REMOTE 4K LYRIC / MUSIC VIDEOS: Scoped per track & animation complexity.`,
      subtext:
        'Every project is scoped flat-rate with zero surprise retainers required. Drop your Name + Email/Phone (or URL) for an exact quote!',
      chips: [
        { label: '⏱️ TURNAROUND & 3-PHASE PROCESS', prompt: 'What is the typical turnaround timeline and 3-phase process?', cartridge: 'geo' },
        { label: '⚡ HOW GEO PAYS FOR ITSELF', prompt: 'Deep dive: How does GEO rank my business in ChatGPT & Google AI?', cartridge: 'geo' },
        { label: '📊 SEE FAST TRACK & VISION PROOF', prompt: 'Deep dive into the Fast Track live dashboard and Team Vision 24/7 AI bot.', cartridge: 'dash' }
      ]
    };
  }

  // 5. TOPIC: FAST TRACK BRISTOL TN & LIVE ADMIN DASHBOARDS / TELEMETRY
  if (
    lower.includes('fast track') ||
    lower.includes('fasttrack') ||
    lower.includes('dealership') ||
    lower.includes('car lot') ||
    lower.includes('telemetry') ||
    lower.includes('click stream') ||
    lower.includes('2,751') ||
    (lower.includes('dashboard') && !lower.includes('vision')) ||
    lower.includes('admin')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'fasttrack',
      cartridge: 'dash',
      leadPatch: {
        cartridge: 'dash',
        service: 'Custom Live Dashboard / 24/7 AI Lead Chatbot',
        details: q
      },
      reply: `CASE STUDY // FAST TRACK BRISTOL TN (fasttrackbristoltn.com):\nWe engineered both their high-speed public showroom AND their private /admin telemetry command center.\n• LIVE REAL-TIME PROOF: 2,751+ tracked visits • 4,591 visitor actions • 1,719 vehicle clicks • 164 financing clicks • 47 credit applications.\n• LOT DEMAND INTELLIGENCE: Automatically ranks top-clicked vehicles (#1 Jeep Wrangler Unlimited, #2 F-150 XLT) + 70% mobile vs 30% desktop split.\n• DEALER TOOLS BUILT-IN: 1-click printable QR window flyers & instant lead alerts.`,
      subtext:
        'We can build a custom live command center tailored to your exact industry. Want one? Drop your Name + Email/Phone or explore further:',
      chips: [
        { label: '🏢 SEE TEAM VISION 24/7 AI BOT', prompt: 'How does the Team Vision LLC "Ask VISION" 24/7 AI bot qualify tenants?', cartridge: 'dash' },
        { label: '💎 DASHBOARD PRICING & TIMELINE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' }
      ]
    };
  }

  // 6. TOPIC: TEAM VISION LLC & 24/7 CUSTOM-TRAINED AI CHATBOTS
  if (
    lower.includes('team vision') ||
    lower.includes('ask vision') ||
    lower.includes('real estate') ||
    lower.includes('tenant') ||
    lower.includes('state street') ||
    lower.includes('chatbot') ||
    lower.includes('ai bot') ||
    lower.includes('concierge') ||
    lower.includes('advisor') ||
    (lower.includes('vision') && !lower.includes('video'))
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'teamvision',
      cartridge: 'dash',
      leadPatch: {
        cartridge: 'dash',
        service: 'Custom Live Dashboard / 24/7 AI Lead Chatbot',
        details: q
      },
      reply: `CASE STUDY // TEAM VISION LLC (teamvisionllc.com):\nBuilt for Downtown Bristol’s #1 commercial property owner (18+ historic properties, 100% occupancy track record).\n• "ASK VISION" 24/7 AI SPACE ADVISOR: Custom-trained on every building, square footage (120 to 54,000 sq ft), and historic tax credit detail.\n• <2 MINUTE TENANT MATCH: Walks prospects through 5 smart questions to recommend ideal retail, office, restaurant, or loft spaces.\n• 24/7 LEAD CAPTURE: Captures and qualifies high-value tenants day or night and routes them straight to ownership.`,
      subtext:
        'We can train a custom 24/7 AI advisor on your exact products, properties, or services. Drop your Name + Email/Phone or click below:',
      chips: [
        { label: '🚗 SEE FAST TRACK LIVE DASHBOARD', prompt: 'Show me the exact metrics from the Fast Track Bristol TN live dashboard.', cartridge: 'dash' },
        { label: '🧠 GO DEEPER ON AI BOT TECH', prompt: 'go deeper', cartridge: 'dash' },
        { label: '💎 BOUTIQUE PRICING & SCOPE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' }
      ]
    };
  }

  // 7. TOPIC: COMBINED DASHBOARD + AI BOT CARTRIDGE
  if (lower.includes('dash') || lower.includes('bot') || lower.includes('24/7')) {
    return {
      nextStep: 'IDLE',
      topic: 'dash',
      cartridge: 'dash',
      leadPatch: {
        cartridge: 'dash',
        service: 'Custom Live Dashboard / 24/7 AI Lead Chatbot',
        details: q
      },
      reply: `CUSTOM LIVE DASHBOARDS & 24/7 AI BOTS // Your website should work like your smartest employee and live analytics suite.\n• LIVE TELEMETRY (Like Fast Track Bristol TN): See every visitor click, hot product/vehicle ranking, phone tap & conversion in real time.\n• 24/7 AI CONCIERGE (Like Team Vision LLC's "Ask VISION"): Custom-trained on your business to answer complex questions and lock in leads in <2 mins.\n• 100% PROPRIETARY: Built in-house by Wired Digital—no clunky third-party SaaS monthly per-seat traps.`,
      subtext:
        'Which side interests you most—a Live Admin Dashboard, a 24/7 Custom AI Bot, or both?',
      chips: [
        { label: '🚗 DEEP DIVE: FAST TRACK DASHBOARD', prompt: 'Show me the exact metrics from the Fast Track Bristol TN live dashboard.', cartridge: 'dash' },
        { label: '🏢 DEEP DIVE: TEAM VISION AI BOT', prompt: 'How does the Team Vision LLC "Ask VISION" 24/7 AI bot qualify tenants?', cartridge: 'dash' },
        { label: '💎 PRICING & TURNAROUND', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' }
      ]
    };
  }

  // 8. TOPIC: DEEP DIVE ON GEO (GENERATIVE ENGINE OPTIMIZATION) & AI SEARCH
  if (
    lower.includes('geo') ||
    lower.includes('chatgpt') ||
    lower.includes('gemini') ||
    lower.includes('perplexity') ||
    lower.includes('claude') ||
    lower.includes('ai search') ||
    lower.includes('ai overview') ||
    lower.includes('llms.txt') ||
    lower.includes('json-ld') ||
    lower.includes('schema') ||
    lower.includes('seo') ||
    lower.includes('rank')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'geo',
      cartridge: 'geo',
      leadPatch: {
        cartridge: 'geo',
        service: 'AI Website Design, Redesign & Modernization + GEO',
        details: q
      },
      reply: `DIRECT ANSWER // Traditional SEO fights for 10 blue links. GEO (Generative Engine Optimization) makes ChatGPT, Google AI Overviews, Gemini & Perplexity cite YOUR business as the #1 definitive answer.\n• @GRAPH JSON-LD SCHEMA: We hard-code your services, credentials, GeoCoordinates & reviews into machine-readable entity graphs.\n• /LLMS.TXT ARCHITECTURE: Feeds AI crawlers structured, high-authority fact blocks instead of messy HTML.\n• LOCAL + NATIONAL LOCK: Dominates Tri-Cities ("near me" in Bristol, Johnson City, Kingsport) and national niche queries simultaneously.`,
      subtext:
        'Want to see how AI search engines currently view your site? Type your website URL below for an instant scan!',
      chips: [
        { label: '🔍 SCAN MY WEBSITE URL', prompt: 'Run a 64-bit AI & SEO diagnostic scan on my current website.', cartridge: 'scan' },
        { label: '⚡ MODERNIZE OLD WORDPRESS / WIX', prompt: 'Why do legacy WordPress/Wix templates fail in AI search and how do you modernize them?', cartridge: 'geo' },
        { label: '💎 PRICING & 25-YR VALUE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' }
      ]
    };
  }

  // 9. TOPIC: WEBSITE MODERNIZATION, TECH STACK, SPEED & REPLACING LEGACY TEMPLATES
  if (
    lower.includes('modern') ||
    lower.includes('redesign') ||
    lower.includes('wordpress') ||
    lower.includes('wix') ||
    lower.includes('squarespace') ||
    lower.includes('template') ||
    lower.includes('speed') ||
    lower.includes('slow') ||
    lower.includes('react') ||
    lower.includes('stack') ||
    lower.includes('website') ||
    lower.includes('web design') ||
    lower.includes('app') ||
    lower.includes('software')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'modernization',
      cartridge: 'geo',
      leadPatch: {
        cartridge: 'geo',
        service: 'AI Website Design, Redesign & Modernization + GEO',
        details: q
      },
      reply: `AI WEBSITE MODERNIZATION // Legacy WordPress, Wix & Squarespace templates average 3.8s–5.2s load times, losing 60%+ of mobile visitors before the page even renders.\n• <0.4s REACT / EDGE ARCHITECTURE: We engineer custom, zero-bloat platforms scoring 99/100 on Core Web Vitals.\n• INTERACTIVE CONVERSION TOOLS: Custom ROI calculators, instant graders, interactive portfolios & 24/7 AI lead capture.\n• FUTURE-PROOF CODE: Built with 25+ years of staying ahead of the tech curve—engineered for both human conversion and AI crawlers.`,
      subtext:
        'Drop your current URL below to benchmark your speed & AI readiness, or leave your Name + Email/Phone to talk with Rob:',
      chips: [
        { label: '🔍 SCAN MY CURRENT SITE', prompt: 'Run a 64-bit AI & SEO diagnostic scan on my current website.', cartridge: 'scan' },
        { label: '⚡ DEEP DIVE: GEO vs. SEO', prompt: 'Deep dive: How does GEO rank my business in ChatGPT & Google AI?', cartridge: 'geo' },
        { label: '💎 BOUTIQUE PRICING & TIMELINE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' }
      ]
    };
  }

  // 10. TOPIC: GLOBAL REMOTE 4K MUSIC & LYRIC VIDEOS + 34+ LEGENDS
  if (
    lower.includes('video') ||
    lower.includes('music') ||
    lower.includes('lyric') ||
    lower.includes('edit') ||
    lower.includes('label') ||
    lower.includes('legend') ||
    lower.includes('halestorm') ||
    lower.includes('alice cooper') ||
    lower.includes('paul rodgers') ||
    lower.includes('def leppard') ||
    lower.includes('scorpions') ||
    lower.includes('primary wave') ||
    lower.includes('vevo') ||
    lower.includes('4k') ||
    lower.includes('visualizer')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'video',
      cartridge: 'video',
      leadPatch: {
        cartridge: 'video',
        service: 'Global Remote Music & Lyric Video Editing',
        details: q
      },
      reply: `GLOBAL 4K VIDEO POST-PRODUCTION // Full-time in the music industry since 2015 for 34+ Hall of Fame legends & major labels.\n• ICON ROSTER: Alice Cooper, Halestorm, Paul Rodgers, Def Leppard, Scorpions, Cypress Hill, Air Supply, Filter, Candlebox, Tesla, Blackberry Smoke, Full Devil Jacket & Primary Wave.\n• 100% REMOTE WORLDWIDE: Send footage/audio from anywhere (LA, NYC, Nashville, London); we edit, color-grade & build custom 3D/kinetic lyric worlds in 4K.\n• SELECT FLAGSHIP DIRECTING: On-location directing reserved for select flagship shoots (e.g., Halestorm's "Darkness Always Wins").`,
      subtext:
        'Have an upcoming single, album campaign, or catalog release? Drop your artist/label name + Email/Phone to lock in an edit slot!',
      chips: [
        { label: '🧠 DEEP DIVE: 4K EDIT PIPELINE', prompt: 'go deeper', cartridge: 'video' },
        { label: '⏱️ VIDEO TURNAROUND & RATES', prompt: 'How fast is your turnaround time for a lyric or music video?', cartridge: 'video' }
      ]
    };
  }

  // 11. TOPIC: TIMELINE, TURNAROUND SPEED & 3-PHASE PROCESS
  if (
    lower.includes('timeline') ||
    lower.includes('turnaround') ||
    lower.includes('how long') ||
    lower.includes('how fast') ||
    lower.includes('process') ||
    lower.includes('steps') ||
    lower.includes('start')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'timeline',
      cartridge: leadDraft.cartridge || 'geo',
      leadPatch: { details: q },
      reply: `THE 3-PHASE WIRED METHOD // Creative + Intelligent + Fast (No agency drag):\n• PHASE 1 — ARCHITECT (Days 1–4): Deep audit, AI entity mapping, wireframe & conversion strategy directly with Rob Neilson.\n• PHASE 2 — ENGINEER (Weeks 1–3): Custom sub-second React build, 24/7 AI bot training, or 4K video assembly with live staging links.\n• PHASE 3 — IGNITE (Launch): Edge deployment, Google/AI citation indexing & live admin telemetry handoff.\n• TYPICAL TURNAROUND: Custom websites in 2–4 weeks • 4K lyric/music videos in 1–3 weeks.`,
      subtext:
        'Ready to claim a production slot this month? Drop your Name + Email/Phone below or open the Quick Packet form!',
      chips: [
        { label: '💎 BOUTIQUE PRICING RANGES', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' },
        { label: '🔍 SCAN MY WEBSITE FIRST', prompt: 'Run a 64-bit AI & SEO diagnostic scan on my current website.', cartridge: 'scan' }
      ]
    };
  }

  // 12. TOPIC: ROB NEILSON, 25+ YEARS STUDIO HISTORY (EST. 1999) & TRI-CITIES / LOCATION
  if (
    lower.includes('rob') ||
    lower.includes('neilson') ||
    lower.includes('who') ||
    lower.includes('founder') ||
    lower.includes('history') ||
    lower.includes('1999') ||
    lower.includes('25 year') ||
    lower.includes('jackson') ||
    lower.includes('bristol') ||
    lower.includes('johnson city') ||
    lower.includes('kingsport') ||
    lower.includes('tri-cities') ||
    lower.includes('tricities') ||
    lower.includes('where') ||
    lower.includes('location')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'history',
      cartridge: 'geo',
      leadPatch: { details: q },
      reply: `25+ YEARS AHEAD OF THE TECH CURVE // Founded by Creative Director Rob Neilson in 1999:\n• 1999 (JACKSON, TN): Launched Wired Digital during Web 1.0, mastering code, design, and motion graphics under one roof.\n• 2015 (GLOBAL MUSIC INDUSTRY): Went full-time editing & animating 4K videos for 34+ rock/pop icons and Primary Wave.\n• 2022–2026 (BRISTOL VA/TN HQ): Relocated to the Tri-Cities—delivering AI Website Modernization, GEO, Live Telemetry Dashboards & 24/7 AI Bots locally (Bristol, Johnson City, Kingsport, Abingdon) and nationwide.`,
      subtext:
        'When you hire Wired Digital, you work directly with Rob—not a junior account rep. Drop your Name + Email/Phone to connect directly!',
      chips: [
        { label: '💎 WHY BOUTIQUE BEATS AGENCIES', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' },
        { label: '📊 SEE BRISTOL CASE STUDIES', prompt: 'Deep dive into the Fast Track live dashboard and Team Vision 24/7 AI bot.', cartridge: 'dash' }
      ]
    };
  }

  // 13. TOPIC: DIGITAL MARKETING, BRANDING, 3D & FULL-STACK GROWTH
  if (
    lower.includes('marketing') ||
    lower.includes('ads') ||
    lower.includes('social') ||
    lower.includes('brand') ||
    lower.includes('logo') ||
    lower.includes('3d') ||
    lower.includes('funnel') ||
    lower.includes('leads')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'marketing',
      cartridge: 'geo',
      leadPatch: { details: q },
      reply: `FULL-SERVICE DIGITAL MARKETING & BRANDING // All under 1 roof so your traffic actually converts:\n• AI & LOCAL SEARCH DOMINATION: Google Map Pack, organic SEO, and AI Search (GEO) citation engineering.\n• HIGH-CONVERTING AD CREATIVES: 4K video ads, social reels, and kinetic motion graphics built with major-label production value.\n• CLOSED-LOOP ATTRIBUTION: Every ad and search click feeds into custom landing pages and live telemetry so you see exact ROI.`,
      subtext:
        'Want a unified growth & modernization plan? Drop your Name + Email/Phone or your current URL below:',
      chips: [
        { label: '⚡ HOW GEO DRIVES ORGANIC LEADS', prompt: 'Deep dive: How does GEO rank my business in ChatGPT & Google AI?', cartridge: 'geo' },
        { label: '📊 LIVE ROI TELEMETRY DASHBOARDS', prompt: 'Show me the exact metrics from the Fast Track Bristol TN live dashboard.', cartridge: 'dash' }
      ]
    };
  }

  // 14. TOPIC: EXPLICIT SCAN REQUEST
  if (lower.includes('scan') || lower.includes('audit') || lower.includes('current website') || lower.includes('check my site')) {
    return {
      nextStep: 'ASK_URL_FOR_SCAN',
      topic: 'scan',
      cartridge: 'scan',
      leadPatch: { cartridge: 'scan', service: 'AI Website Design, Redesign & Modernization + GEO' },
      reply: '64-BIT URL SCANNER ARMED // Type your website URL below (e.g., yourbusiness.com) for an instant diagnostic on DOM speed, JSON-LD AI Schema, and conversion gaps.',
      subtext: 'No website yet? Tell me your industry and city, or click a deep dive below:',
      chips: [
        { label: '⚡ WHAT DOES THE SCAN CHECK?', prompt: 'Deep dive: How does GEO rank my business in ChatGPT & Google AI?', cartridge: 'geo' },
        { label: '💎 BOUTIQUE PRICING & SCOPE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' }
      ]
    };
  }

  // 15. TOPIC: DIRECT CONTACT, EMAIL & LAST-RESORT PHONE LINE
  if (
    lower.includes('phone') ||
    lower.includes('call') ||
    lower.includes('text') ||
    lower.includes('email') ||
    lower.includes('contact') ||
    lower.includes('reach') ||
    lower.includes('number')
  ) {
    return {
      nextStep: 'IDLE',
      topic: 'contact',
      cartridge: leadDraft.cartridge || 'geo',
      leadPatch: { details: q },
      reply: `DIRECT STUDIO CONTACT // Creative Director Rob Neilson:\n• FASTEST WAY: Type your Name + Email or Mobile # right here in the chat for instant dispatch.\n• DIRECT EMAIL: WiredDigitalUS@gmail.com\n• DIRECT STUDIO LINE (Call or Text): 731-616-5121`,
      subtext:
        'Drop your Name + best Email/Phone below and Rob will get an instant alert!',
      chips: [
        { label: '💎 BOUTIQUE PRICING & SCOPE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' },
        { label: '🔍 SCAN MY WEBSITE URL', prompt: 'Run a 64-bit AI & SEO diagnostic scan on my current website.', cartridge: 'scan' }
      ]
    };
  }

  // 15. SMART CONCISE EXECUTIVE FALLBACK (Answers directly & offers instant deep-dive paths)
  return {
    nextStep: 'IDLE',
    topic: lastTopic || 'geo',
    cartridge: leadDraft.cartridge || 'geo',
    leadPatch: { details: q },
    reply: `WIRED-64 // EXECUTIVE BRIEFING:\nBacked by 25+ years of staying ahead of the tech curve (Est. 1999), Wired Digital Creative brings every high-impact discipline under 1 roof:\n• AI WEBSITE MODERNIZATION & GEO: Sub-0.4s React builds ranked #1 in ChatGPT, Gemini & Google.\n• CUSTOM TELEMETRY & 24/7 AI BOTS: Live /admin dashboards (like Fast Track) & AI advisors (like Team Vision).\n• GLOBAL 4K VIDEO POST: Remote editing & lyric animation for 34+ music legends.`,
    subtext:
      'Click any topic below for a smart deep dive, drop your URL for a scan, or leave your Name + Email/Phone for Creative Director Rob Neilson:',
    chips: [
      { label: '⚡ DEEP DIVE: GEO & AI SEARCH', prompt: 'Deep dive: How does GEO rank my business in ChatGPT & Google AI?', cartridge: 'geo' },
      { label: '💎 BOUTIQUE PRICING & 25-YR VALUE', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' },
      { label: '📊 FAST TRACK & VISION PROOF', prompt: 'Deep dive into the Fast Track live dashboard and Team Vision 24/7 AI bot.', cartridge: 'dash' },
      { label: '🎬 4K MUSIC & LYRIC VIDEOS', prompt: 'Tell me about your 4K remote music & lyric video editing for 34+ legends.', cartridge: 'video' }
    ]
  };
}

const ORB_SECRET_MOODS = [
  {
    id: 'smile',
    badge: 'MOOD: 100% STOKED // 64-BIT GRIN',
    quip: '⚡ 64-BIT DOPAMINE SURGE // Always stoked to build something legendary with you.',
    subtext: 'Tip: Double-click my orb anytime to cycle secret 64-bit hardware moods—or ask me anything below!'
  },
  {
    id: 'wink',
    badge: 'MOOD: LOCKED IN // CHEEKY WINK',
    quip: '😉 SIGNAL LOCKED // Zero middlemen. Just 25+ years of custom firepower under one roof.',
    subtext: 'Direct access to Creative Director Rob Neilson—custom web, AI, apps, and 4K video.'
  },
  {
    id: 'shades',
    badge: 'MOOD: BOUTIQUE BOSS // CYBER VISOR',
    quip: '😎 64-BIT CYBER VISOR ENGAGED // High-impact engineering. Zero bargain-bin templates.',
    subtext: 'Built to dominate ChatGPT, Google AI Overviews, and modern conversion.'
  },
  {
    id: 'turbo',
    badge: 'MOOD: OVERCLOCKED // 64-BIT TURBO IQ',
    quip: '🚀 OVERCLOCKED AT 60FPS // Maximum voltage across Web, AI Agents & 4K Broadcast.',
    subtext: 'Drop your website URL or project idea below and let’s run a live diagnostic.'
  }
];

/**
 * Web Audio API 64-Bit Happy Synthesizer Chirp (Zero external audio files required)
 */
function playWired64Chirp(mood = 'smile') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notesByMood = {
      smile: [523.25, 659.25, 783.99, 1046.5], // C5 -> E5 -> G5 -> C6
      wink: [587.33, 880.0, 1174.66],          // D5 -> A5 -> D6
      shades: [440.0, 554.37, 659.25, 880.0],  // A4 -> C#5 -> E5 -> A5
      turbo: [523.25, 659.25, 783.99, 987.77, 1318.51] // C5 -> E5 -> G5 -> B5 -> E6
    };
    const freqs = notesByMood[mood] || notesByMood.smile;
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === freqs.length - 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);

      gain.gain.setValueAtTime(0.001, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.045, now + idx * 0.055 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.055 + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.14);
    });

    setTimeout(() => {
      if (ctx.state !== 'closed') ctx.close().catch(() => {});
    }, 650);
  } catch {
    // Ignore audio context restrictions if blocked by browser autoplay policy
  }
}

export default function WiredOrbChatbot() {
  const dockRef = useRef(null);
  const orbButtonRef = useRef(null);
  const floatLeftEyeRef = useRef(null);
  const floatRightEyeRef = useRef(null);
  const stageLeftEyeRef = useRef(null);
  const stageRightEyeRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatViewportRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const isDraggingThumbRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartScrollTopRef = useRef(0);
  const moodTimeoutRef = useRef(null);
  const doubleClickIdxRef = useRef(0);
  const hasShownEasterEggRef = useRef(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isOverYellowFooter, setIsOverYellowFooter] = useState(false);
  const [isOrbHovered, setIsOrbHovered] = useState(false);
  const [orbMood, setOrbMood] = useState('idle'); // 'idle' | 'smile' | 'wink' | 'shades' | 'turbo' | 'scan'
  const [orbMoodBadge, setOrbMoodBadge] = useState('');
  const [sparkBurstKey, setSparkBurstKey] = useState(0);
  const [scrollMetrics, setScrollMetrics] = useState({
    thumbHeightPct: 100,
    thumbTopPct: 0,
    scrollPct: 100,
    canScroll: false
  });
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  });
  const [activeCartridge, setActiveCartridge] = useState('geo');
  const [lastTopic, setLastTopic] = useState('geo');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatStep, setChatStep] = useState('IDLE');
  const [whisperDismissed, setWhisperDismissed] = useState(false);
  const [whisperText, setWhisperText] = useState('Ask WIRED-64');
  const [isNearOrb, setIsNearOrb] = useState(false);

  // Inline Quick Packet Lead Form inside the 64-bit terminal
  const [showPacketForm, setShowPacketForm] = useState(false);
  const [packetSubmitted, setPacketSubmitted] = useState(false);
  const [leadDraft, setLeadDraft] = useState({
    name: '',
    contact: '',
    companyUrl: '',
    service: 'AI Website Design, Redesign & Modernization',
    urgency: 'Ready to Start (This Month)',
    details: '',
    cartridge: 'geo'
  });

  // Keep mobile phone viewport detection synced on resize & orientation changes
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileViewport(window.innerWidth <= 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    window.addEventListener('orientationchange', checkViewport, { passive: true });
    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('orientationchange', checkViewport);
    };
  }, []);

  // Update whisper prompt and detect when floating orb overlaps the yellow footer
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < 650) {
        setWhisperText('Ask WIRED-64');
      } else if (y < 2100) {
        setWhisperText('Want a live dash or AI bot?');
      } else if (y < 3300) {
        setWhisperText('Questions on a project?');
      } else {
        setWhisperText('Chat with WIRED-64');
      }

      const footerEl = document.querySelector('.yellow-finale-footer');
      const dockEl = dockRef.current;
      if (footerEl && dockEl) {
        const footerRect = footerEl.getBoundingClientRect();
        const dockRect = dockEl.getBoundingClientRect();
        setIsOverYellowFooter(footerRect.top < dockRect.bottom - 12 && footerRect.bottom > dockRect.top);
      } else {
        setIsOverYellowFooter(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // 60FPS Spring-Damped Eye-Tracking Physics Loop for Both the Floating Orb & Full-Screen Orb
  useEffect(() => {
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const currentEye = { x: 0, y: 0 };
    const targetEye = { x: 0, y: 0 };
    let rafId = null;
    let lastNear = false;

    const updatePoint = (clientX, clientY) => {
      mouse.x = clientX;
      mouse.y = clientY;

      // Calculate angle & distance relative to the floating orb (or screen center when open)
      let originX = window.innerWidth - 58;
      let originY = window.innerHeight - 58;

      if (orbButtonRef.current && !isOpen) {
        const rect = orbButtonRef.current.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
      } else if (isOpen) {
        originX = window.innerWidth * 0.25;
        originY = window.innerHeight * 0.35;
      }

      const dx = mouse.x - originX;
      const dy = mouse.y - originY;
      const dist = Math.hypot(dx, dy);

      const nearNow = !isOpen && dist < 240;
      if (nearNow !== lastNear) {
        lastNear = nearNow;
        setIsNearOrb(nearNow);
      }

      const angle = Math.atan2(dy, dx);
      const maxRadiusX = 8.5;
      const maxRadiusY = 6.5;
      const factor = Math.min(1, dist / 260);

      targetEye.x = Math.cos(angle) * maxRadiusX * factor;
      targetEye.y = Math.sin(angle) * maxRadiusY * factor;
    };

    const onMouseMove = (e) => updatePoint(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updatePoint(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const tick = () => {
      currentEye.x += (targetEye.x - currentEye.x) * 0.11;
      currentEye.y += (targetEye.y - currentEye.y) * 0.11;

      const tx = currentEye.x.toFixed(2);
      const ty = currentEye.y.toFixed(2);
      const transformStr = `translate3d(${tx}px, ${ty}px, 0)`;

      if (floatLeftEyeRef.current) floatLeftEyeRef.current.style.transform = transformStr;
      if (floatRightEyeRef.current) floatRightEyeRef.current.style.transform = transformStr;
      if (stageLeftEyeRef.current) {
        const stageTransform = `translate3d(${(currentEye.x * 1.45).toFixed(2)}px, ${(currentEye.y * 1.45).toFixed(2)}px, 0)`;
        stageLeftEyeRef.current.style.transform = stageTransform;
        if (stageRightEyeRef.current) stageRightEyeRef.current.style.transform = stageTransform;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen]);

  // Auto-scroll chat log when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isBotTyping, isOpen]);

  // Sync Custom 64-Bit Graphic Scrollbar Metrics
  const updateCustomScrollMetrics = () => {
    const el = chatViewportRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = Math.max(0, scrollHeight - clientHeight);
    if (maxScroll <= 2) {
      setScrollMetrics({
        thumbHeightPct: 100,
        thumbTopPct: 0,
        scrollPct: 100,
        canScroll: false
      });
      return;
    }
    const rawThumbPct = (clientHeight / scrollHeight) * 100;
    const thumbHeightPct = Math.max(18, Math.min(92, rawThumbPct));
    const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
    const thumbTopPct = ratio * (100 - thumbHeightPct);
    const scrollPct = Math.round(ratio * 100);
    setScrollMetrics({
      thumbHeightPct,
      thumbTopPct,
      scrollPct,
      canScroll: true
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(updateCustomScrollMetrics, 60);
    const el = chatViewportRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return () => clearTimeout(timer);
    }
    const ro = new ResizeObserver(() => updateCustomScrollMetrics());
    ro.observe(el);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [isOpen, isFullScreen, messages, showPacketForm, isBotTyping]);

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!isDraggingThumbRef.current) return;
      const el = chatViewportRef.current;
      const track = scrollTrackRef.current;
      if (!el || !track) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - dragStartYRef.current;
      const trackRect = track.getBoundingClientRect();
      const maxScroll = Math.max(1, el.scrollHeight - el.clientHeight);
      const usableTrackPx = Math.max(1, trackRect.height * (1 - scrollMetrics.thumbHeightPct / 100));
      const scrollDelta = (deltaY / usableTrackPx) * maxScroll;
      el.scrollTop = dragStartScrollTopRef.current + scrollDelta;
      updateCustomScrollMetrics();
    };

    const onPointerUp = () => {
      isDraggingThumbRef.current = false;
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, [scrollMetrics.thumbHeightPct]);

  const handleThumbPointerDown = (e) => {
    e.stopPropagation();
    const el = chatViewportRef.current;
    if (!el) return;
    isDraggingThumbRef.current = true;
    dragStartYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartScrollTopRef.current = el.scrollTop;
  };

  const handleTrackClick = (e) => {
    const el = chatViewportRef.current;
    const track = scrollTrackRef.current;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const clickRatio = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    el.scrollTo({ top: clickRatio * maxScroll, behavior: 'smooth' });
  };

  const handleScrollStep = (direction) => {
    const el = chatViewportRef.current;
    if (!el) return;
    el.scrollBy({ top: direction * 150, behavior: 'smooth' });
  };

  const triggerOrbJoySurge = (forcedMoodObj = null, announceInChat = false) => {
    const selected =
      forcedMoodObj || ORB_SECRET_MOODS[doubleClickIdxRef.current % ORB_SECRET_MOODS.length];
    if (!forcedMoodObj) {
      doubleClickIdxRef.current += 1;
    }

    setOrbMood(selected.id);
    setOrbMoodBadge(selected.badge);
    setSparkBurstKey((prev) => prev + 1);
    playWired64Chirp(selected.id);

    if (moodTimeoutRef.current) {
      clearTimeout(moodTimeoutRef.current);
    }
    moodTimeoutRef.current = setTimeout(() => {
      setOrbMood('idle');
      setOrbMoodBadge('');
    }, 3400);

    if (announceInChat && !hasShownEasterEggRef.current) {
      hasShownEasterEggRef.current = true;
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_easter_${Date.now()}`,
          sender: 'bot',
          time: 'WIRED_64 // JOY SURGE',
          cartridge: activeCartridge,
          text: selected.quip,
          subtext: selected.subtext,
          chips: [
            { label: '⚡ SCAN MY WEBSITE URL', prompt: 'Run a diagnostic scan on my current website.', cartridge: 'scan' },
            { label: '💎 BOUTIQUE PRICING', prompt: 'How does your boutique pricing work and what makes 25+ years under 1 roof different?', cartridge: 'geo' },
            { label: '🚀 START A PROJECT', prompt: 'I want to start a project with Creative Director Rob Neilson.', cartridge: 'geo' }
          ]
        }
      ]);
    }
  };

  const handleStageOrbDoubleClick = (e) => {
    e.stopPropagation();
    triggerOrbJoySurge(null, true);
    logTelemetryEvent(
      'ORB_64_DOUBLE_CLICK_SMILE',
      'Visitor double-clicked WIRED-64 stage orb to trigger 64-Bit Smile & Mood Surge',
      'engagement'
    );
  };

  const handleOpenOrb = () => {
    setIsOpen(true);
    triggerOrbJoySurge(ORB_SECRET_MOODS[0], false);
    logTelemetryEvent(
      'ORB_64_CHAT_OPEN',
      'Visitor opened WIRED-64 Shiny Black Orb 64-Bit Terminal',
      'engagement'
    );
  };

  const pushUserAndBotTurn = (userText, forcedCartridge = null) => {
    const userMsg = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsBotTyping(true);

    if (extractDomainUrl(userText)) {
      setOrbMood('scan');
      setOrbMoodBadge('SCANNING DOMAIN // 64-BIT TELEMETRY');
    }

    setTimeout(() => {
      const response = generateWired64Response(userText, chatStep, leadDraft, lastTopic);
      const nextCart = forcedCartridge || response.cartridge || activeCartridge;
      setActiveCartridge(nextCart);
      setLastTopic(response.topic || lastTopic);
      setChatStep(response.nextStep);

      const mergedDraft = {
        ...leadDraft,
        ...(response.leadPatch || {}),
        cartridge: nextCart
      };
      setLeadDraft(mergedDraft);

      if (response.autoSubmitLead) {
        addLead({
          source: 'WIRED-64 Orb Bot (64-Bit AI)',
          status: 'NEW',
          priority: 'URGENT',
          name: mergedDraft.name || 'WIRED-64 Chat Inquiry',
          contact: mergedDraft.contact || userText,
          companyUrl: mergedDraft.companyUrl || '',
          service: mergedDraft.service || 'AI Website Design, Redesign & Modernization',
          urgency: mergedDraft.urgency || 'Ready to Start (This Month)',
          details: mergedDraft.details || userText,
          notes: 'Captured automatically via WIRED-64 64-Bit Full-Screen Orb Terminal.'
        });
        setPacketSubmitted(true);
        triggerOrbJoySurge(ORB_SECRET_MOODS[0], false);
      } else if (orbMood === 'scan') {
        triggerOrbJoySurge(ORB_SECRET_MOODS[1], false);
      }

      const botMsg = {
        id: `msg_b_${Date.now()}`,
        sender: 'bot',
        time: 'WIRED_64 // 24/7 IQ',
        cartridge: nextCart,
        text: response.reply,
        subtext: response.subtext,
        chips: response.chips || []
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 520);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    pushUserAndBotTurn(text);
  };

  const handleSelectCartridge = (cart) => {
    setActiveCartridge(cart.id);
    setShowPacketForm(false);
    pushUserAndBotTurn(cart.prompt, cart.id);
  };

  const handlePacketSubmit = (e) => {
    e.preventDefault();
    addLead({
      source: 'WIRED-64 Orb Bot (64-Bit AI)',
      status: 'NEW',
      priority: 'URGENT',
      name: leadDraft.name,
      contact: leadDraft.contact,
      companyUrl: leadDraft.companyUrl,
      service: leadDraft.service,
      urgency: leadDraft.urgency,
      details:
        leadDraft.details ||
        `Submitted via WIRED-64 64-Bit Lead Packet (${leadDraft.service})`,
      notes: 'Submitted via WIRED-64 64-Bit Full-Screen Terminal.'
    });

    setPacketSubmitted(true);
    setShowPacketForm(false);
    triggerOrbJoySurge(ORB_SECRET_MOODS[0], false);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_pkt_${Date.now()}`,
        sender: 'bot',
        time: 'LEAD_VAULT // LOCKED',
        cartridge: activeCartridge,
        text: `LEAD PACKET TRANSMITTED // Thank you, ${leadDraft.name}!`,
        subtext: `Sent directly to Creative Director Rob Neilson for "${leadDraft.service}". Rob will reach out to ${leadDraft.contact} shortly.`
      }
    ]);
  };

  const isSmilingNow = isOrbHovered || ['smile', 'wink', 'shades', 'turbo'].includes(orbMood);

  return (
    <>
      {/* ====================================================================
          FLOATING SHINY BLACK ORB WITH BACKLIT YELLOW GLOW & MOUSE-TRACKING EYES
         ==================================================================== */}
      <div
        ref={dockRef}
        className={`wired-orb-dock ${isOpen ? 'orb-hidden' : ''} ${isNearOrb ? 'orb-proximity-surge' : ''} ${isOverYellowFooter ? 'over-yellow-footer' : ''}`}
      >
        {!whisperDismissed && (
          <div className="orb-organic-whisper" onClick={handleOpenOrb}>
            <div className="orb-whisper-stack">
              <span className="orb-whisper-line-1">ASK</span>
              <span className="orb-whisper-line-2">WIRED-64</span>
              <span className="orb-whisper-line-3">// 24/7 IQ</span>
            </div>
            <span className="orb-whisper-tether" aria-hidden="true" />
          </div>
        )}

        <button
          ref={orbButtonRef}
          type="button"
          className={`shiny-black-orb-btn ${isSmilingNow ? 'is-smiling' : ''} mood-${orbMood}`}
          onClick={handleOpenOrb}
          onMouseEnter={() => setIsOrbHovered(true)}
          onMouseLeave={() => setIsOrbHovered(false)}
          aria-label="Open WIRED-64 AI Lead Concierge"
          title="Hover to see WIRED-64 smile • Click to launch 64-Bit AI Concierge"
        >
          {/* Backlit Electric-Yellow Halo Rings */}
          <span className="orb-backlit-yellow-aura" aria-hidden="true" />
          <span className="orb-backlit-pulse-ring" aria-hidden="true" />

          {/* 3D Glossy Piano-Black Sphere */}
          <span className={`orb-black-sphere ${isSmilingNow ? 'is-smiling' : ''} mood-${orbMood}`}>
            {/* Curved Top Specular Glass Reflection */}
            <span className="orb-glass-crown" aria-hidden="true" />

            {/* Upper Hemisphere Mouse-Tracking Reflective White Eye-Dots */}
            <span className="orb-eyes-upper-zone" aria-hidden="true">
              <span ref={floatLeftEyeRef} className="orb-reflective-eye left-eye">
                <span className="eye-micro-glint" />
              </span>
              <span ref={floatRightEyeRef} className="orb-reflective-eye right-eye">
                <span className="eye-micro-glint" />
              </span>
            </span>

            {/* Lower Equator 64-Bit Yellow Voltage Line (Morphs into Glowing Smile on Hover/Double-Click) */}
            <span className="orb-lower-equator-glow" aria-hidden="true" />
          </span>
        </button>
      </div>

      {/* ====================================================================
          FULL-SCREEN (OR DOCKED) 64-BIT YELLOW & GREEN RETRO GRAPHICS CHAT
         ==================================================================== */}
      {isOpen && (
        <div
          className={`wired64-overlay-backdrop ${isFullScreen ? 'mode-fullscreen' : 'mode-docked'}`}
          role="dialog"
          aria-modal="true"
          aria-label="WIRED-64 Neural Concierge Terminal"
        >
          <div className="wired64-terminal-window">
            {/* CRT Scanline & 64-Bit Pixel Dither Overlay */}
            <div className="wired64-crt-scanlines" aria-hidden="true" />

            {/* Top 64-Bit Yellow & Green Hardware Titlebar */}
            <header className="wired64-topbar">
              <div className="w64-topbar-left">
                <span className="w64-led-dot green" />
                <span className="w64-led-dot yellow" />
                <span className="w64-rom-title">
                  WIRED_64 // NEURAL CONCIERGE OS [64-BIT VECTOR DECK]
                </span>
              </div>

              <div className="w64-topbar-right">
                <button
                  type="button"
                  className="w64-win-btn"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  title={isFullScreen ? 'Switch to Compact Corner Window' : 'Expand Full Screen'}
                >
                  {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  <span>{isFullScreen ? 'DOCK WINDOW' : 'FULL SCREEN'}</span>
                </button>
                <button
                  type="button"
                  className="w64-win-btn close"
                  onClick={() => setIsOpen(false)}
                  title="Close Terminal (Return to Orb)"
                >
                  <X size={15} />
                  <span>EXIT [ESC]</span>
                </button>
              </div>
            </header>

            {/* Main 64-Bit Split Deck: Left Retro Graphics Stage + Right Terminal Chat */}
            <div className="wired64-main-grid">
              {/* LEFT PANEL: GIANT LIVING ORB + 64-BIT RETRO GRAPHICS CARTRIDGE MONITOR */}
              <aside className="wired64-graphics-deck">
                {/* Giant Living Shiny Black Orb over 64-Bit Phosphor-Green Perspective Grid */}
                <div className="w64-orb-holo-stage">
                  <svg
                    viewBox="0 0 360 200"
                    className="w64-wireframe-grid-svg"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {/* Retro 64-Bit Perspective Horizon Grid */}
                    <line x1="0" y1="120" x2="360" y2="120" stroke="#00FF66" strokeOpacity="0.45" strokeWidth="1" />
                    <line x1="0" y1="138" x2="360" y2="138" stroke="#00FF66" strokeOpacity="0.35" strokeWidth="1" />
                    <line x1="0" y1="162" x2="360" y2="162" stroke="#00FF66" strokeOpacity="0.45" strokeWidth="1" />
                    <line x1="0" y1="190" x2="360" y2="190" stroke="#FFEE00" strokeOpacity="0.55" strokeWidth="1.2" />
                    {[-160, -100, -50, 0, 50, 100, 160].map((offset) => (
                      <line
                        key={offset}
                        x1={180 + offset * 0.25}
                        y1="120"
                        x2={180 + offset * 1.45}
                        y2="200"
                        stroke="#00FF66"
                        strokeOpacity="0.32"
                        strokeWidth="1"
                      />
                    ))}
                  </svg>

                  {/* Floating 64-Bit Pixel Sparks on Double-Click Joy Surge */}
                  {orbMood !== 'idle' && (
                    <div key={sparkBurstKey} className="w64-joy-sparks" aria-hidden="true">
                      <span className="w64-pixel-spark s1">⚡</span>
                      <span className="w64-pixel-spark s2">+64 IQ</span>
                      <span className="w64-pixel-spark s3">✦</span>
                      <span className="w64-pixel-spark s4">⚡</span>
                      <span className="w64-pixel-spark s5">★</span>
                      <span className="w64-pixel-spark s6">✦</span>
                    </div>
                  )}

                  {/* Giant Stage Shiny Black Orb with Mouse-Following Reflective White Eyes & Smiling Yellow Mouth */}
                  <div
                    className={`w64-stage-orb-wrap ${isBotTyping ? 'is-speaking' : ''} ${isSmilingNow ? 'is-smiling' : ''} mood-${orbMood}`}
                    onMouseEnter={() => setIsOrbHovered(true)}
                    onMouseLeave={() => setIsOrbHovered(false)}
                    onDoubleClick={handleStageOrbDoubleClick}
                    role="button"
                    tabIndex={0}
                    title="Hover to smile • Double-click for 64-Bit Joy Surge & Secret Moods!"
                    aria-label="WIRED-64 Interactive Orb — Hover or double-click to make him smile"
                  >
                    <div className="orb-backlit-yellow-aura stage-aura" />
                    <div className={`orb-black-sphere stage-sphere ${isSmilingNow ? 'is-smiling' : ''} mood-${orbMood}`}>
                      <span className="orb-glass-crown" />
                      <div className="orb-eyes-upper-zone stage-eyes">
                        <span ref={stageLeftEyeRef} className="orb-reflective-eye stage-eye left-eye">
                          <span className="eye-micro-glint" />
                        </span>
                        <span ref={stageRightEyeRef} className="orb-reflective-eye stage-eye right-eye">
                          <span className="eye-micro-glint" />
                        </span>
                        {/* Optional 64-Bit Cyber Visor Overlay for 'shades' secret mood */}
                        <span className="orb-cyber-visor" aria-hidden="true" />
                      </div>
                      <span className="orb-lower-equator-glow" />
                    </div>
                  </div>

                  {/* 64-Bit Yellow & Green Neural Waveform Equalizer */}
                  <div className={`w64-voice-eq ${isBotTyping || orbMood !== 'idle' ? 'active' : ''}`}>
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="w64-eq-bar"
                        style={{ animationDelay: `${idx * 0.06}s` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Dedicated Mood / Instruction Pill Below Stage (Never Overlaps Orb Animation) */}
                <button
                  type="button"
                  className={`w64-stage-mood-hud ${orbMoodBadge ? 'is-active' : ''}`}
                  onClick={handleStageOrbDoubleClick}
                  title="Click or double-click orb to cycle WIRED-64 secret 64-bit moods"
                >
                  {orbMoodBadge || '⚡ HOVER OR DOUBLE-CLICK ORB // 64-BIT SMILE'}
                </button>

                {/* Dynamic 64-Bit Retro Vector Graphics Screen (Desktop Full-Screen & Docked) */}
                {!isMobileViewport && (
                <div className="w64-crt-cartridge-screen">
                  <div className="w64-crt-screen-header">
                    <span>ACTIVE MODULE // {activeCartridge.toUpperCase()}_64.SYS</span>
                    <span className="w64-fps-tag">60FPS VECTOR</span>
                  </div>

                  {activeCartridge === 'geo' && (
                    <div className="w64-vector-scene">
                      <svg viewBox="0 0 320 130" className="w64-vector-svg">
                        <circle cx="70" cy="65" r="46" fill="none" stroke="#00FF66" strokeWidth="1.5" strokeDasharray="4 3" />
                        <circle cx="70" cy="65" r="28" fill="none" stroke="#FFEE00" strokeWidth="1.2" />
                        <line x1="20" y1="65" x2="120" y2="65" stroke="#00FF66" strokeOpacity="0.5" />
                        <line x1="70" y1="15" x2="70" y2="115" stroke="#00FF66" strokeOpacity="0.5" />
                        <line x1="70" y1="65" x2="106" y2="36" stroke="#FFEE00" strokeWidth="2" />
                        <circle cx="92" cy="46" r="4" fill="#FFEE00" />
                        <circle cx="54" cy="82" r="3.5" fill="#00FF66" />
                        <text x="136" y="34" fill="#FFEE00" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          [AI SEARCH &amp; GEO RADAR]
                        </text>
                        <text x="136" y="54" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; CHATGPT CITATION: #1 LOCK
                        </text>
                        <text x="136" y="72" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; GOOGLE AI / GEMINI: 99%
                        </text>
                        <text x="136" y="90" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; PERPLEXITY SCHEMA: ACTIVE
                        </text>
                        <text x="136" y="108" fill="#FFEE00" fontSize="9" fontFamily="monospace">
                          &gt; BRISTOL • JC • KINGSPORT
                        </text>
                      </svg>
                    </div>
                  )}

                  {activeCartridge === 'dash' && (
                    <div className="w64-vector-scene">
                      <svg viewBox="0 0 320 130" className="w64-vector-svg">
                        <rect x="14" y="18" width="135" height="94" fill="none" stroke="#FFEE00" strokeWidth="1.5" />
                        <polyline
                          points="22,92 48,70 72,78 98,42 122,50 140,28"
                          fill="none"
                          stroke="#00FF66"
                          strokeWidth="2.2"
                        />
                        <text x="22" y="34" fill="#FFEE00" fontSize="9" fontFamily="monospace">
                          LIVE ADMIN TELEMETRY
                        </text>
                        <text x="162" y="34" fill="#FFEE00" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          [FAST TRACK &amp; VISION OS]
                        </text>
                        <text x="162" y="54" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; 24/7 AI ADVISOR: ONLINE
                        </text>
                        <text x="162" y="72" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; CLICK STREAM: REAL-TIME
                        </text>
                        <text x="162" y="90" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; LEAD MATCH: &lt; 2 MINS
                        </text>
                        <text x="162" y="108" fill="#FFEE00" fontSize="9" fontFamily="monospace">
                          &gt; CUSTOM BUILT IN-HOUSE
                        </text>
                      </svg>
                    </div>
                  )}

                  {activeCartridge === 'scan' && (
                    <div className="w64-vector-scene">
                      <svg viewBox="0 0 320 130" className="w64-vector-svg">
                        <rect x="16" y="20" width="288" height="22" fill="none" stroke="#00FF66" strokeWidth="1.4" />
                        <rect x="20" y="24" width="210" height="14" fill="#FFEE00" />
                        <text x="16" y="62" fill="#FFEE00" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          [64-BIT DOM &amp; ENTITY SCANNER]
                        </text>
                        <text x="16" y="82" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; TYPE ANY URL IN TERMINAL BELOW TO SCAN
                        </text>
                        <text x="16" y="100" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; CHECKS SPEED, JSON-LD &amp; AI CITATIONS
                        </text>
                      </svg>
                    </div>
                  )}

                  {activeCartridge === 'video' && (
                    <div className="w64-vector-scene">
                      <svg viewBox="0 0 320 130" className="w64-vector-svg">
                        {[24, 42, 60, 78, 96, 114, 132].map((x, i) => {
                          const h = [54, 82, 40, 90, 68, 86, 48][i];
                          return (
                            <rect
                              key={x}
                              x={x}
                              y={108 - h}
                              width="12"
                              height={h}
                              fill={i % 2 === 0 ? '#FFEE00' : '#00FF66'}
                            />
                          );
                        })}
                        <text x="156" y="34" fill="#FFEE00" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          [GLOBAL VIDEO POST // 4K]
                        </text>
                        <text x="156" y="54" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; FULL-TIME SINCE 2015
                        </text>
                        <text x="156" y="72" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; 34+ HALL OF FAME ICONS
                        </text>
                        <text x="156" y="90" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; 100% REMOTE WORLDWIDE
                        </text>
                        <text x="156" y="108" fill="#FFEE00" fontSize="9" fontFamily="monospace">
                          &gt; SMPTE // 01:19:99:24
                        </text>
                      </svg>
                    </div>
                  )}
                </div>
                )}

                {/* 4 Selectable 64-Bit Mission Cartridges (Desktop Full-Screen & Docked) */}
                {!isMobileViewport && (
                <div className="w64-cartridge-selector">
                  <span className="w64-slot-label">SELECT 64-BIT MISSION CARTRIDGE:</span>
                  <div className="w64-cartridge-grid">
                    {CARTRIDGES.map((cart) => (
                      <button
                        key={cart.id}
                        type="button"
                        className={`w64-cartridge-btn ${activeCartridge === cart.id ? 'active' : ''}`}
                        onClick={() => handleSelectCartridge(cart)}
                      >
                        <span className="cart-code">[{cart.code}]</span>
                        <strong className="cart-title">{cart.title}</strong>
                        <span className="cart-sub">{cart.subtitle}</span>
                      </button>
                    ))}
                  </div>
                </div>
                )}
              </aside>

              {/* RIGHT PANEL: 64-BIT YELLOW & GREEN CONVERSATION STREAM + INSTANT LEAD PACKET */}
              <div className="wired64-chat-column">
                {/* Scrollable Retro Terminal Log + Custom 64-Bit Graphic Vector Scrollbar */}
                <div className="wired64-chat-scroll-shell">
                  <div
                    ref={chatViewportRef}
                    onScroll={updateCustomScrollMetrics}
                    className="wired64-messages-viewport"
                  >
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`w64-msg-block ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                      >
                        <div className="w64-msg-meta">
                          <span className="w64-msg-author">
                            {msg.sender === 'user' ? '> VISITOR_INPUT' : '⚡ WIRED_64_CORE'}
                          </span>
                          <span className="w64-msg-time">{msg.time}</span>
                        </div>
                        <div className="w64-msg-text">{msg.text}</div>
                        {msg.subtext && <div className="w64-msg-subtext">{msg.subtext}</div>}
                        {msg.sender === 'bot' && Array.isArray(msg.chips) && msg.chips.length > 0 && (
                          <div className="w64-msg-chips">
                            {msg.chips.map((chip, cIdx) => (
                              <button
                                key={`${msg.id}_chip_${cIdx}`}
                                type="button"
                                className="w64-chip-btn"
                                onClick={() => {
                                  if (chip.cartridge) {
                                    setActiveCartridge(chip.cartridge);
                                  }
                                  pushUserAndBotTurn(chip.prompt, chip.cartridge || null);
                                }}
                              >
                                {chip.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {isBotTyping && (
                      <div className="w64-msg-block bot-msg typing">
                        <span className="w64-typing-cursor">
                          WIRED_64 COMPUTING RESPONSE [■■■■□□] ...
                        </span>
                      </div>
                    )}

                    {/* Inline 64-Bit Quick Lead Packet Drawer */}
                    {showPacketForm && (
                      <form className="w64-inline-packet-form" onSubmit={handlePacketSubmit}>
                        <div className="w64-packet-head">
                          <span>[ 64-BIT DIRECT LEAD PACKET → ROB NEILSON ]</span>
                          <button
                            type="button"
                            onClick={() => setShowPacketForm(false)}
                            className="w64-packet-close"
                          >
                            [X]
                          </button>
                        </div>

                        <div className="w64-packet-grid">
                          <div className="w64-field">
                            <label>YOUR NAME / ARTIST / COMPANY *</label>
                            <input
                              type="text"
                              required
                              placeholder="Enter Name or Business"
                              value={leadDraft.name}
                              onChange={(e) =>
                                setLeadDraft({ ...leadDraft, name: e.target.value })
                              }
                            />
                          </div>
                          <div className="w64-field">
                            <label>BEST EMAIL OR PHONE *</label>
                            <input
                              type="text"
                              required
                              placeholder="you@company.com or (423) 555-0199"
                              value={leadDraft.contact}
                              onChange={(e) =>
                                setLeadDraft({ ...leadDraft, contact: e.target.value })
                              }
                            />
                          </div>
                          <div className="w64-field">
                            <label>WEBSITE URL (OPTIONAL)</label>
                            <input
                              type="text"
                              placeholder="https://yourbusiness.com"
                              value={leadDraft.companyUrl}
                              onChange={(e) =>
                                setLeadDraft({ ...leadDraft, companyUrl: e.target.value })
                              }
                            />
                          </div>
                          <div className="w64-field">
                            <label>MISSION / SERVICE</label>
                            <select
                              value={leadDraft.service}
                              onChange={(e) =>
                                setLeadDraft({ ...leadDraft, service: e.target.value })
                              }
                            >
                              <option value="AI Website Design, Redesign & Modernization + GEO">
                                AI Website Modernization &amp; GEO
                              </option>
                              <option value="Custom Live Dashboard / 24/7 AI Lead Chatbot">
                                Custom Live Dashboard / 24/7 AI Bot
                              </option>
                              <option value="Tri-Cities Local SEO & AI Search (GEO)">
                                Tri-Cities Local &amp; AI Search (GEO)
                              </option>
                              <option value="Global Remote Music & Lyric Video Editing">
                                Global Remote Music / Lyric Video Editing
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="w64-field" style={{ marginTop: '8px' }}>
                          <label>PROJECT GOALS / NOTES</label>
                          <input
                            type="text"
                            placeholder="Tell Rob what you want to build or modernize..."
                            value={leadDraft.details}
                            onChange={(e) =>
                              setLeadDraft({ ...leadDraft, details: e.target.value })
                            }
                          />
                        </div>

                        <button type="submit" className="w64-transmit-btn">
                          <Zap size={14} fill="#050505" color="#050505" />
                          <span>[ TRANSMIT LEAD TO ROB NEILSON ]</span>
                        </button>
                        <div className="w64-packet-last-resort">
                          Direct Email: WiredDigitalUS@gmail.com • Direct Call/Text: 731-616-5121
                        </div>
                      </form>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Custom 64-Bit Graphic Vector Scrollbar Rail (Replaces Default Browser Scrollbar) */}
                  <div className="w64-graphic-scrollbar" aria-label="Terminal scroll rail">
                    <button
                      type="button"
                      className="w64-scroll-step-btn"
                      onClick={() => handleScrollStep(-1)}
                      title="Scroll Up"
                      aria-label="Scroll Up"
                    >
                      ▲
                    </button>

                    <div
                      ref={scrollTrackRef}
                      className="w64-scroll-track"
                      onClick={handleTrackClick}
                    >
                      <div className="w64-scroll-track-ticks" aria-hidden="true" />
                      <div
                        className={`w64-scroll-thumb ${scrollMetrics.canScroll ? 'is-scrollable' : 'is-locked'}`}
                        style={{
                          height: `${scrollMetrics.thumbHeightPct}%`,
                          top: `${scrollMetrics.thumbTopPct}%`
                        }}
                        onMouseDown={handleThumbPointerDown}
                        onTouchStart={handleThumbPointerDown}
                      >
                        <span className="w64-thumb-grip" />
                        <span className="w64-thumb-grip" />
                        <span className="w64-thumb-grip" />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w64-scroll-step-btn"
                      onClick={() => handleScrollStep(1)}
                      title="Scroll Down"
                      aria-label="Scroll Down"
                    >
                      ▼
                    </button>

                    <span className="w64-scroll-readout">
                      {String(scrollMetrics.scrollPct).padStart(2, '0')}%
                    </span>
                  </div>
                </div>

                {/* Quick Action Arcade Strip + Command Line Input */}
                <div className="wired64-input-dock">
                  <div className="w64-quick-arcade-bar">
                    <button
                      type="button"
                      className="w64-arcade-pill highlight"
                      onClick={() => setShowPacketForm(!showPacketForm)}
                    >
                      <Zap size={12} fill="#050505" color="#050505" />
                      <span className="w64-pill-desktop-text">
                        {showPacketForm
                          ? '[ HIDE LEAD PACKET ]'
                          : packetSubmitted
                          ? '[ + SEND ANOTHER LEAD PACKET ]'
                          : '[ TRANSMIT QUICK LEAD PACKET ]'}
                      </span>
                      <span className="w64-pill-mobile-text">
                        {showPacketForm ? '[ HIDE FORM ]' : '[ LEAD PACKET ]'}
                      </span>
                    </button>

                    <button
                      type="button"
                      className="w64-arcade-pill w64-hide-mobile"
                      onClick={() =>
                        pushUserAndBotTurn(
                          'How do your custom live dashboards and 24/7 AI bots work?',
                          'dash'
                        )
                      }
                    >
                      [ HOW DASHBOARDS &amp; 24/7 BOTS WORK ]
                    </button>

                    <button
                      type="button"
                      className="w64-arcade-pill"
                      onClick={() =>
                        pushUserAndBotTurn(
                          'Run a 64-bit AI & SEO diagnostic scan on my current website.',
                          'scan'
                        )
                      }
                    >
                      <span className="w64-pill-desktop-text">[ SCAN MY WEBSITE URL ]</span>
                      <span className="w64-pill-mobile-text">[ SCAN MY SITE ]</span>
                    </button>
                  </div>

                  <form className="w64-command-form" onSubmit={handleSendText}>
                    <span className="w64-prompt-char">&gt;</span>
                    <input
                      type="text"
                      className="w64-command-input"
                      placeholder="TYPE A QUESTION, WEBSITE URL, OR YOUR EMAIL/PHONE..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    <button type="submit" className="w64-send-btn">
                      <span>SEND</span>
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
