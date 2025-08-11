//-------------------------------------------------------------------------------
///
/// TASK: Implement the add comment functionality for the Twitter program
/// 
/// Requirements:
/// - Validate that comment content doesn't exceed maximum length
/// - Initialize a new comment account with proper PDA seeds
/// - Set comment fields: content, author, parent tweet, and bump
/// - Use content hash in PDA seeds for unique comment identification
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;

use crate::errors::TwitterError;
use crate::states::*;

pub fn add_comment(ctx: Context<AddCommentContext>, comment_content: String) -> Result<()> {
    // Validate comment content length
    if comment_content.len() > COMMENT_LENGTH {
        return err!(TwitterError::CommentTooLong);
    }
    
    // Get the comment account from context
    let comment = &mut ctx.accounts.comment;
    
    // Set comment fields
    comment.comment_author = ctx.accounts.comment_author.key();
    comment.parent_tweet = ctx.accounts.tweet.key();
    comment.content = comment_content;
    comment.bump = ctx.bumps.comment;
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(comment_content: String)]
pub struct AddCommentContext<'info> {
    #[account(mut)]
    pub comment_author: Signer<'info>,
    
    #[account(
        init,
        payer = comment_author,
        space = Comment::INIT_SPACE,
        seeds = [
            COMMENT_SEED.as_bytes(),
            comment_author.key().as_ref(),
            tweet.key().as_ref()
        ],
        bump
    )]
    pub comment: Account<'info, Comment>,
    
    pub tweet: Account<'info, Tweet>,
    
    pub system_program: Program<'info, System>,
}
