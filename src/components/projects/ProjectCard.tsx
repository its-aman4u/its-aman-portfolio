import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from 'lucide-react';

export interface Project {
  title: string;
  description: string;
  status: string;
  image: string;
  tech: string[];
  link: string;
  github: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectArchitectureSVG = ({ title, hovered }: { title: string; hovered: boolean }) => {
  const t = title.toLowerCase();

  // Unified gradient defs for high-end glass looks
  const renderDefs = () => (
    <defs>
      <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="pink-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#be185d" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="teal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0f766e" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="amber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#b45309" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#0e7490" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="indigo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#4338ca" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="rose-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#be123c" stopOpacity="0.3" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  );

  // Render blueprint background grids
  const renderGrid = () => (
    <>
      <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.08" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </>
  );

  if (t.includes("cyber creative")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g className="transition-transform duration-700" style={{ transform: `translate(0, ${hovered ? '-5px' : '0px'})` }}>
          {/* Base Layer */}
          <polygon 
            points="40,165 160,110 280,165 160,220" 
            fill="url(#blue-grad)" 
            stroke="#60a5fa" 
            strokeWidth="1.5"
            strokeOpacity="0.6"
            className="transition-all duration-500 ease-out"
            style={{ transform: `translateY(${hovered ? '12px' : '0px'})` }}
          />
          <text x="160" y="170" fill="#93c5fd" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold" style={{ transform: `translateY(${hovered ? '12px' : '0px'})` }}>React + Vite Core</text>

          {/* Middle Layer */}
          <polygon 
            points="40,115 160,60 280,115 160,170" 
            fill="url(#purple-grad)" 
            stroke="#c084fc" 
            strokeWidth="1.5"
            strokeOpacity="0.6"
            className="transition-all duration-500 ease-out"
            style={{ transform: `translateY(${hovered ? '-2px' : '0px'})` }}
          />
          <text x="160" y="120" fill="#c084fc" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold" style={{ transform: `translateY(${hovered ? '-2px' : '0px'})` }}>Framer Motion</text>

          {/* Top Layer */}
          <polygon 
            points="40,65 160,10 280,65 160,120" 
            fill="url(#pink-grad)" 
            stroke="#f472b6" 
            strokeWidth="1.5"
            strokeOpacity="0.8"
            className="transition-all duration-500 ease-out"
            style={{ transform: `translateY(${hovered ? '-15px' : '0px'})` }}
          />
          <text x="160" y="70" fill="#f472b6" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold" style={{ transform: `translateY(${hovered ? '-15px' : '0px'})` }}>Glassmorphic UI</text>
        </g>
      </svg>
    );
  }

  if (t.includes("exam prep")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g className="transition-transform duration-500">
          {/* Connector Paths */}
          <path d="M 60 110 L 130 110" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 170 110 L 250 75" stroke="#f472b6" strokeWidth="2" />
          <path d="M 170 110 L 250 145" stroke="#60a5fa" strokeWidth="2" />
          
          {/* Node 1: Student UI */}
          <circle cx="60" cy="110" r="25" fill="url(#purple-grad)" stroke="#c084fc" strokeWidth="2" />
          <text x="60" y="113" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">UI</text>
          
          {/* Node 2: Adaptive Engine */}
          <circle cx="150" cy="110" r="30" fill="url(#pink-grad)" stroke="#f472b6" strokeWidth="2" />
          <text x="150" y="113" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">AI Agent</text>
          
          {/* Node 3: Gemini API */}
          <circle cx="260" cy="70" r="22" fill="url(#blue-grad)" stroke="#60a5fa" strokeWidth="1.5" />
          <text x="260" y="73" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">Gemini</text>
          
          {/* Node 4: Analytics */}
          <circle cx="260" cy="150" r="22" fill="url(#teal-grad)" stroke="#2dd4bf" strokeWidth="1.5" />
          <text x="260" y="153" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">Stats</text>

          {/* Glowing pulse on hover */}
          {hovered && (
            <circle cx="150" cy="110" r="38" stroke="#f472b6" strokeWidth="1" strokeOpacity="0.4" fill="none">
              <animate attributeName="r" values="30;45;30" dur="2s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      </svg>
    );
  }

  if (t.includes("recovery clinic")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        {/* Calendar Grid Representation */}
        <g className="transition-transform duration-500" style={{ transform: hovered ? 'scale(1.03)' : 'scale(1)' }}>
          <rect x="40" y="30" width="160" height="120" rx="10" fill="url(#teal-grad)" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="40" y1="65" x2="200" y2="65" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.3" />
          
          {/* Calendar boxes */}
          <rect x="55" y="80" width="25" height="20" rx="4" fill="white" fillOpacity="0.05" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.2" />
          <rect x="90" y="80" width="25" height="20" rx="4" fill="white" fillOpacity="0.05" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.2" />
          {/* Glowing Booked Box */}
          <rect x="125" y="80" width="25" height="20" rx="4" fill="#10b981" fillOpacity="0.4" stroke="#10b981" strokeWidth="1.5" filter="url(#glow)" />
          <rect x="160" y="80" width="25" height="20" rx="4" fill="white" fillOpacity="0.05" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.2" />
          
          <rect x="55" y="110" width="25" height="20" rx="4" fill="white" fillOpacity="0.05" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.2" />
          <rect x="90" y="110" width="25" height="20" rx="4" fill="white" fillOpacity="0.05" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.2" />
          <rect x="125" y="110" width="25" height="20" rx="4" fill="white" fillOpacity="0.05" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.2" />
          <rect x="160" y="110" width="25" height="20" rx="4" fill="white" fillOpacity="0.05" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.2" />

          {/* Database Cylindrical sync */}
          <path d="M 230 80 C 230 70, 270 70, 270 80 L 270 130 C 270 140, 230 140, 230 130 Z" fill="url(#emerald-grad)" stroke="#10b981" strokeWidth="1.5" />
          <path d="M 230 80 C 230 90, 270 90, 270 80" fill="none" stroke="#10b981" strokeWidth="1.5" />
          <path d="M 230 95 C 230 105, 270 105, 270 95" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
          <path d="M 230 110 C 230 120, 270 120, 270 110" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.5" />
          
          {/* Sync arrows */}
          <path d="M 205 95 C 215 95, 215 115, 225 115" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 3" />
          
          <text x="120" y="50" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Clinic Booking UI</text>
          <text x="250" y="155" fill="#10b981" fontSize="9" fontFamily="monospace" textAnchor="middle">Supabase DB</text>
        </g>
      </svg>
    );
  }

  if (t.includes("citizen news")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g>
          {/* Scraping feeds */}
          <rect x="30" y="45" width="70" height="22" rx="4" fill="white" fillOpacity="0.05" stroke="#10b981" strokeWidth="1" />
          <text x="65" y="58" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle">RSS Feed</text>

          <rect x="30" y="85" width="70" height="22" rx="4" fill="white" fillOpacity="0.05" stroke="#10b981" strokeWidth="1" />
          <text x="65" y="98" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle">Web Scrapers</text>

          <rect x="30" y="125" width="70" height="22" rx="4" fill="white" fillOpacity="0.05" stroke="#10b981" strokeWidth="1" />
          <text x="65" y="138" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle">Apps Script</text>

          {/* Database hub */}
          <path d="M 155 70 C 155 60, 195 60, 195 70 L 195 130 C 195 140, 155 140, 155 130 Z" fill="url(#emerald-grad)" stroke="#10b981" strokeWidth="1.5" />
          <text x="175" y="150" fill="#a7f3d0" fontSize="8" fontFamily="monospace" textAnchor="middle">Supabase</text>

          {/* Stripe portal */}
          <rect x="235" y="70" width="60" height="25" rx="5" fill="url(#purple-grad)" stroke="#c084fc" strokeWidth="1.2" />
          <text x="265" y="85" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">Stripe</text>

          {/* Portal client UI */}
          <rect x="235" y="115" width="60" height="25" rx="5" fill="url(#teal-grad)" stroke="#2dd4bf" strokeWidth="1.2" />
          <text x="265" y="130" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">Portal UI</text>

          {/* Lines */}
          <path d="M 100 56 L 155 90" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 100 96 L 155 100" stroke="#10b981" strokeWidth="1" />
          <path d="M 100 136 L 155 110" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M 195 90 L 235 82" stroke="#c084fc" strokeWidth="1.5" />
          <path d="M 195 110 L 235 127" stroke="#2dd4bf" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (t.includes("digital genesis")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g>
          {/* Dotted progression track */}
          <path d="M 40 150 Q 100 80, 160 140 T 280 80" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Key checkpoints */}
          <circle cx="40" cy="150" r="10" fill="url(#amber-grad)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="40" y="175" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">2022 MBA</text>
          
          <circle cx="120" cy="108" r="10" fill="url(#amber-grad)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="120" y="93" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">Ops Lead</text>
          
          <circle cx="200" cy="128" r="10" fill="url(#amber-grad)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="200" y="150" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle">AI Systems</text>
          
          <circle cx="280" cy="80" r="14" fill="url(#rose-grad)" stroke="#f43f5e" strokeWidth="2" filter="url(#glow)" />
          <text x="280" y="62" fill="#f43f5e" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">GENESIS</text>

          {/* Animating hover player */}
          {hovered && (
            <circle cx="160" cy="140" r="6" fill="#f43f5e">
              <animateMotion dur="3s" repeatCount="indefinite" path="M 40 150 Q 100 80, 160 140 T 280 80" />
            </circle>
          )}
        </g>
      </svg>
    );
  }

