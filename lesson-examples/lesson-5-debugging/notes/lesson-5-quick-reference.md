# Lesson 5: Quick Reference Card

## 🚨 Common Errors & Quick Fixes

| Error | Cause | Quick Fix |
|-------|-------|-----------|
| `Signer verification failed` | Missing required signer | Add account to `.signers([user, data])` |
| `No prior credit` | Insufficient SOL balance | `await airdrop(connection, user.publicKey)` |
| `Account already in use` | Account already exists | Use `Keypair.generate()` for new account |
| `Account did not deserialize` | Missing discriminator bytes | Add 8 bytes: `space = 8 + actual_size` |
| `Constraint seeds` | PDA seed mismatch | Match exact order and values |
| `Program failed to complete` | Program panic/underflow | Add input validation with `require!()` |

## 🧪 Test Patterns

### Unit Test
```rust
#[test]
fn test_function() {
    assert_eq!(function(2), Some(8));
    assert_eq!(function(11), None);
}
```

### Integration Test
```typescript
it("test description", async () => {
    try {
        await program.methods.initialize().rpc();
    } catch (_err) {
        const err = anchor.AnchorError.parse(_err.logs);
        assert.strictEqual(err.error.errorCode.code, "ExpectedError");
    }
});
```

### On-chain Verification
```typescript
await program.methods.initialize().rpc();
let account = await program.account.myData.fetch(data.publicKey);
assert.deepEqual(account.authority, user.publicKey);
```

## 🔧 Essential Commands

```bash
# Run tests
anchor test

# Check balance
await connection.getBalance(user.publicKey)

# Airdrop SOL
await connection.requestAirdrop(address, 1000000000)

# Fetch account data
await program.account.myData.fetch(publicKey)

# Derive PDA
const [pda] = PublicKey.findProgramAddressSync([seed], program.programId);
```

## 📏 Space Calculation

```rust
// Always include 8 bytes for discriminator
space = 8 + actual_data_size

// Example: Pubkey (32) + u8 (1) = 33 bytes
space = 8 + 32 + 1 = 41 bytes
```

## 🎯 Debugging Checklist

1. ✅ Read error message carefully
2. ✅ Check all required signers
3. ✅ Verify account balances
4. ✅ Ensure accounts don't already exist
5. ✅ Validate space allocation (include discriminator)
6. ✅ Match PDA seeds exactly
7. ✅ Add input validation to prevent panics
8. ✅ Verify on-chain data after transactions

## 💡 Key Rules

- **Regular accounts must sign, PDAs don't**
- **Always airdrop SOL to test accounts**
- **Use new keypairs for multiple initializations**
- **Include 8 bytes for account discriminator**
- **PDA seeds must match exactly (order + values)**
- **Validate inputs before arithmetic operations**
- **Always verify on-chain state after transactions**
