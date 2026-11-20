'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldMap from '../components/WorldMap';
import ReactMarkdown from 'react-markdown';

// ─── Animation Variants ───────────────────────────────────────────────────────

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};


// ─── Shared Style Helper ──────────────────────────────────────────────────────

const computeContainerStyle = (hovered: boolean, glowOpacity: string) => ({
  position: 'relative' as const,
  background: hovered
    ? 'linear-gradient(#0e1b30, #0e1b30) padding-box, linear-gradient(135deg, rgba(100,255,218,0.25), rgba(129,140,248,0.15)) border-box'
    : 'linear-gradient(#0a1326, #0a1326) padding-box, linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03)) border-box',
  border: '1px solid transparent',
  boxShadow: hovered ? `0 12px 40px ${glowOpacity}` : 'none',
  transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
});


// ─── Reusable Components ──────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HoverBorder({ hovered }: { hovered: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-xl pointer-events-none"
      animate={{ opacity: hovered ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      style={{
        background: 'linear-gradient(#0d1f35,#0d1f35) padding-box, linear-gradient(135deg,rgba(100,255,218,0.3),rgba(129,140,248,0.15)) border-box',
        border: '1px solid transparent',
      }}
    />
  );
}

function SectionHeader({ whiteText, tealText, subtitle }: {
  whiteText: string;
  tealText: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mb-10 text-left font-sans">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
        {whiteText}{' '}
        <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          {tealText}
        </span>
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm mt-2.5 max-w-xl leading-relaxed text-slate-500 font-normal">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}


// ─── Preloader ────────────────────────────────────────────────────────────────

function Preloader({ onDone }: { onDone: () => void }) {
  const [lines, setLines]       = useState<string[]>([]);
  const [barWidth, setBarWidth] = useState(0);
  const [done, setDone]         = useState(false);

  const sequence = [
    '> Initializing portfolio.config.ts...',
    '> Loading experience.json...',
    '> Compiling components...',
    '> Ready.',
  ];

  useEffect(() => {
    let i = 0;
    const addLine = () => {
      if (i < sequence.length) {
        setLines(prev => [...prev, sequence[i]]);
        i++;
        setTimeout(addLine, 320);
      } else {
        let p = 0;
        const bar = setInterval(() => {
          p += 6;
          setBarWidth(Math.min(p, 100));
          if (p >= 100) {
            clearInterval(bar);
            setTimeout(() => { setDone(true); setTimeout(onDone, 500); }, 200);
          }
        }, 22);
      }
    };
    setTimeout(addLine, 200);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: '#050d1a' }}
        >
          <div className="w-full max-w-sm px-6 space-y-4">
            <div className="flex gap-1.5 mb-4">
              {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => (
                <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>

            <div className="font-mono text-xs space-y-2" style={{ color: '#4a5568' }}>
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    color:      line?.startsWith('> Ready') ? '#64ffda' : undefined,
                    fontWeight: line?.startsWith('> Ready') ? 700      : undefined,
                  }}
                >
                  {line}
                </motion.div>
              ))}
            </div>

            <div className="w-full h-[2px] rounded-full overflow-hidden mt-4" style={{ background: '#0d1f35' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg,#64ffda,#818cf8)' }}
              />
            </div>
            <div className="text-right font-mono text-[10px]" style={{ color: '#2d3748' }}>{barWidth}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// ─── Ambient Orbs ─────────────────────────────────────────────────────────────

function AmbientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute rounded-full" style={{ width: 600, height: 600, top: -120, right: -100, background: 'radial-gradient(circle,rgba(100,255,218,0.06) 0%,transparent 70%)' }} />
      <div className="absolute rounded-full" style={{ width: 500, height: 500, bottom: -100, left: -80,  background: 'radial-gradient(circle,rgba(129,140,248,0.07) 0%,transparent 70%)' }} />
    </div>
  );
}


// ─── AI Chat Orb ──────────────────────────────────────────────────────────────

