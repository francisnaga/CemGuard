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
              <p>Failure Probability: F(t) = 1 - e^-(t/η)^β</p>
              <p>Where:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong className="text-foreground">t</strong> = operating time</li>
                <li><strong className="text-foreground">η (eta)</strong> = characteristic life (time at which 63.2% will fail)</li>
                <li><strong className="text-foreground">β (beta)</strong> = shape parameter (β &gt; 1 indicates wear-out failure)</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <LineChart className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Cost-of-Failure & ROI Engine</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm mb-8">
              The Decision Engine calculates exposure continuously. If the Crusher's nominal throughput is 5,000 tpd and clinker margin is ₦14,200/ton, an unexpected 28-hour downtime event generates a direct revenue exposure of ₦82.8M. The engine compares this against the cost of an 8-hour planned shutdown (₦12.0M) to generate the deterministic "⭐ Recommended" flag.
            </p>
          </section>

          <section className="bg-muted/30 border border-border rounded-xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center border-b border-border pb-2">
              Project Scope
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-bold text-success flex items-center mb-3">
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Current Prototype
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✔ Predictive maintenance simulation</li>
                  <li>✔ Business impact modelling</li>
                  <li>✔ Scenario analysis & Digital Twin</li>
                  <li>✔ Executive Decision support</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-destructive flex items-center mb-3">
                  <X className="h-4 w-4 mr-2" /> Not Included
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>✖ Live PLC integration</li>
                  <li>✖ Real industrial SCADA connectivity</li>
                  <li>✖ Production scheduling</li>
                  <li>✖ Real sensor acquisition</li>
                </ul>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
              <Layers className="h-4 w-4 mr-2" /> Tech Stack
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Frontend</span>
                <span className="text-muted-foreground">Next.js 15 (React)</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Styling</span>
                <span className="text-muted-foreground">Tailwind CSS</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">State / Physics</span>
                <span className="text-muted-foreground">Zustand</span>
              </li>
              <li className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Database</span>
                <span className="text-muted-foreground">Supabase (PostgreSQL)</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border p-6 rounded-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
              <FileCode2 className="h-4 w-4 mr-2" /> Prototype Status
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong>Note:</strong> This application is a research prototype developed for the Dangote Cement engineering competition.
              </p>
              <p>
                The engineering thresholds, equipment baselines, and financial values are demonstrative and not derived from proprietary Dangote operational data.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
