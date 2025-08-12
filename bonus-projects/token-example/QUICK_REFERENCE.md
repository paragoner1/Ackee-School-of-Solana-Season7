# ⚡ Quick Reference: Solana Token Development

## 🚀 Essential Commands

### Setup & Build
```bash
# Install dependencies
yarn install

# Build program
anchor build

# Run tests
anchor test

# Deploy to devnet
solana config set --url devnet
solana airdrop 2
anchor deploy
```

## 🏗️ Program Structure

### Main Program (`lib.rs`)
```rust
use anchor_lang::prelude::*;

declare_id!("YOUR_PROGRAM_ID");

#[program]
pub mod token_example {
    use super::*;
    
    pub fn initialize(ctx: Context<InitializeContext>, fee_bps: u16, max_fee: u64) -> Result<()> {
        _initialize(ctx, fee_bps, max_fee)
    }
    
    pub fn mint(ctx: Context<MintContext>, amount: u64) -> Result<()> {
        _mint(ctx, amount)
    }
    
    pub fn transfer(ctx: Context<TransferContext>, amount: u64) -> Result<()> {
        _transfer(ctx, amount)
    }
    
    pub fn withdraw(ctx: Context<WithdrawContext>) -> Result<()> {
        _withdraw(ctx)
    }
}
```

## 🔑 Key Account Types

| Type | Purpose | Example |
|------|---------|---------|
| `Signer<'info>` | Must sign transaction | `pub creator: Signer<'info>` |
| `UncheckedAccount<'info>` | No validation | `pub recipient: UncheckedAccount<'info>` |
| `InterfaceAccount<'info, T>` | Typed account | `pub mint: InterfaceAccount<'info, Mint>` |
| `Program<'info, T>` | Program account | `pub token_program: Program<'info, Token2022>` |

## 🏷️ Account Attributes

| Attribute | Purpose |
|-----------|---------|
| `#[account(mut)]` | Account will be modified |
| `init_if_needed` | Create account if doesn't exist |
| `payer = account` | Who pays for account creation |
| `authority = account` | Permission validation |

## 🔄 CPI Patterns

### Account Creation
```rust
let create_account_ctx = CpiContext::new(
    system_program.to_account_info(),
    CreateAccount{
        from: creator.to_account_info(),
        to: mint.to_account_info()
    }
);
create_account(create_account_ctx, lamports, space, &token_program.key())?;
```

### Token Operations
```rust
let mint_ctx = CpiContext::new(
    token_program.to_account_info(),
    MintTo{
        authority: creator.to_account_info(),
        mint: mint.to_account_info(),
        to: recipient_ata.to_account_info()
    }
);
mint_to(mint_ctx, amount)?;
```

## 🪙 Token 2022 Features

### Transfer Fee Setup
```rust
transfer_fee_initialize(
    ctx, 
    None,                    // Transfer fee authority
    Some(&creator.key()),    // Config authority
    fee_bps,                 // Fee in basis points (100 = 1%)
    max_fee                  // Maximum fee amount
)?;
```

### Fee Withdrawal
```rust
withdraw_withheld_tokens_from_accounts(
    ctx,
    vec![from_ata.to_account_info()],  // Can withdraw from multiple accounts
)?;
```

## 🧪 Testing Checklist

- [ ] Initialize creates mint with fees
- [ ] Mint creates tokens for recipients
- [ ] Transfer moves tokens and collects fees
- [ ] Withdraw collects accumulated fees
- [ ] All account validations work
- [ ] Error conditions handled properly

## 🚨 Common Issues

### Build Errors
- **Missing dependencies**: Run `yarn install`
- **Version mismatch**: Check Anchor and Solana versions
- **Syntax errors**: Use `anchor build` to check

### Test Failures
- **Account validation**: Check account attributes
- **CPI errors**: Verify program IDs and accounts
- **Permission errors**: Ensure proper authorities

### Deployment Issues
- **Insufficient SOL**: Get more devnet SOL with `solana airdrop`
- **Network issues**: Check Solana cluster status
- **Program ID**: Ensure `declare_id!` matches deployment

## 📚 Essential Imports

```rust
// Basic Anchor
use anchor_lang::prelude::*;

// System program for account creation
use anchor_lang::system_program::{create_account, CreateAccount};

// Token 2022 operations
use anchor_spl::token_2022::{initialize_mint2, mint_to, transfer_checked, Token2022};

// Associated token accounts
use anchor_spl::associated_token::AssociatedToken;

// Token interfaces
use anchor_spl::token_interface::{Mint, TokenAccount, transfer_fee_initialize, withdraw_withheld_tokens_from_accounts};
```

## 🎯 Best Practices

1. **Always validate accounts** - Use proper account types and attributes
2. **Use `transfer_checked`** - Safer than regular transfer
3. **Implement error handling** - Use `?` operator and `Result<()>`
4. **Test thoroughly** - Cover all instruction paths
5. **Document your code** - Add comments explaining complex logic
6. **Use `init_if_needed`** - Improve user experience

---

**Keep this reference handy for quick lookups during development! 🚀**
