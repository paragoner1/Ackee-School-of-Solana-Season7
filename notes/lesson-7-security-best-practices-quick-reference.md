# Lesson 7: Security Best Practices Quick Reference

## 🎯 Security Hierarchy Pyramid
- **Code Quality**: Clean, maintainable code; address OWASP Top 10 pitfalls proactively.
- **Testing**: Unit/integration tests, blue teaming, regression, social engineering checks.
- **Fuzzing**: Automated random inputs (blackbox, whitebox, graybox, coverage-guided).
- **Audits**: Third-party reviews; prepare with structure, docs, uniform scope.

## 🚨 Common Vulnerabilities
- **Signer Authorization**: Unauthorized signers executing actions.
- **Arbitrary CPI**: Malicious programs substituting in CPIs.
- **Duplicate Mutable Accounts**: Same account provided multiple times, causing no-ops.
- **Ownership Check**: Incorrect owner allowing fake accounts.
- **PDA Privileges**: Misused PDA authorities for unauthorized actions.
- **Revival Attack**: "Closed" accounts revived by adding lamports.
- **Re-Initialization Attack**: Resetting accounts to defaults via init_if_needed.
- **Account Reloading**: Reading stale data post-CPI.
- **Type Cosplay**: Deserializing mismatched account types without discriminator checks.

## 🚨 Sophisticated Attack Vectors
- **Phishing**: Fake sites/emails tricking signatures.
- **Private Key Leakage**: Exposure via repos/malware.
- **Sandwich Attacks**: MEV via front/back-running trades.
- **Front Running (incl. Initialization)**: Executing ahead to DoS or exploit.
- **Loss of Precision**: Integer/floating-point calculation errors.
- **Overflow/Underflow**: Arithmetic exceeding bounds, causing panics/DoS.

## 🔒 Mitigation Patterns
```rust
// Signer Authorization
#[account(signer = authority)]

// Arbitrary CPI
#[account(executable, has_one = program_id)]

// Duplicate Mutable Accounts
require_keys_neq!(account1.key(), account2.key());

// Ownership Check
#[account(owner = token_program::ID)]

// PDA Privileges
invoke_signed(&instruction, &accounts, &[&seeds]) // Ensure caller authorization

// Revival Attack
#[account(close = rent_receiver)]

// Re-Initialization Attack
#[account(init_if_needed)] // Add: if account.is_initialized() { return Err(Error::AlreadyInitialized); }

// Account Reloading
account.reload()?;

// Type Cosplay
#[account] // Uses discriminator check
```
// Additional: Use checked arithmetic (e.g., checked_add) for overflows; program metadata for front running.

## 🔧 Security Tools & Commands
- **Testing**: `anchor test` for integration; custom scripts for blue teaming.
- **Fuzzing**: `cargo fuzz` (coverage-guided); Trident for Solana-specific.
- **Audits**: cargo-audit for dependencies; clippy for static analysis.
- **Other**: GitHub pipelines for automated fuzzing; OWASP checklists.

## 💡 Best Practices
- **Code Quality**: Follow OWASP Top 10; security by design, proactive prevention from day one.
- **Testing**: Think like an attacker; include regression, blue teaming (monitor/detect/respond/communicate), social engineering tests.
- **Fuzzing**: Use types like mutation/generation-based for comprehensive coverage.
- **Audits**: Developer: Structure code, document thoroughly; Auditor: Review architecture, outer components, incident response.
- **General**: Defense in depth (multiple layers); least privileges; monitor for biases and leaks.

## 🔗 Resources
- [Solana Security Docs](https://docs.solana.com/security)
- [Anchor Book Security Section](https://book.anchor-lang.com/anchor_in_depth/security.html)
- [OWASP Top 10](https://owasp.org/Top10/)
- [Solana Auditors Bootcamp Repo/CTF](https://github.com/Ackee-Blockchain/solana-auditors-bootcamp)
- Video Transcripts: Main - https://www.youtube.com/watch?v=YnrT8PWgLNc, Supplemental - https://www.youtube.com/watch?v=ZvON2fr9MX0
