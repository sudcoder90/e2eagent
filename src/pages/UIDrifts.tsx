import { Header } from '@/components/layout/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Sparkles, Eye, Check, X, RefreshCw } from 'lucide-react';

const mockDrifts = [
  {
    id: '1',
    testName: 'Product Review Submission',
    selector: '.review-btn',
    newSelector: '[data-action="write-review"]',
    detectedAt: new Date(Date.now() - 1800000),
    status: 'healed',
    description: 'Button selector changed from class-based to data attribute'
  },
  {
    id: '2',
    testName: 'Order Management - Cancel Order',
    selector: '.order-status',
    expectedText: 'Cancelled',
    actualText: 'Processing',
    detectedAt: new Date(Date.now() - 7200000),
    status: 'unresolved',
    description: 'Order status text mismatch after cancellation flow'
  },
  {
    id: '3',
    testName: 'Cart Badge Update',
    selector: '[data-testid="cart-count"]',
    newSelector: '.cart-badge-count',
    detectedAt: new Date(Date.now() - 86400000),
    status: 'healed',
    description: 'Cart count element restructured'
  },
];

export default function UIDrifts() {
  return (
    <div className="min-h-screen">
      <Header 
        title="UI Drift Detection" 
        subtitle="Track and resolve visual and structural changes"
      />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">7</p>
                <p className="text-sm text-muted-foreground">Total Drifts Detected</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <Sparkles className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Auto-Healed</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/20">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Needs Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Drift List */}
        <div className="space-y-4">
          {mockDrifts.map((drift) => (
            <div 
              key={drift.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg ${drift.status === 'healed' ? 'bg-success/10' : 'bg-warning/10'}`}>
                    {drift.status === 'healed' ? (
                      <Sparkles className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{drift.testName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{drift.description}</p>
                    
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Original:</span>
                        <code className="text-xs bg-secondary px-2 py-1 rounded font-mono text-foreground">
                          {drift.selector}
                        </code>
                      </div>
                      {drift.newSelector && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Updated:</span>
                          <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            {drift.newSelector}
                          </code>
                        </div>
                      )}
                      {drift.expectedText && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Expected:</span>
                          <code className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                            "{drift.expectedText}"
                          </code>
                          <span className="text-xs text-muted-foreground">Got:</span>
                          <code className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                            "{drift.actualText}"
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={drift.status === 'healed' ? 'success' : 'warning'}>
                    {drift.status === 'healed' ? 'Auto-Healed' : 'Needs Review'}
                  </Badge>
                </div>
              </div>

              {drift.status === 'unresolved' && (
                <div className="mt-4 pt-4 border-t border-border flex gap-2">
                  <Button size="sm" variant="default">
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Accept Change
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    View Screenshot
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Retry Test
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
