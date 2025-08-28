# Lesson 1: Intro to Solana & Blockchain

## 📚 Lesson Overview
**Course**: School of Solana - Season 7 - July thru September, 2025  
**Focus**: Solana overview, history, architecture, innovations  
**Status**: ✅ Completed

## 🎯 Lesson Resources
- **YouTube Lessons**: Pre-recorded videos released every Wednesday
- **GitHub Repository**: Materials and tasks (scan QR code or link provided)
- **Docker Image**: For environment setup if needed
- **Solana Handbook**: Summary of key Solana concepts
- **AI Agent (Young Tolly)**: Discord bot in dev-help channel for questions on Solana/Anchor

### **GitHub Repo Details (1.lesson)**
- **[README.md](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/1.lesson/README.md)**: Course introduction, setup instructions, and overview of Solana fundamentals.
- **Tasks/Exercises**: Programming tasks to explore Solana basics (e.g., simple transactions, account interactions).
- **Slides/Presentations**: Visual aids covering architecture, PoH, Gulfstream, etc., complementing the video.
- **Code Examples**: Sample scripts for CLI usage, Git workflows, and basic Solana interactions.
- **Additional Materials**: Links to external resources like Solana docs; ties into video by providing hands-on practice for concepts discussed.

## 📋 Lesson Content

### **Introduction**
- Presented by Andre (Lead Auditor at Ackee) and Joseph (Co-founder/CEO)
- Ackee: Smart contract auditors, educational partners with Solana Foundation
- Course: Seventh cohort, focuses on Solana development from basics to full apps

### **What is This Course About?**
- Topics: Solana intro, Rust, Solana programming model (accounts, CPIs), best practices/debugging, security, frontend integration
- Not about: Trading/financial advice, advanced security (see Solana Auditors Bootcamp)

### **Prerequisites**
- Basic CLI experience (terminal usage)
- Git basics (clone, commit, push)
- Experience with another language (C/C++, Java, Python helpful)
- Basic blockchain knowledge (blocks, transactions)

### **Tasks & Materials**
- Programming tasks (mostly), some theory quizzes
- Community interaction on Discord
- Feedback: Developers/auditors available for questions
- Solana project: Build a full Solana smart contract + frontend

### **Solana Introduction**
- Founded 2017 by Anatoly Yakovenko (former Qualcomm engineer)
- Testnet 2018, Mainnet Beta March 2020
- Layer 1 blockchain, proof-of-stake, smart contract platform
- Current stats: Nakamoto coefficient ~22, 1,200-1,300 true TPS, 400ms block times, ~12s finality, 1,200+ validators, multiple clients (e.g., Jito, Firedancer) for decentralization

### **Solana Architecture**
- Decentralized, globally synchronized state machine
- Layers: Clients (apps/wallets), RPCs (transaction forwarding), Validators (block production/voting)
- Transaction flow: App → RPC → Validators → Leader (forwards via Gulfstream)
- Parallel processing: Scheduler orders transactions to avoid conflicts (based on mutable/read-only accounts)
- Accounts DB: Key-value store (public key → bytes); types include wallets, data accounts, executables
- Proof of History (PoH): Synchronization mechanism for transaction ordering (sequential creation, parallel validation)
- Turbine: Block propagation via neighborhood tree structure
- Gulfstream: Direct forwarding to leaders (no mempools), with stake-weighted QoS to prevent spam

### **Alpenglow (Upcoming Innovation)**
- Reduces finality to ~150ms, removes vote transactions
- No more Proof of History in consensus
- Rotor: Simplified Turbine (leader → relayers → validators)
- Volter: Aggregates votes off-chain; fast finality at 80% stake, slow at 66% over two rounds; includes BLS certificate in next block

## 🔍 Key Concepts
- Solana as a high-performance blockchain: Optimizes bandwidth/latency via innovations like PoH, Gulfstream, Turbine, Sealevel (parallel execution)
- Accounts: External storage (not internal to programs); mutable vs. read-only for parallelism
- Leader Schedule: Precomputed for epochs (~2 days), enables direct forwarding
- Stake-Weighted QoS: Prioritizes trusted validators to combat congestion/spam

## 💡 Learning Takeaways
- Solana prioritizes speed/scalability while maintaining decentralization
- Understanding architecture (validators, RPCs, parallel processing) is key to development
- Innovations like PoH solve ordering without traditional consensus overhead
- Alpenglow promises even faster finality, evolving Solana's design

## ✅ Lesson Completion Checklist
- [x] Watch introduction video
- [x] Review course structure and prerequisites
- [x] Explore resources (GitHub, Handbook, Discord AI)
- [x] Understand Solana basics and architecture
- [x] Learn about Alpenglow innovations
- [x] Document key concepts

**Next Steps**: Proceed to Rust introduction and set up development environment
