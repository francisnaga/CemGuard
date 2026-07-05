import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Top Row: KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[120px] bg-muted/40 border border-border rounded-lg" />
        ))}
      </div>

      {/* Middle Row: Insight & Plant SVG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-[300px] bg-muted/30 border border-border rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Initializing Simulator Engine</p>
          </div>
        </div>
        <div className="lg:col-span-7 h-[300px] bg-muted/20 border border-border rounded-lg" />
      </div>

      {/* Bottom Row: Ranking & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-[400px] bg-muted/30 border border-border rounded-lg" />
        <div className="lg:col-span-8 h-[400px] bg-muted/20 border border-border rounded-lg" />
      </div>
    </div>
  );
}
