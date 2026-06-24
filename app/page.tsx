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
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12">
          
          {/* ════════════ LEFT SIDEBAR ════════════ */}
          <aside className="lg:w-5/12 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between py-12 lg:py-16 overflow-y-auto no-scrollbar">
            
            {/* Top Content Stack */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-heading">Jay Niketan Pathare</h1>
                <h2 className="text-lg md:text-xl font-medium text-navActive mt-2">Software Engineer</h2>
                <p className="text-sm text-textDim max-w-xs mt-4 leading-relaxed">
                  I build scalable backend systems, intelligent data pipelines, and full-stack solutions.
                </p>
              </div>

              {/* Navigation Anchors - Added 'awards' here */}
              <nav className="hidden lg:block space-y-4 pt-4">
                {['about', 'experience', 'projects', 'awards'].map((item) => (
                  <a key={item} href={`#${item}`} className="group flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-textDim hover:text-heading transition-colors">
                    <span className="h-[1px] w-8 bg-textDim group-hover:w-16 group-hover:bg-heading transition-all" />
                    {item}
                  </a>
                ))}
              </nav>

              {/* Chatbot Module */}
              <div className="pt-2 max-w-sm">
                <AIChatWidget />
              </div>
            </div>

            {/* Bottom Left Social Links */}
            <div className="flex items-center gap-5 pt-6 mt-6 border-t border-slate-800/60 lg:border-t-0 lg:mt-0">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-textDim hover:text-accent transform hover:-translate-y-0.5 transition-all duration-200"
                aria-label="GitHub"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-textDim hover:text-accent transform hover:-translate-y-0.5 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

          </aside>

          {/* ════════════ RIGHT MAIN CONTENT LAYER ════════════ */}
          <main className="lg:w-6/12 py-12 lg:py-16 space-y-24">
            
            {/* About Section */}
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

            {/* Experience Section */}
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

            {/* Projects Section */}
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

            {/* ── NEW SECTION: Extra Curriculum / Awards ── */}
            <section id="awards" className="scroll-mt-24 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-heading mb-6">Extra Curriculum / Awards</h2>

              <motion.div variants={cardVariants} whileHover="hover" className="group grid grid-cols-1 sm:grid-cols-4 gap-2 p-4 border border-transparent rounded-lg transition-all">
                <div className="text-xs font-semibold tracking-wide text-textDim uppercase pt-1">Feb — Apr 2026</div>
                <div className="sm:col-span-3 space-y-2">
                  <h3 className="font-semibold text-heading group-hover:text-accent transition-colors">Event Manager &amp; Technical Lead · University at Buffalo</h3>
                  <p className="text-xs text-textDim leading-relaxed">
                    Organized, coordinated, and conducted a specialized Git and GitHub interactive workshop for the Department of Computer Science &amp; Engineering. Provided hands-on mentorship to participants covering repository workflows, branching logic, and collaborative development practices, and received a Certificate of Appreciation for outstanding leadership.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Git', 'GitHub', 'Technical Training', 'Event Management'].map(t => (
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