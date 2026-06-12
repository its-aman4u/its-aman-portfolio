# Aman Singh — AI-Native Systems Architect & Full-Stack Automation Specialist

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?logo=vercel&logoColor=white&style=flat-square)](https://itsaman4u.vercel.app)
[![React](https://img.shields.io/badge/React-18.x-blue?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-orange?logo=three.js&logoColor=white&style=flat-square)](https://threejs.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0_Flash-blueviolet?logo=google&logoColor=white&style=flat-square)](https://deepmind.google/technologies/gemini/)
[![Python](https://img.shields.io/badge/Python-FastAPI_/_Streamlit-yellow?logo=python&logoColor=white&style=flat-square)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

An immersive, interactive 3D portfolio and AI assistant showcasing technical business analysis, full-stack systems engineering, and operational logistics automation. Deployed at Holisol Logistics, these architectures successfully optimized operational workflows, recovering **₹1.3 Crore ($155K USD) in bottom-line leakage** and automating **151.5 hours/month of manual labor**.

---

## 🚀 Live Platform
* **Production Deployment URL**: [itsaman4u.vercel.app](https://itsaman4u.vercel.app)
* **Genesis AI Chatbot**: [itsaman4u.vercel.app/chatbot](https://itsaman4u.vercel.app/chatbot)

---

## 🛠️ Technology Stack & Toolbelt

### Frontend Architecture
* **Framework**: React 18, TypeScript, Vite
* **3D Visualizations**: Three.js, React Three Fiber (R3F), `@react-three/drei`
* **Styling**: Tailwind CSS, shadcn/ui components (Radix primitives)
* **Animations**: Framer Motion, CSS Glow Keyframes

### Backend & API Architecture
* **API Framework**: Python, FastAPI, Streamlit
* **Serverless Functions**: Vercel Serverless Architecture (Node.js API handler)
* **Databases**: SQLite, DuckDB (local analytical storage), MySQL (live warehouse connector)
* **Security Protocols**: SSH Tunneling, AES-256 (Fernet) credentials vault, JWT, and 4-role RBAC access matrices

---

## 🌟 Flagship Features

### 1. Interactive SVG Architecture Diagrams
Every project card on the `/projects` page features an interactive, responsive vector blueprint showcasing the internal data flow of the system:
* **HWMS Insights Connector**: Displays an encrypted SSH tunnel tube bridging a client request with a secure database cylinder, complete with moving data packets on hover.
* **Zero-Trust AI Workspace**: Renders a Docker secure container sandbox enclosed by a protective outer Prompt Shield barrier.
* **InsightForge ETL Engine**: Renders a 3-layer ETL transformation grid (Bronze -> DuckDB ETL -> Gold Dashboard) with an Ollama LLM validation shield.
* **Increff Inventory Validator**: Renders a visual balance scale reconciling physical WMS quantities against ERP ledgers.

### 2. Upgraded "Genesis AI" Chatbot
An intelligent virtual companion with administrative privileges and a secure serverless backend:
* **Secure Serverless Proxy (`/api/gemini`)**: Routes LLM queries through a secure Vercel function, keeping the Google Gemini API key hidden from frontend network inspections.
* **Collapsible Configuration Settings**: Recruiter-friendly UI allowing visitors to paste their own Gemini API key (saved securely in their browser's local `localStorage`).
* **Markdown Rendering**: Formats responses dynamically using bullet points, bolding, and inline monospace code blocks.
* **Local Sandbox Fallback**: Automatically activates if offline or keyless, utilizing a pattern-matching database to answer detailed questions about Aman's projects and metrics.
* **Passcode Verification (`/api/verify-passcode`)**: Enforces secure admin unlocks using server-side passcode checking.

### 3. Integrated Human-Style Case Studies & Blogs
To avoid empty grids when databases are unseeded, the platform incorporates **5 detailed local case studies** as a default fallback:
1. **HWMS Insights Connector**: Decrypting database tunneling, Python SSH modules, and 4-role RBAC architectures.
2. **Increff Inventory Validator**: Automating daily joins and discrepancies tracking via Pandas and secure SFTP file drops.
3. **Zero-Trust AI Workspace**: Isolate coding agents inside read-only Docker containers, utilizing MCP gateways to restrict tool permissions.
4. **InsightForge ETL Sandbox**: Columnar processing using DuckDB, Streamlit, and 22 SQL security regex rules.
5. **FC Profit & Loss Compilation**: Automating transport audits, Permit-to-Work checklists, and fuel surcharge updates.

---

## 📄 Resumes & LaTeX Templates
The `/clean_drop` directory contains clean, optimized LaTeX templates compiled using TeX Live 2025. Margins are set to 0.5-in to balance content on exactly two pages with no empty spacing or orphans:
* **AI Systems Architect Resume**: [ai_automation_architect_master.tex](./clean_drop/ai_automation_architect_master.tex)
* **Premium Full-Stack Resume**: [premium_fullstack_uiux.tex](./clean_drop/premium_fullstack_uiux.tex)
* *Note: Generated PDFs are automatically copied to `/public` and served live on the portfolio website.*

---

## ⚙️ Secure Configuration & Environmental Setup

To run this application locally with full AI capabilities, create a `.env` file at the root:

```env
# Google Gemini API key for local developer testing
VITE_GEMINI_API_KEY=AIzaSy...

# Passcode to unlock admin chatbot features (Vercel deployment variable)
CHATBOT_ADMIN_PASSCODE=AQ.Ab8RN6...
```

---

## 💻 Local Installation & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/its-aman4u/its-aman-portfolio.git
   cd its-aman-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Build the production bundle**:
   ```bash
   npm run build
   ```

---

## 🔒 License
This project is licensed under the MIT License - see the LICENSE file for details.
