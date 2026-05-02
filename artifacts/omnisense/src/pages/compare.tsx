import { useListReports, useGetReport } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useState } from "react";
import { ChevronDown, ArrowRightLeft } from "lucide-react";

export default function Compare() {
  const { data: reports, isLoading: isLoadingList } = useListReports();
  const [report1Id, setReport1Id] = useState<number | null>(null);
  const [report2Id, setReport2Id] = useState<number | null>(null);

  const { data: r1Data } = useGetReport(report1Id as number, { query: { enabled: !!report1Id, queryKey: ['/api/reports', report1Id] as any } });
  const { data: r2Data } = useGetReport(report2Id as number, { query: { enabled: !!report2Id, queryKey: ['/api/reports', report2Id] as any } });

  const r1 = r1Data?.report;
  const r2 = r2Data?.report;

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] flex flex-col w-full pb-20">
      
      {/* Hero Section */}
      <section className="w-full bg-white py-[60px] px-4 border-b border-[#d2d2d7]">
        <div className="max-w-[1440px] mx-auto text-center">
          <h1 className="text-[40px] font-[600] tracking-[-0.2px] text-[#1d1d1f] leading-tight mb-2">
            Compare Intelligence
          </h1>
          <p className="text-[17px] text-[#6e6e73] mb-8">
            Select two reports to analyze side-by-side.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-[800px] mx-auto">
            <div className="relative w-full">
              <select
                className="w-full h-[54px] px-6 appearance-none rounded-full border border-[#d2d2d7] bg-[#f5f5f7] text-[17px] font-[600] focus:outline-none focus:border-[#0066cc] cursor-pointer"
                value={report1Id || ""}
                onChange={(e) => setReport1Id(Number(e.target.value))}
              >
                <option value="" disabled>Select Company A</option>
                {reports?.map(r => (
                  <option key={r.id} value={r.id} disabled={r.id === report2Id}>{r.companyName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6e6e73] pointer-events-none" />
            </div>
            
            <div className="shrink-0 bg-white p-2 rounded-full border border-[#d2d2d7] shadow-sm z-10 md:-mx-8">
              <ArrowRightLeft className="h-5 w-5 text-[#0066cc]" />
            </div>

            <div className="relative w-full">
              <select
                className="w-full h-[54px] px-6 appearance-none rounded-full border border-[#d2d2d7] bg-[#f5f5f7] text-[17px] font-[600] focus:outline-none focus:border-[#0066cc] cursor-pointer"
                value={report2Id || ""}
                onChange={(e) => setReport2Id(Number(e.target.value))}
              >
                <option value="" disabled>Select Company B</option>
                {reports?.map(r => (
                  <option key={r.id} value={r.id} disabled={r.id === report1Id}>{r.companyName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6e6e73] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Area */}
      <section className="flex-1 w-full max-w-[1440px] mx-auto px-4 mt-12">
        {(!r1 || !r2) ? (
          <div className="text-center py-20">
            <p className="text-[17px] text-[#6e6e73]">Select two companies above to begin comparison.</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Headers */}
            <div className="grid grid-cols-2 gap-6 md:gap-12 sticky top-[96px] bg-[#f5f5f7]/90 backdrop-blur-md py-4 z-30">
              <div className="apple-card !border-t-4 !border-t-[#0066cc]">
                <h2 className="text-[34px] font-[600] tracking-[-0.374px] text-[#1d1d1f] truncate">{r1.companyName}</h2>
                <span className="text-[12px] font-[600] text-[#6e6e73] uppercase">{r1.category}</span>
              </div>
              <div className="apple-card !border-t-4 !border-t-[#0066cc]">
                <h2 className="text-[34px] font-[600] tracking-[-0.374px] text-[#1d1d1f] truncate">{r2.companyName}</h2>
                <span className="text-[12px] font-[600] text-[#6e6e73] uppercase">{r2.category}</span>
              </div>
            </div>

            {/* Rows */}
            <ComparisonRow title="Company Overview">
              <p className="text-[17px] leading-relaxed whitespace-pre-wrap">{r1.companyOverview}</p>
              <p className="text-[17px] leading-relaxed whitespace-pre-wrap">{r2.companyOverview}</p>
            </ComparisonRow>

            <ComparisonRow title="Market Position">
              <p className="text-[17px] leading-relaxed whitespace-pre-wrap">{r1.marketPosition}</p>
              <p className="text-[17px] leading-relaxed whitespace-pre-wrap">{r2.marketPosition}</p>
            </ComparisonRow>

            <ComparisonRow title="Strategic Watchouts">
              <div className="bg-[#ff3b30]/5 p-4 rounded-[12px] border border-[#ff3b30]/20">
                <p className="text-[17px] leading-relaxed whitespace-pre-wrap text-[#1d1d1f]">{r1.strategicWatchouts}</p>
              </div>
              <div className="bg-[#ff3b30]/5 p-4 rounded-[12px] border border-[#ff3b30]/20">
                <p className="text-[17px] leading-relaxed whitespace-pre-wrap text-[#1d1d1f]">{r2.strategicWatchouts}</p>
              </div>
            </ComparisonRow>

            <ComparisonRow title="Brand Activity">
              <p className="text-[17px] leading-relaxed whitespace-pre-wrap">{r1.brandActivity}</p>
              <p className="text-[17px] leading-relaxed whitespace-pre-wrap">{r2.brandActivity}</p>
            </ComparisonRow>

            <div className="text-center pt-12">
              <Link href="/" className="btn-primary">
                Start New Report
              </Link>
            </div>

          </div>
        )}
      </section>
    </div>
  );
}

function ComparisonRow({ title, children }: { title: string, children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div>
      <h3 className="text-[14px] font-[600] text-[#6e6e73] uppercase tracking-wider mb-4 px-2">{title}</h3>
      <div className="grid grid-cols-2 gap-6 md:gap-12">
        <div className="apple-card !p-6 h-full">{children[0]}</div>
        <div className="apple-card !p-6 h-full">{children[1]}</div>
      </div>
    </div>
  );
}
