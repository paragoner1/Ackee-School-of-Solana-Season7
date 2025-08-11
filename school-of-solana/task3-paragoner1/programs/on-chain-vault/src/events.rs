use anchor_lang::prelude::*;

#[event]
pub struct InitializeVaultEvent {
    pub vault: Pubkey,
    pub vault_authority: Pubkey,
    pub locked: bool,
}

#[event]
pub struct DepositEvent {
    pub amount: u64,
    pub user: Pubkey,
    pub vault: Pubkey,
}

#[event]
pub struct WithdrawEvent {
    pub amount: u64,
    pub vault_authority: Pubkey,
    pub vault: Pubkey,
}

#[event]
pub struct ToggleLockEvent {
    pub vault: Pubkey,
    pub vault_authority: Pubkey,
    pub locked: bool,
}