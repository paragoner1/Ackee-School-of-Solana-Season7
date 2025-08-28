# Lesson 2: Rust Intro

## Lesson Overview
Course: School of Solana - Season 7 - July thru September, 2025  
Focus: Rust basics for Solana development  
Status: Completed

## 🎯 Lesson Resources
- **Rust Playground**: Online tool for testing Rust code (e.g., Hello World example) - https://play.rust-lang.org/
- **GitHub Repository**: Materials, tasks, slides, and code examples - https://github.com/Ackee-Blockchain/school-of-solana/tree/master/2.lesson
- **Docker Image**: For Rust/Solana environment setup

### **GitHub Repo Details (2.lesson)**
- **[README.md](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/2.lesson/README.md)**: Lesson intro, setup, and Rust fundamentals.
- **Tasks/Exercises**: Hands-on programming tasks for Rust basics.
- **Slides/Presentations**: Visuals on syntax, ownership, etc., complementing the video.
- **Code Examples**: Snippets for variables, functions, error handling, and project structure.

## 📋 Lesson Content

### **Introduction**
- Rust as the main language for Solana smart contracts/programs.
- Use playground for quick testing; Docker for full setup.

### **Rust Characteristics**
- Designed for performance, safety (concurrency/memory), similar to C/C++.
- Strongly typed, memory-safe without garbage collector, prevents null pointers/buffer overflows, safe concurrency.

### **Variables & Mutability**
- Variables immutable by default; use `mut` for mutable.
- Constants require type and value, immutable.
- Examples: `let x = 5;` vs. `let mut y = 10; y = 15;`

### **Data Types & Strings**
- Primitives: Integers (signed/unsigned, e.g., i32/u32), floats (f32/f64), booleans, characters.
- Arrays/Tuples: Fixed-size groups, tuples can mix types.
- Strings: Growable, heap-allocated; slices (`&str`) are immutable views.

### **Control Flow**
- If statements: Simple conditions, can assign values.
- Loops: `loop` (infinite until break), `while`, `for` (ranges/iterators).
- Match: Pattern matching, like switch, exhaustive.

### **Functions**
- Defined with `fn`, parameters typed, optional return type.
- Return explicitly or implicitly (no semicolon).
- Examples: Functions with/without returns.

### **Structures & Enums**
- Structs: Group related data (fields), like classes.
- Enums: Define variants, can hold data, useful for types like IP addresses.

### **Ownership & Move Semantics**
- Each value has one owner; ownership transfers on move.
- When owner goes out of scope, value is dropped.
- Rules: Single owner, dropped on scope exit.

### **References & Borrowing**
- References (`&` immutable, `&mut` mutable) allow access without ownership transfer.
- Prevent dangling references.

### **Lifetimes**
- Ensure references are valid as long as needed.
- Syntax: `'a` for shared lifetimes in functions.

### **Error Handling: Options & Results**
- Result: For recoverable errors (`Ok` value or `Err` message).
- Option: For optional values (`Some` or `None`).

### **Project Structure**
- Crates: Binary (executables) or library.
- Packages: Contain crates, defined in Cargo.toml.
- Modules: Organize code (`mod`), can be nested/public/private.

### **Hands-on: Hello World!**
- `cargo new hello_world` creates project.
- Edit `src/main.rs`, run `cargo run` to execute.

## 🔍 Key Concepts
- Ownership/Borrowing: Core to memory safety, prevents races.
- Strong Typing: Infer types, but strict at compile time.
- Error Handling: Explicit with Result/Option, no exceptions.
- Modularity: Crates/packages/modules for organized code.

## 💡 Learning Takeaways
- Rust emphasizes safety/performance, ideal for blockchain.
- Master ownership to avoid common errors.
- Use playground for quick experiments.

## ✅ Lesson Completion Checklist
- [x] Watch video
- [x] Explore Rust Playground
- [x] Review GitHub materials
- [x] Practice Hello World
- [x] Understand key syntax/concepts
- [x] Document notes

**Next Steps**: Apply to Solana programming model
