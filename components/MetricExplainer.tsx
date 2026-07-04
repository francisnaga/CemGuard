'use client';

import { Info } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MetricExplainerProps {
  title: string;
  formula?: string;
  basis?: string;
  children: React.ReactNode;
}

export function MetricExplainer({ title, formula, basis, children }: MetricExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // If there's no formula and no basis, don't show the popover at all to avoid empty tooltips
  if (!formula && !basis) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <div className="flex items-center space-x-1 cursor-help">
        {children}
        <Info className="h-3 w-3 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity" />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-72 p-4 mt-2 bg-popover border border-border rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <h4 className="text-sm font-bold text-foreground mb-2">{title}</h4>
          
          {formula && (
            <div className="mb-3 p-2 bg-muted/50 rounded-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Equation</span>
              <code className="text-xs font-mono text-primary">{formula}</code>
            </div>
          )}
          
          {basis && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Engineering Basis</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {basis}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
