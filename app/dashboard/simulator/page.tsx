'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TabDigitalTwin } from '@/features/simulator/components/TabDigitalTwin';
import { Play, Activity, Clock, ShieldAlert, FileText, BarChart3, Database } from 'lucide-react';
import { TabStrategyPlanner } from '@/features/simulator/components/TabStrategyPlanner';
import { TabScenarioAnalysis } from '@/features/simulator/components/TabScenarioAnalysis';
import { TabExecutiveBrief } from '@/features/simulator/components/TabExecutiveBrief';

export default function FlagshipSimulatorPage() {
  const [activeTab, setActiveTab] = useState<'strategy' | 'digital-twin' | 'scenarios' | 'brief'>('digital-twin');

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Tab Navigation */}
      <div className="bg-card border border-border rounded-md p-1.5 flex space-x-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('digital-twin')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-sm text-sm font-semibold transition-colors",
            activeTab === 'digital-twin' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Database className="h-4 w-4 mr-2" /> Live Plant View
        </button>
        <button 
          onClick={() => setActiveTab('strategy')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-sm text-sm font-semibold transition-colors",
            activeTab === 'strategy' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Activity className="h-4 w-4 mr-2" /> Timeline & Degradation
        </button>
        <button 
          onClick={() => setActiveTab('scenarios')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-sm text-sm font-semibold transition-colors",
            activeTab === 'scenarios' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <BarChart3 className="h-4 w-4 mr-2" /> Decision Comparison
        </button>
        <button 
          onClick={() => setActiveTab('brief')}
          className={cn(
            "flex items-center px-6 py-2.5 rounded-sm text-sm font-semibold transition-colors",
            activeTab === 'brief' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <FileText className="h-4 w-4 mr-2" /> Printable Brief
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[calc(100vh-16rem)]">
        {activeTab === 'digital-twin' && <TabDigitalTwin />}
        {activeTab === 'strategy' && <TabStrategyPlanner />}
        {activeTab === 'scenarios' && <TabScenarioAnalysis />}
        {activeTab === 'brief' && <TabExecutiveBrief />}
      </div>

    </div>
  );
}
