[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/svk2qxeF)
![School of Solana](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/.banner/banner.png?raw=true)

Welcome to **Task 2** of the **School of Solana Season 7**.

## 📚Task 2
This task introduces you to the Rust programming language, which is used extensively in the Solana ecosystem. Understanding Rust is important for Solana development since most programs are written in this language.

You'll work on **two parts**: implementing geometric shapes with validation and trait implementations, then building a calculator with arithmetic operations and history tracking. The calculator includes overflow and underflow handling, which is important in blockchain programming. Both components cover core Rust concepts including **structs**, **enums**, **traits**, and **error handling**.

## Part 1: Shapes

Begin with this section to learn Rust fundamentals. Complete the implementation of methods marked with `todo!()` and implement the `Shape` trait for `Rectangle` and `Circle` structs. This covers input validation, error handling, and trait implementation.

## Part 2: Calculator

This section involves building a calculator with arithmetic operations. Complete all methods marked with `todo!()` to create a calculator that performs operations, maintains history, and handles overflow conditions.

## Project Structure

Your workspace contains these key files in the `src` directory:

- **`main.rs`** - Contains usage examples (no modifications needed)
- **`tests.rs`** - Test suite for validating your implementation  
- **`calculator.rs`** - Calculator implementation tasks
- **`shapes.rs`** - Shapes implementation tasks

## Submission Process

1. Complete the **Shapes** and **Calculator** implementation.
2. Test your solution with the provided test suite.
3. To submit your answers, push your changes to the **main** branch in **this** repository.

### Deadline
The deadline for this task is **Wednesday, July 30th, at 23:59 UTC**.

>[!CAUTION]
>Note that we will not accept submissions after the deadline.

## Evaluation Criteria

>[!IMPORTANT]
>Your submission must pass **100%** of the provided test suite in order to pass this task.

>[!NOTE]
>We account for potential floating-point precision issues in geometric calculations. If your mathematical formulas are correct but tests fail due to precision, we'll review your implementation manually.

## Getting Started

### Prerequisites
Install [Rust](https://www.rust-lang.org/tools/install) to begin development.

### Development Commands

**Build the project:**
```bash
cargo build
```

**Run the examples:**
```bash
cargo run
```

**Test your implementation:**
```bash
cargo test
```

### Hints and Useful Links
[Primitive Type i64](https://doc.rust-lang.org/std/primitive.i64.html)

[Traits](https://doc.rust-lang.org/book/ch10-02-traits.html)

[References and Borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html?highlight=borrow#references-and-borrowing)

[Structs](https://doc.rust-lang.org/book/ch05-01-defining-structs.html)

[Options](https://doc.rust-lang.org/std/option/)

-----

### Need help?
>[!TIP]
>If you have any questions, feel free to reach out to us on [Discord](https://discord.gg/z3JVuZyFnp).
