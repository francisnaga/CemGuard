'use client';

import { useState } from 'react';
import { Bell, X, AlertTriangle, Info, Wrench } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function AlertCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const dtEvents = useStore(s => s.dtEvents);

  const alertCount = dtEvents.filter(
    (e) => e.category === 'Warning' || e.category === 'Critical'
  ).length;

  const getEventIcon = (cat: string) => {
    switch(cat) {
      case 'Information': return <Info className="h-4 w-4 text-blue-500" />;
      case 'Warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Maintenance': return <Wrench className="h-4 w-4 text-orange-500" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
      >
        <Bell className="h-4 w-4" />
        {alertCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center leading-none">
            {Math.min(9, alertCount)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/50 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Slide-in panel */}
          <div className="relative w-full max-w-sm h-full bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-sm font-bold uppercase tracking-wider flex items-center">
                <Bell className="h-4 w-4 mr-2" /> Alert Center
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dtEvents.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm mt-10">No alerts found.</p>
              ) : (
                dtEvents.map(evt => (
                  <div key={evt.id} className="flex space-x-3 text-sm">
                    <span className="font-mono text-muted-foreground shrink-0 mt-0.5">{evt.time}</span>
                    <div className="shrink-0 mt-1">{getEventIcon(evt.category)}</div>
                    <div>
                      <span className="font-mono text-[10px] font-semibold mr-2 px-1 rounded bg-muted text-muted-foreground">{evt.code}</span>
                      <p className="text-foreground text-[13px] mt-1">{evt.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
