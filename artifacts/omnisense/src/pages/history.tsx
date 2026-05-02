import { useListReports } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Search, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function History() {
  const { data: reports, isLoading } = useListReports();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports?.filter(r => 
    r.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] flex flex-col w-full">
      
      {/* Hero Section */}
      <section className="w-full bg-white py-[80px] px-4 border-b border-[#d2d2d7]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-[40px] font-[600] tracking-[-0.2px] text-[#1d1d1f] leading-tight mb-2">
              Intelligence Archive
            </h1>
            <p className="text-[17px] text-[#6e6e73]">
              Access previously generated reports.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6e6e73]" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 rounded-full border border-[#d2d2d7] bg-white text-[17px] focus:outline-none focus:border-[#0066cc] focus:ring-1 focus:ring-[#0066cc]"
              />
            </div>
            <Link href="/" className="btn-primary w-full sm:w-auto whitespace-nowrap">
              New Report
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="flex-1 py-[80px] px-4 w-full max-w-[1440px] mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="apple-card animate-pulse h-[160px]" />
            ))}
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Link key={report.id} href={`/report/${report.id}`}>
                <div className="apple-card group hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] transition-all cursor-pointer h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-[21px] font-[600] text-[#1d1d1f] mb-2 group-hover:text-[#0066cc] transition-colors line-clamp-1">
                      {report.companyName}
                    </h3>
                    <div className="inline-block border border-[#d2d2d7] text-[#6e6e73] px-2 py-0.5 rounded-full text-[12px] font-[600] mb-4">
                      {report.category}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#00000008]">
                    <span className="text-[14px] text-[#6e6e73]">
                      {format(new Date(report.createdAt), "MMM d, yyyy")}
                    </span>
                    <span className="text-[14px] font-[600] text-[#0066cc] flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Report <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-white border border-[#d2d2d7] flex items-center justify-center shadow-sm">
              <Search className="h-10 w-10 text-[#d2d2d7]" />
            </div>
            <h3 className="text-[21px] font-[600] text-[#1d1d1f] mb-2">No reports found</h3>
            <p className="text-[17px] text-[#6e6e73] mb-6">
              {searchTerm ? "Try adjusting your search terms." : "You haven't generated any reports yet."}
            </p>
            {!searchTerm && (
              <Link href="/" className="btn-primary">
                Initiate Recon
              </Link>
            )}
          </div>
        )}
      </section>

    </div>
  );
}
