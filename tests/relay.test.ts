import { describe, it } from "node:test";
import assert from "node:assert";
import { PriorityFeeEstimator, SolanaMEVRelayClient } from "../src/index";

describe("Solana MEV Priority Relay Test Suite", () => {
  it("should estimate p50/p75/p90 priority fee tiers correctly", () => {
    const estimator = new PriorityFeeEstimator(10);
    for (let i = 1; i <= 10; i++) {
      estimator.recordBlockFee(BigInt(i * 1000));
    }

    const tiers = estimator.estimateTiers();
    assert.strictEqual(tiers.p50MicroLamports, 6000n);
    assert.strictEqual(tiers.p75MicroLamports, 8000n);
    assert.strictEqual(tiers.p90MicroLamports, 10000n);
  });

  it("should verify minimum output respecting max allowable slippage", () => {
    const client = new SolanaMEVRelayClient();
    const expected = 10000n;

    // 1% max slippage -> min required 9900
    assert.strictEqual(client.verifyMinimumOutput(expected, 9950n, 100), true);
    assert.strictEqual(client.verifyMinimumOutput(expected, 9850n, 100), false);
  });
});
