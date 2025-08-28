# Lesson 4: Solana Programming Model II

## 📚 Lesson Overview
**Date**: [Current Date]  
**Focus**: Program Derived Addresses (PDAs) and Cross-Program Invocations (CPIs)  
**Status**: ✅ Completed

## 🎯 Lesson Resources
- **GitHub Repository**: Materials, tasks, slides, and code examples - https://github.com/Ackee-Blockchain/school-of-solana/tree/master/4.lesson
- **Solana Playground**: Examples for find_program_address and create_program_address

### **GitHub Repo Details (4.lesson)**
- **[README.md](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/4.lesson/README.md)**: Lesson intro, setup, and programming model Part 2.
- **Tasks/Exercises**: Hands-on for PDAs and CPIs.
- **Slides/Presentations**: Visuals on PDAs, CPI processes.
- **Code Examples**: Anchor projects demonstrating PDA derivation and CPI (e.g., Program A invoking B).

## 📋 Lesson Content

### **Program Derived Address (PDA)**
- **Motivation**: Deterministic addresses without storing keypairs; e.g., for game user stats, derive from user pubkey + static string.
- **Differences from Key Pairs**: PDAs are pubkeys off the elliptic curve (no private key); derived from seeds/program ID/bump.
- **Derivation Process**: Use find_program_address (seeds, program ID) to get PDA and bump; loop decreasing bump (255 to 0) until off-curve.
- **Security**: Off-curve ensures no private key; allows program-controlled signing for CPIs.

### **Cross-Program Invocations (CPI)**
- **Basics**: One program invokes another's instructions; privileges (e.g., signers) extend; max depth 4.
- **Invoke vs. Invoke Signed**: Invoke for non-PDA signers; invoke_signed for PDA signing (pass seeds/bump/program ID).
- **PDA Signing**: Runtime adds calling program's ID to seeds; enables PDAs as authorities (e.g., escrow vaults).
- **Example**: Escrow: PDA as vault authority; only program can transfer out via CPI.

### **Hands-on Examples**
- **Anchor Multi-Program Workspace**: `anchor init program_a`; `anchor new program_b`; Use CPI context for invocation.
- **PDA Derivation**: In tests, use Pubkey::find_program_address(seeds, program_id) for address/bump.
- **CPI to Another Program/System**: From Program A, invoke Program B's instruction; use invoke_signed for PDA-signed system transfer.

## 🔍 Key Concepts
- PDAs: Deterministic, off-curve addresses for program control without private keys.
- CPI: Extend execution across programs; signed for authority.
- Signing with PDAs: Runtime validates via program ID in seeds.

## 💡 Learning Takeaways
- PDAs enable secure, deterministic state without key management.
- CPIs allow composable programs; careful with privilege extension.
- Anchor simplifies PDAs/CPIs for efficient development.

## ✅ Lesson Completion Checklist
- [x] Watch video
- [x] Review GitHub materials
- [x] Practice PDA derivation
- [x] Build CPI examples
- [x] Understand key concepts
- [x] Document notes

**Next Steps**: Apply PDAs/CPIs in projects
