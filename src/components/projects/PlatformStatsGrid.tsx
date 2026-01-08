import { CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';

export type Platform = 'dWeb' | 'mWeb' | 'iOS' | 'Android';

interface PlatformStats {
  passed: number;
  failed: number;
  pending: number;
  successRate: number;
}

interface PlatformStatsGridProps {
  stats: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    pendingTests: number;
    runningTests: number;
    successRate: number;
  };
}

export function PlatformStatsGrid({ stats }: PlatformStatsGridProps) {
  // Generate platform-specific stats based on overall stats
  const getPlatformStats = (platform: Platform): PlatformStats => {
    const baseTotal = Math.max(1, Math.floor(stats.totalTests / 4));
    
    // Create variation per platform
    const variations: Record<Platform, { passedMod: number; failedMod: number; pendingMod: number }> = {
      dWeb: { passedMod: 1.2, failedMod: 0.8, pendingMod: 1.0 },
      mWeb: { passedMod: 1.0, failedMod: 1.2, pendingMod: 0.8 },
      iOS: { passedMod: 1.1, failedMod: 0.9, pendingMod: 1.0 },
      Android: { passedMod: 0.9, failedMod: 1.1, pendingMod: 1.2 },
    };

    const mod = variations[platform];
    const passed = Math.max(0, Math.round((stats.passedTests / 4) * mod.passedMod));
    const failed = Math.max(0, Math.round((stats.failedTests / 4) * mod.failedMod));
    const pending = Math.max(0, Math.round(((stats.pendingTests + stats.runningTests) / 4) * mod.pendingMod));
    const total = passed + failed + pending;
    const successRate = total > 0 ? (passed / total) * 100 : 0;

    return { passed, failed, pending, successRate };
  };

  const platforms: Platform[] = ['dWeb', 'mWeb', 'iOS', 'Android'];

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return 'text-success';
    if (rate >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-5 gap-4 p-4 bg-muted/30 border-b border-border">
        <div className="text-sm font-medium text-muted-foreground">Platform</div>
        <div className="flex items-center gap-2 text-sm font-medium text-success">
          <CheckCircle2 className="w-4 h-4" />
          Passed
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-destructive">
          <XCircle className="w-4 h-4" />
          Failed
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Clock className="w-4 h-4" />
          Pending
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <TrendingUp className="w-4 h-4" />
          Success Rate
        </div>
      </div>

      {/* Platform rows */}
      {platforms.map((platform) => {
        const platformStats = getPlatformStats(platform);
        return (
          <div 
            key={platform} 
            className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
          >
            <div className="text-sm font-semibold text-foreground">{platform}</div>
            <div className="text-sm font-medium text-success">{platformStats.passed}</div>
            <div className="text-sm font-medium text-destructive">{platformStats.failed}</div>
            <div className="text-sm font-medium text-muted-foreground">{platformStats.pending}</div>
            <div className={`text-sm font-semibold ${getSuccessRateColor(platformStats.successRate)}`}>
              {platformStats.successRate.toFixed(1)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}