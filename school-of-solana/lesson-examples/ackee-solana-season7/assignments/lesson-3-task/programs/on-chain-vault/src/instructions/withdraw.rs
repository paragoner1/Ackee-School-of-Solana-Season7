//-------------------------------------------------------------------------------
///
/// TASK: Implement the withdraw functionality for the on-chain vault
/// 
/// Requirements:
/// - Verify that the vault is not locked
/// - Verify that the vault has enough balance to withdraw
/// - Transfer lamports from vault to vault authority
/// - Emit a withdraw event after successful transfer
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use crate::state::Vault;
use crate::errors::VaultError;
use crate::events::WithdrawEvent;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub vault_authority: Signer<'info>,
    #[account(
        mut,
        constraint = !vault.locked @ VaultError::VaultLocked,
        constraint = vault.vault_authority == vault_authority.key(),
        seeds = [b"vault", vault_authority.key().as_ref()],
        bump
    )]
    pub vault: Account<'info, Vault>,
    pub system_program: Program<'info, System>,
}

pub fn _withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    // Verify that the vault has enough balance to withdraw
    let vault_balance = ctx.accounts.vault.to_account_info().lamports();
    require!(vault_balance >= amount, VaultError::InsufficientBalance);

    // Transfer lamports from vault to vault authority using manual lamport manipulation
    // For PDAs with data, we need to manually transfer lamports
    // This is the correct way to transfer SOL from a data-carrying account
    **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.vault_authority.try_borrow_mut_lamports()? += amount;

    // Emit a withdraw event after successful transfer
    emit!(WithdrawEvent {
        amount,
        vault_authority: ctx.accounts.vault_authority.key(),
        vault: ctx.accounts.vault.key(),
    });

    Ok(())
}