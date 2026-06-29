'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import WorldMap from '../components/WorldMap';

// ─── Reusable scroll-reveal wrapper ───────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const listVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Centralized Box Model Rendering Engine Rule ─────────────────────────────
const computeContainerStyle = (hovered: boolean, glowOpacity: string) => ({
  position: 'relative' as const,
  background: hovered
    ? 'linear-gradient(#0e1b30, #0e1b30) padding-box, linear-gradient(135deg, rgba(100,255,218,0.25), rgba(129,140,248,0.15)) border-box'
    : 'linear-gradient(#0a1326, #0a1326) padding-box, linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03)) border-box',
  border: '1px solid transparent',
  boxShadow: hovered ? `0 12px 40px ${glowOpacity}` : 'none',
  transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
});

// ─── Split Two-Tone Headings Component ───────────────────────────────────────
function SectionHeader({ whiteText, tealText, subtitle }: { whiteText: string; tealText: string; subtitle?: string }) {
  return (
    <Reveal className="mb-10 text-left font-sans">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
        {whiteText} <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">{tealText}</span>
      </h2>
      {subtitle && <p className="text-xs sm:text-sm mt-2.5 max-w-xl leading-relaxed text-slate-500 font-normal">{subtitle}</p>}
    </Reveal>
  );
}

