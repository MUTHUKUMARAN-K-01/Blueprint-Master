import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ChevronRight, FileText, Brain, Shield, Clock, BarChart, Globe, Zap, Mail, MessageSquare, Code, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col w-full">
      {/* TILE 1 — Hero */}
      <section className="w-full bg-white flex flex-col items-center justify-center min-h-[90vh] px-4 py-20">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-[980px] mx-auto text-center space-y-6">
          <motion.p variants={item} className="text-[12px] font-[600] text-[#6e6e73] tracking-[0.1em] uppercase">
            Omnisense Intelligence
          </motion.p>
          <motion.h1 variants={item} className="text-[48px] sm:text-[56px] font-[600] leading-[1.1] tracking-[-0.28px] text-[#1d1d1f]">
            B2B Intelligence,<br />Instantly.
          </motion.h1>
          <motion.p variants={item} className="text-[21px] font-[400] text-[#6e6e73] max-w-[480px] mx-auto leading-relaxed">
            Enter a company. Deploy the swarm. Get 10 structured outputs in minutes.
          </motion.p>
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button onClick={() => document.getElementById("recon-form")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary w-full sm:w-auto">
              Generate Report
            </button>
            <button onClick={() => setLocation("/history")} className="btn-ghost w-full sm:w-auto">
              View History
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Previews */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1024px] mx-auto w-full px-4"
        >
          <div className="apple-card shadow-[0_20px_40px_rgba(0,0,0,0.04)] transform md:translate-y-4">
            <div className="flex items-center gap-2 mb-4 text-[#6e6e73]">
              <FileText className="h-4 w-4" />
              <span className="text-[12px] uppercase font-semibold">Company Overview</span>
            </div>
            <div className="h-2 bg-[#f5f5f7] rounded-full w-3/4 mb-3"></div>
            <div className="h-2 bg-[#f5f5f7] rounded-full w-full mb-3"></div>
            <div className="h-2 bg-[#f5f5f7] rounded-full w-5/6"></div>
          </div>
          <div className="apple-card shadow-[0_20px_40px_rgba(0,0,0,0.06)] z-10">
            <div className="flex items-center gap-2 mb-4 text-[#0066cc]">
              <Globe className="h-4 w-4" />
              <span className="text-[12px] uppercase font-semibold">Competitor Map</span>
            </div>
            <div className="flex justify-between items-end border-b border-[#f5f5f7] pb-3 mb-3">
              <div className="h-4 bg-[#f5f5f7] rounded w-1/3"></div>
              <div className="h-3 bg-[#0066cc] opacity-20 rounded w-1/4"></div>
            </div>
            <div className="flex justify-between items-end">
              <div className="h-4 bg-[#f5f5f7] rounded w-1/2"></div>
              <div className="h-3 bg-[#0066cc] opacity-20 rounded w-1/5"></div>
            </div>
          </div>
          <div className="apple-card shadow-[0_20px_40px_rgba(0,0,0,0.04)] transform md:translate-y-4">
            <div className="flex items-center gap-2 mb-4 text-[#6e6e73]">
              <Mail className="h-4 w-4" />
              <span className="text-[12px] uppercase font-semibold">Outreach Draft</span>
            </div>
            <div className="h-3 bg-[#f5f5f7] rounded-full w-1/2 mb-4"></div>
            <div className="h-2 bg-[#f5f5f7] rounded-full w-full mb-2"></div>
            <div className="h-2 bg-[#f5f5f7] rounded-full w-full mb-2"></div>
            <div className="h-2 bg-[#f5f5f7] rounded-full w-2/3"></div>
          </div>
        </motion.div>
      </section>

      {/* TILE 2 — Feature highlights */}
      <section className="w-full bg-[#f5f5f7] py-[80px] px-4">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[12px] font-[600] text-[#6e6e73] uppercase tracking-wider mb-3">What You Get</p>
            <h2 className="text-[40px] font-[600] tracking-[-0.2px] text-[#1d1d1f] leading-[1.2] max-w-[600px] mx-auto">
              10 intelligence outputs,<br />from one prompt.
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {[
              { icon: FileText, label: "Overview" },
              { icon: BarChart, label: "Market Position" },
              { icon: Globe, label: "Competitors" },
              { icon: Zap, label: "Brand Activity" },
              { icon: LayoutDashboard, label: "Footprint" },
              { icon: Shield, label: "Watchouts" },
              { icon: Brain, label: "Decision Makers" },
              { icon: MessageSquare, label: "Contact Intel" },
              { icon: Mail, label: "Outreach" },
              { icon: Code, label: "Tracking Pixel" }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-[18px] p-6 border border-[#d2d2d7] flex flex-col items-center justify-center text-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-lg">
                <feature.icon className="h-8 w-8 text-[#0066cc]" />
                <span className="text-[14px] font-[600] text-[#1d1d1f] leading-tight">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TILE 3 — How it works */}
      <section className="w-full bg-[#1d1d1f] py-[80px] px-4 text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16">
            <h2 className="text-[40px] font-[600] tracking-[-0.2px] leading-[1.2]">
              Real-time research.<br />AI synthesis.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <span className="text-[#2997ff] text-[14px] font-[600] border border-[#2997ff]/30 px-2 py-1 rounded">01</span>
              <h3 className="text-[21px] font-[600]">Live Web Search</h3>
              <p className="text-[17px] text-white/75 leading-relaxed">
                We deploy agents to crawl corporate sites, press releases, and SEC filings in real-time. No stale data.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-[#2997ff] text-[14px] font-[600] border border-[#2997ff]/30 px-2 py-1 rounded">02</span>
              <h3 className="text-[21px] font-[600]">NVIDIA AI Synthesis</h3>
              <p className="text-[17px] text-white/75 leading-relaxed">
                Raw data is piped through our fine-tuned reasoning models to extract signal from noise.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-[#2997ff] text-[14px] font-[600] border border-[#2997ff]/30 px-2 py-1 rounded">03</span>
              <h3 className="text-[21px] font-[600]">Zero-Hallucination Output</h3>
              <p className="text-[17px] text-white/75 leading-relaxed">
                Strict guardrails ensure contacts, metrics, and claims are backed by verifiable sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TILE 4 — Input form */}
      <section id="recon-form" className="w-full bg-white py-[80px] px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)", backgroundSize: "24px 24px" }}></div>
        <div className="max-w-[560px] mx-auto relative z-10 text-center">
          <h2 className="text-[40px] font-[600] tracking-[-0.2px] text-[#1d1d1f] mb-2">Initiate Recon</h2>
          <p className="text-[21px] text-[#6e6e73] mb-10">Enter target parameters.</p>
          
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6e6e73]" />
                <input
                  required
                  type="text"
                  placeholder="Company Name (e.g. Acme Corp)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full h-[54px] pl-12 pr-4 rounded-full border border-[#d2d2d7] bg-white text-[17px] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all"
                  data-testid="input-company-name"
                />
              </div>
            </div>
            <div>
              <input
                required
                type="text"
                placeholder="Market Sector / Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[54px] px-6 rounded-full border border-[#d2d2d7] bg-white text-[17px] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc] transition-all"
                data-testid="input-category"
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full !h-[54px] mt-4"
              data-testid="button-generate"
            >
              Deploy Swarm
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#f5f5f7] py-[64px] px-4 border-t border-[#d2d2d7]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-[600] text-[14px] text-[#1d1d1f] mb-4">Product</h4>
              <ul className="space-y-3 text-[14px] text-[#6e6e73]">
                <li><a href="#" className="hover:text-[#1d1d1f]">Features</a></li>
                <li><a href="#" className="hover:text-[#1d1d1f]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#1d1d1f]">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[600] text-[14px] text-[#1d1d1f] mb-4">Resources</h4>
              <ul className="space-y-3 text-[14px] text-[#6e6e73]">
                <li><a href="#" className="hover:text-[#1d1d1f]">Documentation</a></li>
                <li><a href="#" className="hover:text-[#1d1d1f]">Blog</a></li>
                <li><a href="#" className="hover:text-[#1d1d1f]">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[600] text-[14px] text-[#1d1d1f] mb-4">Company</h4>
              <ul className="space-y-3 text-[14px] text-[#6e6e73]">
                <li><a href="#" className="hover:text-[#1d1d1f]">About</a></li>
                <li><a href="#" className="hover:text-[#1d1d1f]">Careers</a></li>
                <li><a href="#" className="hover:text-[#1d1d1f]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-[600] text-[14px] text-[#1d1d1f] mb-4">Legal</h4>
              <ul className="space-y-3 text-[14px] text-[#6e6e73]">
                <li><a href="#" className="hover:text-[#1d1d1f]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#1d1d1f]">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#d2d2d7] text-center text-[12px] text-[#6e6e73]">
            &copy; {new Date().getFullYear()} Omnisense Intelligence. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
