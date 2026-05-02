import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Brain, Globe, Zap, Shield, BarChart3, Search,
  Target, Cpu, Database, TrendingUp, Mail, Eye, Code2,
  Fingerprint, Network, Building, Users, Star, ChevronDown,
  ArrowRight, CheckCircle2, Sparkles, Activity, Lock, Rocket,
  ChevronRight, Play, Clock, LayoutDashboard, GitBranch
} from "lucide-react";

/* ── Animated Counter hook ───────────────────────────── */
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

/* ── Typewriter hook ─────────────────────────────────── */
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx];
    if (!deleting && charIdx <= word.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), speed);
      setDisplayed(word.slice(0, charIdx));
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx > word.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx >= 0) {
      const t = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
      setDisplayed(word.slice(0, charIdx));
      return () => clearTimeout(t);
    }
    if (deleting && charIdx < 0) {
      setDeleting(false);
      setWordIdx(w => (w + 1) % words.length);
      setCharIdx(0);
    }
  }, [charIdx, deleting, wordIdx, words, speed, pause]);
  return displayed;
}

/* ── Data ──────────────────────────────────────────────── */
const FLOATING_ICONS = [
  { Icon: Brain,      top:'10%', left:'6%',   color:'#a78bfa', size:34, dur:5.2, delay:0 },
  { Icon: Globe,      top:'7%',  left:'84%',  color:'#22d3ee', size:28, dur:6.8, delay:0.5 },
  { Icon: Zap,        top:'25%', left:'2%',   color:'#fbbf24', size:22, dur:4.1, delay:0.8 },
  { Icon: Shield,     top:'62%', left:'4%',   color:'#34d399', size:30, dur:7.5, delay:1.2 },
  { Icon: BarChart3,  top:'78%', left:'89%',  color:'#60a5fa', size:24, dur:5.8, delay:0.3 },
  { Icon: Search,     top:'40%', left:'92%',  color:'#f472b6', size:20, dur:4.6, delay:1.0 },
  { Icon: Target,     top:'85%', left:'50%',  color:'#fb923c', size:26, dur:6.2, delay:0.7 },
  { Icon: Cpu,        top:'52%', left:'94%',  color:'#2dd4bf', size:18, dur:5.0, delay:1.5 },
  { Icon: Database,   top:'18%', left:'47%',  color:'#c084fc', size:22, dur:7.1, delay:0.2 },
  { Icon: TrendingUp, top:'80%', left:'14%',  color:'#4ade80', size:20, dur:4.4, delay:0.9 },
  { Icon: Mail,       top:'30%', left:'87%',  color:'#fb7185', size:22, dur:6.5, delay:0.4 },
  { Icon: Eye,        top:'68%', left:'78%',  color:'#38bdf8', size:18, dur:5.5, delay:1.1 },
  { Icon: Code2,      top:'45%', left:'8%',   color:'#fcd34d', size:16, dur:3.9, delay:0.6 },
  { Icon: Fingerprint,top:'14%', left:'63%',  color:'#e879f9', size:20, dur:6.0, delay:1.3 },
  { Icon: Network,    top:'58%', left:'36%',  color:'#67e8f9', size:22, dur:4.9, delay:0.1 },
  { Icon: Activity,   top:'35%', left:'55%',  color:'#a3e635', size:18, dur:5.7, delay:0.8 },
  { Icon: GitBranch,  top:'72%', left:'62%',  color:'#fb923c', size:16, dur:4.3, delay:1.4 },
  { Icon: Lock,       top:'20%', left:'22%',  color:'#818cf8', size:18, dur:6.1, delay:0.3 },
  { Icon: Rocket,     top:'88%', left:'32%',  color:'#f472b6', size:22, dur:5.4, delay:0.6 },
  { Icon: Star,       top:'48%', left:'76%',  color:'#fbbf24', size:16, dur:4.7, delay:1.0 },
];