// ─── Preloader Component ──────────────────────────────────────────────────────
function Preloader({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [barWidth, setBarWidth] = useState(0);
  const [done, setDone] = useState(false);
  const sequence = ['> Initializing portfolio.config.ts...', '> Loading experience.json...', '> Compiling components...', '> Ready.'];

  useEffect(() => {
    let i = 0;
    const addLine = () => {
      if (i < sequence.length) { setLines(prev => [...prev, sequence[i]]); i++; setTimeout(addLine, 320); }
      else {
        let p = 0;
        const bar = setInterval(() => {
          p += 6; setBarWidth(Math.min(p, 100));
          if (p >= 100) { clearInterval(bar); setTimeout(() => { setDone(true); setTimeout(onDone, 500); }, 200); }
        }, 22);
      }
    };
    setTimeout(addLine, 200);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: '#050d1a' }}>
          <div className="w-full max-w-sm px-6 space-y-4">
            <div className="flex gap-1.5 mb-4">
              {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
            </div>
            <div className="font-mono text-xs space-y-2" style={{ color: '#4a5568' }}>
              {lines.map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  style={{ color: line?.startsWith('> Ready') ? '#64ffda' : undefined, fontWeight: line?.startsWith('> Ready') ? 700 : undefined }}>
                  {line}
                </motion.div>
              ))}
            </div>
            <div className="w-full h-[2px] rounded-full overflow-hidden mt-4" style={{ background: '#0d1f35' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg,#64ffda,#818cf8)' }} />
            </div>
            <div className="text-right font-mono text-[10px]" style={{ color: '#2d3748' }}>{barWidth}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scroll-progress bar ──────────────────────────────────────────────────────
// function ScrollBar() {
//   const { scrollYProgress } = useScroll();
//   const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
//   return <motion.div style={{ scaleX, background: 'linear-gradient(90deg,#64ffda,#818cf8)' }} className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50" />;
// }

// ─── Ambient orbs ─────────────────────────────────────────────────────────────
function AmbientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute rounded-full" style={{ width: 600, height: 600, top: -120, right: -100, background: 'radial-gradient(circle,rgba(100,255,218,0.06) 0%,transparent 70%)' }} />
      <div className="absolute rounded-full" style={{ width: 500, height: 500, bottom: -100, left: -80, background: 'radial-gradient(circle,rgba(129,140,248,0.07) 0%,transparent 70%)' }} />
    </div>
  );
}

// ─── AI Chat Orb ──────────────────────────────────────────────────────────────
function AIChatOrb() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm Jay's AI assistant. Ask me about his experience, skills, or projects — I know everything about him! 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [didDrag, setDidDrag] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setPos({ x: window.innerWidth - 80, y: window.innerHeight - 80 }); setMounted(true); }, []);
  useEffect(() => { if (open) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); }, [messages, open]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.chat-inner')) return;
    setDragging(true); setDidDrag(false);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: pos.x, oy: pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.mx, dy = e.clientY - dragStart.current.my;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDidDrag(true);
      setPos({ x: dragStart.current.ox + dx, y: dragStart.current.oy + dy });
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMsg }].map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, try again.' }]);
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]); }
    finally { setLoading(false); setTimeout(() => inputRef.current?.focus(), 100); }
  };

  if (!mounted) return null;
  const panelLeft = Math.min(Math.max(pos.x - 320, 12), (typeof window !== 'undefined' ? window.innerWidth : 1200) - 360);
  const panelTop = pos.y - 480 < 12 ? pos.y + 36 : pos.y - 480;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1.5, duration: 0.4 }} className="fixed z-[59] pointer-events-none"
            style={{ left: pos.x - 240, top: pos.y - 88 }}>
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap"
              style={{ background: 'rgba(10,25,47,0.95)', border: '1px solid rgba(100,255,218,0.2)', color: '#94a3b8', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
              <span style={{ color: '#64ffda' }}>✦</span>
              Want to know more about Jay?
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(100,255,218,0.1)', color: '#64ffda' }}>Ask me</span>
            </motion.div>
            <div className="absolute right-6 top-full w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(100,255,218,0.2)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <div onMouseDown={handleMouseDown} onClick={() => { if (!didDrag) setOpen(o => !o); }}
        className="fixed z-[60] select-none" style={{ left: pos.x - 28, top: pos.y - 28, cursor: dragging ? 'grabbing' : 'grab' }}>
        <motion.div animate={open ? { scale: 1.1 } : { scale: 1 }} whileHover={{ scale: 1.08 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#0f2744,#1a3a5c)', boxShadow: open ? '0 0 0 2px #64ffda,0 0 32px rgba(100,255,218,0.3),0 8px 32px rgba(0,0,0,0.5)' : '0 0 0 1px rgba(100,255,218,0.25),0 0 20px rgba(100,255,218,0.1),0 8px 24px rgba(0,0,0,0.4)' }}>
          {!open && <motion.div animate={{ scale: [1, 1.7], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }} className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(100,255,218,0.5)' }} />}
          <AnimatePresence mode="wait">
            {open
              ? <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></motion.svg>
              : <motion.svg key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></motion.svg>
            }
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="chat-inner fixed z-[59] flex flex-col rounded-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
            style={{ left: panelLeft, top: panelTop, width: 340, height: 430, background: 'linear-gradient(180deg,#071424,#050d1a)', border: '1px solid rgba(100,255,218,0.15)', boxShadow: '0 24px 64px rgba(0,0,0,0.7)' }}>
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(100,255,218,0.08)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(100,255,218,0.1)', border: '1px solid rgba(100,255,218,0.2)' }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold tracking-wide" style={{ color: '#e2e8f0' }}>Jay's AI Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: '#64ffda' }} />
                  <span className="text-[9px] font-mono" style={{ color: '#475569' }}>claude-agent · online</span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'none' }}>
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%] text-[11px] leading-relaxed px-3 py-2 rounded-xl"
                    style={msg.role === 'user'
                      ? { background: 'rgba(100,255,218,0.12)', color: '#e2e8f0', borderRadius: '12px 12px 3px 12px', border: '1px solid rgba(100,255,218,0.15)' }
                      : { background: 'rgba(255,255,255,0.04)', color: '#94a3b8', borderRadius: '12px 12px 12px 3px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="px-3 py-2.5 rounded-xl flex gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {[0, 1, 2].map(i => <motion.span key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-1.5 h-1.5 rounded-full block" style={{ background: '#64ffda' }} />)}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex-shrink-0 px-3 pb-3">
              <div className="flex gap-2 items-center px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(100,255,218,0.12)' }}>
                <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about Jay..." className="flex-1 bg-transparent text-[11px] outline-none font-mono placeholder:opacity-30" style={{ color: '#e2e8f0' }} />
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={sendMessage} disabled={loading || !input.trim()}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 disabled:opacity-30"
                  style={{ background: input.trim() ? 'rgba(100,255,218,0.15)' : 'transparent' }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HoverBorder({ hovered }: { hovered: boolean }) {
  return (
    <motion.div className="absolute inset-0 rounded-xl pointer-events-none" animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.25 }}
      style={{ background: 'linear-gradient(#0d1f35,#0d1f35) padding-box,linear-gradient(135deg,rgba(100,255,218,0.3),rgba(129,140,248,0.15)) border-box', border: '1px solid transparent' }} />
  );
}

// ─── Experience card ──────────────────────────────────────────────────────────
function ExpCard({ period, title, company, desc, tags }: { period: string; title: string; company: string; desc: string; tags: string[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="group grid grid-cols-1 sm:grid-cols-4 gap-2 p-4 sm:p-5 rounded-xl cursor-default"
      variants={itemVariants} style={computeContainerStyle(hovered, 'rgba(100,255,218,0.04)')}>
      <HoverBorder hovered={hovered} />
      <div className="text-[10px] font-bold tracking-widest uppercase pt-1 font-mono relative z-10" style={{ color: '#475569' }}>{period}</div>
      <div className="sm:col-span-3 space-y-2.5 relative z-10">
        <h3 className="font-bold text-[14px] sm:text-[15px] flex items-center gap-1.5 flex-wrap" style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>
          {title} · {company}
        </h3>
        <p className="text-[12px] sm:text-[13px] leading-relaxed" style={{ color: hovered ? '#94a3b8' : '#64748b', transition: 'color 0.2s' }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map(t => <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wide"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.15)', transition: 'background 0.2s' }}>{t}</span>)}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({ icon, title, href, desc, tags, note }: { icon: string; title: string; href: string; desc: string; tags: string[]; note?: string }) {
  const [hovered, setHovered] = useState(false);
  
  // Split the description into an array of sentences
  const sentences = desc.split('. ').filter(Boolean);
  // Check if there is hidden content to show
  const hasMoreContent = sentences.length > 1 || !!note;

  return (
    <motion.a href={href} target={href === '#' ? undefined : '_blank'} rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="group p-4 sm:p-5 rounded-xl no-underline cursor-pointer flex flex-col h-full"
      variants={itemVariants} style={computeContainerStyle(hovered, 'rgba(100,255,218,0.06)')}>
      <HoverBorder hovered={hovered} />

      {/* Header row — always visible */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0"
          style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', border: '1px solid rgba(100,255,218,0.15)', color: hovered ? '#64ffda' : 'rgba(100,255,218,0.35)', transition: 'all 0.3s' }}>
          {icon}
        </div>
        <h3 className="font-bold text-[14px] sm:text-[15px] flex items-center gap-1.5 flex-wrap"
          style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>
          {title}
          {href !== '#' && (
            <motion.span animate={hovered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -4, y: 4 }}
              transition={{ duration: 0.18 }} style={{ color: '#64ffda' }}>↗</motion.span>
          )}
        </h3>
      </div>

      {/* Description Block */}
      <div className="mt-4 space-y-1.5 relative z-10 flex-1">
        
        {/* 1st Sentence — ALWAYS VISIBLE */}
        {sentences.length > 0 && (
          <div className="flex items-start gap-2 text-[12px] sm:text-[13px] leading-relaxed" style={{ color: hovered ? '#94a3b8' : '#64748b', transition: 'color 0.2s' }}>
            <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#64ffda' }} />
            <span>{sentences[0].endsWith('.') ? sentences[0] : `${sentences[0]}.`}</span>
          </div>
        )}

        {/* Floating '...' Indicator on its own line */}
        {hasMoreContent && !hovered && (
          <div className="flex items-start gap-2 text-[12px] sm:text-[13px]">
            {/* Invisible spacer to perfectly align the dots with the text above */}
            <span className="mt-2 w-1 h-1 flex-shrink-0" />
            <span className="tracking-widest animate-pulse text-lg leading-none" style={{ color: 'rgba(100,255,218,0.5)' }}>...</span>
          </div>
        )}

        {/* Remaining Sentences + Note — SLIDES IN ON HOVER */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden space-y-1.5">
              
              {/* .slice(1) skips the first sentence since we already rendered it above */}
              {sentences.slice(1).map((sentence, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 text-[12px] sm:text-[13px] leading-relaxed" style={{ color: '#94a3b8' }}>
                  <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#64ffda' }} />
                  {sentence.endsWith('.') ? sentence : `${sentence}.`}
                </motion.div>
              ))}
              
              {note && (
                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: sentences.length * 0.05 }}
                  className="flex items-start gap-2 text-[11px] italic pt-1" style={{ color: '#475569' }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#334155' }} />
                  {note}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tags — ALWAYS VISIBLE at the bottom */}
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

// ─── Education card ───────────────────────────────────────────────────────────
function EducationCard({ degree, school, period, gpa, highlights }: { degree: string; school: string; period: string; gpa?: string; highlights: string[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="p-5 rounded-xl cursor-default" variants={itemVariants}
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.05)')}>
      <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', border: '1px solid rgba(100,255,218,0.15)', transition: 'all 0.3s' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[14px]" style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>{degree}</h3>
            <div className="text-[12px] mt-0.5" style={{ color: '#64748b' }}>{school}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono font-bold tracking-wide" style={{ color: '#475569' }}>{period}</div>
          {gpa && <div className="text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(100,255,218,0.08)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.15)' }}>GPA {gpa}</div>}
        </div>
      </div>
      <AnimatePresence>
        {hovered && (
          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }} className="mt-3 space-y-1.5 overflow-hidden relative z-10">
            {highlights.map((h, i) => (
              <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex items-start gap-2 text-[11px]" style={{ color: '#94a3b8' }}>
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#64ffda' }} />
                {h}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Tech Badge ───────────────────────────────────────────────────────────────
function TechBadge({ name, category }: { name: string; category: string }) {
  const [isHovered, setIsHovered] = useState(false);

  let hoverColor = '#64ffda';
  let hoverBorder = 'rgba(100,255,218,0.45)';
  let hoverBg = 'rgba(100,255,218,0.08)';

  if (category === 'Programming Languages') { hoverColor = '#ffd166'; hoverBorder = 'rgba(255,209,102,0.5)'; hoverBg = 'rgba(255,209,102,0.1)'; }
  else if (category === 'Backend & Systems') { hoverColor = '#4ade80'; hoverBorder = 'rgba(74,222,128,0.5)'; hoverBg = 'rgba(74,222,128,0.1)'; }
  else if (category === 'Cloud & DevOps') { hoverColor = '#38bdf8'; hoverBorder = 'rgba(56,189,248,0.5)'; hoverBg = 'rgba(56,189,248,0.1)'; }
  else if (category === 'Databases & Data Stores') { hoverColor = '#a855f7'; hoverBorder = 'rgba(168,85,247,0.5)'; hoverBg = 'rgba(168,85,247,0.1)'; }
  else if (category === 'Frameworks & UI') { hoverColor = '#f43f5e'; hoverBorder = 'rgba(244,63,94,0.5)'; hoverBg = 'rgba(244,63,94,0.1)'; }

  return (
    <motion.span onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}
      className="text-[11px] px-3 py-1 rounded-full font-medium tracking-wide border transition-all duration-200 font-sans cursor-default"
      style={{ background: isHovered ? hoverBg : '#131e31', color: isHovered ? hoverColor : '#94a3b8', borderColor: isHovered ? hoverBorder : 'rgba(255,255,255,0.05)', boxShadow: isHovered ? `0 0 14px ${hoverBorder}` : 'none' }}>
      {name}
    </motion.span>
  );
}

// ─── Tech Stack data (updated from CV) ───────────────────────────────────────
const techStack: { category: string; icon: string; items: { name: string }[] }[] = [
  {
    category: 'ML & AI', icon: '🧠',
    items: [
      { name: 'PyTorch' }, { name: 'TensorFlow' }, { name: 'scikit-learn' },
      { name: 'LLMs' }, { name: 'Graph Neural Networks' }, { name: 'CNNs' },
      { name: 'RNNs' }, { name: 'Prompt Engineering' }, { name: 'OCR Pipelines' },
    ]
  },
  {
    category: 'Backend & Systems', icon: '⚙️',
    items: [
      { name: 'Django' }, { name: 'REST API' }, { name: 'FastAPI' },
      { name: 'Node.js' }, { name: 'WebRTC' }, { name: 'OAuth / Auth0' },
      { name: 'ETL Pipelines' }, { name: 'Microservices' },
    ]
  },
  {
    category: 'Cloud & DevOps', icon: '☁️',
    items: [
      { name: 'AWS (EC2, RDS, VPC)' }, { name: 'Docker' }, { name: 'Git' },
      { name: 'CI/CD' }, { name: 'Linux (Ubuntu)' },
    ]
  },
  {
    category: 'Programming Languages', icon: '</>',
    items: [
      { name: 'Python' }, { name: 'TypeScript' }, { name: 'JavaScript' },
      { name: 'SQL' }, { name: 'HTML / CSS' },
    ]
  },
  {
    category: 'Databases & Data Stores', icon: '🗄️',
    items: [
      { name: 'PostgreSQL' }, { name: 'MySQL' }, { name: 'MongoDB' }, { name: 'Redis' },
    ]
  },
  {
    category: 'Frameworks & UI', icon: '🛠️',
    items: [
      { name: 'React' }, { name: 'Next.js' }, { name: 'Tailwind CSS' },
      { name: 'Pandas' }, { name: 'NumPy' }, { name: 'Matplotlib' }, { name: 'Tableau' },
    ]
  },
];

function TechCard({ category, icon, items }: { category: string; icon: string; items: { name: string }[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      variants={itemVariants} className="p-5 rounded-2xl cursor-default text-left"
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.03)')}>
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

// ─── Award / Cert card ────────────────────────────────────────────────────────
function AwardCard({ year, title, org, href, desc, tags }: { year: string; title: string; org: string; href?: string; desc: string; tags: string[] }) {
  const [hovered, setHovered] = useState(false);
  const Wrapper = href ? motion.a : motion.div;
  return (
    <Wrapper {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="group grid grid-cols-1 sm:grid-cols-4 gap-2 p-4 sm:p-5 rounded-xl no-underline cursor-pointer"
      variants={itemVariants} style={computeContainerStyle(hovered, 'rgba(100,255,218,0.04)')}>
      <HoverBorder hovered={hovered} />
      <div className="text-[10px] font-bold tracking-widest uppercase pt-1 font-mono relative z-10" style={{ color: '#475569' }}>{year}</div>
      <div className="sm:col-span-3 space-y-2.5 relative z-10">
        <h3 className="font-bold text-[14px] sm:text-[15px] flex items-center gap-1.5 flex-wrap" style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>
          {title} · {org}
          {href && <motion.span animate={hovered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -4, y: 4 }} transition={{ duration: 0.18 }} style={{ color: '#64ffda' }}>↗</motion.span>}
        </h3>
        <p className="text-[12px] sm:text-[13px] leading-relaxed" style={{ color: hovered ? '#94a3b8' : '#64748b', transition: 'color 0.2s' }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map(t => <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wide"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.15)', transition: 'background 0.2s' }}>{t}</span>)}
        </div>
      </div>
    </Wrapper>
  );
}

// ─── Social links ─────────────────────────────────────────────────────────────
const socialLinks = [
  {
    label: 'GitHub', href: 'https://github.com/jaypathare',
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>,
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com/in/jaypathare',
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  },
  {
    label: 'Email', href: 'mailto:jaypathare123@gmail.com',
    icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
  },
];

function ContactStrip() {
  return (
    <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-500">Connect</div>
      <div className="flex items-center gap-5 flex-wrap">
        {socialLinks.map(({ label, href, icon }) => (
          <motion.a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
            aria-label={label} whileHover={{ y: -3, color: '#64ffda' }} transition={{ duration: 0.2 }}
            className="group relative"
            style={{ color: '#334155', display: 'flex', alignItems: 'center' }}>
            {icon}
            {/* ─── Hover Tooltip ─── */}
            <span className="absolute -top-8 left-0 px-2.5 py-1 rounded-md text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
              style={{ background: '#0a1326', border: '1px solid rgba(100,255,218,0.2)', color: '#64ffda', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {href.replace('mailto:', '').replace('https://', '')}
            </span>
          </motion.a>
        ))}
        {/* <a href="mailto:jaypathare123@gmail.com" className="text-[11px] font-mono transition-colors" style={{ color: '#334155' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#64ffda')} onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
          jaypathare123@gmail.com
        </a> */}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const sections = ['about', 'experience', 'projects', 'education', 'stack', 'awards', 'contact'];
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    const raf = requestAnimationFrame(() => { sections.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); }); });
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [loaded]);

  const navItems = ['about', 'experience', 'projects', 'education', 'stack', 'awards', 'contact'];
  const sidebarVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
  const sidebarItem = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <>
      <Preloader onDone={() => setLoaded(true)} />
      <AnimatePresence>
        {loaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            className="relative min-h-screen antialiased" style={{ background: '#050d1a', color: '#94a3b8' }}>
            <style>{`*{-webkit-font-smoothing:antialiased}::-webkit-scrollbar{display:none}html{scroll-behavior:smooth}.no-underline{text-decoration:none}`}</style>
            {/* <ScrollBar /> */}
            <AmbientOrbs />
            <div className="pointer-events-none fixed inset-0 z-0 hidden md:block" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px,rgba(100,255,218,0.03) 0%,transparent 70%)` }} />
            <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle,rgba(148,163,184,0.05) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="container mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">

                {/* ══ SIDEBAR ══ */}
                <motion.aside variants={sidebarVariants} initial="hidden" animate="visible"
                  className="lg:col-span-5 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto flex flex-col py-8 sm:py-10 lg:py-14 lg:pr-6 gap-6"
                  style={{ scrollbarWidth: 'none' }}>

                  {/* Profile Header */}
                  <motion.div variants={sidebarItem} className="flex flex-col sm:flex-row sm:items-center gap-6 mb-2">
                    <div className="relative flex-shrink-0 w-max">
                      <div className="absolute -inset-[4px] rounded-full"
                        style={{ background: 'linear-gradient(135deg, rgba(100,255,218,0.5), rgba(129,140,248,0.3))', filter: 'blur(5px)' }} />
                      {/* FIX: w-28 h-28 = perfect circle for rounded-full */}
                      <div className="relative w-32 h-47 rounded-full overflow-hidden border-[3px] flex-shrink-0"
                        style={{ borderColor: 'rgba(100,255,218,0.3)' }}>
                        <img src="/jay.png" alt="Jay Niketan Pathare" className="w-full h-full object-cover"
                          style={{ objectPosition: '50% 15%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: 'rgba(100,255,218,0.5)' }}>// software engineer</div>
                      <h1 className="text-2xl sm:text-3xl xl:text-[2.2rem] font-extrabold tracking-tight leading-tight" style={{ color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                        Jay Niketan <span style={{ color: '#64ffda', textShadow: '0 0 40px rgba(100,255,218,0.25)' }}>Pathare</span>
                      </h1>
                      <div className="mt-3 flex items-center gap-2.5">
                        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: '#64ffda', boxShadow: '0 0 8px rgba(100,255,218,0.6)' }} />
                        <span className="text-[12px] font-semibold tracking-wide" style={{ color: '#64748b' }}>Open to opportunities · MS CS @ UB</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Metrics Row — updated from CV */}
                  <motion.div variants={sidebarItem} className="grid grid-cols-3 gap-2.5">
                    {[{ n: '3.85', label: 'GPA / 4.0' }, { n: '1+', label: 'yrs exp.' }, { n: "Dec '26", label: 'MS CS' }].map(({ n, label }) => (
                      <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="text-[17px] font-extrabold" style={{ color: '#e2e8f0' }}>{n}</div>
                        <div className="text-[9px] uppercase tracking-widest font-bold mt-0.5" style={{ color: '#475569' }}>{label}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Desktop Nav */}
                  <motion.nav variants={sidebarItem} className="hidden lg:block space-y-0.5">
                    {navItems.map(item => {
                      const isActive = activeSection === item;
                      return (
                        <a key={item} href={`#${item}`} className="group flex items-center gap-4 py-1.5 text-[11px] font-bold uppercase tracking-widest"
                          style={{ color: isActive ? '#e2e8f0' : '#334155', transition: 'color 0.2s', textDecoration: 'none' }}>
                          <motion.span animate={{ width: isActive ? 48 : 24 }} transition={{ duration: 0.3 }} className="h-[1px] block flex-shrink-0"
                            style={{ background: isActive ? '#64ffda' : '#1e293b' }} />
                          <span style={{ transition: 'color 0.2s' }} className={isActive ? '' : 'group-hover:text-slate-400'}>
                            {item === 'about' ? 'About Me' : item === 'stack' ? 'Technical Stack' : item === 'awards' ? 'Certs & Awards' : item === 'contact' ? 'Get In Touch' : item}
                          </span>
                          {isActive && <motion.span layoutId="nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#64ffda' }} />}
                        </a>
                      );
                    })}
                  </motion.nav>

                  {/* Mobile Nav */}
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
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
                              className="inline-block w-[5px] h-3.5 ml-0.5 rounded-sm" style={{ background: '#64ffda' }} />
                          </div>
                          <div className="text-[11px]" style={{ color: '#94a3b8' }}>Warning: May cause sudden urge to hire.</div>
                        </div>
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-teal-500/20 shadow-lg relative z-10 bg-slate-900 flex-shrink-0 flex items-center justify-center"
                          style={{ boxShadow: '0 0 12px rgba(100,255,218,0.1)' }}>
                          <img src="/cat-glasses.png" alt="Hacker Cat" className="w-full h-full object-cover brightness-90 contrast-110"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      </div>
                      <div className="mt-3.5 flex items-center justify-between gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <motion.a 
                        whileHover={{ scale: 1.03 }} 
                        whileTap={{ scale: 0.97 }} 
                        href="/resume.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-bold tracking-wide no-underline cursor-pointer"
                        style={{ border: '1px solid rgba(100,255,218,0.25)', background: 'rgba(100,255,218,0.07)', color: '#64ffda' }}
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        VIEW RESUME
                      </motion.a>
                        <span className="text-[9px] font-mono italic" style={{ color: '#1e293b' }}>(not a virus, promise)</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.aside>

                {/* ══ MAIN CONTENT ══ */}
                <main className="lg:col-span-7 py-8 sm:py-12 lg:py-20 space-y-24 sm:space-y-32 lg:border-l lg:pl-10 xl:pl-14" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>

                  {/* About */}
                  <section id="about" className="scroll-mt-24">
                    <SectionHeader whiteText="About" tealText="Me" subtitle="A multi-disciplinary systems builder and ML engineer" />
                    <motion.div className="space-y-5 text-[14px] sm:text-[15px] leading-relaxed" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants} style={{ color: '#64748b' }}>
                      <motion.p variants={itemVariants}>I'm a software engineer driven by building efficient backend systems, machine learning pipelines, and robust full-stack architectures. I enjoy solving structural problems — whether parsing intelligence out of messy datasets or engineering clean application layers that handle real-world complexity flawlessly.</motion.p>
                      <motion.p variants={itemVariants}>Currently pursuing my <strong style={{ color: '#e2e8f0', fontWeight: 500 }}>Master of Science in Computer Science at the University at Buffalo</strong> (GPA 3.85 · expected December 2026). My graduate work spans machine learning, distributed systems, and graph neural networks, with applied research through a real-world industry collaboration with HeinOnline.</motion.p>
                      <motion.p variants={itemVariants}>Before Buffalo, I earned my B.E. in Information Technology from VESIT, Mumbai University, and worked as a <strong style={{ color: '#e2e8f0', fontWeight: 500 }}>Software Engineer at Thesis Mumbai Tech</strong> where I built and scaled healthcare systems supporting 10k+ records, and as a <strong style={{ color: '#e2e8f0', fontWeight: 500 }}>Cloud Engineer Intern at Data Maven</strong> designing scalable AWS infrastructure. I also hold an <strong style={{ color: '#e2e8f0', fontWeight: 500 }}>AWS Cloud Practitioner certification</strong> and have a published research paper on music genre classification. When I'm not building, I study chess strategy and follow developments in LLMs and GNNs.</motion.p>
                      <motion.div variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono" style={{ background: 'rgba(100,255,218,0.06)', border: '1px solid rgba(100,255,218,0.15)', color: '#64ffda' }}>
                          📍 Buffalo, NY · Open to relocation · F-1 OPT eligible Dec 2026
                        </div>
                      </motion.div>
                    </motion.div>
                  </section>

                  {/* Experience */}
                  <section id="experience" className="scroll-mt-24">
                    <SectionHeader whiteText="Professional" tealText="Experience" subtitle="Engineering and infrastructure roles across startups and research" />
                    <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>

                      <ExpCard period="Aug 2024 — Aug 2025" title="Software Engineer" company="Thesis Mumbai Tech"
                        desc="Built and scaled healthcare modules (Patient Management, Consent) supporting 10k+ records. Developed an IoT baby-warmer system with real-time PostgreSQL pipelines and 2s live monitoring. Built a color-blindness diagnostic module achieving 97% clinical reliability. Containerized 3+ projects with Docker (90% setup time reduction), integrated secure PDF generation and WebRTC video conferencing. Conducted 20+ technical interviews and mentored new hires."
                        tags={['Python', 'Django', 'PostgreSQL', 'Docker', 'ReactJS', 'WebRTC', 'IoT']} />
                      <ExpCard period="Nov 2023 — May 2024" title="Cloud Engineer Intern" company="Data Maven"
                        desc="Designed and deployed scalable cloud infrastructure on AWS using EC2 and RDS. Optimized VPC networking for secure, low-latency backend communication. Streamlined resource provisioning and supported deployment of data-intensive applications."
                        tags={['AWS', 'EC2', 'RDS', 'VPC', 'Cloud Infrastructure']} />
                      <ExpCard period="Jun 2023 — Aug 2023" title="Data Engineer Intern" company="Go Digital Technology Consulting"
                        desc="Analyzed real-world datasets using Python (Pandas, NumPy) and MySQL to extract trends and deliver actionable business insights."
                        tags={['Python', 'Pandas', 'NumPy', 'MySQL', 'Data Analysis']} />
                    </motion.div>
                  </section>

                  {/* Projects — all 3 from CV with accurate descriptions */}
<section id="projects" className="scroll-mt-24">
                    <SectionHeader whiteText="Featured" tealText="Projects" subtitle="Academic and personal builds showcasing applied engineering" />
                    {/* <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}> */}
                    <motion.div className="grid grid-cols-1 xl:grid-cols-2 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                    <ProjectCard icon="LMS" title="Classavo-Inspired LMS"
                      href="https://github.com/Jaypath456/classavo"
                      desc="Full-stack Learning Management System with role-based access for instructors and students. Instructors author chapter content with a Slate.js rich-text editor (Plate.js-compatible JSON), control per-chapter visibility, and publish courses — students browse, enroll, and read public chapters. JWT auth via SimpleJWT with Axios interceptors for clean, DRY API calls."
                      note="Built as a coding assessment — intentionally kept readable over clever"
                      tags={['Django', 'DRF', 'React', 'JWT', 'Slate.js', 'REST API', 'SQLite']} />
                      <ProjectCard icon="OCR" title="AI Metadata Extraction Pipeline · HeinOnline"
                        href="https://github.com/jaypathare/temp-ocr-repo"
                        desc="Engineered a hybrid OCR-LLM metadata extraction pipeline using Tesseract-OCR and Qwen-35B across 1,000+ legacy law journals. Automated end-to-end author metadata entry, reducing manual workload by 90% while maintaining 95%+ accuracy. Containerized the full pipeline with Docker."
                        note="Industry collaboration — pending sanitization"
                        tags={['Python', 'Tesseract-OCR', 'Qwen-35B', 'LLMs', 'Docker', 'ETL']} />
                      <ProjectCard icon="GNN" title="Fraud Detection with Graph Neural Networks"
                        href="https://github.com/jaypathare/fraud-detection-gnn"
                        desc="GraphSAGE-based fraud detection on the IEEE-CIS dataset. Converted tabular transactions into a graph using shared card, device, and email features to capture relational patterns. Handled severe class imbalance for robust training and evaluation."
                        note="Academic project"
                        tags={['PyTorch', 'GraphSAGE', 'Graph Neural Networks', 'Python', 'IEEE-CIS']} />
                      <ProjectCard icon="IoT" title="Temperature Monitoring System · CampusSense"
                        href="https://github.com/Jaypath456/UB_hackathon"
                        desc="End-to-end IoT pipeline: Arduino Uno streams continuous temperature readings over WiFi to a ReactJS live dashboard. Django backend processes sensor data with Auth0 authentication for secure transmission."
                        note="Team of 3 · academic project"
                        tags={['Arduino', 'Django', 'ReactJS', 'Auth0', 'IoT', 'PostgreSQL']} />
                      <ProjectCard icon="🎵" title="Music Genre Classification"
                        href="https://github.com/Jaypath456/Music-Genre-Classification"
                        desc="Classified audio files into genres using feature extraction techniques, achieving 97.68% accuracy. Published in IJRAR Volume 10, Issue 2. Algorithms: CatBoost, KNN."
                        tags={['Python', 'CatBoost', 'KNN', 'Feature Extraction', 'Published Research']} />
                    </motion.div>
                  </section>

                  {/* Education */}
                  <section id="education" className="scroll-mt-24">
                    <SectionHeader whiteText="Academic" tealText="Background" subtitle="University training and research specializations" />
                    <motion.div className="space-y-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <EducationCard
                        degree="M.S. Computer Science"
                        school="University at Buffalo, SUNY"
                        period="Aug 2025 — Dec 2026"
                        gpa="3.85 / 4.0"
                        highlights={[
                          'Focus: Machine Learning, Distributed Systems, Graph Neural Networks',
                          'Industry project: OCR-LLM metadata pipeline for HeinOnline (CSE 611)',
                          'Organized Git & GitHub workshop for CS&E dept — Certificate of Appreciation',
                          'Public Safety Aide, University at Buffalo campus',
                        ]}
                      />
                      <EducationCard
                        degree="B.E. Information Technology"
                        school="VESIT · Mumbai University, India"
                        period="Aug 2019 — May 2023"
                        highlights={[
                          'Capstone: IoT temperature monitoring system (CampusSense)',
                          'Published research: Music Genre Classification — IJRAR Vol. 10, Issue 2',
                          'Coursework: Data Structures, DBMS, Networking, OOP',
                          'Active participant in campus software testing events',
                        ]}
                      />
                    </motion.div>
                  </section>

                  {/* Technical Stack */}
                  <section id="stack" className="scroll-mt-24">
                    <SectionHeader whiteText="Technical" tealText="Competencies" subtitle="Languages, frameworks, and tools I bring to the table" />
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      {techStack.map(t => <TechCard key={t.category} {...t} />)}
                    </motion.div>
                  </section>

                  {/* Certs, Awards & Publications */}
                  <section id="awards" className="scroll-mt-24">
                    <SectionHeader whiteText="Certs, Awards &" tealText="Publications" subtitle="Credentials, recognitions, and published research" />
                    <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <AwardCard year="Jul 2024" title="AWS Cloud Practitioner" org="Amazon Web Services"
                        href="https://www.credly.com/badges/6a3649a7-3e17-487b-bff4-b27c6b69ff62/public_url"
                        desc="Certified in core AWS cloud concepts, infrastructure services, security, and pricing models — covering EC2, RDS, VPC, S3, and IAM."
                        tags={['AWS', 'Cloud', 'Certification']} />
                      <AwardCard year="Feb 2026" title="Certificate of Appreciation" org="University at Buffalo"
                        desc='Recognized as Event Manager for organizing "GitHub: Hands-On from Basics to Advanced" workshop for the Dept. of Computer Science & Engineering. Mentored participants on repository workflows, branching, and collaborative development.'
                        href="https://drive.google.com/file/d/15yVN_8Dbgkt-B_pCi7V1fGcuibhWLiNA/view?usp=sharing"
                        tags={['Git', 'GitHub', 'Technical Training', 'Event Management']} />
                      <AwardCard year="Apr 2023" title="Research Publication" org="IJRAR"
                        href="https://ijrar.org/papers/IJRAR23B2524.pdf"
                        desc='J. Pathare, D. Ahuja, R. Singh, M. Sabnis — "Music Genre Classification" — International Journal of Research and Analytical Reviews, Volume 10, Issue 2. ISSN: 2348-1269. Achieved 97.68% classification accuracy using CatBoost and KNN.'
                        tags={['Research', 'ML', 'Published', 'IJRAR']} />
                    </motion.div>
                  </section>

                  {/* Contact */}
                  <section id="contact" className="scroll-mt-24 space-y-6">
                    <SectionHeader whiteText="Get In" tealText="Touch" subtitle="Open to full-time roles in backend engineering and ML" />
                    <div className="w-full rounded-2xl p-6 relative overflow-hidden bg-slate-950/40 border border-slate-900 shadow-2xl">
                      <div className="mb-6">
                        <WorldMap />
                      </div>
                      <div className="text-center max-w-md mx-auto space-y-4 relative z-10 pt-2 font-sans">
                        <p className="text-xs leading-relaxed font-normal" style={{ color: '#64748b' }}>
                          I'm actively exploring full-time opportunities in backend systems engineering and machine learning. Available for F-1 OPT from December 2026. If you have an interesting problem to solve or simply want to connect, drop me a message.
                        </p>
                        <div className="grid grid-cols-1 gap-2.5 text-left text-xs font-mono max-w-xs mx-auto pt-2">
                          {/* <div className="p-3 rounded-xl bg-[#0a1326] border border-slate-800/80 flex items-center gap-3 shadow-lg">
                            <span className="text-teal-400 text-sm">✉</span>
                            <a href="mailto:jaypathare123@gmail.com" className="text-slate-200 hover:text-[#64ffda] transition-colors">jaypathare123@gmail.com</a>
                          </div> */}
                          <div className="p-3 rounded-xl bg-[#0a1326] border border-slate-800/80 flex items-center gap-3 shadow-lg">
                            <span className="text-teal-400 text-sm">✉</span>
                            <a href="mailto:jaypathare123@gmail.com" className="text-slate-200 hover:text-[#64ffda] transition-colors">jaypathare123@gmail.com</a>
                          </div>
                          <div className="p-3 rounded-xl bg-[#0a1326] border border-slate-800/80 flex items-center gap-3 shadow-lg">
                            <span className="text-indigo-400 text-sm">📍</span>
                            <span className="text-slate-400">Buffalo, NY, USA · Open to relocation</span>
                          </div>
                          <div className="p-3 rounded-xl bg-[#0a1326] border border-slate-800/80 flex items-center gap-3 shadow-lg">
                            <span className="text-yellow-400 text-sm">📞</span>
                            <span className="text-slate-400">+1 (716) 303-9924</span>
                          </div>
                        </div>
                        <motion.a whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(100,255,218,0.3)' }} whileTap={{ scale: 0.98 }}
                          href="mailto:jaypathare123@gmail.com"
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-colors mt-3"
                          style={{ background: '#64ffda', color: '#050d1a' }}>
                          ⚡ SEND MESSAGE
                        </motion.a>
                      </div>
                    </div>
                  </section>

                  {/* Footer */}
                  <Reveal>
                    <footer className="text-[11px] pt-12 sm:pt-16 font-mono leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: '#1e293b' }}>
                      Coded in Visual Studio Code. Built with <span style={{ color: '#334155' }}>Next.js</span>, <span style={{ color: '#334155' }}>Tailwind CSS</span> &amp; <span style={{ color: '#334155' }}>Framer Motion</span>.
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