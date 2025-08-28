# Bonus Lesson 1: Tokens on Solana Quick Reference

## 🎯 Token Types
- **Native (SOL)**: Pays fees/transactions.
- **Tokens**: Stablecoins (e.g., USDC), Utility (access services), Governance (voting), NFTs (unique assets).

## 🔍 Core Concepts
- **Token Programs**: SPL Token (basic), Token 2022 (extensions).
- **Mint Accounts**: Authority (mint/freeze), supply, decimals, initialized.
- **Token Accounts**: Mint/owner, amount, delegate, state (initialized/frozen), is_native (wrapped SOL), close authority.
- **Associated Token Accounts**: Derived from wallet + mint + program ID; one per wallet/mint.

## 🔄 Token 2022 Extensions
- **Mint**: Transfer fees, non-transferable, permanent delegate, etc. (some incompatible).
- **Account**: Group member, metadata pointer, etc.
- Usage: Initialize via CPI with extensions (e.g., transfer fees: basis points/max fee).

## 🔧 Commands
- **Anchor**: `anchor init project`; `anchor build`; `anchor test`.
- **Keypair**: `solana-keygen new`.

## 🔗 Resources
- GitHub Repo: https://github.com/Ackee-Blockchain/school-of-solana/blob/master/Bonus-Tokens (code, examples)
- Solana Docs: Token 2022 extensions
