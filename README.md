[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/LPQp1ENq)
![School of Solana](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/.banner/banner.png?raw=true)

Welcome to **Task 4** of the **School of Solana Season 7**.

## 📚Task 4
This time, you'll implement a **decentralized Twitter-like program** that allows users to create tweets, add reactions (likes/dislikes), comment on tweets, and remove their own reactions and comments.

## Task Overview

Your task is to complete the implementation of five key instructions in the Twitter program:

- **`initialize_tweet`** - Create tweets with topics and content
- **`add_reaction`** - Add likes or dislikes to tweets  
- **`remove_reaction`** - Remove user's own reactions from tweets
- **`add_comment`** - Add comments to tweets
- **`remove_comment`** - Remove user's own comments from tweets

Each instruction file contains detailed requirements and constraints to guide your implementation.

## Project Structure

Your workspace contains these key files in the `programs/twitter/src` directory:

- **`lib.rs`** - Main program module with task instructions and helpful hints
- **`instructions/`** - Instruction implementations
  - **`initialize_tweet.rs`** - Tweet creation implementation
  - **`add_reaction.rs`** - Add reaction implementation
  - **`remove_reaction.rs`** - Remove reaction implementation
  - **`add_comment.rs`** - Add comment implementation
  - **`remove_comment.rs`** - Remove comment implementation
- **`states.rs`** - Account structures and constants
- **`errors.rs`** - Custom error definitions

## How It Works

1. **Creating Tweets**: Users create tweets with a topic (up to 32 bytes) and content (up to 500 bytes). The topic serves as part of the PDA seeds, allowing users to create multiple tweets.

2. **Adding Reactions**: Users can like or dislike tweets. Each reaction creates a new PDA account with seeds designed to prevent multiple reactions per user per tweet.

3. **Adding Comments**: Users can comment on tweets with content up to 500 bytes. The comment content hash is used in the PDA seeds for unique identification.

4. **Removing Reactions/Comments**: Users can remove their own reactions and comments, which closes the accounts and returns rent.

## Submission Process

1. Complete the **TODO sections** in the instruction files.
2. Test your solution using the provided test suite.
3. To submit your answers, push your changes to the **main** branch in **this** repository.

>[!IMPORTANT]
>**Only modify code where you find TODO comments.** Do not commit changes to other files as it can make the evaluation process more difficult.

### Deadline
The deadline for this task is **Wednesday, August 13th, at 23:59 UTC**.

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

[Account Model](https://solana.com/docs/core/accounts)

[Anchor Framework Documentation](https://www.anchor-lang.com/)

-----

### Need help?
>[!TIP]
>If you have any questions, feel free to reach out to us on [Discord](https://discord.gg/z3JVuZyFnp).
