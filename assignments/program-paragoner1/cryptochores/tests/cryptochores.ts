import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cryptochores } from "../target/types/cryptochores";
import { expect } from "chai";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("cryptochores", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Cryptochores as Program<Cryptochores>;

  // Test keypairs
  const guardian = Keypair.generate();
  const child = Keypair.generate();
  const assignee = Keypair.generate();
  const choreCounter = Keypair.generate();

  // PDAs
  const [childWalletPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("child_wallet"), child.publicKey.toBuffer()],
    program.programId
  );

  const [chorePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("chore"), guardian.publicKey.toBuffer(), choreCounter.publicKey.toBuffer()],
    program.programId
  );

  before(async () => {
    // Airdrop SOL to test accounts
    const signature1 = await provider.connection.requestAirdrop(
      guardian.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature1);

    const signature2 = await provider.connection.requestAirdrop(
      assignee.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature2);

    // Also fund the child account for withdrawals
    const signature3 = await provider.connection.requestAirdrop(
      child.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature3);
  });

  describe("initialize_child_wallet", () => {
    it("Should initialize a child wallet successfully", async () => {
      await program.methods
        .initializeChildWallet()
        .accounts({
          childWallet: childWalletPda,
          child: child.publicKey,
          guardian: guardian.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([guardian])
        .rpc();

      // Verify the child wallet was created
      const childWalletAccount = await program.account.childWallet.fetch(childWalletPda);
      expect(childWalletAccount.child.toString()).to.equal(child.publicKey.toString());
      expect(childWalletAccount.guardian.toString()).to.equal(guardian.publicKey.toString());
      expect(childWalletAccount.totalEarned.toNumber()).to.equal(0);
      expect(childWalletAccount.currentBalance.toNumber()).to.equal(0);
      expect(childWalletAccount.choresCompleted.toNumber()).to.equal(0);
    });

    it("Should fail when trying to initialize the same child wallet twice", async () => {
      try {
        await program.methods
          .initializeChildWallet()
          .accounts({
            childWallet: childWalletPda,
            child: child.publicKey,
            guardian: guardian.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([guardian])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("already in use");
      }
    });
  });

  describe("create_chore", () => {
    it("Should create a chore successfully", async () => {
      const title = "Clean Room";
      const description = "Clean your room thoroughly";
      const maxPayment = new anchor.BN(10000000); // 0.01 SOL

      await program.methods
        .createChore(title, description, maxPayment)
        .accounts({
          chore: chorePda,
          childWallet: childWalletPda,
          assigner: guardian.publicKey,
          assignee: assignee.publicKey,
          systemProgram: SystemProgram.programId,
          choreCounter: choreCounter.publicKey,
        })
        .signers([guardian, choreCounter])
        .rpc();

      // Verify the chore was created
      const choreAccount = await program.account.chore.fetch(chorePda);
      expect(choreAccount.assigner.toString()).to.equal(guardian.publicKey.toString());
      expect(choreAccount.assignee.toString()).to.equal(assignee.publicKey.toString());
      expect(choreAccount.title).to.equal(title);
      expect(choreAccount.description).to.equal(description);
      expect(choreAccount.maxPayment.toNumber()).to.equal(maxPayment.toNumber());
      expect(choreAccount.status).to.deep.equal({ pending: {} });
    });
  });

  describe("submit_chore_completion", () => {
    it("Should submit chore completion successfully", async () => {
      await program.methods
        .submitChoreCompletion()
        .accounts({
          chore: chorePda,
          assignee: assignee.publicKey,
        })
        .signers([assignee])
        .rpc();

      // Verify the chore status was updated
      const choreAccount = await program.account.chore.fetch(chorePda);
      expect(choreAccount.status).to.deep.equal({ completed: {} });
    });

    it("Should fail when non-assignee tries to submit completion", async () => {
      const nonAssignee = Keypair.generate();
      
      try {
        await program.methods
          .submitChoreCompletion()
          .accounts({
            chore: chorePda,
            assignee: nonAssignee.publicKey,
          })
          .signers([nonAssignee])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        // The error occurs because the chore PDA doesn't exist for this non-assignee
        expect(error.message).to.include("AnchorError");
      }
    });
  });

  describe("rate_and_pay_chore", () => {
    it("Should rate and pay chore successfully", async () => {
      const rating = 5;
      const paymentAmount = new anchor.BN(8000000); // 0.008 SOL

      await program.methods
        .rateAndPayChore(rating)
        .accounts({
          chore: chorePda,
          childWallet: childWalletPda,
          guardian: guardian.publicKey,
          childActualWallet: assignee.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([guardian])
        .rpc();

      // Verify the chore was rated and paid
      const choreAccount = await program.account.chore.fetch(chorePda);
      expect(choreAccount.status).to.deep.equal({ paid: {} });

      // Verify the child wallet received payment
      const childWalletAccount = await program.account.childWallet.fetch(childWalletPda);
      expect(childWalletAccount.totalEarned.toNumber()).to.be.greaterThan(0);
      expect(childWalletAccount.choresCompleted.toNumber()).to.equal(1);
    });

    it("Should fail when rating is invalid (0)", async () => {
      try {
        await program.methods
          .rateAndPayChore(0)
          .accounts({
            chore: chorePda,
            childWallet: childWalletPda,
            guardian: guardian.publicKey,
            childActualWallet: assignee.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([guardian])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        // The error should be about invalid rating
        expect(error.message).to.include("AnchorError");
      }
    });
  });

  describe("withdraw_earnings", () => {
    it("Should withdraw earnings successfully", async () => {
      const withdrawAmount = new anchor.BN(500000); // 0.0005 SOL

      await program.methods
        .withdrawEarnings(withdrawAmount)
        .accounts({
          childWallet: childWalletPda,
          child: child.publicKey,
          childActualWallet: child.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([child])
        .rpc();

      // Verify the withdrawal was processed
      const childWalletAccount = await program.account.childWallet.fetch(childWalletPda);
      expect(childWalletAccount.currentBalance.toNumber()).to.be.lessThan(
        childWalletAccount.totalEarned.toNumber()
      );
    });

    it("Should fail when trying to withdraw more than available balance", async () => {
      const excessiveAmount = new anchor.BN(LAMPORTS_PER_SOL); // 1 SOL

      try {
        await program.methods
          .withdrawEarnings(excessiveAmount)
                            .accounts({
            childWallet: childWalletPda,
            child: child.publicKey,
            childActualWallet: child.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([child])
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("InsufficientBalance");
      }
    });
  });
});
