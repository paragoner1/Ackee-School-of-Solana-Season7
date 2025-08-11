use anchor_lang::prelude::*;

pub const TOPIC_LENGTH: usize = 32;
pub const CONTENT_LENGTH: usize = 500;
pub const COMMENT_LENGTH: usize = 500;

pub const TWEET_SEED: &str = "TWEET_SEED";
pub const TWEET_REACTION_SEED: &str = "TWEET_REACTION_SEED";
pub const COMMENT_SEED: &str = "COMMENT_SEED";

#[derive(AnchorDeserialize, AnchorSerialize, Clone, InitSpace)]
pub enum ReactionType {
    Like,
    Dislike,
}

#[account]
#[derive(InitSpace)]
pub struct Tweet {
    pub tweet_author: Pubkey,
    #[max_len(TOPIC_LENGTH)]
    pub topic: String,
    #[max_len(CONTENT_LENGTH)]
    pub content: String,
    pub likes: u64,
    pub dislikes: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Reaction {
    pub reaction_author: Pubkey,
    pub parent_tweet: Pubkey,
    pub reaction: ReactionType,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Comment {
    pub comment_author: Pubkey,
    pub parent_tweet: Pubkey,
    #[max_len(COMMENT_LENGTH)]
    pub content: String,
    pub bump: u8,
}
