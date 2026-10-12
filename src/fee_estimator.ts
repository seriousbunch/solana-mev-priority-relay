export interface PriorityFeeTier {
  p50MicroLamports: bigint;
  p75MicroLamports: bigint;
  p90MicroLamports: bigint;
}

export class PriorityFeeEstimator {
  private recentFees: bigint[] = [];
  public readonly windowSize: number;

  constructor(windowSize: number = 20) {
    this.windowSize = windowSize;
  }

  public recordBlockFee(feeMicroLamports: bigint): void {
    this.recentFees.push(feeMicroLamports);
    if (this.recentFees.length > this.windowSize) {
      this.recentFees.shift();
    }
  }

  public estimateTiers(): PriorityFeeTier {
    if (this.recentFees.length === 0) {
      return {
        p50MicroLamports: 1000n,
        p75MicroLamports: 5000n,
        p90MicroLamports: 10000n,
      };
    }

    const sorted = [...this.recentFees].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p75 = sorted[Math.floor(sorted.length * 0.75)];
    const p90 = sorted[Math.floor(sorted.length * 0.9)];

    return {
      p50MicroLamports: p50,
      p75MicroLamports: p75,
      p90MicroLamports: p90,
    };
  }
}
