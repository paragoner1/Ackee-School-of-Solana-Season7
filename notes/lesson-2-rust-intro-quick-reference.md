# Lesson 2: Rust Intro Quick Reference

## 🎯 Rust Characteristics
- Performance/safety like C/C++, strong typing, memory-safe (no GC), safe concurrency, prevents nulls/overflows/races.

## 🔧 Syntax Basics
- **Variables/Mutability**: `let x = 5;` (immutable), `let mut y = 10; y = 15;` (mutable), `const MAX: u32 = 100;`.
- **Data Types**: Integers (i32/u32), floats (f32/f64), bool, char; arrays `[1,2,3]`, tuples `(1, 2.0, true)`, strings `let mut s = String::from("hello"); s.push_str(", world");` & slices `&s[0..5]`.
- **Control Flow**:
  - If: `if x > 5 { ... } else { ... }`
  - Loops: `loop { ... break; }`, `while n > 0 { ... }`, `for i in 0..5 { ... }`
  - Match: `match num { 1 => ..., _ => ... }`
- **Functions**: `fn add(a: i32, b: i32) -> i32 { a + b }` (explicit) or `{ a + b }` (implicit).

## 🏗️ Custom Types
- **Structs**: `struct User { name: String, active: bool }` → `let u = User { name: String::from("Alice"), active: true };`
- **Enums**: `enum IpAddr { V4(u8,u8,u8,u8), V6(String) }` → `let v4 = IpAddr::V4(127,0,0,1);`

## 🔒 Ownership/References/Lifetimes
- **Ownership**: Single owner, moves transfer ownership, scope drop.
- **References**: `&` (immutable), `&mut` (mutable); no ownership change.
- **Lifetimes**: `'a` ensures refs valid (e.g., `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str { ... }`).

## 🚨 Error Handling
- **Result**: `fn divide(a: f64, b: f64) -> Result<f64, String> { if b == 0.0 { Err("Division by zero".to_string()) } else { Ok(a / b) } }`
- **Option**: `fn find(c: char, s: &str) -> Option<usize> { ... Some(index) ... None }`

## 🏗️ Project Structure
- **Crates**: Binary (`cargo new my_project`) or library (`cargo new my_lib --lib`).
- **Packages**: Cargo.toml for metadata/dependencies.
- **Modules**: `mod my_mod; pub fn func() { ... }` (public/private, nested).

## 🔧 Commands
- Create: `cargo new hello_world`
- Run: `cargo run`
- Build: `cargo build`

## 🔗 Resources
- Rust Playground: https://play.rust-lang.org/
- GitHub Repo: https://github.com/Ackee-Blockchain/school-of-solana/tree/master/2.lesson (tasks, slides, examples)
- Rust Book: https://doc.rust-lang.org/book/
