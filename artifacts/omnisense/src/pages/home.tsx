import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Brain, Globe, Zap, Shield, BarChart3, Search,
  Target, Cpu, Database, TrendingUp, Mail, Eye, Code2,
  Fingerprint, Network, Building, Users, Star, ChevronDown
} from "lucide-react";

const FLOATING_ICONS = [
  { Icon: Brain,       top: '12%',  left: '7%',   color: '#a78bfa', size: 32, dur: 5.2 },
  { Icon: Globe,       top: '8%',   left: '82%',  color: '#22d3ee', size: 28, dur: 6.8 },
  { Icon: Zap,         top: '28%',  left: '3%',   color: '#fbbf24', size: 24, dur: 4.1 },
  { Icon: Shield,      top: '65%',  left: '5%',   color: '#34d399', size: 30, dur: 7.5 },
  { Icon: BarChart3,   top: '75%',  left: '88%',  color: '#60a5fa', size: 26, dur: 5.8 },
  { Icon: Search,      top: '42%',  left: '91%',  color: '#f472b6', size: 22, dur: 4.6 },
  { Icon: Target,      top: '88%',  left: '48%',  color: '#fb923c', size: 28, dur: 6.2 },
  { Icon: Cpu,         top: '55%',  left: '95%',  color: '#2dd4bf', size: 20, dur: 5.0 },
  { Icon: Database,    top: '20%',  left: '48%',  color: '#c084fc', size: 26, dur: 7.1 },
  { Icon: TrendingUp,  top: '82%',  left: '15%',  color: '#4ade80', size: 22, dur: 4.4 },
  { Icon: Mail,        top: '32%',  left: '85%',  color: '#fb7185', size: 24, dur: 6.5 },
  { Icon: Eye,         top: '70%',  left: '75%',  color: '#38bdf8', size: 20, dur: 5.5 },
  { Icon: Code2,       top: '48%',  left: '10%',  color: '#fcd34d', size: 18, dur: 3.9 },
  { Icon: Fingerprint, top: '15%',  left: '62%',  color: '#e879f9', size: 22, dur: 6.0 },
  { Icon: Network,     top: '60%',  left: '38%',  color: '#67e8f9', size: 24, dur: 4.9 },
];

