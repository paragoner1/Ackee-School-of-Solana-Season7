use crate::transactions::*;
use trident_fuzz::fuzzing::*;
/// FuzzTransactions contains all available transactions
///
/// You can create your own transactions by adding new variants to the enum.
///
/// Docs: https://ackee.xyz/trident/docs/latest/trident-api-macro/trident-types/fuzz-transactions/
#[derive(Arbitrary, TransactionSelector)]
pub enum FuzzTransactions {
    InitializeTransaction(InitializeTransaction),
    MintTransaction(MintTransaction),
    TransferTransaction(TransferTransaction),
    WithdrawTransaction(WithdrawTransaction),
}
/// FuzzAccounts contains all available accounts
///
/// You can create your own accounts by adding new fields to the struct.
///
/// Docs: https://ackee.xyz/trident/docs/latest/trident-api-macro/trident-types/fuzz-accounts/
#[derive(Default)]
pub struct FuzzAccounts {
    pub system_program: AccountsStorage,
    pub sender: AccountsStorage,
    pub creator: AccountsStorage,
    pub mint: AccountsStorage,
    pub associated_token_program: AccountsStorage,
    pub recipient_ata: AccountsStorage,
    pub token_program: AccountsStorage,
    pub from: AccountsStorage,
    pub sender_ata: AccountsStorage,
    pub from_ata: AccountsStorage,
    pub creator_ata: AccountsStorage,
    pub recipient: AccountsStorage,
}
