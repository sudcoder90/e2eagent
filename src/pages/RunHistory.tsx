import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTestRuns } from '@/data/mockData';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Clock, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Terminal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const statusConfig = {
  passed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Passed' },
  failed: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Failed' },
  running: { icon: Loader2, color: 'text-warning', bg: 'bg-warning/10', label: 'Running' },
  pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Pending' },
  'self-healed': { icon: Sparkles, color: 'text-success', bg: 'bg-success/10', label: 'Self-Healed' },
};

export default function RunHistory() {
  const [expandedRun, setExpandedRun] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <Header 
        title="Run History" 
        subtitle="View detailed logs and results from test executions"
      />
      
      <div className="p-6 space-y-4">
        {mockTestRuns.map((run) => {
          const config = statusConfig[run.status];
          const Icon = config.icon;
          const isExpanded = expandedRun === run.id;

          return (
            <div 
              key={run.id}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Header */}
              <div 
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedRun(isExpanded ? null : run.id)}
              >
                <div className={cn("p-2.5 rounded-lg", config.bg)}>
                  <Icon className={cn("w-5 h-5", config.color, run.status === 'running' && 'animate-spin')} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{run.testName}</h3>
                    {run.selfHealed && (
                      <Badge variant="success" className="text-[10px]">
                        <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                        Self-Healed
                      </Badge>
                    )}
                    {run.uiDriftDetected && !run.selfHealed && (
                      <Badge variant="warning" className="text-[10px]">UI Drift</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(run.startTime, 'MMM d, yyyy h:mm:ss a')}
                    {run.duration && ` • ${run.duration}s`}
                    {` • Agent: ${run.agentId}`}
                  </p>
                </div>

                <Badge variant={config.label === 'Passed' || config.label === 'Self-Healed' ? 'success' : 
                               config.label === 'Failed' ? 'destructive' : 'muted'}>
                  {config.label}
                </Badge>

                <Button variant="ghost" size="icon" className="shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>

              {/* Logs */}
              {isExpanded && (
                <div className="border-t border-border bg-background/50">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Execution Logs</span>
                    </div>
                    <div className="bg-background rounded-lg border border-border p-4 font-mono text-sm space-y-1 max-h-64 overflow-auto">
                      {run.logs.map((log, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "text-muted-foreground",
                            log.includes('PASSED') && 'text-success',
                            log.includes('FAILED') && 'text-destructive',
                            log.includes('SELF-HEALING') && 'text-primary',
                            log.includes('UI DRIFT') && 'text-warning'
                          )}
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
