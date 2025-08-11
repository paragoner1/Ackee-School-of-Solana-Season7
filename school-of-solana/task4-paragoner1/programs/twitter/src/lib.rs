#![allow(unexpected_cfgs)]

//===============================================================================
///
/// TWITTER PROGRAM TASK
/// 
/// This is a decentralized Twitter-like program built on Solana that allows users to:
/// - Create tweets with topics and content
/// - Add reactions (likes/dislikes) to tweets
/// - Comment on tweets
/// - Remove their own reactions and comments
/// 
/// INSTRUCTIONS:
/// Complete the implementation of all instructions by filling in the TODOs.
/// Each instruction file contains specific requirements and constraints to implement.
/// 
/// GENERAL HINTS:
/// - Use constants from states.rs (TOPIC_LENGTH, CONTENT_LENGTH, etc.)
/// - Use available errors from errors.rs for validation
/// - Follow the PDA seed patterns shown below for account derivation
/// - Validate input lengths before processing
/// - Set all required account fields including bump values
/// - Imports
/// 
/// SEEDS:
/// - Tweet: [topic.as_bytes(), TWEET_SEED.as_bytes(), tweet_authority.key().as_ref()]
/// - TweetReaction: [TWEET_REACTION_SEED.as_bytes(), reaction_author.key().as_ref(), tweet.key().as_ref()]
/// - Comment: [COMMENT_SEED.as_bytes(), comment_author.key().as_ref(), {hash(comment.content.as_bytes()).to_bytes().as_ref()}, comment.parent_tweet.key().as_ref()]
/// 
/// GOOD LUCK!
/// 
///===============================================================================

use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("F6NKeaoPbchYnbcJZ5YSAqfMcHuP7GLExTuDK3qmgtgW");

#[program]
pub mod twitter {

    use super::*;

    pub fn initialize(ctx: Context<InitializeTweet>, topic: String, content: String) -> Result<()> {
        initialize_tweet(ctx, topic, content)
    }
    pub fn like_tweet(ctx: Context<AddReactionContext>) -> Result<()> {
        add_reaction(ctx, states::ReactionType::Like)
    }
    pub fn dislike_tweet(ctx: Context<AddReactionContext>) -> Result<()> {
        add_reaction(ctx, states::ReactionType::Dislike)
    }
    pub fn reaction_remove(ctx: Context<RemoveReactionContext>) -> Result<()> {
        remove_reaction(ctx)
    }
    pub fn comment_tweet(ctx: Context<AddCommentContext>, comment_content: String) -> Result<()> {
        add_comment(ctx, comment_content)
    }
    pub fn comment_remove(ctx: Context<RemoveCommentContext>) -> Result<()> {
        remove_comment(ctx)
    }
}
