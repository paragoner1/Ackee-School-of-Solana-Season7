# Lesson 3: Solana Programming Model I

## 📚 Lesson Overview
**Course**: School of Solana - Season 7 - July thru September, 2025  
**Focus**: Solana programs, accounts, transactions  
**Status**: ✅ Completed

## 🎯 Lesson Resources
- **GitHub Repository**: Materials, tasks, slides, and code examples - https://github.com/Ackee-Blockchain/school-of-solana/tree/master/3.lesson
- **Docker Image**: For environment setup

### **GitHub Repo Details (3.lesson)**
- **[README.md](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/3.lesson/README.md)**: Lesson intro, setup, and programming model basics.
- **Tasks/Exercises**: Hands-on for accounts/transactions.
- **Slides/Presentations**: Visuals on accounts, programs, transactions.
- **Code Examples**: TypeScript transaction scripts, Anchor program initialization.

## 📋 Lesson Content

### **Overview**
- Apps interact with Solana by sending transactions containing instructions.
- Instructions execute on deployed programs, which are stateless and use accounts for data.
- Transactions are atomic: All succeed or none do.

### **Programs**
- Piece of code deployed to validators; similar to Rust binaries but with entrypoint instead of main.
- Stateless: No internal storage; use accounts for state.
- Entry point dispatches to specific functions based on input data.

### **Accounts**
- Everything on Solana is an account: Programs, data, wallets.
- Key-value pairs: Address (32-byte pubkey) → Data (up to 10MB binary).
- Fields: Data, executable flag, lamports (balance), owner (program ID).
- Rent: Deposit SOL for storage; rent-exempt if >=2 years' rent (refundable on close).
- Owners: Only owner can modify data/deduct lamports; e.g., System Program owns uninitialized accounts.

### **Transactions**
- Sent to interact with network; contain 1+ instructions.
- Instructions: Executed sequentially by programs.
- Atomicity: If any instruction fails, all changes revert.
- Example: System Program transfer updates sender/receiver balances atomically.

### **Hands-on Examples**
- **TypeScript Transfer**: Create connection, generate keys, build transfer instruction, add to transaction, sign/send.
- **Anchor Initialization**: Define program with context (accounts), constraints (init, payer, space), store data in account; test with fetch to verify.

## 🔍 Key Concepts
- Stateless Programs: Rely on external accounts for persistence.
- Atomic Transactions: Ensure all-or-nothing execution.
- Account Ownership: Controls modifications; critical for security.
- Rent Mechanism: Pays for on-chain storage, refundable.

## 💡 Learning Takeaways
- Solana's model separates code (programs) from state (accounts) for efficiency.
- Understanding transactions/instructions is key to building interactions.
- Practice is essential—use playground/Anchor for hands-on mastery.

## ✅ Lesson Completion Checklist
- [x] Watch video
- [x] Review GitHub materials
- [x] Practice TypeScript transfer
- [x] Build Anchor initialization example
- [x] Understand key concepts
- [x] Document notes

**Next Steps**: Proceed to Part 2 (CPIs, PDAs)
