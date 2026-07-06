"use client";
import { MaintenanceStrategy } from "@/lib/engineering/types";
import { cn } from "@/lib/utils";

import { QueueItem } from "@/lib/engineering/types";
import { useStore } from "@/lib/store";
import { CheckCircle2, History, X } from "lucide-react";
import { useState } from "react";

export function SectionF_MaintenanceQueue({ items }: { items: QueueItem[] }) {
  const resolveMaintenanceIssue = useStore(state => state.resolveMaintenanceIssue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const getPriorityColor = (p: string, status: string) => {
    if (status === 'Ended') return 'text-muted-foreground bg-muted border-border';
    switch(p) {
      case 'Critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'High': return 'text-warning bg-warning/10 border-warning/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'Low': return 'text-success bg-success/10 border-success/20';
      default: return '';
    }
  };

  const displayItems = items.slice(0, 5);

  const groupedItems = items.reduce((acc, item) => {
    const day = item.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {} as Record<number, QueueItem[]>);
  
  const days = Object.keys(groupedItems).map(Number).sort((a, b) => b - a);

  const renderTableRows = (rowItems: QueueItem[]) => (
    rowItems.map((item) => (
      <tr key={item.id} className={cn("transition-colors", item.status === 'Ended' ? "opacity-60 bg-muted/5" : "hover:bg-muted/10")}>
        <td className="px-4 py-3">
          <span className={cn("px-1.5 py-0.5 rounded-sm border font-semibold", getPriorityColor(item.priority, item.status))}>
            {item.priority}
          </span>
        </td>
        <td className="px-4 py-3 font-semibold text-foreground">
          {item.equipment}
          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {item.id}</div>
        </td>
        <td className="px-4 py-3 text-muted-foreground">{item.failureMode}</td>
        <td className="px-4 py-3 text-foreground">{item.strategy}</td>
        <td className="px-4 py-3 text-right font-mono text-foreground">
          {item.confidence}%
        </td>
        <td className="px-4 py-3 text-right font-mono text-muted-foreground">{item.deadline}</td>
        <td className="px-4 py-3">
          <span className={cn("px-1.5 py-0.5 rounded-sm border text-[10px] uppercase tracking-wider font-semibold", 
            item.status === 'Ended' ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"
          )}>
            {item.status}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          {item.status !== 'Ended' && (
            <button 
              onClick={() => {
                const machine = useStore.getState().dtMachines.find(m => m.name === item.equipment);
                if (machine) {
                  resolveMaintenanceIssue(machine.id, item.id);
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-md text-xs font-semibold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Resolve
            </button>
          )}
        </td>
      </tr>
    ))
  );

  return (
    <>
      <div className="bg-card border border-border rounded-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Prescriptive Maintenance Queue
          </h3>
          <span className="text-xs text-muted-foreground">Showing latest {displayItems.length}</span>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-muted-foreground uppercase tracking-wider bg-muted/30">
              <tr>
                <th className="px-4 py-2 font-semibold">Priority</th>
                <th className="px-4 py-2 font-semibold">Equipment</th>
                <th className="px-4 py-2 font-semibold">Predicted Mode</th>
                <th className="px-4 py-2 font-semibold">Strategy</th>
                <th className="px-4 py-2 font-semibold text-right">Confidence</th>
                <th className="px-4 py-2 font-semibold text-right">Deadline</th>
                <th className="px-4 py-2 font-semibold">Status</th>
                <th className="px-4 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {renderTableRows(displayItems)}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No tickets currently in the queue.
            </div>
          )}
        </div>

        {items.length > 5 && (
          <div className="p-3 border-t border-border bg-muted/10 flex justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted/50 rounded-md transition-colors"
            >
              <History className="w-4 h-4" />
              See Full History ({items.length} tickets)
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground">Ticket History</h2>
                <p className="text-sm text-muted-foreground mt-1">Complete log of all maintenance events and resolutions.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-muted/5">
              {days.map((day) => (
                <div key={day} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Simulation Day {day}
                    </h3>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  
                  <div className="bg-card border border-border rounded-md overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-muted-foreground uppercase tracking-wider bg-muted/30">
                          <tr>
                            <th className="px-4 py-2 font-semibold">Priority</th>
                            <th className="px-4 py-2 font-semibold">Equipment</th>
                            <th className="px-4 py-2 font-semibold">Predicted Mode</th>
                            <th className="px-4 py-2 font-semibold">Strategy</th>
                            <th className="px-4 py-2 font-semibold text-right">Confidence</th>
                            <th className="px-4 py-2 font-semibold text-right">Deadline</th>
                            <th className="px-4 py-2 font-semibold">Status</th>
                            <th className="px-4 py-2 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-xs">
                          {renderTableRows(groupedItems[day])}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
