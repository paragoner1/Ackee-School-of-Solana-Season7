# 🚀 Step-by-Step Guide: Building Solana Token Programs

A comprehensive guide for building Solana token programs with Anchor framework, based on hands-on learning experience.

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Understanding the Foundation](#understanding-the-foundation)
3. [Building the Initialize Instruction](#building-the-initialize-instruction)
4. [Building the Mint Instruction](#building-the-mint-instruction)
5. [Building the Transfer Instruction](#building-the-transfer-instruction)
6. [Building the Withdraw Instruction](#building-the-withdraw-instruction)
7. [Testing and Deployment](#testing-and-deployment)
8. [Key Concepts Summary](#key-concepts-summary)

---

## 🛠️ Project Setup

### Step 1: Environment Setup
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v2.2.12/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Create new project
anchor init token-example
cd token-example
```

### Step 2: Dependencies
```bash
# Install Node.js dependencies
yarn install

# Verify Anchor version
anchor --version  # Should be v0.31.1
```

---

## 🏗️ Understanding the Foundation

### Key Concepts to Master

#### 1. Anchor Framework
- **Purpose**: Simplifies Solana development
- **Benefits**: Less boilerplate, automatic validation, better errors
- **Key Macro**: `#[program]` - marks main program module

#### 2. Program Structure
```rust
use anchor_lang::prelude::*;

declare_id!("YOUR_PROGRAM_ID");

#[program]
pub mod your_program {
    use super::*;
    
    // Instructions go here
}
```

#### 3. Account Validation
- **Signer**: Must sign transaction (pay fees, authorize)
- **Mutable**: Account will be modified
- **Init if needed**: Create account if doesn't exist
- **Authority checks**: Verify permissions

---

## 🎯 Building the Initialize Instruction

### Step 1: Understand the Objective
**Goal**: Create a token mint with transfer fee capabilities

**What it does**:
- Creates token mint account
- Sets up transfer fee configuration
- Establishes mint authority
- Configures basic properties (decimals, etc.)

### Step 2: Import Dependencies
```rust
use anchor_lang::{prelude::*, system_program::{create_account, CreateAccount}};
use anchor_spl::{token_2022::{initialize_mint2, spl_token_2022::{extension::ExtensionType, pod::PodMint}, InitializeMint2, Token2022}, token_interface::{transfer_fee_initialize, TransferFeeInitialize}};
```

### Step 3: Define Account Context
```rust
#[derive(Accounts)]
pub struct InitializeContext<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(mut)]
    pub mint: Signer<'info>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>
}
```

**Why each account**:
- `creator`: Pays for account creation and becomes mint authority
- `mint`: The token mint account we're creating
- `token_program`: Token 2022 program for operations
- `system_program`: For creating new accounts

### Step 4: Build the Function
```rust
pub fn _initialize(ctx: Context<InitializeContext>, fee_bps: u16, max_fee: u64) -> Result<()> {
    // 1. Calculate space needed
    let space = ExtensionType::try_calculate_account_len::<PodMint>(&[ExtensionType::TransferFeeConfig])?;
    let lamports = Rent::get()?.minimum_balance(space);

    // 2. Create mint account
    let create_account_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        CreateAccount{
            from: ctx.accounts.creator.to_account_info(),
            to: ctx.accounts.mint.to_account_info()
        }
    );
    create_account(create_account_ctx, lamports, space as u64, &ctx.accounts.token_program.key())?;

    // 3. Set up transfer fees
    let transfer_fee_init_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        TransferFeeInitialize {
            token_program_id: ctx.accounts.token_program.to_account_info(),
            mint: ctx.accounts.mint.to_account_info()
        }
    );
    transfer_fee_initialize(transfer_fee_init_ctx, None, Some(&ctx.accounts.creator.key()), fee_bps, max_fee)?;

    // 4. Initialize mint
    let initialize_mint_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        InitializeMint2 {
            mint: ctx.accounts.mint.to_account_info()
        }
    );
    initialize_mint2(initialize_mint_ctx, 9, &ctx.accounts.creator.key(), None)?;

    Ok(())
}
```

### Step 5: Key Learning Points
- **Space calculation**: Determine account size for rent
- **CPI calls**: Cross-program invocation for account creation
- **Transfer fees**: Token 2022 feature for revenue generation
- **Mint initialization**: Set basic properties (decimals, authority)

---

## 🪙 Building the Mint Instruction

### Step 1: Understand the Objective
**Goal**: Create new tokens and send them to recipients

**What it does**:
- Mints new tokens (increases supply)
- Sends tokens to recipient
- Creates recipient account if needed

### Step 2: Import Dependencies
```rust
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_2022::{mint_to, MintTo, Token2022}, token_interface::{Mint, TokenAccount}};
```

### Step 3: Define Account Context
```rust
#[derive(Accounts)]
pub struct MintContext<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        mint::authority = creator,
        mint::token_program = token_program
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub recipient: UncheckedAccount<'info>,
    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = recipient,
        associated_token::token_program = token_program
    )]
    pub recipient_ata: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>
}
```

**Key Features**:
- `init_if_needed`: Creates recipient account automatically
- `mint::authority = creator`: Only creator can mint
- `associated_token::mint = mint`: Links to specific token

### Step 4: Build the Function
```rust
pub fn _mint(ctx: Context<MintContext>, amount: u64) -> Result<()> {
    // Validate amount
    if amount == 0 {
        panic!("Invalid amount!");
    }

    // Create CPI context
    let mint_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        MintTo{
            authority: ctx.accounts.creator.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.recipient_ata.to_account_info()
        }
    );

    // Execute mint
    mint_to(mint_ctx, amount)?;

    Ok(())
}
```

### Step 5: Key Learning Points
- **Associated Token Accounts (ATAs)**: Deterministic addresses
- **Init if needed**: Automatic account creation
- **Authority validation**: Only authorized users can mint
- **CPI for minting**: Using Token 2022 program

---

## 🔄 Building the Transfer Instruction

### Step 1: Understand the Objective
**Goal**: Transfer tokens between accounts with fee collection

**What it does**:
- Moves tokens from sender to recipient
- Collects transfer fees automatically
- Validates token type and decimals

### Step 2: Import Dependencies
```rust
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_2022::{transfer_checked, Token2022, TransferChecked}, token_interface::TokenAccount};
```

### Step 3: Define Account Context
```rust
#[derive(Accounts)]
pub struct TransferContext<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    pub mint: UncheckedAccount<'info>,
    #[account(mut)]
    pub recipient: UncheckedAccount<'info>,
    #[account(
        init_if_needed,
        payer = sender,
        associated_token::mint = mint,
        associated_token::authority = recipient,
        associated_token::token_program = token_program
    )]
    pub recipient_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = sender,
        associated_token::token_program = token_program
    )]
    pub sender_ata: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>
}
```

**Key Differences from Mint**:
- Two token accounts: sender and recipient
- Sender account must exist (no `init_if_needed`)
- Uses `transfer_checked` for validation

### Step 4: Build the Function
```rust
pub fn _transfer(ctx: Context<TransferContext>, amount: u64) -> Result<()> {
    // Validate amount
    if amount == 0 {
        panic!("Invalid amount!");
    }

    // Create CPI context
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        TransferChecked{
            authority: ctx.accounts.sender.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.recipient_ata.to_account_info(),
            from: ctx.accounts.sender_ata.to_account_info()
        }
    );

    // Execute transfer
    transfer_checked(transfer_ctx, amount, 9)?;

    Ok(())
}
```

### Step 5: Key Learning Points
- **Transfer checked**: Validates mint and decimals
- **Fee collection**: Automatic on transfers
- **Account validation**: Sender must have tokens
- **CPI for transfers**: Using Token 2022 program

---

## 💰 Building the Withdraw Instruction

### Step 1: Understand the Objective
**Goal**: Withdraw accumulated transfer fees

**What it does**:
- Collects fees from accounts that paid them
- Sends fees to creator
- Can withdraw from multiple accounts at once

### Step 2: Import Dependencies
```rust
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token_2022::Token2022, token_interface::{withdraw_withheld_tokens_from_accounts, Mint, TokenAccount, WithdrawWithheldTokensFromAccounts}};
```

### Step 3: Define Account Context
```rust
#[derive(Accounts)]
pub struct WithdrawContext<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        mut,
        mint::authority = creator,
        mint::token_program = token_program
    )]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut)]
    pub from: UncheckedAccount<'info>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = from,
        associated_token::token_program = token_program
    )]
    pub from_ata: InterfaceAccount<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = creator,
        associated_token::token_program = token_program
    )]
    pub creator_ata: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Program<'info, Token2022>,
    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>
}
```

### Step 4: Build the Function
```rust
pub fn _withdraw(ctx: Context<WithdrawContext>) -> Result<()> {
    // Create CPI context
    let withdraw_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        WithdrawWithheldTokensFromAccounts{
            authority: ctx.accounts.creator.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            destination: ctx.accounts.creator_ata.to_account_info(),
            token_program_id: ctx.accounts.token_program.to_account_info()
        }
    );

    // Execute withdrawal
    withdraw_withheld_tokens_from_accounts(
        withdraw_ctx,
        vec![ctx.accounts.from_ata.to_account_info()],
    )?;

    Ok(())
}
```

### Step 5: Key Learning Points
- **Withheld tokens**: Fees temporarily held in accounts
- **Vector of accounts**: Can withdraw from multiple accounts
- **Authority requirement**: Only creator can withdraw
- **Revenue generation**: Enables monetization of token usage

---

## 🧪 Testing and Deployment

### Step 1: Local Testing
```bash
# Build the program
anchor build

# Run tests
anchor test
```

### Step 2: Test Verification
Ensure all tests pass:
- ✅ Initialize creates mint with fees
- ✅ Mint creates tokens for recipients
- ✅ Transfer moves tokens and collects fees
- ✅ Withdraw collects accumulated fees

### Step 3: Devnet Deployment
```bash
# Switch to devnet
solana config set --url devnet

# Get devnet SOL
solana airdrop 2

# Deploy program
anchor deploy
```

### Step 4: Mainnet Deployment
```bash
# Switch to mainnet
solana config set --url mainnet-beta

# Deploy (requires real SOL)
anchor deploy
```

---

## 🧠 Key Concepts Summary

### 1. Anchor Framework
- **`#[program]`**: Marks main program module
- **`#[derive(Accounts)]`**: Defines account validation
- **`Context<T>`**: Contains validated accounts
- **`Result<()>`**: Error handling pattern

### 2. Account Types
- **`Signer<'info>`**: Must sign transaction
- **`UncheckedAccount<'info>`**: No validation
- **`InterfaceAccount<'info, T>`**: Typed account
- **`Program<'info, T>`**: Program account

### 3. Account Attributes
- **`#[account(mut)]`**: Account will be modified
- **`init_if_needed`**: Create if doesn't exist
- **`payer = account`**: Who pays for creation
- **`authority = account`**: Permission checks

### 4. CPI Patterns
- **`CpiContext::new()`**: Create context
- **`to_account_info()`**: Convert to account info
- **`?` operator**: Error propagation
- **Vector of accounts**: Multiple operations

### 5. Token 2022 Features
- **Transfer fees**: Automatic fee collection
- **Extensions**: Additional functionality
- **Withheld tokens**: Temporary fee storage
- **Fee withdrawal**: Revenue collection

---

## 🎯 Best Practices

### 1. Security
- Always validate account authorities
- Use `transfer_checked` for safety
- Implement proper error handling
- Test thoroughly before deployment

### 2. User Experience
- Use `init_if_needed` for convenience
- Provide clear error messages
- Optimize for gas efficiency
- Document your functions

### 3. Code Organization
- Separate instructions into modules
- Use descriptive variable names
- Add comprehensive comments
- Follow Rust conventions

### 4. Testing
- Test all instruction paths
- Verify account validation
- Test error conditions
- Use realistic test data

---

## 📚 Additional Resources

- [Anchor Documentation](https://www.anchor-lang.com/docs)
- [Solana Cookbook](https://solanacookbook.com/)
- [Token 2022 Program](https://spl.solana.com/token-2022)
- [Rust Programming Language](https://doc.rust-lang.org/book/)

---

**This guide is based on hands-on learning experience. Use it as a reference for your own token projects! 🚀**