function AIChatOrb() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [didDrag, setDidDrag]   = useState(false);
  const [pos, setPos]           = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm Jay's portfolio assistant. Ask me about his work, projects or skills!" },
  ]);

  const dragStart      = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPos({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages, open]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.chat-inner')) return;
    setDragging(true);
    setDidDrag(false);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDidDrag(true);
      setPos({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, try again.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (!mounted) return null;

    // --- REPLACE YOUR OLD panelLeft AND panelTop WITH THIS: ---
    const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const chatWidth = isExpanded ? Math.min(480, winWidth - 24) : 340;
    const chatHeight = isExpanded ? Math.min(640, winHeight - 120) : 430;

    const panelLeft = Math.min(Math.max(pos.x - chatWidth + 20, 12), winWidth - chatWidth - 12);
    const panelTop  = pos.y - chatHeight - 50 < 12 ? pos.y + 36 : pos.y - chatHeight - 50;
    // ----------------------------------------------------------

  return (
    <>
      {/* Tooltip bubble */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="fixed z-[59] pointer-events-none"
            style={{ left: pos.x - 240, top: pos.y - 88 }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap"
              style={{ background: 'rgba(10,25,47,0.95)', border: '1px solid rgba(100,255,218,0.2)', color: '#94a3b8', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
            >
              <span style={{ color: '#64ffda' }}>✦</span>
              Want to know more about Jay?
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(100,255,218,0.1)', color: '#64ffda' }}>Ask me</span>
            </motion.div>
            <div className="absolute right-6 top-full w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(100,255,218,0.2)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb button */}
      <div
        onMouseDown={handleMouseDown}
        onClick={() => { if (!didDrag) setOpen(o => !o); }}
        className="fixed z-[60] select-none"
        style={{ left: pos.x - 28, top: pos.y - 28, cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <motion.div
          animate={open ? { scale: 1.1 } : { scale: 1 }}
          whileHover={{ scale: 1.08 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#0f2744,#1a3a5c)', boxShadow: open ? '0 0 0 2px #64ffda,0 0 32px rgba(100,255,218,0.3),0 8px 32px rgba(0,0,0,0.5)' : '0 0 0 1px rgba(100,255,218,0.25),0 0 20px rgba(100,255,218,0.1),0 8px 24px rgba(0,0,0,0.4)' }}
        >
          {!open && (
            <motion.div
              animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full"
              style={{ border: '1px solid rgba(100,255,218,0.5)' }}
            />
          )}
          <AnimatePresence mode="wait">
            {open
              ? <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></motion.svg>
              : <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></motion.svg>
            }
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-inner fixed z-[59] flex flex-col rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            style={{ left: panelLeft, top: panelTop, width: chatWidth, height: chatHeight, background: 'linear-gradient(180deg,#071424,#050d1a)', border: '1px solid rgba(100,255,218,0.15)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}
          >
{/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(100,255,218,0.08)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.2)' }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold tracking-wide" style={{ color: '#e2e8f0' }}>Jay's AI Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: '#64ffda' }} />
                  <span className="text-[9px] font-mono" style={{ color: '#475569' }}>personal-agent · online</span>
                </div>
              </div>

              {/* --- NEW EXPAND/COMPRESS BUTTON --- */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex w-6 h-6 rounded items-center justify-center transition-colors flex-shrink-0"
                style={{ color: '#64748b' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#64ffda'; e.currentTarget.style.background = 'rgba(100,255,218,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
                aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
              >
                {isExpanded ? (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
              {/* ---------------------------------- */}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'none' }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] text-[11px] leading-relaxed px-3 py-2 rounded-xl"
                    style={msg.role === 'user'
                      ? { background: 'rgba(100,255,218,0.12)', color: '#e2e8f0', borderRadius: '12px 12px 3px 12px', border: '1px solid rgba(100,255,218,0.15)' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#94a3b8', borderRadius: '12px 12px 12px 3px', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {/* THE FIX IS HERE */}
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <div className="space-y-2 flex flex-col">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="px-3 py-2.5 rounded-xl flex gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-1.5 h-1.5 rounded-full block" style={{ background: '#64ffda' }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-3 pb-3">
              <div className="flex gap-2 items-center px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(100,255,218,0.12)' }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about Jay..."
                  className="flex-1 bg-transparent text-[11px] outline-none font-mono placeholder:opacity-30"
                  style={{ color: '#e2e8f0' }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-30"
                  style={{ background: input.trim() ? 'rgba(100,255,218,0.15)' : 'transparent' }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


// ─── Experience Card ──────────────────────────────────────────────────────────

function ExpCard({ period, title, company, bullets, tags }: {
  period: string;
  title: string;
  company: string;
  bullets: string[];
  tags: string[];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col gap-3 p-4 sm:p-5 rounded-xl cursor-default"
      variants={itemVariants}
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.04)')}
    >
      <HoverBorder hovered={hovered} />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)',
              border: '1px solid rgba(100,255,218,0.15)',
              transition: 'all 0.3s'
            }}
          >
            <svg
              className="w-5 h-5"
              style={{
                color: hovered ? '#64ffda' : 'rgba(100,255,218,0.8)',
                transition: 'color 0.2s'
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>

          <div className="pt-0.5">
            <h3
              className="font-bold text-[15px]"
              style={{
                color: hovered ? '#64ffda' : '#e2e8f0',
                transition: 'color 0.2s'
              }}
            >
              {title}
            </h3>

            <div className="text-[13px] mt-0.5" style={{ color: '#64748b' }}>
              {company}
            </div>
          </div>
        </div>

        <div
          className="text-[10px] font-bold tracking-widest uppercase font-mono sm:text-right mt-1 sm:mt-0 pt-1"
          style={{ color: '#475569' }}
        >
          {period}
        </div>
      </div>

      {/* Bullet points */}
      <ul className="relative z-10 mt-1 space-y-1.5">
        {bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[12px] sm:text-[13px] leading-relaxed"
            style={{
              color: hovered ? '#94a3b8' : '#64748b',
              transition: 'color 0.2s'
            }}
          >
            <span
              className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: '#64ffda' }}
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="relative z-10 flex flex-wrap gap-1.5 mt-2">
        {tags.map(t => (
          <span
            key={t}
            className="text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wide"
            style={{
              background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)',
              color: '#64ffda',
              border: '1px solid rgba(100,255,218,0.15)',
              transition: 'background 0.2s'
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}


// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ icon, title, href, desc, tags, note, date }: {
  icon: string;
  title: string;
  href: string;
  desc: string;
  tags: string[];
  note?: string;
  date?: string; // <-- New date prop added here
}) {
  const [hovered, setHovered] = useState(false);

  const sentences      = desc.split('. ').filter(Boolean);
  const hasMoreContent = sentences.length > 1 || !!note;

  return (
    <motion.a
      href={href}
      target={href === '#' ? undefined : '_blank'}
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group p-4 sm:p-5 rounded-xl no-underline cursor-pointer flex flex-col h-full"
      variants={itemVariants}
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.06)')}
    >
      <HoverBorder hovered={hovered} />

      {/* Header - Updated to match Experience card layout */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', border: '1px solid rgba(100,255,218,0.15)', color: hovered ? '#64ffda' : 'rgba(100,255,218,0.35)', transition: 'all 0.3s' }}
          >
            {icon}
          </div>
          <h3 className="font-bold text-[14px] sm:text-[15px] flex items-center gap-1.5 flex-wrap pt-2" style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>
            {title}
            {href !== '#' && (
              <motion.span
                animate={hovered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -4, y: 4 }}
                transition={{ duration: 0.18 }}
                style={{ color: '#64ffda' }}
              >↗</motion.span>
            )}
          </h3>
        </div>
        
        {/* Permanently visible date in the top right */}
        {date && (
          <div className="text-[10px] font-bold tracking-widest uppercase font-mono sm:text-right mt-1 sm:mt-0 pt-2 flex-shrink-0" style={{ color: '#475569' }}>
            {date}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mt-4 space-y-1.5 relative z-10 flex-1">

        {/* First sentence – always visible */}
        {sentences.length > 0 && (
          <div className="flex items-start gap-2 text-[12px] sm:text-[13px] leading-relaxed" style={{ color: hovered ? '#94a3b8' : '#64748b', transition: 'color 0.2s' }}>
            <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#64ffda' }} />
            <span>{sentences[0].endsWith('.') ? sentences[0] : `${sentences[0]}.`}</span>
          </div>
        )}

        {/* Ellipsis hint */}
        {hasMoreContent && !hovered && (
          <div className="flex items-start gap-2 text-[12px] sm:text-[13px]">
            <span className="mt-2 w-1 h-1 flex-shrink-0" />
            <span className="tracking-widest animate-pulse text-lg leading-none" style={{ color: 'rgba(100,255,218,0.5)' }}>...</span>
          </div>
        )}

        {/* Remaining sentences – slide in on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden space-y-1.5"
            >
              {sentences.slice(1).map((sentence, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-[12px] sm:text-[13px] leading-relaxed"
                  style={{ color: '#94a3b8' }}
                >
                  <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#64ffda' }} />
                  {sentence.endsWith('.') ? sentence : `${sentence}.`}
                </motion.div>
              ))}
              {note && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: sentences.length * 0.05 }}
                  className="flex items-start gap-2 text-[11px] italic pt-1"
                  style={{ color: '#475569' }}
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#334155' }} />
                  {note}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags – always visible */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-4 relative z-10">
        {tags.map(t => (
          <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wide"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.15)', transition: 'background 0.2s' }}>
            {t}
          </span>
        ))}
      </div>
    </motion.a>
  );
}


// ─── Education Card ───────────────────────────────────────────────────────────

function EducationCard({ degree, school, period, gpa, highlights }: {
  degree: string;
  school: string;
  period: string;
  gpa?: string;
  highlights: string[];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative p-5 rounded-xl cursor-default"
      variants={itemVariants}
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.05)')}
    >
      <HoverBorder hovered={hovered} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', border: '1px solid rgba(100,255,218,0.15)', transition: 'all 0.3s' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[14px] sm:text-[15px]" style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>
              {degree}
            </h3>
            <div className="text-[13px] mt-0.5" style={{ color: '#64748b' }}>{school}</div>
          </div>
        </div>
        <div className="sm:text-right mt-1 sm:mt-0">
          <div className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: '#475569' }}>{period}</div>
          {gpa && (
            <div className="text-[10px] mt-1.5 px-2 py-0.5 rounded-full inline-block font-mono" style={{ background: 'rgba(100,255,218,0.08)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.15)' }}>
              GPA {gpa}
            </div>
          )}
        </div>
      </div>

      {/* Highlights */}
      <ul className="mt-4 space-y-2 relative z-10">
        {highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[12px] sm:text-[13px] leading-relaxed" style={{ color: '#94a3b8' }}>
            <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#64ffda' }} />
            {h}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}


// ─── Tech Stack ───────────────────────────────────────────────────────────────

function TechBadge({ name, category }: { name: string; category: string }) {
  const [isHovered, setIsHovered] = useState(false);

  const colors: Record<string, { color: string; border: string; bg: string }> = {
    'Programming Languages':  { color: '#ffd166', border: 'rgba(255,209,102,0.5)', bg: 'rgba(255,209,102,0.1)' },
    'Backend & Systems':      { color: '#4ade80', border: 'rgba(74,222,128,0.5)',  bg: 'rgba(74,222,128,0.1)'  },
    'Cloud & DevOps':         { color: '#38bdf8', border: 'rgba(56,189,248,0.5)',  bg: 'rgba(56,189,248,0.1)'  },
    'Databases & Data Stores':{ color: '#a855f7', border: 'rgba(168,85,247,0.5)', bg: 'rgba(168,85,247,0.1)' },
    'Frameworks & UI':        { color: '#f43f5e', border: 'rgba(244,63,94,0.5)',   bg: 'rgba(244,63,94,0.1)'   },
    'Software Engineering':   { color: '#fb923c', border: 'rgba(251,146,60,0.5)',  bg: 'rgba(251,146,60,0.1)'  },
    'Testing & Reliability':  { color: '#f472b6', border: 'rgba(244,114,182,0.5)', bg: 'rgba(244,114,182,0.1)' },
  };

  const { color, border, bg } = colors[category] ?? { color: '#64ffda', border: 'rgba(100,255,218,0.45)', bg: 'rgba(100,255,218,0.08)' };

  return (
    <motion.span
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="text-[11px] px-3 py-1 rounded-full font-medium tracking-wide border transition-all duration-200 font-sans cursor-default"
      style={{
        background:   isHovered ? bg                          : '#131e31',
        color:        isHovered ? color                       : '#94a3b8',
        borderColor:  isHovered ? border                      : 'rgba(255,255,255,0.05)',
        boxShadow:    isHovered ? `0 0 14px ${border}`        : 'none',
      }}
    >
      {name}
    </motion.span>
  );
}

function TechCard({ category, icon, items }: { category: string; icon: string; items: { name: string }[] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      variants={itemVariants}
      className="p-5 rounded-2xl cursor-default text-left"
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.03)')}
    >
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-slate-900/60 border border-slate-800 text-teal-400 font-mono">{icon}</div>
        <span className="text-[13px] font-bold text-slate-200 tracking-wide font-sans">{category}</span>
      </div>
      <div className="flex flex-wrap gap-2 relative z-10">
        {items.map(item => <TechBadge key={item.name} name={item.name} category={category} />)}
      </div>
    </motion.div>
  );
}

const techStack: { category: string; icon: string; items: { name: string }[] }[] = [
  {
    category: 'Programming Languages', icon: '</>',
    items: [
      { name: 'Python' }, { name: 'Java' }, { name: 'JavaScript' }, { name: 'TypeScript' }, { name: 'Go' }, { name: 'C' }, { name: 'SQL' },
    ],
  },
  {
    category: 'Databases & Data Stores', icon: '🗄️',
    items: [
      { name: 'PostgreSQL' }, { name: 'MySQL' }, { name: 'MongoDB' }, { name: 'Redis' },
    ],
  },
  {
    category: 'ML & AI', icon: '🧠',
    items: [
      { name: 'PyTorch' }, { name: 'PyTorch Geometric' }, { name: 'TensorFlow' }, { name: 'scikit-learn' },
      { name: 'Machine Learning' }, { name: 'Deep Learning' }, { name: 'Transformers' }, { name: 'LLMs' },
      { name: 'Prompt Engineering' }, { name: 'Agentic AI' }, { name: 'Multi-Agent Systems' }, { name: 'LangGraph' },
      { name: 'Tool Calling' }, { name: 'Claude API' }, { name: 'Graph Neural Networks' }, { name: 'GraphSAGE' },
      { name: 'OCR (Tesseract)' },
    ],
  },
  {
    category: 'Backend & Systems', icon: '⚙️',
    items: [
      { name: 'Django' }, { name: 'DRF' }, { name: 'REST API' }, { name: 'Apache Kafka' },
      { name: 'Event-Driven Architecture' }, { name: 'Microservices' }, { name: 'Distributed Systems' },
      { name: 'Transactional Outbox' }, { name: 'Idempotency' }, { name: 'ACID Transactions' },
      { name: 'WebSockets' }, { name: 'JSON Schema' }, { name: 'WebRTC' }, { name: 'JSON Web Tokens' },
      { name: 'ETL Pipelines' }, { name: 'Web Scraping' }, { name: 'Operating Systems' }, { name: 'Kernel Development' },
      { name: 'Static Analysis' },
    ],
  },

  {
    category: 'Frameworks & UI', icon: '🛠️',
    items: [
      { name: 'React' }, { name: 'Spring Boot' }, { name: 'Streamlit' }, { name: 'Pydantic' },
      { name: 'Pandas' }, { name: 'NumPy' },
    ],
  },
  {
    category: 'Software Engineering', icon: '🏗️',
    items: [
      { name: 'System Design' }, { name: 'Full-Stack Development' }, { name: 'Backend Development' },
      { name: 'OOP' }, { name: 'Payment Systems' }, { name: 'Concurrency' }, { name: 'Thread Synchronization' },
      { name: 'Parallel Processing' }, { name: 'Agile' }, { name: 'Scrum' },
    ],
  },
  {
    category: 'Testing & Reliability', icon: '🧪',
    items: [
      { name: 'Unit Testing' }, { name: 'pytest' }, { name: 'JUnit 5' }, { name: 'Testcontainers' },
      { name: 'Chaos Testing' }, { name: 'Load Testing' }, { name: 'k6' }, { name: 'Locust' },
      { name: 'Continuous Integration' },
    ],
  },
  {
    category: 'Cloud & DevOps', icon: '☁️',
    items: [
      { name: 'AWS (EC2, RDS, VPC)' }, { name: 'Docker' }, { name: 'Docker Compose' }, { name: 'Git' },
      { name: 'GitHub' }, { name: 'GitHub Actions' }, { name: 'Linux' },
    ],
  },
];


// ─── Award / Cert Card ────────────────────────────────────────────────────────

function AwardCard({ year, title, org, href, desc, tags }: {
  year: string;
  title: string;
  org: string;
  href?: string;
  desc: string;
  tags: string[];
}) {
  const [hovered, setHovered] = useState(false);
  const Wrapper = href ? motion.a : motion.div;

  return (
    <Wrapper
      {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative flex flex-col gap-3 p-4 sm:p-5 rounded-xl no-underline cursor-pointer"
      variants={itemVariants}
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.04)')}
    >
      <HoverBorder hovered={hovered} />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', border: '1px solid rgba(100,255,218,0.15)', transition: 'all 0.3s' }}
          >
            <svg className="w-5 h-5" style={{ color: hovered ? '#64ffda' : 'rgba(100,255,218,0.8)', transition: 'color 0.2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="pt-0.5">
            <h3 className="font-bold text-[15px] flex items-center gap-1.5 flex-wrap" style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>
              {title}
              {href && (
                <motion.span
                  animate={hovered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -4, y: 4 }}
                  transition={{ duration: 0.18 }}
                  style={{ color: '#64ffda' }}
                >↗</motion.span>
              )}
            </h3>
            <div className="text-[13px] mt-0.5" style={{ color: '#64748b' }}>{org}</div>
          </div>
        </div>
        <div className="text-[10px] font-bold tracking-widest uppercase font-mono sm:text-right mt-1 sm:mt-0 pt-1" style={{ color: '#475569' }}>
          {year}
        </div>
      </div>

      {/* Description */}
      <div className="relative z-10 mt-1">
        <p className="text-[13px] leading-relaxed" style={{ color: hovered ? '#94a3b8' : '#64748b', transition: 'color 0.2s' }}>
          {desc}
        </p>
      </div>

      {/* Tags */}
      <div className="relative z-10 flex flex-wrap gap-1.5 mt-2">
        {tags.map(t => (
          <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wide"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.15)', transition: 'background 0.2s' }}>
            {t}
          </span>
        ))}
      </div>
    </Wrapper>
  );
}


// ─── Sidebar Social Links ─────────────────────────────────────────────────────
const EMAIL_ADDRESS = 'jayadmit456@gmail.com';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL_ADDRESS}`;
const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/Jaypath456',
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jaypathare3/',
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  },
  {
    label: 'Email',
    href: GMAIL_COMPOSE_URL,
    display: EMAIL_ADDRESS,
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
  },
];
function CopyableRow({ icon, iconColor, value, displayValue }: {
  icon: string;
  iconColor: string;
  value: string;
  displayValue?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard API unavailable – fail silently
    }
  };

  return (
    <div className="p-3 rounded-xl bg-[#0a1326] border border-slate-800/80 flex items-start gap-3 shadow-lg">
      <span className="text-sm flex-shrink-0 mt-0.5" style={{ color: iconColor }}>{icon}</span>
      <span className="text-slate-200 flex-1 min-w-0 text-left leading-relaxed">{displayValue ?? value}</span>
      <motion.button
        type="button"
        onClick={handleCopy}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Copy ${displayValue ?? value}`}
        className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5"
        style={{
          background: copied ? 'rgba(100,255,218,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${copied ? 'rgba(100,255,218,0.4)' : 'rgba(255,255,255,0.08)'}`,
          transition: 'background 0.2s, border-color 0.2s',
        }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.svg key="check" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}
              className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          ) : (
            <motion.svg key="copy" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }}
              className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
function ContactStrip() {
  return (
    <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-500">Connect</div>
      <div className="flex items-center gap-5 flex-wrap">
        {socialLinks.map(({ label, href, icon }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ y: -3, color: '#64ffda' }}
            transition={{ duration: 0.2 }}
            className="group relative"
            style={{ color: '#334155', display: 'flex', alignItems: 'center' }}
          >
            {icon}
            <span
              className="absolute -top-8 left-0 px-2.5 py-1 rounded-md text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
              style={{ background: '#0a1326', border: '1px solid rgba(100,255,218,0.2)', color: '#64ffda', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            >
              {(socialLinks.find(s => s.href === href) as any)?.display ?? href.replace('https://', '')}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [mousePos, setMousePos]       = useState({ x: 0, y: 0 });
  const [loaded, setLoaded]           = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const navItems = ['about', 'experience', 'projects', 'education', 'stack', 'awards', 'contact'];

  const sidebarVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
  const sidebarItem     = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    const raf = requestAnimationFrame(() => {
      navItems.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    });
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [loaded]);

  return (
    <>
      <Preloader onDone={() => setLoaded(true)} />

      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="relative min-h-screen antialiased"
            style={{ background: '#050d1a', color: '#94a3b8' }}
          >
            <style>{`*{-webkit-font-smoothing:antialiased}::-webkit-scrollbar{display:none}html{scroll-behavior:smooth}.no-underline{text-decoration:none}`}</style>

            <AmbientOrbs />

            {/* Mouse glow */}
            <div className="pointer-events-none fixed inset-0 z-0 hidden md:block" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px,rgba(100,255,218,0.03) 0%,transparent 70%)` }} />

            {/* Dot grid */}
            <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle,rgba(148,163,184,0.05) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="container mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">


                {/* ══ SIDEBAR ══════════════════════════════════════════════════ */}
                <motion.aside
                  variants={sidebarVariants} initial="hidden" animate="visible"
                  className="lg:col-span-5 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto flex flex-col py-8 sm:py-10 lg:py-14 lg:pl-3 lg:pr-6 gap-6"
                  style={{ scrollbarWidth: 'none' }}
                >
                  {/* Profile */}
                  <motion.div variants={sidebarItem} className="flex flex-col sm:flex-row sm:items-center gap-6 mb-2">
                    <div className="relative flex-shrink-0 w-max">
                      <div className="absolute -inset-[3px] rounded-full" style={{ background: 'linear-gradient(135deg, rgba(100,255,218,0.5), rgba(129,140,248,0.3))', filter: 'blur(5px)' }} />
                      <div className="relative w-32 h-[188px] rounded-full overflow-hidden border-[3px] flex-shrink-0" style={{ borderColor: 'rgba(100,255,218,0.3)' }}>
                        <img src="/jay.png" alt="Jay Niketan Pathare" className="w-full h-full object-cover" style={{ objectPosition: '38% 15%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: 'rgba(100,255,218,0.5)' }}>// software engineer</div>
                      <h1 className="text-2xl sm:text-3xl xl:text-[2.2rem] font-extrabold tracking-tight leading-tight" style={{ color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                        Jay Niketan <span style={{ color: '#64ffda', textShadow: '0 0 40px rgba(100,255,218,0.25)' }}>Pathare</span>
                      </h1>
                      <div className="mt-3 flex items-center gap-2.5">
                        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#64ffda', boxShadow: '0 0 8px rgba(100,255,218,0.6)' }} />
                        <span className="text-[12px] font-semibold tracking-wide" style={{ color: '#64748b' }}>Open to opportunities · MS CS @ UB</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Metrics */}
                  <motion.div variants={sidebarItem} className="grid grid-cols-3 gap-2.5">
                    {[{ n: '3.85', label: 'GPA / 4.0' }, { n: '1+', label: 'yrs exp.' }, { n: "Feb '27", label: 'MS CS' }].map(({ n, label }) => (
                      <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="text-[17px] font-extrabold" style={{ color: '#e2e8f0' }}>{n}</div>
                        <div className="text-[9px] uppercase tracking-widest font-bold mt-0.5" style={{ color: '#475569' }}>{label}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Desktop nav */}
                  <motion.nav variants={sidebarItem} className="hidden lg:block space-y-0.5">
                    {navItems.map(item => {
                      const isActive = activeSection === item;
                      return (
                        <a
                          key={item}
                          href={`#${item}`}
                          className="group flex items-center gap-4 py-1.5 text-[11px] font-bold uppercase tracking-widest"
                          style={{ color: isActive ? '#e2e8f0' : '#334155', transition: 'color 0.2s', textDecoration: 'none' }}
                        >
                          <motion.span animate={{ width: isActive ? 48 : 24 }} transition={{ duration: 0.3 }} className="h-[1px] block flex-shrink-0" style={{ background: isActive ? '#64ffda' : '#1e293b' }} />
                          <span style={{ transition: 'color 0.2s' }} className={isActive ? '' : 'group-hover:text-slate-400'}>
                            {item === 'about'   ? 'About Me'        :
                             item === 'stack'   ? 'Technical Stack' :
                             item === 'awards'  ? 'Certificates & Awards'  :
                             item === 'contact' ? 'Get In Touch'    : item}
                          </span>
                          {isActive && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="ml-auto w-1.5 h-1.5 rounded-full"
                              style={{ background: '#64ffda' }}
                            />
                          )}
                        </a>
                      );
                    })}
                  </motion.nav>

                  {/* Mobile nav */}
                  <motion.nav variants={sidebarItem} className="flex lg:hidden gap-2 flex-wrap">
                    {navItems.map(item => {
                      const isActive = activeSection === item;
                      return (
                        <a key={item} href={`#${item}`} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                          style={{ borderColor: isActive ? '#64ffda' : 'rgba(100,116,139,0.2)', color: isActive ? '#64ffda' : '#475569', background: isActive ? 'rgba(100,255,218,0.05)' : 'transparent', textDecoration: 'none' }}>
                          {item}
                        </a>
                      );
                    })}
                  </motion.nav>

                  <motion.div variants={sidebarItem}><ContactStrip /></motion.div>

                  {/* Resume widget */}
                  <motion.div variants={sidebarItem}>
                    <div className="w-full relative overflow-hidden rounded-xl p-4" style={{ background: 'linear-gradient(135deg,rgba(15,39,68,0.9),rgba(7,20,36,0.95))', border: '1px solid rgba(100,255,218,0.1)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg,transparent,rgba(100,255,218,0.3),transparent)' }} />
                      <div className="flex justify-between items-center gap-4">
                        <div className="space-y-1.5 font-mono text-xs flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span style={{ color: '#64ffda', fontWeight: 700 }}>$</span>
                            <span style={{ color: '#e2e8f0' }}>resume.txt</span>
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }} className="inline-block w-[5px] h-3.5 ml-0.5 rounded-sm" style={{ background: '#64ffda' }} />
                          </div>
                          <div className="text-[11px]" style={{ color: '#94a3b8' }}>Warning: May cause sudden urge to hire.</div>
                        </div>
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-teal-500/20 shadow-lg relative z-10 bg-slate-900 flex-shrink-0 flex items-center justify-center" style={{ boxShadow: '0 0 12px rgba(100,255,218,0.1)' }}>
                          <img src="/cat-glasses.png" alt="Hacker Cat" className="w-full h-full object-cover brightness-90 contrast-110" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      </div>
                      <div className="mt-3.5 flex items-center justify-between gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-bold tracking-wide no-underline cursor-pointer"
                          style={{ border: '1px solid rgba(100,255,218,0.25)', background: 'rgba(100,255,218,0.07)', color: '#64ffda' }}>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          VIEW RESUME
                        </motion.a>
                        {/* <span className="text-[10px] font-mono italic" style={{ color: '#64748b' }}>(not a virus, promise)</span> */}
                      </div>
                    </div>
                  </motion.div>
                </motion.aside>


                {/* ══ MAIN CONTENT ═════════════════════════════════════════════ */}
                <main className="lg:col-span-7 py-8 sm:py-12 lg:py-20 space-y-24 sm:space-y-32 lg:border-l lg:pl-10 xl:pl-14" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>

                  {/* About */}
                  <section id="about" className="scroll-mt-24">
                    <SectionHeader whiteText="About" tealText="Me" subtitle="I build backend systems, developer tools and AI agents" />
                    <motion.div className="space-y-5 text-[14px] sm:text-[15px] leading-relaxed" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants} style={{ color: '#64748b' }}>
                      <motion.p variants={itemVariants}>
                I'm a software engineer working on backend systems and AI tools while earning my <strong style={{ color: '#e2e8f0', fontWeight: 500 }}>MS in Computer Science at the University at Buffalo</strong>. I like building things I can test and explain: LedgerFlow keeps payment records balanced through retries and crashes, RIPPLE maps the files a code change could affect and LaunchOps handles employee onboarding with clear roles and checks. My latest project, Triage Incident Agent, reads logs, metrics and runbooks to draft incident reports for human review. I care about what happens when things go wrong, so I test those cases too.
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        Before Buffalo, I was a <strong style={{ color: '#e2e8f0', fontWeight: 500 }}>Software Engineer at Thesis Mumbai Tech</strong>, building healthcare tools for 10,000+ patient records. Earlier, I deployed AWS services at Data Maven. At UB, I helped build HeinOnline's metadata pipeline and co-built GoingOnce with a four-person team, winning 1st place in the ACV Auctions + Copart hackathon challenge. I've also interviewed about 20 student candidates, mentored new hires and organized a Git/GitHub workshop for UB's CS department. I hold an AWS Cloud Practitioner certification and have published research in music genre classification.
                      </motion.p>
                      <motion.p variants={itemVariants}>
                        Away from code, you'll usually find me studying chess strategies, tinkering with my Linux setup or trying out language models. There's always something new I want to figure out!
                      </motion.p>
                      <motion.div variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono" style={{ background: 'rgba(100,255,218,0.06)', border: '1px solid rgba(100,255,218,0.15)', color: '#64ffda' }}>
                          📍 Buffalo, NY · Open to relocation · F-1 OPT from Feb 2027, subject to approval
                        </div>
                      </motion.div>
                    </motion.div>
                  </section>

                  {/* Experience */}
                  <section id="experience" className="scroll-mt-24">
                    <SectionHeader whiteText="Professional" tealText="Experience" subtitle="Healthcare software, data pipelines and cloud services" />
                    <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <ExpCard
                        period="Jan 2026 – Apr 2026" title="Software Engineer Practicum" company="HeinOnline (University at Buffalo)"
                        bullets={[
                          "Developed a pipeline combining CrossRef API, web scrapers and OCR/LLM vision (Tesseract, Qwen3-VL 8B, Qwen3.5-35B) to extract metadata from 28k+ law journal pages.",
                          "Combined all three sources with fuzzy matching, cutting manual entry by about 90% and reaching about 91% extraction accuracy over five rounds of testing.",
                          "Ran journals in parallel through a shared worker queue, cutting processing time by over 80% and flagging uncertain fields for human review.",
                          "Standardized author names by matching them to HeinOnline's 500+ authors in PostgreSQL, even when spelled differently."
                        ]}
                        tags={['Python', 'Tesseract-OCR', 'Qwen', 'CrossRef API', 'Fuzzy Matching', 'Docker', 'PostgreSQL', 'Team of 5']}
                      />
                      <ExpCard
                        period="Aug 2024 – Aug 2025" title="Software Engineer" company="Thesis Mumbai Tech"
                        bullets={[
                          "Led technical work with a team of 4: met clients, built prototypes to agree on scope and split the work into tasks.",
                          "Delivered Patient Management and Consent modules for 10k+ records and streamed baby-warmer readings through WebSockets and Redis into PostgreSQL for live monitoring at about 2-second intervals.",
                          "Added WebRTC calls so remote doctors could review results with patients and nurses, plus PDF reports and a color-blindness test with 95%+ accuracy.",
                          "Packaged 3+ production projects with Docker Compose so local, staging and deployment environments used the same setup.",
                          "Tracked the health of 4 production projects with a heartbeat dashboard that pings each site every 5 minutes.",
                          "Interviewed about 20 student candidates and helped new hires get started through weekly coding sessions over their first 3 weeks."
                        ]}
                        tags={['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'ReactJS', 'WebRTC', 'WebSockets', 'IoT', 'Agile / Scrum']}
                      />
                      <ExpCard
                        period="Nov 2023 – May 2024" title="Cloud Engineer Intern" company="Data Maven Pvt Ltd"
                        bullets={[
                          "Deployed backend services on AWS EC2 and RDS, using VPC networking and security groups to restrict access.",
                          "Automated cloud setup, cutting setup time by about 40% and reducing deployment issues."
                        ]}
                        tags={['AWS', 'EC2', 'RDS', 'VPC', 'Security Groups', 'Cloud Infrastructure']}
                      />
                      <ExpCard
                        period="Jun 2023 – Aug 2023" title="Data Engineer Intern" company="Go Digital Technology Consulting"
                        bullets={[
                          "Created a Python (Pandas, NumPy) and MySQL ETL workflow to clean transaction data and automate anomaly reports for the compliance and audit team."
                        ]}
                        tags={['Python', 'Pandas', 'NumPy', 'MySQL', 'ETL']}
                      />
                    </motion.div>
                  </section>

                  {/* Projects */}
                  <section id="projects" className="scroll-mt-24">
                    <SectionHeader whiteText="Featured" tealText="Projects" subtitle="Projects I built, tested and kept improving" />
                    <motion.div className="grid grid-cols-1 xl:grid-cols-2 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <ProjectCard
                        date="Nov 2026"
                        icon="TRI" title="Triage Incident Agent" href="#"
                        desc="Developed a Python and LangGraph agent that reads incident logs, metrics and runbooks to draft reports for human review. It checks cited evidence IDs, blocks forbidden actions and caps each run at six model attempts and seven tool attempts. It covers four incident types and supports inconclusive reports when the evidence is thin."
                        note="Capstone project · Synthetic incidents · Drafts need human review"
                        tags={['Python', 'LangGraph', 'Pydantic', 'Tool Calling', 'pytest']}
                      />
                      <ProjectCard
                        date="Oct 2026"
                        icon="LDG" title="LedgerFlow: Payments Backend & Double-Entry Ledger" href="https://github.com/Jaypath456/ledgerFlow"
                        desc="Connected two Spring Boot services through Kafka to record payments in a PostgreSQL double-entry ledger. Retries don't post payments twice and account locks protect balances when requests overlap. Passed 84 tests on real PostgreSQL and Kafka; one load-test ramp sustained about 1,200 payments per second on a single laptop."
                        note="Personal project · Local tests and load measurements"
                        tags={['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker Compose']}
                      />
                      <ProjectCard
                        date="Oct 2026"
                        icon="AGT" title="GoingOnce: Multi-Agent Car Marketplace" href="https://github.com/raunakpandey1/goingonce"
                        desc="Worked with a four-person team on a car marketplace prototype, focusing on negotiation and fleet agents plus the Streamlit and React interfaces. Four agents handle buying, selling, negotiation and fleet planning with human approval before simulated bids or listings. We won 1st place in the ACV Auctions + Copart challenge at UB's AI for Good Hackathon."
                        note="Team of 4 · Hackathon prototype on simulated data"
                        tags={['Python', 'LangGraph', 'Claude API', 'Multi-Agent Systems', 'React']}
                      />
                      <ProjectCard
                        date="Aug 2026"
                        icon="RPL" title="RIPPLE: Change-Impact Analysis for Python" href="https://github.com/Jaypath456/ripple"
                        desc="Created a command-line tool that predicts which Python files and tests a feature could affect, then checks the prediction against a real Git diff. Python runs seven analysis tools and rejects missing or fabricated evidence without executing the target code. The offline suite passes 856 tests; diff checks flag missing tests, unrelated edits and callers left behind after signature changes."
                        note="Personal project · Python repositories only · 6 optional UI tests skipped"
                        tags={['Python', 'Static Analysis', 'Git', 'Pydantic', 'pytest']}
                      />
                      <ProjectCard
                        date="Jul 2026"
                        icon="LLM" title="LLM Application Optimization Engine" href="https://github.com/Jaypath456/llm-resume-pipeline"
                        desc="Automated resume and cover letter generation from job descriptions, with a separate fit assessment. Python rejects unsupported claims, checks numbers against source evidence and verifies the generated PDF layout. Three AI workers write in parallel, cutting typical runtime by about 73%, backed by 2,500+ automated tests."
                        note="Open source"
                        tags={['Python', 'LLMs', 'pytest', 'Concurrency', 'LaTeX']}
                      />
                      <ProjectCard
                        date="May 2026"
                        icon="⚙️" title="Pintos OS: User Programs" href="#"
                        desc="Implemented the user-programs layer of Pintos, a teaching operating system, in C. It handles process startup, arguments, parent-child waiting and 13 system calls with locks and memory checks. Each process supports up to 128 open files and all 80 project tests pass."
                        note="Academic project · CSE 521 · Course repo is private"
                        tags={['C', 'Kernel', 'Syscalls', 'Synchronization']}
                      />
                      <ProjectCard
                        date="Apr 2026"
                        icon="GNN" title="Fraud Detection with Graph Neural Networks" href="https://github.com/Jaypath456/gnn-fraud-detection"
                        desc="Trained a GraphSAGE fraud model on 590k+ IEEE-CIS transactions, linking records that share card, address or email details. It reached 0.9259 AUC-ROC against about 0.858 for an MLP baseline, using focal loss and threshold tuning for the roughly 27.6:1 class imbalance. On the separate Elliptic dataset, it reached about 0.988 AUC."
                        note="Academic project"
                        tags={['PyTorch', 'GraphSAGE', 'Graph Neural Networks', 'Python']}
                      />
                      <ProjectCard
                        date="Mar 2026"
                        icon="OPS" title="LaunchOps: Employee Onboarding Workflows" href="https://github.com/Jaypath456/LaunchOps"
                        desc="Built an onboarding platform with Django, MongoDB and React, with 20 tasks across HR, IT, managers and employees. Roles, prerequisites and evidence checks control completion while worker retries avoid creating duplicate accounts in simulated services. Passed 126 backend tests and 47 frontend tests; three local crash campaigns kept data checks intact with failed jobs flagged for IT review."
                        note="Personal project · External services are simulated"
                        tags={['Django', 'React', 'TypeScript', 'MongoDB', 'Go']}
                      />
                    </motion.div>
                  </section>

                  {/* Education */}
                  <section id="education" className="scroll-mt-24">
                    <SectionHeader whiteText="Academic" tealText="Background" subtitle="What I studied and built along the way" />
                    <motion.div className="space-y-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <EducationCard
                        degree="M.S. Computer Science" school="University at Buffalo, SUNY"
                        period="Aug 2025 – Dec 2026" gpa="3.85 / 4.0"
                        highlights={[
                          'Capstone: Triage Incident Agent',
                          'Industry project: OCR-LLM metadata pipeline for HeinOnline (practicum)',
                          'Organized Git & GitHub workshop for CS&E dept, Certificate of Appreciation',
                          'Public Safety Aide, University at Buffalo campus',
                        ]}
                      />
                      <EducationCard
                        degree="B.E. Information Technology" school="VESIT · Mumbai University, India"
                        period="Aug 2019 – May 2023"
                        highlights={[
                          'Capstone: Music Genre Classification, published in IJRAR, Vol. 10, Issue 2',
                          'Achieved 97.68% classification accuracy using CatBoost and KNN',
                          'Coursework: Data Structures, DBMS, Networking, OOP',
                          'Active participant in campus software testing events',
                        ]}
                      />
                    </motion.div>
                  </section>

                  {/* Technical Stack */}
                  <section id="stack" className="scroll-mt-24">
                    <SectionHeader whiteText="Technical" tealText="Competencies" subtitle="Languages, frameworks and tools I work with" />
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      {techStack.map(t => <TechCard key={t.category} {...t} />)}
                    </motion.div>
                  </section>

                  {/* Certs, Awards & Publications */}
                  <section id="awards" className="scroll-mt-24">
                    <SectionHeader whiteText="Certificates, Awards &" tealText="Publications" subtitle="Awards, certifications and published work" />
                    <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <AwardCard
                        year="Oct 2026" title="1st Place, ACV Auctions + Copart Challenge" org="AI for Good Hackathon Design Challenge · University at Buffalo"
                        href="https://github.com/raunakpandey1/goingonce"
                        desc="Our four-person team won 1st place in the ACV Auctions + Copart challenge at UB's AI for Good Hackathon for GoingOnce, a car marketplace prototype built with LangGraph and Claude on simulated data."
                        tags={['Hackathon', '1st Place', 'Team of 4', 'LangGraph', 'Multi-Agent Systems']}
                      />
                      <AwardCard
                        year="Feb 2026" title="Certificate of Appreciation" org="University at Buffalo"
                        href="https://drive.google.com/file/d/15yVN_8Dbgkt-B_pCi7V1fGcuibhWLiNA/view?usp=sharing"
                        desc='Recognized for organizing the CS department&#39;s "GitHub: Hands-On from Basics to Advanced" workshop. Helped participants work with repositories, branches and shared code.'
                        tags={['Git', 'GitHub', 'Technical Training', 'Event Management']}
                      />
                      <AwardCard
                        year="Jul 2024" title="AWS Cloud Practitioner" org="Amazon Web Services"
                        href="https://www.credly.com/badges/6a3649a7-3e17-487b-bff4-b27c6b69ff62/public_url"
                        desc="Certified in AWS cloud concepts, services, security and pricing, covering EC2, RDS, VPC, S3 and IAM."
                        tags={['AWS', 'Cloud', 'Certification']}
                      />
                      <AwardCard
                        year="Apr 2023" title="Research Publication" org="IJRAR"
                        href="https://www.ijrar.org/papers/IJRAR23B1728.pdf"
                        desc='J. Pathare, D. Ahuja, R. Singh, M. Sabnis - "Music Genre Classification" - International Journal of Research and Analytical Reviews, Volume 10, Issue 2. ISSN: 2348-1269. Achieved 97.68% classification accuracy using CatBoost and KNN.'
                        tags={['Research', 'ML', 'Published', 'IJRAR']}
                      />
                    </motion.div>
                  </section>

                  {/* Contact */}
                  <section id="contact" className="scroll-mt-24 space-y-6">
                    <SectionHeader whiteText="Get In" tealText="Touch" subtitle="Open to full-time roles in backend engineering and ML" />
                    <div className="w-full rounded-2xl p-6 relative overflow-hidden bg-slate-950/40 border border-slate-900 shadow-2xl">
                      <div className="mb-6"><WorldMap /></div>
                      <div className="text-center max-w-md mx-auto space-y-4 relative z-10 pt-2 font-sans">
                        <p className="text-xs leading-relaxed font-normal" style={{ color: '#64748b' }}>
                          I'm looking for full-time roles in backend engineering and machine learning. Available for F-1 OPT from February 2027, subject to approval. If you're building something interesting or want to talk about my work, I'd love to hear from you!
                        </p>
                        <div className="grid grid-cols-1 gap-2.5 text-left text-xs font-mono max-w-xs mx-auto pt-2">
                          <CopyableRow icon="✉" iconColor="#2dd4bf" value="jayadmit456@gmail.com" />
                          <CopyableRow icon="📍" iconColor="#818cf8" value="Buffalo, NY, USA" displayValue="Buffalo, NY, USA · Open to relocation" />
                          <CopyableRow icon="📞" iconColor="#facc15" value="+17163039924" displayValue="+1 (716) 303-9924" />
                        </div>
                        <motion.a
                          whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(100,255,218,0.3)' }} whileTap={{ scale: 0.98 }}
                          href={GMAIL_COMPOSE_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-colors mt-3"
                          style={{ background: '#64ffda', color: '#050d1a' }}
                        >
                          ⚡ SEND MESSAGE
                        </motion.a>
                      </div>
                    </div>
                  </section>

                  {/* Footer */}
                  <Reveal>
                    <footer className="text-[11px] pt-12 sm:pt-16 font-mono leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: '#1e293b' }}>
                      Jay Niketan Pathare. Built with <span style={{ color: '#334155' }}>Next.js</span>, <span style={{ color: '#334155' }}>Tailwind CSS</span> &amp; <span style={{ color: '#334155' }}>Framer Motion</span>.
                    </footer>
                  </Reveal>

                </main>
              </div>
            </div>

            <AIChatOrb />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
