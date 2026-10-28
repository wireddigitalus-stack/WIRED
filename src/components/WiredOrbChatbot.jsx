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
import { runWebsiteDiagnostic } from '../utils/websiteDiagnostic';
import {
  wired64Respond,
  createChatState,
  formatScanSummary,
  extractDomainUrl,
  WIRED64_INTRO
} from '../utils/wired64Brain';

const CARTRIDGES = [
  {
    id: 'geo',
    code: 'CART_01',
    title: 'AI SITE MODERNIZATION & GEO',
    subtitle: 'KEEP PACE WITH AI-ERA SEARCH',
    prompt: 'I want a new website that ranks on Google and in AI search.'
  },
  {
    id: 'dash',
    code: 'CART_02',
    title: 'CUSTOM DASH & 24/7 AI BOT',
    subtitle: 'LIKE FAST TRACK & RINGGER LAW',
    prompt: 'Tell me about AI chatbots.'
  },
  {
    id: 'scan',
    code: 'CART_03',
    title: 'CHECK MY CURRENT WEBSITE',
    subtitle: 'QUICK SPEED & SEO LOOK',
    prompt: 'Check my current website.'
  },
  {
    id: 'video',
    code: 'CART_04',
    title: 'GLOBAL MUSIC / LYRIC VIDEO',
    subtitle: 'REMOTE EDITING FOR LEGENDS',
    prompt: 'Tell me about music video editing.'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg_boot_1',
    sender: 'bot',
    time: 'WIRED_64',
    cartridge: 'geo',
    text: WIRED64_INTRO.text,
    chips: WIRED64_INTRO.chips
  }
];

// Answer logic lives in src/utils/wired64Brain.js (pure + tested by scripts/test-wired64.mjs)

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
    subtext: 'Direct access to Wired Digital—custom web, AI, apps, and 4K video.'
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

/**
 * Dyslexia-Friendly 64-Bit Message Formatter:
 * - Breaks up paragraphs and bullet lists into distinct, well-spaced blocks
 * - Renders all Headings, Titles & Bullet Labels in Phosphor Green (#00FF66)
 * - Renders all Paragraph & Explanation Body Text in High-Contrast Yellow (#FFEE00)
 */
function renderDyslexiaFriendlyBotContent(text, subtext, subtextLabel = 'NEXT STEP //') {
  const rawLines = (text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="w64-dyslexia-reader">
      {rawLines.map((line, idx) => {
        const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('>');

        if (isBullet) {
          const cleanBullet = line.replace(/^[•\->]\s*/, '');
          const colonIdx = cleanBullet.indexOf(':');
          if (colonIdx > 0 && colonIdx < 58) {
            const bulletTitle = cleanBullet.slice(0, colonIdx + 1);
            const bulletBody = cleanBullet.slice(colonIdx + 1).trim();
            return (
              <div key={idx} className="w64-list-item-block">
                <div className="w64-list-title-green">▸ {bulletTitle}</div>
                {bulletBody && <p className="w64-para-yellow">{bulletBody}</p>}
              </div>
            );
          }
          return (
            <div key={idx} className="w64-list-item-block">
              <p className="w64-para-yellow">▸ {cleanBullet}</p>
            </div>
          );
        }

        // First line or non-bullet heading with "//" or ":"
        if (idx === 0) {
          if (line.includes('//')) {
            const parts = line.split('//');
            const leftTag = parts[0].trim();
            const rightRest = parts.slice(1).join('//').trim();

            // Check if rightRest is a short title (ends with ':' or <= 52 chars) vs a full sentence
            if (rightRest.endsWith(':') || rightRest.length <= 54) {
              return (
                <div key={idx} className="w64-heading-block">
                  <div className="w64-heading-green">
                    {leftTag} // {rightRest}
                  </div>
                </div>
              );
            }
            return (
              <div key={idx} className="w64-heading-block">
                <div className="w64-heading-green">{leftTag} //</div>
                <p className="w64-para-yellow">{rightRest}</p>
              </div>
            );
          }

          return (
            <div key={idx} className="w64-heading-block">
              <div className="w64-heading-green">{line}</div>
            </div>
          );
        }

        // Any other standalone paragraph line
        return (
          <p key={idx} className="w64-para-yellow w64-standalone-para">
            {line}
          </p>
        );
      })}

      {subtext && (
        <div className="w64-msg-subtext-block">
          <div className="w64-subtext-heading-green">{subtextLabel}</div>
          <p className="w64-para-yellow">{subtext}</p>
        </div>
      )}
    </div>
  );
}

