import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Twitter } from "../target/types/twitter";
import { PublicKey } from '@solana/web3.js';
import { assert } from "chai";
import crypto from "crypto";


const TWEET_SEED = "TWEET_SEED";
const TWEET_REACTION = "TWEET_REACTION_SEED";
const COMMENT_SEED = "COMMENT_SEED";

describe("twitter", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Twitter as Program<Twitter>;

  const bob = anchor.web3.Keypair.generate();
  const alice = anchor.web3.Keypair.generate();
  const charlie = anchor.web3.Keypair.generate();

  const topic_bob1 = "Hello There";
  const content_bob1 = "This is my first tweet on this app, I like it here!"

  const topic_bob2 = "This Topic is too long bla bla bla bla bla bla bla bla bla bla bla bla";
  const content_bob2 = "This topic is too long , but I wanna try it !!"

  const topic_bob3 = "We have content too long";
  const content = "ten bytes!"
  let content_500_bytes = content.repeat(50);
  const content_bob3 = content_500_bytes + "+1"

  const topic_bob4 = "I don`t like Alice";
  const content_bob4 = "I bet Alice will dislikes this!";

  const comment_tmp = "I don`t like you Bob!"
  const comment_alice1 = comment_tmp.repeat(24);

  const comment_alice2 = "I dont`t like you Bob. It is enough if I say it once"

  const topic_edge_case = "A".repeat(32);
  const content_edge_case = "B".repeat(500);
  const empty_topic = "";
  const empty_content = "";
  const single_char_topic = "X";
  const single_char_content = "Y";
  const unicode_topic = "🚀 Crypto";
  const unicode_content = "Testing with emojis 🎉✨🔥";

  describe("Initialize Tweet", async () => {
    it("Should successfully initialize a tweet with valid topic and content", async () => {
      await airdrop(provider.connection, bob.publicKey);
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);

      await program.methods.initialize(topic_bob1, content_bob1).accounts(
        {
          tweetAuthority: bob.publicKey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob1, content_bob1, 0, 0, tweet_bump
      )
    });

    it("Should successfully initialize tweet with exactly 32-byte topic (boundary test)", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_edge_case, bob.publicKey, program.programId);

      await program.methods.initialize(topic_edge_case, content_bob1).accounts(
        {
          tweetAuthority: bob.publicKey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_edge_case, content_bob1, 0, 0, tweet_bump
      )
    });

    it("Should successfully initialize tweet with exactly 500-byte content (boundary test)", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress("EdgeContent", bob.publicKey, program.programId);

      await program.methods.initialize("EdgeContent", content_edge_case).accounts(
        {
          tweetAuthority: bob.publicKey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      await checkTweet(
        program, tweet_pkey, bob.publicKey, "EdgeContent", content_edge_case, 0, 0, tweet_bump
      )
    });

    it("Should successfully initialize tweet with empty content", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress("EmptyContent", bob.publicKey, program.programId);

      await program.methods.initialize("EmptyContent", empty_content).accounts(
        {
          tweetAuthority: bob.publicKey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      await checkTweet(
        program, tweet_pkey, bob.publicKey, "EmptyContent", empty_content, 0, 0, tweet_bump
      )
    });

    it("Should successfully initialize tweet with single character topic and content", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(single_char_topic, bob.publicKey, program.programId);

      await program.methods.initialize(single_char_topic, single_char_content).accounts(
        {
          tweetAuthority: bob.publicKey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      await checkTweet(
        program, tweet_pkey, bob.publicKey, single_char_topic, single_char_content, 0, 0, tweet_bump
      )
    });

    it("Should successfully initialize tweet with unicode characters and emojis", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(unicode_topic, bob.publicKey, program.programId);

      await program.methods.initialize(unicode_topic, unicode_content).accounts(
        {
          tweetAuthority: bob.publicKey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      await checkTweet(
        program, tweet_pkey, bob.publicKey, unicode_topic, unicode_content, 0, 0, tweet_bump
      )
    });

    it("Should fail to initialize tweet when topic exceeds 32 bytes", async () => {

      let should_fail = "This Should Fail"
      try {
        const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob2, bob.publicKey, program.programId);

        await program.methods.initialize(topic_bob2, content_bob2).accounts(
          {
            tweetAuthority: bob.publicKey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([bob]).rpc({ commitment: "confirmed" })
      } catch (error) {
        assert.strictEqual(error.message, "Max seed length exceeded", "Expected 'Max seed length exceeded' error for topic longer than 32 bytes");
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed", "Tweet initialization should have failed with topic longer than 32 bytes")
    });

    it("Should fail to initialize tweet when content exceeds 500 bytes", async () => {
      let should_fail = "This Should Fail"
      try {
        const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob3, bob.publicKey, program.programId);

        await program.methods.initialize(topic_bob3, content_bob3).accounts(
          {
            tweetAuthority: bob.publicKey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([bob]).rpc({ commitment: "confirmed" })
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "ContentTooLong", "Expected 'ContentTooLong' error for content longer than 500 bytes");
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed", "Tweet initialization should have failed with content longer than 500 bytes")
    });

    it("Should fail to initialize duplicate tweet with same topic and author", async () => {
      let should_fail = "This Should Fail"
      try {
        const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);

        await program.methods.initialize(topic_bob1, "Different content").accounts(
          {
            tweetAuthority: bob.publicKey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([bob]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(SolanaError.contains(error.logs, "already in use"), "Expected 'already in use' error for duplicate tweet with same topic and author")
      }
      assert.strictEqual(should_fail, "Failed", "Tweet initialization should have failed when trying to create duplicate tweet with same topic and author")
    });

    it("Should successfully initialize second tweet with different topic for same author", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);

      await program.methods.initialize(topic_bob4, content_bob4).accounts(
        {
          tweetAuthority: bob.publicKey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob4, content_bob4, 0, 0, tweet_bump
      )
    });

    it("Should allow different users to create tweets with same topic", async () => {
      await airdrop(provider.connection, charlie.publicKey);
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, charlie.publicKey, program.programId);

      await program.methods.initialize(topic_bob1, "Charlie's version").accounts(
        {
          tweetAuthority: charlie.publicKey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([charlie]).rpc({ commitment: "confirmed" })

      await checkTweet(
        program, tweet_pkey, charlie.publicKey, topic_bob1, "Charlie's version", 0, 0, tweet_bump
      )
    });
  });

  describe("Add Reaction", async () => {
    it("Should successfully add like reaction to tweet", async () => {
      await airdrop(provider.connection, alice.publicKey);

      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      await program.methods.likeTweet().accounts(
        {
          reactionAuthor: alice.publicKey,
          tweetReaction: reaction_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob1, content_bob1, 1, 0, tweet_bump
      )
      await checkReaction(
        program, reaction_pkey, alice.publicKey, tweet_pkey, reaction_bump
      )
    });

    it("Should correctly set reaction type to 'like' enum variant", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      let reactionData = await program.account.reaction.fetch(reaction_pkey);
      assert.deepEqual(reactionData.reaction, { like: {} }, "Reaction type should be set to 'like' enum variant");
    });

    it("Should fail when attempting to like the same tweet twice", async () => {

      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.likeTweet().accounts(
          {
            reactionAuthor: alice.publicKey,
            tweetReaction: reaction_pkey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(SolanaError.contains(error.logs, "already in use"), "Expected 'already in use' error when trying to like the same tweet twice")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to like the same tweet twice");
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob1, content_bob1, 1, 0, tweet_bump
      )
    });

    it("Should fail when attempting to dislike a tweet that is already liked", async () => {

      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.dislikeTweet().accounts(
          {
            reactionAuthor: alice.publicKey,
            tweetReaction: reaction_pkey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(SolanaError.contains(error.logs, "already in use"), "Expected 'already in use' error when trying to dislike a tweet that is already liked")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to dislike a tweet that is already liked (reaction account already exists)");

      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob1, content_bob1, 1, 0, tweet_bump
      )
    });

    it("Should successfully add dislike reaction to different tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      await program.methods.dislikeTweet().accounts(
        {
          reactionAuthor: alice.publicKey,
          tweetReaction: reaction_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob4, content_bob4, 0, 1, tweet_bump
      )
      await checkReaction(
        program, reaction_pkey, alice.publicKey, tweet_pkey, reaction_bump
      )

    });

    it("Should correctly set reaction type to 'dislike' enum variant", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      let reactionData = await program.account.reaction.fetch(reaction_pkey);
      assert.deepEqual(reactionData.reaction, { dislike: {} }, "Reaction type should be set to 'dislike' enum variant");
    });

    it("Should fail when attempting to dislike the same tweet twice", async () => {

      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.dislikeTweet().accounts(
          {
            reactionAuthor: alice.publicKey,
            tweetReaction: reaction_pkey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(SolanaError.contains(error.logs, "already in use"), "Expected 'already in use' error when trying to dislike the same tweet twice")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to dislike the same tweet twice");

      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob4, content_bob4, 0, 1, tweet_bump
      )

      try {
        await program.methods.likeTweet().accounts(
          {
            reactionAuthor: alice.publicKey,
            tweetReaction: reaction_pkey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(SolanaError.contains(error.logs, "already in use"), "Expected 'already in use' error when trying to like a tweet that is already disliked")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to like a tweet that is already disliked (reaction account already exists)");
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob4, content_bob4, 0, 1, tweet_bump
      )
    });

    it("Should allow multiple users to react to the same tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(charlie.publicKey, tweet_pkey, program.programId);

      await program.methods.likeTweet().accounts(
        {
          reactionAuthor: charlie.publicKey,
          tweetReaction: reaction_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([charlie]).rpc({ commitment: "confirmed" })

      // Tweet should now have 2 likes (Alice + Charlie)
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob1, content_bob1, 2, 0, tweet_bump
      )
      await checkReaction(
        program, reaction_pkey, charlie.publicKey, tweet_pkey, reaction_bump
      )
    });

    it("Should fail when attempting to react to non-existent tweet", async () => {
      const [fake_tweet_pkey, fake_tweet_bump] = getTweetAddress("NonExistent", bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, fake_tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.likeTweet().accounts(
          {
            reactionAuthor: alice.publicKey,
            tweetReaction: reaction_pkey,
            tweet: fake_tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(error.message.includes("Account does not exist") || error.message.includes("AccountNotInitialized"), "Expected account not found error when trying to react to non-existent tweet")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to react to a non-existent tweet");
    });
  });

  describe("Remove Reaction", async () => {
    it("Should successfully remove existing reaction from tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      await program.methods.reactionRemove().accounts(
        {
          reactionAuthor: alice.publicKey,
          tweetReaction: reaction_pkey,
          tweet: tweet_pkey,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob4, content_bob4, 0, 0, tweet_bump
      )

    });

    it("Should properly delete reaction account after removal", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail"
      try {
        let reactionData = await program.account.reaction.fetch(reaction_pkey);
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(error.message.includes("Account does not exist or has no data"), "Reaction account should be deleted after removal")
      }
      assert.strictEqual(should_fail, "Failed", "Reaction account should not exist after being removed")
    });

    it("Should allow adding new reaction after previous reaction was removed", async () => {

      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(alice.publicKey, tweet_pkey, program.programId);

      await program.methods.likeTweet().accounts(
        {
          reactionAuthor: alice.publicKey,
          tweetReaction: reaction_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob4, content_bob4, 1, 0, tweet_bump
      )
      await checkReaction(
        program, reaction_pkey, alice.publicKey, tweet_pkey, reaction_bump
      )

    });

    it("Should fail when attempting to remove non-existent reaction", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, charlie.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(bob.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.reactionRemove().accounts(
          {
            reactionAuthor: bob.publicKey,
            tweetReaction: reaction_pkey,
            tweet: tweet_pkey,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(error.message.includes("Account does not exist") || error.message.includes("AccountNotInitialized"), "Expected account not found error when trying to remove non-existent reaction")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to remove a non-existent reaction");
    });

    it("Should fail when attempting to remove another user's reaction", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(charlie.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.reactionRemove().accounts(
          {
            reactionAuthor: alice.publicKey, // Alice trying to remove Charlie's reaction
            tweetReaction: reaction_pkey,
            tweet: tweet_pkey,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        // This should fail due to account constraint mismatch
        assert.isTrue(error.message.includes("constraint") || error.message.includes("seeds"), "Expected constraint or seeds error when trying to remove someone else's reaction")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to remove someone else's reaction (authorization check)");
    });
  });

  describe("Add Comment", async () => {
    it("Should fail when attempting to add comment exceeding length limit", async () => {

      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [comment_pkey, comment_bump] = getCommentAddress(comment_alice1, alice.publicKey, tweet_pkey, program.programId);

      let should_fail = "This Should Fail"
      try {
        await program.methods.commentTweet(comment_alice1).accounts(
          {
            commentAuthor: alice.publicKey,
            comment: comment_pkey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "CommentTooLong", "Expected 'CommentTooLong' error for comment longer than 500 bytes");
        should_fail = "Failed"
      }
      assert.strictEqual(should_fail, "Failed", "Comment creation should have failed with comment longer than 500 bytes")

    });

    it("Should successfully add comment with valid length to tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [comment_pkey, comment_bump] = getCommentAddress(comment_alice2, alice.publicKey, tweet_pkey, program.programId);

      await program.methods.commentTweet(comment_alice2).accounts(
        {
          commentAuthor: alice.publicKey,
          comment: comment_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })
      await checkComment(
        program, comment_pkey, alice.publicKey, tweet_pkey, comment_alice2, comment_bump
      )
    });

    it("Should successfully add comment with exactly 500 characters (boundary test)", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const max_comment = "C".repeat(500);
      const [comment_pkey, comment_bump] = getCommentAddress(max_comment, alice.publicKey, tweet_pkey, program.programId);

      await program.methods.commentTweet(max_comment).accounts(
        {
          commentAuthor: alice.publicKey,
          comment: comment_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })

      await checkComment(
        program, comment_pkey, alice.publicKey, tweet_pkey, max_comment, comment_bump
      )
    });

    it("Should successfully add empty comment to tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const empty_comment = "";
      const [comment_pkey, comment_bump] = getCommentAddress(empty_comment, alice.publicKey, tweet_pkey, program.programId);

      await program.methods.commentTweet(empty_comment).accounts(
        {
          commentAuthor: alice.publicKey,
          comment: comment_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })

      await checkComment(
        program, comment_pkey, alice.publicKey, tweet_pkey, empty_comment, comment_bump
      )
    });

    it("Should successfully add comment with unicode characters and emojis", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const unicode_comment = "Great tweet! 🎉✨ Love it! 💯";
      const [comment_pkey, comment_bump] = getCommentAddress(unicode_comment, alice.publicKey, tweet_pkey, program.programId);

      await program.methods.commentTweet(unicode_comment).accounts(
        {
          commentAuthor: alice.publicKey,
          comment: comment_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })

      await checkComment(
        program, comment_pkey, alice.publicKey, tweet_pkey, unicode_comment, comment_bump
      )
    });

    it("Should allow multiple users to comment on the same tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const charlie_comment = "Charlie's comment here";
      const [comment_pkey, comment_bump] = getCommentAddress(charlie_comment, charlie.publicKey, tweet_pkey, program.programId);

      await program.methods.commentTweet(charlie_comment).accounts(
        {
          commentAuthor: charlie.publicKey,
          comment: comment_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([charlie]).rpc({ commitment: "confirmed" })

      await checkComment(
        program, comment_pkey, charlie.publicKey, tweet_pkey, charlie_comment, comment_bump
      )
    });

    it("Should fail when attempting to comment on non-existent tweet", async () => {
      const [fake_tweet_pkey, fake_tweet_bump] = getTweetAddress("FakeTweet", bob.publicKey, program.programId);
      const test_comment = "This should fail";
      const [comment_pkey, comment_bump] = getCommentAddress(test_comment, alice.publicKey, fake_tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.commentTweet(test_comment).accounts(
          {
            commentAuthor: alice.publicKey,
            comment: comment_pkey,
            tweet: fake_tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(error.message.includes("Account does not exist") || error.message.includes("AccountNotInitialized"), "Expected account not found error when trying to comment on non-existent tweet")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to comment on a non-existent tweet");
    });

    it("Should fail when attempting to create duplicate comment with same content", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [comment_pkey, comment_bump] = getCommentAddress(comment_alice2, alice.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.commentTweet(comment_alice2).accounts(
          {
            commentAuthor: alice.publicKey,
            comment: comment_pkey,
            tweet: tweet_pkey,
            systemProgram: anchor.web3.SystemProgram.programId
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(SolanaError.contains(error.logs, "already in use"), "Expected 'already in use' error when trying to create duplicate comment")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to create duplicate comment with same content from same user");
    });
  });

  describe("Remove Comment", async () => {
    it("Should successfully remove existing comment from tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [comment_pkey, comment_bump] = getCommentAddress(comment_alice2, alice.publicKey, tweet_pkey, program.programId);

      await program.methods.commentRemove().accounts(
        {
          commentAuthor: alice.publicKey,
          comment: comment_pkey,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })

      let thisShouldFail = "This should fail"
      try {
        let commentData = await program.account.comment.fetch(comment_pkey);
      } catch (error) {
        thisShouldFail = "Failed"
        assert.isTrue(error.message.includes("Account does not exist or has no data"), "Comment account should be deleted after removal")
      }
      assert.strictEqual(thisShouldFail, "Failed", "Comment account should not exist after being removed")

    });

    it("Should fail when attempting to remove non-existent comment", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const fake_comment = "This comment doesn't exist";
      const [comment_pkey, comment_bump] = getCommentAddress(fake_comment, alice.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.commentRemove().accounts(
          {
            commentAuthor: alice.publicKey,
            comment: comment_pkey,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(error.message.includes("Account does not exist") || error.message.includes("AccountNotInitialized"), "Expected account not found error when trying to remove non-existent comment")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to remove a non-existent comment");
    });

    it("Should fail when attempting to remove another user's comment", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const unicode_comment = "Great tweet! 🎉✨ Love it! 💯";
      const [comment_pkey, comment_bump] = getCommentAddress(unicode_comment, alice.publicKey, tweet_pkey, program.programId);

      let should_fail = "This should fail";
      try {
        await program.methods.commentRemove().accounts(
          {
            commentAuthor: charlie.publicKey, // Charlie trying to remove Alice's comment
            comment: comment_pkey,
          }
        ).signers([charlie]).rpc({ commitment: "confirmed" })
      } catch (error) {
        should_fail = "Failed"
        assert.isTrue(error.message.includes("constraint") || error.message.includes("seeds"), "Expected constraint or seeds error when trying to remove someone else's comment")
      }
      assert.strictEqual(should_fail, "Failed", "Should not be able to remove someone else's comment (authorization check)");
    });

    it("Should allow recreating comment with same content after deletion", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      const [comment_pkey, comment_bump] = getCommentAddress(comment_alice2, alice.publicKey, tweet_pkey, program.programId);

      // Recreate the same comment that was deleted
      await program.methods.commentTweet(comment_alice2).accounts(
        {
          commentAuthor: alice.publicKey,
          comment: comment_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([alice]).rpc({ commitment: "confirmed" })

      await checkComment(
        program, comment_pkey, alice.publicKey, tweet_pkey, comment_alice2, comment_bump
      )
    });
  });

  describe("Edge Cases and Error Handling", async () => {
    it("Should allow tweet author to react to their own tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const [reaction_pkey, reaction_bump] = getReactionAddress(bob.publicKey, tweet_pkey, program.programId);

      await program.methods.dislikeTweet().accounts(
        {
          reactionAuthor: bob.publicKey,
          tweetReaction: reaction_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      // Tweet should now have 2 likes and 1 dislike (Alice+Charlie likes, Bob dislike)
      await checkTweet(
        program, tweet_pkey, bob.publicKey, topic_bob1, content_bob1, 2, 1, tweet_bump
      )
    });

    it("Should allow tweet author to comment on their own tweet", async () => {
      const [tweet_pkey, tweet_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      const bob_comment = "Thanks for the likes everyone!";
      const [comment_pkey, comment_bump] = getCommentAddress(bob_comment, bob.publicKey, tweet_pkey, program.programId);

      await program.methods.commentTweet(bob_comment).accounts(
        {
          commentAuthor: bob.publicKey,
          comment: comment_pkey,
          tweet: tweet_pkey,
          systemProgram: anchor.web3.SystemProgram.programId
        }
      ).signers([bob]).rpc({ commitment: "confirmed" })

      await checkComment(
        program, comment_pkey, bob.publicKey, tweet_pkey, bob_comment, comment_bump
      )
    });

    it("Should maintain correct final state across all tweets and reactions", async () => {
      // Bob's first tweet should have: 2 likes, 1 dislike
      const [tweet1_pkey, tweet1_bump] = getTweetAddress(topic_bob1, bob.publicKey, program.programId);
      await checkTweet(program, tweet1_pkey, bob.publicKey, topic_bob1, content_bob1, 2, 1, tweet1_bump);

      // Bob's second tweet should have: 1 like, 0 dislikes
      const [tweet2_pkey, tweet2_bump] = getTweetAddress(topic_bob4, bob.publicKey, program.programId);
      await checkTweet(program, tweet2_pkey, bob.publicKey, topic_bob4, content_bob4, 1, 0, tweet2_bump);

      // Charlie's tweet should have: 0 likes, 0 dislikes
      const [tweet3_pkey, tweet3_bump] = getTweetAddress(topic_bob1, charlie.publicKey, program.programId);
      await checkTweet(program, tweet3_pkey, charlie.publicKey, topic_bob1, "Charlie's version", 0, 0, tweet3_bump);
    });
  });

});


async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}

function getCommentAddress(comment_content: string, author: PublicKey, parent_tweet: PublicKey, programID: PublicKey) {
  let hexString = crypto.createHash('sha256').update(comment_content, 'utf-8').digest('hex');
  let content_seed = Uint8Array.from(Buffer.from(hexString, 'hex'));


  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(COMMENT_SEED),
      author.toBuffer(),
      content_seed,
      parent_tweet.toBuffer(),
    ], programID);
}

function getTweetAddress(topic: string, author: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(topic),
      anchor.utils.bytes.utf8.encode(TWEET_SEED),
      author.toBuffer()
    ], programID);
}

function getReactionAddress(author: PublicKey, tweet: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(TWEET_REACTION),
      author.toBuffer(),
      tweet.toBuffer(),
    ], programID);
}

class SolanaError {
  static contains(logs, error): boolean {
    const match = logs?.filter(s => s.includes(error));
    return Boolean(match?.length)
  }
}


async function checkTweet(
  program: anchor.Program<Twitter>,
  tweet: PublicKey,
  tweet_author?: PublicKey,
  topic?: string,
  content?: string,
  likes?: number,
  dislikes?: number,
  bump?: number,
) {
  let tweetData = await program.account.tweet.fetch(tweet);

  if (tweet_author) {
    assert.strictEqual(tweetData.tweetAuthor.toString(), tweet_author.toString(), `Tweet author should be ${tweet_author.toString()} but was ${tweetData.tweetAuthor.toString()}`)
  }
  if (topic) {
    assert.strictEqual(tweetData.topic, topic, `Tweet topic should be "${topic}" but was "${tweetData.topic}"`);
  }
  if (content) {
    assert.strictEqual(tweetData.content, content, `Tweet content should be "${content}" but was "${tweetData.content}"`);
  }
  if (likes || likes == 0) {
    assert.strictEqual(tweetData.likes.toString(), new anchor.BN(likes).toString(), `Tweet likes should be ${likes} but was ${tweetData.likes.toString()}`)
  }
  if (dislikes || dislikes == 0) {
    assert.strictEqual(tweetData.dislikes.toString(), new anchor.BN(dislikes).toString(), `Tweet dislikes should be ${dislikes} but was ${tweetData.dislikes.toString()}`)
  }
  if (bump) {
    assert.strictEqual(tweetData.bump.toString(), bump.toString(), `Tweet bump should be ${bump} but was ${tweetData.bump}`)
  }
}

async function checkReaction(
  program: anchor.Program<Twitter>,
  reaction: PublicKey,
  reaction_author?: PublicKey,
  parent_tweet?: PublicKey,
  bump?: number,
) {
  let reactionData = await program.account.reaction.fetch(reaction);

  if (reaction_author) {
    assert.strictEqual(reactionData.reactionAuthor.toString(), reaction_author.toString(), `Reaction author should be ${reaction_author.toString()} but was ${reactionData.reactionAuthor.toString()}`)
  }
  if (parent_tweet) {
    assert.strictEqual(reactionData.parentTweet.toString(), parent_tweet.toString(), `Reaction parent tweet should be ${parent_tweet.toString()} but was ${reactionData.parentTweet.toString()}`);
  }
  if (bump) {
    assert.strictEqual(reactionData.bump.toString(), bump.toString(), `Reaction bump should be ${bump} but was ${reactionData.bump}`)
  }
}


async function checkComment(
  program: anchor.Program<Twitter>,
  comment: PublicKey,
  comment_author?: PublicKey,
  parent_tweet?: PublicKey,
  content?: string,
  bump?: number,
) {
  let commentnData = await program.account.comment.fetch(comment);

  if (comment_author) {
    assert.strictEqual(commentnData.commentAuthor.toString(), comment_author.toString(), `Comment author should be ${comment_author.toString()} but was ${commentnData.commentAuthor.toString()}`)
  }
  if (parent_tweet) {
    assert.strictEqual(commentnData.parentTweet.toString(), parent_tweet.toString(), `Comment parent tweet should be ${parent_tweet.toString()} but was ${commentnData.parentTweet.toString()}`)
  }
  if (content) {
    assert.strictEqual(commentnData.content, content, `Comment content should be "${content}" but was "${commentnData.content}"`);
  }
  if (bump) {
    assert.strictEqual(commentnData.bump.toString(), bump.toString(), `Comment bump should be ${bump} but was ${commentnData.bump}`)
  }
}
