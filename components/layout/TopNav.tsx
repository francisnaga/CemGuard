import Link from 'next/link';

export function TopNav() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center text-sm text-muted-foreground">
        {/* Breadcrumb will be dynamic */}
        <span>Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium">Alerts (0)</div>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-xs cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
