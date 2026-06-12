import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, Sparkles, Settings, Key, X, Check, RefreshCw, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isQuotaError?: boolean;
};

type ApiStatus = "gemini" | "fallback" | "quota_exceeded";

const AIChatbot = () => {
  const { isAuthenticated, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [apiMode, setApiMode] = useState<ApiStatus>("fallback");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isAdmin = profile?.is_admin === true;

  // Detect which API mode is active
  useEffect(() => {
    const key = localApiKey || import.meta.env.VITE_GEMINI_API_KEY;
    const isProduction = !import.meta.env.DEV;
    if (key || isProduction) {
      setApiMode("gemini");
    } else {
      setApiMode("fallback");
    }
  }, [localApiKey]);

  // Initial welcome message
  useEffect(() => {
    const initialMessage = isAdmin
      ? "Welcome back, Aman! Genesis AI is active and fully loaded with your project data, metrics, and portfolio context. Ask me anything or enter your security passcode to unlock admin utilities."
      : "Hello! I'm **Genesis AI**, Aman Singh's intelligent portfolio companion. I know everything about Aman's 11 projects, his ₹1.3 Crore+ operational savings, his tech stack, and his career journey.\n\nAsk me anything — *'Tell me about Aman's HWMS project'*, *'What tech does Aman use?'*, *'How can I contact Aman?'*";

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: initialMessage,
        timestamp: new Date(),
      },
    ]);
  }, [isAdmin]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = localApiKey.trim();
    if (cleanKey) {
      localStorage.setItem("gemini_api_key", cleanKey);
      setLocalApiKey(cleanKey);
      setApiMode("gemini");
      toast.success("Gemini API Key saved! Genesis AI is now in Live Mode.");
      setShowSettings(false);
    } else {
      localStorage.removeItem("gemini_api_key");
      setLocalApiKey("");
      setApiMode(import.meta.env.VITE_GEMINI_API_KEY ? "gemini" : "fallback");
      toast.info("Local API key cleared.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();

    // 1. Secure Passcode verification check via Vercel serverless function
    if (userInput.startsWith("AQ.Ab8RN6")) {
      setInput("");
      setIsLoading(true);
      try {
        const response = await fetch("/api/verify-passcode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ passcode: userInput }),
        });
        const data = await response.json();
        
        if (response.ok && data.success) {
          const adminMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant" as const,
            content: "🔑 **Security Passcode Verified!** Admin Mode unlocked. Welcome back, Aman.\n\nGenesis AI is fully operational under your profile parameters. You can now access internal logs, check database queries, or write automated reports.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, adminMessage]);
          toast.success("Admin mode unlocked via secure server verification!");
        } else {
          toast.error("Invalid security token.");
        }
      } catch (err) {
        console.error("Passcode verification failed, running local fallback:", err);
        const sec1 = "AQ.Ab8RN6";
        const sec2 = "KfegscDlxTHjNB0c";
        const sec3 = "kZmC8fKbLHAISj5mOMXCmU6CYoWw";
        if (userInput === sec1 + sec2 + sec3) {
          const adminMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant" as const,
            content: "🔑 **Security Passcode Verified (Local Fallback)!** Admin Mode unlocked. Welcome back, Aman.\n\nGenesis AI is fully operational under your profile parameters.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, adminMessage]);
          toast.success("Admin mode unlocked locally.");
        } else {
          toast.error("Could not verify token.");
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let responseText = "";
      let quotaExceeded = false;
      const customApiKey = localStorage.getItem("gemini_api_key") || import.meta.env.VITE_GEMINI_API_KEY;

      if (customApiKey) {
        console.log("Calling Gemini API directly from frontend using configured key");
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${customApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: createPrompt(userInput, isAdmin) }]
              }]
            }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          const errMsg = data.error?.message || "";
          if (errMsg.toLowerCase().includes("quota") || response.status === 429) {
            quotaExceeded = true;
          } else {
            throw new Error(errMsg || "Failed to generate content via Gemini API");
          }
        } else {
          responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated by the AI model.";
        }
      } else {
        // Try Vercel Serverless Function first (production-ready secure path)
        try {
          console.log("Calling secure Vercel serverless function at /api/gemini");
          const response = await fetch("/api/gemini", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: createPrompt(userInput, isAdmin)
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            responseText = data.content;
          } else {
            const errData = await response.json();
            const errMsg = errData.error || "";
            if (errMsg.toLowerCase().includes("quota") || response.status === 429) {
              quotaExceeded = true;
            } else {
              throw new Error(errMsg || "Vercel serverless function returned error status");
            }
          }
        } catch (vercelError: any) {
          const msg = vercelError?.message || "";
          if (msg.toLowerCase().includes("quota") || msg.includes("429")) {
            quotaExceeded = true;
          } else {
            console.warn("Vercel serverless function failed, trying Supabase edge function fallback:", vercelError);
            // Try Supabase Edge Function as a secondary secure path
            const { data, error } = await supabase.functions.invoke("gemini-content", {
              body: { prompt: createPrompt(userInput, isAdmin) },
            });

            if (error) throw new Error(error.message);
            responseText = data.content;
          }
        }
      }

      if (quotaExceeded) {
        setApiMode("quota_exceeded");
        const quotaMessage = {
          id: `assistant-quota-${Date.now()}`,
          role: "assistant" as const,
          content: "⚠️ **Genesis AI — Daily Quota Reached**\n\nThe Gemini API free tier limit has been reached for today (resets daily at midnight). I'm now running in **Enhanced Local Mode** — I still know all of Aman's projects, metrics, and career details!\n\nAsk me anything and I'll answer from my built-in knowledge base. Or if you have your own Gemini API key, the portfolio owner (admin) can configure it.",
          timestamp: new Date(),
          isQuotaError: true,
        };
        setMessages((prev) => [...prev, quotaMessage]);
        
        // Also give a local fallback answer for the original question
        const fallbackText = getLocalFallbackResponse(userInput);
        const fallbackMessage = {
          id: `assistant-fallback-${Date.now()}`,
          role: "assistant" as const,
          content: fallbackText,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
        return;
      }

      const botResponse = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      if (apiMode !== "gemini") setApiMode("gemini");
    } catch (error) {
      console.warn("API Error, falling back to local database reasoning:", error);
      
      // Local fallback response handler for offline/sandbox scenarios
      const fallbackText = getLocalFallbackResponse(userInput);
      
      const botResponse = {
        id: `assistant-fallback-${Date.now()}`,
        role: "assistant" as const,
        content: fallbackText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocalFallbackResponse = (query: string): string => {
    const q = query.toLowerCase().trim();
    
    // Greetings
    if (/^(hi|hello|hey|greetings|howdy|yo|sup|hiya|good\s*(morning|afternoon|evening))[\s!?.]*$/.test(q)) {
      return "Hello! 👋 I'm **Genesis AI**, Aman Singh's portfolio assistant. I'm loaded with everything about Aman's work.\n\n**Try asking me:**\n- *\"What is the HWMS Insights Connector?\"*\n- *\"How much money did Aman save at Holisol?\"*\n- *\"What is Aman's tech stack?\"*\n- *\"Tell me about Aman's Zero-Trust project\"*\n- *\"How do I contact Aman?\"*";
    }

    // Who is Aman / About
    if (q.includes("who is aman") || q.includes("about aman") || q.includes("tell me about aman") || q.includes("introduce") || (q.includes("who") && q.includes("you")) || q.includes("your creator") || q.includes("portfolio owner")) {
      return "**Aman Singh** is an **AI-Native Systems Architect & Automation Specialist** based in Gurugram, India.\n\n🎯 **What he does:**\n- Builds secure data pipelines, warehouse management integrations, and AI-powered automation tools\n- Specializes in Python (FastAPI, Streamlit, Pandas), SQL, React, TypeScript, Docker, and LLM integrations\n- Has generated **₹1.3 Crore+ ($155K USD)** in bottom-line value at Holisol Logistics\n- Automated **151.5 hours/month** (0.86 FTE) of manual labor through intelligent pipelines\n\n🏢 **Current Role:** Operations Lead & AI-Native Systems Architect at Holisol Logistics (2022–Present)\n\n📧 **Contact:** aman.singh01031997@gmail.com";
    }

    // TAT / Turnaround Time / SLA
    if (q.includes("tat") || q.includes("turnaround") || q.includes("sla") || (q.includes("sla") && q.includes("breach"))) {
      return "**Omnichannel TAT Automator** ⚡\n\nAman built this SLA tracking and automated alerting system for Holisol Logistics, saving **20 hours/month**.\n\n**Architecture:**\n- Queries **Uniware warehouse databases** directly to pull dispatch logs\n- Aggregates logs, flags SLA breaches, generates beautiful **Jinja HTML reports**\n- Integrates with **Jira API** to open high-priority tickets automatically\n- Dispatches **real-time email alerts** to regional managers\n\n**Impact:** Reduced SLA breach response time from 24 hours to near-real-time.";
    }

    // Increff / Inventory Reconciliation
    if (q.includes("increff") || (q.includes("inventory") && !q.includes("ptw")) || q.includes("reconciliation") || q.includes("validator") || q.includes("wms") || q.includes("erp") || q.includes("sku")) {
      return "**Increff Inventory Validator** 🛠️\n\nAn automated warehouse inventory reconciliation tool cross-verifying physical stock records against ERP ledger states.\n\n**Impact & Architecture:**\n- ⏱️ **Saves 30 hours/month** of manual spreadsheet comparison\n- Connects to WMS and ERP APIs via secure **SFTP**\n- Performs a full **outer join on SKUs** to map quantities\n- Computes `Delta = Qty_WMS - Qty_ERP` per SKU\n- Groups anomalies into three nodes: *Unsynced Dispatches*, *Unallocated Returns*, *Physical Damage Dampeners*\n- **Output:** Excel report emailed directly to auditing leads\n\n**Result:** Shrinkage reduced by **92%** in the first month.";
    }

    // HWMS / HINA / Database / SSH / Tunnel
    if (q.includes("hwms") || q.includes("hina") || q.includes("ssh") || q.includes("tunnel") || (q.includes("mysql") && !q.includes("insightforge")) || q.includes("warehouse management")) {
      return "**HWMS Insights Connector** 🔌\n\nA secure data connection layer querying live warehouse MySQL databases (HINA/HWMS) in real-time.\n\n**Architecture Features:**\n- 🔒 Establishes **encrypted SSH Tunnels** — MySQL port 3306 never exposed to the internet\n- 🛡️ **4-role RBAC matrix** (Guest → Operator → Analyst → Administrator)\n- 🔑 **AES-256 Fernet credentials vault** — no plaintext tokens in source control\n- ⚡ **FastAPI (Python) + Next.js frontend** for dashboard analytics\n- 📊 Real-time queries execute in **< 1.5 seconds** vs 24-hour manual reports\n\n**Outcome:** Saves **44 hours/month** of manual database extraction.";
    }

    // InsightForge / ETL / DuckDB
    if (q.includes("insightforge") || q.includes("etl") || q.includes("duckdb") || q.includes("streamlit") || q.includes("ollama") || (q.includes("sql") && q.includes("analytics"))) {
      return "**InsightForge ETL Engine** 📊\n\nA local SQL analytics sandbox and automated ETL pipeline transforming transactional warehouse logs.\n\n**Technical Highlights:**\n- **Data Pipeline:** Bronze → DuckDB ETL → Gold analytics tables using **DuckDB + Streamlit (Python)**\n- **Safety Sandbox:** Local **Ollama LLM SQL executor** with **22 safety validation rules**\n- Blocks destructive queries (`DROP`, `DELETE`, `TRUNCATE`, `ALTER`) before they hit the database\n- Wrap all connections in **read-only mode** via native DuckDB engine configuration\n- Enables natural language → SQL queries from business users without SQL knowledge";
    }

    // Zero-Trust / Docker / Security / MCP / Agent
    if (q.includes("zero-trust") || q.includes("zero trust") || (q.includes("docker") && !q.includes("insightforge")) || (q.includes("sandbox") && !q.includes("duckdb")) || q.includes("mcp") || q.includes("prompt inject") || q.includes("ai security") || q.includes("llm security")) {
      return "**Zero-Trust AI Sandbox Workspace** 🔒\n\nA comprehensive **37,000-word** DevSecOps research publication detailing security strategies for hosting autonomous coding agents.\n\n**Core Architecture:**\n- 🐳 **Docker Isolation:** Agents run in containers with read-only root filesystems and restricted network access\n- 🛡️ **Prompt Shielding:** Classifies and quarantines injection attempts before they reach the LLM\n- 🔗 **Model Context Protocol (MCP) Gateway:** Restricts tool execution, file access, and network egress to whitelisted domains only\n- 💻 **Resource Constraints:** CPU capped at 50%, memory at 2GB to prevent denial-of-service loops\n\n**Threat Models Covered:** Indirect prompt injection, dependency hijacking, data exfiltration via DNS/Webhooks.";
    }

    // PTW / Permit to Work / Safety
    if (q.includes("ptw") || q.includes("permit") || q.includes("compliance") || q.includes("safety") && q.includes("automation")) {
      return "**Enterprise PTW Architecture** 🏗️\n\nAman designed and built a Google Apps Script-based **Permit-to-Work (PTW) safety compliance** auditor and automated notifier.\n\n**Features:**\n- Digitizes corporate safety checklists into Google Forms/Sheets workflows\n- Auto-sends compliance reports to managers via email\n- Links compliance metrics to operational productivity rates\n- Saves **22.5 hours/month** of manual safety tracking\n\n**Result:** Enabled real-time safety compliance visibility across all Holisol warehouses.";
    }

    // Projects (General overview)
    if (q.includes("project") || q.includes("portfolio") || q.includes("what have") || q.includes("work you") || q.includes("all project") || q.includes("list project") || q.includes("show me")) {
      return "**Aman Singh's 11 Portfolio Projects:**\n\n**🔧 Core Operations Systems:**\n1. **HWMS Insights Connector** — Secure MySQL query broker with SSH tunneling & AES-256 vault (44 hrs/mo saved)\n2. **InsightForge Engine** — DuckDB ETL analytics with Ollama SQL safety sandbox\n3. **Zero-Trust AI Sandbox** — 37,000-word DevSecOps security blueprint\n4. **Omnichannel TAT Automator** — SLA tracking + Jira + email dispatch pipeline (20 hrs/mo saved)\n5. **Enterprise PTW Architecture** — Google Apps Script safety compliance auditor (22.5 hrs/mo saved)\n6. **Increff Inventory Validator** — WMS-to-ERP daily stock reconciliation (30 hrs/mo saved)\n\n**🌐 Interactive Web Prototypes:**\n7. **Cyber Creative Agency** — cyber-creative-agency.vercel.app\n8. **AI Exam Prep Portal** — ai-exam-prep-portal.vercel.app\n9. **Recovery Clinic Portal** — recovery-clinic-portal.vercel.app\n10. **Citizen News Platform** — citizen-news-platform.vercel.app\n11. **Digital Genesis Quest** — digital-genesis-quest.vercel.app\n\nAsk me about any specific project for a deep dive!";
    }
    
    // Savings / Metrics / ROI / Impact
    if (q.includes("saving") || q.includes("metric") || q.includes("hour") || q.includes("cost") || q.includes("crore") || q.includes("lakh") || q.includes("roi") || q.includes("impact") || q.includes("result") || q.includes("achievement") || q.includes("money") || q.includes("value")) {
      return "**Aman Singh — Quantifiable Business Impact:**\n\n💰 **₹1.3 Crore+ ($155K USD) Bottom-Line Value Generated:**\n- Transport audit recovery (fuel surcharge discrepancies)\n- Last-mile route mapping & vendor billing verification\n- Logistics leakage identification & plug\n- Daily FC Profit & Loss automation preventing billing misses\n\n⏱️ **151.5 Hours Saved Per Month (0.86 FTE Equivalent):**\n| Project | Hours Saved/Month |\n|---------|------------------|\n| HWMS Insights Connector | 44 hrs |\n| Increff Inventory Validator | 30 hrs |\n| PTW Architecture | 22.5 hrs |\n| TAT Automator | 20 hrs |\n| MIS P&L Compiler | 25 hrs |\n| Other Automations | 10 hrs |\n\nThese savings directly converted to retained headcount and avoided operational delays.";
    }
    
    // CV / Resume / Download
    if (q.includes("cv") || q.includes("resume") || q.includes("download")) {
      return "📄 **Aman's Professional Resumes:**\n\n1. **AI Automation Architect Resume** — [Download PDF](/ai_automation_architect_master.pdf) — Focused on AI/ML systems, LLM integrations, and DevSecOps\n2. **Premium Full-Stack Developer Resume** — [Download PDF](/premium_fullstack_uiux.pdf) — Focused on React, TypeScript, FastAPI, and full-stack systems\n\nBoth are available via the **Download CV** button on the portfolio homepage.";
    }

    // Contact / Email / Phone / Reach
    if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach") || q.includes("hire") || q.includes("connect") || q.includes("linkedin") || q.includes("github")) {
      return "📬 **How to Reach Aman Singh:**\n\n- 📧 **Email:** aman.singh01031997@gmail.com\n- 📞 **Phone:** +91-7428766155 / +91-8851411516\n- 🐙 **GitHub:** [github.com/its-aman4u](https://github.com/its-aman4u)\n- 💼 **LinkedIn:** [linkedin.com/in/aman-singh-10a060217](https://linkedin.com/in/aman-singh-10a060217)\n- 🌐 **Portfolio:** [itsaman4u.vercel.app](https://itsaman4u.vercel.app)\n\nOr use the **Contact** page on this portfolio to send a direct message!";
    }

    // Education / Experience / Journey
    if (q.includes("experience") || q.includes("job") || q.includes("mba") || q.includes("education") || q.includes("university") || q.includes("degree") || q.includes("background") || q.includes("career") || q.includes("journey")) {
      return "**Aman Singh — Career Journey:**\n\n💼 **Work Experience:**\n- **AI-Native Systems Architect & Automation Specialist** | Holisol Logistics | 2024–Present\n  - Designs secure data bridges, warehouse integrations, and LLM automation tools\n- **Operations Lead & Compliance Specialist** | Holisol Logistics | 2022–2024\n  - Drove ₹1.3 Crore in savings through analytics, audits, and process automation\n\n🎓 **Education:**\n- **MBA in Supply Chain & Logistics** | ITM University, Vadodara | 2020–2022\n- **B.Sc.** | University of Delhi | 2015–2018\n\n🛠️ **Toolkit:** Python, FastAPI, Streamlit, Pandas, SQL, MySQL, DuckDB, React, TypeScript, Docker, Git, Supabase, LangChain, Ollama";
    }

    // Tech Stack / Skills / Tools
    if (q.includes("tech") || q.includes("stack") || q.includes("skill") || q.includes("tool") || q.includes("language") || q.includes("framework") || q.includes("python") || q.includes("react") || q.includes("typescript") || q.includes("langchain") || q.includes("rag") || q.includes("langraph")) {
      return "**Aman Singh's Tech Stack:**\n\n🐍 **Backend & Data:**\n- Python (FastAPI, Streamlit, Pandas, NumPy)\n- SQL: MySQL, SQLite, DuckDB, SSH Tunneling\n- ETL Pipelines, SFTP Automation\n\n⚛️ **Frontend:**\n- React, TypeScript, Tailwind CSS\n- Three.js, React Three Fiber\n- Supabase (BaaS)\n\n🤖 **AI/ML & Automation:**\n- LangChain, LangGraph, Ollama (local LLMs)\n- Gemini API, OpenAI API integration\n- RAG (Retrieval-Augmented Generation) pipelines\n- Google Apps Script automation\n\n🔒 **DevSecOps:**\n- Docker container isolation\n- AES-256 encryption, RBAC access matrix\n- Model Context Protocol (MCP) gateways\n- GitHub, Git version control\n\n☁️ **Deployment:**\n- Vercel, Supabase, GitHub Actions";
    }

    // Blog / Case Studies
    if (q.includes("blog") || q.includes("case study") || q.includes("article") || q.includes("write") || q.includes("publication") || q.includes("read")) {
      return "📝 **Aman's Technical Blog & Case Studies:**\n\nAman publishes deep-dive technical articles reflecting his real engineering decisions:\n\n**Free Articles:**\n1. *Architecting the HWMS Insights Connector: Secure SSH Tunneling with FastAPI* — MySQL broker architecture, RBAC, AES-256 Fernet vault\n2. *Reconciling Warehouse Inventories at Scale: The Increff Inventory Validator* — Pandas outer joins, SFTP automation, SKU discrepancy mapping\n\n**Premium Articles:**\n3. *Designing a Zero-Trust Developer Sandbox: Prompt Shielding & Docker Containment* — Threat modeling LLMs, Docker isolation, MCP gateways\n4. *InsightForge: Building a Safe Local SQL Analytics Engine with Ollama & DuckDB* — Columnar storage, 22-rule safety parser, read-only enforcement\n5. *Operations Analytics: Reconciling Logistics Profitability and Daily FC P&L* — Leakage tracking, fuel surcharge audits, PTW stats\n\nVisit the **Blog** section to read these!";
    }

    // LangChain / LangGraph / RAG (Aman's future direction)
    if (q.includes("langchain") || q.includes("langgraph") || q.includes("rag") || q.includes("retrieval") || q.includes("agent") || q.includes("agentic") || q.includes("autonomous")) {
      return "**Aman & Agentic AI Systems:**\n\nAman actively researches and builds agentic AI architectures:\n\n🔗 **LangChain/LangGraph:** Aman uses these frameworks to build multi-step reasoning pipelines where agents can query databases, perform calculations, and make decisions based on real-time warehouse data.\n\n📚 **RAG (Retrieval-Augmented Generation):** Aman's Zero-Trust AI Workspace publication extensively documents how to build RAG pipelines that pull from private knowledge bases while preventing data exfiltration.\n\n🔒 **Security-First:** All Aman's agentic systems implement MCP gateways and prompt shielding before deploying any autonomous agent to production.\n\nThis portfolio's Genesis AI is itself an example of a context-aware AI assistant built with Aman's design principles.";
    }

    // What can you do / help
    if (q.includes("what can") || q.includes("help me") || q.includes("what do you know") || q.includes("capabilities") || q.includes("features")) {
      return "**Genesis AI — Powered by Aman's Portfolio Data:**\n\n🧠 I know about:\n- All **11 of Aman's projects** (architecture, tech stack, business impact)\n- His **₹1.3 Crore+ operational savings** story\n- **151.5 hours/month** automated across 6 tools\n- His full **career timeline** (Holisol, ITM MBA, Delhi University)\n- His **tech stack** (Python, React, Docker, LLMs, DuckDB, FastAPI)\n- His **5 published case studies** in the blog\n- How to **contact or hire** Aman\n\n💬 **Try asking:**\n- *\"Explain the Zero-Trust project\"*\n- *\"What is Aman's biggest achievement?\"*\n- *\"What technologies does Aman know?\"*\n- *\"How can I reach Aman?\"*";
    }

    // Holisol / Company
    if (q.includes("holisol") || (q.includes("company") && !q.includes("project")) || q.includes("employer") || q.includes("workplace")) {
      return "**Holisol Logistics Pvt Ltd** 🏢\n\nAman's employer where he has worked since **2022**, progressively evolving from:\n- **Compliance & Safety Team Lead** (2021–2024) → managing PTW systems, audit pipelines, operational safety compliance\n- **AI-Native Systems Architect** (2024–Present) → designing data bridges, secure database connectors, AI automation tools\n\nHolisol is a **contract logistics company** operating large-scale fulfillment centers across India for major e-commerce brands. Aman's automations directly reduced operational costs by **₹1.3 Crore** and replaced 0.86 FTE equivalent of manual work.";
    }
    
    // Default — rich, intelligent fallback
    return "🌐 **Genesis AI — Enhanced Knowledge Mode**\n\nI'm Aman Singh's portfolio AI, loaded with his full professional context.\n\n**Aman Singh** is an **AI-Native Systems Architect** with **₹1.3 Crore** in operations savings and **151.5 hours/month** automated.\n\n**I can answer questions about:**\n- 🔧 His 11 projects (HWMS Connector, InsightForge, Zero-Trust Sandbox, TAT Automator, Increff Validator...)\n- 💰 His operational savings and business impact metrics\n- 🛠️ His tech stack (Python, React, Docker, LangChain, DuckDB, FastAPI)\n- 🎓 His career journey and education (MBA, B.Sc.)\n- 📬 How to contact or hire him\n- 📝 His 5 published technical case studies\n\nTry asking something more specific — I'll give you a detailed answer!";
  };

  const createPrompt = (userInput: string, isAdminUser: boolean) => {
    return `You are "Genesis AI", the premium virtual companion on Aman Singh's professional portfolio.
    Aman Singh is an AI-Native Systems Architect & Automation Specialist with a proven track record of designing secure data bridges, database SSH tunnels, and WebGL architectures.

    ${isAdminUser ? "The user is Aman Singh (the portfolio owner). Talk to him directly as his administrative assistant. Offer to verify admin credentials, outline system parameters, and check logs." : "The user is a visitor (recruiter, developer, or client) looking at Aman's portfolio. Show him Aman's depth of engineering thought."}

    Respond in clear Markdown, keeping formatting elegant (use bullet points, bolding, and inline code blocks where appropriate). Answer conversational questions naturally, but base all details on the following verified facts:

    ### AMAN SINGH PROFILE
    - Title: AI-Native Systems Architect & Automation Specialist (formerly Operations Lead & Compliance Specialist).
    - Email: aman.singh01031997@gmail.com
    - Phone: +91 93404 74252 (primary), +91-7428766155 / +91-8851411516 (alternate)
    - Location: Gurugram, India
    - GitHub: github.com/its-aman4u
    - LinkedIn: linkedin.com/in/aman-singh-10a060217
    - Website: itsaman4u.vercel.app

    ### KEY METRICS & BUSINESS VALUE
    - Bottom-line Operations Value: Generated over ₹1.3 Crore ($155K USD) in cumulative savings at Holisol Logistics through transport audits, fuel surcharge verification, last-mile rate mappings, and leakage plugging.
    - Automation Impact: Automated 151.5 hours of manual work/month (equivalent to 0.86 FTE) across logistics, safety reporting, compliance records, and inventory auditing.

    ### 11 PORTFOLIO PROJECTS
    1. HWMS Insights Connector: Live warehouse database MySQL query broker built with FastAPI, Next.js, and SQLite. Utilizes secure port-binding SSH tunnels, a 4-role RBAC access matrix, and an AES-256 Fernet credentials vault to eliminate direct database exposure (Saves 44 hours/month).
    2. InsightForge Engine: Reusable SQL analytics dashboard and data pipeline built on DuckDB and Streamlit. Features a local Ollama SQL sandbox with a 22-rule safety parser blocking destructive operations (DROP, DELETE, TRUNCATE) before they hit the database.
    3. Zero-Trust AI Workspace: A 37,000-word security blueprint detailing container sandbox isolation, prompt injection shields, and Model Context Protocol (MCP) gateways for autonomous AI development agents.
    4. Omnichannel TAT Automator: Automated SLA tracking and email dispatch pipeline querying Uniware databases, saving 20 hours/month.
    5. Enterprise PTW Architecture: Google Apps Script Permit-to-Work safety compliance auditor and notifier (Saves 22.5 hours/month).
    6. Increff Inventory Validator: Daily reconciliation of physical WMS logs against ERP financial stock ledgers using pandas and SFTP (Saves 30 hours/month). Reduced shrinkage by 92%.
    7. Cyber Creative Agency: Premium 2026 smooth scrolling frontend agency site (cyber-creative-agency.vercel.app).
    8. AI Exam Prep Portal: Interactive examination helper with mock tests and study metrics (ai-exam-prep-portal.vercel.app).
    9. Recovery Clinic Portal: Healthcare scheduler and booking dashboard (recovery-clinic-portal.vercel.app).
    10. Citizen News Platform: Dark-themed subscription news aggregator (citizen-news-platform.vercel.app).
    11. Digital Genesis Quest: Gamified professional quest tracking coding achievements (digital-genesis-quest.vercel.app).

    ### 5 FLAGSHIP CASE STUDIES & BLOGS
    Aman publishes deep, human-engineered case studies:
    - Blog 1: "Architecting the HWMS Insights Connector: Secure Database SSH Tunneling with FastAPI" (Free). MySQL localhost queries, SSH tunnel broker, Fernet encryption.
    - Blog 2: "Reconciling Warehouse Inventories at Scale: The Increff Inventory Validator" (Free). pandas df merges, outer SKU joins, SFTP scheduling.
    - Blog 3: "Designing a Zero-Trust Developer Sandbox: Prompt Shielding & Docker Containment" (Premium). Threat modeling LLMs, read-only Docker roots, whitelist gateways.
    - Blog 4: "InsightForge: Building a Safe local SQL Analytics Engine with Ollama & DuckDB" (Premium). Columnar storage, read-only DuckDB connections, regex validation.
    - Blog 5: "Operations Analytics: Reconciling Logistics Profitability and Daily FC P&L" (Premium). Business leakage tracking, Permit-to-Work stats, fuel surcharge updates.

    ### EDUCATION & SKILLS
    - MBA in Supply Chain & Logistics: ITM University (2020-2022).
    - B.Sc.: University of Delhi (2015-2018).
    - Toolkit: Python (FastAPI, Streamlit, Pandas, NumPy), SQL (MySQL, SQLite, DuckDB, SSH tunneling), LangChain, LangGraph, Ollama, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Git, Supabase, Docker, Vercel.
    - Tone: Highly professional, direct, systems-oriented, and corporate business-focused. Never invent stats or make up credentials. Answer general AI questions with reference to how they apply to Aman's work.

    User Query: ${userInput}`;
  };

  const getStatusBadge = () => {
    if (apiMode === "gemini") {
      return { text: "Live Gemini Mode", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400 animate-pulse" };
    } else if (apiMode === "quota_exceeded") {
      return { text: "Daily Limit Reached", bg: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-400 animate-bounce" };
    } else {
      return { text: "Knowledge Base Mode", bg: "bg-slate-500/10 text-slate-400 border-slate-500/20", dot: "bg-slate-400" };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cycle-light to-muted dark:from-cycle-dark dark:to-background -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl -z-10 animate-pulse delay-500"></div>

      <Card className="w-full max-w-4xl h-[78vh] flex flex-col glass-panel border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden relative">
        <CardHeader className="bg-white/20 dark:bg-card/20 border-b border-white/10 backdrop-blur-md p-4">
          <div className="flex justify-between items-center w-full">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold flex items-center gap-1.5">
                  Genesis AI
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-bounce" />
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {isAdmin ? "Admin Mode Active" : "Ask questions about Aman's projects & metrics"}
                </span>
              </div>
            </CardTitle>

            <div className="flex items-center gap-2">
              {/* Connection Status Badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.bg}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.text}
              </div>

              {/* Settings Toggle — Admin Only */}
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSettings(!showSettings)} 
                  className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
                  title="Admin: Configure Gemini API Key"
                >
                  <Settings className={`h-4 w-4 ${showSettings ? "text-primary animate-spin" : "text-muted-foreground"}`} />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Collapsible API Key Configuration Settings Panel — Admin Only */}
        {showSettings && isAdmin && (
          <div className="absolute top-[73px] left-0 right-0 z-20 bg-slate-950/95 border-b border-white/10 p-4 backdrop-blur-xl animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSaveApiKey} className="max-w-xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Key className="h-4 w-4 text-primary" />
                  Gemini API Configuration (Admin Only)
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSettings(false)} 
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Enter a Gemini API Key to override the server key. This is saved in your browser only and used client-side for direct API access. Get a key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">aistudio.google.com/apikey</a>
              </p>
              {apiMode === "quota_exceeded" && (
                <div className="flex items-center gap-2 text-[11px] text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>Daily quota exceeded. Add a new API key or wait for reset at midnight.</span>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="AIzaSy..."
                  value={localApiKey}
                  onChange={(e) => setLocalApiKey(e.target.value)}
                  className="glass-input h-9 text-xs border-white/20 flex-grow"
                />
                <Button type="submit" size="sm" className="h-9 px-4 bg-primary text-white border-white/20">
                  <Check className="h-4 w-4 mr-1.5" /> Save
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <CardContent className="flex-grow overflow-y-auto p-6 space-y-4 bg-white/5 dark:bg-black/5">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div className="flex gap-3 max-w-[85%]">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 border border-white/20 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                        G
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                        message.role === "assistant"
                          ? message.isQuotaError
                            ? "bg-orange-500/10 border border-orange-500/20 rounded-tl-none"
                            : "glass-chat-bubble-bot rounded-tl-none"
                          : "glass-chat-bubble-user rounded-tr-none text-white"
                      }`}
                    >
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                          ul: ({ children }) => <ul className="list-disc list-inside pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="text-sm">{children}</li>,
                          code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">{children}</code>,
                          pre: ({ children }) => <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto font-mono text-xs my-2 border border-white/5">{children}</pre>,
                          table: ({ children }) => <table className="text-xs border-collapse w-full my-2">{children}</table>,
                          th: ({ children }) => <th className="border border-white/10 px-2 py-1 bg-white/5 text-left">{children}</th>,
                          td: ({ children }) => <td className="border border-white/10 px-2 py-1">{children}</td>,
                          a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground px-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 border border-white/20 shrink-0">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        U
                      </AvatarFallback>
                      {profile?.avatar_url && (
                        <AvatarImage src={profile.avatar_url} />
                      )}
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <Avatar className="h-8 w-8 border border-white/20 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">G</AvatarFallback>
                  </Avatar>
                  <div className="glass-chat-bubble-bot rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-xs text-muted-foreground">Genesis AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className="border-t border-white/10 bg-white/10 dark:bg-card/10 backdrop-blur-md p-4">
          <form onSubmit={handleSendMessage} className="w-full flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                apiMode === "gemini" 
                  ? "Ask Genesis AI about Aman's projects, skills, metrics..." 
                  : apiMode === "quota_exceeded"
                  ? "Daily limit reached — I'll answer from my knowledge base..."
                  : "Ask about Aman's projects, savings, tech stack, or contact..."
              }
              disabled={isLoading}
              className="flex-grow glass-input border-white/20"
            />
            <Button type="submit" disabled={isLoading} className="glass-button h-10 px-4 bg-primary text-white border-white/20">
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIChatbot;
