use crate::fuzz_transactions::FuzzAccounts;
use crate::types::*;
use borsh::{BorshDeserialize, BorshSerialize};
use trident_fuzz::fuzzing::*;
#[derive(Arbitrary, TridentInstruction)]
#[program_id("ApjAG3oR2KFBdF5ZargvmDaS5UV3wZJMw8UGFtb6ij4m")]
# [discriminator ([183u8 , 18u8 , 70u8 , 156u8 , 148u8 , 109u8 , 161u8 , 34u8 ,])]
pub struct WithdrawInstruction {
    pub accounts: WithdrawInstructionAccounts,
    pub data: WithdrawInstructionData,
}
/// Instruction Accounts
#[derive(Arbitrary, Debug, Clone, TridentAccounts)]
#[instruction_data(WithdrawInstructionData)]
#[storage(FuzzAccounts)]
pub struct WithdrawInstructionAccounts {
    #[account(mut, signer)]
    creator: TridentAccount,
    #[account(mut)]
    mint: TridentAccount,
    #[account(mut)]
    from: TridentAccount,
    #[account(mut)]
    from_ata: TridentAccount,
    #[account(mut)]
    creator_ata: TridentAccount,
    #[account(address = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")]
    token_program: TridentAccount,
    #[account(address = "11111111111111111111111111111111")]
    system_program: TridentAccount,
    #[account(address = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")]
    associated_token_program: TridentAccount,
}
/// Instruction Data
#[derive(Arbitrary, Debug, BorshDeserialize, BorshSerialize, Clone)]
pub struct WithdrawInstructionData {}
/// Implementation of instruction setters for fuzzing
///
/// Provides methods to:
/// - Set instruction data during fuzzing
/// - Configure instruction accounts during fuzzing
/// - (Optional) Set remaining accounts during fuzzing
///
/// Docs: https://ackee.xyz/trident/docs/latest/start-fuzzing/writting-fuzz-test/
impl InstructionHooks for WithdrawInstruction {
    type IxAccounts = FuzzAccounts;
    fn set_data(&mut self, client: &mut impl FuzzClient, fuzz_accounts: &mut Self::IxAccounts) {
        todo!()
    }
    fn set_accounts(&mut self, client: &mut impl FuzzClient, fuzz_accounts: &mut Self::IxAccounts) {
        todo!()
    }
}
