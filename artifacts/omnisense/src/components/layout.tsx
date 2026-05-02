import React from "react";
import { Link, useLocation } from "wouter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const getPageTitle = () => {
    if (location === "/") return "Intelligence";
    if (location === "/history") return "Archive";
    if (location === "/compare") return "Compare";
    if (location.startsWith("/report/")) return "Report Viewer";
    if (location.startsWith("/generating")) return "Generating";
    return "Omnisense";
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col">
      {/* Global Nav */}
      <header className="h-[44px] bg-[#000000] text-white flex items-center justify-between px-4 z-50">
        <Link href="/" className="text-[14px] font-[600] tracking-tight hover:opacity-80 transition-opacity">
          Omnisense
        </Link>
        <nav className="flex items-center gap-[20px] text-[12px] tracking-[-0.12px]">
          <Link href="/" className={`hover:opacity-80 transition-opacity ${location === "/" ? "opacity-100 font-semibold" : "opacity-80"}`}>
            Intelligence
          </Link>
          <Link href="/history" className={`hover:opacity-80 transition-opacity ${location === "/history" ? "opacity-100 font-semibold" : "opacity-80"}`}>
            History
          </Link>
          <Link href="/compare" className={`hover:opacity-80 transition-opacity ${location === "/compare" ? "opacity-100 font-semibold" : "opacity-80"}`}>
            Compare
          </Link>
        </nav>
      </header>

      {/* Sub-nav (Frosted) */}
      <div className="h-[52px] frosted sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 border-b border-[#00000008]">
        <div className="text-[21px] font-[600] text-[#1d1d1f] tracking-tight">
          {getPageTitle()}
        </div>
        <Link href="/" className="btn-primary !text-[14px] !px-4 !py-1.5 h-8">
          New Report
        </Link>
      </div>

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
