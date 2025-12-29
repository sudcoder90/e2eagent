import { Agent, TestRun, DashboardStats } from '@/types';

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Synthetic User Alpha',
    status: 'running',
    currentTest: 'Prime Member Checkout with Saved Address',
    testsCompleted: 142,
    successRate: 94.3,
    lastActive: new Date()
  },
  {
    id: 'agent-2',
    name: 'Synthetic User Beta',
    status: 'idle',
    testsCompleted: 89,
    successRate: 91.0,
    lastActive: new Date(Date.now() - 300000)
  },
  {
    id: 'agent-3',
    name: 'Synthetic User Gamma',
    status: 'idle',
    testsCompleted: 203,
    successRate: 96.5,
    lastActive: new Date(Date.now() - 600000)
  },
  {
    id: 'agent-4',
    name: 'Synthetic User Delta',
    status: 'error',
    testsCompleted: 67,
    successRate: 88.1,
    lastActive: new Date(Date.now() - 1800000)
  }
];

export const mockTestRuns: TestRun[] = [
  {
    id: 'run-1',
    testId: '1',
    testName: 'Guest User Browse to Cart Flow',
    status: 'passed',
    startTime: new Date(Date.now() - 3600000),
    endTime: new Date(Date.now() - 3554800),
    duration: 45.2,
    agentId: 'agent-1',
    logs: [
      '[00:00] Starting test execution...',
      '[00:02] Navigating to homepage',
      '[00:05] Homepage loaded successfully',
      '[00:08] Performing search for "wireless headphones"',
      '[00:15] Search results displayed',
      '[00:18] Clicking first product',
      '[00:25] Product page loaded',
      '[00:30] Adding to cart',
      '[00:35] Cart updated successfully',
      '[00:45] Test completed - PASSED'
    ]
  },
  {
    id: 'run-2',
    testId: '3',
    testName: 'Order Management - Cancel Order',
    status: 'failed',
    startTime: new Date(Date.now() - 7200000),
    endTime: new Date(Date.now() - 7161300),
    duration: 38.7,
    agentId: 'agent-2',
    logs: [
      '[00:00] Starting test execution...',
      '[00:03] Logging into account',
      '[00:10] Navigating to Orders',
      '[00:15] Selecting recent order',
      '[00:20] Clicking Cancel Order',
      '[00:25] Confirmation dialog appeared',
      '[00:30] Confirming cancellation',
      '[00:38] ASSERTION FAILED: Order status expected "Cancelled" but got "Processing"'
    ],
    uiDriftDetected: true
  },
  {
    id: 'run-3',
    testId: '4',
    testName: 'Product Review Submission',
    status: 'self-healed',
    startTime: new Date(Date.now() - 1800000),
    endTime: new Date(Date.now() - 1747900),
    duration: 52.1,
    agentId: 'agent-3',
    logs: [
      '[00:00] Starting test execution...',
      '[00:05] Navigating to product page',
      '[00:12] UI DRIFT DETECTED: Review button selector changed',
      '[00:13] SELF-HEALING: Updating selector from .review-btn to [data-action="write-review"]',
      '[00:15] Self-heal successful, continuing test',
      '[00:25] Review form opened',
      '[00:40] Review submitted successfully',
      '[00:52] Test completed - PASSED (self-healed)'
    ],
    selfHealed: true,
    uiDriftDetected: true
  }
];

export const mockDashboardStats: DashboardStats = {
  totalTests: 48,
  passedTests: 39,
  failedTests: 5,
  pendingTests: 4,
  activeAgents: 4,
  uiDriftsDetected: 7,
  selfHealedTests: 5,
  averageRunTime: 48.5
};
