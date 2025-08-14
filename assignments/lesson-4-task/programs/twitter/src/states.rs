use anchor_lang::prelude::*;

pub const TOPIC_LENGTH: usize = 32;
pub const CONTENT_LENGTH: usize = 500;
pub const COMMENT_LENGTH: usize = 500;

pub const TWEET_SEED: &str = "TWEET_SEED";
pub const TWEET_REACTION_SEED: &str = "TWEET_REACTION_SEED";
pub const COMMENT_SEED: &str = "COMMENT_SEED";

#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub enum ReactionType {
    Like,
    Dislike,
}

impl ReactionType {
    pub const SPACE: usize = 1; // 1 byte for enum discriminant
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
pub struct Reaction {
    pub reactionAuthor: Pubkey,
    pub parent_tweet: Pubkey,
    pub reaction: ReactionType,
    pub bump: u8,
}

impl Reaction {
    pub const SPACE: usize = 8 + // discriminator
        32 + // reactionAuthor: Pubkey
        32 + // parent_tweet: Pubkey
        ReactionType::SPACE + // reaction: ReactionType
        1; // bump: u8
}

#[account]
pub struct Comment {
    pub commentAuthor: Pubkey,
    pub parent_tweet: Pubkey,
    pub content: String,
    pub bump: u8,
}

impl Comment {
    pub const INIT_SPACE: usize = 8 + // discriminator
        32 + // commentAuthor: Pubkey
        32 + // parent_tweet: Pubkey
        4 + COMMENT_LENGTH + // content: String (4 bytes for length + max content length)
        1; // bump: u8
}