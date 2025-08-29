# Lesson 4: Solana Programming Model II Quick Reference

## Program Derived Addresses (PDAs)
- Deterministic addresses off-curve.
- **Derivation**: `Pubkey::find_program_address(&seeds, &program_id) → (pda, bump)`; `Pubkey::create_program_address(seeds_with_bump, program_id)`.
- **Bump**: Starts at 255, decrements until off-curve (no private key).
- **Signing**: Use in invoke_signed for CPIs; runtime adds program ID to seeds for validation.

## 🔄 Cross-Program Invocations (CPI)
- **Invoke**: `invoke(&instruction, &account_infos)?` - No PDA signing.
- **Invoke Signed**: `invoke_signed(&instruction, &account_infos, &[&signer_seeds])?` - For PDA signing.
- **Max Depth**: 4 nested CPIs.
- **Privileges**: Signers extend; PDAs sign via owning program's ID.

##  Commands
- **Anchor Workspace**: `anchor init program_a`; `anchor new program_b` (add to workspace).
- **Build/Test**: `anchor build`; `anchor test`.
- **Local Validator**: `solana-test-validator`.

## 🔗 Resources
- GitHub Repo: https://github.com/Ackee-Blockchain/school-of-solana/tree/master/4.lesson (tasks, slides, examples)
- Solana Playground: PDA/CPI demos
