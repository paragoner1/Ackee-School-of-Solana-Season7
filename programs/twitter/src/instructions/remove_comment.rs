//-------------------------------------------------------------------------------
///
/// TASK: Implement the remove comment functionality for the Twitter program
/// 
/// Requirements:
/// - Close the comment account and return rent to comment author
/// - Ensure only the comment author can remove their comment
/// 
/// NOTE: No implementation logic is needed in the function body - this 
/// functionality is achieved entirely through account constraints!
/// 
///-------------------------------------------------------------------------------

// remove_comment.rs
use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;

use crate::states::*;

pub fn remove_comment(_ctx: Context<RemoveCommentContext>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct RemoveCommentContext<'info> {
    #[account(mut)]
    pub commentAuthor: Signer<'info>,
    
    #[account(
        mut,
        close = commentAuthor,
        seeds = [
            COMMENT_SEED.as_bytes(),
            commentAuthor.key().as_ref(),
            hash(comment.content.as_bytes()).to_bytes().as_ref(),
            comment.parent_tweet.as_ref()
        ],
        bump = comment.bump,
        has_one = commentAuthor @ crate::errors::TwitterError::Unauthorized
    )]
    pub comment: Account<'info, Comment>,
}