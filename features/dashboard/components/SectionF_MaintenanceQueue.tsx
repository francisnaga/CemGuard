"use client";
import { cn } from "@/lib/utils";
import { QueueItem } from "@/lib/engineering/types";
import { useStore } from "@/lib/store";
import { CheckCircle2, History, X, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { useState } from "react";

export function SectionF_MaintenanceQueue({ items }: { items: QueueItem[] }) {
  const resolveMaintenanceIssue = useStore(state => state.resolveMaintenanceIssue);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPriorityConfig = (p: string, status: string) => {
    if (status === 'Ended') return {
      badge: 'text-muted-foreground bg-muted/50 border-border',
      icon: null,
    };
    switch (p) {
      case 'Critical': return {
        badge: 'text-red-400 bg-red-500/10 border-red-500/25 font-bold',
        icon: AlertOctagon,
      };
      case 'High': return {
        badge: 'text-orange-400 bg-orange-500/10 border-orange-500/25 font-bold',
        icon: AlertTriangle,
      };
      case 'Medium': return {
        badge: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
        icon: AlertTriangle,
      };
      case 'Low': return {
        badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
        icon: Info,
      };
      default: return { badge: '', icon: null };
    }
  };

  const displayItems = items.filter(item => item.status !== 'Ended').slice(0, 5);

  const groupedItems = items.reduce((acc, item) => {
    const day = item.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {} as Record<number, QueueItem[]>);

  const days = Object.keys(groupedItems).map(Number).sort((a, b) => b - a);

  const renderTableRows = (rowItems: QueueItem[]) =>
    rowItems.map((item) => {
      const config = getPriorityConfig(item.priority, item.status);
      const IconComponent = config.icon;
      return (
        <tr
          key={item.id}
          className={cn(
            "transition-colors border-b border-border/60 last:border-0",
            item.status === 'Ended'
              ? "opacity-50 bg-muted/5"
              : "hover:bg-muted/10"
          )}
        >
          {/* Priority */}
          <td className="px-4 py-3 whitespace-nowrap">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs",
              config.badge
            )}>
              {IconComponent && <IconComponent className="w-3 h-3 shrink-0" />}
              {item.priority}
            </span>
          </td>

          {/* Equipment */}
          <td className="px-4 py-3">
            <p className="font-semibold text-foreground text-sm">{item.equipment}</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {item.id}</p>
          </td>

          {/* Failure Mode */}
          <td className="px-4 py-3 text-muted-foreground text-xs">{item.failureMode}</td>

          {/* Strategy */}
          <td className="px-4 py-3 text-foreground text-xs font-medium">{item.strategy}</td>

          {/* Confidence – right aligned */}
          <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-foreground">
            {item.confidence}%
          </td>

          {/* Deadline – right aligned */}
          <td className="px-4 py-3 text-right font-mono text-xs tabular-nums text-muted-foreground">
            {item.deadline}
          </td>

          {/* Status */}
          <td className="px-4 py-3">
            <span className={cn(
              "px-2 py-0.5 rounded-md border text-[10px] uppercase tracking-wider font-bold",
              item.status === 'Ended'
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-muted text-muted-foreground border-border"
            )}>
              {item.status}
            </span>
          </td>

          {/* Action */}
          <td className="px-4 py-3 text-right">
            {item.status !== 'Ended' && (
              <button
                onClick={() => {
                  const machine = useStore.getState().dtMachines.find(m => m.name === item.equipment);
                  if (machine) resolveMaintenanceIssue(machine.id, item.id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolve
              </button>
            )}
          </td>
        </tr>
      );
    });

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-muted/20">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Prescriptive Maintenance Queue
          </h3>
          <span className="text-xs text-muted-foreground">Showing latest {displayItems.length}</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                {['Priority', 'Equipment', 'Predicted Mode', 'Strategy', 'Confidence', 'Deadline', 'Status', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      "px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
                      (i === 4 || i === 5 || i === 7) ? "text-right" : "text-left"
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs">
              {renderTableRows(displayItems)}
            </tbody>
          </table>

          {items.length === 0 && (
            <div className="p-10 text-center text-muted-foreground text-sm">
              No tickets currently in the queue.
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 5 && (
          <div className="px-4 py-3 border-t border-border bg-muted/10 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              See Full History ({items.length} tickets)
            </button>
          </div>
        )}
      </div>

      {/* History Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-muted/30">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">Ticket History</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Complete log of all maintenance events and resolutions.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-muted/5">
              {days.map((day) => (
                <div key={day} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                      Simulation Day {day}
                    </h3>
                    <div className="h-px flex-1 bg-border/60" />
                  </div>

                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/30 border-b border-border">
                          <tr>
                            {['Priority', 'Equipment', 'Predicted Mode', 'Strategy', 'Confidence', 'Deadline', 'Status', 'Actions'].map((h, i) => (
                              <th
                                key={h}
                                className={cn(
                                  "px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
                                  (i === 4 || i === 5 || i === 7) ? "text-right" : "text-left"
                                )}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="text-xs">
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
