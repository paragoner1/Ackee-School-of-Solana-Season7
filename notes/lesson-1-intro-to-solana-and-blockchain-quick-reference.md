# Lesson 1: Intro to Solana & Blockchain Quick Reference

## 🎯 Course Structure
- Lesson 1: Solana Intro
- Lesson 2: Rust Basics
- Lessons 3-4: Solana Programming Model (Accounts, CPIs)
- Lesson 5: Best Practices/Debugging
- Lesson 6: Security
- Lesson 7: Frontend Integration
- Final: Build Solana Project (Smart Contract + Frontend)

## 🔧 Prerequisites
- Basic CLI (terminal commands)
- Git (clone, commit, push)
- Programming experience (e.g., C/C++, Java, Python)
- Blockchain basics (blocks, transactions)

## 🔍 Key Terms/Concepts
- **Proof of History (PoH)**: Synchronization mechanism for transaction ordering (sequential creation, parallel validation).
- **Gulfstream**: Direct transaction forwarding to leaders (no mempools), with stake-weighted QoS.
- **Turbine**: Tree-based block propagation via neighborhoods.
- **Sealevel**: Parallel transaction execution based on mutable/read-only accounts.
- **Accounts DB**: Key-value store (pubkey → bytes); types: wallets, data, executables.
- **Alpenglow**: Upgrades for 150ms finality; removes vote txns/PoH in consensus.
  - **Rotor**: Simplified Turbine (leader → relayers → validators).
  - **Volter**: Off-chain vote aggregation; fast (80% stake) or slow (66% over rounds) finality.

## 🔧 Commands/Tools
- **Git Basics**:
  ```bash
  git clone [repo]
  git commit -m "message"
  git push
  ```
- **Docker**: Use image for Solana environment setup.
- **Young Tolly AI**: Tag in Discord dev-help for Solana/Anchor queries.

## 🏗️ Architecture Overview
- **Layers**: Clients (apps/wallets) → RPCs (forwarding) → Validators (block production/voting).
- **Transaction Flow**: App → RPC → Validator/Leader (Gulfstream) → Parallel processing (Sealevel) → Broadcast (Turbine) → Consensus (PoH).
- **Performance**: 1,200-1,300 true TPS, 400ms blocks, ~12s finality, ~1,200 validators.
- **Nakamoto Coefficient**: ~22 (validators needed to halt network).

## 🔗 Resources
- GitHub Repo: Materials/tasks
- Solana Handbook: Concept summaries
- Validators.app: Validator visualization
- Solana Beach: Network stats
- Helios Blog: Alpenglow details
