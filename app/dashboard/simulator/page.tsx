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
      <div className="bg-card border border-border rounded-xl p-2 flex space-x-2 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('strategy')}
          className={cn(
            "flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-colors",
            activeTab === 'strategy' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Activity className="h-4 w-4 mr-2" /> Strategy Planner
        </button>
        <button 
          onClick={() => setActiveTab('digital-twin')}
          className={cn(
            "flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-colors",
            activeTab === 'digital-twin' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Database className="h-4 w-4 mr-2" /> Digital Twin
        </button>
        <button 
          onClick={() => setActiveTab('scenarios')}
          className={cn(
            "flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-colors",
            activeTab === 'scenarios' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <BarChart3 className="h-4 w-4 mr-2" /> Scenario Analysis
        </button>
        <button 
          onClick={() => setActiveTab('brief')}
          className={cn(
            "flex items-center px-6 py-3 rounded-lg text-sm font-semibold transition-colors",
            activeTab === 'brief' ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <FileText className="h-4 w-4 mr-2" /> Executive Brief
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
