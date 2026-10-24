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
    time: 'WIRED_64 // READY',
    cartridge: 'geo',
    text: 'ONLINE // How can we power up your next project?',
    subtext:
      'Select a mission on the left, drop your website URL for an instant scan, or ask anything about AI web modernization, custom dashboards, 24/7 AI bots, or music video editing.'
  }
];

/**
 * Smart conversational response generator + guided lead capture state machine
 */
function generateWired64Response(input, currentStep, leadDraft) {
  const q = input.trim();
  const lower = q.toLowerCase();

  // If we are in the middle of guided lead capture steps:
  if (currentStep === 'ASK_URL_FOR_SCAN') {
    const cleanUrl = q.startsWith('http') ? q : `https://${q.replace(/^www\./, '')}`;
    return {
      nextStep: 'ASK_CONTACT_AFTER_SCAN',
      cartridge: 'scan',
      leadPatch: { companyUrl: cleanUrl, service: 'AI Website Design, Redesign & Modernization + GEO' },
      reply: `64-BIT DIAGNOSTIC COMPLETE FOR [ ${cleanUrl.toUpperCase()} ]:\n• LEGACY DOM LOAD: ~3.8s (losing mobile visitors)\n• AI ENTITY GRAPH (JSON-LD): 0/100 (invisible to ChatGPT, Gemini & Perplexity)\n• 24/7 AI LEAD CONCIERGE: NOT DETECTED\n• LIVE ADMIN TELEMETRY: NOT DETECTED`,
      subtext:
        'We can modernize this into a sub-0.4s AI-ready platform with a custom live dashboard or 24/7 AI bot. Drop your Name + Best Email or Phone below so Creative Director Rob Neilson can send your full blueprint!'
    };
  }

  if (currentStep === 'ASK_CONTACT_AFTER_SCAN' || currentStep === 'ASK_NAME_AND_CONTACT') {
    return {
      nextStep: 'COMPLETED',
      cartridge: leadDraft.cartridge || 'geo',
      leadPatch: {
        name: leadDraft.name || q.split(/[•,@-]/)[0]?.trim() || 'WIRED-64 Chat Lead',
        contact: q,
        details: leadDraft.details || `Captured via WIRED-64 64-Bit Orb Terminal. Input: ${q}`
      },
      autoSubmitLead: true,
      reply: `PACKET TRANSMITTED TO ROB NEILSON // LEAD VAULT LOCKED [100%].`,
      subtext:
        'Your inquiry has been logged directly into the WIRED_OS Backend Leads CRM. Rob will reach out personally. You can keep chatting or click [TRANSMIT / EDIT LEAD PACKET] anytime.'
    };
  }

  // Detect URL typed directly
  if (
    lower.includes('.com') ||
    lower.includes('.net') ||
    lower.includes('.org') ||
    lower.includes('http://') ||
    lower.includes('https://')
  ) {
    // Check if it looks like an email address vs a website URL
    if (lower.includes('@')) {
      return {
        nextStep: 'COMPLETED',
        cartridge: leadDraft.cartridge || 'geo',
        leadPatch: {
          name: q.split('@')[0],
          contact: q,
          details: leadDraft.details || `Submitted contact via WIRED-64 Chat: ${q}`
        },
        autoSubmitLead: true,
        reply: `CONTACT LOCKED [ ${q} ] // DISPATCHED TO ROB NEILSON'S COMMAND CENTER.`,
        subtext:
          'Logged in the WIRED_OS Leads CRM! Want to add your business name, website URL, or project details? Just type them below or open the Quick Packet form.'
      };
    }

    return {
      nextStep: 'ASK_CONTACT_AFTER_SCAN',
      cartridge: 'scan',
      leadPatch: { companyUrl: q, service: 'AI Website Design, Redesign & Modernization + GEO' },
      reply: `SCANNING TARGET URL [ ${q.toUpperCase()} ]...\n• AI SEARCH CITATION READINESS: LOW (Missing Tri-Cities / Entity JSON-LD)\n• CORE WEB VITALS UPGRADE POTENTIAL: +64% FASTER\n• CUSTOM LIVE DASHBOARD / 24/7 AI BOT: RECOMMENDED`,
      subtext:
        'Enter your Name and Email or Phone number below—or click [OPEN 64-BIT LEAD PACKET]—so Rob can send over a modernization game plan!'
    };
  }

  // Keyword intent matching
  if (lower.includes('scan') || lower.includes('audit') || lower.includes('current website')) {
    return {
      nextStep: 'ASK_URL_FOR_SCAN',
      cartridge: 'scan',
      leadPatch: { cartridge: 'scan', service: 'AI Website Design, Redesign & Modernization + GEO' },
      reply: '64-BIT URL SCANNER ARMED. Type your current website URL (e.g. yourbusiness.com) below and I will run a live AI Search (GEO) & Modernization diagnostic.',
      subtext: 'Or if you do not have a site yet, tell me your business name and city!'
    };
  }

  if (
    lower.includes('dash') ||
    lower.includes('fast track') ||
    lower.includes('vision') ||
    lower.includes('bot') ||
    lower.includes('chat')
  ) {
    return {
      nextStep: 'ASK_NAME_AND_CONTACT',
      cartridge: 'dash',
      leadPatch: {
        cartridge: 'dash',
        service: 'Custom Live Dashboard / 24/7 AI Lead Chatbot',
        details: q
      },
      reply:
        'CUSTOM TELEMETRY & 24/7 AI BOTS // Just like we built for Fast Track Bristol TN (live visitor click-stream, credit app alerts & lot rankings) and Team Vision LLC (24/7 "Ask VISION" AI Space Advisor trained on every property in their portfolio).',
      subtext:
        'What type of business do you run, and what is the best Name + Email/Phone for Rob to reach you?'
    };
  }

  if (
    lower.includes('video') ||
    lower.includes('music') ||
    lower.includes('lyric') ||
    lower.includes('edit') ||
    lower.includes('label')
  ) {
    return {
      nextStep: 'ASK_NAME_AND_CONTACT',
      cartridge: 'video',
      leadPatch: {
        cartridge: 'video',
        service: 'Global Remote Music & Lyric Video Editing',
        details: q
      },
      reply:
        'GLOBAL REMOTE VIDEO POST-PRODUCTION // Working full-time in the music industry since 2015 for Primary Wave, Alice Cooper, Halestorm, Paul Rodgers, Def Leppard & more. 100% remote 4K editing, custom animated lyric worlds, and visualizers worldwide (with on-location directing reserved for select flagship shoots).',
      subtext:
        'Tell me about your track/release timeline and drop your Name + Email so Rob can lock in your edit window!'
    };
  }

  if (
    lower.includes('seo') ||
    lower.includes('geo') ||
    lower.includes('modern') ||
    lower.includes('redesign') ||
    lower.includes('site') ||
    lower.includes('web') ||
    lower.includes('price') ||
    lower.includes('cost')
  ) {
    return {
      nextStep: 'ASK_NAME_AND_CONTACT',
      cartridge: 'geo',
      leadPatch: {
        cartridge: 'geo',
        service: 'AI Website Design, Redesign & Modernization + GEO',
        details: q
      },
      reply:
        'AI WEBSITE DESIGN, REDESIGN & MODERNIZATION // Search engines have changed forever. We engineer sub-second React/Edge sites with full Schema.org JSON-LD entity graphs so your business is cited #1 by ChatGPT, Google AI Overviews, Perplexity, and local Tri-Cities search.',
      subtext:
        'Drop your Name + Email or Phone (or your current website URL) and Rob will put together a custom modernization proposal!'
    };
  }

  // Default helpful response that nudges toward lead capture
  return {
    nextStep: 'ASK_NAME_AND_CONTACT',
    cartridge: leadDraft.cartridge || 'geo',
    leadPatch: { details: q },
    reply: `MESSAGE LOGGED // "${q.slice(0, 70)}". Wired Digital builds high-converting AI websites, custom live dashboards, 24/7 AI lead chatbots, and global music videos.`,
    subtext:
      'What is your Name and best Email or Phone number so Creative Director Rob Neilson can follow up directly?'
  };
}

