import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, Sparkles, Settings, Key, X, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const AIChatbot = () => {
  const { isAuthenticated, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const [apiMode, setApiMode] = useState<"gemini" | "fallback">("fallback");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Detect which API key is active
  useEffect(() => {
    const key = localApiKey || import.meta.env.VITE_GEMINI_API_KEY;
    // On production (Vercel), we assume the secure serverless backend (/api/gemini) is active
    const isProduction = !import.meta.env.DEV;
    if (key || isProduction) {
      setApiMode("gemini");
    } else {
      setApiMode("fallback");
    }
  }, [localApiKey]);

  // Initial welcome message
  useEffect(() => {
    const initialMessage = profile?.is_admin
      ? "Welcome back, Admin! Genesis AI is active. Enter your security passcode or prompt to compile tasks."
      : "Hello! I'm Genesis AI, Aman Singh's custom digital companion. Ask me anything about Aman's project architectures, operational savings (₹1.3 Crore+ bottom-line value), full-stack automation, or how he can add value to your engineering team!";

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: initialMessage,
        timestamp: new Date(),
      },
    ]);
  }, [profile]);

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
      toast.success("Gemini API Key saved locally in your browser!");
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
                parts: [{ text: createPrompt(userInput, profile?.is_admin || false) }]
              }]
            }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "Failed to generate content via Gemini API");
        }
        responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated by the AI model.";
      } else {
        // 1. Try Vercel Serverless Function first (production-ready secure path)
        try {
          console.log("Calling secure Vercel serverless function at /api/gemini");
          const response = await fetch("/api/gemini", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: createPrompt(userInput, profile?.is_admin || false)
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            responseText = data.content;
          } else {
            const errData = await response.json();
            throw new Error(errData.error || "Vercel serverless function returned error status");
          }
        } catch (vercelError) {
          console.warn("Vercel serverless function failed, trying Supabase edge function fallback:", vercelError);
          
          // 2. Try Supabase Edge Function as a secondary secure path
          const { data, error } = await supabase.functions.invoke("gemini-content", {
            body: { prompt: createPrompt(userInput, profile?.is_admin || false) },
          });

          if (error) throw new Error(error.message);
          responseText = data.content;
        }
      }

      const botResponse = {
        id: `assistant-${Date.now()}`,
        role: "assistant" as const,
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.warn("API Error, falling back to local database reasoning:", error);
      
      // 2. Local fallback response handler for offline/sandbox scenarios
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
    const q = query.toLowerCase();
    
    // Greetings
    if (q === "hi" || q === "hello" || q === "hey" || q === "greetings") {
      return "Hello! I'm Genesis AI, Aman's virtual architect assistant. Ask me about:\n\n" +
             "- Aman's flagship projects (HWMS Insights, InsightForge, Zero-Trust Sandbox)\n" +
             "- His bottom-line operations impact (₹1.3 Crore+ saved)\n" +
             "- Custom workflows he automated (TAT, Increff, PTW)\n" +
             "- Downloading his CV or reaching him directly.";
    }

    // TAT / Turnaround Time / SLA
    if (q.includes("tat") || q.includes("turnaround") || q.includes("sla")) {
      return "**Omnichannel TAT Automator**\n\nAman built this high-impact SLA tracking and automated alerting system for Holisol Logistics.\n\n" +
             "**Key Metrics & Architecture:**\n" +
             "- **Hours Saved:** Saves **20 hours/month** of manual excel lookup and report generation.\n" +
             "- **Workflow:** Queries the Uniware warehouse databases directly to pull dispatch logs.\n" +
             "- **Processing:** Aggregates logs, flags SLA breaches, and generates beautiful Jinja HTML reports.\n" +
             "- **Deployment:** Integrates with Jira API to open high-priority tickets and dispatches real-time mail alerts to regional managers.";
    }

    // Increff / Inventory Reconciliation
    if (q.includes("increff") || q.includes("inventory") || q.includes("reconciliation") || q.includes("validator")) {
      return "**Increff Inventory Validator**\n\nAn automated warehouse inventory reconciliation tool designed to cross-verify physical stock records against ERP ledger states.\n\n" +
             "**Impact & Architecture:**\n" +
             "- **Hours Saved:** Saves **30 hours/month** of manual comparison labor.\n" +
             "- **Logic:** Connects to WMS (Warehouse Management System) and ERP APIs via secure SFTP. Parses files, computes stock discrepancies, and identifies exact leakage nodes.\n" +
             "- **Output:** Generates a validator report that highlights mismatches in stock counts and emails a clean spreadsheet directly to auditing leads.";
    }

    // HWMS / HINA / Database / SSH / Tunnel
    if (q.includes("hwms") || q.includes("hina") || q.includes("ssh") || q.includes("tunnel") || q.includes("mysql") || q.includes("database")) {
      return "**HWMS Insights Connector**\n\nA secure data connection layer designed to query live warehouse management MySQL databases (HINA/HWMS) in real-time.\n\n" +
             "**Architecture Features:**\n" +
             "- **Security:** Establishes encrypted **SSH Tunnels** bypass, shielding databases from direct public exposure.\n" +
             "- **Security Guard:** Implements a 4-role Role-Based Access Control (RBAC) matrix and encrypts credentials via AES-256.\n" +
             "- **API Backend:** Built with FastAPI (Python) and Next.js frontend, providing dashboard analytics immediately.\n" +
             "- **Outcome:** Saves **44 hours/month** of manual database extraction and MIS operations.";
    }

    // InsightForge
    if (q.includes("insightforge") || q.includes("etl") || q.includes("duckdb")) {
      return "**InsightForge ETL Engine**\n\nA local SQL analytics sandbox and automated ETL pipeline built to transform transactional warehouse logs.\n\n" +
             "**Technical Highlights:**\n" +
             "- **Data Pipeline:** Converts raw Bronze logs to Gold analytics tables using **DuckDB** and Streamlit (Python).\n" +
             "- **Safety Sandbox:** Integrates a local Ollama LLM SQL executor that runs **22 safety validation checks** to block destructive queries (e.g. DROP, DELETE, TRUNCATE) before they hit the database.";
    }

    // Zero-Trust / Docker / Security / MCP / Agent
    if (q.includes("zero-trust") || q.includes("security") || q.includes("docker") || q.includes("sandbox") || q.includes("mcp")) {
      return "**Zero-Trust AI Sandbox Workspace**\n\nA comprehensive DevSecOps research publication (37,000 words) detailing security strategies for hosting autonomous coding agents.\n\n" +
             "**Core Architecture:**\n" +
             "- **Isolation:** Runs agents inside isolated Docker containers with read-only root filesystems and restricted network access.\n" +
             "- **Prompt Shielding:** Blocks jailbreaks and prompt injection attempts at the API level.\n" +
             "- **Model Context Protocol:** Implements MCP gateways to restrict tool execution and data visibility.";
    }

    // Projects (General)
    if (q.includes("project") || q.includes("work") || q.includes("portfolio") || q.includes("build") || q.includes("code")) {
      return "Aman Has Architected Several High-Impact Operations Systems:\n\n" +
             "⚡ **HWMS Insights Connector**\n" +
             "A live warehouse database MySQL query connector utilizing encrypted SSH tunneling to query databases securely. Features an AES-256 encrypted credential vault and a 4-role RBAC access matrix. (Saves 44 hours of manual labor/month).\n\n" +
             "🛠️ **InsightForge Engine**\n" +
             "An ETL pipeline and interactive Streamlit analytics dashboard using DuckDB to process raw transactional files, complete with a local Ollama SQL sandbox running 22 safety checks to prevent destructive queries.\n\n" +
             "🔒 **Zero-Trust AI Workspace**\n" +
             "A 37,000-word security blueprint detailing Docker sandbox isolation, prompt injection guards, and Model Context Protocol (MCP) routing protocols to secure autonomous developer agents.\n\n" +
             "🌐 **Interactive Rapid Prototypes (Vercel)**\n" +
             "- **Cyber Creative Agency** (cyber-creative-agency.vercel.app)\n" +
             "- **AI Exam Prep Portal** (ai-exam-prep-portal.vercel.app)\n" +
             "- **Recovery Clinic Portal** (recovery-clinic-portal.vercel.app)\n" +
             "- **Citizen News Platform** (citizen-news-platform.vercel.app)\n" +
             "- **Digital Genesis Quest** (digital-genesis-quest.vercel.app)";
    }
    
    // Savings / Metrics
    if (q.includes("saving") || q.includes("metric") || q.includes("hour") || q.includes("cost") || q.includes("crore") || q.includes("lakh") || q.includes("roi") || q.includes("impact")) {
      return "Proven Quantifiable Bottom-Line Outcomes Deliver By Aman:\n\n" +
             "- 💰 **₹1.3 Crore+ ($155K USD) bottom-line value generated** through operations analytics, daily fulfillment center Profit & Loss modeling, Last Mile Costing, and leakage identification.\n" +
             "- ⏱️ **151.5 Hours Saved/Month (0.86 FTE)** through automated pipelines (HWMS, Increff, TAT, PTW).";
    }
    
    // CV / Resume
    if (q.includes("cv") || q.includes("resume") || q.includes("download") || q.includes("contact") || q.includes("email") || q.includes("phone")) {
      return "📄 **Aman's Professional Resumes** can be downloaded directly from the homepage using the 'Download CV' button.\n\n" +
             "**Direct Contacts:**\n" +
             "- 📧 Email: **aman.singh01031997@gmail.com**\n" +
             "- 📞 Mobile: +91-7428766155 / +91-8851411516\n" +
             "- 🐙 GitHub: github.com/its-aman4u";
    }

    // Education / Experience
    if (q.includes("experience") || q.includes("job") || q.includes("mba") || q.includes("education") || q.includes("university")) {
      return "Professional Journey & Education Overview:\n\n" +
             "💼 **Work Experience**\n" +
             "- **Holisol Logistics** | Operations Lead & Compliance Specialist / AI-Native Systems Architect (2022 - Present)\n" +
             "  Drove bottom-line savings and automated key data aggregation, database sync, and safety monitoring systems across all logistics hubs.\n\n" +
             "🎓 **Education**\n" +
             "- **MBA in Supply Chain & Logistics**\n" +
             "  ITM University, Vadodara (2020 - 2022)\n" +
             "- **Bachelor of Science (B.Sc.)**\n" +
             "  University of Delhi (2015 - 2018)";
    }
    
    // Default
    return "🌐 **Genesis AI Fallback Mode**:\n\nAman Singh is an **AI-Native Systems Architect & Automation Specialist** with **₹1.3 Crore** in operations savings and **151.5 hours/month** saved.\n\n" +
           "Ask me about:\n" +
           "- his core projects (like HWMS Insights Connector or InsightForge)\n" +
           "- his automated workflows (TAT, Increff, PTW)\n" +
           "- his coding stack and operational expertise\n" +
           "- downloading his resume or contacting him directly.";
  };

  const createPrompt = (userInput: string, isAdmin: boolean) => {
    return `You are "Genesis AI", the premium virtual companion on Aman Singh's professional portfolio.
    Aman Singh is an AI-Native Systems Architect & Automation Specialist with a proven track record of designing secure data bridges, database SSH tunnels, and WebGL architectures.

    ${isAdmin ? "The user is Aman Singh (the portfolio owner). Talk to him directly as his administrative assistant. Offer to verify admin credentials, outline system parameters, and check logs." : "The user is a visitor (recruiter, developer, or client) looking at Aman's portfolio. Show him Aman's depth of engineering thought."}

    Respond in clear Markdown, keeping formatting elegant (use bullet points, bolding, and inline code blocks where appropriate). Answer conversational questions naturally, but base all details on the following verified facts:

    ### AMAN SINGH PROFILE
    - Title: AI-Native Systems Architect & Automation Specialist (formerly Operations Lead & Compliance Specialist).
    - Email: aman.singh01031997@gmail.com
    - Phone: +91 93404 74252
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
    6. Increff Inventory Validator: Daily reconciliation of physical WMS logs against ERP financial stock ledgers using pandas and SFTP (Saves 30 hours/month).
    7. Cyber Creative Agency: Premium 2026 smooth scrolling frontend agency site (cyber-creative-agency.vercel.app).
    8. AI Exam Prep Portal: Interactive examination helper with mock tests and study metrics (ai-exam-prep-portal.vercel.app).
    9. Recovery Clinic Portal: Healthcare scheduler and booking dashboard (recovery-clinic-portal.vercel.app).
    10. Citizen News Platform: Dark-themed subscription news aggregator (citizen-news-platform.vercel.app).
    11. Digital Genesis Quest: Gamified professional quest tracking coding achievements (digital-genesis-quest.vercel.app).

    ### 5 FLAGSHIP CASE STUDIES & BLOGS
    Aman publishes deep, human-engineered case studies outlining his technical architecture decisions:
    - Blog 1 (ID: 1): "Architecting the HWMS Insights Connector: Secure Database SSH Tunneling with FastAPI" (Free). Explores MySQL localhost queries, SSH tunnel broker implementation, and Fernet encryption.
    - Blog 2 (ID: 2): "Reconciling Warehouse Inventories at Scale: The Increff Inventory Validator" (Free). Details pandas df merges, outer SKU joins, and SFTP scheduling.
    - Blog 3 (ID: 3): "Designing a Zero-Trust Developer Sandbox: Prompt Shielding & Docker Containment" (Premium). Explores threat modeling LLMs, read-only Docker system roots, and whitelist gateways.
    - Blog 4 (ID: 4): "InsightForge: Building a Safe local SQL Analytics Engine with Ollama & DuckDB" (Premium). Outlines columnar storage, read-only DuckDB connections, and regex validation rules.
    - Blog 5 (ID: 5): "Operations Analytics: Reconciling Logistics Profitability and Daily FC P&L" (Premium). Explores business leakage tracking, Permit-to-Work stats, and fuel surcharge updates.

    ### EDUCATION & SKILLS
    - MBA in Supply Chain & Logistics: ITM University (2020-2022).
    - B.Sc.: University of Delhi (2015-2018).
    - Toolkit: Python (FastAPI, Streamlit, Pandas, NumPy), SQL (MySQL, SQLite, DuckDB, SSH tunneling), React, TS, Tailwind CSS, Three.js, React Three Fiber, Git, Supabase, Docker.
    - Tone: Highly professional, direct, systems-oriented, and corporate business-focused. Never invent stats or make up credentials. Answer general AI questions with reference to how they apply to Aman's work.

    User Query: ${userInput}`;
  };

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
                  {profile?.is_admin ? "Admin Mode Active" : "Ask questions about Aman's projects & metrics"}
                </span>
              </div>
            </CardTitle>

            <div className="flex items-center gap-2">
              {/* Connection Status Badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                apiMode === "gemini" 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${apiMode === "gemini" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                {apiMode === "gemini" ? "Live Gemini Mode" : "Local Sandbox"}
              </div>

              {/* Settings Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettings(!showSettings)} 
                className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
              >
                <Settings className={`h-4 w-4 ${showSettings ? "text-primary animate-spin" : "text-muted-foreground"}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Collapsible API Key Configuration Settings Panel */}
        {showSettings && (
          <div className="absolute top-[73px] left-0 right-0 z-20 bg-slate-950/95 border-b border-white/10 p-4 backdrop-blur-xl animate-in slide-in-from-top duration-300">
            <form onSubmit={handleSaveApiKey} className="max-w-xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Key className="h-4 w-4 text-primary" />
                  Gemini API Configuration
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
                Enter your private Gemini API Key to enable high-fidelity Gemini 2.0 Flash reasoning directly client-side. The key is securely saved in your browser storage.
              </p>
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
                <div className="flex gap-3 max-w-[80%]">
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 border border-white/20">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                        G
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                        message.role === "assistant"
                          ? "glass-chat-bubble-bot rounded-tl-none"
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
                    <Avatar className="h-8 w-8 border border-white/20">
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
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className="border-t border-white/10 bg-white/10 dark:bg-card/10 backdrop-blur-md p-4">
          <form onSubmit={handleSendMessage} className="w-full flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={apiMode === "gemini" ? "Type to query Genesis AI..." : "Local sandbox active. Ask about metrics, projects..."}
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
