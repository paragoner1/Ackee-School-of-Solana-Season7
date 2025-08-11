[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/2adYzivg)
![School of Solana](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/.banner/banner.png?raw=true)

Welcome to **Task 3** of the **School of Solana Season 7**.

## 📚Task 3
In the previous tasks, you were introduced to Solana basics and Rust. The goal of this 
task is to connect these elements and work with Rust on Solana. You will become familiar 
with the basic structure of Solana programs and learn how programming on Solana is done.

You'll implement an **on-chain vault program** that allows users to deposit SOL, withdraw SOL (if they're the vault authority), and toggle the vault's lock state. The vault demonstrates core Solana concepts including **Program Derived Addresses (PDAs)**, **Cross-Program Invocations (CPIs)**, **account validation**, and **state management**.

## Task Overview

Your task is to complete the implementation of three key instructions in the vault program:

- **`deposit`** - Allow users to deposit SOL into any vault (if unlocked)
- **`withdraw`** - Allow vault authorities to withdraw SOL from their vaults (if unlocked)  
- **`toggle_lock`** - Allow vault authorities to lock/unlock their vaults

The `initialize` instruction is fully implemented and serves as a reference for understanding Anchor patterns and Solana program structure.

## Project Structure

Your workspace contains these key files in the `programs/on-chain-vault/src` directory:

- **`lib.rs`** - Main program module with task instructions
- **`instructions/`** - Instruction implementations
  - **`initialize.rs`** - Reference implementation
  - **`deposit.rs`** - Deposit implementation
  - **`withdraw.rs`** - Withdraw implementation
  - **`toggle_lock.rs`** - Toggle lock implementation
- **`state.rs`** - Vault account structure
- **`errors.rs`** - Custom error definitions
- **`events.rs`** - Event definitions

## Submission Process

1. Complete the **TODO sections** in the instruction files.
2. Test your solution using the provided test suite.
3. To submit your answers, push your changes to the **main** branch in **this** repository.

>[!IMPORTANT]
>**Only modify code where you find TODO comments.** Do not commit changes to other files as it can make the evaluation process more difficult.

### Deadline
The deadline for this task is **Wednesday, August 6th, at 23:59 UTC**.

>[!CAUTION]
>Note that we will not accept submissions after the deadline.

## Evaluation Criteria

>[!IMPORTANT]
>Your submission must pass **100%** of the provided test suite in order to pass this task.

## Getting Started

### Prerequisites
For this task you need:
- [Rust installed](https://www.rust-lang.org/tools/install)
    - Make sure to use stable version:
    ```bash
    rustup default stable
    ```
- [Solana installed](https://docs.solana.com/cli/install-solana-cli-tools)
    - Use v2.2.12
    - After you have Solana-CLI installed, you can switch between versions using:
    ```bash
    agave-install init 2.2.12
    ```

- [Anchor installed](https://www.anchor-lang.com/docs/installation)
    - Use v0.31.1
    - After you have Anchor installed, you can switch between versions using:
    ```bash
    avm use 0.31.1
    ```

### Development Commands

**Install dependencies:**
```bash
yarn install
```

**Build the project:**
```bash
anchor build
```

**Test your implementation:**
```bash
anchor test
```

### Hints and Useful Links

[Anchor Framework Documentation](https://www.anchor-lang.com/)

-----

### Need help?
>[!TIP]
>If you have any questions, feel free to reach out to us on [Discord](https://discord.gg/z3JVuZyFnp).
