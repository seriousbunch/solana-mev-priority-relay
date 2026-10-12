import { PriorityFeeEstimator, PriorityFeeTier } from "./fee_estimator";

export interface GuardedRelayPayload {
  expectedOutputLamports: bigint;
  maxSlippageBps: number;
  selectedPriorityFee: bigint;
}

export class SolanaMEVRelayClient {
  public readonly estimator: PriorityFeeEstimator;

  constructor() {
    this.estimator = new PriorityFeeEstimator();
  }

  public prepareGuardedPayload(
    expectedOutputLamports: bigint,
    maxSlippageBps: number = 100, // 1%
    tier: "p50" | "p75" | "p90" = "p75"
  ): GuardedRelayPayload {
    const tiers = this.estimator.estimateTiers();
    const selectedPriorityFee =
      tier === "p50"
        ? tiers.p50MicroLamports
        : tier === "p75"
        ? tiers.p75MicroLamports
        : tiers.p90MicroLamports;

    return {
      expectedOutputLamports,
      maxSlippageBps,
      selectedPriorityFee,
    };
  }

  public verifyMinimumOutput(expected: bigint, actual: bigint, maxSlippageBps: number): boolean {
    const minRequired = (expected * BigInt(10000 - maxSlippageBps)) / 10000n;
    return actual >= minRequired;
  }
}
