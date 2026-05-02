import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, ChevronRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [, setLocation] = useLocation();
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !category.trim()) {
      setError("Both company name and category are required.");
      return;
    }
    
    // Navigate to /generating with query params
    const params = new URLSearchParams({ company: companyName, category });
    setLocation(`/generating?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mx-auto space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-mono font-bold tracking-tighter sm:text-5xl">
            INITIATE <span className="text-primary">RECON</span>
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            Enter target parameters to deploy market intelligence swarm.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6 bg-card p-8 rounded-lg border border-border shadow-2xl">
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm font-mono bg-destructive/10 p-3 rounded border border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="companyName" className="font-mono uppercase text-xs tracking-wider text-muted-foreground">Target Entity</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                placeholder="e.g. Acme Corp"
                className="pl-9 font-mono bg-background border-border focus-visible:ring-primary h-12"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                data-testid="input-company-name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="font-mono uppercase text-xs tracking-wider text-muted-foreground">Market Sector / Category</Label>
            <Input
              id="category"
              placeholder="e.g. B2B SaaS for Logistics"
              className="font-mono bg-background border-border focus-visible:ring-primary h-12"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-testid="input-category"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full font-mono uppercase tracking-widest h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-generate"
          >
            Deploy Swarm
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
