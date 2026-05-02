import { useGetReport } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Building, Target, Shield, Users, Mail, Copy, CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

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
    toast({
      title: "Copied to clipboard",
      description: "Content ready to paste.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Report link is ready to share.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center mt-20">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-[#f5f5f7] border-t-[#0066cc]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-[21px] font-[600] text-[#ff3b30]">Failed to load report</h2>
      </div>
    );
  }

  const { report } = data;

  return (
    <div className="bg-white min-h-screen pb-[120px]">
      
      {/* Report Header (Dark Tile) */}
      <section className="bg-[#1d1d1f] w-full px-4 py-[80px] text-white">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[#2997ff] text-[12px] font-[600] uppercase tracking-wider mb-2">Intelligence Report</div>
            <h1 className="text-[56px] font-[600] tracking-[-0.28px] leading-tight mb-4">
              {report.companyName}
            </h1>
            <div className="flex items-center gap-3">
              <span className="border border-[#2997ff] text-[#2997ff] px-3 py-1 rounded-full text-[14px] font-[600]">
                {report.category}
              </span>
              <span className="text-[12px] text-white/50">
                Generated: {new Date(report.generatedAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleCopy(JSON.stringify(report, null, 2))} className="btn-ghost !text-white hover:!bg-white/10">
              Copy JSON
            </button>
            <button onClick={handlePrint} className="btn-ghost !text-white hover:!bg-white/10">
              Print
            </button>
            <Link href="/" className="btn-primary !bg-[#2997ff] !text-[#1d1d1f] font-[600]">
              New Report
            </Link>
          </div>
        </div>
      </section>

      <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1440px] mx-auto w-full px-4">
        
        {/* Section 1 — Overview (White) */}
        <section className="py-[80px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={item} className="apple-card relative group">
              <button onClick={() => handleCopy(report.companyOverview)} className="absolute top-4 right-4 p-2 text-[#6e6e73] hover:text-[#0066cc] opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 mb-4 text-[#6e6e73] uppercase text-[12px] font-[600] tracking-wider">
                <Building className="h-4 w-4" /> Company Overview
              </div>
              <p className="text-[17px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">
                {report.companyOverview}
              </p>
            </motion.div>
            
            <motion.div variants={item} className="apple-card relative group">
              <button onClick={() => handleCopy(report.marketPosition)} className="absolute top-4 right-4 p-2 text-[#6e6e73] hover:text-[#0066cc] opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 mb-4 text-[#6e6e73] uppercase text-[12px] font-[600] tracking-wider">
                <Target className="h-4 w-4" /> Market Position
              </div>
              <p className="text-[17px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">
                {report.marketPosition}
              </p>
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* Section 2 — Competitive Intelligence (Parchment) */}
      <section className="w-full bg-[#f5f5f7] py-[80px] px-4">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1440px] mx-auto">
          <h3 className="text-[34px] font-[600] tracking-[-0.374px] text-[#1d1d1f] mb-8">Competitive Landscape</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {report.competitorMapping.map((comp, idx) => (
              <motion.div variants={item} key={idx} className="apple-card relative">
                <h4 className="text-[17px] font-[600] text-[#0066cc] mb-4">{comp.name}</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-[14px] font-[600] text-[#1d1d1f] mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#34c759]" /> Strengths
                    </div>
                    <p className="text-[14px] text-[#6e6e73] leading-relaxed">{comp.strengths}</p>
                  </div>
                  <div className="h-[1px] w-full bg-[#00000008] my-2" />
                  <div>
                    <div className="flex items-center gap-2 text-[14px] font-[600] text-[#1d1d1f] mb-1">
                      <div className="w-2 h-2 rounded-full bg-[#ff3b30]" /> Gaps
                    </div>
                    <p className="text-[14px] text-[#6e6e73] leading-relaxed">{comp.gaps}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Section 3 — Brand & Presence (Dark) */}
      <section className="w-full bg-[#1d1d1f] py-[80px] px-4 text-white">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div variants={item}>
            <h3 className="text-[34px] font-[600] tracking-[-0.374px] mb-6">Brand Activity</h3>
            <div className="pl-4 border-l-2 border-[#2997ff]">
              <p className="text-[17px] text-white/80 leading-relaxed whitespace-pre-wrap">
                {report.brandActivity}
              </p>
            </div>
          </motion.div>
          <motion.div variants={item}>
            <h3 className="text-[34px] font-[600] tracking-[-0.374px] mb-6">Experiential Footprint</h3>
            <div className="pl-4 border-l-2 border-[#2997ff]">
              <p className="text-[17px] text-white/80 leading-relaxed whitespace-pre-wrap">
                {report.experientialFootprint}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 4 — Intelligence (White) */}
      <section className="w-full bg-white py-[80px] px-4">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1440px] mx-auto space-y-12">
          
          <motion.div variants={item} className="apple-card relative border-l-4 border-l-[#ff3b30] overflow-hidden group">
            <button onClick={() => handleCopy(report.strategicWatchouts)} className="absolute top-4 right-4 p-2 text-[#6e6e73] hover:text-[#0066cc] opacity-0 group-hover:opacity-100 transition-opacity">
              <Copy className="h-4 w-4" />
            </button>
            <div className="absolute top-4 right-16">
              <span className="text-[12px] font-[600] text-[#ff3b30] bg-[#ff3b30]/10 px-2 py-1 rounded">GraphRAG™</span>
            </div>
            <div className="flex items-center gap-2 mb-4 text-[#ff3b30] uppercase text-[12px] font-[600] tracking-wider">
              <Shield className="h-4 w-4" /> Strategic Watchouts
            </div>
            <p className="text-[17px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap max-w-4xl">
              {report.strategicWatchouts}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={item}>
              <h3 className="text-[21px] font-[600] text-[#1d1d1f] mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#0066cc]" /> Decision Maker Roles
              </h3>
              <div className="space-y-4">
                {report.decisionMakerRoles.map((role, idx) => (
                  <div key={idx} className="apple-card !p-4 flex gap-4">
                    <div className="text-[14px] font-[600] text-[#0066cc] bg-[#0066cc]/10 h-8 w-8 rounded-full flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-[17px] font-[600] text-[#1d1d1f] mb-1">{role.title}</h4>
                      <p className="text-[14px] text-[#6e6e73] leading-relaxed">{role.rationale}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div variants={item}>
              <h3 className="text-[21px] font-[600] text-[#1d1d1f] mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#0066cc]" /> Contact Intelligence
              </h3>
              <div className="space-y-4">
                {report.contactIntelligence.map((contact, idx) => (
                  <div key={idx} className="apple-card !p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-[17px] font-[600] text-[#1d1d1f]">{contact.name}</h4>
                        <p className="text-[14px] text-[#6e6e73]">{contact.title}</p>
                      </div>
                      {contact.verified ? (
                        <span className="flex items-center gap-1 text-[12px] text-[#34c759] font-[600] bg-[#34c759]/10 px-2 py-1 rounded">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-[12px] text-[#6e6e73] bg-[#f5f5f7] px-2 py-1 rounded">
                          Data Protected
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-[14px]">
                      {contact.email && <div className="text-[#1d1d1f]"><span className="text-[#6e6e73] mr-2">Email:</span>{contact.email}</div>}
                      {contact.phone && <div className="text-[#1d1d1f]"><span className="text-[#6e6e73] mr-2">Phone:</span>{contact.phone}</div>}
                      {contact.linkedin && <div><a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-[#0066cc] hover:underline">LinkedIn Profile →</a></div>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </motion.div>
      </section>

      {/* Section 5 — Outreach Center (Parchment) */}
      <section className="w-full bg-[#f5f5f7] py-[80px] px-4">
        <div className="max-w-[980px] mx-auto">
          <h3 className="text-[34px] font-[600] tracking-[-0.374px] text-[#1d1d1f] mb-8 text-center">Personalized Outreach</h3>
          
          <div className="flex justify-center mb-6">
            <div className="bg-[#e5e5ea] p-1 rounded-full flex gap-1">
              <button 
                onClick={() => setActiveTab("email")}
                className={`px-6 py-2 rounded-full text-[14px] font-[600] transition-colors ${activeTab === "email" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#6e6e73] hover:text-[#1d1d1f]"}`}
              >
                Email
              </button>
              <button 
                onClick={() => setActiveTab("linkedin")}
                className={`px-6 py-2 rounded-full text-[14px] font-[600] transition-colors ${activeTab === "linkedin" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#6e6e73] hover:text-[#1d1d1f]"}`}
              >
                LinkedIn
              </button>
              <button 
                onClick={() => setActiveTab("pixel")}
                className={`px-6 py-2 rounded-full text-[14px] font-[600] transition-colors ${activeTab === "pixel" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#6e6e73] hover:text-[#1d1d1f]"}`}
              >
                Tracking Pixel
              </button>
            </div>
          </div>

          <div className="apple-card relative min-h-[300px]">
            {activeTab === "email" && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => handleCopy(`Subject: ${report.outreach.emailSubject}\n\n${report.outreach.emailBody}`)} className="absolute top-4 right-4 btn-primary !py-1.5 !px-4 !text-[14px]">
                  Copy Draft
                </button>
                <div className="mb-6 pb-4 border-b border-[#00000008]">
                  <span className="text-[#6e6e73] text-[14px] mr-2">Subject:</span>
                  <span className="text-[#1d1d1f] font-[600]">{report.outreach.emailSubject}</span>
                </div>
                <div className="text-[17px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap font-sans">
                  {report.outreach.emailBody}
                </div>
              </div>
            )}
            
            {activeTab === "linkedin" && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => handleCopy(report.outreach.linkedinMessage)} className="absolute top-4 right-4 btn-primary !py-1.5 !px-4 !text-[14px]">
                  Copy Message
                </button>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-[12px] text-[#6e6e73] uppercase font-[600]">InMail Draft</span>
                  <span className="text-[12px] text-[#6e6e73]">{report.outreach.linkedinMessage.length} chars</span>
                </div>
                <div className="text-[17px] text-[#1d1d1f] leading-relaxed whitespace-pre-wrap">
                  {report.outreach.linkedinMessage}
                </div>
              </div>
            )}

            {activeTab === "pixel" && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => handleCopy(report.outreach.trackingPixelHtml)} className="absolute top-4 right-4 btn-primary !py-1.5 !px-4 !text-[14px]">
                  Copy HTML
                </button>
                <p className="text-[14px] text-[#6e6e73] mb-4 pr-32">
                  {report.outreach.trackingLogicExplanation}
                </p>
                <pre className="bg-[#1d1d1f] text-[#2997ff] p-4 rounded-[12px] overflow-x-auto text-[14px] font-mono">
                  <code>{report.outreach.trackingPixelHtml}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Sticky Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 frosted rounded-full px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex items-center gap-6 z-50">
        <span className="font-[600] text-[#1d1d1f] max-w-[200px] truncate hidden md:block">
          {report.companyName}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="btn-ghost !text-[#1d1d1f] !py-2 !px-4">
            Share
          </button>
          <Link href="/" className="btn-primary !py-2 !px-4 shadow-sm">
            New Report
          </Link>
        </div>
      </div>

    </div>
  );
}