export default function WiredOrbChatbot() {
  const dockRef = useRef(null);
  const orbButtonRef = useRef(null);
  const floatLeftEyeRef = useRef(null);
  const floatRightEyeRef = useRef(null);
  const stageLeftEyeRef = useRef(null);
  const stageRightEyeRef = useRef(null);
  const messagesEndRef = useRef(null);
  const packetFormRef = useRef(null);
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
  const [isOverForm, setIsOverForm] = useState(false);
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
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [brainState, setBrainState] = useState(createChatState);
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

      // Phones: tuck the orb away while it would sit on top of the inline project form,
      // so it never covers the right edge of inputs, chips or the Send button
      const formEl = document.querySelector('.body-cta-form-col');
      if (formEl && dockEl && window.innerWidth <= 640) {
        const formRect = formEl.getBoundingClientRect();
        const dockRect = dockEl.getBoundingClientRect();
        setIsOverForm(formRect.top < dockRect.bottom && formRect.bottom > dockRect.top);
      } else {
        setIsOverForm(false);
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

  // Reading-order auto-scroll: each new bot reply is pinned with its FIRST line at the top
  // of the chat viewport so it reads top-down (scroll on for the rest of a long reply).
  // Only the chat viewport scrolls — never the page behind it (no scrollIntoView).
  const [replySpacerH, setReplySpacerH] = useState(0);
  const lastAnchoredBotIdRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const viewport = chatViewportRef.current;
    if (!viewport) return;

    const offsetWithinViewport = (el) =>
      el.getBoundingClientRect().top - viewport.getBoundingClientRect().top + viewport.scrollTop;

    const run = () => {
      // 1) Lead Packet drawer just opened → bring the whole form into view (bottom-aligned)
      if (showPacketForm && packetFormRef.current) {
        const form = packetFormRef.current;
        const formBottom = offsetWithinViewport(form) + form.offsetHeight;
        viewport.scrollTo({ top: Math.max(0, formBottom - viewport.clientHeight + 12), behavior: 'smooth' });
        return;
      }

      // 2) Waiting on a reply → drop the old spacer, keep the question + "computing" line visible
      if (isBotTyping) {
        setReplySpacerH(0);
        requestAnimationFrame(() =>
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' })
        );
        return;
      }

      // 3) New bot reply → pin the top of the reply to the top of the viewport
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.sender !== 'bot' || lastMsg.id === lastAnchoredBotIdRef.current) return;
      const replyEl = viewport.querySelector(`[data-msg-id="${lastMsg.id}"]`);
      if (!replyEl) return;
      lastAnchoredBotIdRef.current = lastMsg.id;

      // Give short replies enough room below them to reach the top of the viewport
      const needed = Math.max(0, viewport.clientHeight - replyEl.offsetHeight - 16);
      setReplySpacerH(needed);

      requestAnimationFrame(() => {
        viewport.scrollTo({ top: Math.max(0, offsetWithinViewport(replyEl) - 8), behavior: 'smooth' });
        updateCustomScrollMetrics();
      });
    };

    const rafId = requestAnimationFrame(run);
    return () => cancelAnimationFrame(rafId);
  }, [messages, isBotTyping, isOpen, showPacketForm]);

  // Reset the anchor when the terminal closes so reopening re-pins the latest reply
  useEffect(() => {
    if (!isOpen) {
      lastAnchoredBotIdRef.current = null;
      setReplySpacerH(0);
    }
  }, [isOpen]);

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
            { label: '🚀 START A PROJECT', prompt: 'I want to start a project with Wired Digital.', cartridge: 'geo' }
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

  const pushBotMessage = (msg) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        sender: 'bot',
        time: 'WIRED_64',
        chips: [],
        ...msg
      }
    ]);
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
      setOrbMoodBadge('CHECKING SITE');
    }

    setTimeout(() => {
      const response = wired64Respond(userText, brainState);
      const nextState = response.state;
      setBrainState(nextState);

      const nextCart = forcedCartridge || response.cartridge || activeCartridge;
      setActiveCartridge(nextCart);

      const mergedDraft = {
        ...leadDraft,
        name: nextState.name || leadDraft.name,
        contact: nextState.contact || leadDraft.contact,
        service: nextState.service || leadDraft.service,
        companyUrl: response.scanUrl || leadDraft.companyUrl,
        cartridge: nextCart
      };
      setLeadDraft(mergedDraft);

      if (response.autoSubmitLead) {
        const asked = nextState.questions.length
          ? `Questions asked in chat: ${nextState.questions.map((q) => `"${q}"`).join(' | ')}`
          : 'Shared contact info in WIRED-64 chat.';
        addLead({
          source: 'WIRED-64 Orb Bot (64-Bit AI)',
          status: 'NEW',
          priority: 'URGENT',
          name: mergedDraft.name || 'WIRED-64 Chat Inquiry',
          contact: nextState.contact,
          companyUrl: mergedDraft.companyUrl || '',
          service: mergedDraft.service || 'AI Website Design, Redesign & Modernization',
          urgency: mergedDraft.urgency || 'Ready to Start (This Month)',
          details: asked,
          notes: 'Captured automatically via WIRED-64 chat (3-question flow).'
        });
        setPacketSubmitted(true);
        triggerOrbJoySurge(ORB_SECRET_MOODS[0], false);
        logTelemetryEvent('W64_LEAD_CAPTURED', `WIRED-64 captured lead after ${nextState.questionCount} questions`, 'conversion');
      } else if (response.leadAsk) {
        logTelemetryEvent('W64_LEAD_ASK', `WIRED-64 asked for contact info (${nextState.step})`, 'engagement');
      }

      // Site check: show "checking…" now, then the real result (lead ask rides on the result)
      if (response.scanUrl) {
        pushBotMessage({ cartridge: 'scan', text: response.reply });
        runWebsiteDiagnostic(response.scanUrl)
          .catch(() => null)
          .then((report) => {
            pushBotMessage({
              cartridge: 'scan',
              text: formatScanSummary(report),
              subtext: response.subtext,
              subtextLabel: response.subtextLabel,
              chips: response.leadAsk
                ? response.chips
                : [
                    { label: '📞 TALK TO ROB', prompt: 'How do I contact Rob?', cartridge: 'geo' },
                    { label: '💎 PRICING', prompt: 'How much does a website cost?', cartridge: 'geo' }
                  ]
            });
            setIsBotTyping(false);
            triggerOrbJoySurge(ORB_SECRET_MOODS[1], false);
          });
        return;
      }

      pushBotMessage({
        cartridge: nextCart,
        text: response.reply,
        subtext: response.subtext,
        subtextLabel: response.subtextLabel,
        chips: response.chips || []
      });
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
    const combinedContact = [leadDraft.phone || '', leadDraft.contact || '']
      .map((s) => s.trim())
      .filter(Boolean)
      .join(' • ');
    addLead({
      source: 'WIRED-64 Orb Bot (64-Bit AI)',
      status: 'NEW',
      priority: 'URGENT',
      name: leadDraft.name,
      phone: leadDraft.phone || '',
      email: leadDraft.contact || '',
      contact: combinedContact,
      companyUrl: leadDraft.companyUrl,
      service: leadDraft.service,
      urgency: leadDraft.urgency,
      details: `Submitted via WIRED-64 64-Bit Lead Packet (${leadDraft.service})`,
      notes: 'Submitted via WIRED-64 64-Bit Full-Screen Terminal.'
    });

    setPacketSubmitted(true);
    setShowPacketForm(false);
    setBrainState((prev) => ({ ...prev, captured: true, step: 'COMPLETED', name: leadDraft.name || prev.name }));
    triggerOrbJoySurge(ORB_SECRET_MOODS[0], false);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_pkt_${Date.now()}`,
        sender: 'bot',
        time: 'LEAD_VAULT // LOCKED',
        cartridge: activeCartridge,
        text: `GOT IT //\nThanks${leadDraft.name ? `, ${leadDraft.name.split(' ')[0]}` : ''}. Rob will reach out soon.\nAsk me anything else in the meantime.`
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
        className={`wired-orb-dock ${isOpen ? 'orb-hidden' : ''} ${isOverForm ? 'orb-tucked' : ''} ${isNearOrb ? 'orb-proximity-surge' : ''} ${isOverYellowFooter ? 'over-yellow-footer' : ''}`}
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
                    {/* Retro 64-Bit Perspective Horizon Grid (Animated) */}
                    <line x1="0" y1="120" x2="360" y2="120" stroke="#00FF66" strokeOpacity="0.45" strokeWidth="1" />
                    <line x1="0" y1="138" x2="360" y2="138" stroke="#00FF66" strokeOpacity="0.35" strokeWidth="1" className="w64-grid-pulse-line" />
                    <line x1="0" y1="162" x2="360" y2="162" stroke="#00FF66" strokeOpacity="0.45" strokeWidth="1" className="w64-grid-pulse-line delay-1" />
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
                    <span className="w64-module-title">ACTIVE MODULE // {activeCartridge.toUpperCase()}_64.SYS</span>
                    <span className="w64-fps-tag">● 60FPS VECTOR</span>
                  </div>

                  {activeCartridge === 'geo' && (
                    <div className="w64-vector-scene">
                      <svg viewBox="0 0 320 130" className="w64-vector-svg">
                        {/* Counter-rotating dashed outer radar ring */}
                        <circle
                          cx="70"
                          cy="65"
                          r="46"
                          fill="none"
                          stroke="#00FF66"
                          strokeWidth="1.5"
                          strokeDasharray="6 4"
                          className="w64-radar-outer-ring"
                        />
                        {/* Static middle calibration ring */}
                        <circle cx="70" cy="65" r="28" fill="none" stroke="#FFEE00" strokeOpacity="0.65" strokeWidth="1.2" />
                        {/* Expanding sonar pulse ring */}
                        <circle
                          cx="70"
                          cy="65"
                          r="12"
                          fill="none"
                          stroke="#00FF66"
                          strokeWidth="1.4"
                          className="w64-radar-sonar-ring"
                        />
                        {/* Crosshairs */}
                        <line x1="20" y1="65" x2="120" y2="65" stroke="#00FF66" strokeOpacity="0.45" />
                        <line x1="70" y1="15" x2="70" y2="115" stroke="#00FF66" strokeOpacity="0.45" />
                        {/* Rotating 360-degree radar sweep cone & laser beam */}
                        <g className="w64-radar-sweep-group">
                          <path
                            d="M 70 65 L 82 21 A 46 46 0 0 1 112 46 Z"
                            fill="rgba(0, 255, 102, 0.24)"
                          />
                          <line x1="70" y1="65" x2="112" y2="46" stroke="#FFEE00" strokeWidth="2.2" />
                        </g>
                        {/* Center radar core */}
                        <circle cx="70" cy="65" r="2.8" fill="#FFEE00" />
                        {/* Pulsing target blips */}
                        <circle cx="92" cy="46" r="4" fill="#FFEE00" className="w64-radar-blip" />
                        <circle cx="54" cy="82" r="3.5" fill="#00FF66" className="w64-radar-blip delay-1" />
                        <circle cx="48" cy="44" r="3" fill="#00FF66" className="w64-radar-blip delay-2" />
                        <text x="136" y="34" fill="#FFEE00" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          [AI SEARCH &amp; GEO RADAR]
                        </text>
                        <text x="136" y="54" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; HIGH-END SEO + GEO: ACTIVE
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
                        {/* Sweeping vertical telemetry scanbar */}
                        <line
                          x1="24"
                          y1="20"
                          x2="24"
                          y2="110"
                          stroke="#00FF66"
                          strokeOpacity="0.45"
                          strokeWidth="1.5"
                          className="w64-telemetry-scanbar"
                        />
                        <polyline
                          points="22,92 48,70 72,78 98,42 122,50 140,28"
                          fill="none"
                          stroke="#00FF66"
                          strokeWidth="2.2"
                          className="w64-telemetry-line"
                        />
                        <circle cx="98" cy="42" r="3.5" fill="#FFEE00" className="w64-radar-blip" />
                        <circle cx="140" cy="28" r="4" fill="#00FF66" className="w64-radar-blip delay-1" />
                        <text x="22" y="34" fill="#FFEE00" fontSize="9" fontFamily="monospace">
                          LIVE ADMIN TELEMETRY
                        </text>
                        <text x="162" y="34" fill="#FFEE00" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          [FAST TRACK &amp; RINGGER LAW]
                        </text>
                        <text x="162" y="54" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; 24/7 AI TRIAGE: ONLINE
                        </text>
                        <text x="162" y="72" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; CLICK STREAM: REAL-TIME
                        </text>
                        <text x="162" y="90" fill="#00FF66" fontSize="9.5" fontFamily="monospace">
                          &gt; LEAD ALERTS: INSTANT
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
                        <rect
                          x="20"
                          y="24"
                          width="240"
                          height="14"
                          fill="#FFEE00"
                          className="w64-scan-progress-fill"
                        />
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
                              className="w64-video-spec-bar"
                              style={{ animationDelay: `${i * 0.11}s` }}
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
                        data-msg-id={msg.id}
                        className={`w64-msg-block ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                      >
                        <div className="w64-msg-meta">
                          <span className="w64-msg-author">
                            {msg.sender === 'user' ? '> VISITOR_INPUT' : '⚡ WIRED_64_CORE'}
                          </span>
                          <span className="w64-msg-time">{msg.time}</span>
                        </div>
                        {msg.sender === 'bot' ? (
                          renderDyslexiaFriendlyBotContent(msg.text, msg.subtext, msg.subtextLabel)
                        ) : (
                          <>
                            <div className="w64-msg-text">{msg.text}</div>
                            {msg.subtext && <div className="w64-msg-subtext">{msg.subtext}</div>}
                          </>
                        )}
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
                      <form
                        ref={packetFormRef}
                        className="w64-inline-packet-form"
                        onSubmit={handlePacketSubmit}
                      >
                        <div className="w64-packet-head">
                          <span>[ 64-BIT DIRECT LEAD PACKET → WIRED DIGITAL ]</span>
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
                            <label>YOUR NAME / BUSINESS *</label>
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
                            <label>PHONE NUMBER *</label>
                            <input
                              type="tel"
                              required
                              placeholder="(423) 555-0199"
                              value={leadDraft.phone || ''}
                              onChange={(e) =>
                                setLeadDraft({ ...leadDraft, phone: e.target.value })
                              }
                            />
                          </div>
                          <div className="w64-field">
                            <label>EMAIL ADDRESS *</label>
                            <input
                              type="email"
                              required
                              placeholder="you@company.com"
                              value={leadDraft.contact}
                              onChange={(e) =>
                                setLeadDraft({ ...leadDraft, contact: e.target.value })
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

                        <button type="submit" className="w64-transmit-btn">
                          <Zap size={14} fill="#050505" color="#050505" />
                          <span>[ TRANSMIT LEAD TO WIRED DIGITAL ]</span>
                        </button>
                        <div className="w64-packet-last-resort">
                          Direct Email: WiredDigitalUS@gmail.com • Direct Call/Text: 731-616-5121
                        </div>
                      </form>
                    )}

                    <div ref={messagesEndRef} />
                    {/* Breathing room so a short latest reply can scroll up to the top */}
                    {replySpacerH > 0 && !showPacketForm && (
                      <div
                        className="w64-reply-spacer"
                        style={{ height: replySpacerH, flexShrink: 0 }}
                        aria-hidden="true"
                      />
                    )}
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
