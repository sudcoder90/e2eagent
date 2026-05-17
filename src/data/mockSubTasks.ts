export type Domain = 'Walmart+' | 'Marketplace' | 'Checkout' | 'Search' | 'Cart' | 'Account';

export const DOMAINS: Domain[] = ['Walmart+', 'Marketplace', 'Checkout', 'Search', 'Cart', 'Account'];

export interface SubTaskStep {
  id: string;
  description: string;
  platform?: 'Web' | 'Native' | 'Both';
}

export interface SubTaskVersion {
  version: number;
  steps: SubTaskStep[];
  editedAt: Date;
  editedBy: string;
  changeNote?: string;
}

export interface SubTask {
  id: string;
  name: string;
  domain: Domain;
  description: string;
  createdAt: Date;
  createdBy: string;
  successRate: number;
  totalRuns: number;
  currentVersion: number;
  steps: SubTaskStep[];
  history: SubTaskVersion[];
}

export const mockSubTasks: SubTask[] = [
  {
    id: 'st-1',
    name: 'MLP Signup',
    domain: 'Walmart+',
    description: 'Member landing page signup flow for Walmart+ subscription.',
    createdAt: new Date('2026-03-12'),
    createdBy: 'Aisha Patel',
    successRate: 94,
    totalRuns: 482,
    currentVersion: 3,
    steps: [
      { id: 's1', description: 'Visit www.walmart.com/plus on Web or walmart://plus on Native', platform: 'Both' },
      { id: 's2', description: 'Scan the page by scrolling to the bottom to load all sections', platform: 'Both' },
      { id: 's3', description: 'Hit the primary "Start Free Trial" CTA to navigate to the next page', platform: 'Both' },
      { id: 's4', description: 'Verify the plan selection page loads with Monthly and Annual options', platform: 'Both' },
    ],
    history: [
      {
        version: 1,
        editedAt: new Date('2026-03-12'),
        editedBy: 'Aisha Patel',
        changeNote: 'Initial version',
        steps: [
          { id: 's1', description: 'Visit walmart.com/plus', platform: 'Web' },
          { id: 's2', description: 'Click signup CTA', platform: 'Web' },
        ],
      },
      {
        version: 2,
        editedAt: new Date('2026-04-02'),
        editedBy: 'Diego Romero',
        changeNote: 'Added Native deep link support',
        steps: [
          { id: 's1', description: 'Visit www.walmart.com/plus on Web or walmart://plus on Native', platform: 'Both' },
          { id: 's2', description: 'Click signup CTA', platform: 'Both' },
        ],
      },
      {
        version: 3,
        editedAt: new Date('2026-05-10'),
        editedBy: 'Aisha Patel',
        changeNote: 'Added scroll-to-load and verification step',
        steps: [
          { id: 's1', description: 'Visit www.walmart.com/plus on Web or walmart://plus on Native', platform: 'Both' },
          { id: 's2', description: 'Scan the page by scrolling to the bottom to load all sections', platform: 'Both' },
          { id: 's3', description: 'Hit the primary "Start Free Trial" CTA to navigate to the next page', platform: 'Both' },
          { id: 's4', description: 'Verify the plan selection page loads with Monthly and Annual options', platform: 'Both' },
        ],
      },
    ],
  },
  {
    id: 'st-2',
    name: 'Walmart+ Cancel Membership',
    domain: 'Walmart+',
    description: 'Cancellation flow from account settings.',
    createdAt: new Date('2026-04-05'),
    createdBy: 'Marcus Lee',
    successRate: 88,
    totalRuns: 211,
    currentVersion: 1,
    steps: [
      { id: 's1', description: 'Navigate to Account → Walmart+ → Manage Membership', platform: 'Both' },
      { id: 's2', description: 'Click "Cancel Membership" link', platform: 'Both' },
      { id: 's3', description: 'Confirm cancellation in modal', platform: 'Both' },
    ],
    history: [
      {
        version: 1,
        editedAt: new Date('2026-04-05'),
        editedBy: 'Marcus Lee',
        changeNote: 'Initial version',
        steps: [
          { id: 's1', description: 'Navigate to Account → Walmart+ → Manage Membership', platform: 'Both' },
          { id: 's2', description: 'Click "Cancel Membership" link', platform: 'Both' },
          { id: 's3', description: 'Confirm cancellation in modal', platform: 'Both' },
        ],
      },
    ],
  },
  {
    id: 'st-3',
    name: 'Guest Checkout',
    domain: 'Checkout',
    description: 'Complete checkout without signing in.',
    createdAt: new Date('2026-02-20'),
    createdBy: 'Priya Singh',
    successRate: 91,
    totalRuns: 1024,
    currentVersion: 2,
    steps: [
      { id: 's1', description: 'Add item to cart and click "Checkout"', platform: 'Both' },
      { id: 's2', description: 'Select "Continue as Guest"', platform: 'Both' },
      { id: 's3', description: 'Enter shipping address and email', platform: 'Both' },
      { id: 's4', description: 'Enter payment details and place order', platform: 'Both' },
    ],
    history: [
      { version: 1, editedAt: new Date('2026-02-20'), editedBy: 'Priya Singh', changeNote: 'Initial', steps: [] },
      { version: 2, editedAt: new Date('2026-04-18'), editedBy: 'Priya Singh', changeNote: 'Added email capture step', steps: [] },
    ],
  },
  {
    id: 'st-4',
    name: 'Seller Onboarding',
    domain: 'Marketplace',
    description: 'New seller registration and verification.',
    createdAt: new Date('2026-01-15'),
    createdBy: 'Jordan Kim',
    successRate: 76,
    totalRuns: 89,
    currentVersion: 4,
    steps: [
      { id: 's1', description: 'Visit marketplace.walmart.com/apply', platform: 'Web' },
      { id: 's2', description: 'Fill business information form', platform: 'Web' },
      { id: 's3', description: 'Upload tax documents', platform: 'Web' },
      { id: 's4', description: 'Submit for review', platform: 'Web' },
    ],
    history: [
      { version: 1, editedAt: new Date('2026-01-15'), editedBy: 'Jordan Kim', changeNote: 'Initial', steps: [] },
      { version: 2, editedAt: new Date('2026-02-01'), editedBy: 'Jordan Kim', changeNote: 'Added tax docs', steps: [] },
      { version: 3, editedAt: new Date('2026-03-10'), editedBy: 'Sofia Chen', changeNote: 'Reworded steps', steps: [] },
      { version: 4, editedAt: new Date('2026-04-22'), editedBy: 'Jordan Kim', changeNote: 'Submit step clarified', steps: [] },
    ],
  },
  {
    id: 'st-5',
    name: 'Product Search & Filter',
    domain: 'Search',
    description: 'Search for a product and apply filters.',
    createdAt: new Date('2026-03-28'),
    createdBy: 'Sofia Chen',
    successRate: 96,
    totalRuns: 2105,
    currentVersion: 1,
    steps: [
      { id: 's1', description: 'Type query in search bar and submit', platform: 'Both' },
      { id: 's2', description: 'Apply "Price: Low to High" sort', platform: 'Both' },
      { id: 's3', description: 'Select "Free Shipping" filter', platform: 'Both' },
    ],
    history: [
      { version: 1, editedAt: new Date('2026-03-28'), editedBy: 'Sofia Chen', changeNote: 'Initial', steps: [] },
    ],
  },
  {
    id: 'st-6',
    name: 'Add to Cart from PDP',
    domain: 'Cart',
    description: 'Add a product to cart from the product detail page.',
    createdAt: new Date('2026-04-11'),
    createdBy: 'Diego Romero',
    successRate: 98,
    totalRuns: 3402,
    currentVersion: 1,
    steps: [
      { id: 's1', description: 'Open a product detail page', platform: 'Both' },
      { id: 's2', description: 'Select variant if applicable', platform: 'Both' },
      { id: 's3', description: 'Click "Add to Cart"', platform: 'Both' },
      { id: 's4', description: 'Verify cart count increments', platform: 'Both' },
    ],
    history: [
      { version: 1, editedAt: new Date('2026-04-11'), editedBy: 'Diego Romero', changeNote: 'Initial', steps: [] },
    ],
  },
];
