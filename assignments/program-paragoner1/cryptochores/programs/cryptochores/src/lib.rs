use anchor_lang::prelude::*;

declare_id!("6bv7YDEGEoXFz94EESehuGNJHJAuoL4QZFzKAAczwNyQ");

#[program]
pub mod cryptochores {
    use super::*;

    pub fn initialize_child_wallet(
        ctx: Context<InitializeChildWallet>,
    ) -> Result<()> {
        let child_wallet = &mut ctx.accounts.child_wallet;
        
        child_wallet.child = ctx.accounts.child.key();
        child_wallet.guardian = ctx.accounts.guardian.key();
        child_wallet.total_earned = 0;
        child_wallet.current_balance = 0;
        child_wallet.chores_completed = 0;
        
        Ok(())
    }

    pub fn create_chore(
        ctx: Context<CreateChore>,
        title: String,
        description: String,
        max_payment: u64,
    ) -> Result<()> {
        let chore = &mut ctx.accounts.chore;
        
        chore.assigner = ctx.accounts.assigner.key();
        chore.assignee = ctx.accounts.assignee.key();
        chore.title = title;
        chore.description = description;
        chore.max_payment = max_payment;
        chore.status = ChoreStatus::Pending;
        chore.created_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }

    pub fn submit_chore_completion(
        ctx: Context<SubmitChoreCompletion>,
    ) -> Result<()> {
        let chore = &mut ctx.accounts.chore;
        
        require!(chore.status == ChoreStatus::Pending, ErrorCode::ChoreAlreadyCompleted);
        require!(chore.assignee == ctx.accounts.assignee.key(), ErrorCode::UnauthorizedAssignee);
        
        chore.status = ChoreStatus::Completed;
        chore.completed_at = Some(Clock::get()?.unix_timestamp);
        
        Ok(())
    }

    pub fn rate_and_pay_chore(
        ctx: Context<RateAndPayChore>,
        rating: u8,
    ) -> Result<()> {
        let chore = &mut ctx.accounts.chore;
        let child_wallet = &mut ctx.accounts.child_wallet;
        
        require!(chore.status == ChoreStatus::Completed, ErrorCode::ChoreNotCompleted);
        require!(chore.assigner == ctx.accounts.guardian.key(), ErrorCode::UnauthorizedGuardian);
        require!(rating >= 1 && rating <= 10, ErrorCode::InvalidRating);
        
        // Calculate payment based on rating
        let payment = (chore.max_payment * rating as u64) / 10;
        
        // Transfer SOL from guardian to child's actual wallet
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.guardian.key(),
            &ctx.accounts.child_actual_wallet.key(),
            payment,
        );
        
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.guardian.to_account_info(),
                ctx.accounts.child_actual_wallet.to_account_info(),
            ],
        )?;
        
        chore.rating = Some(rating);
        chore.actual_payment = Some(payment);
        chore.status = ChoreStatus::Paid;
        
        // Update child wallet PDA (for tracking purposes)
        child_wallet.total_earned += payment;
        child_wallet.current_balance += payment;
        child_wallet.chores_completed += 1;
        
        Ok(())
    }

    pub fn withdraw_earnings(
        ctx: Context<WithdrawEarnings>,
        amount: u64,
    ) -> Result<()> {
        let child_wallet = &mut ctx.accounts.child_wallet;
        
        require!(child_wallet.current_balance >= amount, ErrorCode::InsufficientBalance);
        require!(child_wallet.child == ctx.accounts.child.key(), ErrorCode::UnauthorizedChild);
        
        // Transfer SOL from child's actual wallet to themselves (for spending)
        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.child_actual_wallet.key(),
            &ctx.accounts.child.key(),
            amount,
        );
        
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.child_actual_wallet.to_account_info(),
                ctx.accounts.child.to_account_info(),
            ],
        )?;
        
        child_wallet.current_balance -= amount;
        
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct InitializeChildWallet<'info> {
    #[account(
        init,
        payer = guardian,
        space = 8 + 32 + 32 + 8 + 8 + 8, // 8 (discriminator) + 32 (child) + 32 (guardian) + 8 (total_earned) + 8 (current_balance) + 8 (chores_completed)
        seeds = [b"child_wallet", child.key().as_ref()],
        bump
    )]
    pub child_wallet: Account<'info, ChildWallet>,
    
    /// CHECK: This is safe because it's just used as a seed
    pub child: AccountInfo<'info>,
    #[account(mut)]
    pub guardian: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, description: String, max_payment: u64)]
pub struct CreateChore<'info> {
    #[account(
        init,
        payer = assigner,
        space = 8 + 32 + 32 + 4 + 100 + 4 + 200 + 8 + 1 + 8 + 8 + 8 + 8, // 8 (discriminator) + 32 (assigner) + 32 (assignee) + 4 (title len) + 100 (title) + 4 (description len) + 200 (description) + 8 (max_payment) + 1 (status) + 8 (rating) + 8 (actual_payment) + 8 (created_at) + 8 (completed_at)
        seeds = [
            b"chore", 
            assigner.key().as_ref(),
            chore_counter.key().as_ref()
        ],
        bump
    )]
    pub chore: Account<'info, Chore>,
    
    #[account(mut)]
    pub child_wallet: Account<'info, ChildWallet>,
    
    #[account(mut)]
    pub assigner: Signer<'info>,
    /// CHECK: This is safe because it's just used to store the assignee's public key
    pub assignee: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    
    /// CHECK: This is safe because it's just used as a seed
    pub chore_counter: Signer<'info>,
}

#[derive(Accounts)]
#[instruction()]
pub struct SubmitChoreCompletion<'info> {
    #[account(mut)]
    pub chore: Account<'info, Chore>,
    
    pub assignee: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(rating: u8)]
pub struct RateAndPayChore<'info> {
    #[account(mut)]
    pub chore: Account<'info, Chore>,
    
    #[account(mut)]
    pub child_wallet: Account<'info, ChildWallet>,
    
    #[account(mut)]
    pub guardian: Signer<'info>,
    
    /// CHECK: This is the child's actual wallet that will receive SOL
    #[account(mut)]
    pub child_actual_wallet: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct WithdrawEarnings<'info> {
    #[account(mut)]
    pub child_wallet: Account<'info, ChildWallet>,
    
    pub child: Signer<'info>,
    
    /// CHECK: This is the child's actual wallet that holds the SOL
    #[account(mut)]
    pub child_actual_wallet: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ChildWallet {
    pub child: Pubkey,
    pub guardian: Pubkey,
    pub total_earned: u64,
    pub current_balance: u64,
    pub chores_completed: u64,
}

#[account]
pub struct Chore {
    pub assigner: Pubkey,
    pub assignee: Pubkey,
    pub title: String,
    pub description: String,
    pub max_payment: u64,
    pub status: ChoreStatus,
    pub rating: Option<u8>,
    pub actual_payment: Option<u64>,
    pub created_at: i64,
    pub completed_at: Option<i64>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ChoreStatus {
    Pending,
    Completed,
    Paid,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Chore is already completed")]
    ChoreAlreadyCompleted,
    #[msg("Chore is not completed yet")]
    ChoreNotCompleted,
    #[msg("Unauthorized assignee")]
    UnauthorizedAssignee,
    #[msg("Unauthorized guardian")]
    UnauthorizedGuardian,
    #[msg("Unauthorized child")]
    UnauthorizedChild,
    #[msg("Invalid rating - must be between 1 and 10")]
    InvalidRating,
    #[msg("Insufficient balance")]
    InsufficientBalance,
}
