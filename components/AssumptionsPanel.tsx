'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AssumptionsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="View Engineering Assumptions"
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-primary/20 bg-primary/5 text-primary rounded-md transition-all text-xs font-bold hover:bg-primary/10"
      >
        <Info className="h-3.5 w-3.5" />
        Assumptions
      </button>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="relative w-full max-w-sm h-full bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Engineering Assumptions
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                This prototype is built on the following engineering boundary conditions and assumptions:
              </p>

              <ul className="space-y-3">
                {[
                  "Representative operating hours and loads",
                  "ISO 20816 vibration thresholds (Zone A-D)",
                  "Weibull failure distribution parameters",
                  "Archard's wear equation baseline",
                  "Illustrative repair costs & downtime",
                  "No live PLC/SCADA connection",
                  "No proprietary plant data used",
                  "Strictly a Research Prototype"
                ].map((assumption, i) => (
                  <li key={i} className="flex gap-2 text-sm text-card-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
