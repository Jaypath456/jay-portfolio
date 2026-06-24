'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AIChatWidget from '../components/AIChatWidget';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cardVariants = {
    hover: { y: -4, backgroundColor: "rgba(30, 41, 59, 0.7)", borderColor: "rgba(148, 163, 184, 0.15)" }
  };

  return (
    <div className="relative min-h-screen bg-bg selection:bg-teal-400/20 selection:text-teal-300">
      {/* Interactive Background Spotlight Radial Layer */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-duration-100 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(100,255,218,0.04) 0%, transparent 70%)`
        }}
      />

      <div className="container mx-auto max-w-6xl px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
          
          {/* ════════════ LEFT SIDEBAR ════════════ */}
          <aside className="lg:w-5/12 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between py-12 lg:py-24">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-heading">Jay Niketan Pathare</h1>
                <h2 className="text-lg md:text-xl font-medium text-navActive mt-2">Software Engineer</h2>
                <p className="text-sm text-textDim max-w-xs mt-4 leading-relaxed">
                  I build scalable backend systems, intelligent data pipelines, and full-stack solutions.
                </p>
              </div>

              {/* Navigation Anchors */}
              <nav className="hidden lg:block space-y-4 pt-8">
                {['about', 'experience', 'projects'].map((item) => (
                  <a key={item} href={`#${item}`} className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-textDim hover:text-heading transition-colors">
                    <span className="h-[1px] w-8 bg-textDim group-hover:w-16 group-hover:bg-heading transition-all" />
                    {item}
                  </a>
                ))}
              </nav>

              {/* Injected Intelligent Chat Bot Frame */}
              <div className="pt-4 max-w-sm">
                <AIChatWidget />
              </div>
            </div>
          </aside>

          {/* ════════════ RIGHT MAIN CONTENT LAYER ════════════ */}
          <main className="lg:w-6/12 py-12 lg:py-24 space-y-24">
            
            {/* ── About Section ── */}
            <section id="about" className="scroll-mt-24">
              <h2 className="text-xs font-bold uppercase tracking-widest text-heading lg:hidden mb-4">About</h2>
              <div className="space-y-4 text-sm text-textDim leading-relaxed">
                <p>
                  I am a software engineer driven by building efficient backend structures, machine learning pipelines, and robust full-stack software architectures. I enjoy solving complex structural problems—whether that involves parsing structural intelligence out of messy data sets or building clean application layers that handle logic flawlessly.
                </p>
                <p>
                  Currently, I am pursuing my <strong className="text-heading">Master of Science in Computer Science at the University at Buffalo</strong> (expected graduation in December 2026). Alongside my studies, I contribute to the campus ecosystem as a Public Safety Aide and host specialized engineering workshops.
                </p>
                <p>
                  Before moving to Buffalo, I earned my Bachelor's degree in Information Technology from Mumbai University (VESIT) and spent a year working in industry as a <strong className="text-heading">Software Engineer at Thesis Mumbai Tech</strong>. When I'm not configuring systems, I analyze chess matches or study advanced developments in Graph Neural Networks and Large Language Models.
                </p>
              </div>
            </section>

            {/* ── Experience Section ── */}
            <section id="experience" className="scroll-mt-24 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-heading mb-6">Experience</h2>
              
              {/* UB */}
              <motion.div variants={cardVariants} whileHover="hover" className="group grid grid-cols-1 sm:grid-cols-4 gap-2 p-4 border border-transparent rounded-lg transition-all">
                <div className="text-xs font-semibold tracking-wide text-textDim uppercase pt-1">2026 — Present</div>
                <div className="sm:col-span-3 space-y-2">
                  <h3 className="font-semibold text-heading group-hover:text-accent transition-colors">Public Safety Aide · University at Buffalo</h3>
                  <p className="text-xs text-textDim leading-relaxed">Assisting campus safety operations, managing student and facility logistics, and managing shifts and timesheet configurations efficiently across university infrastructures.</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Operations', 'Logistics', 'Event Coordination'].map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/5 text-accent font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Thesis Tech */}
              <motion.div variants={cardVariants} whileHover="hover" className="group grid grid-cols-1 sm:grid-cols-4 gap-2 p-4 border border-transparent rounded-lg transition-all">
                <div className="text-xs font-semibold tracking-wide text-textDim uppercase pt-1">2024 — 2025</div>
                <div className="sm:col-span-3 space-y-2">
                  <h3 className="font-semibold text-heading group-hover:text-accent transition-colors">Software Engineer · Thesis Mumbai Tech</h3>
                  <p className="text-xs text-textDim leading-relaxed">Engineered reliable, production-ready software solutions using Python, Django, and ReactJS. Maintained backend relational architectures on PostgreSQL, streamlined environment isolated services using Docker containerization strategies, and managed cloud deployments with AWS configurations.</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Python', 'Django', 'ReactJS', 'PostgreSQL', 'Docker', 'AWS'].map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/5 text-accent font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* ── Projects Section ── */}
            <section id="projects" className="scroll-mt-24 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-heading mb-6">Projects</h2>

              {/* Project 1 */}
              <motion.div variants={cardVariants} whileHover="hover" className="group grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-transparent rounded-lg transition-all">
                <div className="hidden sm:flex items-center justify-center h-16 bg-slate-900 rounded border border-slate-800 text-teal-400/40">⚡</div>
                <div className="sm:col-span-3 space-y-2">
                  <h3 className="font-semibold text-heading group-hover:text-accent transition-colors">AI-Powered Metadata Extraction Pipeline</h3>
                  <p className="text-xs text-textDim leading-relaxed">Architected and compiled an intelligent documentation mining pipeline designed to process over 1,000 legal journals for HeinOnline. Leveraged DeepSeek-OCR and text segmentation strategies to systematically discover and parse layout metadata directly from print artifacts.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'DeepSeek-OCR', 'LLMs', 'Computer Vision'].map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/5 text-accent font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Project 2 */}
              <motion.div variants={cardVariants} whileHover="hover" className="group grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-transparent rounded-lg transition-all">
                <div className="hidden sm:flex items-center justify-center h-16 bg-slate-900 rounded border border-slate-800 text-teal-400/40">📊</div>
                <div className="sm:col-span-3 space-y-2">
                  <h3 className="font-semibold text-heading group-hover:text-accent transition-colors">GraphSAGE Financial Fraud Detector</h3>
                  <p className="text-xs text-textDim leading-relaxed">Implemented a deep learning graph classification pipeline trained on the IEEE-CIS financial fraud dataset. Developed using PyTorch Geometric to construct GraphSAGE and Graph Attention Networks (GAT), mapping non-linear relational anomalies across highly imbalanced transactional topologies.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['PyTorch', 'GraphSAGE', 'GAT Models', 'Deep Learning'].map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/5 text-accent font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Project 3 */}
              <motion.div variants={cardVariants} whileHover="hover" className="group grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-transparent rounded-lg transition-all">
                <div className="hidden sm:flex items-center justify-center h-16 bg-slate-900 rounded border border-slate-800 text-teal-400/40">🌐</div>
                <div className="sm:col-span-3 space-y-2">
                  <h3 className="font-semibold text-heading group-hover:text-accent transition-colors">CampusSense IoT Monitoring Platform</h3>
                  <p className="text-xs text-textDim leading-relaxed">Designed an interconnected physical hardware and web tracking platform monitoring temperature differentials across active campus buildings. Integrated telemetry components with an Arduino Uno microcontroller layer and fed data real-time into a ReactJS dashboard application.</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Arduino Uno', 'ReactJS', 'IoT Architecture', 'Full-Stack'].map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/5 text-accent font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            <footer className="text-xs text-slate-600 pt-12">
              Coded in Visual Studio Code. Built with Next.js, Tailwind CSS and Framer Motion. 
            </footer>

          </main>
        </div>
      </div>
    </div>
  );
}