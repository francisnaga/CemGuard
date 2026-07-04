import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold tracking-tight text-primary">CemGuard</h2>
        <p className="text-xs text-muted-foreground mt-1">Dangote Cement Plc</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link href="/dashboard" className="block p-2 rounded-md hover:bg-muted text-sm text-foreground">Dashboard</Link>
        <Link href="/equipment" className="block p-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground">Equipment</Link>
        <Link href="/plant" className="block p-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground">Plant Layout</Link>
        <Link href="/maintenance" className="block p-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground">Maintenance</Link>
        <Link href="/analytics" className="block p-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground">Analytics</Link>
        <Link href="/reports" className="block p-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground">Reports</Link>
        <Link href="/simulator" className="block p-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground">Simulator</Link>
      </nav>
      <div className="p-4 border-t border-border">
        <Link href="/settings" className="block p-2 rounded-md hover:bg-muted text-sm text-muted-foreground hover:text-foreground">Settings</Link>
      </div>
    </aside>
  );
}
