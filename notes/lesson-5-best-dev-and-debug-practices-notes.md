# Lesson 5: Best Dev & Debug Practices

## 📚 Lesson Overview
**Course**: School of Solana - Season 7 - July thru September, 2025  
**Focus**: Development best practices, debugging techniques for Solana programs  
**Status**: ✅ Completed

## 🎯 Lesson Resources
- **GitHub Repository**: https://github.com/Ackee-Blockchain/school-of-solana/tree/master/5.lesson (includes examples, code structure)
- **Bonus Lecture**: SPL Tokens (voluntary, no assignment)

### **GitHub Repo Details (5.lesson)**
- **README.md**: Lesson intro, best practices overview.
- **Code Examples**: Modular program structure (e.g., lib.rs, instructions folder), debugging snippets.
- **Hands-on Repo**: GitHub repo with branches for bug examples and resolutions.

## 📋 Lesson Content

### **Modularize Your Code**
- Avoid single-file "spaghetti code" (e.g., 1200+ lines).
- Use modules: Separate errors, instructions, state (e.g., Anchor Tic-Tac-Toe example).
- Structure: lib.rs wrappers, instructions in separate files with contexts.

### **Visualize Program Flow and Data Flow**
- Diagram instruction sequences, roles (e.g., admin-only actions).
- Data structure diagrams (e.g., PDA derivations).
- Aids testing unhappy paths and security.

### **GitHub Pipelines**
- Automate tests on pull requests (e.g., Anchor tests via workflows).
- Setup: Checkout repo, install Solana/Anchor, run `anchor test`.
- Require peer reviews and passing checks before merging.

### **Do Not Rely on Back-End**
- Validate all inputs in the program; anyone can invoke it.
- Back-end checks are insufficient for security.

### **Test!**
- Aim for high coverage, including unhappy paths and unexpected accounts.
- Types: Anchor integration tests, Rust unit tests, runtime tests, fuzzing.
- Tools: Trident for Anchor fuzzing (generates clients, templates).

### **Hands-on Debugging**
- **Signature Verification Failed**: Ensure all signers (e.g., for account creation) are included.
- **Transaction Simulation Failed**: Skip preflight checks to view logs; airdrop lamports for rent.
- **Custom Program Error 0x0**: Check system program errors (e.g., account in use); use Solana docs.
- **Account Did Not Deserialize**: Verify space allocation (include discriminator).
- **Seeds Constraint Violated**: Use correct PDA derivation.
- **Overflow/Panic**: Use checked arithmetic, require macros for errors.
- Tips: Log balances/keys, fetch on-chain data, assert errors in tests.

## 🔍 Key Concepts
- Modular code improves maintainability.
- Visualization prevents logic errors.
- On-chain validation is essential.
- Comprehensive testing covers edge cases.

## 💡 Learning Takeaways
- Debugging requires logs, tricks like skipping preflight, and source code dives.
- Testing unhappy paths catches exploits.
- Anchor/Rust tools streamline development.

## ✅ Lesson Completion Checklist
- [x] Watch video
- [x] Review GitHub materials
- [x] Debug hands-on examples
- [x] Understand testing types
- [x] Document notes

**Next Steps**: Apply to final project; watch bonus tokens lecture.