const OUTPUTS = [
  { icon: Building,    label: "Company Overview",       desc: "Mission, history & leadership",       color: '#a78bfa', grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
  { icon: Target,      label: "Market Position",        desc: "TAM, SAM & competitive slot",         color: '#60a5fa', grad: 'linear-gradient(135deg,#2563eb,#60a5fa)' },
  { icon: Network,     label: "Competitor Mapping",     desc: "3-deep rival intelligence",           color: '#22d3ee', grad: 'linear-gradient(135deg,#0891b2,#22d3ee)' },
  { icon: Star,        label: "Brand Activity",         desc: "Campaigns & creative signals",        color: '#f472b6', grad: 'linear-gradient(135deg,#db2777,#f472b6)' },
  { icon: Globe,       label: "Experiential Footprint", desc: "Events & activations",                color: '#fbbf24', grad: 'linear-gradient(135deg,#d97706,#fbbf24)' },
  { icon: Shield,      label: "Strategic Watchouts",    desc: "GraphRAG™ risk analysis",             color: '#f87171', grad: 'linear-gradient(135deg,#dc2626,#f87171)' },
  { icon: Users,       label: "Decision-Maker Roles",   desc: "Buying committee mapping",            color: '#34d399', grad: 'linear-gradient(135deg,#059669,#34d399)' },
  { icon: Fingerprint, label: "Contact Intelligence",   desc: "Data-protected contact layer",        color: '#818cf8', grad: 'linear-gradient(135deg,#4f46e5,#818cf8)' },
  { icon: Mail,        label: "Personalized Outreach",  desc: "Email, LinkedIn & pixel drafts",      color: '#fb923c', grad: 'linear-gradient(135deg,#ea580c,#fb923c)' },
  { icon: Code2,       label: "Tracking Pixel Logic",   desc: "Intent signal & webhook code",        color: '#67e8f9', grad: 'linear-gradient(135deg,#0e7490,#67e8f9)' },
];

const LOGOS = [
  "Salesforce","HubSpot","Notion","Slack","Linear","Figma","Vercel","Stripe",
  "Intercom","Mixpanel","Amplitude","Segment","Airtable","Loom","Retool","Postman",
];

const TESTIMONIALS = [
  { quote: "Omnisense cuts my prospect research from 3 hours to under 3 minutes. It's like having a full-time analyst on demand.", name: "Sarah Chen", role: "Head of Sales, SaaS Startup", avatar: "SC", color: '#a78bfa' },
  { quote: "The competitor mapping alone is worth 10x the cost. NVIDIA synthesis gives outputs that actually make sense strategically.", name: "Marcus Rivera", role: "VP GTM, Series B Company", avatar: "MR", color: '#22d3ee' },
  { quote: "I send the outreach draft directly. 40% open rate on cold email this quarter. Omnisense is our secret weapon.", name: "Priya Patel", role: "Account Executive", avatar: "PP", color: '#f472b6' },
];

const PRICING = [
  { name: "Starter", price: "Free", desc: "Perfect to explore", color: '#6e6e80', features: ["3 reports / month", "All 10 outputs", "Email outreach draft", "Basic analytics"], cta: "Start Free" },
  { name: "Pro", price: "$29", period: "/mo", desc: "For serious GTM teams", color: '#7c3aed', features: ["Unlimited reports", "Priority AI synthesis", "LinkedIn + pixel drafts", "CSV export", "Team sharing"], cta: "Start Pro", popular: true },
  { name: "Enterprise", price: "Custom", desc: "For your whole revenue org", color: '#06b6d4', features: ["Unlimited seats", "CRM integrations", "API access", "SSO + audit logs", "Dedicated support"], cta: "Contact Sales" },
];

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };

