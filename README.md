# Solana MEV Priority Relay (SMPR)

<p align="center">
  <img src="assets/architecture.svg" alt="Solana MEV Priority Relay Architecture" width="780" />
</p>

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Network: Solana Mainnet & Devnet](https://img.shields.io/badge/Solana-Anchor_Framework-14F195?logo=solana)](https://solana.com)
[![TypeScript: 5.4](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Security: Anti-Sandwich Guard](https://img.shields.io/badge/Security-MEV_Protection-orange.svg)](#mev-protection-mechanics)

**Solana MEV Priority Relay (SMPR)** is a high-performance Solana Anchor protocol and TypeScript client SDK delivering **dynamic compute-budget priority fee estimation, anti-sandwich front-running guards, and private bundle relay integration** on Solana.

---

## ⚡ Core Capabilities

1. **Dynamic Priority Fee Optimization**: Samples rolling fee micro-lamports across recent blocks to determine p50/p75/p90 priority fee tiers.
2. **On-Chain Slippage & Sandwich Trap**: Anchor program asserts max account balance delta between pre- and post-execution to reject sandwich sandwich attacks.
3. **Transaction Simulation & Fast Bundle Dispatch**: Simulates transactions locally before relaying to prevent burnt fees on reverting transactions.

---

## 🛠 Smart Contracts & Client SDK

- **`programs/priority_relay/src/lib.rs`**: Solana Anchor program written in Rust (`Anchor 0.30+`):
  - `initialize_relay_vault`: Configures fee multiplier bands and protection limits.
  - `relay_guarded_transaction`: Validates max allowable balance deviation before forwarding execution.
- **`src/fee_estimator.ts`**: Priority fee calculator analyzing rolling percentile distributions.
- **`src/relay_client.ts`**: Client SDK constructing atomic ComputeBudget and relay instructions.
- **`tests/relay.test.ts`**: Comprehensive automated unit test suite.

---

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/seriousbunch/solana-mev-priority-relay.git
cd solana-mev-priority-relay
npm install
npm test
```

---

## 📜 License

Licensed under the [Apache License, Version 2.0](LICENSE).
