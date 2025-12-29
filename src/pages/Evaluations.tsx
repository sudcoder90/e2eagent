import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockProjects, getProjectStats } from '@/data/mockProjects';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  BarChart3,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function Evaluations() {
  const navigate = useNavigate();

  // Aggregate all test cases from all projects
  const allTestCases = mockProjects.flatMap(project => 
    project.testCases.map(tc => ({
      ...tc,
      projectName: project.name,
      projectId: project.id,
      quarter: project.quarter
    }))
  );

  const passedTests = allTestCases.filter(tc => tc.status === 'passed');
  const failedTests = allTestCases.filter(tc => tc.status === 'failed');
  const runningTests = allTestCases.filter(tc => tc.status === 'running');
  const pendingTests = allTestCases.filter(tc => tc.status === 'pending');

  const successRate = allTestCases.length > 0 
    ? ((passedTests.length / allTestCases.length) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen">
      <Header 
        title="Evaluations" 
        subtitle="Review test results and performance metrics"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ClipboardCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{allTestCases.length}</p>
                <p className="text-sm text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{passedTests.length}</p>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{failedTests.length}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{runningTests.length + pendingTests.length}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{successRate}%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Evaluations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Test Evaluations</h3>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
          
          <div className="space-y-3">
            {allTestCases
              .filter(tc => tc.lastRun)
              .sort((a, b) => (b.lastRun?.getTime() || 0) - (a.lastRun?.getTime() || 0))
              .slice(0, 10)
              .map((test) => (
                <div 
                  key={test.id}
                  className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        test.status === 'passed' ? 'bg-success/10' :
                        test.status === 'failed' ? 'bg-destructive/10' :
                        'bg-warning/10'
                      }`}>
                        {test.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : test.status === 'failed' ? (
                          <XCircle className="w-4 h-4 text-destructive" />
                        ) : (
                          <Clock className="w-4 h-4 text-warning" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{test.name}</h4>
                          <Badge variant="outline" className="text-xs">{test.quarter}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{test.projectName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {test.steps.filter(s => s.status === 'passed').length}/{test.steps.length} steps
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {test.lastRun && formatDistanceToNow(test.lastRun, { addSuffix: true })}
                        </p>
                      </div>
                      {test.duration && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{test.duration.toFixed(1)}s</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                      )}
                      <Badge variant={
                        test.status === 'passed' ? 'success' :
                        test.status === 'failed' ? 'destructive' :
                        'warning'
                      }>
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => navigate(`/project/${test.projectId}`)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {test.status === 'failed' && test.failedStepSummary && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-destructive">{test.failedStepSummary}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
