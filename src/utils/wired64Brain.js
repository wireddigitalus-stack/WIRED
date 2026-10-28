// ============================================================================
// WIRED-64 BRAIN — pure, testable answer logic for the orb chatbot.
// No React / DOM here. Used by WiredOrbChatbot.jsx and scripts/test-wired64.mjs
//
// Voice rules:
//  • ≤ 45 words per reply: 1 answer line + up to 3 short bullets
//  • plain English, short "TOPIC //" heading, light humor ~1 in 3 replies
//  • max 2 chips per reply
//  • answer first; ask for name → email/phone only after 3 questions
//    (max 2 asks per visit, never blocks answers)
// ============================================================================

export const PHONE = '731-616-5121';
export const EMAIL = 'WiredDigitalUS@gmail.com';

// ------------------------------------------------------------- extractors
export function extractEmail(str = '') {
  const m = String(str).match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : null;
}

export function extractPhone(str = '') {
  const m = String(str).match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return m ? m[0] : null;
}

const URL_RE =
  /\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]{2,}\.(?:com|net|org|io|co|us|ai|biz|info|tv|me|dev|app)\b(?:\/[^\s]*)?/i;

export function extractDomainUrl(str = '') {
  const withoutEmails = String(str).replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
  const m = withoutEmails.match(URL_RE);
  return m ? m[0] : null;
}

// Whole-word / whole-phrase matcher ("rate" ≠ "accurate", "edit" ≠ "credit")
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function has(text, words) {
  return words.some((w) => new RegExp(`(?:^|[^a-z0-9])${escapeRe(w)}(?:$|[^a-z0-9])`, 'i').test(text));
}

const wordCount = (s = '') => String(s).split(/\s+/).filter(Boolean).length;

// ------------------------------------------------------------------ state
export function createChatState() {
  return {
    step: 'IDLE', // IDLE | ASK_NAME | ASK_CONTACT | ASK_URL | COMPLETED
    questionCount: 0,
    asksMade: 0,
    nextAskAt: 3,
    lastTopic: 'general',
    questions: [],
    name: '',
    contact: '',
    service: '',
    captured: false
  };
}

const MAX_ASKS = 2;
const RE_ASK_GAP = 2;

// ------------------------------------------------------------- chips
const CHIP = {
  pricing: { label: '💎 PRICING', prompt: 'How much does a website cost?', cartridge: 'geo' },
  timeline: { label: '⏱️ HOW LONG?', prompt: 'How long does a website take?', cartridge: 'geo' },
  example: { label: '🚗 REAL EXAMPLE', prompt: 'Show me the Fast Track dashboard.', cartridge: 'dash' },
  law: { label: '⚖️ LAW FIRM EXAMPLE', prompt: 'Tell me about the Ringger Law build.', cartridge: 'dash' },
  chatbot: { label: '🤖 AI CHATBOTS', prompt: 'Tell me about AI chatbots.', cartridge: 'dash' },
  geo: { label: '⚡ WHAT IS GEO?', prompt: 'What is GEO?', cartridge: 'geo' },
  scan: { label: '🔍 CHECK MY SITE', prompt: 'Check my current website.', cartridge: 'scan' },
  video: { label: '🎬 MUSIC VIDEOS', prompt: 'Tell me about music video editing.', cartridge: 'video' },
  videoPrice: { label: '💵 VIDEO PRICING', prompt: 'How much is a lyric video?', cartridge: 'video' },
  contact: { label: '📞 TALK TO ROB', prompt: 'How do I contact Rob?', cartridge: 'geo' },
  work: { label: '🗂️ OUR WORK', prompt: 'Who have you worked with?', cartridge: 'dash' },
  notYet: { label: 'NOT YET', prompt: 'Not yet', cartridge: null }
};

// ------------------------------------------------------------- topics
// Ordered: specific before generic. `test(lower)` → reply builder.
const SERVICE = {
  web: 'AI Website Design, Redesign & Modernization',
  dash: 'Custom Live Dashboard / 24/7 AI Lead Chatbot',
  geo: 'AI Search (GEO), Local SEO & Full-Service Marketing',
  video: 'Global Remote Music & Lyric Video Editing'
};

