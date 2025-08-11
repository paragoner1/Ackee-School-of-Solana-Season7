import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OnChainVault } from "../target/types/on_chain_vault";
import { assert } from "chai";

describe("on-chain-vault", async () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.OnChainVault as Program<OnChainVault>;

  const alice = anchor.web3.Keypair.generate();
  const bob = anchor.web3.Keypair.generate();
  const anatoly = anchor.web3.Keypair.generate();

  // Vault PDAs will be derived from the vault authority
  const getVaultPDA = (vaultAuthority: anchor.web3.PublicKey) => {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), vaultAuthority.toBuffer()],
      program.programId
    );
  };

  const [vaultAlicePDA] = getVaultPDA(alice.publicKey);
  const [vaultBobPDA] = getVaultPDA(bob.publicKey);
  const [vaultAnatolyPDA] = getVaultPDA(anatoly.publicKey);

  it("Initialize Vault Alice (unlocked)", async () => {
    await airdrop(provider.connection, alice.publicKey);

    const locked = false;

    let txSig = await program.methods.initVault(locked).accounts({
      vaultAuthority: alice.publicKey,
      vault: vaultAlicePDA,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([alice]).rpc({ commitment: "confirmed" });

    const vaultData = await program.account.vault.fetch(vaultAlicePDA);
    assert.strictEqual(vaultData.vaultAuthority.toString(), alice.publicKey.toString(), "Vault authority should be Alice's public key");
    assert.strictEqual(vaultData.locked, false, "Vault should be unlocked");

    // Check event was emitted
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "initializeVaultEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.vault.toString(), vaultAlicePDA.toString(), "Event vault should match Alice's vault PDA");
        assert.strictEqual(event.data.vaultAuthority.toString(), alice.publicKey.toString(), "Event vault authority should be Alice");
        assert.strictEqual(event.data.locked, false, "Event locked status should be false");
      }
    }
    assert.isTrue(logsEmitted, "InitializeVaultEvent should have been emitted");
  });

  it("Initialize Vault Bob (locked)", async () => {
    await airdrop(provider.connection, bob.publicKey);

    const locked = true;

    let txSig = await program.methods.initVault(locked).accounts({
      vaultAuthority: bob.publicKey,
      vault: vaultBobPDA,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([bob]).rpc({ commitment: "confirmed" });

    const vaultData = await program.account.vault.fetch(vaultBobPDA);
    assert.strictEqual(vaultData.vaultAuthority.toString(), bob.publicKey.toString(), "Vault authority should be Bob's public key");
    assert.strictEqual(vaultData.locked, true, "Vault should be locked");

    // Check event was emitted
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "initializeVaultEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.vault.toString(), vaultBobPDA.toString(), "Event vault should match Bob's vault PDA");
        assert.strictEqual(event.data.vaultAuthority.toString(), bob.publicKey.toString(), "Event vault authority should be Bob");
        assert.strictEqual(event.data.locked, true, "Event locked status should be true");
      }
    }
    assert.isTrue(logsEmitted, "InitializeVaultEvent should have been emitted");
  });

  it("Initialize Vault Anatoly (unlocked)", async () => {
    await airdrop(provider.connection, anatoly.publicKey);

    const locked = false;

    let txSig = await program.methods.initVault(locked).accounts({
      vaultAuthority: anatoly.publicKey,
      vault: vaultAnatolyPDA,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([anatoly]).rpc({ commitment: "confirmed" });

    const vaultData = await program.account.vault.fetch(vaultAnatolyPDA);
    assert.strictEqual(vaultData.vaultAuthority.toString(), anatoly.publicKey.toString(), "Vault authority should be Anatoly's public key");
    assert.strictEqual(vaultData.locked, false, "Vault should be unlocked");

    // Check event was emitted
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "initializeVaultEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.vault.toString(), vaultAnatolyPDA.toString(), "Event vault should match Anatoly's vault PDA");
        assert.strictEqual(event.data.vaultAuthority.toString(), anatoly.publicKey.toString(), "Event vault authority should be Anatoly");
        assert.strictEqual(event.data.locked, false, "Event locked status should be false");
      }
    }
    assert.isTrue(logsEmitted, "InitializeVaultEvent should have been emitted");
  });

  it("Cannot initialize vault twice (Alice tries to initialize again)", async () => {
    const locked = true;

    let flag = "This should fail";
    try {
      await program.methods.initVault(locked).accounts({
        vaultAuthority: alice.publicKey,
        vault: vaultAlicePDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([alice]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      // Should fail because account already exists
      assert.isTrue(error.toString().includes("already in use") || error.toString().includes("Error"), "Should fail with account already in use error");
    }
    assert.strictEqual(flag, "Failed", "Initializing vault twice should fail");
  });

  it("Cannot initialize vault for someone else", async () => {
    const charlie = anchor.web3.Keypair.generate();
    await airdrop(provider.connection, charlie.publicKey);
    
    const locked = false;

    let flag = "This should fail";
    try {
      // Alice trying to initialize a vault for Bob (but Alice signs)
      await program.methods.initVault(locked).accounts({
        vaultAuthority: bob.publicKey,
        vault: vaultBobPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([alice]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      // Should fail due to signature mismatch
      assert.isTrue(error.toString().includes("Error"), "Should fail with signature mismatch error");
    }
    assert.strictEqual(flag, "Failed", "Initializing vault for someone else should fail");
  });

  it("Deposit to Alice's vault", async () => {
    const depositAmount = 1000000; // 0.001 SOL
    const vaultBalanceBefore = await provider.connection.getBalance(vaultAlicePDA);
    const userBalanceBefore = await provider.connection.getBalance(alice.publicKey);

    let txSig = await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
      user: alice.publicKey,
      vault: vaultAlicePDA,
    }).signers([alice]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultAlicePDA);
    const userBalanceAfter = await provider.connection.getBalance(alice.publicKey);

    // Check balances changed correctly
    assert.isTrue(vaultBalanceAfter > vaultBalanceBefore, "Vault balance should increase after deposit");
    assert.isTrue(userBalanceAfter < userBalanceBefore, "User balance should decrease after deposit");

    // Check event was emitted
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "depositEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.amount.toString(), depositAmount.toString(), "Event amount should match deposit amount");
        assert.strictEqual(event.data.user.toString(), alice.publicKey.toString(), "Event user should be Alice");
        assert.strictEqual(event.data.vault.toString(), vaultAlicePDA.toString(), "Event vault should be Alice's vault");
      }
    }
    assert.isTrue(logsEmitted, "DepositEvent should have been emitted");
  });

  it("Cannot deposit to locked vault (Bob's vault)", async () => {
    const depositAmount = 1000000;

    let flag = "This should fail";
    try {
      await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
        user: bob.publicKey,
        vault: vaultBobPDA,
      }).signers([bob]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(err.error.errorCode.code, "VaultLocked", "Should fail with VaultLocked error");
    }
    assert.strictEqual(flag, "Failed", "Depositing to locked vault should fail");
  });

  it("Cannot deposit to non-existent vault", async () => {
    const charlie = anchor.web3.Keypair.generate();
    await airdrop(provider.connection, charlie.publicKey);
    const [charlieVaultPDA] = getVaultPDA(charlie.publicKey);
    
    const depositAmount = 1000000;

    let flag = "This should fail";
    try {
      await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
        user: charlie.publicKey,
        vault: charlieVaultPDA,
      }).signers([charlie]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      // Should fail because vault doesn't exist
      assert.isTrue(error.toString().includes("AccountNotInitialized") || error.toString().includes("Error"), "Should fail with AccountNotInitialized error");
    }
    assert.strictEqual(flag, "Failed", "Depositing to non-existent vault should fail");
  });

  it("Cannot deposit more than user balance", async () => {
    const depositAmount = new anchor.BN("999999999999999999"); // Huge amount
    
    let flag = "This should fail";
    try {
      await program.methods.deposit(depositAmount).accounts({
        user: alice.publicKey,
        vault: vaultAlicePDA,
      }).signers([alice]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(err.error.errorCode.code, "InsufficientBalance", "Should fail with InsufficientBalance error");
    }
    assert.strictEqual(flag, "Failed", "Depositing more than user balance should fail");
  });

  it("Toggle lock on Bob's vault (unlock it)", async () => {
    let txSig = await program.methods.toggleLock().accounts({
      vaultAuthority: bob.publicKey,
      vault: vaultBobPDA,
    }).signers([bob]).rpc({ commitment: "confirmed" });

    const vaultData = await program.account.vault.fetch(vaultBobPDA);
    assert.strictEqual(vaultData.locked, false, "Vault should be unlocked after toggle");

    // Check event was emitted
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "toggleLockEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.vault.toString(), vaultBobPDA.toString(), "Event vault should match Bob's vault PDA");
        assert.strictEqual(event.data.vaultAuthority.toString(), bob.publicKey.toString(), "Event vault authority should be Bob");
        assert.strictEqual(event.data.locked, false, "Event locked status should be false after unlock");
      }
    }
    assert.isTrue(logsEmitted, "ToggleLockEvent should have been emitted");
  });

  it("Now can deposit to Bob's vault after unlocking", async () => {
    const depositAmount = 500000;
    const vaultBalanceBefore = await provider.connection.getBalance(vaultBobPDA);

    await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
      user: bob.publicKey,
      vault: vaultBobPDA,
    }).signers([bob]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultBobPDA);
    assert.isTrue(vaultBalanceAfter > vaultBalanceBefore, "Vault balance should increase after deposit to unlocked vault");
  });

  it("Toggle lock on Alice's vault (lock it)", async () => {
    let txSig = await program.methods.toggleLock().accounts({
      vaultAuthority: alice.publicKey,
      vault: vaultAlicePDA,
    }).signers([alice]).rpc({ commitment: "confirmed" });

    const vaultData = await program.account.vault.fetch(vaultAlicePDA);
    assert.strictEqual(vaultData.locked, true, "Vault should be locked after toggle");

    // Check event was emitted
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "toggleLockEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.vault.toString(), vaultAlicePDA.toString(), "Event vault should match Alice's vault PDA");
        assert.strictEqual(event.data.vaultAuthority.toString(), alice.publicKey.toString(), "Event vault authority should be Alice");
        assert.strictEqual(event.data.locked, true, "Event locked status should be true after lock");
      }
    }
    assert.isTrue(logsEmitted, "ToggleLockEvent should have been emitted");
  });

  it("Cannot deposit to Alice's vault after locking", async () => {
    const depositAmount = 1000000;

    let flag = "This should fail";
    try {
      await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
        user: alice.publicKey,
        vault: vaultAlicePDA,
      }).signers([alice]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(err.error.errorCode.code, "VaultLocked", "Should fail with VaultLocked error");
    }
    assert.strictEqual(flag, "Failed", "Depositing to locked vault should fail");
  });

  it("Withdraw from Bob's vault", async () => {
    const withdrawAmount = 200000;
    const vaultBalanceBefore = await provider.connection.getBalance(vaultBobPDA);
    const authorityBalanceBefore = await provider.connection.getBalance(bob.publicKey);

    let txSig = await program.methods.withdraw(new anchor.BN(withdrawAmount)).accounts({
      vaultAuthority: bob.publicKey,
      vault: vaultBobPDA,
    }).signers([bob]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultBobPDA);
    const authorityBalanceAfter = await provider.connection.getBalance(bob.publicKey);

    // Check balances changed correctly
    assert.isTrue(vaultBalanceAfter < vaultBalanceBefore, "Vault balance should decrease after withdrawal");
    assert.isTrue(authorityBalanceAfter > authorityBalanceBefore, "Authority balance should increase after withdrawal");

    // Check event was emitted
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "withdrawEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.amount.toString(), withdrawAmount.toString(), "Event amount should match withdrawal amount");
        assert.strictEqual(event.data.vaultAuthority.toString(), bob.publicKey.toString(), "Event vault authority should be Bob");
        assert.strictEqual(event.data.vault.toString(), vaultBobPDA.toString(), "Event vault should be Bob's vault");
      }
    }
    assert.isTrue(logsEmitted, "WithdrawEvent should have been emitted");
  });

  it("Cannot withdraw from Alice's locked vault", async () => {
    const withdrawAmount = 100000;

    let flag = "This should fail";
    try {
      await program.methods.withdraw(new anchor.BN(withdrawAmount)).accounts({
        vaultAuthority: alice.publicKey,
        vault: vaultAlicePDA,
      }).signers([alice]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(err.error.errorCode.code, "VaultLocked", "Should fail with VaultLocked error");
    }
    assert.strictEqual(flag, "Failed", "Withdrawing from locked vault should fail");
  });

  it("Cannot withdraw from vault without authority", async () => {
    const withdrawAmount = 100000;

    let flag = "This should fail";
    try {
      await program.methods.withdraw(new anchor.BN(withdrawAmount)).accounts({
        vaultAuthority: alice.publicKey, // Alice trying to withdraw from Bob's vault
        vault: vaultBobPDA,
      }).signers([alice]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      // This should fail due to seeds constraint
      assert.isTrue(error.toString().includes("Error"), "Should fail due to seeds constraint - wrong authority");
    }
    assert.strictEqual(flag, "Failed", "Withdrawing without proper authority should fail");
  });

  it("Cannot withdraw more than vault balance", async () => {
    const hugeAmount = new anchor.BN("999999999999999999");

    let flag = "This should fail";
    try {
      await program.methods.withdraw(hugeAmount).accounts({
        vaultAuthority: bob.publicKey,
        vault: vaultBobPDA,
      }).signers([bob]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(err.error.errorCode.code, "InsufficientBalance", "Should fail with InsufficientBalance error");
    }
    assert.strictEqual(flag, "Failed", "Withdrawing more than vault balance should fail");
  });

  it("Cannot toggle lock without authority", async () => {
    let flag = "This should fail";
    try {
      await program.methods.toggleLock().accounts({
        vaultAuthority: alice.publicKey, // Alice trying to toggle Bob's vault
        vault: vaultBobPDA,
      }).signers([alice]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      // This should fail due to seeds constraint
      assert.isTrue(error.toString().includes("Error"), "Should fail due to seeds constraint - wrong authority");
    }
    assert.strictEqual(flag, "Failed", "Toggling lock without proper authority should fail");
  });

  it("Cannot toggle lock on non-existent vault", async () => {
    const charlie = anchor.web3.Keypair.generate();
    await airdrop(provider.connection, charlie.publicKey);
    const [charlieVaultPDA] = getVaultPDA(charlie.publicKey);

    let flag = "This should fail";
    try {
      await program.methods.toggleLock().accounts({
        vaultAuthority: charlie.publicKey,
        vault: charlieVaultPDA,
      }).signers([charlie]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      // Should fail because vault doesn't exist
      assert.isTrue(error.toString().includes("AccountNotInitialized") || error.toString().includes("Error"), "Should fail with AccountNotInitialized error");
    }
    assert.strictEqual(flag, "Failed", "Toggling lock on non-existent vault should fail");
  });

  it("Unlock Alice's vault and withdraw", async () => {
    // First unlock
    await program.methods.toggleLock().accounts({
      vaultAuthority: alice.publicKey,
      vault: vaultAlicePDA,
    }).signers([alice]).rpc({ commitment: "confirmed" });

    const vaultData = await program.account.vault.fetch(vaultAlicePDA);
    assert.strictEqual(vaultData.locked, false, "Vault should be unlocked after toggle");

    // Then withdraw
    const withdrawAmount = 500000;
    const vaultBalanceBefore = await provider.connection.getBalance(vaultAlicePDA);

    await program.methods.withdraw(new anchor.BN(withdrawAmount)).accounts({
      vaultAuthority: alice.publicKey,
      vault: vaultAlicePDA,
    }).signers([alice]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultAlicePDA);
    assert.isTrue(vaultBalanceAfter < vaultBalanceBefore, "Vault balance should decrease after withdrawal");
  });

  it("Deposit to Anatoly's vault", async () => {
    const depositAmount = 2000000;
    const vaultBalanceBefore = await provider.connection.getBalance(vaultAnatolyPDA);

    await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
      user: anatoly.publicKey,
      vault: vaultAnatolyPDA,
    }).signers([anatoly]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultAnatolyPDA);
    assert.isTrue(vaultBalanceAfter > vaultBalanceBefore, "Vault balance should increase after deposit");
  });

  it("Multiple deposits and withdrawals work correctly", async () => {
    // Multiple deposits
    await program.methods.deposit(new anchor.BN(100000)).accounts({
      user: anatoly.publicKey,
      vault: vaultAnatolyPDA,
    }).signers([anatoly]).rpc({ commitment: "confirmed" });

    await program.methods.deposit(new anchor.BN(200000)).accounts({
      user: anatoly.publicKey,
      vault: vaultAnatolyPDA,
    }).signers([anatoly]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultAnatolyPDA);

    // Withdraw some
    await program.methods.withdraw(new anchor.BN(150000)).accounts({
      vaultAuthority: anatoly.publicKey,
      vault: vaultAnatolyPDA,
    }).signers([anatoly]).rpc({ commitment: "confirmed" });

    const vaultBalanceFinal = await provider.connection.getBalance(vaultAnatolyPDA);
    assert.isTrue(vaultBalanceFinal < vaultBalanceAfter, "Vault balance should decrease after withdrawal");
  });

  it("Cross-user deposits: Alice deposits into Bob's vault", async () => {
    const depositAmount = 500000;
    const vaultBalanceBefore = await provider.connection.getBalance(vaultBobPDA);
    const aliceBalanceBefore = await provider.connection.getBalance(alice.publicKey);

    let txSig = await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
      user: alice.publicKey,
      vault: vaultBobPDA,
    }).signers([alice]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultBobPDA);
    const aliceBalanceAfter = await provider.connection.getBalance(alice.publicKey);

    // Check balances changed correctly
    assert.isTrue(vaultBalanceAfter > vaultBalanceBefore, "Bob's vault balance should increase when Alice deposits");
    assert.isTrue(aliceBalanceAfter < aliceBalanceBefore, "Alice's balance should decrease when she deposits");

    // Check event was emitted with correct data
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "depositEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.amount.toString(), depositAmount.toString(), "Event amount should match deposit amount");
        assert.strictEqual(event.data.user.toString(), alice.publicKey.toString(), "Event user should be Alice (the depositor)");
        assert.strictEqual(event.data.vault.toString(), vaultBobPDA.toString(), "Event vault should be Bob's vault");
      }
    }
    assert.isTrue(logsEmitted, "DepositEvent should have been emitted for cross-user deposit");
  });

  it("Cross-user deposits: Bob deposits into Anatoly's vault", async () => {
    const depositAmount = 300000;
    const vaultBalanceBefore = await provider.connection.getBalance(vaultAnatolyPDA);
    const bobBalanceBefore = await provider.connection.getBalance(bob.publicKey);

    let txSig = await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
      user: bob.publicKey,
      vault: vaultAnatolyPDA,
    }).signers([bob]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultAnatolyPDA);
    const bobBalanceAfter = await provider.connection.getBalance(bob.publicKey);

    // Check balances changed correctly
    assert.isTrue(vaultBalanceAfter > vaultBalanceBefore, "Anatoly's vault balance should increase when Bob deposits");
    assert.isTrue(bobBalanceAfter < bobBalanceBefore, "Bob's balance should decrease when he deposits");

    // Check event was emitted with correct data
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "depositEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.amount.toString(), depositAmount.toString(), "Event amount should match deposit amount");
        assert.strictEqual(event.data.user.toString(), bob.publicKey.toString(), "Event user should be Bob (the depositor)");
        assert.strictEqual(event.data.vault.toString(), vaultAnatolyPDA.toString(), "Event vault should be Anatoly's vault");
      }
    }
    assert.isTrue(logsEmitted, "DepositEvent should have been emitted for cross-user deposit");
  });

  it("Cross-user deposits: Anatoly deposits into Alice's vault (after unlocking)", async () => {
    const depositAmount = 750000;
    const vaultBalanceBefore = await provider.connection.getBalance(vaultAlicePDA);
    const anatolyBalanceBefore = await provider.connection.getBalance(anatoly.publicKey);

    let txSig = await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
      user: anatoly.publicKey,
      vault: vaultAlicePDA,
    }).signers([anatoly]).rpc({ commitment: "confirmed" });

    const vaultBalanceAfter = await provider.connection.getBalance(vaultAlicePDA);
    const anatolyBalanceAfter = await provider.connection.getBalance(anatoly.publicKey);

    // Check balances changed correctly
    assert.isTrue(vaultBalanceAfter > vaultBalanceBefore, "Alice's vault balance should increase when Anatoly deposits");
    assert.isTrue(anatolyBalanceAfter < anatolyBalanceBefore, "Anatoly's balance should decrease when he deposits");

    // Check event was emitted with correct data
    const tx = await provider.connection.getParsedTransaction(txSig, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(tx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "depositEvent") {
        logsEmitted = true;
        assert.strictEqual(event.data.amount.toString(), depositAmount.toString(), "Event amount should match deposit amount");
        assert.strictEqual(event.data.user.toString(), anatoly.publicKey.toString(), "Event user should be Anatoly (the depositor)");
        assert.strictEqual(event.data.vault.toString(), vaultAlicePDA.toString(), "Event vault should be Alice's vault");
      }
    }
    assert.isTrue(logsEmitted, "DepositEvent should have been emitted for cross-user deposit");
  });

  it("Cannot cross-deposit into locked vault", async () => {
    // Lock Alice's vault again
    await program.methods.toggleLock().accounts({
      vaultAuthority: alice.publicKey,
      vault: vaultAlicePDA,
    }).signers([alice]).rpc({ commitment: "confirmed" });

    const depositAmount = 100000;

    let flag = "This should fail";
    try {
      await program.methods.deposit(new anchor.BN(depositAmount)).accounts({
        user: bob.publicKey, // Bob trying to deposit
        vault: vaultAlicePDA, // Into Alice's locked vault
      }).signers([bob]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(err.error.errorCode.code, "VaultLocked", "Should fail with VaultLocked error");
    }
    assert.strictEqual(flag, "Failed", "Cross-depositing into locked vault should fail");
  });

  it("Only vault authority can withdraw (not depositors)", async () => {
    // Unlock Alice's vault for this test
    await program.methods.toggleLock().accounts({
      vaultAuthority: alice.publicKey,
      vault: vaultAlicePDA,
    }).signers([alice]).rpc({ commitment: "confirmed" });

    // Bob deposits into Alice's vault
    await program.methods.deposit(new anchor.BN(200000)).accounts({
      user: bob.publicKey,
      vault: vaultAlicePDA,
    }).signers([bob]).rpc({ commitment: "confirmed" });

    // Bob tries to withdraw from Alice's vault (should fail)
    const withdrawAmount = 100000;
    let flag = "This should fail";
    try {
      await program.methods.withdraw(new anchor.BN(withdrawAmount)).accounts({
        vaultAuthority: bob.publicKey, // Bob trying to withdraw
        vault: vaultAlicePDA, // From Alice's vault (but Bob deposited)
      }).signers([bob]).rpc({ commitment: "confirmed" });
    } catch (error) {
      flag = "Failed";
      // Should fail due to seeds constraint - Bob is not the vault authority
      assert.isTrue(error.toString().includes("Error"), "Should fail due to seeds constraint - Bob is not vault authority");
    }
    assert.strictEqual(flag, "Failed", "Non-authority should not be able to withdraw even if they deposited");

    // But Alice (vault authority) can withdraw
    await program.methods.withdraw(new anchor.BN(withdrawAmount)).accounts({
      vaultAuthority: alice.publicKey,
      vault: vaultAlicePDA,
    }).signers([alice]).rpc({ commitment: "confirmed" });
  });
});

async function airdrop(connection: any, address: any, amount = 100 * anchor.web3.LAMPORTS_PER_SOL) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}
