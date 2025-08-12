# 🪙 Solana Token Program with Transfer Fees

A comprehensive Solana token program built with Anchor framework that demonstrates Token 2022 extensions, including transfer fees, minting, transferring, and fee withdrawal capabilities.

## 🎯 Project Overview

This project is a **step-by-step learning implementation** of a Solana token program that showcases:

- **Token 2022 Extensions** - Advanced token features beyond basic SPL Token
- **Transfer Fees** - Automatic fee collection on token transfers
- **Cross-Program Invocation (CPI)** - Programs calling other programs
- **Account Validation** - Anchor's security features
- **Associated Token Accounts (ATAs)** - Deterministic token account addresses

## 🏗️ Architecture

### Program Structure
```
token-example/
├── programs/token-example/src/
│   ├── lib.rs              # Main program entry point
│   └── instructions/
│       ├── initialize.rs    # Token mint creation with fees
│       ├── mint.rs         # Token minting functionality
│       ├── transfer.rs     # Token transfer with fee collection
│       └── withdraw.rs     # Fee withdrawal mechanism
```

### Key Instructions

1. **Initialize** - Creates token mint with transfer fee configuration
2. **Mint** - Creates new tokens and sends to recipients
3. **Transfer** - Moves tokens between accounts (collects fees)
4. **Withdraw** - Collects accumulated transfer fees

## 🚀 Build Process

### Prerequisites
- Solana CLI v2.2.12
- Anchor Framework v0.31.1
- Node.js and Yarn

### Installation & Testing
```bash
# Install dependencies
yarn install

# Build the program
anchor build

# Run tests
anchor test
```

### Test Results
```
✅ Initialize - Creates mint with transfer fees
✅ Mint - Mints tokens to recipients
✅ Transfer - Transfers tokens (collects 5% fee)
✅ Withdraw - Withdraws accumulated fees
```

## 🧠 Key Learnings

### 1. Anchor Framework Benefits
- **Simplified Development** - Less boilerplate than native Solana
- **Automatic Validation** - Account permissions checked at compile time
- **Better Error Handling** - Clear error messages and types
- **IDL Generation** - Automatic API documentation

### 2. Token 2022 vs SPL Token
- **SPL Token** - Basic token functionality
- **Token 2022** - Enhanced features including transfer fees, interest-bearing tokens, etc.

### 3. Cross-Program Invocation (CPI)
- Programs can call other programs securely
- Enables complex interactions between different protocols
- Used for account creation, token operations, etc.

### 4. Account Validation Patterns
- **Signer** - Must sign transaction (pay fees, authorize actions)
- **Mutable** - Account will be modified
- **Init if needed** - Create account if it doesn't exist
- **Authority checks** - Verify permissions before operations

### 5. Transfer Fee Mechanics
- Fees are collected automatically on transfers
- Fees are "withheld" in sender accounts
- Creator can withdraw fees later
- Enables revenue generation from token usage

## 🔧 Technical Implementation

### Account Contexts
Each instruction defines its required accounts with specific permissions:

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

### CPI Calls
Programs interact with other programs through CPI:

```rust
let create_account_ctx = CpiContext::new(
    system_program.to_account_info(),
    CreateAccount{
        from: creator.to_account_info(),
        to: mint.to_account_info()
    }
);
```

### Transfer Fee Setup
```rust
transfer_fee_initialize(
    transfer_fee_init_ctx, 
    None,                    // Transfer fee authority
    Some(&creator.key()),    // Config authority
    fee_bps,                 // Fee in basis points
    max_fee                  // Maximum fee amount
)?;
```

## 🎓 Learning Journey

This project was built through a **step-by-step learning process**:

1. **Foundation** - Understanding Anchor basics and program structure
2. **Account Validation** - Learning how Anchor validates accounts
3. **CPI Implementation** - Understanding cross-program calls
4. **Token 2022 Features** - Exploring advanced token capabilities
5. **Testing** - Comprehensive testing of all functionality
6. **Documentation** - Creating guides for future reference

## 📚 Resources

- [Anchor Documentation](https://www.anchor-lang.com/docs)
- [Solana Cookbook](https://solanacookbook.com/)
- [Token 2022 Program](https://spl.solana.com/token-2022)
- [Ackee School of Solana](https://ackeeblockchain.com/school-of-solana)

## 🤝 Contributing

This is a learning project. Feel free to:
- Ask questions
- Suggest improvements
- Share your own implementations
- Report issues

## 📄 License

MIT License - feel free to use this code for learning and development.

---

**Built with ❤️ during the Ackee School of Solana Season 7 Cohort**
