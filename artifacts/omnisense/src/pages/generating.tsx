import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGenerateIntelligence, getListReportsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

const LOG_LINES = [
  "Initializing Research Swarm...",
  "Dispatching DuckDuckGo crawl agents...",
  "Scraping corporate website and press releases...",
  "Extracting competitor signal data...",
  "Building real-time Knowledge Graph...",
  "Mapping competitor nodes and overlap vectors...",
  "Querying NVIDIA minimax-m2.7 synthesis engine...",
  "Applying Zero-Hallucination contact guardrails...",
  "Synthesizing Strategic Watchouts via GraphRAG...",
  "Drafting personalized outreach sequences...",
  "Generating tracking pixel and webhook logic...",
  "Running final intelligence validation pass...",
];

export default function Generating() {
  const [, setLocation] = useLocation();
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const queryClient = useQueryClient();
  const generateMutation = useGenerateIntelligence();
  const mutateRef = useRef(generateMutation.mutate);
  mutateRef.current = generateMutation.mutate;

  const hasStarted = useRef(false);
  const mutationDoneRef = useRef(false);
  const companyNameRef = useRef<string>("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    companyNameRef.current = searchParams.get("company") || "Target";
  }, []);

  // Add logs progressively
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (mutationDoneRef.current) {
        clearInterval(interval);
        return;
      }
      setVisibleLogs((prev) => {
        if (i < LOG_LINES.length) {
          const next = [...prev, LOG_LINES[i]];
          i++;
          return next;
        }
        return prev;
      });
      setProgress((p) => Math.min(p + (100 / LOG_LINES.length), 95));
    }, 1200);

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
          setIsComplete(true);
          setProgress(100);
          queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
          
          const id = (report as unknown as { id: number }).id;
          setTimeout(() => {
            if (id) {
              setLocation(`/report/${id}`);
            } else {
              setLocation("/history");
            }
          }, 2000);
        },
        onError: () => {
          mutationDoneRef.current = true;
          setVisibleLogs((prev) => [
            ...prev,
            "ERROR: Swarm deployment failed. Check API connectivity.",
          ]);
          setTimeout(() => setLocation("/"), 3000);
        },
      }
    );
  }, [setLocation, queryClient]);

  return (
    <div className="flex-1 bg-[#f5f5f7] flex items-center justify-center p-4">
      <div className="w-full max-w-[560px] bg-white rounded-[18px] border border-[#d2d2d7] p-8 shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col items-center justify-center mb-8 text-center space-y-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {isComplete ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[#34c759]">
                <CheckCircle2 className="w-12 h-12" />
              </motion.div>
            ) : (
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 rounded-full border-4 border-[#f5f5f7] border-t-[#0066cc]"
              />
            )}
          </div>
          
          <div>
            <h1 className="text-[34px] font-[600] tracking-[-0.374px] text-[#1d1d1f]">
              {isComplete ? "Intelligence Ready" : "Deploying Swarm"}
            </h1>
            <div className="inline-flex items-center mt-2 bg-[#0066cc]/10 text-[#0066cc] px-3 py-1 rounded-full text-[14px] font-[600]">
              {companyNameRef.current}
            </div>
          </div>
        </div>

        <div className="h-[160px] overflow-y-auto mb-6 mask-image-bottom">
          <div className="flex flex-col space-y-3">
            <AnimatePresence>
              {visibleLogs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-[17px] ${log.startsWith("ERROR") ? "text-[#ff3b30]" : "text-[#6e6e73]"}`}
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[2px] w-full bg-[#f5f5f7] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#0066cc]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>

      </div>
    </div>
  );
}
