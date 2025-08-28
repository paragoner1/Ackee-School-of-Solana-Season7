# Bonus Lesson 1: Tokens on Solana

## Lesson Overview
Course: School of Solana - Season 7 - July thru September, 2025  
Focus: Token basics, Token 2022 standard, and building with extensions  
Status: Completed

## 🎯 Lesson Resources
- **GitHub Repository**: Materials and completed project - https://github.com/Ackee-Blockchain/school-of-solana/blob/master/Bonus-Tokens
- **Docker Image**: For Anchor/Solana setup

### **GitHub Repo Details (Bonus-Tokens)**
- **[README.md](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/Bonus-Tokens/README.md)**: Lesson overview, setup instructions, and token concepts.
- **Code Examples**: Anchor project files demonstrating Token 2022 with transfer fees (e.g., lib.rs for instructions, tests).
- **Completed Project**: Full example for building/testing, complementing video hands-on.
- **lib.rs**: Main program logic for initialize/mint/transfer/withdraw instructions using transfer fee extension.
- **tests.ts**: Test scripts to verify mint creation, transfers with fees, and withdrawals.
- **Cargo.toml**: Dependencies for Token 2022 and Anchor.

## 📋 Lesson Content

### **Token Types**
- **Native Currency (SOL)**: Pays for transactions/fees.
- **Tokens**: Created via smart contracts; types include:
  - Stablecoins (e.g., USDC: pegged to fiat for stability).
  - Utility coins: Access services/features.
  - Governance tokens: Voting on proposals/upgrades.
  - NFTs: Unique assets (e.g., artwork ownership).

### **Core Concepts**
- **Token Programs**: Logic for interactions; SPL Token (basic: transfer/mint/burn), Token 2022 (expanded with extensions).
- **Mint Accounts**: Token info (mint authority [optional], supply, decimals, initialized flag, freeze authority).
- **Token Accounts**: Hold balances for one token type (mint, owner, amount, delegate/delegated amount, state [initialized/frozen], is_native [wrapped SOL], close authority).
- **Associated Token Accounts**: Deterministic address from wallet + mint + program ID; sender can create for recipient.

### **Diagram Relationships**
- Token Program owns Mint/Token Accounts.
- Mint tied to Token Accounts; Wallet owns Token Accounts.
- Wallet can be mint/freeze authority.
- One associated account per wallet/mint.

### **Token 2022**
- Backwards-compatible upgrade to SPL Token.
- Supports modular extensions (mint/account); e.g., transfer fees, non-transferable, permanent delegate.
- Some extensions incompatible (e.g., transfer fees + non-transferable).

### **Example Program**
- **Initialize**: Create mint with transfer fee extension (basis points, max fee).
- **Mint**: Mint tokens to recipient's associated account.
- **Transfer**: Transfer with fees withheld.
- **Withdraw**: Creator withdraws withheld fees.

### **Hands-on**
- Use Docker/Anchor: `anchor init project`; Add instructions for init/mint/transfer/withdraw using Token 2022 CPIs.
- Tests: Verify mint creation, balances, fees, withdrawals.

## 🔍 Key Concepts
- Tokens vs. SOL: Tokens via programs; extendable with 2022.
- Mint/Token Separation: Mint defines token; accounts hold balances.
- Deterministic Addresses: Associated accounts simplify transfers.

## 💡 Learning Takeaways
- Token 2022 enables advanced features like fees for customizable tokens.
- Understanding components (program/mint/account) is key to building token systems.
- Anchor simplifies extensions/CPIs for real-world use.

## ✅ Lesson Completion Checklist
- [x] Watch video
- [x] Review GitHub materials
- [x] Build example program
- [x] Run tests for extensions
- [x] Understand key concepts
- [x] Document notes

**Next Steps**: Explore more extensions in projects
