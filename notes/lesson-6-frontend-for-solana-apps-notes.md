# Lesson 6: Frontend for Solana Apps

## Lesson Overview
Course: School of Solana - Season 7 - July thru September, 2025  
Focus: Building full-stack dApps with Next.js frontend and Anchor backend  
Status: Completed

## 🎯 Lesson Resources
- **GitHub Repository**: https://github.com/Ackee-Blockchain/school-of-solana/tree/master/6.lesson
- **Example Project**: Ticket Registry dApp with Next.js frontend

### **GitHub Repo Details (6.lesson)**
- **README.md**: Lesson overview, setup, and full-stack dApp building guide.
- **Code Examples**: Anchor program (lib.rs, accounts, instructions), Next.js frontend (components, pages).
- **Tests**: Pre-prepared tests for program validation.

## 📋 Lesson Content

### **Full-Stack dApp Architecture**
Lesson 6 focuses on building complete dApps with both frontend and backend components:

#### **Backend (Anchor Program)**
- **Ticket Registry Program** - Event management and ticket sales
- **Three main instructions**: `initialize`, `buy`, `withdraw`
- **Two account types**: `Event` and `Ticket`
- **Complete business logic** for event management

### **Backend Development**
- Use `create-solana-dapp` to initialize project with Anchor backend and frontend template.
- **Program Structure**: Folders for instructions, state; lib.rs for entry points.
- **Accounts**:
  - Event: name (String, max 30), description (String, max 300), ticket_price (u64), available_tickets (u64), event_organizer (Pubkey), start_date (i64).
  - Ticket: event (Pubkey), buyer (Pubkey), price (u64).
- **Instructions**:
  - Initialize: Create event with validation (lengths, future date, available tickets >0).
  - Buy Ticket: Verify event not started/sold out, transfer lamports, update available tickets, create ticket account.
  - Withdraw: Transfer funds from event to organizer.

### **Deployment**
- Update Anchor.toml to Devnet.
- Airdrop SOL (via faucet or CLI).
- Run `anchor deploy` to deploy program.

#### **Frontend (Next.js Application)**
- **Modern React application** with TypeScript
- **Tailwind CSS** for styling
- **Gill wallet integration** for Solana wallet connectivity
- **Complete UI components** for interacting with the program

### **Frontend Development (Next.js)**
- Components: CreateEvent (form for event details), EventList (fetch/display events), BuyTicket button, Withdraw funds.
- Wallet integration: Use Wallet UI for signer/client.
- Forms: Handle inputs, convert date to timestamp.
- Transactions: Build instructions, sign/send, process with latest blockhash.

### **Project Structure**
```
ticket-registry/
├── anchor/                    # Solana program (Anchor)
│   ├── programs/ticketregistry/
│   │   ├── src/
│   │   │   ├── lib.rs         # Main program entry point
│   │   │   ├── state.rs       # Account structures
│   │   │   ├── errors.rs      # Custom error types
│   │   │   └── instructions/  # Program instructions
│   │   └── tests/             # Program tests
│   └── Anchor.toml            # Anchor configuration
├── src/                       # Next.js frontend
│   ├── app/                   # App router pages
│   ├── components/            # React components
│   │   ├── ticketregistry/    # dApp-specific components
│   │   ├── solana/            # Solana integration components
│   │   └── ui/                # Reusable UI components
│   └── lib/                   # Utility functions
└── package.json               # Frontend dependencies
```

---

## 🔍 Key Concepts

### **1. Full-Stack dApp Development**
- **Backend**: Solana program handles business logic and state
- **Frontend**: Next.js application provides user interface
- **Integration**: Frontend communicates with blockchain via wallet

### **2. Ticket Registry Business Logic**
```rust
// Event creation
pub fn initialize(ctx: Context<InitializeContext>, 
    name: String, 
    description: String, 
    ticket_price: u64, 
    available_tickets: u64, 
    start_date: i64) -> Result<()>

// Ticket purchase
pub fn buy(ctx: Context<BuyContext>) -> Result<()>

// Fund withdrawal
pub fn withdraw(ctx: Context<WithdrawContext>, amount: u64) -> Result<()>
```

### **3. Account Structures**
```rust
#[account]
pub struct Event {
    pub name: String,              // Event name (max 30 chars)
    pub description: String,       // Event description (max 300 chars)
    pub ticket_price: u64,         // Price per ticket in lamports
    pub available_tickets: u64,    // Number of tickets available
    pub event_organizer: Pubkey,   // Organizer's public key
    pub start_date: i64           // Event start timestamp
}

#[account]
pub struct Ticket {
    pub event: Pubkey,            // Associated event
    pub buyer: Pubkey,            // Ticket buyer
    pub price: u64               // Price paid for ticket
}
```

### **4. Frontend Integration Patterns**
- **Wallet Connection**: Using Gill wallet adapter
- **Program Interaction**: Anchor-generated client library
- **State Management**: React Query for data fetching
- **UI Components**: Modular, reusable components

### **5. Development Tools**
- **Create Solana dApp**: Template generator for full-stack dApps
- **Codama**: Client library generator for Anchor programs
- **Next.js**: React framework for frontend development
- **Tailwind CSS**: Utility-first CSS framework

### **Codama**
- Generate client library from IDL.
- Fix generated code (program ID, seeds).
- Use for building instructions in frontend.

---

## 💡 Learning Takeaways

### **Full-Stack Development Skills**
- **Complete dApp architecture** - From blockchain to user interface
- **Frontend-backend integration** - Seamless blockchain interaction
- **Modern web development** - Next.js, TypeScript, Tailwind CSS
- **Wallet integration** - User authentication and transaction signing

### **Business Logic Implementation**
- **Real-world application** - Event ticketing system
- **Complete user flows** - Event creation, ticket purchase, fund management
- **Error handling** - Both program and frontend error management
- **State management** - On-chain and frontend state synchronization

### **Development Best Practices**
- **Modular architecture** - Separated concerns between frontend and backend
- **Type safety** - TypeScript throughout the stack
- **Component reusability** - Modular UI components
- **Testing strategies** - Both program and frontend testing

---

## ✅ Lesson Completion Checklist
- [x] Review complete project structure
- [x] Understand full-stack dApp architecture
- [x] Analyze ticket registry business logic
- [x] Study frontend integration patterns
- [x] Document development tools and best practices
- [x] Create comprehensive notes and documentation

**Next Steps**: Move to final bonus lesson (Gaming on Solana)
