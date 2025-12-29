import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockAgents } from '@/data/mockData';
import { Bot, Play, Pause, RotateCcw, Settings, Activity, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const statusConfig = {
  running: { color: 'text-success', bg: 'bg-success/10', badge: 'success', label: 'Running' },
  idle: { color: 'text-muted-foreground', bg: 'bg-muted', badge: 'muted', label: 'Idle' },
  error: { color: 'text-destructive', bg: 'bg-destructive/10', badge: 'destructive', label: 'Error' },
  initializing: { color: 'text-warning', bg: 'bg-warning/10', badge: 'warning', label: 'Initializing' },
};

export default function Agents() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Synthetic Agents" 
        subtitle="Monitor and control your AI testing agents"
      />
      
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button variant="glow">
            <Play className="w-4 h-4 mr-2" />
            Start All Agents
          </Button>
          <Button variant="outline">
            <Pause className="w-4 h-4 mr-2" />
            Pause All
          </Button>
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart Failed
          </Button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockAgents.map((agent) => {
            const config = statusConfig[agent.status];
            return (
              <div 
                key={agent.id}
                className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-card group"
              >
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-xl", config.bg)}>
                        <Bot className={cn("w-6 h-6", config.color)} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">{agent.id}</p>
                      </div>
                    </div>
                    <Badge variant={config.badge as any}>{config.label}</Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Target className="w-3.5 h-3.5" />
                      <span className="text-xs">Success Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{agent.successRate}%</p>
                  </div>
                  <div className="text-center border-x border-border">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Activity className="w-3.5 h-3.5" />
                      <span className="text-xs">Tests Run</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{agent.testsCompleted}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">Last Active</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {agent.lastActive ? formatDistanceToNow(agent.lastActive, { addSuffix: true }) : 'Never'}
                    </p>
                  </div>
                </div>

                {/* Current Task */}
                {agent.currentTest && (
                  <div className="px-6 pb-4">
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Currently Running</p>
                      <p className="text-sm font-medium text-foreground">{agent.currentTest}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 border-t border-border bg-secondary/30 flex gap-2">
                  {agent.status === 'running' ? (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pause className="w-3.5 h-3.5 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" className="flex-1">
                      <Play className="w-3.5 h-3.5 mr-1" />
                      Start
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
