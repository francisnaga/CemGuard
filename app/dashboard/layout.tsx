'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Bell, Play, PanelLeftOpen, Sun, Moon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AlertCenter } from '@/components/AlertCenter';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    plantState,
    presentationMode,
    selectedPlant,
    setSelectedPlant,
    togglePresentationMode,
    startIncidentReplay,
    dtEvents,
  } = useStore();

  const router = useRouter();
  const pathname = usePathname();

  // ── Light/dark toggle ────────────────────────────────────
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cemguard-theme');
    if (stored === 'light') {
      setIsLight(true);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add('light');
      localStorage.setItem('cemguard-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('cemguard-theme', 'dark');
    }
  };

  const handleDemoMode = () => {
    const currentState = useStore.getState();
    const nextState = !currentState.demoMode;
    currentState.setDemoMode(nextState);
    if (nextState) {
      setSelectedPlant('Obajana Plant');
      if (!presentationMode) togglePresentationMode();
      router.push('/dashboard');
    }
  };

  const alertCount = dtEvents.filter(
    (e) => e.category === 'Warning' || e.category === 'Critical'
  ).length;

  const statusColor =
    plantState === 'Emergency Shutdown' ? 'bg-destructive animate-pulse'
    : plantState === 'Peak Demand'      ? 'bg-warning animate-pulse'
    : 'bg-success';

  const navLinks = [
    { href: '/dashboard',           label: 'Overview' },
    { href: '/dashboard/simulator', label: 'Operations', pulse: true },
    { href: '/dashboard/reports',   label: 'Reports' },
    { href: '/dashboard/about',     label: 'About' },
  ];

  return (
    <div
      className={cn(
        'min-h-screen bg-background text-foreground font-sans transition-all duration-500',
        presentationMode ? 'scale-[1.02]' : ''
      )}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      {!presentationMode && (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
          <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between gap-4">

            {/* Left: wordmark + nav */}
            <div className="flex items-center gap-6 min-w-0">
              <Link
                href="/dashboard"
                className="font-black tracking-[0.18em] text-sm text-foreground shrink-0"
              >
                CEMGUARD
              </Link>

              <nav className="hidden md:flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-primary/10 text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    )}
                  >
                    {link.label}
                    {link.pulse && (
                      <span className="absolute top-1.5 right-1 w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Role / Current View picker */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/20 text-xs">
                <select
                  value={useStore(s => s.currentView)}
                  onChange={(e) => useStore.getState().setCurrentView(e.target.value as any)}
                  className="bg-transparent font-semibold text-primary focus:outline-none cursor-pointer"
                >
                  <option value="Executive">Executive View</option>
                  <option value="Plant Manager">Plant Manager View</option>
                  <option value="Reliability Engineer">Reliability Engineer View</option>
                  <option value="Maintenance Manager">Maintenance Manager View</option>
                </select>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>

              {/* Plant picker + live status dot */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-muted/20 text-xs">
                <span className={cn('w-2 h-2 rounded-full shrink-0', statusColor)} />
                <select
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                  className="bg-transparent font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="Obajana Plant">Obajana</option>
                  <option value="Ibese Plant">Ibese</option>
                  <option value="Gboko Plant">Gboko</option>
                  <option value="Okpella Plant">Okpella</option>
                </select>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>

              {/* Divider */}
              <div className="h-5 w-px bg-border hidden sm:block" />

              {/* Theme */}
              <button
                onClick={toggleTheme}
                title={isLight ? 'Dark mode' : 'Light mode'}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {/* Bell / Alert Center */}
              <AlertCenter />

              {/* Demo */}
              <button
                onClick={handleDemoMode}
                title={useStore(s => s.demoMode) ? "Exit Demo Mode" : "Run known-good pitch demo"}
                className={cn(
                  "hidden md:flex items-center gap-1.5 px-3 py-1.5 border rounded-md transition-all text-xs font-bold",
                  useStore(s => s.demoMode) 
                    ? "bg-destructive text-white border-destructive hover:bg-destructive/90 animate-pulse" 
                    : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                )}
              >
                <Play className={cn("h-3.5 w-3.5", useStore(s => s.demoMode) ? "fill-white" : "fill-primary")} />
                {useStore(s => s.demoMode) ? "LIVE DEMO ACTIVE" : "Demo"}
              </button>

              {/* Presentation */}
              <button
                onClick={togglePresentationMode}
                title="Presentation mode (full-screen clean view)"
                className="hidden md:flex items-center p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border transition-colors"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>

              {/* Avatar */}
              <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-[11px] font-bold">
                AM
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="max-w-[1600px] w-full mx-auto px-6 pt-6 pb-24">
        {children}
      </main>

      {/* Footer bar */}
      {!presentationMode && (
        <footer className="fixed bottom-0 left-0 w-full border-t border-border bg-background/90 backdrop-blur-md py-2 px-6 z-40">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex gap-5">
              <span>
                <strong>Models:</strong> Weibull · ISO 20816 · Archard Wear Law · RCM · Theory of Constraints
              </span>
              <span className="hidden lg:inline">
                <strong>Data:</strong> Representative engineering parameters — not proprietary Dangote operational data
              </span>
            </div>
            <span className="font-bold uppercase tracking-widest text-[10px] border border-border px-2 py-1 rounded shrink-0">
              Research Prototype
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
