// ============================================================================
// SEO PAGES — single source of truth for every indexable URL on the site.
// Used by BOTH the React app (titles, canonicals, on-page intro sections) and
// scripts/prerender.mjs (build-time static HTML for Google + AI crawlers that
// do not execute JavaScript). Keep this file free of JSX / browser APIs.
// Rules: title <= 60 chars, description <= 155 chars, unique copy per page.
// ============================================================================

export const SITE_BASE = 'https://www.wireddigitalcreative.com';

export const BUSINESS_FACTS = {
  name: 'Wired Digital',
  legalName: 'Wired Digital LLC',
  founder: 'Rob Neilson',
  phone: '731-616-5121',
  phoneHref: 'tel:+17316165121',
  email: 'WiredDigitalUS@gmail.com',
  hq: 'Bristol, VA/TN (Tri-Cities)'
};

const PRICING_SECTION = {
  h2: 'Straightforward, flat-rate pricing',
  body: [
    'Every project is quoted flat-rate after a free consultation, with no forced monthly retainer.'
  ],
  bullets: [
    'Local Launch & Website Modernization: $1,850 – $3,500',
    'Growth Website + 24/7 AI Lead Chatbot: $3,500 – $6,500',
    'Custom Platform + Live Admin Dashboard: $5,500 – $12,000+'
  ]
};

