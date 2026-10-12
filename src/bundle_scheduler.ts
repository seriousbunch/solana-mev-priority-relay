export interface PrivateBundle {
  bundleId: string;
  transactions: string[];
  maxSlot: number;
}

export class BundleScheduler {
  private activeBundles: Map<string, PrivateBundle> = new Map();

  public scheduleBundle(bundle: PrivateBundle): void {
    if (bundle.transactions.length === 0) {
      throw new Error("Cannot schedule empty bundle");
    }
    this.activeBundles.set(bundle.bundleId, bundle);
  }

  public isBundleValidForSlot(bundleId: string, currentSlot: number): boolean {
    const bundle = this.activeBundles.get(bundleId);
    if (!bundle) return false;
    return currentSlot <= bundle.maxSlot;
  }
}