const PRICE_WORDS = ['price', 'prices', 'pricing', 'cost', 'costs', 'how much', 'budget', 'rate', 'rates', 'quote', 'cheap', 'expensive', 'afford', 'package', 'packages', 'tier', 'tiers'];
const VIDEO_WORDS = ['video', 'videos', 'lyric', 'lyrics', 'music video', 'visualizer', 'visualizers', 'video editing', 'video editor', 'band', 'artist', 'record label', 'song', 'album'];

const TOPICS = [
  {
    id: 'identity',
    counts: true,
    test: (t) => has(t, ['are you a bot', 'are you real', 'are you human', 'are you ai', 'who are you', 'what are you']),
    build: () => ({
      cartridge: 'geo',
      reply: "WHO AM I //\nI'm WIRED-64, the site's bot. Rob is the human.\nHe's better at small talk. I'm better at 2 a.m.",
      chips: [CHIP.pricing, CHIP.contact]
    })
  },
  {
    id: 'videoPricing',
    counts: true,
    service: 'video',
    test: (t) => has(t, PRICE_WORDS) && has(t, VIDEO_WORDS),
    build: () => ({
      cartridge: 'video',
      reply:
        'VIDEO PRICING //\nQuoted per track, based on the edit and animation.\n• Most lyric videos: 1–3 weeks\n• 100% remote, delivered in 4K\nSend the track title and Rob will quote it.',
      chips: [CHIP.video, CHIP.contact]
    })
  },
  {
    id: 'pricing',
    counts: true,
    service: 'web',
    test: (t) => has(t, PRICE_WORDS),
    build: () => ({
      cartridge: 'geo',
      reply:
        'PRICING //\nFlat-rate, no monthly retainer.\n• Website or redesign: $1,850–$3,500\n• Website + AI chatbot: $3,500–$6,500\n• Custom dashboard platform: $5,500–$12,000+\nCheaper than a used truck, and it brings in more business.',
      chips: [CHIP.timeline, CHIP.example]
    })
  },
  {
    id: 'timeline',
    counts: true,
    service: 'web',
    test: (t) => has(t, ['how long', 'timeline', 'turnaround', 'how fast', 'how quickly', 'when can', 'process', 'steps', 'weeks']),
    build: () => ({
      cartridge: 'geo',
      reply:
        'TIMELINE //\nMost websites launch in 2–4 weeks.\n• Dashboards or AI chatbots: 3–6 weeks\n• Live preview link the whole time\n• Music videos: usually 1–3 weeks\nFaster than most WordPress plugin updates.',
      chips: [CHIP.pricing, CHIP.example]
    })
  },
  {
    id: 'fasttrack',
    counts: true,
    service: 'dash',
    test: (t) => has(t, ['fast track', 'fasttrack', 'dealership', 'dealerships', 'dealer', 'dealers', 'car lot', 'car dealer', 'cars', 'auto', 'automotive']),
    build: () => ({
      cartridge: 'dash',
      reply:
        'FAST TRACK AUTOMOTIVE //\nNew dealership site + a live dashboard for the owner.\n• 2,751+ visits in 30 days\n• 47 credit applications\n• Live "hottest vehicles" ranking',
      chips: [CHIP.law, CHIP.pricing]
    })
  },
  {
    id: 'ringger',
    counts: true,
    service: 'dash',
    test: (t) => has(t, ['ringger', 'law firm', 'law', 'attorney', 'attorneys', 'lawyer', 'lawyers', 'legal', 'bankruptcy']),
    build: () => ({
      cartridge: 'dash',
      reply:
        'RINGGER LAW //\nLegal site + 24/7 AI triage + attorney CRM for a Jackson, TN firm.\n• Flags urgent foreclosure and repo cases\n• Signed intake packets online\n• 3,800+ sessions tracked in 90 days',
      chips: [CHIP.example, CHIP.pricing]
    })
  },
  {
    id: 'teamvision',
    counts: true,
    service: 'dash',
    test: (t) => has(t, ['team vision', 'teamvision', 'ask vision']),
    build: () => ({
      cartridge: 'dash',
      reply:
        'TEAM VISION //\nA downtown Bristol real estate site with an AI assistant that helps tenants find space, any time of day.',
      chips: [CHIP.chatbot, CHIP.pricing]
    })
  },
  {
    id: 'chatbot',
    counts: true,
    service: 'dash',
    test: (t) =>
      has(t, ['chatbot', 'chatbots', 'chat bot', 'ai bot', 'bot', 'bots', 'ai assistant', 'assistant', 'concierge', 'advisor', 'chat widget', 'live chat']),
    build: () => ({
      cartridge: 'dash',
      reply:
        "AI CHATBOTS //\nA bot trained on your business that answers customers at 2 a.m.\n• Knows your services, pricing and FAQs\n• Sends qualified leads to your phone\nI'm one, so I'm a little biased.",
      chips: [CHIP.law, CHIP.pricing]
    })
  },
  {
    id: 'dashboard',
    counts: true,
    service: 'dash',
    test: (t) => has(t, ['dashboard', 'dashboards', 'admin', 'crm', 'analytics', 'tracking', 'telemetry', 'leads tracking', 'portal']),
    build: () => ({
      cartridge: 'dash',
      reply:
        'DASHBOARDS //\nA private dashboard that shows what your website is actually doing.\n• Live visitors, clicks, calls and leads\n• Instant lead alerts to your phone\n• No per-seat software fees',
      chips: [CHIP.example, CHIP.pricing]
    })
  },
  {
    id: 'scanRequest',
    counts: true,
    service: 'web',
    test: (t) => has(t, ['scan', 'audit', 'check my site', 'check my website', 'check my current website', 'test my site', 'grade my site', 'diagnostic']),
    build: () => ({
      cartridge: 'scan',
      step: 'ASK_URL',
      reply: "SITE CHECK //\nType your website address (like yourbusiness.com) and I'll take a quick look.",
      chips: []
    })
  },
  {
    id: 'geo',
    counts: true,
    service: 'geo',
    test: (t) =>
      has(t, ['geo', 'seo', 'google', 'chatgpt', 'gemini', 'perplexity', 'ai search', 'search', 'rank', 'ranking', 'rankings', 'map pack', 'local seo', 'found online', 'show up']),
    build: () => ({
      cartridge: 'geo',
      reply:
        'SEO + GEO //\nSEO gets you on Google. GEO gets you mentioned when people ask ChatGPT or Google AI.\n• Pages and business data AI can read\n• Google Business Profile tuned locally\n• Every site we build includes both',
      chips: [CHIP.scan, CHIP.pricing]
    })
  },
  {
    id: 'music',
    counts: true,
    service: 'video',
    test: (t) =>
      has(t, VIDEO_WORDS) ||
      has(t, ['halestorm', 'alice cooper', 'def leppard', 'primary wave', 'scorpions', 'vevo', '4k']),
    build: () => ({
      cartridge: 'video',
      reply:
        'MUSIC VIDEOS //\nRemote music videos, lyric videos and visualizers since 2015.\n• Primary Wave, Alice Cooper, Halestorm and more\n• 100% remote, delivered in 4K\n• Most edits in 1–3 weeks',
      chips: [CHIP.videoPrice, CHIP.contact]
    })
  },
  {
    id: 'website',
    counts: true,
    service: 'web',
    test: (t) =>
      has(t, ['website', 'websites', 'web site', 'site', 'web design', 'redesign', 'rebuild', 'modernize', 'wordpress', 'wix', 'squarespace', 'godaddy', 'slow', 'speed', 'landing page', 'ecommerce', 'e-commerce', 'shopify', 'online store', 'app', 'apps']),
    build: (t) => ({
      cartridge: 'geo',
      reply: has(t, ['wordpress', 'wix', 'squarespace', 'godaddy'])
        ? "WEBSITES //\nWe rebuild template sites into fast, custom ones.\n• Mobile-first, built to rank\n• We keep your Google rankings during the move\nWordPress is fine. Its 30 plugins are another story."
        : 'WEBSITES //\nCustom, fast websites, or a rebuild of the one you have.\n• Mobile-first, built to rank\n• We keep your Google rankings during a redesign\n• Code you own, no plugin subscriptions',
      chips: [CHIP.pricing, CHIP.scan]
    })
  },
  {
    id: 'clients',
    counts: true,
    test: (t) => has(t, ['clients', 'client', 'portfolio', 'examples', 'example', 'worked with', 'your work', 'case study', 'case studies', 'legends']),
    build: () => ({
      cartridge: 'dash',
      reply:
        'OUR WORK //\nWeb: Fast Track Automotive, Ringger Law and more across TN and VA.\nMusic: Primary Wave, Alice Cooper, Halestorm, Def Leppard and 30+ other legends.',
      chips: [CHIP.example, CHIP.video]
    })
  },
  {
    id: 'contact',
    counts: true,
    test: (t) =>
      has(t, ['phone', 'call', 'text', 'email', 'contact', 'reach', 'number', 'talk to', 'speak to', 'meet', 'appointment', 'consultation', 'book']),
    build: () => ({
      cartridge: 'geo',
      reply: `TALK TO ROB //\nFastest: type your email or phone right here.\n• Call or text: ${PHONE}\n• Email: ${EMAIL}`,
      chips: [CHIP.pricing]
    })
  },
  {
    id: 'location',
    counts: true,
    test: (t) =>
      has(t, ['where', 'located', 'location', 'bristol', 'johnson city', 'kingsport', 'abingdon', 'tri-cities', 'tricities', 'near me', 'local']),
    build: () => ({
      cartridge: 'geo',
      reply:
        'WHERE //\nBristol, on the VA/TN line.\n• We serve Bristol, Johnson City, Kingsport and Abingdon\n• Happy to meet in person\n• Clients nationwide, too',
      chips: [CHIP.pricing, CHIP.contact]
    })
  },
  {
    id: 'about',
    counts: true,
    test: (t) =>
      has(t, ['rob', 'neilson', 'founder', 'owner', 'about', 'history', '1999', 'experience', 'who', 'team', 'company', 'wired digital']),
    build: () => ({
      cartridge: 'geo',
      reply:
        'ABOUT //\nRob Neilson started Wired Digital in 1999 in Jackson, TN.\n• Based in Bristol, VA/TN since 2022\n• Music video editor since 2015\n• You work with Rob directly, start to finish',
      chips: [CHIP.work, CHIP.contact]
    })
  },
  {
    id: 'marketing',
    counts: true,
    service: 'geo',
    test: (t) =>
      has(t, ['marketing', 'ads', 'advertising', 'social', 'social media', 'facebook', 'instagram', 'brand', 'branding', 'logo']),
    build: () => ({
      cartridge: 'geo',
      reply:
        'MARKETING //\nLocal SEO, Google Business Profile, ads and short-form video.\n• Monthly plans: $350–$1,250\n• No long-term contract\n• Tracked to real calls and leads',
      chips: [CHIP.geo, CHIP.pricing]
    })
  },
  {
    id: 'blog',
    counts: true,
    test: (t) => has(t, ['blog', 'article', 'articles', 'read more', 'guide']),
    build: () => ({
      cartridge: 'geo',
      reply:
        'BLOG //\nFresh reads at wireddigitalcreative.com/blog.\n• What a website costs in the Tri-Cities\n• Fast Track: 30 days of dashboard data',
      chips: [CHIP.pricing, CHIP.example]
    })
  }
];