/* ── Component ─────────────────────────────────────────── */
export default function Home() {
  const [, setLocation] = useLocation();
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const count1 = useCounter(10, 1800, statsInView);
  const count2 = useCounter(2, 1500, statsInView);
  const count3 = useCounter(100, 2000, statsInView);
  const count4 = useCounter(5, 1200, statsInView);

  const typeWord = useTypewriter(["Salesforce", "HubSpot", "Notion", "Figma", "Linear", "Stripe"], 90, 2200);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !category.trim()) return;
    setLocation(`/generating?${new URLSearchParams({ company: companyName, category })}`);
  };

  return (
    <div className="flex flex-col w-full" style={{ background: '#030308' }}>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 1 · HERO                                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full min-h-[100vh] flex flex-col items-center justify-center px-6 overflow-hidden">

        {/* Grid background */}
        <div className="absolute inset-0 grid-bg opacity-40" />

        {/* Radial vignette over grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, #030308 100%)' }} />

        {/* Orbs */}
        <motion.div className="orb" style={{ width: 800, height: 800, top: -250, left: -250, background: 'radial-gradient(circle, rgba(124,58,237,0.5), transparent 65%)', y: heroY, opacity: heroOpacity, animation: 'float 10s ease-in-out infinite' }} />
        <motion.div className="orb" style={{ width: 600, height: 600, top: '20%', right: -180, background: 'radial-gradient(circle, rgba(6,182,212,0.32), transparent 65%)', y: heroY, animation: 'drift 13s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 500, height: 500, bottom: -120, left: '35%', background: 'radial-gradient(circle, rgba(236,72,153,0.22), transparent 65%)', animation: 'float-alt 15s ease-in-out infinite 3s' }} />

        {/* Floating icons */}
        {FLOATING_ICONS.map(({ Icon, top, left, color, size, dur, delay }, i) => (
          <motion.div key={i} className="absolute pointer-events-none" style={{ top, left, color, zIndex: 1 }}
            animate={{ y: [0, -16, 5, 0], opacity: [0.1, 0.28, 0.14, 0.1], rotate: [0, 6, -4, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ repeat: Infinity, duration: dur, ease: 'easeInOut', delay }}>
            <Icon size={size} />
          </motion.div>
        ))}

        {/* ── Hero content ── */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10 max-w-[900px] mx-auto text-center">

          {/* Pill badge */}
          <motion.div variants={fadeUp} className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[12px] font-[700] tracking-wider"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd' }}>
              <Sparkles size={12} />
              POWERED BY NVIDIA minimax-m2.7 · GRAPHRAG™ · REAL-TIME RECON
            </div>
          </motion.div>

          {/* H1 — word-by-word animation */}
          <motion.h1 variants={fadeUp} className="text-[68px] sm:text-[82px] font-[900] leading-[1.0] tracking-[-2.5px] mb-6">
            <span style={{ color: 'rgba(255,255,255,0.95)' }}>Know Every Account.</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #c4b5fd 0%, #818cf8 30%, #22d3ee 70%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% 200%', animation: 'gradient-shift 5s ease infinite' }}>
              Close Every Deal.
            </span>
          </motion.h1>

          {/* Typewriter sub */}
          <motion.p variants={fadeUp} className="text-[20px] font-[400] max-w-[580px] mx-auto leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Deep B2B intelligence on{" "}
            <span className="font-[700]" style={{ color: '#c4b5fd' }}>{typeWord}<span style={{ borderRight: '2px solid #a78bfa', marginLeft: 1, animation: 'pulse-glow 1s ease-in-out infinite' }}>&nbsp;</span></span>
            {" "}in under 2 minutes.
          </motion.p>

          {/* CTA row */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 mb-12">
            <motion.button
              onClick={() => document.getElementById("recon-form")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary !text-[16px] !py-4 !px-8"
              whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(124,58,237,0.65)' }}
              whileTap={{ scale: 0.96 }}
            >
              <Rocket size={18} /> Deploy Your First Swarm — Free
            </motion.button>
            <button onClick={() => setLocation("/history")} className="btn-ghost !text-[15px]">
              <Play size={14} /> See Live Demo
            </button>
          </motion.div>

          {/* Social proof micro-bar */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mb-16 flex-wrap">
            {[
              { icon: CheckCircle2, text: "No credit card required", color: '#34d399' },
              { icon: Zap, text: "Results in under 2 minutes", color: '#fbbf24' },
              { icon: Lock, text: "Zero hallucination guarantee", color: '#a78bfa' },
            ].map(({ icon: Icon, text, color }, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <Icon size={14} style={{ color }} /> {text}
              </div>
            ))}
          </motion.div>

          {/* Product mockup preview */}
          <motion.div variants={fadeUp} className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-x-[-20%] top-4 bottom-[-10%] pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(124,58,237,0.2), transparent 70%)', filter: 'blur(30px)' }} />

            <div className="relative glass-card-glow p-6 max-w-[820px] mx-auto text-left"
              style={{ boxShadow: '0 0 0 1px rgba(124,58,237,0.2), 0 40px 120px rgba(0,0,0,0.8)' }}>

              {/* Mock title bar */}
              <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                  </div>
                  <span className="text-[13px] font-[600]" style={{ color: 'rgba(255,255,255,0.35)' }}>omnisense · intelligence-report</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 6px #34d399', animation: 'pulse-glow 2s infinite' }} />
                  <span className="text-[11px]" style={{ color: '#34d399' }}>LIVE</span>
                </div>
              </div>

              {/* Mock report content */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "COMPANY OVERVIEW", icon: Building, color: '#a78bfa', lines: [85, 70, 90, 60] },
                  { label: "COMPETITOR MAP", icon: Network, color: '#22d3ee', lines: [75, 85, 65, 80] },
                  { label: "OUTREACH DRAFT", icon: Mail, color: '#f472b6', lines: [90, 60, 75, 70] },
                ].map(({ label, icon: Icon, color, lines }, i) => (
                  <motion.div key={i} className="glass-card p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon size={12} style={{ color }} />
                      <span className="text-[10px] font-[700] tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                    </div>
                    <div className="space-y-2">
                      {lines.map((w, li) => (
                        <motion.div key={li} className="h-1.5 rounded-full" style={{ background: `${color}25` }}
                          initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ delay: 1.0 + i * 0.15 + li * 0.08, duration: 0.6 }} />
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
                      <span className="text-[10px]" style={{ color }}>AI Synthesized</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-3 mt-4">
                {OUTPUTS.slice(3).map(({ icon: Icon, label, color }, i) => (
                  <motion.div key={i} className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 + i * 0.06 }}>
                    <Icon size={12} style={{ color }} />
                    <span className="text-[10px] font-[600] truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}>
          <span className="text-[10px] tracking-widest" style={{ color: 'rgba(255,255,255,0.18)' }}>SCROLL</span>
          <ChevronDown size={15} style={{ color: 'rgba(255,255,255,0.18)' }} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 2 · LOGO MARQUEE                                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="py-14 relative overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
        <p className="text-center section-label mb-8">Powering intelligence at fast-moving companies</p>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="mx-10 flex items-center gap-2 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(124,58,237,0.5)' }} />
                <span className="text-[15px] font-[700] whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.25)' }}>{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 3 · STATS COUNTERS                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative py-24 px-6 overflow-hidden">
        <div className="orb" style={{ width: 700, height: 700, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 65%)' }} />
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {[
            { count: count1, suffix: '', label: 'Intelligence Outputs', sub: 'per report', color: '#a78bfa', icon: LayoutDashboard },
            { count: count2, suffix: 'min', label: 'Average Generation', sub: 'start to finish', color: '#22d3ee', icon: Clock },
            { count: count3, suffix: '%', label: 'Accuracy Rate', sub: 'zero hallucinations', color: '#34d399', icon: CheckCircle2 },
            { count: count4, suffix: '', label: 'Live Web Sources', sub: 'per synthesis run', color: '#f472b6', icon: Globe },
          ].map(({ count, suffix, label, sub, color, icon: Icon }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card-glow p-8 text-center" whileHover={{ scale: 1.04 }} style={{ cursor: 'default' }}>
              <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="text-[52px] font-[900] leading-none mb-2" style={{ background: `linear-gradient(135deg, ${color}, white)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {count}{suffix}
              </div>
              <div className="text-[14px] font-[700] mb-1" style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</div>
              <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 4 · FEATURE ALTERNATING SECTIONS                          */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* Feature A */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.018)' }}>
        <div className="orb" style={{ width: 500, height: 500, top: -100, left: -100, background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 65%)', animation: 'float 12s ease-in-out infinite' }} />
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-[700] tracking-wider" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd' }}>
              <Search size={12} /> STEP 01 · LIVE RECON
            </div>
            <h2 className="text-[44px] font-[900] leading-tight tracking-[-1.5px] mb-5">
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>Five parallel searches.</span><br />
              <span className="gradient-text">One unified signal.</span>
            </h2>
            <p className="text-[17px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Our swarm dispatches five simultaneous DuckDuckGo queries — website, news, competitors, LinkedIn, and market data — combining everything into a structured knowledge graph before AI synthesis begins.
            </p>
            <div className="space-y-3">
              {["Corporate website + press releases", "Competitor signals & market moves", "LinkedIn profiles & team intel", "Brand campaigns & creative activity", "Financial indicators & analyst mentions"].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={16} style={{ color: '#34d399', flexShrink: 0 }} />
                  <span className="text-[15px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div className="glass-card-glow p-8 feature-highlight">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)' }}>
                  <Brain size={18} style={{ color: '#a78bfa' }} />
                </div>
                <span className="text-[14px] font-[700]" style={{ color: 'rgba(255,255,255,0.7)' }}>Research Swarm · Active</span>
                <div className="ml-auto w-2 h-2 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 6px #34d399', animation: 'pulse-glow 2s infinite' }} />
              </div>
              <div className="space-y-3">
                {["Crawling corporate website...", "Extracting competitor signals...", "Mapping LinkedIn profiles...", "Analyzing brand campaigns...", "Synthesizing market data..."].map((log, i) => (
                  <motion.div key={i} className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15 }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ['#a78bfa','#22d3ee','#f472b6','#fbbf24','#34d399'][i] }} />
                    <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{log}</span>
                    <div className="ml-auto text-[11px] font-[700]" style={{ color: ['#a78bfa','#22d3ee','#f472b6','#fbbf24','#34d399'][i] }}>✓</div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 2.5, ease: 'easeOut', delay: 0.5 }} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature B */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="orb" style={{ width: 500, height: 500, top: -80, right: -120, background: 'radial-gradient(circle, rgba(6,182,212,0.18), transparent 65%)', animation: 'drift 14s ease-in-out infinite' }} />
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="order-2 lg:order-1">
            <div className="glass-card-glow p-8 feature-highlight">
              <div className="text-[12px] font-[700] mb-4" style={{ color: '#22d3ee', letterSpacing: '0.1em' }}>NVIDIA minimax-m2.7 · SYNTHESIS</div>
              <pre className="text-[12px] leading-relaxed overflow-hidden" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', maxHeight: 220 }}>
                <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
{`{
  "companyOverview": "Notion is a collaborative
    workspace platform...",
  "marketPosition": "Dominant in SMB productivity,
    expanding enterprise...",
  "competitorMapping": [
    { "name": "Coda", "strengths": "..." },
    { "name": "Confluence", "gaps": "..." }
  ],
  "strategicWatchouts": "AI tab competition
    from Microsoft Copilot...",
  "outreach": {
    "emailSubject": "Quick idea for Notion...",`}
                </motion.span>
              </pre>
              <div className="mt-4 pt-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-[11px] font-[700] px-2.5 py-1 rounded-full" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#22d3ee' }}>GraphRAG™ Applied</div>
                <div className="text-[11px] font-[700] px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>Zero Hallucination</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-[700] tracking-wider" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)', color: '#22d3ee' }}>
              <Brain size={12} /> STEP 02 · AI SYNTHESIS
            </div>
            <h2 className="text-[44px] font-[900] leading-tight tracking-[-1.5px] mb-5">
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>NVIDIA-powered.</span><br />
              <span className="gradient-text-green">Hallucination-free.</span>
            </h2>
            <p className="text-[17px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
              minimax-m2.7 processes 4,096 tokens of raw intelligence through GraphRAG — a retrieval-augmented generation layer that grounds every output in actual search data, not model memory.
            </p>
            <div className="space-y-3">
              {["4,096 token synthesis window", "GraphRAG grounding on every output", "Structured JSON — no hallucinations", "Sub-2 minute end-to-end runtime"].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={16} style={{ color: '#22d3ee', flexShrink: 0 }} />
                  <span className="text-[15px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 5 · 10 OUTPUTS GRID                                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'rgba(255,255,255,0.018)' }}>
        <div className="orb" style={{ width: 600, height: 600, bottom: -200, right: -150, background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent 65%)', animation: 'drift 16s ease-in-out infinite' }} />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="section-label mb-4">Everything you need to win the account</p>
            <h2 className="text-[52px] font-[900] leading-tight tracking-[-1.5px]">
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>10 outputs.</span>{" "}
              <span className="gradient-text">One prompt.</span>
            </h2>
            <p className="text-[18px] mt-4 max-w-[500px] mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              From company overview to ready-to-send outreach — everything your revenue team needs, instantly.
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {OUTPUTS.map(({ icon: Icon, label, desc, color, grad }, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card-glow p-5" whileHover={{ scale: 1.05, y: -4 }} transition={{ type: 'spring', stiffness: 320 }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}16`, border: `1px solid ${color}38` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="text-[13px] font-[700] mb-1 leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>{label}</div>
                <div className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</div>
                <div className="mt-4 h-[2px] rounded-full" style={{ background: grad, opacity: 0.55 }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 6 · HOW IT WORKS                                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="max-w-[1000px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <p className="section-label mb-4">How Omnisense Works</p>
            <h2 className="text-[52px] font-[900] leading-tight tracking-[-1.5px]">
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>From prompt</span>{" "}
              <span className="gradient-text">to pipeline-ready</span><br />
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>in 3 steps.</span>
            </h2>
          </motion.div>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-[52px] left-[16.5%] right-[16.5%] h-px hidden md:block" style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.5), rgba(6,182,212,0.5), rgba(16,185,129,0.5))' }} />
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { num: '01', title: 'Enter Target', desc: 'Type any company name and category. That\'s all the context we need to begin.', icon: Search, color: '#a78bfa' },
                { num: '02', title: 'Swarm Deploys', desc: '5 parallel DuckDuckGo agents collect real-time intelligence across the web in seconds.', icon: Brain, color: '#22d3ee' },
                { num: '03', title: 'Collect Intel', desc: 'NVIDIA synthesizes 10 structured outputs — ready for your CRM, outreach stack, or board deck.', icon: Zap, color: '#34d399' },
              ].map(({ num, title, desc, icon: Icon, color }, i) => (
                <motion.div key={i} variants={fadeUp} className="relative text-center">
                  <div className="w-[104px] h-[104px] rounded-full mx-auto mb-6 flex items-center justify-center relative" style={{ background: `${color}12`, border: `2px solid ${color}40` }}>
                    <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${color}20`, transform: 'scale(1.2)' }} />
                    <div className="text-[32px] font-[900]" style={{ background: `linear-gradient(135deg, ${color}, white)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{num}</div>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Icon size={16} style={{ color }} />
                    <h3 className="text-[20px] font-[800]" style={{ color: 'rgba(255,255,255,0.95)' }}>{title}</h3>
                  </div>
                  <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 7 · TESTIMONIALS                                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: 'rgba(124,58,237,0.04)' }}>
        <div className="orb" style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 65%)' }} />
        <div className="max-w-[1100px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="section-label mb-4">What GTM teams say</p>
            <h2 className="text-[48px] font-[900] leading-tight tracking-[-1.5px]">
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>Real teams.</span>{" "}
              <span className="gradient-text-warm">Real wins.</span>
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, role, avatar, color }, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card-glow p-8" whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 280 }}>
                <div className="flex mb-4 gap-1">
                  {[...Array(5)].map((_, si) => <Star key={si} size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />)}
                </div>
                <p className="text-[16px] leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>"{quote}"</p>
                <div className="flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-[800]" style={{ background: `${color}20`, border: `1px solid ${color}40`, color }}>
                    {avatar}
                  </div>
                  <div>
                    <div className="text-[14px] font-[700]" style={{ color: 'rgba(255,255,255,0.9)' }}>{name}</div>
                    <div className="text-[12px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 8 · PRICING                                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="orb" style={{ width: 700, height: 700, top: '30%', left: -200, background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 65%)', animation: 'drift 18s ease-in-out infinite' }} />
        <div className="max-w-[1000px] mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="section-label mb-4">Simple Pricing</p>
            <h2 className="text-[52px] font-[900] leading-tight tracking-[-1.5px]">
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>Start free.</span>{" "}
              <span className="gradient-text">Scale fearlessly.</span>
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PRICING.map(({ name, price, period, desc, color, features, cta, popular }, i) => (
              <motion.div key={i} variants={fadeUp} className={`glass-card-glow p-8 relative ${popular ? 'md:-mt-4 md:-mb-4' : ''}`}
                style={{ borderColor: popular ? `rgba(124,58,237,0.4)` : undefined, boxShadow: popular ? '0 0 60px rgba(124,58,237,0.2)' : undefined }}
                whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-[12px] font-[800] text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>MOST POPULAR</span>
                  </div>
                )}
                <div className="text-[13px] font-[700] mb-3" style={{ color }}>{name.toUpperCase()}</div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-[52px] font-[900] leading-none" style={{ color: 'rgba(255,255,255,0.95)' }}>{price}</span>
                  {period && <span className="text-[16px] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{period}</span>}
                </div>
                <p className="text-[14px] mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
                <div className="space-y-3 mb-8">
                  {features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-3">
                      <CheckCircle2 size={15} style={{ color, flexShrink: 0 }} />
                      <span className="text-[14px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => document.getElementById("recon-form")?.scrollIntoView({ behavior: "smooth" })}
                  className={popular ? "btn-primary w-full !py-3.5" : "btn-ghost w-full !py-3.5"}
                  style={!popular ? { justifyContent: 'center' } : {}}
                >
                  {cta} <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 9 · BOTTOM CTA + FORM                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section id="recon-form" className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="orb" style={{ width: 700, height: 700, top: -150, left: -150, background: 'radial-gradient(circle, rgba(124,58,237,0.35), transparent 60%)', animation: 'float 11s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 600, height: 600, bottom: -150, right: -100, background: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 60%)', animation: 'drift 14s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 400, height: 400, top: '40%', right: '30%', background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent 65%)', animation: 'float-alt 16s ease-in-out infinite 2s' }} />

        <div className="relative z-10 max-w-[680px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-[12px] font-[700] tracking-wider" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd' }}>
              <Sparkles size={12} /> FREE TO START · NO CREDIT CARD
            </div>
            <h2 className="text-[58px] font-[900] leading-[1.0] tracking-[-2px] mb-5">
              <span style={{ color: 'rgba(255,255,255,0.95)' }}>Deploy your first</span><br />
              <span style={{ background: 'linear-gradient(135deg, #c4b5fd, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>intelligence swarm.</span>
            </h2>
            <p className="text-[18px] mb-12" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Enter any company. Get 10 structured B2B intelligence outputs in under 2 minutes.
            </p>

            <motion.div className="glass-card-glow p-10 text-left" style={{ boxShadow: '0 0 100px rgba(124,58,237,0.18), 0 50px 100px rgba(0,0,0,0.6)' }}>
              <form onSubmit={handleGenerate} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[12px] font-[700] mb-2 tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>TARGET COMPANY</label>
                  <input type="text" placeholder="e.g. Notion, Salesforce, Stripe..." value={companyName} onChange={e => setCompanyName(e.target.value)} className="glass-input" required />
                </div>
                <div>
                  <label className="block text-[12px] font-[700] mb-2 tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>CATEGORY / INDUSTRY</label>
                  <input type="text" placeholder="e.g. B2B SaaS, Fintech, Healthcare..." value={category} onChange={e => setCategory(e.target.value)} className="glass-input" required />
                </div>

                <motion.button type="submit" className="btn-primary w-full !py-5 !text-[17px] !font-[800] mt-2"
                  whileHover={{ scale: 1.03, boxShadow: '0 0 70px rgba(124,58,237,0.7)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Rocket size={20} /> Deploy Intelligence Swarm
                </motion.button>
              </form>
              <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                {["Free to start", "~2 min results", "Zero hallucinations"].map((t, i) => (
                  <span key={i} className="text-[12px] flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    <CheckCircle2 size={11} style={{ color: '#34d399' }} /> {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 10 · FOOTER                                               */}
      {/* ══════════════════════════════════════════════════════════ */}
      <footer className="relative py-16 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="gradient-text text-[20px] font-[900] tracking-tight mb-3">OMNISENSE</div>
              <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>B2B intelligence engine. Real-time recon + NVIDIA AI synthesis.</p>
              <div className="flex gap-2 mt-4">
                {["10 Outputs", "NVIDIA AI", "GraphRAG™"].map((t, i) => (
                  <span key={i} className="text-[10px] font-[700] px-2 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>{t}</span>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "How it Works", "Pricing", "Changelog"] },
              { title: "Intelligence", links: ["Company Reports", "Competitor Maps", "Outreach Drafts", "Tracking Pixels"] },
              { title: "Company", links: ["About", "Blog", "Privacy", "Terms"] },
            ].map(({ title, links }, i) => (
              <div key={i}>
                <div className="text-[12px] font-[700] tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>{title.toUpperCase()}</div>
                <div className="space-y-2.5">
                  {links.map((link, li) => (
                    <div key={li} className="text-[14px] cursor-pointer transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}>{link}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.18)' }}>© {new Date().getFullYear()} Omnisense Intelligence Engine. All rights reserved.</p>
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.18)' }}>Powered by DuckDuckGo Search · NVIDIA minimax-m2.7 · GraphRAG™</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
