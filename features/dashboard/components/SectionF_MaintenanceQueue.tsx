import { MaintenanceStrategy } from "@/lib/engineering/types";
import { cn } from "@/lib/utils";

import { QueueItem } from "@/lib/engineering/types";
import { useStore } from "@/lib/store";
import { CheckCircle2 } from "lucide-react";

export function SectionF_MaintenanceQueue({ items }: { items: QueueItem[] }) {
  const resolveTicket = useStore(state => state.resolveTicket);
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

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Prescriptive Maintenance Queue
        </h3>
      </div>
      
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
            {items.map((item) => (
              <tr key={item.id} className={cn("transition-colors", item.status === 'Ended' ? "opacity-60 bg-muted/5" : "hover:bg-muted/10")}>
                <td className="px-4 py-3">
                  <span className={cn("px-1.5 py-0.5 rounded-sm border font-semibold", getPriorityColor(item.priority, item.status))}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-foreground">{item.equipment}</td>
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
                      onClick={() => resolveTicket(item.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary rounded-md text-xs font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
