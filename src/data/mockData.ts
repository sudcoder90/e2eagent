import { TestCase, Agent, TestRun, DashboardStats } from '@/types';

export const mockTestCases: TestCase[] = [
  {
    id: '1',
    name: 'Guest User Browse to Cart Flow',
    description: 'Verify a non-member can browse products, add items to cart, and proceed to checkout',
    steps: [
      'Navigate to Amazon.com homepage',
      'Search for "wireless headphones"',
      'Click on first product result',
      'Verify product details page loads',
      'Click "Add to Cart" button',
      'Verify cart badge updates',
      'Navigate to cart page',
      'Verify item appears in cart'
    ],
    status: 'passed',
    lastRun: new Date(Date.now() - 3600000),
    duration: 45.2,
    assertions: [
      { id: 'a1', selector: '[data-testid="cart-badge"]', expectedState: 'visible', passed: true },
      { id: 'a2', selector: '.cart-item', expectedState: 'count > 0', passed: true }
    ]
  },
  {
    id: '2',
    name: 'Prime Member Checkout with Saved Address',
    description: 'Test complete checkout flow for Prime member using saved shipping address and payment',
    steps: [
      'Login as Prime member',
      'Add product to cart',
      'Proceed to checkout',
      'Select saved address',
      'Select Prime delivery option',
      'Confirm order'
    ],
    status: 'running',
    lastRun: new Date(),
    assertions: [
      { id: 'a3', selector: '[data-testid="prime-badge"]', expectedState: 'visible', passed: true },
      { id: 'a4', selector: '.delivery-date', expectedState: 'contains "tomorrow"' }
    ]
  },
  {
    id: '3',
    name: 'Order Management - Cancel Order',
    description: 'Verify user can cancel a recent order and receive confirmation',
    steps: [
      'Login to account',
      'Navigate to Orders',
      'Select most recent order',
      'Click "Cancel Order"',
      'Confirm cancellation',
      'Verify cancellation email'
    ],
    status: 'failed',
    lastRun: new Date(Date.now() - 7200000),
    duration: 38.7,
    assertions: [
      { id: 'a5', selector: '.order-status', expectedState: 'text: "Cancelled"', passed: false, actualState: 'text: "Processing"' }
    ]
  },
  {
    id: '4',
    name: 'Product Review Submission',
    description: 'Test the complete flow of submitting a product review with photos',
    steps: [
      'Navigate to purchased product',
      'Click "Write a Review"',
      'Select star rating',
      'Add review title and text',
      'Upload product photos',
      'Submit review',
      'Verify review appears'
    ],
    status: 'self-healed',
    lastRun: new Date(Date.now() - 1800000),
    duration: 52.1,
    selfHealed: true,
    assertions: [
      { id: 'a6', selector: '[data-testid="review-form"]', expectedState: 'visible', passed: true },
      { id: 'a7', selector: '.review-submitted', expectedState: 'visible', passed: true }
    ]
  },
  {
    id: '5',
    name: 'Delivery Time Slot Selection',
    description: 'Verify Fresh/Whole Foods delivery time slot selection and modification',
    steps: [
      'Login as Prime member',
      'Navigate to Amazon Fresh',
      'Add grocery items to cart',
      'Proceed to checkout',
      'Select delivery time slot',
      'Modify time slot',
      'Confirm final selection'
    ],
    status: 'pending',
    assertions: [
      { id: 'a8', selector: '.time-slot-picker', expectedState: 'visible' },
      { id: 'a9', selector: '.selected-slot', expectedState: 'highlighted' }
    ]
  },
  {
    id: '6',
    name: 'New Account Registration',
    description: 'Complete new user registration with email verification',
    steps: [
      'Navigate to registration page',
      'Enter user details',
      'Submit registration form',
      'Check email for verification',
      'Click verification link',
      'Verify account activation'
    ],
    status: 'passed',
    lastRun: new Date(Date.now() - 5400000),
    duration: 67.3,
    assertions: [
      { id: 'a10', selector: '.welcome-message', expectedState: 'visible', passed: true }
    ]
  }
];

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
