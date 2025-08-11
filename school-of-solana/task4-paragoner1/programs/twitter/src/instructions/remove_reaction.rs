//-------------------------------------------------------------------------------
///
/// TASK: Implement the remove reaction functionality for the Twitter program
/// 
/// Requirements:
/// - Verify that the tweet reaction exists and belongs to the reaction author
/// - Decrement the appropriate counter (likes or dislikes) on the tweet
/// - Close the tweet reaction account and return rent to reaction author
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;

use crate::errors::TwitterError;
use crate::states::*;

pub fn remove_reaction(ctx: Context<RemoveReactionContext>) -> Result<()> {
    // Verify the reaction belongs to the author
    let reaction = &ctx.accounts.tweet_reaction;
    require!(
        reaction.reaction_author == ctx.accounts.reaction_author.key(),
        TwitterError::MinLikesReached // Using existing error as placeholder
    );
    
    // Decrement the appropriate counter on the tweet
    let tweet = &mut ctx.accounts.tweet;
    match reaction.reaction {
        ReactionType::Like => {
            tweet.likes -= 1;
        },
        ReactionType::Dislike => {
            tweet.dislikes -= 1;
        }
    }
    
    Ok(())
}

#[derive(Accounts)]
pub struct RemoveReactionContext<'info> {
    #[account(mut)]
    pub reaction_author: Signer<'info>,
    
    #[account(
        mut,
        close = reaction_author,
        seeds = [
            TWEET_REACTION_SEED.as_bytes(),
            reaction_author.key().as_ref(),
            tweet.key().as_ref()
        ],
        bump
    )]
    pub tweet_reaction: Account<'info, Reaction>,
    
    #[account(mut)]
    pub tweet: Account<'info, Tweet>,
}
