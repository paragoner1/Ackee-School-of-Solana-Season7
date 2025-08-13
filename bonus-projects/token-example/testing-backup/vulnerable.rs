// INTENTIONAL SECURITY VULNERABILITIES FOR TESTING
// This file contains deliberate security issues to test the VS Code extension scanner

use anchor_lang::prelude::*;
use anchor_spl::token_2022::Token2022;

// VULNERABILITY 1: Missing Signer Check
#[derive(Accounts)]
pub struct MissingSignerContext<'info> {
    // Missing #[account(mut)] - should be mutable
    pub balance: Account<'info, UserAccount>,
    /// CHECK: This is intentionally unsafe for testing the security scanner
    pub authority: UncheckedAccount<'info>,
    pub token_program: Program<'info, Token2022>,
}

// VULNERABILITY 2: Unsafe Math Operations
pub fn unsafe_math_operation(ctx: Context<MissingSignerContext>, amount: u64) -> Result<()> {
    // Unsafe math - no overflow protection
    let result = amount + 1000; // Could overflow
    let product = amount * 2; // Could overflow
    
    // Manual lamports zeroing - unsafe pattern
    let account = &mut ctx.accounts.user;
    account.lamports = 0; // UNSAFE: Manual lamports zeroing
    
    Ok(())
}

// VULNERABILITY 3: Missing InitSpace
#[derive(Accounts)]
pub struct MissingInitSpaceContext<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8 + 8)] // Missing init_space attribute
    pub new_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// VULNERABILITY 4: Missing Check Comment
pub fn missing_check_comment(ctx: Context<MissingSignerContext>) -> Result<()> {
    // Critical security check without comment
    if ctx.accounts.authority.key() != ctx.accounts.user.authority {
        return Err(ErrorCode::Unauthorized.into());
    }
    
    // Another critical check without comment
    if ctx.accounts.user.balance < 1000 {
        return Err(ErrorCode::InsufficientFunds.into());
    }
    
    Ok(())
}

// VULNERABILITY 5: Invalid Instruction Attribute
#[derive(Accounts)]
pub struct InvalidAttributeContext<'info> {
    // Commented out invalid attribute to allow compilation
    // #[account(invalid_attribute = "this_does_not_exist")] // Invalid attribute
    pub account: Account<'info, UserAccount>,
}

// VULNERABILITY 6: Unused Instruction Attribute
#[derive(Accounts)]
pub struct UnusedAttributeContext<'info> {
    // Commented out unused attribute to allow compilation
    // #[account(mut, unused_attribute = "this_is_unused")] // Unused attribute
    pub account: Account<'info, UserAccount>,
}

// VULNERABILITY 7: Immutable Account Mutated
#[derive(Accounts)]
pub struct ImmutableAccountContext<'info> {
    // Missing mut but will be modified
    pub immutable_account: Account<'info, UserAccount>,
}

pub fn mutate_immutable_account(ctx: Context<ImmutableAccountContext>) -> Result<()> {
    // Trying to modify an immutable account
    let account = &mut ctx.accounts.immutable_account;
    account.balance += 100; // This should trigger a warning
    
    Ok(())
}

// VULNERABILITY 8: Sysvar Account Access
#[derive(Accounts)]
pub struct SysvarContext<'info> {
    /// CHECK: This is intentionally unsafe for testing the security scanner
    pub clock: UncheckedAccount<'info>, // Should use Clock type
    /// CHECK: This is intentionally unsafe for testing the security scanner
    pub rent: UncheckedAccount<'info>,  // Should use Rent type
}

// Mock account structure for testing
#[account]
pub struct UserAccount {
    pub authority: Pubkey,
    pub balance: u64,
    pub lamports: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}
