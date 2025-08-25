# Lesson 5: Best Development Practices and Debugging

## 📚 Lesson Overview
**Date**: [Current Date]  
**Focus**: Debugging common Solana errors and testing best practices  
**Status**: ✅ Completed

## 🎯 Key Learning Objectives
- Understand different types of tests (Unit, Integration, On-chain verification)
- Master debugging of 6 common Solana errors
- Learn best practices for comprehensive testing
- Develop systematic error diagnosis skills

---

## 🧪 Types of Tests

### Unit Tests
**Purpose**: Test individual components in isolation

**Syntax Breakdown**:
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_math_function() {
        // Happy path - normal successful case
        assert_eq!(math_function(2), Some(8));
        
        // Edge case - boundary condition
        assert_eq!(math_function(10), Some(40));
        
        // Error case - input outside valid range
        assert_eq!(math_function(11), None);
    }
}
```

**Key Concepts**:
- `#[cfg(test)]` - Conditional compilation for tests only
- `use super::*` - Import everything from parent module
- `#[test]` - Marks function as a test
- `assert_eq!(actual, expected)` - Compares values for equality

**Use Cases**:
- Boundary conditions (min/max values)
- Basic functionality verification
- Error handling validation

### Integration Tests
**Purpose**: Test interactions between multiple components

**Syntax Breakdown**:
```typescript
it("Cannot initialize with incorrect data account!", async () => {
    const bad_data = Keypair.generate();

    try {
        await program.methods
            .initialize(10)
            .accountsStrict({
                user: user.publicKey,
                data: bad_data.publicKey,  // Wrong account!
                systemProgram: SystemProgram.programId,
            })
            .signers([user])
            .rpc();
    } catch (_err) {
        const err = anchor.AnchorError.parse(_err.logs);
        assert.strictEqual(err.error.errorCode.code, "ConstraintSeeds");
    }
});
```

**Key Concepts**:
- `it()` - Mocha test function
- `async () => {}` - Async arrow function for blockchain calls
- `try/catch` - Error handling for expected failures
- `anchor.AnchorError.parse()` - Parse error logs into structured format

**Use Cases**:
- Confirming program behavior across multiple accounts
- Testing interactions with external programs
- Validating error conditions

### On-chain Data Fetching
**Purpose**: Verify actual blockchain state after transactions

**Syntax Breakdown**:
```typescript
// Send transaction
await program.methods.initialize().rpc();

// Fetch and verify on-chain data
let dataAccount = await program.account.myData.fetch(data.publicKey);
assert.deepEqual(dataAccount.authority, user.publicKey);
assert.strictEqual(dataAccount.counter, 0);
```

**Key Concepts**:
- `program.account.myData.fetch()` - Retrieve account data from blockchain
- `assert.deepEqual()` - Deep comparison of objects
- `assert.strictEqual()` - Strict comparison (exact match)

**Why This Matters**:
- Transactions can succeed but store wrong data
- Ensures data integrity on-chain
- Industry best practice for production applications

---

## 🚨 Common Errors & Debugging

### 1. Signer Verification Failed

**Error**: `Signer verification failed`

**Cause**: Required signer has not signed the transaction

**Problem Code**:
```typescript
.signers([user]) // Missing data signer!
```

**Solution**:
```typescript
.signers([user, data]) // Both accounts must sign
```

**Key Rule**: Regular accounts must sign, PDAs are signed by the program

### 2. No Prior Credit

**Error**: `No prior credit`

**Cause**: Insufficient SOL balance for transaction costs

**Problem Code**:
```typescript
// User account has 0 SOL
await connection.getBalance(user.publicKey) // Returns 0
```

**Solution**:
```typescript
before("prepare", async () => {
    await airdrop(connection, user.publicKey);
});

async function airdrop(connection: any, address: any, amount = 1000000000) {
    await connection.confirmTransaction(
        await connection.requestAirdrop(address, amount),
        "confirmed"
    );
}
```

**Key Rule**: Always airdrop SOL to test accounts (1 SOL = 1,000,000,000 lamports)

### 3. Account Already In Use

**Error**: `Account already in use`

**Cause**: Trying to initialize an account that already exists

**Problem Code**:
```typescript
// First transaction succeeds
const tx = await program.methods.initialize().rpc();

// Second transaction fails - same account!
const repeat_tx = await program.methods.initialize().rpc();
```

**Solution**:
```typescript
const data2 = Keypair.generate(); // New keypair

const repeat_tx = await program.methods
    .initialize()
    .accountsStrict({
        user: user.publicKey,
        data: data2.publicKey, // Use new account
        systemProgram: SystemProgram.programId,
    })
    .signers([user, data2])
    .rpc();
```

**Key Rule**: Each account can only be initialized once

### 4. Account Did Not Deserialize

**Error**: `Account did not deserialize`

**Cause**: Incorrect account space allocation (missing discriminator)

**Problem Code**:
```rust
#[account(init,
    space = 32 + 1,  // Missing 8 bytes for discriminator!
    payer = user,
)]
data: Account<'info, MyData>,
```

**Solution**:
```rust
#[account(init,
    space = 8 + 32 + 1,  // 8 bytes discriminator + actual data
    payer = user,
)]
data: Account<'info, MyData>,
```

**Key Rule**: All Anchor accounts need 8-byte discriminator (space = 8 + actual_data_size)

### 5. Constraint Seeds

