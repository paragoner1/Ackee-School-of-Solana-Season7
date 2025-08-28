# Bonus Lesson 2: Introduction to Pinocchio

## Lesson Overview
Course: School of Solana - Season 7 - July thru September, 2025  
Focus: Pinocchio framework for Solana development  
Status: Completed

## 🎯 What is Pinocchio?

### **Pinocchio vs Anchor**
Pinocchio is a **low-level Solana development framework** that provides more direct control over Solana programs compared to Anchor.

| **Aspect** | **Anchor** | **Pinocchio** |
|------------|------------|---------------|
| **Level** | High-level abstraction | Low-level control |
| **Complexity** | Easier to learn | More complex |
| **Control** | Less control over details | Full control |
| **Boilerplate** | Minimal | More boilerplate |
| **Use Case** | Most applications | Performance-critical apps |

### **Key Characteristics**
- **`#![no_std]`** - No standard library (bare metal)
- **Direct account handling** - Manual account validation
- **Raw instruction processing** - Manual instruction parsing
- **Performance focused** - Optimized for speed and efficiency

---

## 🏗️ Pinocchio Project Structure

### **File Organization**
```
pinocchio-example/
├── src/
│   ├── lib.rs              # Main program entry point
│   └── instructions/
│       ├── mod.rs          # Module declarations
│       ├── deposit.rs      # Deposit instruction
│       └── withdraw.rs     # Withdraw instruction
├── Cargo.toml              # Dependencies
└── Cargo.lock              # Lock file
```

### **Dependencies**
```toml
[dependencies]
pinocchio = "0.9.0"         # Core Pinocchio framework
pinocchio-system = "0.3.0"  # System program integration
```

---

## 🔍 Code Analysis

### **1. Main Program Entry Point (`lib.rs`)**

```rust
#![no_std]  // No standard library - bare metal programming

use pinocchio::{
    account_info::AccountInfo, 
    entrypoint, 
    nostd_panic_handler, 
    program_error::ProgramError, 
    pubkey::Pubkey, 
    ProgramResult
};

// Program ID (hardcoded)
pub const ID: Pubkey = [
    0x0f, 0x1e, 0x6b, 0x14, 0x21, 0xc0, 0x4a, 0x07,
    // ... 32 bytes total
];

// Entry point macro
entrypoint!(process_instruction);
nostd_panic_handler!();

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],      // Raw account array
    instruction_data: &[u8],       // Raw instruction data
) -> ProgramResult {
    // Manual instruction routing based on discriminator
    match instruction_data.split_first() {
        Some((Deposit::DISCRIMINATOR, data)) => 
            Deposit::try_from((data, accounts))?.process(),
        Some((Withdraw::DISCRIMINATOR, _)) => 
            Withdraw::try_from(accounts)?.process(),
        _ => Err(ProgramError::InvalidInstructionData)
    }
}
```

**Key Concepts:**
- **`#![no_std]`** - No standard library, minimal runtime
- **Manual instruction routing** - Based on discriminator bytes
- **Raw account handling** - Direct access to `AccountInfo`
- **Hardcoded program ID** - No dynamic program ID handling

### **2. Deposit Instruction (`deposit.rs`)**

```rust
pub struct Deposit<'a> {
    pub accounts: DepositAccounts<'a>,
    pub instruction_data: DepositInstructionData,
}

impl<'a> TryFrom<(&'a [u8], &'a [AccountInfo])> for Deposit<'a> {
    type Error = ProgramError;

    fn try_from((data, accounts): (&'a [u8], &'a [AccountInfo])) -> Result<Self, Self::Error> {
        let accounts = DepositAccounts::try_from(accounts)?;
        let instruction_data = DepositInstructionData::try_from(data)?;
        Ok(Self { accounts, instruction_data })
    }
}

impl<'a> Deposit<'a> {
    pub const DISCRIMINATOR: &'a u8 = &0;  // Instruction discriminator

    pub fn process(&mut self) -> ProgramResult {
        Transfer {
            from: self.accounts.owner,
            to: self.accounts.vault,
            lamports: self.instruction_data.amount
        }
        .invoke()
    }
}
```

**Account Validation:**
```rust
pub struct DepositAccounts<'a> {
    pub vault: &'a AccountInfo,
    pub owner: &'a AccountInfo,
}

impl<'a> TryFrom<&'a [AccountInfo]> for DepositAccounts<'a> {
    type Error = ProgramError;

    fn try_from(accounts: &'a [AccountInfo]) -> Result<Self, Self::Error> {
        let [owner, vault, _] = accounts else {
            return Err(ProgramError::NotEnoughAccountKeys);
        };

        // Manual validation checks
        if !owner.is_signer() {
            return Err(ProgramError::MissingRequiredSignature);
        }

        if !vault.is_owned_by(&pinocchio_system::ID) {
            return Err(ProgramError::InvalidAccountOwner);
        }

        if vault.lamports().ne(&0) {
            return Err(ProgramError::InvalidAccountData);
        }

        // PDA validation
        let (vault_key, _) = find_program_address(&[b"vault", owner.key()], &crate::ID);
        if vault.key().ne(&vault_key) {
            return Err(ProgramError::InvalidAccountOwner);
        }

        Ok(Self { vault, owner })
    }
}
```

**Instruction Data Parsing:**
```rust
pub struct DepositInstructionData {
    pub amount: u64,
}

impl<'a> TryFrom<&'a [u8]> for DepositInstructionData {
    type Error = ProgramError;

    fn try_from(data: &'a [u8]) -> Result<Self, Self::Error> {
        if data.len() != size_of::<u64>() {
            return Err(ProgramError::InvalidInstructionData);
        }

        let amount = u64::from_le_bytes(data.try_into().unwrap());

        if amount.eq(&0) {
            return Err(ProgramError::InvalidInstructionData);
        }

        Ok(Self { amount })
    }
}
```

