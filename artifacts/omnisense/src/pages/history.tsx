import { useListReports } from "@workspace/api-client-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { FileText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function History() {
  const { data: reports, isLoading } = useListReports();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-mono font-bold tracking-tight">MISSION ARCHIVE</h1>
        <p className="text-muted-foreground font-mono text-sm mt-2">
          Previously generated intelligence reports.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full bg-card" />
          ))}
        </div>
      ) : reports && reports.length > 0 ? (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Link key={report.id} href={`/report/${report.id}`} data-testid={`link-report-${report.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer group bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg font-mono">{report.companyName}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="font-mono text-xs uppercase bg-secondary px-2 py-0.5 rounded">
                          {report.category}
                        </span>
                        <span className="font-mono text-xs">
                          {format(new Date(report.createdAt), "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-lg">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-mono font-medium">No reports found</h3>
          <p className="text-muted-foreground font-mono text-sm mb-6">
            You haven't generated any intelligence reports yet.
          </p>
          <Link href="/" className="text-primary font-mono text-sm hover:underline">
            Initiate Recon →
          </Link>
        </div>
      )}
    </div>
  );
}
