use crate::fuzz_transactions::FuzzAccounts;
use crate::types::*;
use borsh::{BorshDeserialize, BorshSerialize};
use trident_fuzz::fuzzing::*;
#[derive(Arbitrary, TridentInstruction)]
#[program_id("ApjAG3oR2KFBdF5ZargvmDaS5UV3wZJMw8UGFtb6ij4m")]
# [discriminator ([163u8 , 52u8 , 200u8 , 231u8 , 140u8 , 3u8 , 69u8 , 186u8 ,])]
pub struct TransferInstruction {
    pub accounts: TransferInstructionAccounts,
    pub data: TransferInstructionData,
}
/// Instruction Accounts
#[derive(Arbitrary, Debug, Clone, TridentAccounts)]
#[instruction_data(TransferInstructionData)]
#[storage(FuzzAccounts)]
pub struct TransferInstructionAccounts {
    #[account(mut, signer)]
    sender: TridentAccount,
    mint: TridentAccount,
    #[account(mut)]
    recipient: TridentAccount,
    #[account(mut)]
    recipient_ata: TridentAccount,
    #[account(mut)]
    sender_ata: TridentAccount,
    #[account(address = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")]
    token_program: TridentAccount,
    #[account(address = "11111111111111111111111111111111")]
    system_program: TridentAccount,
    #[account(address = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")]
    associated_token_program: TridentAccount,
}
/// Instruction Data
#[derive(Arbitrary, Debug, BorshDeserialize, BorshSerialize, Clone)]
pub struct TransferInstructionData {
    amount: u64,
}
/// Implementation of instruction setters for fuzzing
///
/// Provides methods to:
/// - Set instruction data during fuzzing
/// - Configure instruction accounts during fuzzing
/// - (Optional) Set remaining accounts during fuzzing
///
/// Docs: https://ackee.xyz/trident/docs/latest/start-fuzzing/writting-fuzz-test/
impl InstructionHooks for TransferInstruction {
    type IxAccounts = FuzzAccounts;
    fn set_data(&mut self, client: &mut impl FuzzClient, fuzz_accounts: &mut Self::IxAccounts) {
        todo!()
    }
    fn set_accounts(&mut self, client: &mut impl FuzzClient, fuzz_accounts: &mut Self::IxAccounts) {
        todo!()
    }
}
