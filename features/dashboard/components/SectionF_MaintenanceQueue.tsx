import { MaintenanceStrategy } from "@/lib/engineering/types";
import { cn } from "@/lib/utils";

interface QueueItem {
  id: string;
  equipment: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  strategy: MaintenanceStrategy;
  failureMode: string;
  confidence: number;
  deadline: string;
  status: 'Pending' | 'Scheduled' | 'In Progress';
}

export function SectionF_MaintenanceQueue({ items }: { items: QueueItem[] }) {
  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Critical': return 'text-destructive bg-destructive/10';
      case 'High': return 'text-orange-500 bg-orange-500/10';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'Low': return 'text-success bg-success/10';
      default: return '';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 overflow-hidden">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Prescriptive Maintenance Queue
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-3 rounded-tl-md">Priority</th>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3">Predicted Mode</th>
              <th className="px-4 py-3">Strategy</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3 rounded-tr-md">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-semibold", getPriorityColor(item.priority))}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{item.equipment}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.failureMode}</td>
                <td className="px-4 py-3 text-foreground">{item.strategy}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-foreground">{item.confidence}%</span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{item.deadline}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
