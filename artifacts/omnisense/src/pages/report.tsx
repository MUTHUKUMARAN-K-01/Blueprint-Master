import { useGetReport } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, Users, Target, Activity, 
  MapPin, Eye, Building, MessageSquare, Code 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Report() {
  const params = useParams();
  const reportId = Number(params.id);

  const { data, isLoading, error } = useGetReport(reportId, {
    query: { enabled: !!reportId, queryKey: ['/api/reports', reportId] as any }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 bg-card" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-48 w-full bg-card" />)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 text-destructive font-mono">
        <AlertTriangle className="h-10 w-10 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Failed to load report</h2>
      </div>
    );
  }

  const { report } = data;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h1 className="text-4xl font-black font-sans tracking-tight mb-2 uppercase">
            {report.companyName}
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono text-primary border-primary/30 rounded-sm">
              {report.category}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </span>
          </div>
        </div>
        <Badge variant="secondary" className="font-mono bg-primary/10 text-primary border-none text-xs">
          <ShieldCheck className="h-3 w-3 mr-1" />
          DATA VERIFIED
        </Badge>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* 1. Company Overview */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <Building className="h-4 w-4 text-primary" /> Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base leading-relaxed">{report.companyOverview}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. Market Position */}
        <motion.div variants={item}>
          <Card className="bg-card/50 border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <Target className="h-4 w-4 text-primary" /> Market Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{report.marketPosition}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Strategic Watchouts */}
        <motion.div variants={item}>
          <Card className="bg-card/50 border-destructive/20 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <Badge variant="outline" className="font-mono text-[10px] border-destructive/30 text-destructive">
                GraphRAG Powered
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-destructive" /> Strategic Watchouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{report.strategicWatchouts}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 4. Competitor Mapping */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <Activity className="h-4 w-4 text-primary" /> Competitor Mapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.competitorMapping.map((comp, idx) => (
                  <div key={idx} className="bg-background rounded border border-border/50 p-4">
                    <h4 className="font-bold font-mono text-primary mb-2">{comp.name}</h4>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-muted-foreground font-mono">Strengths:</span>
                        <p className="mt-1">{comp.strengths}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-mono">Gaps:</span>
                        <p className="mt-1">{comp.gaps}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 5. Brand Activity & 6. Experiential Footprint */}
        <motion.div variants={item} className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <Eye className="h-4 w-4 text-primary" /> Brand Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{report.brandActivity}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Experiential Footprint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{report.experientialFootprint}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 7. Decision Makers & 8. Contact Intel */}
        <motion.div variants={item} className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <Target className="h-4 w-4 text-primary" /> Decision-Maker Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.decisionMakerRoles.map((role, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-3 bg-background rounded border border-border/50">
                  <h4 className="font-bold text-sm text-primary">{role.title}</h4>
                  <p className="text-xs text-muted-foreground">{role.rationale}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <Users className="h-4 w-4 text-primary" /> Contact Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.contactIntelligence.map((contact, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-3 bg-background rounded border border-border/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">{contact.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono">{contact.title}</p>
                    </div>
                    {contact.verified ? (
                      <Badge variant="outline" className="text-[10px] border-primary/50 text-primary">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-destructive/50 text-destructive">Unverified</Badge>
                    )}
                  </div>
                  <div className="text-xs font-mono space-y-1 text-muted-foreground">
                    {contact.email && <div>Email: <span className="text-foreground">{contact.email}</span></div>}
                    {contact.phone && <div>Phone: <span className="text-foreground">{contact.phone}</span></div>}
                    {contact.linkedin && <div>LinkedIn: <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">Profile</a></div>}
                    {(!contact.email && !contact.phone) && <div className="text-destructive/80 italic">Data Unavailable</div>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* 9. Outreach & 10. Pixel */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-mono text-sm uppercase text-muted-foreground">
                <MessageSquare className="h-4 w-4 text-primary" /> Outreach Sequences & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-background border border-border/50 mb-4">
                  <TabsTrigger value="email" className="font-mono text-xs">Email</TabsTrigger>
                  <TabsTrigger value="linkedin" className="font-mono text-xs">LinkedIn</TabsTrigger>
                  <TabsTrigger value="pixel" className="font-mono text-xs">Tracking Pixel</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-4">
                  <div className="bg-background p-4 rounded border border-border/50">
                    <div className="mb-2 text-xs font-mono text-muted-foreground border-b border-border/50 pb-2">
                      <span className="text-primary">Subject:</span> {report.outreach.emailSubject}
                    </div>
                    <div className="text-sm whitespace-pre-wrap font-sans">{report.outreach.emailBody}</div>
                  </div>
                </TabsContent>

                <TabsContent value="linkedin" className="space-y-4">
                  <div className="bg-background p-4 rounded border border-border/50">
                    <div className="text-sm whitespace-pre-wrap font-sans">{report.outreach.linkedinMessage}</div>
                  </div>
                </TabsContent>

                <TabsContent value="pixel" className="space-y-4">
                  <div className="bg-background p-4 rounded border border-border/50 space-y-4">
                    <p className="text-sm text-muted-foreground">{report.outreach.trackingLogicExplanation}</p>
                    <div className="relative">
                      <div className="absolute top-2 right-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <pre className="bg-[#0a0a0a] p-4 rounded text-xs font-mono text-primary overflow-x-auto">
                        <code>{report.outreach.trackingPixelHtml}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
