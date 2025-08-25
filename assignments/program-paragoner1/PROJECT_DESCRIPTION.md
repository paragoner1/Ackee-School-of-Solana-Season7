# Project Description

**Deployed Frontend URL:** https://cryptochores-frontend-bn5ng4sfp-paragoners-projects.vercel.app

**Note:** The dApp is fully functional with a real Solana program deployed on Devnet. All transactions are live blockchain interactions. For demo purposes, the same wallet can be used for both parent and child roles.

**Solana Program ID:** 6bv7YDEGEoXFz94EESehuGNJHJAuoL4QZFzKAAczwNyQ

## Project Overview

### Description
CryptoChores is a Solana dApp that enables parents to pay their children in SOL for completing household chores. It demonstrates core Solana concepts using Anchor: PDAs (Program Derived Addresses), on-chain account state, input validation, and simple value transfers. Parents create chores with a maximum payout, children submit completion, and parents rate the quality (1–10), which proportionally determines the payment. Children can track their earnings and withdraw their earned crypto to their personal wallets. Future plans include streak tracking for bonus payments, achievement rewards, and deployment to the Solana Mobile dApp store for broader family adoption.

### Key Features
- **Initialize Child Wallet**: Create a PDA-based account to track a child’s earnings and stats
- **Create Chore**: Parent creates a chore with title/description and max payment (in lamports)
- **Submit Completion**: Child marks the chore as completed
- **Rate and Pay**: Parent rates 1–10, and SOL is transferred from parent to child based on rating
- **Withdraw**: Child withdraws earned funds

### How to Use the dApp
1. **Connect Wallet** (Phantom/Solflare)
2. **Parent Mode**:
   - Initialize a child wallet (enter the child’s address)
   - Create chores (title, description, max SOL)
   - After completion, rate the chore (1–10) to pay
3. **Child Mode**:
   - Submit chore completion
   - Withdraw earned SOL

## Program Architecture
The program uses PDAs for deterministic, program-owned state and performs actual SOL transfers to user wallets. State is stored on PDAs for transparent tracking; SOL transfers occur between the guardian’s wallet and the child’s actual wallet.

### PDA Usage
- **Child Wallet PDA**: `seeds = [b"child_wallet", child.key().as_ref()]`
- **Chore PDA**: `seeds = [b"chore", assigner.key().as_ref(), chore_counter.key().as_ref()]`

These PDAs are used to ensure unique and verifiable accounts per child and per chore.

### Program Instructions
- `initialize_child_wallet` (guardian creates child’s PDA account)
- `create_chore` (guardian creates a chore for a child)
- `submit_chore_completion` (child marks chore completed)
- `rate_and_pay_chore` (guardian rates 1–10; payment = max_payment × rating ÷ 10 and SOL transfers to child)
- `withdraw_earnings` (child withdraws tracked balance)

### Account Structure
```rust
#[account]
pub struct ChildWallet {
    pub child: Pubkey,         // Child’s wallet address
    pub guardian: Pubkey,      // Parent/guardian wallet
    pub total_earned: u64,     // Lifetime earnings (lamports)
    pub current_balance: u64,  // Available balance (lamports)
    pub chores_completed: u64, // Number of paid chores
}

#[account]
pub struct Chore {
    pub assigner: Pubkey,                // Parent who created chore
    pub assignee: Pubkey,                // Child assigned to chore
    pub title: String,                   // Chore title
    pub description: String,             // Detailed description
    pub max_payment: u64,                // Max possible payment (lamports)
    pub status: ChoreStatus,             // Pending/Completed/Paid
    pub rating: Option<u8>,              // 1–10
    pub actual_payment: Option<u64>,     // Calculated payment (lamports)
    pub created_at: i64,                 // Timestamp
    pub completed_at: Option<i64>,       // Timestamp
}
```

## Testing

### Test Coverage
Tests cover both successful flows and error cases:

**Happy Path:**
- Initialize child wallet
- Create chore
- Submit chore completion
- Rate and pay (1–10) with proportional payout
- Withdraw earnings

**Unhappy Path:**
- Duplicate initialize child wallet
- Unauthorized completion/rating/withdraw attempts
- Invalid rating (0, >10)
- Insufficient balance on withdraw

### Running Tests
```bash
cd anchor_project/cryptochores
anchor test
```

### Additional Notes for Evaluators
- The payment logic performs a real SOL transfer from guardian to child’s wallet while updating PDA state for tracking.
- PDAs are used strictly for state; SOL is held by user wallets, not PDAs.
- The program and frontend are intentionally kept minimal to satisfy the assignment while remaining extensible for later features (multi-token support, evidence, staking, gamification).
- This was actually my alternate idea for the current Solana Mobile hackathon, and I still plan on fully implementing and developing it for the Solana Mobile dApp store.
- Future roadmap includes advanced streak tracking for bonus payments, achievement rewards with NFT badges, photo/video evidence for chore completion using IPFS, auto-staking system for yield earning with parent-controlled savings rates, family leaderboards and community competitions, comprehensive crypto education modules and financial literacy curriculum, multi-token support (USDC, custom tokens), age-based access controls, advanced analytics dashboards, family gift incentives (Mother's Day/Father's Day reimbursements), educational partnerships with schools and institutions, and deployment to the Solana Mobile dApp store for broader family adoption.