**Error**: `Constraint seeds`

**Cause**: PDA seeds don't match between program and client

**Problem Code**:
```rust
// Program expects
seeds = [b"data1", b"data2"]
```

```typescript
// Test uses wrong seeds
const option1 = PublicKey.findProgramAddressSync(
    [Buffer.from("data"), Buffer.from("data2")], // Wrong values
    program.programId
)[0];

const option2 = PublicKey.findProgramAddressSync(
    [Buffer.from("data2"), Buffer.from("data1")], // Wrong order
    program.programId
)[0];
```

**Solution**:
```typescript
const correctPda = PublicKey.findProgramAddressSync(
    [Buffer.from("data1"), Buffer.from("data2")], // Exact match
    program.programId
)[0];
```

**Key Rule**: PDA seeds must match exactly (order and values matter)

### 6. Program Failed To Complete

**Error**: `Program failed to complete`

**Cause**: Program panic or unhandled condition (often arithmetic underflow)

**Problem Code**:
```rust
pub fn initialize(ctx: Context<Initialize>, count: u8) -> Result<()> {
    let data = &mut ctx.accounts.data;
    data.authority = ctx.accounts.user.key();
    data.counter = 10 - count; // Underflow when count > 10!
    Ok(())
}
```

**Solution**:
```rust
// Add validation
require!(count <= 10, MyError::InvalidInstructionData);

pub fn initialize(ctx: Context<Initialize>, count: u8) -> Result<()> {
    let data = &mut ctx.accounts.data;
    data.authority = ctx.accounts.user.key();
    data.counter = 10 - count; // Safe now
    Ok(())
}

#[error_code]
pub enum MyError {
    #[msg("Invalid instruction data")]
    InvalidInstructionData,
}
```

**Key Rule**: Always validate inputs and use custom errors for meaningful messages

---

## 🎯 Debugging Workflow

### Systematic Approach
1. **Read the error message** - Often contains the specific issue
2. **Check signers** - Ensure all required accounts are signing
3. **Verify balances** - Confirm accounts have sufficient SOL
4. **Check account existence** - Don't initialize existing accounts
5. **Validate space allocation** - Include discriminator bytes
6. **Verify PDA seeds** - Match exactly between program and client
7. **Add input validation** - Prevent panics with proper error handling

### Error Message Patterns
- **"Signer verification failed"** → Missing required signer
- **"No prior credit"** → Insufficient SOL balance
- **"Account already in use"** → Account already exists
- **"Account did not deserialize"** → Incorrect space allocation
- **"Constraint seeds"** → PDA seed mismatch
- **"Program failed to complete"** → Program panic (check arithmetic)

---

## 🏆 Best Practices Summary

### Testing Best Practices
1. **Always use on-chain verification** - Don't just check transaction success
2. **Test both happy path and error cases** - Cover all scenarios
3. **Use descriptive test names** - Make failures easy to understand
4. **Airdrop SOL to test accounts** - Ensure sufficient balance
5. **Use new keypairs for multiple tests** - Avoid account conflicts

### Development Best Practices
1. **Validate all inputs** - Prevent panics with proper error handling
2. **Use custom error types** - Provide meaningful error messages
3. **Include discriminator in space calculations** - Always add 8 bytes
4. **Match PDA seeds exactly** - Order and values matter
5. **Test with real transactions** - Integration tests are essential

### Debugging Best Practices
1. **Start with the error message** - It often points to the issue
2. **Check the most common causes first** - Use systematic approach
3. **Verify on-chain state** - Don't assume transaction success means correct data
4. **Use logging and assertions** - Add debug information
5. **Test incrementally** - Fix one issue at a time

---

## 📝 Personal Notes & Takeaways

### Key Insights
- **On-chain verification is crucial** - Most projects skip this but it's essential
- **Error messages are often specific** - Learn to read them carefully
- **Systematic debugging saves time** - Follow a consistent approach
- **Testing is investment** - Good tests prevent production bugs

### Common Pitfalls to Avoid
- Forgetting to include signers for regular accounts
- Not airdropping SOL to test accounts
- Reusing keypairs in multiple tests
- Missing discriminator bytes in space calculations
- Mismatching PDA seeds between program and client
- Not validating inputs before arithmetic operations

### Tools & Commands to Remember
- `anchor test` - Run test suite
- `connection.getBalance()` - Check account balance
- `connection.requestAirdrop()` - Add SOL to account
- `program.account.myData.fetch()` - Fetch on-chain data
- `anchor.AnchorError.parse()` - Parse error logs
- `PublicKey.findProgramAddressSync()` - Derive PDAs

---

## 🔗 Related Resources
- [Anchor Testing Documentation](https://www.anchor-lang.com/docs/testing)
- [Solana Error Codes](https://docs.solana.com/developing/programming-model/transactions#transaction-error-codes)
- [PDA Derivation Guide](https://docs.solana.com/developing/programming-model/calling-between-programs#program-derived-addresses)

---

## ✅ Lesson Completion Checklist
- [x] Understand unit test syntax and concepts
- [x] Master integration test patterns
- [x] Learn on-chain data fetching importance
- [x] Debug all 6 common error types
- [x] Practice systematic debugging approach
- [x] Document best practices and takeaways
- [x] Create comprehensive notes for future reference

**Next Steps**: Move to Lesson 6 (Bonus Lesson 1)
