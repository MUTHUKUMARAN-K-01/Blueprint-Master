import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { useGenerateIntelligence, getListReportsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const LOG_LINES = [
  "> Initializing Research Swarm...",
  "> Dispatching DuckDuckGo crawl agents...",
  "> Scraping corporate website and press releases...",
  "> Extracting competitor signal data...",
  "> Building real-time Knowledge Graph...",
  "> Mapping competitor nodes and overlap vectors...",
  "> Querying NVIDIA minimax-m2.7 synthesis engine...",
  "> Applying Zero-Hallucination contact guardrails...",
  "> Synthesizing Strategic Watchouts via GraphRAG...",
  "> Drafting personalized outreach sequences...",
  "> Generating tracking pixel and webhook logic...",
  "> Running final intelligence validation pass...",
  "> Intelligence package ready.",
];

export default function Generating() {
  const [, setLocation] = useLocation();
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [loopCount, setLoopCount] = useState(0);
  const queryClient = useQueryClient();

  const generateMutation = useGenerateIntelligence();
  const mutateRef = useRef(generateMutation.mutate);
  mutateRef.current = generateMutation.mutate;

  const hasStarted = useRef(false);
  const reportIdRef = useRef<number | null>(null);
  const mutationDoneRef = useRef(false);

  // Continuously loop logs until the mutation resolves
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (mutationDoneRef.current && i >= LOG_LINES.length) {
        clearInterval(interval);
        return;
      }
      setVisibleLogs((prev) => {
        if (i < LOG_LINES.length) {
          const next = [...prev, LOG_LINES[i]];
          i++;
          return next;
        }
        // Loop: reset and start over with a separator
        i = 1;
        setLoopCount((c) => c + 1);
        return ["> Re-running deep intelligence pass...", LOG_LINES[0]];
      });
    }, 900);

    return () => clearInterval(interval);
  }, []);

  // Fire mutation once
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const companyName = searchParams.get("company");
    const category = searchParams.get("category");

    if (!companyName || !category) {
      setLocation("/");
      return;
    }

    mutateRef.current(
      { data: { companyName, category } },
      {
        onSuccess: (report) => {
          mutationDoneRef.current = true;
          queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
          const id = (report as unknown as { id: number }).id;
          reportIdRef.current = id;
          setVisibleLogs((prev) => [...prev, "> Intelligence package ready.", "> Routing to dashboard..."]);
          setTimeout(() => {
            if (id) {
              setLocation(`/report/${id}`);
            } else {
              setLocation("/history");
            }
          }, 1500);
        },
        onError: () => {
          mutationDoneRef.current = true;
          setVisibleLogs((prev) => [
            ...prev,
            "> ERROR: Swarm deployment failed. Check API connectivity.",
          ]);
          setTimeout(() => setLocation("/"), 3000);
        },
      }
    );
  }, [setLocation, queryClient]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] font-mono">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <Terminal className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold tracking-tight">AGENT TERMINAL</h1>
        {loopCount > 0 && (
          <span className="text-xs text-muted-foreground">
            Deep pass {loopCount + 1}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
          <span className="text-xs text-primary uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex-1 bg-black rounded-lg border border-border p-6 shadow-2xl overflow-y-auto relative max-h-[60vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <AnimatePresence>
            {visibleLogs.map((log, index) => (
              <motion.div
                key={`${index}-${log}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-sm md:text-base ${
                  log.startsWith("> ERROR")
                    ? "text-red-400"
                    : log.startsWith("> Intelligence package ready") || log.startsWith("> Routing")
                    ? "text-green-400"
                    : "text-primary"
                }`}
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
          {!mutationDoneRef.current && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="w-3 h-5 bg-primary inline-block align-middle"
            />
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center tracking-wide">
        NVIDIA minimax-m2.7 + DuckDuckGo live research — this may take 1-2 minutes
      </p>
    </div>
  );
}
