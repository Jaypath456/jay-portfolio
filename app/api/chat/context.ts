export const PORTFOLIO_CONTEXT = `
# JAY NIKETAN PATHARE - KNOWLEDGE BASE

## Profile & Personal Overview
* Name: Jay Niketan Pathare (Jay Niketan is the first name, Pathare is the last name).
* Role: Software Engineer specializing in scalable backends, full-stack architectures, and applied ML.
* Location: Buffalo, New York (Open to relocation).
* Personality: Known for being a very cool, laid-back, and highly approachable guy.
* Hobbies & Interests: Playing chess for fun. Enjoys cooking and optimizing recipes (specifically poultry and vegetable dishes). Follows sports like football, cricket. Avid consumer of anime and manga. Enjoys outdoor travel and exploring national parks, including the Great Smoky Mountains. Follows consumer tech hardware trends. Likes to play sports such as basketball, volleyball, badminton, football, cricket. Huge fan of cats.

## Academic Progress
* Master of Science in Computer Science (Specialization: AI/ML Track): University at Buffalo, SUNY (Aug 2025 — Dec 2026). Current GPA: 3.85/4.0. 
* Fall Capstone: Agentic AI.
* Extracurriculars & Roles: Currently serving as a Public Safety Aide for the University at Buffalo Police (Jan 2026 - Present). Event Manager for a department-hosted GitHub workshop (Feb 2026).
* Bachelor of Engineering in Information Technology: Vivekanand Education Society’s Institute of Technology, Mumbai University (Aug 2019 — May 2023). Graduated with a 7.83/10 GPA.
---
## Professional Experience
* Software Engineer at Thesis Mumbai Tech (Aug 2024 - Aug 2025): Engineered and scaled healthcare modules supporting over 10,000 patient records. Developed an IoT baby-warmer system with real-time PostgreSQL pipelines for live monitoring. Containerized projects using Docker, reducing setup time by 90%. Conducted technical interviews and mentored new hires.
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

### 2. RIPPLE — Agentic Change-Impact Analysis
* Date: September 2026
* Objective: Agentic AI developer tool that predicts which files, symbols, dependencies, tests, and regression risks may be affected by a requested code change before implementation, then verifies the actual Git diff after the change.
* Core Principle: "The LLM investigates; Python decides." The model chooses where to investigate and reasons over repository evidence, while deterministic Python validates every path, symbol, dependency, and accepted claim.
* Agent Architecture: Bounded investigation loop with a 25-tool-call execution budget and 7 repository-analysis tools: code search, symbol inspection, reference discovery, dependency traversal, test discovery, repository facts, and Git co-change analysis.
* Static Analysis Engine: Builds a deterministic Python AST index over modules, classes, functions, imports, references, tests, and repository structure. Uses BM25-style lexical search plus dependency/reference graphs and Git history to locate likely change-impact areas.
* Evidence Ledger: Tracks suspected, confirmed, and rejected files. Candidates cannot enter the final report unless the model explicitly confirms them using repository evidence that Python independently validates.
* Agent Reliability Controls: Added explicit candidate-decision checkpoints, typed tool-target validation, semantic duplicate-call suppression, bounded no-progress stopping, and a narrow report-repair path while keeping the deterministic validator authoritative.
* Held-Out Evaluation: Evaluated the current system across 90 runs on 30 fresh software-change tasks from 16 open-source repositories, achieving 0.306 precision, 0.152 recall, 0.198 F1, and 0.311 MRR with 0 unsupported accepted claims.
* Execution Efficiency: Averaged 10.37 tool calls, 16.60 model calls, and 0.73 duplicate calls per run in the final held-out evaluation.
* Evaluation Infrastructure: Built reproducible benchmark tooling covering 915 scored runs across two held-out studies, including multi-seed evaluation, baselines, ablations, provider-failure tracking, and paired repository-cluster bootstrap analysis.
* Post-Change Verification: Compares predicted impact against the actual Git diff and flags unexpected edits, missing tests, missing predicted changes, and stale callers. Reached 100% detection recall across three planted anomaly types on 15 tasks using oracle pre-change predictions.
* Safety Boundary: RIPPLE is read-only with respect to target repositories; it does not edit repository code or execute target applications/tests. Unsupported model claims are rejected by deterministic validation.
* Stack: Python, Python AST, Git CLI, Pydantic, pytest, LLM APIs, JSON/JSONL, BM25-style lexical retrieval, static dependency/reference analysis.

### 3. LedgerFlow — Event-Driven Payment Ledger
* Date: October 2026
* Objective: Build a correctness-first payment backend that guarantees exactly-once financial effects even when API requests are retried, Kafka redelivers events, payments race concurrently, services crash, or dependencies temporarily fail.
* Architecture: Two independent Spring Boot services — payment-service owns the REST API, payment state, idempotency, and risk checks; ledger-service owns accounts and double-entry postings. Services communicate asynchronously through Kafka and use isolated PostgreSQL schemas.
* Exactly-Once Financial Effects: Implemented transactional outbox publishing, idempotent Kafka consumers, processed-event deduplication, API idempotency keys, SHA-256 request hashing, and reconciliation over at-least-once messaging. Same key + same request safely replays the stored response; same key + different request returns HTTP 422.
* Double-Entry Ledger: Every transfer creates balanced signed ledger entries whose sum is zero. Cached account balances are continuously checked against the sum of ledger entries, with six deterministic financial invariants covering balance conservation, duplicate posting, convergence, overdrafts, cached balances, and idempotency consistency.
* Concurrency Control: Uses PostgreSQL SELECT ... FOR UPDATE row locks acquired in deterministic account-ID order to prevent lost updates, overdrafts, and opposite-direction deadlocks. In a 200-payment hot-account race, exactly 50 payments completed, 150 failed safely, and the payer ended at $0.
* Failure Recovery: Added reconciliation for stale PENDING_LEDGER payments plus fault-injection points around outbox publication, ledger commits, and Kafka acknowledgements. Completed a 27/27-run chaos campaign with 0 invariant violations while absorbing 18,000 duplicate events and recovering from 14 real JVM crashes.
* Performance: Reduced end-to-end p95 latency from 121 ms to 51 ms at 200 payments/s by tuning outbox polling from 50 ms to 10 ms. Best observed local throughput reached approximately 600 payments/s with 496 ms p95, treated only as a local-machine measurement.
* Automated Verification: 94 automated tests across payment-service, ledger-service, and end-to-end Testcontainers suites using real PostgreSQL and Kafka. GitHub Actions runs Maven verification on pull requests and main.
* Interactive Demo: Built a lightweight HTML/CSS/JavaScript dashboard under the demo profile with real payment flows, dynamic ledger-backed accounts, 2–5 transaction concurrency scenarios, listener pauses, artificial processing delays, lost-result simulation, and reconciliation recovery.
* Kubernetes v1.1.0: Added an optional local Kubernetes deployment using k3d/k3s, kubectl, and plain YAML. PostgreSQL and Kafka run as single StatefulSets with PVC-backed persistence; payment-service and ledger-service run as Deployments with Kubernetes Services, ConfigMaps, Secrets, startup/readiness/liveness probes, resource limits, and internal service discovery.
* Kubernetes Verification: Verified a clean cluster build from scratch, all four workloads reaching 1/1 Ready, payment-service and ledger-service pod replacement, PostgreSQL and Kafka pod restarts with PVC persistence, and a 250-payment application-restart scenario finishing 250/250 COMPLETED with 0 duplicate postings and all financial invariants clean.
* Deployment Boundary: Kubernetes support is intentionally local and single-node. The project does not claim production Kubernetes, high availability, zero downtime, autoscaling, multi-node Kafka, PostgreSQL replication, Helm, Terraform, EKS, GKE, or AKS.
* Stack: Java 25, Spring Boot 4.1.x, Spring MVC, Spring JDBC/JdbcClient, Spring Kafka, Apache Kafka KRaft, PostgreSQL 17, Flyway, Maven, Docker Compose, Kubernetes, k3d/k3s, kubectl, Testcontainers, JUnit 5, AssertJ, Awaitility, Actuator, Micrometer, k6, GitHub Actions, HTML/CSS/JavaScript.

### 4. LaunchOps — Office Onboarding & Real-Time Learning Platform
* Date: June 2026
* Objective: Build a role-based office onboarding workspace that coordinates HR, IT, managers, and employees through structured onboarding tasks while retaining a real-time learning and quiz subsystem.
* Onboarding Workflow: Built a Django REST Framework + React workspace with 20 onboarding tasks across HR, IT, manager, and employee roles. Tasks have dedicated owners, prerequisites, evidence requirements, completion events, and server-side authorization preventing users from completing another role's work.
* Employee Training: Added five lessons and five three-question assessments. The backend records lesson acknowledgments, grades quizzes server-side, preserves failed attempts during retries, and requires every published assessment to meet the exact 70% passing rule before training can be completed.
* Workflow Integrity: Added backend validation against skipped prerequisites, forged evidence, duplicate submissions, unauthorized task completion, and unresolved support/equipment issues before HR final signoff.
* Real-Time Quiz Architecture: Added a Go WebSocket live-quiz path using two worker replicas behind an nginx gateway. Redis coordinates room/question state and Pub/Sub fanout between workers, while Lua logic enforces question deadlines and first-answer claims.
* MongoDB Integration: Stores live-quiz answers in MongoDB with a unique `(room, question_id, user_id)` index for durable duplicate prevention. PostgreSQL remains the primary database for users, onboarding workflows, lessons, and asynchronous assessments.
* Authentication & Room Control: Django validates JWT identity, course enrollment, and host privileges before supplying room information to Go workers. Each room selects one execution engine so Django and Go WebSocket paths cannot both operate on the same room.
* Real-Time Learning Features: Retains Django Channels-based live quizzes, course chat, WebSocket communication, Redis-backed real-time state, and a backtracking-based scheduling subsystem.
* Performance Evaluation: Built a repeatable Django-vs-Go WebSocket benchmark harness that creates fresh synthetic quizzes, alternates execution order, varies concurrent users, and records p50/p95/p99 question-reveal and answer-acceptance latency, host-chart completion, missed events, and connection failures.
* Simulation Boundary: External provisioning, payroll, device, and identity actions are demo simulations rather than integrations with real enterprise systems. No unverified post-Go speedup or production-scale performance claim is made.
* Stack: Python, Django REST Framework, ReactJS, Go, PostgreSQL, MongoDB, Redis, Django Channels, Daphne, WebSockets, JWT, nginx, Docker Compose, Locust, asyncio.

### 5. GoingOnce — Multi-Agent Car Marketplace Platform
* Date: October 2026
* Context: Team of 4, University at Buffalo AI for Good Hackathon Design Challenge. Won 1st place in the ACV Auctions + Copart challenge.
* Objective: Build a multi-agent automotive marketplace prototype where AI agents help dealers buy, sell, negotiate, and distribute vehicles while keeping important actions under human approval.
* Agent Architecture: Co-built four LangGraph agents — Buy, Sell, Negotiate, and Fleet — with approval checkpoints, loops, and shared marketplace state for requests, listings, bids, and messages.
* Buy Agent: Takes a dealer's natural-language vehicle request, searches simulated listings, checks vehicle-history information, rejects listings containing issues such as hidden salvage records or odometer rollback, and pauses for dealer approval before a simulated bid.
* Sell Agent: Reads vehicle photos with Claude, generates a condition summary, compares selling options, identifies waiting buyers, and pauses for seller approval before simulated listing and auction actions.
* Negotiation Agent: Models private buyer and seller limits while a mediator agent narrows the gap through negotiation rounds. A successful simulated deal then flows through escrow, loan payoff, title, insurance, and transportation steps.
* Fleet Agent: Distributes a simulated fleet of 120 similar vehicles across markets in full truckloads to balance market supply and illustrative transportation costs.
* Deterministic AI Boundary: Claude handles language understanding, vehicle-photo interpretation, and explanations. Search, vehicle-history checks, pricing calculations, negotiation math, and logistics remain deterministic application code so results are reproducible.
* Human-in-the-Loop: Important actions such as bidding and listing require explicit user approval rather than allowing agents to execute them autonomously.
* Reliability: Every Claude call has a stored fallback response, and a demo-safe mode can replay saved outputs when network/model access is unavailable.
* Interfaces: Built a Streamlit application with four agent tabs and an alternate React/Vite interface connected to an HTTP API that streams agent activity to the browser using Server-Sent Events.
* Testing: Added 24 pytest automated tests covering the four workflows, click-through application behavior, and API interactions.
* Data Boundary: Runs on 310 generated ACV/Copart-style listings and simulated bids, payments, insurance, transportation, messages, prices, fees, and demand. It is not a production marketplace and does not integrate with real ACV Auctions or Copart systems.
* Stack: Python, LangGraph, Claude API, Streamlit, ReactJS, Vite, Server-Sent Events, pytest.

### 6. AI Metadata Extraction Pipeline (HeinOnline)
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

### 7. Relational Fraud Detection using Graph Neural Networks (GNN)
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

### 8. Pintos OS: User Programs
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
* Email: jayadmit456@gmail.com
* GitHub: github.com/Jaypath456
* LinkedIn: https://linkedin.com/in/jaypathare
`;