const FALLBACK = {
  id: 'fallback',
  counts: true,
  build: () => ({
    cartridge: 'geo',
    reply: `HMM //\nI'm better at websites, pricing, AI chatbots and music videos than philosophy.\nTry one of these, or ask Rob: ${PHONE}.`,
    chips: [CHIP.pricing, CHIP.chatbot]
  })
};

const isGreeting = (t) =>
  t.length <= 24 && has(t, ['hi', 'hello', 'hey', 'yo', 'sup', 'howdy', 'good morning', 'good afternoon', 'good evening']);
const isThanks = (t) =>
  t.length <= 40 && has(t, ['thanks', 'thank you', 'thx', 'ty', 'cool', 'awesome', 'great', 'perfect', 'ok', 'okay', 'got it']);
const isDecline = (t) =>
  has(t, ['not yet', 'no', 'nope', 'nah', 'later', 'skip', 'no thanks', 'maybe later', 'not now', 'pass']);
const looksLikeQuestion = (t) =>
  t.includes('?') ||
  /^(what|how|why|when|where|who|which|can|could|do|does|is|are|will|would|should|tell|show|explain)\b/i.test(t);

function cleanName(input) {
  const stripped = String(input)
    .replace(/^(hi|hey|hello)[,!.\s]+/i, '')
    .replace(/^(my name is|my name's|name is|i am|i'm|im|it's|its|this is|call me)\s+/i, '')
    .replace(/[^a-zA-Z' .-]/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(' ');
  return stripped
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// ------------------------------------------------------- main responder
/**
 * @returns {{
 *   reply: string, subtext?: string, subtextLabel?: string, chips: object[],
 *   topic: string, cartridge: string|null, state: object,
 *   autoSubmitLead?: boolean, scanUrl?: string, leadAsk?: boolean
 * }}
 */
export function wired64Respond(input, prevState = createChatState()) {
  const q = String(input || '').trim();
  const lower = q.toLowerCase();
  const state = { ...prevState, questions: [...(prevState.questions || [])] };

  const email = extractEmail(q);
  const phone = extractPhone(q);
  const url = extractDomainUrl(q);

  // 1. Contact info at any time → save the lead
  if (email || phone) {
    const contact = [email, phone].filter(Boolean).join(' • ');
    let name = state.name;
    if (!name) {
      const leftover = q.replace(email || '', '').replace(phone || '', '').replace(/[,•|-]/g, ' ').trim();
      name = leftover && !looksLikeQuestion(leftover) ? cleanName(leftover) : '';
    }
    Object.assign(state, { contact, name, step: 'COMPLETED', captured: true });
    return {
      topic: 'captured',
      cartridge: null,
      reply: `GOT IT //\nThanks${name ? `, ${name.split(' ')[0]}` : ''}. Rob will reach out soon.\nAsk me anything else in the meantime.`,
      chips: [CHIP.pricing, CHIP.example],
      autoSubmitLead: true,
      state
    };
  }

  // 2. Mid lead-flow handling
  if (state.step === 'ASK_NAME' && !url) {
    if (isDecline(lower)) {
      Object.assign(state, { step: 'IDLE', nextAskAt: state.questionCount + RE_ASK_GAP });
      return { topic: 'declined', cartridge: null, reply: 'NO PROBLEM //\nAsk away. I only bite WordPress sites.', chips: [CHIP.pricing, CHIP.chatbot], state };
    }
    if (!looksLikeQuestion(q) && wordCount(q) <= 6) {
      const name = cleanName(q);
      if (name) {
        Object.assign(state, { name, step: 'ASK_CONTACT' });
        return {
          topic: 'askContact',
          cartridge: null,
          reply: `NICE TO MEET YOU //\nThanks, ${name.split(' ')[0]}. Best email or phone for Rob?`,
          chips: [CHIP.notYet],
          leadAsk: true,
          state
        };
      }
    }
    // They asked something else instead → answer it, re-ask later
    Object.assign(state, { step: 'IDLE', nextAskAt: state.questionCount + 1 + RE_ASK_GAP });
  } else if (state.step === 'ASK_CONTACT' && !url) {
    if (isDecline(lower)) {
      Object.assign(state, { step: 'IDLE', nextAskAt: state.questionCount + RE_ASK_GAP });
      return { topic: 'declined', cartridge: null, reply: 'ALL GOOD //\nAsk away. Rob is on standby either way.', chips: [CHIP.pricing, CHIP.example], state };
    }
    if (!looksLikeQuestion(q) && wordCount(q) <= 4) {
      return {
        topic: 'askContact',
        cartridge: null,
        reply: "HMM //\nThat doesn't look like an email or phone. Try name@company.com or 423-555-0199.",
        chips: [CHIP.notYet],
        leadAsk: true,
        state
      };
    }
    Object.assign(state, { step: 'IDLE', nextAskAt: state.questionCount + 1 + RE_ASK_GAP });
  }

  // 3. Small talk (doesn't count toward the 3 questions)
  if (isGreeting(lower) && !url) {
    return {
      topic: 'greeting',
      cartridge: null,
      reply: "HEY //\nI'm WIRED-64. Ask me about websites, pricing, AI chatbots or music videos.",
      chips: [CHIP.pricing, CHIP.chatbot],
      state
    };
  }
  if (isThanks(lower) && !looksLikeQuestion(q) && !url) {
    return { topic: 'thanks', cartridge: null, reply: 'ANYTIME //\nThat is literally my only job.', chips: [CHIP.pricing, CHIP.contact], state };
  }

  // 4. Website address → real site check (component runs the async diagnostic)
  let result;
  let topicId;
  let service;
  if (url) {
    topicId = 'scan';
    service = 'web';
    const domain = url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].toLowerCase();
    result = { cartridge: 'scan', reply: `SITE CHECK //\nTaking a quick look at ${domain}…`, chips: [], scanUrl: url };
    state.step = 'IDLE';
  } else {
    const topic = TOPICS.find((t) => t.test(lower)) || FALLBACK;
    topicId = topic.id;
    service = topic.service;
    result = topic.build(lower);
    state.step = result.step || 'IDLE';
  }

  state.questionCount += 1;
  state.questions.push(q);
  state.lastTopic = topicId;
  if (service) state.service = SERVICE[service];

  const out = {
    topic: topicId,
    cartridge: result.cartridge || null,
    reply: result.reply,
    chips: (result.chips || []).slice(0, 2),
    scanUrl: result.scanUrl,
    state
  };

  // 5. Friendly ask after the 3rd question (max 2 asks, never blocks)
  if (
    !state.captured &&
    state.step === 'IDLE' &&
    state.asksMade < MAX_ASKS &&
    state.questionCount >= state.nextAskAt
  ) {
    state.asksMade += 1;
    if (state.name) {
      state.step = 'ASK_CONTACT';
      out.subtext = `Want Rob to follow up with real numbers, ${state.name.split(' ')[0]}? Best email or phone?`;
    } else {
      state.step = 'ASK_NAME';
      out.subtext = "Quick one so Rob can follow up with real numbers: what's your name?";
    }
    out.subtextLabel = 'QUICK ONE //';
    out.chips = [CHIP.notYet];
    out.leadAsk = true;
  }

  return out;
}

// --------------------------------------------------- site check summary
const PLAIN_CHECK = {
  'Mobile & Edge Speed': 'Mobile speed',
  'AI Entity Schema (JSON-LD)': 'Business data for Google & AI',
  'ChatGPT & Google AI Citations': 'Ready for AI search',
  '24/7 AI Bot & Live Admin Dash': 'Lead capture (chat / dashboard)'
};

export function formatScanSummary(report) {
  if (!report) {
    return `SITE CHECK //\nI couldn't read that address. Double-check it, or ask Rob for a full audit: ${PHONE}.`;
  }
  const domain = report.domain;
  if (report.estimated) {
    return `SITE CHECK // ${domain}\nThat site blocks outside checks, so I can't read it from here.\n• Rob can run a full audit for free`;
  }
  const checks = report.metrics || [];
  const passed = checks.filter((m) => m.passed).length;
  if (report.isVerifiedWired) {
    return `SITE CHECK // ${domain}\nThis one's ours, so we're biased: ${passed}/${checks.length} checks passed.`;
  }
  const lines = checks
    .slice(0, 4)
    .map((m) => `• ${m.passed ? '✓' : '✗'} ${PLAIN_CHECK[m.label] || m.label}`);
  return `SITE CHECK // ${domain}\n${passed} of ${checks.length} checks passed.\n${lines.join('\n')}`;
}

export const WIRED64_INTRO = {
  text: "WIRED-64 //\nShort answers, no sales pitch. Rob handles that part.\nAsk about websites, pricing, AI chatbots or music videos.",
  chips: [
    { label: '💎 PRICING', prompt: 'How much does a website cost?', cartridge: 'geo' },
    { label: '⏱️ HOW LONG?', prompt: 'How long does a website take?', cartridge: 'geo' },
    { label: '🤖 AI CHATBOTS', prompt: 'Tell me about AI chatbots.', cartridge: 'dash' },
    { label: '🎬 MUSIC VIDEOS', prompt: 'Tell me about music video editing.', cartridge: 'video' }
  ]
};

export const _test = { has, wordCount, cleanName, TOPICS };