const FEATURES = [
  { icon: Building,    label: "Company Overview",      desc: "Mission, history & leadership",    color: '#a78bfa', grad: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  { icon: Target,      label: "Market Position",       desc: "TAM, SAM & competitive slot",      color: '#60a5fa', grad: 'linear-gradient(135deg, #2563eb, #60a5fa)' },
  { icon: Network,     label: "Competitor Mapping",    desc: "3-deep rival intelligence",        color: '#22d3ee', grad: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
  { icon: Star,        label: "Brand Activity",        desc: "Campaigns & creative signals",     color: '#f472b6', grad: 'linear-gradient(135deg, #db2777, #f472b6)' },
  { icon: Globe,       label: "Experiential Footprint",desc: "Events, activations & presence",   color: '#fbbf24', grad: 'linear-gradient(135deg, #d97706, #fbbf24)' },
  { icon: Shield,      label: "Strategic Watchouts",   desc: "GraphRAG™ risk analysis",          color: '#f87171', grad: 'linear-gradient(135deg, #dc2626, #f87171)' },
  { icon: Users,       label: "Decision-Maker Roles",  desc: "Buying committee mapping",         color: '#34d399', grad: 'linear-gradient(135deg, #059669, #34d399)' },
  { icon: Fingerprint, label: "Contact Intelligence",  desc: "Data-protected contact layer",     color: '#818cf8', grad: 'linear-gradient(135deg, #4f46e5, #818cf8)' },
  { icon: Mail,        label: "Personalized Outreach", desc: "Email, LinkedIn & pixel drafts",   color: '#fb923c', grad: 'linear-gradient(135deg, #ea580c, #fb923c)' },
  { icon: Code2,       label: "Tracking Pixel Logic",  desc: "Intent signal & webhook code",     color: '#67e8f9', grad: 'linear-gradient(135deg, #0e7490, #67e8f9)' },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };

export default function Home() {
  const [, setLocation] = useLocation();
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !category.trim()) return;
    const params = new URLSearchParams({ company: companyName, category });
    setLocation(`/generating?${params.toString()}`);
  };

  return (
    <div className="flex flex-col w-full" style={{ background: '#050510' }}>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TILE 1 — HERO                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[100vh] flex flex-col items-center justify-center px-6 overflow-hidden">

        {/* Orbs */}
        <div className="orb" style={{ width: 700, height: 700, top: -200, left: -200, background: 'radial-gradient(circle, rgba(124,58,237,0.45), transparent 65%)', animation: 'float 9s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 550, height: 550, top: '25%', right: -150, background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent 65%)', animation: 'drift 11s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 450, height: 450, bottom: -100, left: '30%', background: 'radial-gradient(circle, rgba(236,72,153,0.25), transparent 65%)', animation: 'float-alt 13s ease-in-out infinite 2s' }} />

        {/* Floating icons */}
        {FLOATING_ICONS.map(({ Icon, top, left, color, size, dur }, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ top, left, color, zIndex: 1 }}
            animate={{ y: [0, -14, 4, 0], opacity: [0.12, 0.3, 0.18, 0.12], rotate: [0, 5, -3, 0] }}
            transition={{ repeat: Infinity, duration: dur, ease: 'easeInOut', delay: i * 0.3 }}
          >
            <Icon size={size} />
          </motion.div>
        ))}

        {/* Hero content */}
        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-[820px] mx-auto text-center space-y-8">

          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-[600] tracking-wider"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#a78bfa', boxShadow: '0 0 6px #a78bfa', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              AI-POWERED · REAL-TIME · ZERO HALLUCINATION
            </div>
          </motion.div>

          <motion.h1 variants={item} className="text-[64px] sm:text-[72px] font-[800] leading-[1.05] tracking-[-1.5px]"
            style={{ background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 40%, #22d3ee 80%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            B2B Intelligence,<br />Instantly.
          </motion.h1>

          <motion.p variants={item} className="text-[20px] font-[400] max-w-[520px] mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.52)' }}>
            Enter a company. Deploy the swarm. Get 10 structured intelligence outputs in minutes.
          </motion.p>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button onClick={() => document.getElementById("recon-form")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary">
              <Zap className="h-4 w-4" /> Deploy Swarm
            </button>
            <button onClick={() => setLocation("/history")} className="btn-ghost">
              View Archive
            </button>
          </motion.div>

          {/* Mini preview cards */}
          <motion.div variants={item} className="pt-8 grid grid-cols-3 gap-4 max-w-[640px] mx-auto">
            {[
              { label: "COMPANY OVERVIEW", icon: Building, color: '#a78bfa' },
              { label: "COMPETITOR MAP", icon: Network, color: '#22d3ee' },
              { label: "OUTREACH DRAFT", icon: Mail, color: '#f472b6' },
            ].map(({ label, icon: Icon, color }, i) => (
              <motion.div
                key={i}
                className="glass-card p-4 text-left"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3 + i, ease: 'easeInOut', delay: i * 0.6 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={14} style={{ color }} />
                  <span className="text-[10px] font-[700] tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: '80%', background: `${color}30` }} />
                  <div className="h-1.5 rounded-full" style={{ width: '60%', background: `${color}20` }} />
                  <div className="h-1.5 rounded-full" style={{ width: '70%', background: `${color}15` }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <span className="text-[11px] tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>SCROLL</span>
          <ChevronDown size={16} style={{ color: 'rgba(255,255,255,0.2)' }} />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TILE 2 — FEATURES GRID                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full px-6 py-[100px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.018)' }}>

        <div className="orb" style={{ width: 500, height: 500, top: -100, right: -100, background: 'radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)', animation: 'drift 14s ease-in-out infinite' }} />

        <div className="max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="section-label mb-4">10 Intelligence Outputs</p>
            <h2 className="text-[48px] font-[800] leading-tight tracking-[-1px]"
              style={{ background: 'linear-gradient(135deg, #fff 30%, #a78bfa 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Every signal.<br />Zero guesswork.
            </h2>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc, color, grad }, i) => (
              <motion.div
                key={i}
                variants={item}
                className="glass-card-glow p-5 cursor-default"
                whileHover={{ scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="text-[13px] font-[700] mb-1 leading-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>{label}</div>
                <div className="text-[12px] leading-snug" style={{ color: 'rgba(255,255,255,0.38)' }}>{desc}</div>
                <div className="mt-3 h-[2px] rounded-full" style={{ background: grad, opacity: 0.6 }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TILE 3 — HOW IT WORKS                                  */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full px-6 py-[100px] overflow-hidden" style={{ background: '#050510' }}>

        <div className="orb" style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 65%)' }} />

        <div className="max-w-[1100px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="section-label mb-4">How It Works</p>
            <h2 className="text-[48px] font-[800] leading-tight tracking-[-1px] text-white">
              Real search.<br />
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AI synthesis.</span>
            </h2>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Live Web Recon', desc: 'Five parallel DuckDuckGo searches extract real-time corporate intelligence, competitor data, and brand signals.', icon: Search, color: '#a78bfa', grad: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
              { num: '02', title: 'NVIDIA Synthesis', desc: 'minimax-m2.7 processes 4096 tokens of structured intelligence, applying GraphRAG for zero-hallucination accuracy.', icon: Brain, color: '#22d3ee', grad: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
              { num: '03', title: 'Structured Output', desc: '10 battle-ready intelligence outputs ready for your CRM, outreach stack, and go-to-market motion.', icon: Zap, color: '#34d399', grad: 'linear-gradient(135deg, #059669, #34d399)' },
            ].map(({ num, title, desc, icon: Icon, color, grad }, i) => (
              <motion.div key={i} variants={item} className="glass-card-glow p-8" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 280 }}>
                <div className="text-[52px] font-[900] mb-4 leading-none" style={{ background: grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', opacity: 0.9 }}>
                  {num}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <h3 className="text-[18px] font-[700]" style={{ color: 'rgba(255,255,255,0.95)' }}>{title}</h3>
                </div>
                <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TILE 4 — FORM                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section id="recon-form" className="relative w-full px-6 py-[100px] overflow-hidden" style={{ background: 'rgba(124,58,237,0.04)' }}>

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div className="orb" style={{ width: 500, height: 500, bottom: -100, left: -100, background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', animation: 'float 10s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 400, height: 400, top: -80, right: -80, background: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)', animation: 'drift 12s ease-in-out infinite' }} />

        <div className="relative z-10 max-w-[620px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card-glow p-10 text-center"
            style={{ boxShadow: '0 0 80px rgba(124,58,237,0.15), 0 40px 80px rgba(0,0,0,0.5)' }}
          >
            <p className="section-label mb-4">Mission Control</p>
            <h2 className="text-[44px] font-[800] leading-tight tracking-[-1px] mb-3 gradient-text">
              Initiate Recon
            </h2>
            <p className="text-[17px] mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Enter target parameters to deploy the intelligence swarm.
            </p>

            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Company name (e.g. Notion, Salesforce...)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="glass-input"
                required
              />
              <input
                type="text"
                placeholder="Category / Industry (e.g. B2B SaaS, Fintech...)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input"
                required
              />
              <motion.button
                type="submit"
                className="btn-primary w-full !py-4 !text-[16px] !font-[700] mt-2"
                whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(124,58,237,0.6)' }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="h-5 w-5" /> Deploy Intelligence Swarm
              </motion.button>
            </form>

            <p className="text-[12px] mt-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Powered by DuckDuckGo Search + NVIDIA minimax-m2.7 · 1–2 min
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-6 py-12 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="gradient-text text-[18px] font-[800] tracking-tight mb-3">OMNISENSE</div>
        <p className="text-[13px] mb-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
          10 AI Outputs · Real-Time Data · NVIDIA Powered
        </p>
        <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.15)' }}>
          © {new Date().getFullYear()} Omnisense Intelligence Engine
        </p>
      </footer>

    </div>
  );
}
