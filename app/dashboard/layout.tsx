/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Bell, Play, PanelLeftOpen, Sun, Moon, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AlertCenter } from '@/components/AlertCenter';
import { AssumptionsPanel } from '@/components/AssumptionsPanel';

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
    currentView,
  } = useStore();

  const router = useRouter();
  const pathname = usePathname();

  // ── Light/dark toggle ────────────────────────────────────
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cemguard-theme');
    if (stored === 'light') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
                    <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                    </div>
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
                value={currentView}
                onChange={(e) => useStore.getState().setCurrentView(e.target.value as any)}
                className="bg-transparent font-semibold text-primary focus:outline-none cursor-pointer max-w-[140px] truncate appearance-none"
              >
                <option className="bg-background text-foreground" value="Executive">Executive</option>
                <option className="bg-background text-foreground" value="Plant Manager">Plant Manager</option>
                <option className="bg-background text-foreground" value="Reliability Engineer">Reliability Engineer</option>
                <option className="bg-background text-foreground" value="Maintenance Manager">Maintenance Manager</option>
              </select>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>

            {/* Scenario picker */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-primary/5 text-xs">
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    useStore.getState().loadScenario(val as any);
                    if (!useStore.getState().dtIsRunning) useStore.getState().dtStart();
                  }
                }}
                className="bg-transparent font-bold text-primary focus:outline-none cursor-pointer max-w-[110px] truncate appearance-none"
                defaultValue=""
              >
                <option className="bg-background text-foreground" value="" disabled>Scenario...</option>
                <option className="bg-background text-foreground" value="Healthy Plant">Healthy Plant</option>
                <option className="bg-background text-foreground" value="Progressive Wear">Progressive Wear</option>
                <option className="bg-background text-foreground" value="Imminent Failure">Imminent Failure</option>
                <option className="bg-background text-foreground" value="Emergency Shutdown">Emergency Shutdown</option>
              </select>
              <ChevronDown className="h-3 w-3 text-primary" />
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-border hidden sm:block" />

            {/* Bell / Alert Center */}
            <AlertCenter />

            {/* Theme */}
            <button
              onClick={toggleTheme}
              title={isLight ? 'Dark mode' : 'Light mode'}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>
      )}

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        {children}
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="fixed bottom-0 w-full border-t border-border bg-background/80 backdrop-blur-md z-40">
        <div className="max-w-[1600px] mx-auto px-6 h-8 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
          <div className="flex gap-4">
            <span>Models: Weibull • ISO 20816 • Archard Wear Law • RCM • Theory of Constraints</span>
            <span className="hidden sm:inline-block">Data: Representative engineering parameters — not proprietary Dangote operational data</span>
          </div>
          <div className="flex items-center gap-4">
            <AssumptionsPanel />
            <span className="text-primary font-bold border border-border px-2 py-0.5 rounded">RESEARCH PROTOTYPE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
