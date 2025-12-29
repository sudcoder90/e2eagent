export type TestStatus = 'passed' | 'failed' | 'running' | 'pending' | 'self-healed';

export type AgentStatus = 'idle' | 'running' | 'error' | 'initializing';

export type AccessRole = 'owner' | 'edit' | 'view';

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: AccessRole;
}

export interface TestStep {
  id: string;
  stepNumber: number;
  description: string;
  status: 'passed' | 'failed' | 'pending' | 'running';
  failureReason?: string;
  screenshotUrl?: string;
  duration?: number;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  status: TestStatus;
  lastRun?: Date;
  duration?: number;
  screenshotUrl?: string;
  assertions: VisualAssertion[];
  selfHealed?: boolean;
  failedStepSummary?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  quarter: string;
  testCases: TestCase[];
  members: ProjectMember[];
  createdAt: Date;
  lastUpdated: Date;
  status: 'active' | 'completed' | 'paused';
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
