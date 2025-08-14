use crate::fuzz_transactions::FuzzAccounts;
use crate::types::*;
use borsh::{BorshDeserialize, BorshSerialize};
use trident_fuzz::fuzzing::*;
#[derive(Arbitrary, TridentInstruction)]
#[program_id("ApjAG3oR2KFBdF5ZargvmDaS5UV3wZJMw8UGFtb6ij4m")]
# [discriminator ([51u8 , 57u8 , 225u8 , 47u8 , 182u8 , 146u8 , 137u8 , 166u8 ,])]
pub struct MintInstruction {
    pub accounts: MintInstructionAccounts,
    pub data: MintInstructionData,
}
/// Instruction Accounts
#[derive(Arbitrary, Debug, Clone, TridentAccounts)]
#[instruction_data(MintInstructionData)]
#[storage(FuzzAccounts)]
pub struct MintInstructionAccounts {
    #[account(mut, signer)]
    creator: TridentAccount,
    #[account(mut)]
    mint: TridentAccount,
    #[account(mut)]
    recipient: TridentAccount,
    #[account(mut)]
    recipient_ata: TridentAccount,
    #[account(address = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")]
    token_program: TridentAccount,
    #[account(address = "11111111111111111111111111111111")]
    system_program: TridentAccount,
    #[account(address = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")]
    associated_token_program: TridentAccount,
}
/// Instruction Data
#[derive(Arbitrary, Debug, BorshDeserialize, BorshSerialize, Clone)]
pub struct MintInstructionData {
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
impl InstructionHooks for MintInstruction {
    type IxAccounts = FuzzAccounts;
    fn set_data(&mut self, client: &mut impl FuzzClient, fuzz_accounts: &mut Self::IxAccounts) {
        todo!()
    }
    fn set_accounts(&mut self, client: &mut impl FuzzClient, fuzz_accounts: &mut Self::IxAccounts) {
        todo!()
    }
}
