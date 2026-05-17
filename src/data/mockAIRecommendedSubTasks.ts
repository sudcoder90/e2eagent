import { Domain, SubTaskStep } from './mockSubTasks';

export interface AIRecommendedSubTask {
  id: string;
  name: string;
  domain: Domain;
  description: string;
  rationale: string;
  confidence: number; // 0-100
  sourceCount: number; // how many user variants this consolidates
  contributors: string[];
  keyLearnings: string[];
  steps: SubTaskStep[];
  createdAt: Date;
}

export const mockAIRecommendedSubTasks: AIRecommendedSubTask[] = [
  {
    id: 'rec-1',
    name: 'Apply Promo Code at Checkout',
    domain: 'Checkout',
    description:
      'Consolidated playbook for applying a promo code during checkout, combining 7 user-authored variants.',
    rationale:
      '7 testers wrote similar instructions for applying promo codes with inconsistent step ordering. This version normalizes the flow and adds an explicit verification step that 3 of 7 versions missed.',
    confidence: 92,
    sourceCount: 7,
    contributors: ['Priya Singh', 'Marcus Lee', 'Aisha Patel', 'Sofia Chen', 'Jordan Kim'],
    keyLearnings: [
      'Always wait for cart totals to recalculate before asserting',
      'Promo input is collapsed by default on Native — must expand first',
      'Verify discount line appears in order summary, not just toast',
    ],
    steps: [
      { id: 'r1-1', description: 'Navigate to cart and click "Checkout"', platform: 'Both' },
      { id: 'r1-2', description: 'On Native, expand "Promo code" accordion in order summary', platform: 'Native' },
      { id: 'r1-3', description: 'Enter promo code in input field and click "Apply"', platform: 'Both' },
      { id: 'r1-4', description: 'Wait for totals to recalculate (loading spinner clears)', platform: 'Both' },
      { id: 'r1-5', description: 'Verify discount line item appears in order summary', platform: 'Both' },
    ],
    createdAt: new Date('2026-05-14'),
  },
  {
    id: 'rec-2',
    name: 'Walmart+ Free Trial Activation',
    domain: 'Walmart+',
    description:
      'Unified flow for free trial activation, merging insights from 5 separate sub-tasks created by different teams.',
    rationale:
      '5 overlapping variants existed across Walmart+ team test cases. Consolidated wording and added a payment-method-on-file check that improved pass rate by 12% in the highest-performing version.',
    confidence: 88,
    sourceCount: 5,
    contributors: ['Aisha Patel', 'Diego Romero', 'Marcus Lee'],
    keyLearnings: [
      'Trial CTA varies between "Start Free Trial" and "Try Free for 30 Days" — match by role, not text',
      'Payment method must be on file before activation completes',
    ],
    steps: [
      { id: 'r2-1', description: 'Visit www.walmart.com/plus on Web or walmart://plus on Native', platform: 'Both' },
      { id: 'r2-2', description: 'Match trial CTA by button role rather than exact text', platform: 'Both' },
      { id: 'r2-3', description: 'Confirm payment method is on file; add one if missing', platform: 'Both' },
      { id: 'r2-4', description: 'Submit and verify success confirmation page', platform: 'Both' },
    ],
    createdAt: new Date('2026-05-12'),
  },
  {
    id: 'rec-3',
    name: 'Search → PDP Navigation',
    domain: 'Search',
    description:
      'Reusable pattern for navigating from a search result to a product detail page, derived from 4 testers using inconsistent selectors.',
    rationale:
      'Multiple variants used brittle CSS selectors. This recommendation favors stable role/accessible-name selectors, observed to be 3× more resilient to UI drift.',
    confidence: 84,
    sourceCount: 4,
    contributors: ['Sofia Chen', 'Jordan Kim'],
    keyLearnings: [
      'Use accessible name over CSS selectors for product tiles',
      'First tile may be a sponsored ad — skip if testing organic results',
    ],
    steps: [
      { id: 'r3-1', description: 'Submit search query and wait for results grid', platform: 'Both' },
      { id: 'r3-2', description: 'Skip sponsored tiles (labeled "Sponsored")', platform: 'Both' },
      { id: 'r3-3', description: 'Click first organic result by accessible name', platform: 'Both' },
      { id: 'r3-4', description: 'Verify PDP loads with title, price, and "Add to Cart" CTA', platform: 'Both' },
    ],
    createdAt: new Date('2026-05-09'),
  },
];
