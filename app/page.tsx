'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

// ─── Reusable scroll-reveal wrapper ───────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-72px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger list variants ─────────────────────────────────────────────────────
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

// ─── Gradient-border card style ────────────────────────────────────────────────
const gradientBorder = (hovered: boolean) => ({
  background: hovered
    ? 'linear-gradient(#1a2540, #1a2540) padding-box, linear-gradient(135deg, rgba(100,255,218,0.35), rgba(99,102,241,0.2)) border-box'
    : 'linear-gradient(transparent, transparent) padding-box, linear-gradient(135deg, transparent, transparent) border-box',
  border: '1px solid transparent',
  transition: 'background 0.3s ease, box-shadow 0.3s ease',
  boxShadow: hovered ? '0 8px 32px rgba(100,255,218,0.04)' : 'none',
});

// ─── Preloader ────────────────────────────────────────────────────────────────
function Preloader({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [barWidth, setBarWidth] = useState(0);
  const [done, setDone] = useState(false);

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
        setLines((prev) => [...prev, sequence[i]]);
        i++;
        setTimeout(addLine, 320);
      } else {
        let p = 0;
        const bar = setInterval(() => {
          p += 6;
          setBarWidth(Math.min(p, 100));
          if (p >= 100) {
            clearInterval(bar);
            setTimeout(() => {
              setDone(true);
              setTimeout(onDone, 500);
            }, 200);
          }
        }, 22);
      }
    };
    const t = setTimeout(addLine, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#0a1122] flex items-center justify-center"
        >
          <div className="w-full max-w-sm px-6 space-y-4">
            <div className="flex gap-1.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <div className="font-mono text-xs space-y-2 text-slate-400">
              <AnimatePresence>
                {lines.filter(Boolean).map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={line?.startsWith('> Ready') ? 'text-teal-400 font-bold' : ''}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="w-full h-[2px] bg-slate-800 rounded-full overflow-hidden mt-4">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-400"
                style={{ width: `${barWidth}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
            <div className="text-right font-mono text-[10px] text-slate-600">{barWidth}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Scroll-progress bar ──────────────────────────────────────────────────────
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-400 to-indigo-400 origin-left z-50"
    />
  );
}

// ─── Floating ambient orbs ─────────────────────────────────────────────────────
function AmbientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute rounded-full opacity-[0.04] blur-[120px]"
        style={{ width: 520, height: 520, top: -80, right: -60, background: '#64ffda' }}
      />
      <div
        className="absolute rounded-full opacity-[0.045] blur-[140px]"
        style={{ width: 480, height: 480, bottom: -100, left: -80, background: '#818cf8' }}
      />
    </div>
  );
}

// ─── Experience card ──────────────────────────────────────────────────────────
function ExpCard({
  period, title, company, href, desc, tags,
}: {
  period: string; title: string; company: string; href: string; desc: string; tags: string[];
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={gradientBorder(hovered)}
      className="group grid grid-cols-1 sm:grid-cols-4 gap-2 p-4 sm:p-5 rounded-xl no-underline block cursor-pointer"
      variants={itemVariants}
    >
      <div className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase pt-1 font-mono">
        {period}
      </div>
      <div className="sm:col-span-3 space-y-2.5">
        <h3 className="font-bold text-[14px] sm:text-[15px] text-heading group-hover:text-accent transition-colors flex items-center gap-1.5 flex-wrap">
          {title} · {company}
          <motion.span
            initial={{ opacity: 0, x: -4, y: 4 }}
            animate={hovered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -4, y: 4 }}
            transition={{ duration: 0.18 }}
            className="text-accent text-base"
          >
            ↗
          </motion.span>
        </h3>
        <p className="text-[12px] sm:text-[13px] text-textDim leading-relaxed">{desc}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-400/5 text-accent font-medium tracking-wide border border-teal-500/10 transition-colors group-hover:bg-teal-400/10"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({
  icon, title, href, desc, tags,
}: {
  icon: string; title: string; href: string; desc: string; tags: string[];
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={gradientBorder(hovered)}
      className="group grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-xl no-underline block cursor-pointer"
      variants={itemVariants}
    >
      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900/80 border border-slate-800 text-teal-400/60 font-mono text-[11px] font-bold tracking-wider transition-colors group-hover:border-teal-500/30 group-hover:text-teal-400">
        {icon}
      </div>
      <div className="sm:col-span-3 space-y-2.5">
        <h3 className="font-bold text-[14px] sm:text-[15px] text-heading group-hover:text-accent transition-colors flex items-center gap-1.5 flex-wrap">
          {title}
          <motion.span
            initial={{ opacity: 0, x: -4, y: 4 }}
            animate={hovered ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -4, y: 4 }}
            transition={{ duration: 0.18 }}
            className="text-accent text-base"
          >
            ↗
          </motion.span>
        </h3>
        <p className="text-[12px] sm:text-[13px] text-textDim leading-relaxed">{desc}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-400/5 text-accent font-medium tracking-wide border border-teal-500/10 transition-colors group-hover:bg-teal-400/10"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

// ─── Social icons data ────────────────────────────────────────────────────────
const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    path: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
];

// ─── Socials strip (reusable for both mobile + desktop) ───────────────────────
function SocialStrip({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {socials.map(({ label, href, path }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          whileHover={{ y: -3, color: '#64ffda' }}
          className="text-slate-500 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d={path} />
          </svg>
        </motion.a>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    if (!isResumeOpen) return;
    setLoadingProgress(0);
    const iv = setInterval(() => {
      setLoadingProgress((p) => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 8;
      });
    }, 30);
    return () => clearInterval(iv);
  }, [isResumeOpen]);

  useEffect(() => {
    const sections = ['about', 'experience', 'projects', 'awards'];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [loaded]);

  const navItems = ['about', 'experience', 'projects', 'awards'];

  const sidebarVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const sidebarItem = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <>
      <Preloader onDone={() => setLoaded(true)} />

      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative min-h-screen bg-bg selection:bg-teal-400/20 selection:text-teal-300 antialiased"
          >
            <ScrollBar />
            <AmbientOrbs />

            {/* Spotlight */}
            <div
              className="pointer-events-none fixed inset-0 z-0 hidden md:block"
              style={{
                background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(100,255,218,0.035) 0%, transparent 70%)`,
              }}
            />

            {/* Dot grid */}
            <div
              className="pointer-events-none fixed inset-0 z-0 opacity-[0.018]"
              style={{
                backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            <div className="container mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">

                {/* ═══════════ SIDEBAR ═══════════
                    Key fix: on desktop we use sticky + flex-col but NO overflow-hidden,
                    and socials are inside the natural flow (not pushed via justify-between).
                    We use min-h-screen so the sidebar can grow if content exceeds viewport.
                ════════════════════════════════ */}
                <motion.aside
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  className="lg:col-span-5 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto flex flex-col py-8 sm:py-10 lg:py-14 lg:pr-6 gap-5"
                  /* 
                    Using max-h-screen + overflow-y-auto on desktop means:
                    - content can scroll internally if it overflows at high zoom
                    - icons are always in the DOM flow and never clipped
                    - we removed overflow-hidden which was causing the clip
                  */
                  style={{ scrollbarWidth: 'none' }}
                >
                  {/* Name + role */}
                  <motion.div variants={sidebarItem}>
                    <h1 className="text-2xl sm:text-3xl xl:text-[2.2rem] font-extrabold tracking-tight text-heading leading-[1.1]">
                      Jay Niketan Pathare
                    </h1>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span
                        className="text-sm sm:text-base xl:text-[17px] font-semibold tracking-wide"
                        style={{ color: '#64ffda', textShadow: '0 0 18px rgba(100,255,218,0.35)' }}
                      >
                        Software Engineer
                      </span>
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
                      </span>
                    </div>
                    <div className="mt-3 flex flex-col gap-1.5">
                      <a
                        href="mailto:jaypathare@buffalo.edu"
                        className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-teal-400 transition-colors group w-fit"
                      >
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-600 group-hover:text-teal-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                        jaypathare@buffalo.edu
                      </a>
                      <div className="flex items-center gap-2 text-[12px] text-slate-500">
                        <svg className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        Buffalo, NY
                      </div>
                    </div>
                  </motion.div>

                  {/* Stats strip */}
                  <motion.div
                    variants={sidebarItem}
                    className="flex gap-6 py-2.5 border-y border-slate-800/60"
                  >
                    {[
                      { n: '1+', label: 'yr exp.' },
                      { n: '3', label: 'projects' },
                      { n: 'MS', label: 'CS @ UB' },
                    ].map(({ n, label }) => (
                      <div key={label} className="text-center">
                        <div className="text-lg font-extrabold text-heading">{n}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                          {label}
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* Nav — desktop only */}
                  <motion.nav variants={sidebarItem} className="hidden lg:block space-y-0">
                    {navItems.map((item) => {
                      const isActive = activeSection === item;
                      return (
                        <a
                          key={item}
                          href={`#${item}`}
                          className="group flex items-center gap-4 py-1 text-xs font-bold uppercase tracking-widest transition-colors"
                          style={{ color: isActive ? '#e2e8f0' : '#64748b' }}
                        >
                          <motion.span
                            animate={{ width: isActive ? 52 : 28 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="h-[1px] block flex-shrink-0"
                            style={{ background: isActive ? '#64ffda' : '#64748b' }}
                          />
                          <span className={isActive ? 'text-heading' : 'group-hover:text-slate-300'}>
                            {item}
                          </span>
                          {isActive && (
                            <motion.span
                              layoutId="nav-dot"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400"
                            />
                          )}
                        </a>
                      );
                    })}
                  </motion.nav>

                  {/* Mobile nav pills */}
                  <motion.nav
                    variants={sidebarItem}
                    className="flex lg:hidden gap-2 flex-wrap"
                  >
                    {navItems.map((item) => {
                      const isActive = activeSection === item;
                      return (
                        <a
                          key={item}
                          href={`#${item}`}
                          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors"
                          style={{
                            borderColor: isActive ? '#64ffda' : 'rgba(100,116,139,0.3)',
                            color: isActive ? '#64ffda' : '#64748b',
                            background: isActive ? 'rgba(100,255,218,0.05)' : 'transparent',
                          }}
                        >
                          {item}
                        </a>
                      );
                    })}
                  </motion.nav>

                  {/* AI Chat widget placeholder — keep your AIChatWidget import here */}
                  {/* <motion.div variants={sidebarItem} className="max-w-full">
                    <AIChatWidget />
                  </motion.div> */}

                  {/* Resume terminal card */}
                  <motion.div variants={sidebarItem} className="max-w-full">
                    <div
                      className="w-full relative overflow-hidden rounded-xl p-4 text-left shadow-xl"
                      style={{
                        background:
                          'linear-gradient(#0f1e35, #0f1e35) padding-box, linear-gradient(135deg, rgba(100,255,218,0.15), rgba(99,102,241,0.1)) border-box',
                        border: '1px solid transparent',
                      }}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-2 font-mono text-xs flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-teal-400 font-bold">$</span>
                            <span className="text-slate-200">cat resume.txt</span>
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
                              className="inline-block w-[6px] h-3.5 bg-teal-400 ml-0.5 rounded-sm"
                            />
                          </div>
                          <div className="text-slate-300 leading-relaxed text-[11px]">
                            Warning: May cause sudden urge to hire.
                          </div>
                          <ul className="space-y-1 text-slate-400 text-[10px] pl-0.5">
                            {['Impressed nodding', 'Technical discussions', 'Calendar invites'].map((s) => (
                              <li key={s} className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-teal-400 inline-block flex-shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <pre className="font-mono text-[9px] text-teal-400/40 leading-none select-none hidden sm:block flex-shrink-0">
{`    /\\_____/\\
   /  o   o  \\
  ( ==  ^  == )
   )         (
  /  _______  \\
 |  |  </>  |  |
 |__|_______|__|`}
                        </pre>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800/60">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setIsResumeOpen(true)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-teal-500/30 bg-teal-950/20 text-teal-400 font-mono text-[11px] font-bold tracking-wide transition-colors hover:bg-teal-950/40"
                        >
                          VIEW RESUME.PDF
                        </motion.button>
                        <span className="text-[9px] font-mono text-slate-600 italic">
                          (Not a virus, promise)
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* ── Socials — always in flow, never clipped ── */}
                  <motion.div
                    variants={sidebarItem}
                    className="flex items-center gap-5 pt-2 border-t border-slate-900"
                  >
                    <SocialStrip />
                  </motion.div>
                </motion.aside>

                {/* ═══════════ CONTENT ═══════════ */}
                <main className="lg:col-span-7 py-8 sm:py-12 lg:py-20 space-y-20 sm:space-y-28 lg:border-l lg:border-slate-800/40 lg:pl-10 xl:pl-14">

                  {/* About */}
                  <section id="about" className="scroll-mt-24">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-heading lg:hidden mb-6">About</h2>
                    <motion.div
                      className="space-y-5 text-[14px] sm:text-[15px] text-textDim leading-relaxed"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px' }}
                      variants={listVariants}
                    >
                      {[
                        `I'm a software engineer driven by building efficient backend systems, machine learning pipelines, and robust full-stack architectures. I enjoy solving structural problems — whether parsing intelligence out of messy datasets or building clean application layers that handle logic flawlessly.`,
                        `Currently pursuing my Master of Science in Computer Science at the University at Buffalo (expected December 2026). Alongside my studies, I contribute to campus as a Public Safety Aide and host specialized engineering workshops.`,
                        `Before Buffalo, I earned my Bachelor's in Information Technology from Mumbai University (VESIT) and spent a year as a Software Engineer at Thesis Mumbai Tech. When I'm not building, I study chess strategy and follow developments in Graph Neural Networks and Large Language Models.`,
                      ].map((p, i) => (
                        <motion.p key={i} variants={itemVariants}>
                          {i === 1 ? (
                            <>
                              Currently pursuing my{' '}
                              <strong className="text-heading font-medium">
                                Master of Science in Computer Science at the University at Buffalo
                              </strong>{' '}
                              (expected December 2026). Alongside my studies, I contribute to campus as a Public Safety Aide and host specialized engineering workshops.
                            </>
                          ) : i === 2 ? (
                            <>
                              Before Buffalo, I earned my Bachelor's in Information Technology from Mumbai University (VESIT) and spent a year as a{' '}
                              <strong className="text-heading font-medium">
                                Software Engineer at Thesis Mumbai Tech
                              </strong>
                              . When I'm not building, I study chess strategy and follow developments in Graph Neural Networks and Large Language Models.
                            </>
                          ) : (
                            p
                          )}
                        </motion.p>
                      ))}
                    </motion.div>
                  </section>

                  {/* Experience */}
                  <section id="experience" className="scroll-mt-24">
                    <Reveal>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-heading mb-6">Experience</h2>
                    </Reveal>
                    <motion.div
                      className="space-y-2"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px' }}
                      variants={listVariants}
                    >
                      <ExpCard
                        period="2026 — Present"
                        title="Public Safety Aide"
                        company="University at Buffalo"
                        href="#"
                        desc="Assisting campus safety operations, managing student and facility logistics, and handling shift configurations efficiently across university infrastructure."
                        tags={['Operations', 'Logistics', 'Event Coordination']}
                      />
                      <ExpCard
                        period="2024 — 2025"
                        title="Software Engineer"
                        company="Thesis Mumbai Tech"
                        href="#"
                        desc="Engineered production-ready software using Python, Django, and ReactJS. Maintained backend architectures on PostgreSQL, containerized services with Docker, and managed cloud deployments on AWS."
                        tags={['Python', 'Django', 'ReactJS', 'PostgreSQL', 'Docker', 'AWS']}
                      />
                    </motion.div>
                  </section>

                  {/* Projects */}
                  <section id="projects" className="scroll-mt-24">
                    <Reveal>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-heading mb-6">Projects</h2>
                    </Reveal>
                    <motion.div
                      className="space-y-2"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px' }}
                      variants={listVariants}
                    >
                      <ProjectCard
                        icon="ocr"
                        title="AI-Powered Metadata Extraction Pipeline"
                        href="#"
                        desc="Intelligent documentation mining pipeline to process 1,000+ legal journals for HeinOnline. Used DeepSeek-OCR and text segmentation to parse layout metadata directly from print artifacts."
                        tags={['Python', 'DeepSeek-OCR', 'LLMs', 'Computer Vision']}
                      />
                      <ProjectCard
                        icon="gnn"
                        title="GraphSAGE Financial Fraud Detector"
                        href="#"
                        desc="Deep learning graph classification pipeline on the IEEE-CIS dataset. Built with PyTorch Geometric — GraphSAGE and GAT models mapping relational anomalies across imbalanced transactional topologies."
                        tags={['PyTorch', 'GraphSAGE', 'GAT', 'Deep Learning']}
                      />
                      <ProjectCard
                        icon="iot"
                        title="CampusSense IoT Monitoring Platform"
                        href="#"
                        desc="Physical hardware and web platform monitoring temperature across campus buildings. Arduino Uno telemetry layer feeding real-time data into a ReactJS dashboard."
                        tags={['Arduino', 'ReactJS', 'IoT', 'Full-Stack']}
                      />
                    </motion.div>
                  </section>

                  {/* Awards */}
                  <section id="awards" className="scroll-mt-24">
                    <Reveal>
                      <h2 className="text-xs font-bold uppercase tracking-widest text-heading mb-6">
                        Extra Curriculum / Awards
                      </h2>
                    </Reveal>
                    <motion.div
                      className="space-y-2"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-60px' }}
                      variants={listVariants}
                    >
                      <ExpCard
                        period="2026"
                        title="Event Manager & Technical Lead"
                        company="University at Buffalo"
                        href="#"
                        desc="Organised and conducted a Git & GitHub workshop for the Dept. of CS&E. Mentored participants on repository workflows, branching logic, and collaborative development. Received a Certificate of Appreciation for outstanding leadership."
                        tags={['Git', 'GitHub', 'Technical Training', 'Event Management']}
                      />
                    </motion.div>
                  </section>

                  {/* Footer */}
                  <Reveal>
                    <footer className="text-[11px] text-slate-600 pt-12 sm:pt-16 border-t border-slate-900/60 font-mono leading-relaxed">
                      Coded in Visual Studio Code. Built with{' '}
                      <span className="text-slate-500">Next.js</span>,{' '}
                      <span className="text-slate-500">Tailwind CSS</span> &{' '}
                      <span className="text-slate-500">Framer Motion</span>.
                    </footer>
                  </Reveal>
                </main>
              </div>
            </div>

            {/* ─── Resume modal ─────────────────────────────────────────────── */}
            <AnimatePresence>
              {isResumeOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
                  onClick={() => setIsResumeOpen(false)}
                >
                  <motion.div
                    initial={{ scale: 0.92, y: 16, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.92, y: 16, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                    style={{
                      background:
                        'linear-gradient(#0f1e35, #0f1e35) padding-box, linear-gradient(135deg, rgba(100,255,218,0.3), rgba(99,102,241,0.2)) border-box',
                      border: '1px solid transparent',
                    }}
                    className="rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 relative overflow-hidden mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                        <span className="text-xs font-mono text-slate-500 ml-2">resume_fetcher.sh</span>
                      </div>
                      <button
                        onClick={() => setIsResumeOpen(false)}
                        className="text-slate-500 hover:text-slate-300 text-xs transition-colors font-mono"
                      >
                        [ESC]
                      </button>
                    </div>

                    <div className="font-mono text-xs space-y-2 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 text-slate-400">
                      <div>
                        <span className="text-teal-400">jay@ub-node:~$</span> sh fetch_credentials.sh
                      </div>
                      {loadingProgress > 10 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500">
                          &gt; Connecting to encrypted static cloud asset...
                        </motion.div>
                      )}
                      {loadingProgress > 40 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500">
                          &gt; Parsing experience map (Thesis Tech / UB PSA)...
                        </motion.div>
                      )}
                      {loadingProgress > 70 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400">
                          &gt; Verification successful. Handshake closed.
                        </motion.div>
                      )}
                      <div className="w-full bg-slate-900 h-1.5 rounded-full mt-3 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-indigo-400"
                          style={{ width: `${loadingProgress}%` }}
                        />
                      </div>
                    </div>

                    {loadingProgress === 100 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-2 gap-3 pt-1"
                      >
                        <a
                          href="/resume.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-teal-400/10 hover:bg-teal-400/20 text-teal-300 border border-teal-500/30 font-semibold p-2.5 rounded-lg text-xs transition-all"
                        >
                          ↗ Launch in Tab
                        </a>
                        <a
                          href="/resume.pdf"
                          download="Jay_Pathare_Resume.pdf"
                          className="flex items-center justify-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-semibold p-2.5 rounded-lg text-xs transition-all"
                        >
                          💾 Download PDF
                        </a>
                      </motion.div>
                    ) : (
                      <div className="h-10" />
                    )}
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