# Lesson 5: Best Dev & Debug Practices Quick Reference

## Best Practices
- Modularize: Separate errors/instructions/state.
- Visualize: Diagram flows (instructions/roles), data structures (PDAs).
- Pipelines: GitHub workflows for auto-tests on PRs.
- Validation: Check all inputs on-chain; don't rely on back-end.
- Testing: High coverage; unhappy paths, unit/integration/fuzzing.

## 🔍 Debugging Tips
- **Signature Failed**: Add all signers (e.g., for account init).
- **Simulation Failed**: Skip preflight; check logs for lamports/rent.
- **Custom Error 0x0**: Reference Solana docs (e.g., account in use).
- **Deserialize Failed**: Include discriminator in space.
- **Seeds Violated**: Derive PDA correctly.
- **Overflow**: Use checked ops, require macros.
- General: Log balances/keys, fetch on-chain data, assert errors.

## 🔧 Commands
- **Anchor Test**: `anchor test` (integration).
- **Cargo Test**: `cargo test` (unit/integration).
- **Build**: `anchor build` (update IDL).

## 🔗 Resources
- GitHub Repo: https://github.com/Ackee-Blockchain/school-of-solana/tree/master/5.lesson (examples, workflows)
- Solana Docs: Program/instruction errors
- Trident: Fuzz testing tool
