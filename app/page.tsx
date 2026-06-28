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
              {['#ff5f57','#ffbd2e','#28ca41'].map(c => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
            </div>
            <div className="font-mono text-xs space-y-2" style={{ color: '#4a5568' }}>
              {lines.map((line, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -8 }} 
                  animate={{ opacity: 1, x: 0 }}
                  style={{ 
                    color: line?.startsWith('> Ready') ? '#64ffda' : undefined, 
                    fontWeight: line?.startsWith('> Ready') ? 700 : undefined 
                  }}
                >
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

// ─── Scroll-progress bar Component ────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div style={{ scaleX, background: 'linear-gradient(90deg,#64ffda,#818cf8)' }} className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50" />;
}

// ─── Floating ambient orbs Component ───────────────────────────────────────────
function AmbientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute rounded-full" style={{ width:600,height:600,top:-120,right:-100,background:'radial-gradient(circle,rgba(100,255,218,0.06) 0%,transparent 70%)' }} />
      <div className="absolute rounded-full" style={{ width:500,height:500,bottom:-100,left:-80,background:'radial-gradient(circle,rgba(129,140,248,0.07) 0%,transparent 70%)' }} />
    </div>
  );
}

// ─── Interactive AI Chat Widget Component ─────────────────────────────────────
function AIChatOrb() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; content: string }[]>([
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

  useEffect(() => {
    setPos({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages, open]);

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
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
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
            transition={{ delay: 1.5, duration: 0.4 }}
            className="fixed z-[59] pointer-events-none"
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
          {!open && (
            <motion.div animate={{ scale: [1, 1.7], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(100,255,218,0.5)' }} />
          )}
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
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold tracking-wide" style={{ color: '#e2e8f0' }}>Jay's AI Assistant</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full" style={{ background: '#64ffda' }} />
                  <span className="text-[9px] font-mono" style={{ color: '#475569' }}>gemini-agent · online</span>
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
                    {[0,1,2].map(i => <motion.span key={i} animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i*0.15 }} className="w-1.5 h-1.5 rounded-full block" style={{ background: '#64ffda' }} />)}
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

// ─── Experience card Component ───────────────────────────────────────────────
function ExpCard({ period, title, company, href, desc, tags }: { period: string; title: string; company: string; href: string; desc: string; tags: string[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="group grid grid-cols-1 sm:grid-cols-4 gap-2 p-4 sm:p-5 rounded-xl no-underline cursor-pointer"
      variants={itemVariants}
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.04)')}
    >
      <HoverBorder hovered={hovered} />
      <div className="text-[10px] font-bold tracking-widest uppercase pt-1 font-mono relative z-10" style={{ color: '#475569' }}>{period}</div>
      <div className="sm:col-span-3 space-y-2.5 relative z-10">
        <h3 className="font-bold text-[14px] sm:text-[15px] flex items-center gap-1.5 flex-wrap" style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>
          {title} · {company}
          <motion.span animate={hovered ? { opacity:1,x:0,y:0 } : { opacity:0,x:-4,y:4 }} transition={{ duration: 0.18 }} style={{ color: '#64ffda' }}>↗</motion.span>
        </h3>
        <p className="text-[12px] sm:text-[13px] leading-relaxed" style={{ color: hovered ? '#94a3b8' : '#64748b', transition: 'color 0.2s' }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map(t => <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wide"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.15)', transition: 'background 0.2s' }}>{t}</span>)}
        </div>
      </div>
    </motion.a>
  );
}

// ─── Project card Component ──────────────────────────────────────────────────
function ProjectCard({ icon, title, href, desc, tags }: { icon: string; title: string; href: string; desc: string; tags: string[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="group grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-xl no-underline cursor-pointer"
      variants={itemVariants}
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.06)')}
    >
      <HoverBorder hovered={hovered} />
      <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-lg font-mono text-[10px] font-bold tracking-wider flex-shrink-0 relative z-10"
        style={{ background: 'rgba(15,39,68,0.8)', border: hovered ? '1px solid rgba(100,255,218,0.3)' : '1px solid rgba(255,255,255,0.06)', color: hovered ? '#64ffda' : 'rgba(100,255,218,0.35)', transition: 'all 0.2s' }}>{icon}</div>
      <div className="sm:col-span-3 space-y-2.5 relative z-10">
        <h3 className="font-bold text-[14px] sm:text-[15px] flex items-center gap-1.5 flex-wrap"
          style={{ color: hovered ? '#64ffda' : '#e2e8f0', transition: 'color 0.2s' }}>
          {title}
          <motion.span animate={hovered ? { opacity:1,x:0,y:0 } : { opacity:0,x:-4,y:4 }} transition={{ duration: 0.18 }} style={{ color: '#64ffda' }}>↗</motion.span>
        </h3>
        <p className="text-[12px] sm:text-[13px] leading-relaxed" style={{ color: hovered ? '#94a3b8' : '#64748b', transition: 'color 0.2s' }}>{desc}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map(t => <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-medium tracking-wide"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.15)', transition: 'background 0.2s' }}>{t}</span>)}
        </div>
      </div>
    </motion.a>
  );
}

// ─── Education card Component ─────────────────────────────────────────────────
function EducationCard({ degree, school, period, gpa, highlights }: { degree: string; school: string; period: string; gpa?: string; highlights: string[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="p-5 rounded-xl cursor-default"
      variants={itemVariants}
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.05)')}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: hovered ? 'rgba(100,255,218,0.1)' : 'rgba(100,255,218,0.05)', border: '1px solid rgba(100,255,218,0.15)', transition: 'all 0.3s' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
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

// ─── FIX: Individual token localized highlight logic ──────────────────────
function TechBadge({ name, featured, category, isCardHovered }: { name: string; featured?: boolean; category: string; isCardHovered: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  let hoverColor = '#64ffda'; 
  let hoverBorder = 'rgba(100,255,218,0.45)';
  let hoverBg = 'rgba(100,255,218,0.08)';

  if (category === 'Programming Languages') {
    hoverColor = '#ffd166'; 
    hoverBorder = 'rgba(255,209,102,0.5)';
    hoverBg = 'rgba(255,209,102,0.1)';
  } else if (category === 'Backend & Systems') {
    hoverColor = '#4ade80'; 
    hoverBorder = 'rgba(74,222,128,0.5)';
    hoverBg = 'rgba(74,222,128,0.1)';
  } else if (category === 'Cloud & DevOps') {
    hoverColor = '#38bdf8'; 
    hoverBorder = 'rgba(56,189,248,0.5)';
    hoverBg = 'rgba(56,189,248,0.1)';
  } else if (category === 'Databases & Data Stores') {
    hoverColor = '#a855f7'; 
    hoverBorder = 'rgba(168,85,247,0.5)';
    hoverBg = 'rgba(168,85,247,0.1)';
  } else if (category === 'Frameworks & UI') {
    hoverColor = '#f43f5e'; 
    hoverBorder = 'rgba(244,63,94,0.5)';
    hoverBg = 'rgba(244,63,94,0.1)';
  }

  // Toggles active state coloring strictly under explicit direct pointer hovers
  const activeHighlight = isHovered;

  return (
    <motion.span
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="text-[11px] px-3 py-1 rounded-full font-medium tracking-wide border transition-all duration-200 font-sans cursor-default"
      style={{
        background: activeHighlight ? hoverBg : '#131e31',
        color: activeHighlight ? hoverColor : '#94a3b8',
        borderColor: activeHighlight ? hoverBorder : 'rgba(255,255,255,0.05)',
        boxShadow: activeHighlight ? `0 0 14px ${hoverBorder}` : 'none',
      }}
    >
      {name}
    </motion.span>
  );
}

// ─── Technical Stack Group Shell Component ────────────────────────────────────
const techStack: { category: string; icon: string; items: { name: string; featured?: boolean }[] }[] = [
  { 
    category: 'ML & AI', icon: '🧠', 
    items: [
      { name: 'LLMs', featured: true }, { name: 'Agentic AI' }, { name: 'Machine Learning' },
      { name: 'Deep Learning' }, { name: 'PyTorch', featured: true }, { name: 'PyTorch Geometric' },
      { name: 'GAT Models' }, { name: 'DeepSeek-OCR' }, { name: 'Computer Vision' }
    ] 
  },
  { 
    category: 'Backend & Systems', icon: '👤', 
    items: [
      { name: 'Django', featured: true }, { name: 'Node.js' }, { name: 'RESTful APIs' },
      { name: 'GraphQL' }, { name: 'FastAPI' }, { name: 'Microservices' }
    ] 
  },
  { 
    category: 'Cloud & DevOps', icon: '☁️', 
    items: [
      { name: 'Docker', featured: true }, { name: 'AWS', featured: true }, { name: 'Git' },
      { name: 'Linux (Ubuntu)' }, { name: 'CI/CD' }
    ] 
  },
  { 
    category: 'Programming Languages', icon: ' </_> ', 
    items: [
      { name: 'Python', featured: true }, { name: 'TypeScript' }, { name: 'JavaScript' }, { name: 'SQL' }
    ] 
  },
  { 
    category: 'Databases & Data Stores', icon: '🗄️', 
    items: [
      { name: 'PostgreSQL', featured: true }, { name: 'MongoDB' }, { name: 'Redis' }, { name: 'MySQL' }
    ] 
  },
  { 
    category: 'Frameworks & UI', icon: '🛠️', 
    items: [
      { name: 'React', featured: true }, { name: 'Next.js', featured: true }, { name: 'Tailwind CSS' }, { name: 'Framer Motion' }
    ] 
  },
];

function TechCard({ category, icon, items }: { category: string; icon: string; items: { name: string; featured?: boolean }[] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      variants={itemVariants} className="p-5 rounded-2xl cursor-default text-left"
      style={computeContainerStyle(hovered, 'rgba(100,255,218,0.03)')}
    >
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-slate-900/60 border border-slate-800 text-teal-400 font-mono">
          {icon}
        </div>
        <span className="text-[13px] font-bold text-slate-200 tracking-wide font-sans">{category}</span>
      </div>
      <div className="flex flex-wrap gap-2 relative z-10">
        {items.map(item => (
          <TechBadge key={item.name} name={item.name} featured={item.featured} category={category} isCardHovered={hovered} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Contact social definitions ──────────────────────────────────────────────
const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/jaypathare',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jaypathare',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:jaypathare@buffalo.edu',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
];

function ContactStrip() {
  return (
    <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-slate-500">
        Get in touch
      </div>
      <div className="flex items-center gap-5 flex-wrap">
        {socialLinks.map(({ label, href, icon }) => (
          <motion.a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ y: -3, color: '#64ffda' }}
            transition={{ duration: 0.2 }}
            style={{ color: '#334155', display: 'flex', alignItems: 'center' }}
          >
            {icon}
          </motion.a>
        ))}
        <a
          href="mailto:jaypathare@buffalo.edu"
          className="text-[11px] font-mono transition-colors"
          style={{ color: '#334155' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#64ffda')}
          onMouseLeave={e => (e.currentTarget.style.color = '#334155')}
        >
          jaypathare@buffalo.edu
        </a>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [mouseMapHovered, setMouseMapHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!isResumeOpen) return;
    setLoadingProgress(0);
    const iv = setInterval(() => setLoadingProgress(p => { if (p >= 100) { clearInterval(iv); return 100; } return p + 8; }), 30);
    return () => clearInterval(iv);
  }, [isResumeOpen]);

  useEffect(() => {
    if (!loaded) return;
    const sections = ['about', 'experience', 'projects', 'education', 'stack', 'awards', 'contact'];
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    const raf = requestAnimationFrame(() => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) obs.observe(el);
      });
    });
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
            <ScrollBar />
            <AmbientOrbs />
            <div className="pointer-events-none fixed inset-0 z-0 hidden md:block" style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px,rgba(100,255,218,0.03) 0%,transparent 70%)` }} />
            <div className="pointer-events-none fixed inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle,rgba(148,163,184,0.05) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="container mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">

                {/* ══ SIDEBAR ══ */}
                <motion.aside variants={sidebarVariants} initial="hidden" animate="visible"
                  className="lg:col-span-5 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto flex flex-col py-8 sm:py-10 lg:py-14 lg:pr-6 gap-6"
                  style={{ scrollbarWidth: 'none' }}>
{/* ── Profile Header (Combined Image & Title) ── */}
<motion.div variants={sidebarItem} className="flex flex-col sm:flex-row sm:items-center gap-6 mb-2">
  
  {/* Image Section */}
  <div className="relative flex-shrink-0 w-max">
    {/* Outer glow ring */}
    <div className="absolute -inset-[4px] rounded-full"
      style={{ background: 'linear-gradient(135deg, rgba(100,255,218,0.5), rgba(129,140,248,0.3))', filter: 'blur(5px)' }} />
{/* Photo container */}
<div className="relative w-32 h-47 rounded-full overflow-hidden border-[3px] flex-shrink-0"
  style={{ borderColor: 'rgba(100,255,218,0.3)' }}>
  <img
    src="/jay.png"
    alt="Jay Niketan Pathare"
    className="w-full h-full object-cover"
    style={{ objectPosition: '50% 15%' }}
  />
</div>
    {/* Online dot */}
    <span className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full border-2 flex-shrink-0"
      style={{ background: '#64ffda', borderColor: '#050d1a', boxShadow: '0 0 10px rgba(100,255,218,0.8)' }} />
  </div>

  {/* Main Header Layout Moved to the Right */}
  <div>
    <div className="font-mono text-[10px] tracking-widest mb-2" style={{ color: 'rgba(100,255,218,0.5)' }}>// software engineer</div>
    
    {/* Removed whitespace-nowrap to allow wrapping on smaller screens if necessary */}
    <h1 className="text-2xl sm:text-3xl xl:text-[2.2rem] font-extrabold tracking-tight leading-tight" style={{ color: '#e2e8f0', letterSpacing: '-0.02em' }}>
      Jay Niketan <span style={{ color: '#64ffda', textShadow: '0 0 40px rgba(100,255,218,0.25)' }}>Pathare</span>
    </h1>
    
    <div className="mt-3 flex items-center gap-2.5">
      <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#64ffda', boxShadow: '0 0 8px rgba(100,255,218,0.6)' }} />
      <span className="text-[12px] font-semibold tracking-wide" style={{ color: '#64748b' }}>Open to opportunities · MS CS @ UB</span>
    </div>
  </div>
</motion.div>


                  {/* Metrics Row */}
                  <motion.div variants={sidebarItem} className="grid grid-cols-3 gap-2.5">
                    {[{ n: '1+', label: 'yr exp.' }, { n: '3', label: 'projects' }, { n: "Dec '26", label: 'MS CS' }].map(({ n, label }) => (
                      <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="text-[17px] font-extrabold" style={{ color: '#e2e8f0' }}>{n}</div>
                        <div className="text-[9px] uppercase tracking-widest font-bold mt-0.5" style={{ color: '#475569' }}>{label}</div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Desktop Navigation Links */}
                  <motion.nav variants={sidebarItem} className="hidden lg:block space-y-0.5">
                    {navItems.map(item => {
                      const isActive = activeSection === item;
                      return (
                        <a key={item} href={`#${item}`} className="group flex items-center gap-4 py-1.5 text-[11px] font-bold uppercase tracking-widest"
                          style={{ color: isActive ? '#e2e8f0' : '#334155', transition: 'color 0.2s', textDecoration: 'none' }}>
                          <motion.span animate={{ width: isActive ? 48 : 24 }} transition={{ duration: 0.3 }} className="h-[1px] block flex-shrink-0"
                            style={{ background: isActive ? '#64ffda' : '#1e293b' }} />
                          <span style={{ transition: 'color 0.2s' }} className={isActive ? '' : 'group-hover:text-slate-400'}>
                            {item === 'about' ? 'About Me' : item === 'stack' ? 'Technical Stack' : item === 'awards' ? 'Extra Curriculum / Awards' : item === 'contact' ? 'Get In Touch' : item}
                          </span>
                          {isActive && <motion.span layoutId="nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#64ffda' }} />}
                        </a>
                      );
                    })}
                  </motion.nav>

                  {/* Mobile Navigation Interface Pills */}
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

                  {/* Contact Links Block */}
                  <motion.div variants={sidebarItem}>
                    <ContactStrip />
                  </motion.div>

                  {/* FIX 2: Swap ASCII loop architecture with user provided static image avatar asset */}
                  <motion.div variants={sidebarItem}>
                    <div className="w-full relative overflow-hidden rounded-xl p-4" style={{ background: 'linear-gradient(135deg,rgba(15,39,68,0.9),rgba(7,20,36,0.95))', border: '1px solid rgba(100,255,218,0.1)' }}>
                      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg,transparent,rgba(100,255,218,0.3),transparent)' }} />
                      <div className="flex justify-between items-center gap-4">
                        <div className="space-y-1.5 font-mono text-xs flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span style={{ color: '#64ffda', fontWeight: 700 }}>$</span>
                            <span style={{ color: '#e2e8f0' }}>cat resume.txt</span>
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
                              className="inline-block w-[5px] h-3.5 ml-0.5 rounded-sm" style={{ background: '#64ffda' }} />
                          </div>
                          <div className="text-[11px]" style={{ color: '#94a3b8' }}>Warning: May cause sudden urge to hire.</div>
                        </div>
                        {/* Rendered explicit image element matching client specifications directly inside layout container */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-teal-500/20 shadow-lg relative z-10 bg-slate-950 flex-shrink-0" style={{ boxShadow: '0 0 12px rgba(100,255,218,0.1)' }}>
                          <img 
                            src="/cat-glasses.png"
                            alt="Hacker Cat With Glasses" 
                            className="w-full h-full object-top brightness-90 contrast-110"
                          />
                        </div>
                      </div>
                      <div className="mt-3.5 flex items-center justify-between gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setIsResumeOpen(true)}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-bold tracking-wide"
                          style={{ border: '1px solid rgba(100,255,218,0.25)', background: 'rgba(100,255,218,0.07)', color: '#64ffda' }}>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          VIEW RESUME
                        </motion.button>
                        <span className="text-[9px] font-mono italic" style={{ color: '#1e293b' }}>(not a virus, promise)</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.aside>

                {/* ══ MAIN CONTENT FEED ══ */}
                <main className="lg:col-span-7 py-8 sm:py-12 lg:py-20 space-y-24 sm:space-y-32 lg:border-l lg:pl-10 xl:pl-14" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>

                  {/* About Me Section */}
                  <section id="about" className="scroll-mt-24">
                    <SectionHeader whiteText="About" tealText="Me" subtitle="A multi-disciplinary data explorer and systems builder" />
                    <motion.div className="space-y-5 text-[14px] sm:text-[15px] leading-relaxed" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants} style={{ color: '#64748b' }}>
                      <motion.p variants={itemVariants}>I'm a software engineer driven by building efficient backend systems, machine learning pipelines, and robust full-stack architectures. I enjoy solving structural problems — whether parsing intelligence out of messy datasets or building clean application layers that handle logic flawlessly.</motion.p>
                      <motion.p variants={itemVariants}>Currently pursuing my <strong style={{ color: '#e2e8f0', fontWeight: 500 }}>Master of Science in Computer Science at the University at Buffalo</strong> (expected December 2026). Alongside my studies, I contribute to campus as a Public Safety Aide and host specialized engineering workshops.</motion.p>
                      <motion.p variants={itemVariants}>Before Buffalo, I earned my Bachelor's in Information Technology from Mumbai University (VESIT) and spent a year as a <strong style={{ color: '#e2e8f0', fontWeight: 500 }}>Software Engineer at Thesis Mumbai Tech</strong>. When I'm not building, I study chess strategy and follow developments in Graph Neural Networks and Large Language Models.</motion.p>
                    </motion.div>
                  </section>

                  {/* Experience Section */}
                  <section id="experience" className="scroll-mt-24">
                    <SectionHeader whiteText="Professional" tealText="Experience" subtitle="Timeline of engineering and infrastructure assignments" />
                    <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <ExpCard period="2026 — Present" title="Public Safety Aide" company="University at Buffalo" href="#"
                        desc="Assisting campus safety operations, managing student and facility logistics, and handling shift configurations efficiently across university infrastructure."
                        tags={['Operations', 'Logistics', 'Event Coordination']} />
                      <ExpCard period="2024 — 2025" title="Software Engineer" company="Thesis Mumbai Tech" href="#"
                        desc="Engineered production-ready software using Python, Django, and ReactJS. Maintained backend architectures on PostgreSQL, containerized services with Docker, and managed cloud deployments on AWS."
                        tags={['Python', 'Django', 'ReactJS', 'PostgreSQL', 'Docker', 'AWS']} />
                    </motion.div>
                  </section>

                  {/* Projects Section */}
                  <section id="projects" className="scroll-mt-24">
                    <SectionHeader whiteText="Featured" tealText="Projects" subtitle="A selection of software platforms showcasing technical competence" />
                    <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <ProjectCard icon="ocr" title="AI-Powered Metadata Extraction Pipeline" href="#"
                        desc="Intelligent documentation documentation mining pipeline to process 1,000+ legal journals for HeinOnline. Used DeepSeek-OCR and text segmentation to parse layout metadata directly from print artifacts."
                        tags={['Python', 'DeepSeek-OCR', 'LLMs', 'Computer Vision']} />
                      <ProjectCard icon="gnn" title="GraphSAGE Financial Fraud Detector" href="#"
                        desc="Deep learning graph classification pipeline on the IEEE-CIS dataset. Built with PyTorch Geometric — GraphSAGE and GAT models mapping relational anomalies across imbalanced transactional topologies."
                        tags={['PyTorch', 'GraphSAGE', 'GAT', 'Deep Learning']} />
                      <ProjectCard icon="iot" title="CampusSense IoT Monitoring Platform" href="#"
                        desc="Physical hardware and web platform monitoring temperature across campus buildings. Arduino Uno telemetry layer feeding real-time data into a ReactJS dashboard."
                        tags={['Arduino', 'ReactJS', 'IoT', 'Full-Stack']} />
                    </motion.div>
                  </section>

                  {/* Education Section */}
                  <section id="education" className="scroll-mt-24">
                    <SectionHeader whiteText="Academic" tealText="Background" subtitle="Formal parameters of university training and specialization fields" />
                    <motion.div className="space-y-3" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <EducationCard
                        degree="M.S. Computer Science"
                        school="University at Buffalo, SUNY"
                        period="2025 — Dec 2026"
                        highlights={[
                          'Focus areas: Machine Learning, Distributed Systems, Graph Neural Networks',
                          'Public Safety Aide — contributing to campus operations',
                          'Organized Git & GitHub workshop for CS&E department',
                          'Active participant across specialized computer engineering labs',
                        ]}
                      />
                      <EducationCard
                        degree="B.E. Information Technology"
                        school="Mumbai University · VESIT"
                        period="2019 — 2023"
                        highlights={[
                          'Graduated with distinction in information systems and mathematics',
                          'Architected CampusSense IoT temperature arrays as capstone assembly',
                          'Coursework: Advanced Data Structures, Relational DBMS, Networking Protocols',
                          'Active software developer across campus software testing events',
                        ]}
                      />
                    </motion.div>
                  </section>

                  {/* Technical Stack Section */}
                  <section id="stack" className="scroll-mt-24">
                    <SectionHeader whiteText="Technical" tealText="Competencies" subtitle="Languages, framework technologies, and protocols I bring to the table" />
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      {techStack.map(t => <TechCard key={t.category} {...t} />)}
                    </motion.div>
                  </section>

                  {/* Extra Curriculum / Awards Section */}
                  <section id="awards" className="scroll-mt-24">
                    <SectionHeader whiteText="Honors &" tealText="Activities" subtitle="Extracurricular leadership and technical workshop training roles" />
                    <motion.div className="space-y-2" initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={listVariants}>
                      <ExpCard period="2026" title="Event Manager & Technical Lead" company="University at Buffalo" href="#"
                        desc="Organised and conducted a Git & GitHub workshop for the Dept. of CS&E. Mentored participants on repository workflows, branching logic, and collaborative development, receiving a Certificate of Appreciation for outstanding leadership."
                        tags={['Git', 'GitHub', 'Technical Training', 'Event Management']} />
                    </motion.div>
                  </section>

                  {/* FIX 2: High-Visibility Single Transatlantic Line and Scaled Map Assets */}
                  <section id="contact" className="scroll-mt-24 space-y-6">
                    <SectionHeader whiteText="Get In" tealText="Touch" subtitle="Gateway communication nodes to initiate technical inquiries" />
                    <div className="w-full rounded-2xl p-6 relative overflow-hidden bg-slate-950/40 border border-slate-900 shadow-2xl">
                      
                      {/* High-Contrast SVG Layout Panel rendering accurate country boundaries mapping */}
                      <div className="mb-6">
  <WorldMap />
</div>

                      <div className="text-center max-w-md mx-auto space-y-4 relative z-10 pt-2 font-sans">
                        <p className="text-xs text-textDim leading-relaxed font-normal">
                          I am actively exploring backend systems architecture and machine learning engineering roles. If you have an interesting tracking parameter to discuss or simply wish to connect, feel free to drop a message.
                        </p>
                        
                        <div className="grid grid-cols-1 gap-2.5 text-left text-xs font-mono max-w-xs mx-auto pt-2">
                          <div className="p-3 rounded-xl bg-[#0a1326] border border-slate-800/80 flex items-center gap-3 shadow-lg">
                            <span className="text-teal-400 text-sm">✉</span>
                            <a href="mailto:jaypathare@buffalo.edu" className="text-slate-200 hover:text-[#64ffda] transition-colors">jaypathare@buffalo.edu</a>
                          </div>
                          <div className="p-3 rounded-xl bg-[#0a1326] border border-slate-800/80 flex items-center gap-3 shadow-lg">
                            <span className="text-indigo-400 text-sm">📍</span>
                            <span className="text-slate-400">Buffalo, NY, USA</span>
                          </div>
                        </div>

                        <motion.a 
                          whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(100,255,218,0.3)' }} 
                          whileTap={{ scale: 0.98 }}
                          href="mailto:jaypathare@buffalo.edu"
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-colors mt-3"
                          style={{ background: '#64ffda', color: '#050d1a' }}
                        >
                          ⚡ SEND MESSAGE
                        </motion.a>
                      </div>
                    </div>
                  </section>

                  {/* Footer Block */}
                  <Reveal>
                    <footer className="text-[11px] pt-12 sm:pt-16 font-mono leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: '#1e293b' }}>
                      Coded in Visual Studio Code. Built with <span style={{ color:'#334155' }}>Next.js</span>, <span style={{ color:'#334155' }}>Tailwind CSS</span> &amp; <span style={{ color:'#334155' }}>Framer Motion</span>.
                    </footer>
                  </Reveal>
                </main>
              </div>
            </div>

            {/* AI Chat Orb Widget */}
            <AIChatOrb />

            {/* Resume Interactive Modal Overlay */}
            <AnimatePresence>
              {isResumeOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ background: 'rgba(5,13,26,0.9)', backdropFilter: 'blur(16px)' }}
                  onClick={() => setIsResumeOpen(false)}>
                  <motion.div initial={{ scale: 0.92, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 16, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                    className="rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 relative overflow-hidden mx-4"
                    style={{ background: 'linear-gradient(#071424,#050d1a)', border: '1px solid rgba(100,255,218,0.15)' }}
                    onClick={e => e.stopPropagation()}>
                    <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg,transparent,rgba(100,255,218,0.4),transparent)' }} />
                    <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex items-center gap-1.5">
                        {['#ff5f57','#ffbd2e','#28ca41'].map(c => <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                        <span className="text-xs font-mono ml-2" style={{ color: '#334155' }}>resume_fetcher.sh</span>
                      </div>
                      <button onClick={() => setIsResumeOpen(false)} className="text-xs font-mono" style={{ color: '#334155' }}>[ESC]</button>
                    </div>
                    <div className="font-mono text-xs space-y-2 p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)', color: '#475569' }}>
                      <div><span style={{ color: '#64ffda' }}>jay@ub-node:~$</span> sh fetch_credentials.sh</div>
                      {loadingProgress > 10 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>&gt; Connecting to encrypted static cloud asset...</motion.div>}
                      {loadingProgress > 40 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>&gt; Parsing experience map (Thesis Tech / UB PSA)...</motion.div>}
                      {loadingProgress > 70 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#4ade80' }}>&gt; Verification successful. Handshake closed.</motion.div>}
                      <div className="w-full h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: '#0d1f35' }}>
                        <motion.div className="h-full rounded-full" style={{ width: `${loadingProgress}%`, background: 'linear-gradient(90deg,#64ffda,#818cf8)' }} />
                      </div>
                    </div>
                    {loadingProgress === 100 ? (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3 pt-1">
                        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 font-semibold p-2.5 rounded-lg text-xs"
                          style={{ background: 'rgba(100,255,218,0.08)', color: '#64ffda', border: '1px solid rgba(100,255,218,0.25)' }}>↗ Launch in Tab</a>
                        <a href="/resume.pdf" download="Jay_Pathare_Resume.pdf"
                          className="flex items-center justify-center gap-1.5 font-semibold p-2.5 rounded-lg text-xs"
                          style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}>💾 Download PDF</a>
                      </motion.div>
                    ) : <div className="h-10" />}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}