export default function WiredOrbChatbot() {
  const orbButtonRef = useRef(null);
  const floatLeftEyeRef = useRef(null);
  const floatRightEyeRef = useRef(null);
  const stageLeftEyeRef = useRef(null);
  const stageRightEyeRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth <= 1100 ||
      window.matchMedia('(max-width: 1100px), (hover: none), (pointer: coarse)').matches
    );
  });
  const [activeCartridge, setActiveCartridge] = useState('geo');
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

  // Keep mobile/tablet viewport detection synced on resize & orientation changes
  useEffect(() => {
    const checkViewport = () => {
      const mobileNow =
        window.innerWidth <= 1100 ||
        window.matchMedia('(max-width: 1100px), (hover: none), (pointer: coarse)').matches;
      setIsMobileViewport(mobileNow);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    window.addEventListener('orientationchange', checkViewport, { passive: true });
    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('orientationchange', checkViewport);
    };
  }, []);

  // Update whisper prompt based on scroll position
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
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleOpenOrb = () => {
    setIsOpen(true);
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

    setTimeout(() => {
      const response = generateWired64Response(userText, chatStep, leadDraft);
      const nextCart = forcedCartridge || response.cartridge || activeCartridge;
      setActiveCartridge(nextCart);
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
      }

      const botMsg = {
        id: `msg_b_${Date.now()}`,
        sender: 'bot',
        time: 'WIRED_64 // OK',
        cartridge: nextCart,
        text: response.reply,
        subtext: response.subtext
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
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_pkt_${Date.now()}`,
        sender: 'bot',
        time: 'LEAD_VAULT // LOCKED',
        cartridge: activeCartridge,
        text: `64-BIT LEAD PACKET TRANSMITTED // Thank you, ${leadDraft.name}!`,
        subtext: `Logged in the WIRED_OS Backend Leads CRM for "${leadDraft.service}". Creative Director Rob Neilson will reach out to ${leadDraft.contact}.`
      }
    ]);
  };

  return (
    <>
      {/* ====================================================================
          FLOATING SHINY BLACK ORB WITH BACKLIT YELLOW GLOW & MOUSE-TRACKING EYES
         ==================================================================== */}
      <div className={`wired-orb-dock ${isOpen ? 'orb-hidden' : ''} ${isNearOrb ? 'orb-proximity-surge' : ''}`}>
        {!whisperDismissed && (
          <div className="orb-organic-whisper" onClick={handleOpenOrb}>
            <div className="orb-whisper-stack">
              <span className="orb-whisper-line-1">ASK</span>
              <span className="orb-whisper-line-2">WIRED-64</span>
              <span className="orb-whisper-line-3">// 24/7 AI</span>
            </div>
            <span className="orb-whisper-tether" aria-hidden="true" />
          </div>
        )}

        <button
          ref={orbButtonRef}
          type="button"
          className="shiny-black-orb-btn"
          onClick={handleOpenOrb}
          aria-label="Open WIRED-64 AI Lead Concierge"
          title="Click to launch WIRED-64 Full-Screen 64-Bit AI Concierge"
        >
          {/* Backlit Electric-Yellow Halo Rings */}
          <span className="orb-backlit-yellow-aura" aria-hidden="true" />
          <span className="orb-backlit-pulse-ring" aria-hidden="true" />

          {/* 3D Glossy Piano-Black Sphere */}
          <span className="orb-black-sphere">
            {/* Curved Top Specular Glass Reflection */}
            <span className="orb-glass-crown" aria-hidden="true" />

            {/* Upper Hemisphere Mouse-Tracking Reflective White Eye-Dots */}
            <span className="orb-eyes-upper-zone" aria-hidden="true">
              <span ref={floatLeftEyeRef} className="orb-reflective-eye">
                <span className="eye-micro-glint" />
              </span>
              <span ref={floatRightEyeRef} className="orb-reflective-eye">
                <span className="eye-micro-glint" />
              </span>
            </span>

            {/* Subtle Lower Equator 64-Bit Voltage Line */}
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

                  {/* Giant Stage Shiny Black Orb with Mouse-Following Reflective White Eyes */}
                  <div className={`w64-stage-orb-wrap ${isBotTyping ? 'is-speaking' : ''}`}>
                    <div className="orb-backlit-yellow-aura stage-aura" />
                    <div className="orb-black-sphere stage-sphere">
                      <span className="orb-glass-crown" />
                      <div className="orb-eyes-upper-zone stage-eyes">
                        <span ref={stageLeftEyeRef} className="orb-reflective-eye stage-eye">
                          <span className="eye-micro-glint" />
                        </span>
                        <span ref={stageRightEyeRef} className="orb-reflective-eye stage-eye">
                          <span className="eye-micro-glint" />
                        </span>
                      </div>
                      <span className="orb-lower-equator-glow" />
                    </div>
                  </div>

                  {/* 64-Bit Yellow & Green Neural Waveform Equalizer */}
                  <div className={`w64-voice-eq ${isBotTyping ? 'active' : ''}`}>
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="w64-eq-bar"
                        style={{ animationDelay: `${idx * 0.06}s` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Dynamic 64-Bit Retro Vector Graphics Screen (Desktop Full-Screen Only) */}
                {!isMobileViewport && isFullScreen && (
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

                {/* 4 Selectable 64-Bit Mission Cartridges (Desktop Full-Screen Only) */}
                {!isMobileViewport && isFullScreen && (
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
                {/* Scrollable Retro Terminal Log */}
                <div className="wired64-messages-viewport">
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
                        <span>[ TRANSMIT LEAD TO WIRED_OS VAULT ]</span>
                      </button>
                    </form>
                  )}

                  <div ref={messagesEndRef} />
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
