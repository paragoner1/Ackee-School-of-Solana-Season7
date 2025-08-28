# Lesson 3: Solana Programming Model I Quick Reference

## 🎯 Overview
- Apps → Transactions (1+ instructions) → Programs (stateless, use accounts).
- Execution: Sequential instructions, atomic (all succeed or revert).

## 🏗️ Programs
- Deployed binaries; entrypoint dispatches instructions.
- Stateless: Store data in external accounts.
- Example: System Program (transfers, create accounts).

## 📦 Accounts
- Key-value: Pubkey → Data (≤10MB), executable flag, lamports, owner.
- Types: Data (state), Executable (programs), Sysvars (network state, e.g., Clock).
- Rent: Deposit for storage; rent-exempt if ≥2 years (refundable on close).
- Ownership: Only owner modifies data/lamports.

## 🔄 Transactions
- Structure: Instructions + metadata (signers, fees).
- Instructions: Program ID, accounts, data.
- Atomicity: If any fails, revert all changes.

## 🔧 Hands-on Commands
- **Anchor**:
  ```bash
  anchor init hello_solana
  anchor build
  anchor test
  solana-test-validator  # Local validator
  ```
- **TypeScript (Playground)**: Create connection, build/sign/send transactions.
- **Inspect**: Solana Explorer for tx details/accounts.

## 🔗 Resources
- GitHub Repo: https://github.com/Ackee-Blockchain/school-of-solana/tree/master/3.lesson (tasks, slides, examples)
- Solana Playground: For testing transactions
- Anchor Docs: https://book.anchor-lang.com/
