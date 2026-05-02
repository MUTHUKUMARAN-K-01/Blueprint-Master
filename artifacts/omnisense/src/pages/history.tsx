import { useListReports } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Search, ChevronRight, Brain, FileText, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const ACCENT_COLORS = [
  { border: 'rgba(124,58,237,0.6)', glow: 'rgba(124,58,237,0.1)', text: '#a78bfa' },
  { border: 'rgba(6,182,212,0.6)', glow: 'rgba(6,182,212,0.1)', text: '#22d3ee' },
  { border: 'rgba(236,72,153,0.6)', glow: 'rgba(236,72,153,0.1)', text: '#f472b6' },
  { border: 'rgba(16,185,129,0.6)', glow: 'rgba(16,185,129,0.1)', text: '#34d399' },
  { border: 'rgba(245,158,11,0.6)', glow: 'rgba(245,158,11,0.1)', text: '#fbbf24' },
  { border: 'rgba(37,99,235,0.6)', glow: 'rgba(37,99,235,0.1)', text: '#60a5fa' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function History() {
  const { data: reports, isLoading } = useListReports();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports?.filter(r =>
    r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-[100dvh] flex flex-col w-full pb-20" style={{ background: '#050510' }}>

      {/* Orbs */}
      <div className="orb" style={{ width: 500, height: 500, top: -100, left: -150, background: 'radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)', animation: 'float 10s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 400, height: 400, top: '20%', right: -100, background: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 70%)', animation: 'drift 12s ease-in-out infinite' }} />

      {/* Hero */}
      <section className="relative w-full px-6 pt-20 pb-16 z-10">
        <div className="max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="section-label mb-4">Intelligence Archive</p>
            <h1 className="text-[52px] font-[800] leading-tight mb-4 gradient-text">
              Mission History
            </h1>
            <p className="text-[18px] mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {reports?.length ?? 0} intelligence reports generated.
            </p>

            <div className="relative max-w-[440px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
              <input
                type="text"
                placeholder="Search companies or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input !pl-12"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="relative flex-1 px-6 z-10">
        <div className="max-w-[1200px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card h-[180px] animate-pulse" />
              ))}
            </div>
          ) : filteredReports.length > 0 ? (
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReports.map((report, idx) => {
                const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                return (
                  <motion.div key={report.id} variants={item}>
                    <Link href={`/report/${report.id}`} className="no-underline block h-full">
                      <motion.div
                        className="glass-card-glow h-full flex flex-col justify-between p-6 cursor-pointer"
                        style={{ borderLeftColor: accent.border, borderLeftWidth: 2 }}
                        whileHover={{ scale: 1.02, boxShadow: `0 0 40px ${accent.glow}, 0 20px 40px rgba(0,0,0,0.35)` }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: `linear-gradient(135deg, ${accent.border}, transparent)`, border: `1px solid ${accent.border}` }}>
                              {report.companyName.slice(0, 2).toUpperCase()}
                            </div>
                            <FileText className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
                          </div>
                          <h3 className="text-[20px] font-[700] mb-2" style={{ color: 'rgba(255,255,255,0.95)' }}>
                            {report.companyName}
                          </h3>
                          <span className="inline-block px-3 py-1 rounded-full text-[12px] font-[600] mb-4" style={{ background: `${accent.glow}`, border: `1px solid ${accent.border}`, color: accent.text }}>
                            {report.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            {format(new Date(report.createdAt), "MMM d, yyyy")}
                          </span>
                          <span className="text-[13px] font-[600] flex items-center gap-1" style={{ color: accent.text }}>
                            View Report <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full flex items-center justify-center glass-card">
                  <Brain className="h-10 w-10" style={{ color: 'rgba(124,58,237,0.7)' }} />
                </div>
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
              </div>
              <h3 className="text-[24px] font-[700] mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {searchTerm ? "No matches found" : "No missions yet"}
              </h3>
              <p className="text-[16px] mb-8" style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 320 }}>
                {searchTerm ? "Try different search terms." : "Deploy your first intelligence swarm to get started."}
              </p>
              {!searchTerm && (
                <Link href="/" className="btn-primary no-underline">
                  <Zap className="h-4 w-4" /> Deploy Swarm
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
