use anchor_lang::prelude::*;

declare_id!("ukXxcrkqh2d8zW8RTBEBemaFLzGT3AcS8eXnbJR4AEW");

#[program]
pub mod program_b {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: program B");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    pub pda_account: Signer<'info>,
}