export const SEO_PAGES = [
  // ------------------------------------------------------------------ HOME
  {
    id: 'root',
    kind: 'home',
    path: '/',
    legacy: [],
    tab: 'home',
    section: null,
    showIntro: false,
    breadcrumb: 'Home',
    title: 'Website Design Bristol TN/VA & Tri-Cities | Wired Digital',
    description:
      'Custom websites, AI chatbots, live business dashboards and local SEO for Bristol, Johnson City, Kingsport and Abingdon. Plus 4K music video. Est. 1999.',
    eyebrow: 'Wired Digital Creative • Bristol, VA/TN • Est. 1999',
    h1: 'Website Design, AI Chatbots & Local SEO in Bristol and the Tri-Cities',
    intro: [
      'Wired Digital Creative is a Bristol, VA/TN studio run by Creative Director Rob Neilson. We design fast custom websites, train 24/7 AI chatbots on your business, build live admin dashboards, and set up the local SEO and AI-search structure that helps Google, ChatGPT and Perplexity understand and recommend you.',
      'The studio was founded in Jackson, TN in 1999, has worked full-time in the music industry since 2015, and moved its headquarters to Bristol in 2022. You work directly with Rob, with no account managers or middlemen.'
    ],
    sections: [
      {
        h2: 'What we build',
        bullets: [
          'Custom website design and redesign of slow WordPress, Wix or Squarespace sites',
          'Custom-trained 24/7 AI chatbots that answer questions and capture leads',
          'Live admin dashboards that show visitors, clicks, calls and leads in real time',
          'Local SEO and AI-search (GEO) setup for the Tri-Cities and beyond',
          'Full-service marketing, ad creative and social video',
          'Remote 4K music video and official lyric video editing'
        ]
      },
      {
        h2: 'Proven on live Tri-Cities and Tennessee businesses',
        body: [
          'Fast Track Automotive in Bristol, TN logged 2,751+ visits, 1,719 vehicle clicks and 47 online credit applications in its first 30 days, all tracked in a custom admin dashboard we built.',
          'Team Vision LLC in downtown Bristol uses our custom-trained "Ask VISION" AI advisor to match tenants to commercial spaces in under two minutes, day or night.',
          'Ringger Law in Jackson, TN runs on our legal website, 24/7 debt-triage chatbot and live attorney CRM, with 3,800+ tracked sessions in a 90-day sample.'
        ]
      },
      {
        h2: 'Music industry credentials',
        body: [
          'Since 2015 Rob has edited music videos, lyric videos and visualizers for Primary Wave and 34+ legendary artists and catalogs, including Alice Cooper, Halestorm, Def Leppard, Scorpions, Whitney Houston and Johnny Cash.'
        ]
      },
      PRICING_SECTION
    ],
    faqs: [
      {
        q: 'Where is Wired Digital Creative located?',
        a: 'We are headquartered in Bristol on the Virginia/Tennessee state line and serve Bristol, Johnson City, Kingsport, Abingdon and clients nationwide.'
      },
      {
        q: 'How long does a new website take?',
        a: 'Most custom websites launch in 2 to 4 weeks. Projects with a live admin dashboard or AI chatbot usually take 3 to 6 weeks.'
      },
      {
        q: 'Who will I work with?',
        a: 'You work directly with founder and Creative Director Rob Neilson from first call to launch.'
      }
    ]
  },

  // -------------------------------------------------------------- SERVICES
  {
    id: 'view-web-design',
    kind: 'service',
    path: '/web-design/',
    legacy: ['?view=web-design'],
    tab: 'web',
    section: null,
    showIntro: false,
    breadcrumb: 'Website Design',
    serviceType: 'Website design and redesign',
    title: 'Website Design & Redesign in the Tri-Cities | Wired Digital',
    description:
      'Custom website design and modernization for Bristol, Johnson City, Kingsport and Abingdon businesses. Fast, mobile-first, built for Google and AI search.',
    eyebrow: 'Website Design, Redesign & Modernization',
    h1: 'Custom Website Design and Redesign for Tri-Cities Businesses',
    intro: [
      'An outdated template site loses visitors on phones and gives Google and AI assistants very little to work with. We design and hand-code fast, mobile-first websites that load quickly, explain clearly what you do, and turn visitors into calls and form leads.',
      'Every build includes the structured data, page titles and local signals that help Google, ChatGPT, Gemini and Perplexity understand who you are, where you work and what you offer.'
    ],
    sections: [
      {
        h2: "What's included",
        bullets: [
          'Custom design around your brand: no off-the-shelf templates',
          'Mobile-first layout tuned for fast load times and Core Web Vitals',
          'Clear service pages, calls to action and lead forms that go straight to your phone',
          'Schema.org structured data, sitemap and llms.txt for search and AI engines',
          'Optional 24/7 AI chatbot and live admin dashboard',
          'Code you own, with no plugin subscriptions'
        ]
      },
      {
        h2: 'Redesigning an existing site',
        body: [
          'If you already have a WordPress, Wix or Squarespace site, we audit what is working, keep the content and rankings worth keeping, and rebuild the rest. Old URLs are redirected so you do not lose search traffic during the move.'
        ]
      },
      {
        h2: 'How a project runs',
        bullets: [
          'Days 1–4: discovery call, site audit and page plan with Rob',
          'Weeks 1–3: design and build on a live preview link you can review anytime',
          'Launch: deployment, search console setup and a walkthrough of your new site'
        ]
      },
      PRICING_SECTION
    ],
    faqs: [
      {
        q: 'Do you work with WordPress?',
        a: 'We usually replace WordPress with a faster custom build, but we can migrate your content and keep your existing URLs and rankings.'
      },
      {
        q: 'Will I be able to update my site?',
        a: 'Yes. We can include a simple admin panel for the content you change most, or handle updates for you.'
      }
    ]
  },
  {
    id: 'view-full-service-marketing',
    kind: 'service',
    path: '/marketing/',
    legacy: ['?view=full-service-marketing'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Marketing',
    serviceType: 'Digital marketing',
    title: 'Digital Marketing & Local SEO, Tri-Cities | Wired Digital',
    description:
      'Local SEO, Google Business Profile, AI-search visibility, ad creative and video marketing for Bristol, Johnson City, Kingsport and Abingdon businesses.',
    eyebrow: 'Full-Service Marketing',
    h1: 'Digital Marketing, Local SEO and Video Ads for Tri-Cities Businesses',
    intro: [
      'A good website only pays off when the right people find it. We handle the marketing around it: local SEO, Google Business Profile, AI-search visibility, ad creative and social video, all measured against the leads your site actually receives.',
      'Because design, development, video and marketing happen under one roof, your campaigns, landing pages and tracking are built to work together instead of being stitched across several vendors.'
    ],
    sections: [
      {
        h2: 'Marketing services',
        bullets: [
          'Local SEO and Google Business Profile optimization for the Tri-Cities',
          'AI-search (GEO) visibility in Google AI Overviews, ChatGPT and Perplexity',
          'Paid search and social ad creative, including short-form video',
          'Landing pages built for a single offer and a single action',
          'Lead tracking so you can see which channels produce calls and forms'
        ]
      },
      {
        h2: 'Video that stands out',
        body: [
          'Our video work comes from the music industry, where Rob has edited for Primary Wave and dozens of legendary artists. That same production quality goes into your ads, reels and brand videos.'
        ]
      },
      {
        h2: 'Monthly plans',
        body: [
          'Ongoing SEO, AI-search and marketing support typically runs $350 to $1,250 per month, with no long-term contract required.'
        ]
      }
    ],
    faqs: [
      {
        q: 'What is GEO?',
        a: 'Generative Engine Optimization means structuring your website and business information so AI assistants like ChatGPT, Gemini and Google AI Overviews can understand and cite your business.'
      },
      {
        q: 'Do I need a long-term contract?',
        a: 'No. Monthly marketing plans can be paused or cancelled at any time.'
      }
    ]
  },
  {
    id: 'view-custom-dashboards',
    kind: 'service',
    path: '/custom-dashboards/',
    legacy: ['?view=custom-dashboards'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Custom Dashboards',
    serviceType: 'Custom business dashboard development',
    title: 'Custom Business Dashboards & Lead CRM | Wired Digital',
    description:
      'Custom admin dashboards that show live website visitors, clicks, calls and leads. Built for Fast Track Automotive and Ringger Law. Bristol, VA/TN studio.',
    eyebrow: 'Custom Live Admin Dashboards',
    h1: 'Custom Live Admin Dashboards That Show What Your Website Is Doing',
    intro: [
      'Most business owners cannot see what happens on their website after someone visits. We build private admin dashboards, connected to your site, that show live visitor activity, the products or services people click most, phone taps, form leads and where your traffic comes from.',
      'Dashboards work on your phone and desktop, send instant lead alerts, and are built around the way your business actually operates.'
    ],
    sections: [
      {
        h2: 'What a dashboard can track',
        bullets: [
          'Live visitor activity and hourly traffic patterns',
          'Most-viewed vehicles, properties, products or services',
          'Phone taps, form submissions, credit or intake applications',
          'Traffic sources: Google, ads, direct visits and AI assistants',
          'Lead status, notes and CSV export for your team'
        ]
      },
      {
        h2: 'Real examples',
        body: [
          'Fast Track Automotive (Bristol, TN): live click stream, credit-app alerts and a "hottest vehicles on the lot" ranking. 2,751+ visits and 47 credit applications in the first 30 days.',
          'Ringger Law (Jackson, TN): attorney CRM that triages urgent foreclosure and repossession leads and tracks signed court intake packets.'
        ]
      },
      {
        h2: 'Pricing',
        body: [
          'Custom platforms with a live admin dashboard typically run $5,500 to $12,000+, quoted flat-rate after a free consultation.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Does a dashboard need a monthly software subscription?',
        a: 'No per-seat SaaS fees. The dashboard is custom-built for you; hosting and database costs are usually minimal.'
      },
      {
        q: 'Can it connect to my existing website?',
        a: 'Usually yes, though most clients pair a dashboard with a new or rebuilt site so tracking is accurate from day one.'
      }
    ]
  },
  {
    id: 'view-ai-chatbots',
    kind: 'service',
    path: '/ai-chatbots/',
    legacy: ['?view=ai-chatbots', '?view=ai-lead-chatbots'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'AI Chatbots',
    serviceType: 'Custom AI chatbot development',
    title: '24/7 AI Chatbots Trained on Your Business | Wired Digital',
    description:
      'Custom AI chatbots trained on your services, inventory or properties that answer questions and capture leads 24/7. Built for Team Vision and Ringger Law.',
    eyebrow: '24/7 Custom-Trained AI Chatbots',
    h1: 'AI Chatbots Trained on Your Business That Capture Leads 24/7',
    intro: [
      'Customers often have questions at night or on weekends, when nobody is available to answer. We build AI chatbots trained on your own services, inventory, properties, pricing rules and FAQs, so visitors get accurate answers right away and qualified leads reach your phone.',
      'Each chatbot is designed for one job, such as matching tenants to spaces, pre-qualifying legal clients or booking estimates, rather than being a generic chat widget.'
    ],
    sections: [
      {
        h2: 'How it works',
        bullets: [
          'Trained on your real business information, not generic internet data',
          'Asks a few short questions to understand what the visitor needs',
          'Recommends the right service, property or next step',
          'Collects name and contact details and sends them to you instantly',
          'Conversation transcripts saved to your dashboard'
        ]
      },
      {
        h2: 'Real examples',
        body: [
          'Team Vision LLC (downtown Bristol): the "Ask VISION" advisor knows every property in the portfolio, from 120 to 54,000 square feet, and matches tenants to spaces in under two minutes.',
          'Ringger Law (Jackson, TN): a 24/7 debt-triage assistant that identifies urgent foreclosure, repossession and garnishment cases and routes them for same-day callbacks.'
        ]
      },
      {
        h2: 'Pricing',
        body: [
          'A growth website with a custom-trained AI chatbot typically runs $3,500 to $6,500, quoted flat-rate.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Will the chatbot make things up?',
        a: 'It is restricted to the information we train it on and hands off to you when a question falls outside that.'
      },
      {
        q: 'Can I add a chatbot to my current site?',
        a: 'Yes. It can be embedded on most existing websites.'
      }
    ]
  },
  {
    id: 'view-video-production',
    kind: 'service',
    path: '/video-production/',
    legacy: ['?view=video-production'],
    tab: 'video',
    section: null,
    showIntro: false,
    breadcrumb: 'Video Production',
    serviceType: 'Music video and lyric video editing',
    title: 'Music Video & Lyric Video Editing | Wired Digital',
    description:
      'Remote 4K music video, official lyric video and visualizer editing for labels and artists, including Primary Wave, Alice Cooper and Halestorm. Since 2015.',
    eyebrow: 'Global Remote Video Production',
    h1: 'Remote Music Video, Lyric Video and Visualizer Editing',
    intro: [
      'Rob Neilson has worked full-time in the music industry since 2015, editing music videos, official lyric videos and visualizers for record labels, artist estates and catalog owners around the world.',
      'Work is delivered 100% remotely: send footage and audio from anywhere, review cuts online, and receive masters ready for YouTube, VEVO, streaming platforms and tour screens.'
    ],
    sections: [
      {
        h2: 'Video services',
        bullets: [
          'Music video editing and color',
          'Official animated and kinetic lyric videos',
          'Visualizers and album or catalog promos',
          'Tour, social and short-form promotional edits',
          'On-location directing for select projects'
        ]
      },
      {
        h2: 'Artists and labels',
        body: [
          'Clients include Primary Wave, eOne, Sony Music, Universal Music and Virgin Music, with projects for Alice Cooper, Halestorm, Def Leppard, Scorpions, Candlebox, Tesla, Whitney Houston, Johnny Cash and many more.'
        ]
      },
      {
        h2: 'Turnaround',
        body: [
          'Most lyric videos and music video edits are delivered in 1 to 3 weeks, depending on animation complexity. Pricing is quoted per track.'
        ]
      }
    ],
    faqs: [
      {
        q: 'Do you work with independent artists?',
        a: 'Yes. Independent artists, labels and estates are all welcome; quotes are based on the scope of each track.'
      }
    ]
  },
  {
    id: 'view-legends-vault',
    kind: 'service',
    path: '/legends/',
    legacy: ['?view=legends-vault', '?view=working-with-legends'],
    tab: 'legends',
    section: null,
    showIntro: false,
    breadcrumb: 'Legends',
    serviceType: 'Music industry creative services',
    title: 'Music Clients: Primary Wave, Alice Cooper | Wired Digital',
    description:
      'Artists, estates and labels Wired Digital Creative has created video and digital work for, including Primary Wave, Alice Cooper, Halestorm and Def Leppard.',
    eyebrow: 'Working With Legends',
    h1: 'Artists, Estates and Labels We Have Worked With',
    intro: [
      'Since 2015, Wired Digital Creative has produced music videos, lyric videos, visualizers and digital assets for record labels, catalog companies and 34+ legendary artists and estates.'
    ],
    sections: [
      {
        h2: 'Labels and catalogs',
        body: [
          'Primary Wave Music, Entertainment One (eOne), Sony Music, Universal Music, Virgin Music and Sun Record Company.'
        ]
      },
      {
        h2: 'Artists and estates',
        body: [
          'Alice Cooper, Def Leppard, Scorpions, Halestorm, Bad Company, Alice In Chains, Stone Temple Pilots, Godsmack, Disturbed, Skid Row, RATT, Extreme, Candlebox, Gin Blossoms, Jefferson Starship, Tesla, KISS, Boyz II Men, Whitney Houston, Olivia Newton-John, Fantasia, Paul Anka, Johnny Cash, Bing Crosby, Henry Mancini and the Count Basie Orchestra.'
        ]
      }
    ],
    faqs: []
  },

  // ---------------------------------------------------------------- CITIES
  {
    id: 'city-bristol',
    kind: 'city',
    path: '/bristol-tn-va-web-design/',
    legacy: ['?city=bristol-tn-va'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Bristol, TN & VA',
    cityName: 'Bristol',
    title: 'Website Design in Bristol, TN & VA | Wired Digital',
    description:
      'Bristol-based web design studio on the TN/VA state line. Custom websites, AI chatbots, dashboards and local SEO for Bristol businesses. Call 731-616-5121.',
    eyebrow: 'Bristol, TN & Bristol, VA • 37620 • 24201',
    h1: 'Website Design in Bristol, Tennessee and Virginia',
    intro: [
      'Wired Digital Creative has been headquartered in Bristol since 2022. We build custom websites, AI chatbots and live dashboards for businesses on both sides of State Street, from downtown shops and offices to the dealerships and service companies along Volunteer Parkway.',
      'Being local means we can meet in person, understand the Bristol market, and set up your Google Business Profile and local search signals for the way people here actually search.'
    ],
    sections: [
      {
        h2: 'Bristol businesses we have built for',
        body: [
          'Fast Track Automotive, 2528 Volunteer Parkway: a new dealership website plus a live admin dashboard that tracked 2,751+ visits, 1,719 vehicle clicks and 47 credit applications in its first 30 days.',
          'Team Vision LLC, downtown Bristol: a commercial real estate website with the "Ask VISION" AI advisor, trained on properties including Bristol CoWork, The Executive on State St and Centre Point.'
        ]
      },
      {
        h2: 'Services for Bristol businesses',
        bullets: [
          'New websites and redesigns of outdated sites',
          'Local SEO for Bristol TN and VA searches and the Google map pack',
          'AI chatbots that answer customers after hours',
          'Live dashboards for leads, calls and inventory',
          'Video ads and social content'
        ]
      },
      {
        h2: 'Areas we serve around Bristol',
        body: [
          'Downtown Bristol and State Street, Volunteer Parkway, The Pinnacle, Exit 5 and Exit 7 on I-81, Bluff City, Blountville and Washington County, VA.'
        ]
      },
      PRICING_SECTION
    ],
    faqs: [
      {
        q: 'Can we meet in person in Bristol?',
        a: 'Yes. Rob is based in Bristol and happy to meet locally for planning and launch sessions.'
      },
      {
        q: 'Do you serve both Bristol, TN and Bristol, VA?',
        a: 'Yes. We work with businesses on both sides of the state line and set up local search signals for each.'
      }
    ]
  },
  {
    id: 'city-johnson-city',
    kind: 'city',
    path: '/johnson-city-tn-web-design/',
    legacy: ['?city=johnson-city-tn'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Johnson City, TN',
    cityName: 'Johnson City',
    title: 'Website Design in Johnson City, TN | Wired Digital',
    description:
      'Custom website design, AI chatbots and local SEO for Johnson City, TN medical practices, contractors and professional firms. Free consultation.',
    eyebrow: 'Johnson City, TN • 37601 • 37604 • 37615',
    h1: 'Website Design for Johnson City, Tennessee Businesses',
    intro: [
      'Johnson City has a busy mix of medical and dental practices, professional firms, contractors and growing local brands, and buyers compare options on their phones before they call. We build fast, clear websites that show why you are the right choice and make it easy to book or call.',
      'Our studio is about 25 minutes away in Bristol, so we can meet in person and understand the local market.'
    ],
    sections: [
      {
        h2: 'Popular projects for Johnson City',
        bullets: [
          'Medical and dental practice websites with clear service pages and online intake',
          'Contractor and home-service sites with quote forms and service-area pages',
          'Professional firm websites with credentials and plain-language FAQs',
          '24/7 AI chatbots that answer common questions and pre-qualify leads',
          'Local SEO for Johnson City searches and the Google map pack'
        ]
      },
      {
        h2: 'Why it matters for local search',
        body: [
          'People in Johnson City increasingly ask Google and AI assistants questions like "best dentist near me" or "who builds websites in Johnson City." Clear service pages, accurate business information and structured data help your business show up in those answers.'
        ]
      },
      {
        h2: 'Areas we serve',
        body: [
          'Downtown Johnson City, North State of Franklin, the medical corridor near Johnson City Medical Center, Boones Creek, Gray, Jonesborough and Elizabethton.'
        ]
      },
      PRICING_SECTION
    ],
    faqs: [
      {
        q: 'Do you have a Johnson City office?',
        a: 'Our studio is in Bristol, about 25 minutes away. We regularly meet Johnson City clients in person or by video.'
      },
      {
        q: 'Can you build HIPAA-aware intake forms?',
        a: 'We design intake flows that collect only what is needed and can route sensitive details to your existing secure systems.'
      }
    ]
  },
  {
    id: 'city-kingsport',
    kind: 'city',
    path: '/kingsport-tn-web-design/',
    legacy: ['?city=kingsport-tn'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Kingsport, TN',
    cityName: 'Kingsport',
    title: 'Website Design in Kingsport, TN | Wired Digital',
    description:
      'Websites, lead dashboards and local SEO for Kingsport, TN manufacturers, contractors, retailers and service companies. Bristol-based studio.',
    eyebrow: 'Kingsport, TN • 37660 • 37664 • 37663',
    h1: 'Website Design for Kingsport, Tennessee Companies',
    intro: [
      'Kingsport companies range from industrial suppliers and manufacturers to contractors, retailers and service businesses. Many of them still rely on websites that are slow on phones and hard to update. We rebuild those sites into fast, credible platforms that generate quote requests and calls.',
      'For companies that need more than a brochure site, we add lead dashboards, quote calculators and AI chatbots that handle common questions.'
    ],
    sections: [
      {
        h2: 'Popular projects for Kingsport',
        bullets: [
          'B2B and industrial websites with clear capabilities and quote forms',
          'Contractor and service sites with project galleries and service-area pages',
          'Lead dashboards that show which pages and campaigns bring in work',
          'AI chatbots trained on your products, services and FAQs',
          'Local SEO for Kingsport searches and the Google map pack'
        ]
      },
      {
        h2: 'Built to be found',
        body: [
          'Every site includes structured data, a clean sitemap and fast load times, so Google and AI search tools can clearly understand what you do and where you work.'
        ]
      },
      {
        h2: 'Areas we serve',
        body: [
          'Downtown Kingsport, Fort Henry Drive, East Stone Drive, the Eastman corridor, Colonial Heights, Blountville and Church Hill.'
        ]
      },
      PRICING_SECTION
    ],
    faqs: [
      {
        q: 'How far is your studio from Kingsport?',
        a: 'About 25 minutes away in Bristol. We meet Kingsport clients in person or by video.'
      },
      {
        q: 'Can you work with our existing brand guidelines?',
        a: 'Yes. We design within your existing brand or help refresh it if needed.'
      }
    ]
  },
  {
    id: 'city-abingdon',
    kind: 'city',
    path: '/abingdon-va-web-design/',
    legacy: ['?city=abingdon-va'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Abingdon, VA',
    cityName: 'Abingdon',
    title: 'Website Design in Abingdon, VA | Wired Digital',
    description:
      'Website design, redesign and local SEO for Abingdon and Southwest Virginia hospitality, tourism, legal and real estate businesses. Studio 15 min away.',
    eyebrow: 'Abingdon, VA & Southwest Virginia • 24210 • 24211',
    h1: 'Website Design for Abingdon and Southwest Virginia',
    intro: [
      'Abingdon businesses depend on visitors and local customers finding them quickly, whether that is a restaurant or inn on Main Street, a law office, a real estate team or a custom builder. We create websites that capture the character of your business and make it easy to book, call or visit.',
      'Our Bristol studio is about 15 minutes away on I-81, so local meetings are easy.'
    ],
    sections: [
      {
        h2: 'Popular projects for Abingdon',
        bullets: [
          'Hospitality and tourism sites with booking links and event pages',
          'Law office and professional websites with clear practice areas',
          'Real estate and custom builder sites with project galleries',
          'AI chatbots that answer visitor questions after hours',
          'Local SEO for Abingdon and Washington County searches'
        ]
      },
      {
        h2: 'Reaching visitors and locals',
        body: [
          'Many Abingdon customers search from out of town. Fast mobile pages, accurate Google Business Profile information and clear "plan your visit" content help you win those searches.'
        ]
      },
      {
        h2: 'Areas we serve',
        body: [
          'Historic Main Street, I-81 Exits 14, 17 and 19, Damascus, Glade Spring, Meadowview and the rest of Washington County, VA.'
        ]
      },
      PRICING_SECTION
    ],
    faqs: [
      {
        q: 'Do you work with seasonal and tourism businesses?',
        a: 'Yes. We build event and booking pages that are easy to update for each season.'
      }
    ]
  },

  // ----------------------------------------------------------- CASE STUDIES
  {
    id: 'case-fasttrack',
    kind: 'case',
    path: '/work/fast-track-bristol/',
    legacy: ['?case=fasttrack-bristol'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Fast Track Automotive',
    clientName: 'Fast Track Automotive',
    clientUrl: 'https://www.fasttrackbristoltn.com/',
    image: '/fasttrack-admin-dash.jpg',
    title: 'Case Study: Fast Track Automotive Bristol TN | Wired Digital',
    description:
      'How a new dealership website and live admin dashboard produced 2,751+ visits and 47 credit applications in 30 days for Fast Track Automotive in Bristol.',
    eyebrow: 'Case Study • Bristol, TN • fasttrackbristoltn.com',
    h1: 'Fast Track Automotive: Dealership Website and Live Admin Dashboard',
    intro: [
      'Fast Track Automotive is a pre-owned dealership at 2528 Volunteer Parkway in Bristol, TN. They needed a fast mobile showroom and a way to see which vehicles shoppers were interested in.',
      'We designed and built a new customer website and a private admin dashboard that shows live shopper activity, credit applications and the most-viewed vehicles on the lot.'
    ],
    sections: [
      {
        h2: 'Results in the first 30 days',
        bullets: [
          '2,751+ tracked visits',
          '4,591 visitor actions',
          '1,719 vehicle clicks',
          '47 online credit applications and 15 tracked calls',
          'About 70% of shoppers on mobile'
        ]
      },
      {
        h2: 'What we built',
        bullets: [
          'Mobile-first inventory website with fast vehicle pages',
          'Live admin dashboard with a real-time visitor click stream and sound alerts',
          '"Hottest vehicles on the lot" ranking based on real shopper clicks',
          'Tracking for calls, credit apps, QR window flyers and fuel calculator use',
          'Local SEO for Bristol, Kingsport and Johnson City car shoppers'
        ]
      }
    ],
    faqs: []
  },
  {
    id: 'case-teamvision',
    kind: 'case',
    path: '/work/team-vision/',
    legacy: ['?case=team-vision-llc'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Team Vision LLC',
    clientName: 'Team Vision LLC',
    clientUrl: 'https://www.teamvisionllc.com/',
    image: '/teamvision-ai-advisor.jpg',
    title: 'Case Study: Team Vision LLC AI Space Advisor | Wired Digital',
    description:
      'A commercial real estate website and custom-trained "Ask VISION" AI advisor that matches tenants to downtown Bristol spaces in under two minutes.',
    eyebrow: 'Case Study • Downtown Bristol • teamvisionllc.com',
    h1: 'Team Vision LLC: Commercial Real Estate Website and 24/7 AI Advisor',
    intro: [
      'Team Vision LLC owns and develops a large portfolio of commercial properties in downtown Bristol, from small office suites to large event and industrial spaces. Prospective tenants needed a faster way to find the right space at any hour.',
      'We modernized their website and built "Ask VISION," an AI space advisor trained on every property in the portfolio.'
    ],
    sections: [
      {
        h2: 'How Ask VISION works',
        bullets: [
          'Asks prospective tenants five short questions about size, use and budget',
          'Recommends matching spaces in under two minutes',
          'Covers spaces from 120 to 54,000 square feet',
          'Captures tenant details for the ownership team, 24/7',
          'Per-property "Ask VISION about this property" buttons'
        ]
      },
      {
        h2: 'Properties included',
        body: [
          'City Centre, Bristol CoWork, The Executive on State St, Centre Point by Hard Rock, the Foundation Event Facility and West State Commons, covering office, coworking, retail, restaurant and industrial space.'
        ]
      }
    ],
    faqs: []
  },
  {
    id: 'case-ringgerlaw',
    kind: 'case',
    path: '/work/ringger-law/',
    legacy: ['?case=ringger-law'],
    tab: 'home',
    section: null,
    showIntro: true,
    breadcrumb: 'Ringger Law',
    clientName: 'Ringger Law',
    clientUrl: 'https://www.ringgerlaw.com/',
    image: '/ringgerlaw-admin-dash.jpg',
    title: 'Case Study: Ringger Law CRM & AI Triage | Wired Digital',
    description:
      'A legal website, 24/7 debt-triage AI assistant and live attorney CRM for Ringger Law, serving Jackson and West Tennessee since 1981.',
    eyebrow: 'Case Study • Jackson, TN • ringgerlaw.com',
    h1: 'Ringger Law: Legal Website, 24/7 AI Triage and Attorney CRM',
    intro: [
      'The Law Offices of Louis W. Ringger Jr. have served Jackson and West Tennessee since 1981, the same city where Wired Digital was founded in 1999. The firm helps clients facing foreclosure, repossession, garnishment and unsecured debt.',
      'We built a public website focused on urgent help, a 24/7 debt-triage AI assistant, and a private attorney CRM connected to a live database.'
    ],
    sections: [
      {
        h2: 'What we built',
        bullets: [
          'Legal website designed around urgent foreclosure and repossession help',
          '24/7 "West TN Debt Triage" AI assistant with same-day callback requests',
          'Attorney and staff CRM that sorts leads by urgency',
          'Chapter 7 vs. Chapter 13 pre-qualification and digital signed intake packets',
          'Traffic attribution across Google, paid ads, direct visits and AI assistants'
        ]
      },
      {
        h2: 'Results',
        bullets: [
          '3,800+ tracked sessions in a 90-day sample',
          'Legal search clicks valued at about $64.50 each, tracked in the dashboard'
        ]
      }
    ],
    faqs: []
  }
];

export function normalizePath(pathname = '/') {
  let p = pathname || '/';
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.endsWith('/')) p = `${p}/`;
  return p.replace(/\/{2,}/g, '/');
}

export function getSeoPageById(id) {
  return SEO_PAGES.find((p) => p.id === id) || null;
}

export function findSeoPageByPath(pathname) {
  const p = normalizePath(pathname);
  return SEO_PAGES.find((page) => page.path === p) || null;
}

export function findSeoPageByLegacyQuery(search) {
  if (!search) return null;
  return SEO_PAGES.find((page) => page.legacy.includes(search)) || null;
}

export function canonicalFor(page) {
  return `${SITE_BASE}${page.path}`;
}
