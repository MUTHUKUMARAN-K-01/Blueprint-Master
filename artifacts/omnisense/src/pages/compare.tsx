import { useListReports, useGetReport } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown, ArrowRightLeft, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Compare() {
  const { data: reports, isLoading: isLoadingList } = useListReports();
  const [report1Id, setReport1Id] = useState<number | null>(null);
  const [report2Id, setReport2Id] = useState<number | null>(null);

  const { data: r1Data } = useGetReport(report1Id as number, { query: { enabled: !!report1Id, queryKey: ['/api/reports', report1Id] as any } });
  const { data: r2Data } = useGetReport(report2Id as number, { query: { enabled: !!report2Id, queryKey: ['/api/reports', report2Id] as any } });

  const r1 = r1Data?.report;
  const r2 = r2Data?.report;

  return (
    <div className="min-h-[100dvh] flex flex-col w-full pb-24" style={{ background: '#050510' }}>

      {/* Orbs */}
      <div className="orb" style={{ width: 500, height: 500, top: -100, left: -100, background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', animation: 'float 10s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 400, height: 400, top: '30%', right: -80, background: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)', animation: 'drift 12s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 300, height: 300, bottom: 100, left: '40%', background: 'radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)', animation: 'float-alt 14s ease-in-out infinite' }} />

      {/* Hero */}
      <section className="relative z-10 w-full px-6 pt-20 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="section-label mb-4">Side-by-Side Analysis</p>
          <h1 className="text-[52px] font-[800] leading-tight mb-4 gradient-text">
            Compare Intelligence
          </h1>
          <p className="text-[18px] mb-12" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Select two reports to reveal intelligence differentials.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-[800px] mx-auto">
            {/* Selector A */}
            <div className="relative w-full">
              <select
                className="glass-select"
                style={{ borderColor: report1Id ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.14)' }}
                value={report1Id || ""}
                onChange={(e) => setReport1Id(Number(e.target.value) || null)}
              >
                <option value="">Select Company A</option>
                {reports?.map(r => (
                  <option key={r.id} value={r.id} disabled={r.id === report2Id}>{r.companyName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
            </div>

            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center glass-card z-10">
              <ArrowRightLeft className="h-4 w-4" style={{ color: '#a78bfa' }} />
            </div>

            {/* Selector B */}
            <div className="relative w-full">
              <select
                className="glass-select"
                style={{ borderColor: report2Id ? 'rgba(6,182,212,0.5)' : 'rgba(255,255,255,0.14)' }}
                value={report2Id || ""}
                onChange={(e) => setReport2Id(Number(e.target.value) || null)}
              >
                <option value="">Select Company B</option>
                {reports?.map(r => (
                  <option key={r.id} value={r.id} disabled={r.id === report1Id}>{r.companyName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Comparison area */}
      <section className="relative z-10 flex-1 w-full max-w-[1400px] mx-auto px-6">
        {(!r1 || !r2) ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
            <div className="glass-card p-10 max-w-sm">
              <ArrowRightLeft className="h-10 w-10 mx-auto mb-4" style={{ color: 'rgba(124,58,237,0.6)' }} />
              <p className="text-[16px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Select two companies above to begin side-by-side comparison.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-12">

            {/* Column headers */}
            <div className="grid grid-cols-2 gap-6 sticky top-[68px] z-30 py-4" style={{ background: 'rgba(5,5,16,0.85)', backdropFilter: 'blur(20px)' }}>
              <div className="glass-card-glow p-5" style={{ borderLeftWidth: 2, borderLeftColor: 'rgba(124,58,237,0.7)' }}>
                <div className="section-label mb-1">Company A</div>
                <h2 className="text-[28px] font-[800] truncate" style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{r1.companyName}</h2>
                <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#a78bfa' }}>{r1.category}</span>
              </div>
              <div className="glass-card-glow p-5" style={{ borderLeftWidth: 2, borderLeftColor: 'rgba(6,182,212,0.7)' }}>
                <div className="section-label mb-1">Company B</div>
                <h2 className="text-[28px] font-[800] truncate" style={{ background: 'linear-gradient(135deg, #22d3ee, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{r2.companyName}</h2>
                <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)', color: '#22d3ee' }}>{r2.category}</span>
              </div>
            </div>

            <ComparisonRow title="Company Overview" colorA="rgba(124,58,237,0.6)" colorB="rgba(6,182,212,0.6)">
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{r1.companyOverview}</p>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{r2.companyOverview}</p>
            </ComparisonRow>

            <ComparisonRow title="Market Position" colorA="rgba(124,58,237,0.6)" colorB="rgba(6,182,212,0.6)">
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{r1.marketPosition}</p>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{r2.marketPosition}</p>
            </ComparisonRow>

            <ComparisonRow title="Strategic Watchouts" colorA="rgba(239,68,68,0.5)" colorB="rgba(239,68,68,0.5)">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{r1.strategicWatchouts}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{r2.strategicWatchouts}</p>
              </div>
            </ComparisonRow>

            <ComparisonRow title="Brand Activity" colorA="rgba(236,72,153,0.5)" colorB="rgba(236,72,153,0.5)">
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{r1.brandActivity}</p>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.75)' }}>{r2.brandActivity}</p>
            </ComparisonRow>

            <div className="text-center pt-8">
              <Link href="/" className="btn-primary no-underline">
                <Zap className="h-4 w-4" /> Start New Report
              </Link>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}

function ComparisonRow({ title, children, colorA, colorB }: { title: string; children: [React.ReactNode, React.ReactNode]; colorA: string; colorB: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <p className="section-label mb-4 px-1">{title}</p>
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6 h-full" style={{ borderLeftWidth: 2, borderLeftColor: colorA }}>
          {children[0]}
        </div>
        <div className="glass-card p-6 h-full" style={{ borderLeftWidth: 2, borderLeftColor: colorB }}>
          {children[1]}
        </div>
      </div>
    </motion.div>
  );
}
