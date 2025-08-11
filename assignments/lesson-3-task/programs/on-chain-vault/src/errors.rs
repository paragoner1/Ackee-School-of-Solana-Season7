use anchor_lang::prelude::*;

#[error_code]
pub enum VaultError {
    #[msg("Vault is locked")]
    VaultLocked,
    #[msg("Overflow")]
    Overflow,
    #[msg("Insufficient balance")]
    InsufficientBalance,
}