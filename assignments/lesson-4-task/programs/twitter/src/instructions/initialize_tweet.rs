//-------------------------------------------------------------------------------
///
/// TASK: Implement the initialize tweet functionality for the Twitter program
/// 
/// Requirements:
/// - Validate that topic and content don't exceed maximum lengths
/// - Initialize a new tweet account with proper PDA seeds
/// - Set tweet fields: topic, content, author, likes, dislikes, and bump
/// - Initialize counters (likes and dislikes) to zero
/// - Use topic in PDA seeds for tweet identification
/// 
///-------------------------------------------------------------------------------

use anchor_lang::prelude::*;

use crate::errors::TwitterError;
use crate::states::*;

pub fn initialize_tweet(
    ctx: Context<InitializeTweet>,
    topic: String,
    content: String,
) -> Result<()> {
    // Validate topic length
    if topic.len() > TOPIC_LENGTH {
        return err!(TwitterError::TopicTooLong);
    }
    
    // Validate content length
    if content.len() > CONTENT_LENGTH {
        return err!(TwitterError::ContentTooLong);
    }
    
    // Get the tweet account from context
    let tweet = &mut ctx.accounts.tweet;
    
    // Set all the tweet fields
    tweet.tweet_author = ctx.accounts.tweet_authority.key();
    tweet.topic = topic;
    tweet.content = content;
    tweet.likes = 0;
    tweet.dislikes = 0;
    tweet.bump = ctx.bumps.tweet;
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(topic: String)]
pub struct InitializeTweet<'info> {
    #[account(mut)]
    pub tweet_authority: Signer<'info>,
    
    #[account(
        init,
        payer = tweet_authority,
        space = Tweet::INIT_SPACE,
        seeds = [
            topic.as_bytes(),
            TWEET_SEED.as_bytes(),
            tweet_authority.key().as_ref()
        ],
        bump
    )]
    pub tweet: Box<Account<'info, Tweet>>,
    
    pub system_program: Program<'info, System>,
}