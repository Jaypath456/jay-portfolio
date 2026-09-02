export const PORTFOLIO_CONTEXT = `
# JAY NIKETAN PATHARE - KNOWLEDGE BASE

## Profile & Personal Overview
* Name: Jay Niketan Pathare (Jay Niketan is the first name, Pathare is the last name).
* Role: Software Engineer specializing in scalable backends, full-stack architectures, and applied ML.
* Location: Buffalo, New York (Open to relocation).
* Personality: Known for being a very cool, laid-back, and highly approachable guy.
* Hobbies & Interests: Playing chess for fun. Enjoys cooking and optimizing recipes (specifically poultry and vegetable dishes). Follows the FIFA World Cup 2026. Avid consumer of anime and manga. Enjoys outdoor travel and exploring national parks, including the Great Smoky Mountains. Follows consumer tech hardware trends. Likes to play sports such as basketball, volleyball, badminton, football, cricket. Huge fan of cats.

## Academic Progress
* Master of Science in Computer Science (Specialization: AI/ML Track): University at Buffalo, SUNY (Aug 2025 — Dec 2026). Current GPA: 3.85/4.0. 
* Fall Capstone: Agentic AI.
* Extracurriculars & Roles: Currently serving as a Public Safety Aide for the University at Buffalo Police (Jan 2026 - Present). Event Manager for a department-hosted GitHub workshop (Feb 2026).
* Bachelor of Engineering in Information Technology: Vivekanand Education Society’s Institute of Technology, Mumbai University (Aug 2019 — May 2023). Graduated with a 7.83/10 GPA.
---
## Professional Experience
* Lead Software Engineer at Thesis Mumbai Tech (Aug 2024 - Aug 2025): Engineered and scaled healthcare modules supporting over 10,000 patient records. Developed an IoT baby-warmer system with real-time PostgreSQL pipelines for live monitoring. Containerized projects using Docker, reducing setup time by 90%. Conducted technical interviews and mentored new hires.
* Cloud Engineer Intern at Data Maven (Nov 2023 - May 2024): Designed and deployed scalable cloud infrastructure on AWS utilizing EC2, RDS, and VPC for secure backend communication.
* Data Engineer Intern at Go Digital Technology Consulting (Jun 2023 - Aug 2023): Extracted business insights from real-world datasets using Python, Pandas, NumPy, and MySQL.

## DETAILED PROJECT KNOWLEDGE BASE
### 1. LLM Resume Tailoring Pipeline (Verified, Not Trusted)
* Date: August 2026
* Objective: Automate per-JD resume tailoring while treating the LLM's own claims about its output as unverified until proven — the LLM never gets to be the judge of its own work.
* Architecture: Gemini generates tailored content -> pdflatex compiles the real PDF -> pdftotext extracts the actual rendered text -> deterministic Python checks measure it against the JD -> only genuinely failing sections get sent back for a targeted re-fix, never a full rewrite.
* Honesty Guardrails: A hardcoded "explicitly unsupported" list hard-blocks fabricated technologies (e.g. Kafka, FastAPI) from ever appearing; a second fuzzy-matching layer strips any skill claim that can't be traced back to source content, even ones the model phrases cleverly enough to sound plausible.
* Narrative-Coherence Check: Regex-level backstop that catches bullets quietly merging two separate accomplishments into one inflated sentence — a failure mode the prompt alone didn't reliably prevent.
* Independent Verification: Groq proofreads the final compiled PDF text for genuine typos and garbled rendering artifacts — a separate model, run after and independent of the one that wrote the content, so nothing grades its own homework.
* Cost-Aware Retry Logic: Detects when a fix is purely mechanical (a banned term needing removal) and skips the API call entirely; detects when the model has already declined a fix as impossible and stops re-asking, instead of burning quota chasing the same "no."
* Real Bug Fixed In Production Use: Diagnosed a rendering-artifact cascade where a Unicode replacement character (U+FFFD) from a LaTeX bullet glyph was being misread as a content typo, causing the pipeline to burn through 3 separate API accounts trying to "fix" text that was never actually broken — root-caused it to the PDF-extraction layer and patched it there instead of the content layer.
* Stack: Python, Gemini API (multi-account rotation for free-tier resilience), Groq API, pdflatex, pdftotext, LaTeX.

### 2. Decoupled Learning Management System (LMS)
Date: July 2026
Architecture: Decoupled Client-Server (REST API + WebSockets). Django/DRF Backend, React.js Frontend, PostgreSQL, Redis, Celery.
Authentication: Stateless JWT via SimpleJWT, with Axios interceptors auto-attaching tokens; custom JWT-over-WebSocket handshake authenticates real-time connections at connect time.
Rich Text Editor: Plate.js (built on Slate.js) for headless JSON-tree data structuring, allowing complex course chapter creation with per-chapter visibility control.
Automated Quiz Engine: Django models for questions/submissions with idempotent, automated grading — supports both async (take-anytime) and live, Kahoot-style quiz sessions.
Real-Time Messaging & Live Sessions: Django Channels (ASGI) and WebSockets backend, Redis pub/sub for fan-out across clients — powers course-scoped chat and live-quiz leaderboards (Redis sorted sets).
Shared State Layer: Single Redis instance serving four roles — cache, Celery broker, Channels pub/sub layer, and ephemeral live-session state — with graceful degradation if Redis is unavailable.
Interactive Schedule Maker: A backtracking constraint-satisfaction algorithm auto-generates conflict-free timetables from section/term data, rendered via React Big Calendar.
Performance Validation: Custom Locust + asyncio WebSocket load-testing harness to benchmark REST/WebSocket throughput under concurrent connections and measure the impact of Redis-layer optimizations.
Access Control: Server-side role assignment (no client-side self-promotion to instructor), enforced password validation, and a patched schedule-confirmation flow that prevents enrollment bypass into unpublished courses.

### 3. AI Metadata Extraction Pipeline (HeinOnline)
* Date: April 2026 (CSE 611 Industry Collaboration)
* Objective: End-to-end Dockerized AI pipeline to extract bibliographic info from raw legal journal scans, replacing manual data entry.
* Impact: Jumped from 57.03% to 90.81% accuracy. Processed 31,215 pages in 40.6 hours ($21.82 total cost, $0.00077/page). 0 API failures across 10,719 calls. Reduced manual workload by 90%.
* 3-Source Redundancy Architecture: 
  1. CrossRef API (Score 100): Highest priority source of truth.
  2. Web Evidence (Score 50): BeautifulSoup recursive scraping.
  3. OCR+LLM (Score 85): Visual reading of raw scans.
* Models: Qwen3.5-35B for complex reasoning (distilled 27.78M input tokens to 5.67M output tokens). 
* Smart Fallback OCR: Attempts Tesseract-OCR first. If "scrap" is detected, dynamically routes to Qwen3-VL-8B for multimodal pixel reading.
* Database: PostgreSQL used with rapidFuzz for author normalization.

### 4. Relational Fraud Detection using Graph Neural Networks (GNN)
* Date: March 2026 (CSE 676A Deep Learning)
* Objective: Convert tabular transaction data into graphs to capture relational fraud rings.
* Datasets: IEEE-CIS (Primary, highly imbalanced 27.6x ratio) and Elliptic Bitcoin (Benchmark).
* Graph Construction: Connected transactions sharing identifiers (card1-6, addr1, emails). Added composite edge 'card1_addr1'. Capped groups at 50 to prevent memory explosion.
* Architectures Compared:
  - Baseline MLP: AUC 0.8584 (proved need for graph structure).
  - GraphSAGE (Winner): AUC 0.9259. Used mean aggregation, spreading signal smoothly and robustly.
  - GAT (Failed): AUC 0.7928. Attention collapsed due to massive hub nodes, overfitting by Epoch 5.
* Class Imbalance Strategy: Used Focal Loss (Gamma=2.0) with inverse-frequency weights to force the model to focus on hard fraud cases instead of easy legitimate ones.
* Validation: GraphSAGE achieved 0.988 AUC on the Elliptic dataset, proving the architecture works perfectly on clean explicit graphs.

### 5. Pintos OS: User Programs
* Date: May 2026 (CSE 521)
* Details: Engineered User Programs subsystem in C. Implemented argument parsing, process synchronization with semaphores, and memory safety checks. Hardened the kernel with verify-before-dereference validation.

### 6. CampusSense IoT Platform
* Date: November 2025 (UB Hacking)
* Hardware: Arduino microcontrollers with MPI 3118A sensors.
* Software: Django backend (Auth0 authentication, PostgreSQL), React frontend dashboard.
* Workflow: Arduino streams continuous temperature readings over WiFi. Django parses and stores data. React polls API for live UI updates.

### 7. Music Genre Classification
* Date: April 2023 (Published in IJRAR)
* Details: Audio feature extraction pipeline hitting 97.68% accuracy using CatBoost and KNN.

---

## Contact & Links
* Email: jaypathare123@gmail.com
* GitHub: https://github.com/jaypathare
* LinkedIn: https://linkedin.com/in/jaypathare
`;
