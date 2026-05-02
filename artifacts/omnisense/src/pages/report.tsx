import { useGetReport } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  Building, Target, Shield, Users, Mail, Copy, CheckCircle2,
  Globe, Star, Code2, Fingerprint, Network, Lock, ExternalLink, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

function GlassSection({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="glass-card-glow p-7 relative group"
      style={style}
    >
      {children}
    </motion.div>
  );
}

function CopyBtn({ text, onCopy }: { text: string; onCopy: (t: string) => void }) {
  return (
    <button
      onClick={() => onCopy(text)}
      className="absolute top-5 right-5 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <Copy className="h-3.5 w-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
    </button>
  );
}

export default function Report() {
  const params = useParams();
  const reportId = Number(params.id);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"email" | "linkedin" | "pixel">("email");

  const { data, isLoading, error } = useGetReport(reportId, {
    query: { enabled: !!reportId, queryKey: ['/api/reports', reportId] as any }
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Content ready to paste." });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Share this report URL." });
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center" style={{ background: '#050510' }}>
        <div className="relative">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className="w-16 h-16 rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent, #7c3aed, #06b6d4, transparent)', padding: 3 }}>
            <div className="w-full h-full rounded-full" style={{ background: '#050510' }} />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center" style={{ background: '#050510' }}>
        <div className="glass-card p-10 text-center max-w-sm">
          <Shield className="h-10 w-10 mx-auto mb-4" style={{ color: '#f87171' }} />
          <h2 className="text-[20px] font-[700]" style={{ color: '#f87171' }}>Report not found</h2>
        </div>
      </div>
    );
  }

  const { report } = data;

  return (
    <div className="pb-[120px]" style={{ background: '#050510' }}>

      {/* ═══════════════════════════════ HERO ═══════════════════ */}
      <section className="relative w-full px-6 py-[90px] overflow-hidden">
        <div className="orb" style={{ width: 700, height: 700, top: -200, left: -200, background: 'radial-gradient(circle, rgba(124,58,237,0.35), transparent 65%)', animation: 'float 10s ease-in-out infinite' }} />
        <div className="orb" style={{ width: 500, height: 500, top: '10%', right: -100, background: 'radial-gradient(circle, rgba(6,182,212,0.25), transparent 65%)', animation: 'drift 13s ease-in-out infinite' }} />

        <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa', boxShadow: '0 0 6px #a78bfa' }} />
              <span className="text-[12px] font-[700] tracking-widest" style={{ color: '#a78bfa' }}>INTELLIGENCE REPORT</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-[60px] sm:text-[72px] font-[900] leading-[1] tracking-[-2px] mb-5"
              style={{ background: 'linear-gradient(135deg, #fff 20%, #c4b5fd 60%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {report.companyName}
            </motion.h1>
            <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-1.5 rounded-full text-[13px] font-[600]" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd' }}>
                {report.category}
              </span>
              <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Generated {new Date(report.generatedAt).toLocaleString()}
              </span>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
            <button onClick={() => handleCopy(JSON.stringify(report, null, 2))} className="btn-ghost !py-2.5 !px-5 !text-[13px]">
              <Copy className="h-3.5 w-3.5" /> Export JSON
            </button>
            <button onClick={handleShare} className="btn-ghost !py-2.5 !px-5 !text-[13px]">
              <ExternalLink className="h-3.5 w-3.5" /> Share
            </button>
            <Link href="/" className="btn-primary !py-2.5 !px-5 !text-[13px] no-underline">
              <Zap className="h-3.5 w-3.5" /> New Report
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════ SECTION 1 — OVERVIEW ══════════════ */}
      <section className="px-6 pb-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <GlassSection style={{ borderLeftWidth: 2, borderLeftColor: 'rgba(124,58,237,0.6)' }}>
              <CopyBtn text={report.companyOverview} onCopy={handleCopy} />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)' }}>
                  <Building size={15} style={{ color: '#a78bfa' }} />
                </div>
                <span className="section-label">Company Overview</span>
              </div>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.72)' }}>{report.companyOverview}</p>
            </GlassSection>

            <GlassSection style={{ borderLeftWidth: 2, borderLeftColor: 'rgba(6,182,212,0.6)' }}>
              <CopyBtn text={report.marketPosition} onCopy={handleCopy} />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)' }}>
                  <Target size={15} style={{ color: '#22d3ee' }} />
                </div>
                <span className="section-label">Market Position</span>
              </div>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.72)' }}>{report.marketPosition}</p>
            </GlassSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION 2 — COMPETITORS ═══════════ */}
      <section className="px-6 py-16 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="orb" style={{ width: 400, height: 400, right: -100, top: '50%', transform: 'translateY(-50%)', background: 'radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%)', animation: 'drift 15s ease-in-out infinite' }} />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
            <p className="section-label mb-2">Competitive Landscape</p>
            <h2 className="text-[36px] font-[800] leading-tight" style={{ background: 'linear-gradient(135deg, #fff, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Competitor Intelligence
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {report.competitorMapping.map((comp, idx) => {
              const colors = ['rgba(124,58,237,0.5)', 'rgba(6,182,212,0.5)', 'rgba(236,72,153,0.5)'];
              const textColors = ['#a78bfa', '#22d3ee', '#f472b6'];
              return (
                <GlassSection key={idx} style={{ borderTopWidth: 1, borderTopColor: colors[idx % 3] }}>
                  <h4 className="text-[17px] font-[700] mb-5" style={{ color: textColors[idx % 3] }}>{comp.name}</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-[12px] font-[700] mb-2" style={{ color: '#34d399' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34d399' }} /> STRENGTHS
                      </div>
                      <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{comp.strengths}</p>
                    </div>
                    <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <div>
                      <div className="flex items-center gap-2 text-[12px] font-[700] mb-2" style={{ color: '#f87171' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#f87171' }} /> GAPS
                      </div>
                      <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{comp.gaps}</p>
                    </div>
                  </div>
                </GlassSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION 3 — BRAND & FOOTPRINT ══════ */}
      <section className="px-6 py-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
          <GlassSection style={{ borderLeftWidth: 2, borderLeftColor: 'rgba(245,158,11,0.6)' }}>
            <CopyBtn text={report.brandActivity} onCopy={handleCopy} />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)' }}>
                <Star size={15} style={{ color: '#fbbf24' }} />
              </div>
              <span className="section-label">Brand Activity</span>
            </div>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.7)' }}>{report.brandActivity}</p>
          </GlassSection>

          <GlassSection style={{ borderLeftWidth: 2, borderLeftColor: 'rgba(16,185,129,0.6)' }}>
            <CopyBtn text={report.experientialFootprint} onCopy={handleCopy} />
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}>
                <Globe size={15} style={{ color: '#34d399' }} />
              </div>
              <span className="section-label">Experiential Footprint</span>
            </div>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.7)' }}>{report.experientialFootprint}</p>
          </GlassSection>
        </div>
      </section>

      {/* ═══════════════════════ SECTION 4 — WATCHOUTS ══════════════ */}
      <section className="px-6 py-6">
        <div className="max-w-[1200px] mx-auto">
          <GlassSection style={{ borderLeftWidth: 3, borderLeftColor: 'rgba(239,68,68,0.7)' }}>
            <CopyBtn text={report.strategicWatchouts} onCopy={handleCopy} />
            <div className="absolute top-5 right-14">
              <span className="text-[11px] font-[700] px-2.5 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                GraphRAG™
              </span>
            </div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)' }}>
                <Shield size={15} style={{ color: '#f87171' }} />
              </div>
              <span className="section-label" style={{ color: '#f87171' }}>Strategic Watchouts</span>
            </div>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap max-w-4xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {report.strategicWatchouts}
            </p>
          </GlassSection>
        </div>
      </section>

      {/* ═══════════════════════ SECTION 5 — DECISION MAKERS + CONTACTS ═ */}
      <section className="px-6 py-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Decision Makers */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}>
                <Users size={15} style={{ color: '#34d399' }} />
              </div>
              <span className="text-[16px] font-[700]" style={{ color: 'rgba(255,255,255,0.9)' }}>Decision Maker Roles</span>
            </motion.div>
            <div className="space-y-3">
              {report.decisionMakerRoles.map((role, idx) => (
                <GlassSection key={idx} style={{ padding: 18 }}>
                  <div className="flex gap-4 items-start">
                    <div className="text-[13px] font-[800] h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-[15px] font-[700] mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{role.title}</h4>
                      <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{role.rationale}</p>
                    </div>
                  </div>
                </GlassSection>
              ))}
            </div>
          </div>

          {/* Contact Intelligence */}
          <div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)' }}>
                <Fingerprint size={15} style={{ color: '#818cf8' }} />
              </div>
              <span className="text-[16px] font-[700]" style={{ color: 'rgba(255,255,255,0.9)' }}>Contact Intelligence</span>
            </motion.div>
            <div className="space-y-3">
              {report.contactIntelligence.map((contact, idx) => (
                <GlassSection key={idx} style={{ padding: 18 }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-[15px] font-[700] mb-0.5" style={{ color: 'rgba(255,255,255,0.9)' }}>{contact.name}</h4>
                      <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{contact.title}</p>
                    </div>
                    {contact.verified ? (
                      <span className="flex items-center gap-1 text-[11px] font-[700] px-2 py-1 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-[600] px-2 py-1 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.35)' }}>
                        <Lock className="h-3 w-3" /> Protected
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 text-[13px]">
                    {contact.email && <div style={{ color: 'rgba(255,255,255,0.5)' }}><span style={{ color: 'rgba(255,255,255,0.25)', marginRight: 6 }}>Email</span>{contact.email}</div>}
                    {contact.phone && <div style={{ color: 'rgba(255,255,255,0.5)' }}><span style={{ color: 'rgba(255,255,255,0.25)', marginRight: 6 }}>Phone</span>{contact.phone}</div>}
                    {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 no-underline" style={{ color: '#818cf8' }}>LinkedIn Profile <ExternalLink size={11} /></a>}
                  </div>
                </GlassSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SECTION 6 — OUTREACH ═══════════════ */}
      <section className="px-6 py-16 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="orb" style={{ width: 500, height: 500, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)' }} />
        <div className="max-w-[900px] mx-auto relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-10">
            <p className="section-label mb-2">Outreach Center</p>
            <h2 className="text-[36px] font-[800]" style={{ background: 'linear-gradient(135deg, #f472b6, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Personalized Outreach
            </h2>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1 p-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['email', 'linkedin', 'pixel'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-2 rounded-full text-[13px] font-[600] transition-all duration-200"
                  style={{
                    background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'transparent',
                    color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.4)',
                    boxShadow: activeTab === tab ? '0 0 15px rgba(124,58,237,0.4)' : 'none',
                  }}
                >
                  {tab === 'email' ? 'Email' : tab === 'linkedin' ? 'LinkedIn' : 'Tracking Pixel'}
                </button>
              ))}
            </div>
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="glass-card-glow p-8 relative group min-h-[280px]">
            {activeTab === 'email' && (
              <>
                <button onClick={() => handleCopy(`Subject: ${report.outreach.emailSubject}\n\n${report.outreach.emailBody}`)} className="btn-primary !py-2 !px-4 !text-[12px] absolute top-5 right-5">
                  <Copy className="h-3.5 w-3.5" /> Copy Draft
                </button>
                <div className="mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-[12px] mr-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Subject:</span>
                  <span className="text-[15px] font-[700]" style={{ color: 'rgba(255,255,255,0.9)' }}>{report.outreach.emailSubject}</span>
                </div>
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {report.outreach.emailBody}
                </div>
              </>
            )}
            {activeTab === 'linkedin' && (
              <>
                <button onClick={() => handleCopy(report.outreach.linkedinMessage)} className="btn-primary !py-2 !px-4 !text-[12px] absolute top-5 right-5">
                  <Copy className="h-3.5 w-3.5" /> Copy Message
                </button>
                <div className="flex justify-between mb-4">
                  <span className="section-label">InMail Draft</span>
                  <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{report.outreach.linkedinMessage.length} chars</span>
                </div>
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {report.outreach.linkedinMessage}
                </div>
              </>
            )}
            {activeTab === 'pixel' && (
              <>
                <button onClick={() => handleCopy(report.outreach.trackingPixelHtml)} className="btn-primary !py-2 !px-4 !text-[12px] absolute top-5 right-5">
                  <Code2 className="h-3.5 w-3.5" /> Copy HTML
                </button>
                <p className="text-[14px] mb-5 pr-32" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {report.outreach.trackingLogicExplanation}
                </p>
                <pre className="rounded-xl p-5 overflow-x-auto text-[13px] font-mono" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', color: '#67e8f9', lineHeight: 1.6 }}>
                  <code>{report.outreach.trackingPixelHtml}</code>
                </pre>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Sticky bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-4"
        style={{ background: 'rgba(5,5,16,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
        <span className="text-[14px] font-[700] hidden md:block max-w-[180px] truncate gradient-text">{report.companyName}</span>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="btn-ghost !py-2 !px-4 !text-[13px]">
            <ExternalLink className="h-3.5 w-3.5" /> Share
          </button>
          <Link href="/" className="btn-primary !py-2 !px-5 !text-[13px] no-underline">
            <Zap className="h-3.5 w-3.5" /> New Report
          </Link>
        </div>
      </div>
    </div>
  );
}
