import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { useGenerateIntelligence, getListReportsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const LOG_LINES = [
  "> Initializing Research Swarm...",
  "> Crawling corporate website...",
  "> Extracting NetworkX triplets...",
  "> Building Knowledge Graph...",
  "> Mapping competitor nodes...",
  "> Querying contact database...",
  "> Applying Zero-Hallucination guardrails...",
  "> Drafting outreach sequences...",
  "> Generating tracking pixel...",
  "> Intelligence package ready."
];

export default function Generating() {
  const [location, setLocation] = useLocation();
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const queryClient = useQueryClient();
  
  const generateMutation = useGenerateIntelligence();
  const mutateRef = useRef(generateMutation.mutate);
  mutateRef.current = generateMutation.mutate;

  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Parse params
    const searchParams = new URLSearchParams(window.location.search);
    const companyName = searchParams.get("company");
    const category = searchParams.get("category");

    if (!companyName || !category) {
      setLocation("/");
      return;
    }

    // Start logs animation
    let i = 0;
    const interval = setInterval(() => {
      setVisibleLogs(prev => {
        if (i < LOG_LINES.length) {
          const newLogs = [...prev, LOG_LINES[i]];
          i++;
          return newLogs;
        }
        clearInterval(interval);
        return prev;
      });
    }, 800);

    // Fire mutation
    mutateRef.current(
      { data: { companyName, category } },
      {
        onSuccess: (report) => {
          queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
          
          // Wait for logs to finish or at least show a few, then navigate
          // In a real app we'd sync this better, but a short timeout works
          setTimeout(() => {
            // Find the report ID by fetching the list or just using history if we don't have ID in response
            // Wait, useGenerateIntelligence returns IntelligenceReport which doesn't have an ID directly!
            // We need to fetch list reports to find the latest one, or just navigate to /history
            // Let's refetch reports and get the latest
            queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
            
            // To be safe and since we don't know the exact ID, we'll redirect to /history
            setLocation("/history");
          }, 3000);
        },
        onError: () => {
          setVisibleLogs(prev => [...prev, "> ERROR: Swarm deployment failed."]);
          setTimeout(() => {
            setLocation("/");
          }, 3000);
        }
      }
    );

    return () => clearInterval(interval);
  }, [setLocation, queryClient]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] font-mono">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <Terminal className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">AGENT TERMINAL</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-xs text-primary uppercase">Live</span>
        </div>
      </div>

      <div className="flex-1 bg-black rounded-lg border border-border p-6 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="space-y-3 relative z-10">
          <AnimatePresence>
            {visibleLogs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm md:text-base text-primary"
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
          {visibleLogs.length > 0 && visibleLogs.length < LOG_LINES.length && (
            <motion.div 
              animate={{ opacity: [1, 0] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-3 h-5 bg-primary inline-block align-middle"
            />
          )}
        </div>
      </div>
    </div>
  );
}
