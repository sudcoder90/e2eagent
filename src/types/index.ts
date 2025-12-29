export type TestStatus = 'passed' | 'failed' | 'running' | 'pending' | 'self-healed';

export type AgentStatus = 'idle' | 'running' | 'error' | 'initializing';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: string[];
  status: TestStatus;
  lastRun?: Date;
  duration?: number;
  screenshotUrl?: string;
  assertions: VisualAssertion[];
  selfHealed?: boolean;
}

export interface VisualAssertion {
  id: string;
  selector: string;
  expectedState: string;
  actualState?: string;
  passed?: boolean;
  screenshotBefore?: string;
  screenshotAfter?: string;
}

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  currentTest?: string;
  testsCompleted: number;
  successRate: number;
  lastActive?: Date;
}

export interface TestRun {
  id: string;
  testId: string;
  testName: string;
  status: TestStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  agentId: string;
  logs: string[];
  uiDriftDetected?: boolean;
  selfHealed?: boolean;
}

export interface DashboardStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  activeAgents: number;
  uiDriftsDetected: number;
  selfHealedTests: number;
  averageRunTime: number;
}
