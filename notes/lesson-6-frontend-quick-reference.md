# Lesson 6: Frontend Development Quick Reference

## 🎯 Full-Stack dApp Architecture

### **Project Structure**
```
ticket-registry/
├── anchor/                    # Solana program
│   ├── programs/ticketregistry/
│   │   ├── src/lib.rs         # Program entry point
│   │   ├── src/state.rs       # Account structures
│   │   └── src/instructions/  # Program logic
│   └── Anchor.toml            # Configuration
├── src/                       # Next.js frontend
│   ├── app/                   # Pages
│   ├── components/            # React components
│   └── lib/                   # Utilities
└── package.json               # Dependencies
```

## 🔧 Development Commands

### **Backend (Anchor)**
```bash
# Setup program
pnpm run setup

# Build program
pnpm anchor-build

# Start local validator
pnpm anchor-localnet

# Run tests
pnpm anchor-test

# Deploy to devnet
pnpm anchor deploy --provider.cluster devnet
```

### **Frontend (Next.js)**
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 🏗️ Program Instructions

### **Initialize Event**
```rust
pub fn initialize(ctx: Context<InitializeContext>, 
    name: String, 
    description: String, 
    ticket_price: u64, 
    available_tickets: u64, 
    start_date: i64) -> Result<()>
```

### **Buy Ticket**
```rust
pub fn buy(ctx: Context<BuyContext>) -> Result<()>
```

### **Withdraw Funds**
```rust
pub fn withdraw(ctx: Context<WithdrawContext>, amount: u64) -> Result<()>
```

## 📦 Account Structures

### **Event Account**
```rust
#[account]
pub struct Event {
    pub name: String,              // Max 30 chars
    pub description: String,       // Max 300 chars
    pub ticket_price: u64,         // Price in lamports
    pub available_tickets: u64,    // Tickets remaining
    pub event_organizer: Pubkey,   // Organizer address
    pub start_date: i64           // Event timestamp
}
```

### **Ticket Account**
```rust
#[account]
pub struct Ticket {
    pub event: Pubkey,            // Associated event
    pub buyer: Pubkey,            // Ticket holder
    pub price: u64               // Price paid
}
```

## 🎨 Frontend Components

### **Key Component Categories**
- **`ticketregistry/`** - dApp-specific components
- **`solana/`** - Wallet and blockchain integration
- **`ui/`** - Reusable UI components
- **`dashboard/`** - User interface layouts

### **Essential Components**
- **Wallet Connection** - User authentication
- **Event Management** - Create and manage events
- **Ticket Purchase** - Buy tickets interface
- **Transaction Status** - Show transaction progress

## 🔗 Integration Patterns

### **Wallet Connection**
```typescript
// Using Gill wallet adapter
import { useWallet } from '@solana/wallet-adapter-react';

const { publicKey, connect, disconnect } = useWallet();
```

### **Program Interaction**
```typescript
// Using Anchor-generated client
import { useProgram } from './use-program';

const { program } = useProgram();
const tx = await program.methods.initialize(
    name, description, price, tickets, startDate
).rpc();
```

### **State Management**
```typescript
// Using React Query for data fetching
import { useQuery } from '@tanstack/react-query';

const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
});
```

## 🛠️ Development Tools

### **Create Solana dApp**
```bash
# Create new dApp template
pnpm create solana-dapp@latest -t gh:solana-foundation/templates/templates/ticket-registry
```

### **Codama (Client Generator)**
```bash
# Generate TypeScript client
npx codama generate
```

### **Key Dependencies**
```json
{
  "dependencies": {
    "@solana/wallet-adapter-react": "^0.15.35",
    "@solana/web3.js": "^1.87.6",
    "@coral-xyz/anchor": "^0.29.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "tailwindcss": "^3.3.0"
  }
}
```

## 🎯 User Flows

### **Event Creation Flow**
1. **Connect wallet** - User authenticates
2. **Fill event details** - Name, description, price, tickets
3. **Submit transaction** - Create event on blockchain
4. **Confirmation** - Show success/error status

### **Ticket Purchase Flow**
1. **Browse events** - View available events
2. **Select event** - Choose event to attend
3. **Purchase ticket** - Pay and receive ticket
4. **Confirmation** - Ticket ownership confirmed

### **Fund Withdrawal Flow**
1. **Event organizer** - Only organizer can withdraw
2. **Specify amount** - How much to withdraw
3. **Submit transaction** - Transfer funds
4. **Confirmation** - Withdrawal completed

## 🚨 Error Handling

### **Frontend Error Patterns**
```typescript
try {
    const tx = await program.methods.buy().rpc();
    // Success handling
} catch (error) {
    // Error handling
    console.error('Transaction failed:', error);
}
```

### **Common Error Types**
- **Wallet not connected** - User needs to connect wallet
- **Insufficient balance** - Not enough SOL for transaction
- **Invalid input** - Form validation errors
- **Transaction failed** - Blockchain transaction errors

## 💡 Best Practices

### **Frontend Development**
- **Type safety** - Use TypeScript throughout
- **Component modularity** - Reusable, focused components
- **Error boundaries** - Graceful error handling
- **Loading states** - Show progress during transactions

### **Backend Integration**
- **Client generation** - Use Codama for type-safe clients
- **Transaction confirmation** - Wait for blockchain confirmation
- **State synchronization** - Keep frontend in sync with blockchain
- **Error parsing** - Handle Anchor errors properly

### **User Experience**
- **Wallet connection** - Clear wallet connection flow
- **Transaction feedback** - Show transaction status
- **Error messages** - User-friendly error descriptions
- **Loading indicators** - Visual feedback during operations

## 🔗 Resources
- [Create Solana dApp](https://github.com/solana-developers/create-solana-dapp)
- [Codama](https://github.com/codama-idl/codama)
- [Gill Wallet](https://gill.site/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
