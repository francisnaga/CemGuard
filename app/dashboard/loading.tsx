import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest animate-pulse">
        Initializing CemGuard Engine...
      </p>
    </div>
  );
}
