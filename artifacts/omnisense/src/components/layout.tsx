import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Intelligence" },
    { href: "/history", label: "History" },
    { href: "/compare", label: "Compare" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: '#050510' }}>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-[60px] sticky top-0 z-50 flex items-center justify-between px-6"
        style={{
          background: 'rgba(5,5,16,0.85)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Omnisense"
            className="w-8 h-8 rounded-lg object-cover"
            style={{ filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.6))' }}
          />
          <span className="text-[15px] font-[700] tracking-tight gradient-text">OMNISENSE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href} className="no-underline">
                <span
                  className="px-4 py-1.5 rounded-full text-[13px] font-[500] transition-all duration-200"
                  style={{
                    background: active ? 'rgba(124,58,237,0.2)' : 'transparent',
                    border: active ? '1px solid rgba(124,58,237,0.45)' : '1px solid transparent',
                    color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                    display: 'inline-block',
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="btn-primary !py-2 !px-5 !text-[13px] no-underline">
          + New Report
        </Link>
      </motion.header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
