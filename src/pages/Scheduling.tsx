import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockProjects, getProjectStats } from '@/data/mockProjects';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Settings,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';

export default function Scheduling() {
  const navigate = useNavigate();

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return 'Manual';
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Scheduling" 
        subtitle="Manage scheduled test runs for your projects"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockProjects.filter(p => p.scheduledRun?.enabled).length}</p>
                <p className="text-sm text-muted-foreground">Active Schedules</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockProjects.reduce((acc, p) => acc + getProjectStats(p).passedTests, 0)}</p>
                <p className="text-sm text-muted-foreground">Tests Passed Today</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Running Soon</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockProjects.reduce((acc, p) => acc + getProjectStats(p).failedTests, 0)}</p>
                <p className="text-sm text-muted-foreground">Failed Last Run</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Tests List */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Scheduled Test Runs</h3>
          <div className="space-y-3">
            {mockProjects.map((project) => {
              const stats = getProjectStats(project);
              const schedule = project.scheduledRun;
              
              return (
                <div 
                  key={project.id}
                  className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${schedule?.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Calendar className={`w-5 h-5 ${schedule?.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{project.name}</h4>
                          <Badge variant="outline" className="text-xs">{project.quarter}</Badge>
                          {schedule?.enabled ? (
                            <Badge variant="success" className="text-xs">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Paused</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Next run:</span>
                            {schedule?.nextRun ? (
                              <span className="font-medium text-foreground">
                                {formatDistanceToNow(schedule.nextRun, { addSuffix: true })}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">Not scheduled</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Frequency:</span>
                            <span className="font-medium text-foreground">
                              {schedule ? getFrequencyLabel(schedule.frequency) : 'Manual'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Tests:</span>
                            <span className="font-medium text-foreground">{stats.totalTests}</span>
                            <span className="text-success text-xs">({stats.passedTests} passed)</span>
                          </div>
                        </div>

                        {schedule?.nextRun && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Scheduled for {format(schedule.nextRun, 'PPpp')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="gap-1"
                      >
                        {schedule?.enabled ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            Enable
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
