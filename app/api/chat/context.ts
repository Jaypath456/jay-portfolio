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
### 1. Decoupled Learning Management System (LMS)
* Date: June 2026
* Architecture: Decoupled Client-Server (REST API). Django/DRF Backend, React.js Frontend.
* Authentication: Stateless JWT via SimpleJWT, stored securely. Axios interceptors automatically attach tokens.
* Rich Text Editor: Plate.js (built on Slate.js) for headless JSON-tree data structuring, allowing complex course chapter creation.
* Automated Quiz Engine: Django models for questions/submissions. Handles automated grading and secure score logging.
* Real-Time Messaging: Django Channels (ASGI) and WebSockets backend; WebSocket API frontend for instant office hours and announcements.
* Interactive Schedule Maker: React Big Calendar integrated with Django Date/Time models for centralized deadline management.

### 2. AI Metadata Extraction Pipeline (HeinOnline)
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

### 3. Relational Fraud Detection using Graph Neural Networks (GNN)
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

### 4. Pintos OS: User Programs
* Date: May 2026 (CSE 521)
* Details: Engineered User Programs subsystem in C. Implemented argument parsing, process synchronization with semaphores, and memory safety checks. Hardened the kernel with verify-before-dereference validation.

### 5. CampusSense IoT Platform
* Date: November 2025 (UB Hacking)
* Hardware: Arduino microcontrollers with MPI 3118A sensors.
* Software: Django backend (Auth0 authentication, PostgreSQL), React frontend dashboard.
* Workflow: Arduino streams continuous temperature readings over WiFi. Django parses and stores data. React polls API for live UI updates.

### 6. Music Genre Classification
* Date: April 2023 (Published in IJRAR)
* Details: Audio feature extraction pipeline hitting 97.68% accuracy using CatBoost and KNN.

---

## Contact & Links
* Email: jaypathare123@gmail.com
* GitHub: https://github.com/jaypathare
* LinkedIn: https://linkedin.com/in/jaypathare
`;