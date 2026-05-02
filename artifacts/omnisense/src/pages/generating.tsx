import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateIntelligence, getListReportsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Brain, Globe, Shield, Search, Zap } from "lucide-react";

const LOG_LINES = [
  "Initializing Intelligence Swarm...",
  "Dispatching DuckDuckGo crawl agents...",
  "Scraping corporate website and press releases...",
  "Extracting competitor signal data...",
  "Building real-time Knowledge Graph...",
  "Mapping competitor nodes and overlap vectors...",
  "Querying NVIDIA minimax-m2.7 synthesis engine...",
  "Applying Zero-Hallucination contact guardrails...",
  "Synthesizing Strategic Watchouts via GraphRAG...",
  "Drafting personalized outreach sequences...",
  "Generating tracking pixel and webhook logic...",
  "Running final intelligence validation pass...",
];

const LOG_COLORS = [
  '#a78bfa', '#60a5fa', '#22d3ee', '#34d399',
  '#a78bfa', '#f472b6', '#60a5fa', '#fbbf24',
  '#a78bfa', '#22d3ee', '#34d399', '#a78bfa',
];

const FLOATING_ICONS = [
  { Icon: Brain, style: { top: '15%', left: '8%', color: '#a78bfa' }, duration: 4.5 },
  { Icon: Globe, style: { top: '70%', left: '6%', color: '#22d3ee' }, duration: 6 },
  { Icon: Shield, style: { top: '20%', right: '8%', color: '#34d399' }, duration: 5.2 },
  { Icon: Search, style: { top: '75%', right: '7%', color: '#f472b6' }, duration: 4.8 },
  { Icon: Zap, style: { top: '50%', left: '3%', color: '#fbbf24' }, duration: 3.8 },
];

export default function Generating() {
  const [, setLocation] = useLocation();
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const queryClient = useQueryClient();
  const generateMutation = useGenerateIntelligence();
  const mutateRef = useRef(generateMutation.mutate);
  mutateRef.current = generateMutation.mutate;

  const hasStarted = useRef(false);
  const mutationDoneRef = useRef(false);
  const companyNameRef = useRef<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    companyNameRef.current = searchParams.get("company") || "Target";
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (mutationDoneRef.current) { clearInterval(interval); return; }
      setVisibleLogs((prev) => {
        if (i < LOG_LINES.length) {
          const next = [...prev, LOG_LINES[i]];
          i++;
          return next;
        }
        return prev;
      });
      setProgress((p) => Math.min(p + (100 / LOG_LINES.length), 95));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    const searchParams = new URLSearchParams(window.location.search);
    const companyName = searchParams.get("company");
    const category = searchParams.get("category");
    if (!companyName || !category) { setLocation("/"); return; }

    mutateRef.current(
      { data: { companyName, category } },
      {
        onSuccess: (report) => {
          mutationDoneRef.current = true;
          setIsComplete(true);
          setProgress(100);
          queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
          const id = (report as unknown as { id: number }).id;
          setTimeout(() => { setLocation(id ? `/report/${id}` : "/history"); }, 2000);
        },
        onError: () => {
          mutationDoneRef.current = true;
          setVisibleLogs((prev) => [...prev, "ERROR: Swarm deployment failed. Check API connectivity."]);
          setTimeout(() => setLocation("/"), 3000);
        },
      }
    );
  }, [setLocation, queryClient]);

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#050510', minHeight: '80vh' }}>

      {/* Orbs */}
      <div className="orb" style={{ width: 600, height: 600, top: -150, left: -150, background: 'radial-gradient(circle, rgba(124,58,237,0.4), transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 400, height: 400, top: '20%', right: -80, background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)', animation: 'drift 10s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 300, height: 300, bottom: -50, left: '40%', background: 'radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)', animation: 'float-alt 12s ease-in-out infinite' }} />

      {/* Floating icons */}
      {FLOATING_ICONS.map(({ Icon, style, duration }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ ...style, opacity: 0.2 }}
          animate={{ y: [0, -14, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
        >
          <Icon size={28} />
        </motion.div>
      ))}

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[600px]"
      >
        <div className="glass-card-glow p-10" style={{ boxShadow: '0 0 80px rgba(124,58,237,0.2), 0 40px 80px rgba(0,0,0,0.5)' }}>

          {/* Spinner or check */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-[88px] h-[88px] mb-6">
              {isComplete ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className="w-full h-full flex items-center justify-center">
                  <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.5)' }}>
                    <CheckCircle2 className="w-10 h-10" style={{ color: '#34d399' }} />
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Outer spinning ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'conic-gradient(from 0deg, transparent 0%, #7c3aed 40%, #06b6d4 70%, transparent 100%)', padding: 3 }}
                  >
                    <div className="w-full h-full rounded-full" style={{ background: '#050510' }} />
                  </motion.div>
                  {/* Inner pulse */}
                  <div className="absolute inset-[6px] rounded-full flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
                    <span className="text-[16px] font-[800] gradient-text">
                      {companyNameRef.current.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  {/* Ping */}
                  <div className="absolute inset-0 rounded-full" style={{ border: '1px solid rgba(124,58,237,0.3)', animation: 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                </>
              )}
            </div>

            <motion.h1
              className="text-[32px] font-[800] text-center mb-3"
              style={{ background: isComplete ? 'linear-gradient(135deg, #34d399, #22d3ee)' : 'linear-gradient(135deg, #a78bfa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {isComplete ? "Intelligence Ready" : "Deploying Swarm"}
            </motion.h1>

            <div className="px-4 py-1.5 rounded-full text-[13px] font-[600]" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', color: '#a78bfa' }}>
              {companyNameRef.current}
            </div>
          </div>

          {/* Log lines */}
          <div className="h-[180px] overflow-y-auto mb-6 space-y-3 pr-2">
            <AnimatePresence>
              {visibleLogs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: log.startsWith("ERROR") ? '#ef4444' : LOG_COLORS[index % LOG_COLORS.length] }} />
                  <span className="text-[14px] leading-relaxed" style={{ color: log.startsWith("ERROR") ? '#f87171' : 'rgba(255,255,255,0.55)' }}>
                    {log}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb, #06b6d4)', boxShadow: '0 0 10px rgba(124,58,237,0.6)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut', duration: 0.5 }}
            />
          </div>

          <p className="text-center text-[12px] mt-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
            This takes 1–2 minutes. Powered by NVIDIA minimax-m2.7
          </p>
        </div>
      </motion.div>
    </div>
  );
}
