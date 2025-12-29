import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TestStatusChart } from '@/components/dashboard/TestStatusChart';
import { AgentStatusPanel } from '@/components/dashboard/AgentStatusPanel';
import { RecentTestRuns } from '@/components/dashboard/RecentTestRuns';
import { mockDashboardStats, mockAgents, mockTestRuns } from '@/data/mockData';
import { 
  TestTube2, 
  CheckCircle2, 
  XCircle, 
  Bot, 
  AlertTriangle, 
  Sparkles,
  Timer
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle="Monitor your automated QA testing pipeline"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Tests"
            value={mockDashboardStats.totalTests}
            subtitle="Test cases configured"
            icon={<TestTube2 className="w-6 h-6" />}
            variant="primary"
          />
          <StatsCard
            title="Passed Tests"
            value={mockDashboardStats.passedTests}
            subtitle={`${((mockDashboardStats.passedTests / mockDashboardStats.totalTests) * 100).toFixed(1)}% success rate`}
            icon={<CheckCircle2 className="w-6 h-6" />}
            variant="success"
            trend={{ value: 5.2, positive: true }}
          />
          <StatsCard
            title="Failed Tests"
            value={mockDashboardStats.failedTests}
            subtitle="Requires attention"
            icon={<XCircle className="w-6 h-6" />}
            variant="destructive"
          />
          <StatsCard
            title="Active Agents"
            value={mockDashboardStats.activeAgents}
            subtitle="Synthetic users deployed"
            icon={<Bot className="w-6 h-6" />}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="UI Drifts Detected"
            value={mockDashboardStats.uiDriftsDetected}
            subtitle="This week"
            icon={<AlertTriangle className="w-6 h-6" />}
            variant="warning"
          />
          <StatsCard
            title="Self-Healed Tests"
            value={mockDashboardStats.selfHealedTests}
            subtitle="Auto-corrected selectors"
            icon={<Sparkles className="w-6 h-6" />}
            variant="success"
          />
          <StatsCard
            title="Avg Run Time"
            value={`${mockDashboardStats.averageRunTime}s`}
            subtitle="Per test execution"
            icon={<Timer className="w-6 h-6" />}
          />
        </div>

        {/* Charts and Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TestStatusChart stats={mockDashboardStats} />
          <AgentStatusPanel agents={mockAgents} />
        </div>

        {/* Recent Runs */}
        <RecentTestRuns runs={mockTestRuns} />
      </div>
    </div>
  );
}