  if (t.includes("hwms insights")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g>
          {/* client */}
          <rect x="30" y="70" width="60" height="50" rx="8" fill="url(#cyan-grad)" stroke="#06b6d4" strokeWidth="1.5" />
          <text x="60" y="100" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">Next.js UI</text>
          
          {/* SSH Tunnel Pipe */}
          <rect x="110" y="85" width="100" height="20" rx="4" fill="white" fillOpacity="0.05" stroke="#0ea5e9" strokeWidth="1" />
          <path d="M 110 95 L 210 95" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5 5" />
          
          {/* Lock icon representing security */}
          <rect x="145" y="75" width="30" height="15" rx="3" fill="#0369a1" stroke="#0ea5e9" strokeWidth="1" />
          <text x="160" y="86" fill="#ffffff" fontSize="8" fontFamily="sans-serif" textAnchor="middle">🔒</text>
          
          {/* MySQL DB */}
          <path d="M 230 70 C 230 60, 280 60, 280 70 L 280 120 C 280 130, 230 130, 230 120 Z" fill="url(#teal-grad)" stroke="#14b8a6" strokeWidth="1.5" />
          <path d="M 230 70 C 230 80, 280 80, 280 70" fill="none" stroke="#14b8a6" strokeWidth="1.5" />
          <text x="255" y="100" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">MySQL DB</text>

          {/* Data packet animation on hover */}
          {hovered && (
            <circle cx="0" cy="0" r="4" fill="#22d3ee">
              <animateMotion dur="2s" repeatCount="indefinite" path="M 90 95 L 230 95" />
            </circle>
          )}

          <text x="160" y="135" fill="#06b6d4" fontSize="9" fontFamily="monospace" textAnchor="middle">Encrypted SSH Tunnel</text>
        </g>
      </svg>
    );
  }

  if (t.includes("insightforge")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g>
          {/* Column 1: Bronze logs */}
          <rect x="30" y="40" width="70" height="110" rx="6" fill="white" fillOpacity="0.05" stroke="#6366f1" strokeWidth="1" />
          <text x="65" y="60" fill="#a5b4fc" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Bronze</text>
          <line x1="40" y1="75" x2="90" y2="75" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="40" y1="95" x2="80" y2="95" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="40" y1="115" x2="90" y2="115" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.3" />

          {/* Engine: DuckDB */}
          <rect x="125" y="60" width="70" height="70" rx="8" fill="url(#indigo-grad)" stroke="#4338ca" strokeWidth="1.5" />
          <text x="160" y="95" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DuckDB</text>
          <text x="160" y="108" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle">ETL Engine</text>

          {/* Column 3: Gold dashboard */}
          <rect x="220" y="40" width="70" height="110" rx="6" fill="white" fillOpacity="0.05" stroke="#60a5fa" strokeWidth="1" />
          <text x="255" y="60" fill="#93c5fd" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Gold</text>
          <line x1="230" y1="75" x2="280" y2="75" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="230" y1="95" x2="270" y2="95" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.3" />
          <circle cx="255" cy="120" r="12" fill="#3b82f6" fillOpacity="0.3" stroke="#60a5fa" strokeWidth="1" />

          {/* Ollama Shield */}
          <g className="transition-transform duration-500" style={{ transform: hovered ? 'translateY(-5px)' : 'translateY(0)' }}>
            <polygon points="160,150 180,165 180,185 160,195 140,185 140,165" fill="url(#rose-grad)" stroke="#f43f5e" strokeWidth="1" />
            <text x="160" y="176" fill="#ffffff" fontSize="7" fontFamily="sans-serif" textAnchor="middle">🛡️</text>
            <text x="160" y="208" fill="#f43f5e" fontSize="7" fontFamily="monospace" textAnchor="middle">Ollama Guard</text>
          </g>

          {/* Arrows */}
          <path d="M 100 95 L 125 95" stroke="#6366f1" strokeWidth="1.5" />
          <path d="M 195 95 L 220 95" stroke="#60a5fa" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (t.includes("zero-trust")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g>
          {/* Docker Outer Container */}
          <rect x="40" y="30" width="240" height="150" rx="12" fill="white" fillOpacity="0.02" stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 4" />
          <text x="160" y="22" fill="#f43f5e" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Secure Docker Sandbox</text>
          
          {/* Shield barrier */}
          <path d="M 70 80 Q 160 40, 250 80 L 250 120 Q 160 160, 70 120 Z" fill="url(#rose-grad)" fillOpacity="0.1" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.4" />
          
          {/* Agent Core */}
          <circle cx="160" cy="100" r="30" fill="url(#rose-grad)" stroke="#f43f5e" strokeWidth="2" filter="url(#glow)" />
          <text x="160" y="103" fill="#ffffff" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AI Agent</text>
          
          <text x="160" y="145" fill="#fca5a5" fontSize="8" fontFamily="monospace" textAnchor="middle">MCP Shield Guard</text>
          <text x="160" y="160" fill="#fca5a5" fontSize="7" fontFamily="monospace" textAnchor="middle">22 Automated Safety Tests</text>

          {/* Orbiting particles on hover */}
          {hovered && (
            <circle cx="160" cy="100" r="45" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 9" fill="none">
              <animateTransform attributeName="transform" type="rotate" from="0 160 100" to="360 160 100" dur="8s" repeatCount="indefinite" />
            </circle>
          )}
        </g>
      </svg>
    );
  }

  if (t.includes("omnichannel tat")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g>
          {/* database */}
          <path d="M 40 70 C 40 60, 80 60, 80 70 L 80 120 C 80 130, 40 130, 40 120 Z" fill="url(#amber-grad)" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="60" y="100" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">Uniware</text>

          {/* processing gear */}
          <g className="transition-all duration-1000" style={{ transform: hovered ? 'rotate(90deg)' : 'rotate(0deg)', transformOrigin: '160px 95px' }}>
            <circle cx="160" cy="95" r="25" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="10 5" />
            <circle cx="160" cy="95" r="15" fill="url(#amber-grad)" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="160" y="98" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">ETL</text>
          </g>

          {/* Email dispatch */}
          <rect x="230" y="80" width="50" height="30" rx="4" fill="url(#cyan-grad)" stroke="#06b6d4" strokeWidth="1.2" />
          <path d="M 230 80 L 255 98 L 280 80" stroke="#ffffff" strokeWidth="1.5" />
          <text x="255" y="125" fill="#06b6d4" fontSize="8" fontFamily="monospace" textAnchor="middle">Jira Mailer</text>

          {/* Links */}
          <path d="M 90 95 L 125 95" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M 195 95 L 225 95" stroke="#06b6d4" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (t.includes("ptw")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g>
          {/* Request Form */}
          <rect x="30" y="70" width="50" height="60" rx="4" fill="white" fillOpacity="0.05" stroke="#06b6d4" strokeWidth="1.5" />
          <line x1="40" y1="85" x2="70" y2="85" stroke="#06b6d4" strokeWidth="1" />
          <line x1="40" y1="100" x2="65" y2="100" stroke="#06b6d4" strokeWidth="1" />
          <line x1="40" y1="115" x2="70" y2="115" stroke="#06b6d4" strokeWidth="1" />
          <text x="55" y="145" fill="#06b6d4" fontSize="8" fontFamily="monospace" textAnchor="middle">Permit UI</text>

          {/* Approver Loop */}
          <circle cx="155" cy="100" r="25" fill="url(#cyan-grad)" stroke="#06b6d4" strokeWidth="1.5" />
          <text x="155" y="103" fill="#ffffff" fontSize="8" fontFamily="monospace" textAnchor="middle">Auditing</text>

          {/* Validated Checkmark */}
          <circle cx="255" cy="100" r="20" fill="url(#emerald-grad)" stroke="#10b981" strokeWidth="1.5" filter="url(#glow)" />
          <path d="M 247 100 L 252 105 L 265 92" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="255" y="135" fill="#10b981" fontSize="8" fontFamily="monospace" textAnchor="middle">Approved</text>

          {/* Connectors */}
          <path d="M 85 100 L 125 100" stroke="#06b6d4" strokeWidth="1.5" />
          <path d="M 185 100 L 230 100" stroke="#10b981" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (t.includes("increff")) {
    return (
      <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        {renderDefs()}
        {renderGrid()}
        <g>
          {/* Overlapping Circles */}
          <circle cx="110" cy="100" r="45" fill="url(#emerald-grad)" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.5" />
          <text x="90" y="100" fill="#a7f3d0" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">WMS</text>
          
          <circle cx="170" cy="100" r="45" fill="url(#teal-grad)" fillOpacity="0.25" stroke="#14b8a6" strokeWidth="1.5" />
          <text x="190" y="100" fill="#99f6e4" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ERP</text>
          
          {/* Discrepancy node in intersection */}
          {hovered && (
            <circle cx="140" cy="100" r="10" fill="#f43f5e" stroke="#f43f5e" strokeWidth="1" filter="url(#glow)">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}
          {!hovered && (
            <circle cx="140" cy="100" r="8" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
          )}
          <text x="140" y="125" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Diff</text>

          {/* Arrow to report */}
          <path d="M 140 135 L 140 170" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x="110" y="170" width="60" height="20" rx="3" fill="#047857" stroke="#10b981" strokeWidth="1" />
          <text x="140" y="182" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle">Excel Report</text>
        </g>
      </svg>
    );
  }

  // Fallback beautiful network grid
  return (
    <svg className="w-full h-full min-h-[250px]" viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {renderDefs()}
      {renderGrid()}
      <circle cx="160" cy="100" r="30" fill="url(#blue-grad)" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" />
      <text x="160" y="104" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Core Engine</text>
    </svg>
  );
};

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [hovered, setHovered] = useState(false);

  // Status mapping for visual accents
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Production":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Completed":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div 
      className="project-card-detailed glass-card overflow-hidden animate-fade-in transition-all duration-300 hover:shadow-xl hover:border-white/30"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Advanced SVG Architecture Diagram */}
        <div className="h-64 md:h-auto min-h-[250px] bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
          <ProjectArchitectureSVG title={project.title} hovered={hovered} />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
        </div>
        
        {/* Right Side: Contents */}
        <div className="p-8 flex flex-col justify-between bg-black/10 dark:bg-black/20">
          <div>
            <h2 className="text-2xl font-bold mb-3 text-foreground tracking-tight">{project.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {project.description}
            </p>
            
            <div className="mb-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span 
                    key={i} 
                    className="bg-white/5 dark:bg-white/5 border border-white/10 text-muted-foreground px-2.5 py-0.5 rounded-full text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm" className="flex-1 glass-button border-white/20 hover:bg-white/5" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Code Architecture
              </a>
            </Button>
            {project.link && project.link !== "#" && (
              <Button size="sm" className="flex-1 bg-primary text-white border border-white/20 shadow-md hover:bg-primary/95" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Live System
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
