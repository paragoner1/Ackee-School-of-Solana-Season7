//-------------------------------------------------------------------------------
///
/// TASK: Implement the add reaction functionality for the Twitter program
/// 
/// Requirements:
/// - Initialize a new reaction account with proper PDA seeds
/// - Increment the appropriate counter (likes or dislikes) on the tweet
/// - Set reaction fields: type, author, parent tweet, and bump
/// - Handle both Like and Dislike reaction types
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;

use crate::errors::TwitterError;
use crate::states::*;

pub fn add_reaction(ctx: Context<AddReactionContext>, reaction: ReactionType) -> Result<()> {
    // Get the reaction account from context
    let reaction_account = &mut ctx.accounts.tweet_reaction;
    
    // Set reaction account fields
    reaction_account.reactionAuthor = ctx.accounts.reaction_author.key();
    reaction_account.parent_tweet = ctx.accounts.tweet.key();
    reaction_account.reaction = reaction.clone();
    reaction_account.bump = ctx.bumps.tweet_reaction;
    
    // Update tweet counters
    let tweet = &mut ctx.accounts.tweet;
    match reaction {
        ReactionType::Like => {
            if tweet.likes == u64::MAX {
                return err!(TwitterError::MaxLikesReached);
            }
            tweet.likes += 1;
        },
        ReactionType::Dislike => {
            if tweet.dislikes == u64::MAX {
                return err!(TwitterError::MaxDislikesReached);
            }
            tweet.dislikes += 1;
        }
    }
    
    Ok(())
}

#[derive(Accounts)]
pub struct AddReactionContext<'info> {
    #[account(mut)]
    pub reaction_author: Signer<'info>,
    
    #[account(
        init,
        payer = reaction_author,
        space = Reaction::SPACE,
        seeds = [
            TWEET_REACTION_SEED.as_bytes(),
            reaction_author.key().as_ref(),
            tweet.key().as_ref()
        ],
        bump
    )]
    pub tweet_reaction: Account<'info, Reaction>,
    
    #[account(mut)]
    pub tweet: Box<Account<'info, Tweet>>,
    
    pub system_program: Program<'info, System>,
}