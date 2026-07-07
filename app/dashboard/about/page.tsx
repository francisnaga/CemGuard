import { ShieldAlert, Activity, BookOpen, ChevronRight, Layers, FileCode2, LineChart, CheckCircle2, X } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">Engineering Methodology & Architecture</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
          CemGuard is a comprehensive Industrial Decision Support System (DSS) designed to transition cement manufacturing from reactive monitoring to predictive, financially-optimized maintenance strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-12">
          
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <ShieldAlert className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">The Problem: Reactive Failure</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
              In heavy industrial environments like cement manufacturing, unexpected equipment failure does not occur in isolation. A failing crusher starves the raw mill, slowing the kiln, and ultimately choking the packing plant. Traditional SCADA dashboards only display current states, leaving executives to guess the future financial impact of maintenance delays.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm">
              CemGuard bridges the gap between mechanical engineering (telemetry) and business leadership (ROI) by simulating the cascading physics of the plant.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Reliability Models (Weibull)</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
              The core simulation engine utilizes the Weibull distribution, the standard methodology for reliability engineering and life data analysis.
            </p>
            <div className="bg-muted/30 border border-border p-5 rounded-xl font-mono text-xs text-muted-foreground space-y-2">
              <p>Failure Probability: F(t) = 1 - e^-(t/η)^beta</p>
              <p>Where:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong className="text-foreground">t</strong> = operating time</li>
                <li><strong className="text-foreground">η (eta)</strong> = characteristic life (time at which 63.2% will fail)</li>
                <li><strong className="text-foreground">beta (beta)</strong> = shape parameter (beta &gt; 1 indicates wear-out failure)</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <LineChart className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Cost-of-Failure & ROI Engine</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm mb-8">
              The Decision Engine calculates exposure continuously. If the plant&apos;s nominal throughput is 10,800 tpd and wholesale cement value is NGN 120,000/ton, an unexpected 72-hour catastrophic emergency shutdown generates a direct production loss cost of NGN 3.88B. The engine compares this against the exact cost of a 2-hour preventive planned shutdown (NGN 113.0M) to generate deterministic, financially-backed maintenance strategies.
            </p>
          </section>

          <section className="bg-muted/30 border border-border rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center border-b border-border pb-2">
              Roadmap & Pilot Details (180-Day Rollout)
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Immediate (0–30 days):</strong> Deploy vibration/thermal sensors on Rotary Kiln Line 1, Obajana. Confirm DCS/SCADA access. Baseline Weibull/HI parameters.
              </div>
              <div>
                <strong className="text-foreground">Short-term (30–90 days):</strong> Run in “Shadow Mode” against historical failure logs. Train reliability team; standardise “Ended” status workflow. Begin WhatsApp Business API alert beta.
              </div>
              <div>
                <strong className="text-foreground">Medium-term (90–180 days):</strong> Full control-room integration. Track pre-empted failures vs. a 90-day control period. Plan scaling to Ibese, Gboko, Okpella.
              </div>
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg text-primary text-xs mt-3">
                <strong>Pilot Ask:</strong> A 90-day pilot covering Phases 1–2 above at Obajana / Rotary Kiln Line 1 before a Phase 3 scaling decision. This is a subset of the 180-day rollout, not a competing timeline.
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
              <Layers className="h-4 w-4 mr-2" /> Project & Tech Stack
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Institution</span>
                <span className="text-muted-foreground">Nigerian Maritime University</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Track</span>
                <span className="text-muted-foreground">Track 2 (Predictive Maint.)</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Pilot Asset</span>
                <span className="text-muted-foreground">Obajana, Kiln Line 1</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Scaling Targets</span>
                <span className="text-muted-foreground">Ibese, Gboko, Okpella</span>
              </li>
              <li className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <span className="font-semibold text-foreground">Frontend</span>
                <span className="text-muted-foreground">Next.js 15 (React)</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Styling</span>
                <span className="text-muted-foreground">Tailwind CSS</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">State / Physics</span>
                <span className="text-muted-foreground">Zustand (Single Store)</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Database</span>
                <span className="text-muted-foreground">Supabase (PostgreSQL)</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
              <FileCode2 className="h-4 w-4 mr-2" /> Data Disclosure
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p className="italic font-medium text-foreground">
                “Due to a lack of live plant data, CemGuard operates on a deterministic physics engine simulating real-world telemetry.”
              </p>
              <p className="text-xs">
                Developed for the Dangote Cement engineering competition.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
