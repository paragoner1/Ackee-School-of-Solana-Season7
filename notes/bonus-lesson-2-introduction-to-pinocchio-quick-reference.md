# Bonus Lesson 2: Introduction to Pinocchio Quick Reference

## Pinocchio vs Anchor Comparison

| Feature | Anchor | Pinocchio |
|-------------|------------|---------------|
| **Entry Point** | `#[program]` macro | `entrypoint!(process_instruction)` |
| **Account Validation** | `#[derive(Accounts)]` | Manual `TryFrom` implementation |
| **Instruction Data** | Function parameters | Manual byte parsing |
| **PDA Handling** | `#[account(seeds = [...])]` | Manual `find_program_address` |
| **Error Handling** | `require!()` macro | Direct `ProgramError` |
| **Build Command** | `anchor build` | `cargo build-bpf` |

## 🔧 Essential Pinocchio Patterns

### **Program Entry Point**
```rust
#![no_std]

use pinocchio::{account_info::AccountInfo, entrypoint, ProgramResult};

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    match instruction_data.split_first() {
        Some((0, data)) => Deposit::try_from((data, accounts))?.process(),
        Some((1, _)) => Withdraw::try_from(accounts)?.process(),
        _ => Err(ProgramError::InvalidInstructionData)
    }
}
```

### **Account Validation**
```rust
pub struct MyAccounts<'a> {
    pub user: &'a AccountInfo,
    pub vault: &'a AccountInfo,
}

impl<'a> TryFrom<&'a [AccountInfo]> for MyAccounts<'a> {
    type Error = ProgramError;

    fn try_from(accounts: &'a [AccountInfo]) -> Result<Self, Self::Error> {
        let [user, vault, _] = accounts else {
            return Err(ProgramError::NotEnoughAccountKeys);
        };

        // Manual validation
        if !user.is_signer() {
            return Err(ProgramError::MissingRequiredSignature);
        }

        if !vault.is_owned_by(&crate::ID) {
            return Err(ProgramError::InvalidAccountOwner);
        }

        Ok(Self { user, vault })
    }
}
```

### **Instruction Data Parsing**
```rust
pub struct MyInstructionData {
    pub amount: u64,
    pub user_id: u32,
}

impl<'a> TryFrom<&'a [u8]> for MyInstructionData {
    type Error = ProgramError;

    fn try_from(data: &'a [u8]) -> Result<Self, Self::Error> {
        if data.len() != 12 { // 8 bytes u64 + 4 bytes u32
            return Err(ProgramError::InvalidInstructionData);
        }

        let amount = u64::from_le_bytes(data[0..8].try_into().unwrap());
        let user_id = u32::from_le_bytes(data[8..12].try_into().unwrap());

        Ok(Self { amount, user_id })
    }
}
```

### **PDA Derivation and Validation**
```rust
// Derive PDA
let (pda_key, bump) = find_program_address(
    &[b"vault", owner.key().as_ref()], 
    &crate::ID
);

// Validate PDA
if vault.key().ne(&pda_key) {
    return Err(ProgramError::InvalidAccountOwner);
}

// Use PDA for signing
let seeds = [
    Seed::from(b"vault"),
    Seed::from(owner.key().as_ref()),
    Seed::from(&[bump])
];
let signers = [Signer::from(&seeds)];
```

### **Cross-Program Invocation (CPI)**
```rust
use pinocchio_system::instructions::Transfer;

Transfer {
    from: self.accounts.from,
    to: self.accounts.to,
    lamports: amount
}
.invoke()  // Regular transfer
.invoke_signed(&signers)  // PDA transfer
```