### **3. Withdraw Instruction (`withdraw.rs`)**

```rust
pub struct Withdraw<'a> {
    pub accounts: WithdrawalAccounts<'a>,
}

impl<'a> Withdraw<'a> {
    pub const DISCRIMINATOR: &'a u8 = &1;  // Different discriminator

    pub fn process(&mut self) -> ProgramResult {
        let seeds = [
            Seed::from(b"vault"),
            Seed::from(self.accounts.owner.key().as_ref()),
            Seed::from(&self.accounts.bump)
        ];

        let signers = [Signer::from(&seeds)];

        Transfer {
            from: self.accounts.vault,
            to: self.accounts.owner,
            lamports: self.accounts.vault.lamports()
        }
        .invoke_signed(&signers)  // PDA signing
    }
}
```

---

## 🔑 Key Concepts in Pinocchio

### **1. No Standard Library (`#![no_std]`)**
- **Bare metal programming** - No runtime overhead
- **Manual memory management** - No automatic allocations
- **Performance focused** - Minimal binary size
- **Limited functionality** - No standard collections, strings, etc.

### **2. Manual Instruction Routing**
```rust
// Anchor (automatic)
#[program]
pub mod vault {
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> { ... }
    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> { ... }
}

// Pinocchio (manual)
match instruction_data.split_first() {
    Some((Deposit::DISCRIMINATOR, data)) => Deposit::try_from((data, accounts))?.process(),
    Some((Withdraw::DISCRIMINATOR, _)) => Withdraw::try_from(accounts)?.process(),
    _ => Err(ProgramError::InvalidInstructionData)
}
```

### **3. Raw Account Handling**
```rust
// Anchor (structured)
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

// Pinocchio (manual)
pub struct DepositAccounts<'a> {
    pub vault: &'a AccountInfo,
    pub owner: &'a AccountInfo,
}

// Manual validation
if !owner.is_signer() {
    return Err(ProgramError::MissingRequiredSignature);
}
```

### **4. Manual Instruction Data Parsing**
```rust
// Anchor (automatic)
pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()>

// Pinocchio (manual)
pub struct DepositInstructionData {
    pub amount: u64,
}

impl<'a> TryFrom<&'a [u8]> for DepositInstructionData {
    fn try_from(data: &'a [u8]) -> Result<Self, Self::Error> {
        if data.len() != size_of::<u64>() {
            return Err(ProgramError::InvalidInstructionData);
        }
        let amount = u64::from_le_bytes(data.try_into().unwrap());
        Ok(Self { amount })
    }
}
```

### **5. PDA Handling**
```rust
// Manual PDA derivation and validation
let (vault_key, bump) = find_program_address(&[b"vault", owner.key().as_ref()], &crate::ID);
if &vault_key != vault.key() {
    return Err(ProgramError::InvalidAccountOwner);
}

// Manual PDA signing
let seeds = [
    Seed::from(b"vault"),
    Seed::from(self.accounts.owner.key().as_ref()),
    Seed::from(&self.accounts.bump)
];
let signers = [Signer::from(&seeds)];
```

---

## 🎯 When to Use Pinocchio

### **Use Pinocchio When:**
- **Performance is critical** - Need maximum speed
- **Binary size matters** - Minimal program size required
- **Full control needed** - Custom optimizations required
- **Advanced use cases** - Complex program logic
- **Learning Solana internals** - Understanding low-level details

### **Use Anchor When:**
- **Rapid development** - Quick prototyping
- **Team collaboration** - Easier to understand and maintain
- **Most applications** - Standard DeFi, NFT, etc.
- **Learning Solana** - Easier learning curve
- **Production applications** - Battle-tested framework

---

## 🔧 Building and Testing

### **Build Commands**
```bash
cd pinocchio-example
cargo build-bpf  # Build for Solana
cargo test       # Run tests
```

### **Key Differences from Anchor**
- **No `anchor build`** - Use `cargo build-bpf`
- **No `anchor test`** - Use `cargo test`
- **No IDL generation** - Manual client integration
- **No `anchor.toml`** - Direct `Cargo.toml` configuration

---

## 📝 Learning Takeaways

### **Key Insights**
1. **Pinocchio provides low-level control** - Full access to Solana internals
2. **Manual everything** - Account validation, instruction parsing, PDA handling
3. **Performance focused** - No runtime overhead, minimal binary size
4. **Complex but powerful** - More control comes with more complexity
5. **Understanding Solana internals** - Learn how Solana actually works

### **Comparison with Anchor**
- **Anchor**: High-level, easy to use, rapid development
- **Pinocchio**: Low-level, complex, maximum performance
- **Both valid approaches** - Choose based on requirements

### **When You Might Need Pinocchio**
- **High-frequency trading** - Every microsecond counts
- **Gas optimization** - Minimize transaction costs
- **Custom optimizations** - Specialized requirements
- **Learning purposes** - Understanding Solana internals

---

## 🔗 Resources
- [Pinocchio Documentation](https://github.com/Ackee-Blockchain/pinocchio)
- [Solana Program Development](https://docs.solana.com/developing/programming-model)
- [Anchor Framework](https://www.anchor-lang.com/)

---

## ✅ Lesson Completion Checklist
- [x] Understand Pinocchio vs Anchor differences
- [x] Analyze low-level program structure
- [x] Learn manual instruction routing
- [x] Understand raw account handling
- [x] Learn manual instruction data parsing
- [x] Understand PDA handling in Pinocchio
- [x] Know when to use Pinocchio vs Anchor
- [x] Document key concepts and takeaways

**Next Steps**: Continue with other bonus lessons or apply Pinocchio concepts to advanced projects
