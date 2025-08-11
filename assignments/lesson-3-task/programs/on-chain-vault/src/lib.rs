#![allow(unexpected_cfgs)]

//===============================================================================
///
/// SOLANA ON-CHAIN VAULT TASK
/// 
/// Your task is to complete the implementation of a Solana on-chain vault program.
/// The vault allows users to deposit SOL, withdraw SOL (if they're the authority),
/// and toggle the vault's lock state.
/// 
/// INSTRUCTIONS:
/// - Only modify code where you find TODO comments
/// - Follow the requirements specified in each instruction file
/// - Use the initialize instruction as a reference implementation
/// 
/// GENERAL HINTS:
/// - Use appropriate errors from errors.rs
/// - Use appropriate events from events.rs  
/// - Study account constraints in the initialize instruction
/// - Imports
/// 
/// GOOD LUCK!
/// 
///===============================================================================

use anchor_lang::prelude::*;
mod instructions;
mod state;
mod errors;
mod events;

use instructions::*;

declare_id!("ARmiAGe6oAEq5BKguHydD3zt2n5PkV2Q5PLA1McuMkJT");

#[program]
pub mod on_chain_vault {
    use super::*;

    pub fn init_vault(ctx: Context<InitializeVault>, locked: bool) -> Result<()> {
      _init_vault(ctx, locked)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
      _deposit(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
      _withdraw(ctx, amount)
    }

    pub fn toggle_lock(ctx: Context<ToggleLock>) -> Result<()> {
      _toggle_lock(ctx)
    }
}
