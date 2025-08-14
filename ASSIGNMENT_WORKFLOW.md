# Assignment Workflow Guide

## 🚀 Quick Start for New Assignments

### Step 1: Clone and Setup
```bash
# 1. Clone the assignment repository
git clone <assignment-url>
cd <assignment-directory>

# 2. ALWAYS install dependencies first
yarn install

# 3. Build the program
anchor build

# 4. Run tests to see current status
anchor test
```

### Step 2: Development Workflow
```bash
# Make changes to your code
# Then test frequently:
anchor test

# If you need to reset and start fresh:
anchor clean
anchor build
anchor test
```

## 🔧 Common Issues and Solutions

### Issue: "ts-mocha not found"
**Solution:** Always run `yarn install` first in new assignment directories.

### Issue: "AccountDidNotDeserialize"
**Solution:** Check that your account structures match the expected format.

### Issue: "ConstraintSeeds" errors
**Solution:** Verify your PDA seeds match the test expectations.

### Issue: Build errors
**Solution:** 
```bash
anchor clean
anchor build
```

## 📋 Pre-Submission Checklist

- [ ] All tests pass: `anchor test`
- [ ] No compilation warnings
- [ ] Code follows assignment requirements
- [ ] All TODO sections completed
- [ ] Proper error handling implemented

## 🎯 Best Practices

1. **Always install dependencies first** - Never skip `yarn install`
2. **Test frequently** - Run `anchor test` after each major change
3. **Read the README** - Understand the assignment requirements
4. **Check test files** - They show expected behavior and seed structures
5. **Use proper error handling** - Implement all required error types

## 📁 Project Structure Understanding

- `programs/` - Your Solana program code
- `tests/` - Test files (study these for requirements)
- `Anchor.toml` - Project configuration
- `package.json` - Dependencies (always run `yarn install`)

## 🚨 Emergency Recovery

If you accidentally delete or corrupt your assignment:
1. Check your GitHub account for the original repository
2. Re-clone from the assignment URL
3. Follow the setup steps above
4. If lost, contact your instructor for the assignment link

---
*Created to prevent future assignment setup issues*
