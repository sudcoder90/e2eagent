import { Agent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Bot, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AgentStatusPanelProps {
  agents: Agent[];
}

const statusConfig = {
  running: { badge: 'success', dot: 'status-dot-active', label: 'Running' },
  idle: { badge: 'muted', dot: 'status-dot bg-muted-foreground', label: 'Idle' },
  error: { badge: 'destructive', dot: 'status-dot-error', label: 'Error' },
  initializing: { badge: 'warning', dot: 'status-dot-pending', label: 'Initializing' },
};

export function AgentStatusPanel({ agents }: AgentStatusPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Active Agents</h3>
        <Badge variant="secondary" className="gap-1">
          <Activity className="w-3 h-3" />
          {agents.filter(a => a.status === 'running').length} running
        </Badge>
      </div>

      <div className="space-y-3">
        {agents.map((agent) => {
          const config = statusConfig[agent.status];
          return (
            <div 
              key={agent.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{agent.name}</span>
                  <div className={cn(config.dot)} />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {agent.currentTest || (agent.lastActive ? `Last active ${formatDistanceToNow(agent.lastActive)} ago` : 'Idle')}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{agent.successRate}%</p>
                <p className="text-xs text-muted-foreground">{agent.testsCompleted} tests</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
