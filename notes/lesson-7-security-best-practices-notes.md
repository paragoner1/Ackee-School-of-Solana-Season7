# Lesson 7: Security Best Practices

## 📚 Lesson Overview
**Date**: [Current Date]  
**Focus**: Security best practices and common vulnerability vectors in Solana programs  
**Status**: ✅ Completed

## 🎯 Lesson Resources
- **Main Video**: https://www.youtube.com/watch?v=YnrT8PWgLNc
- **Supplemental Video**: https://www.youtube.com/watch?v=ZvON2fr9MX0
- **GitHub Repository**: https://github.com/Ackee-Blockchain/school-of-solana/tree/master/7.lesson
- **Solana Auditors Bootcamp CTF** (optional, not mandatory): [Link to CTF if available]
- **Additional Lesson**: Common Attack Vectors (linked in video description)

## 📋 Lesson Content

### **Main Video: Core Security Concepts**
- Introduction to Solana program security
- Importance of audits and secure coding
- Basic vulnerability patterns

#### **Security Hierarchy Pyramid**
The video presents security as a layered pyramid, building from foundational practices to advanced protections. Each level depends on the one below for effective security.

##### **Bottom Level: Code Quality**
- **Description**: Focus on writing clean, readable, and maintainable code using best practices like proper variable naming, modular structure, and consistent style. Remember that hacks are created by developers—avoid bias toward assuming your code is perfect.
- **Examples**: Use Rust idioms, avoid unnecessary complexity, implement error handling early.
- **Importance**: High-quality code reduces bugs and makes it easier to spot security issues during reviews. Poor code quality can hide vulnerabilities.

###### **Vulnerability Risks and Common Pitfalls**
- **Common Pitfalls in Smart Contract Development**: Issues like improper error handling, lack of input validation, and complex logic that leads to overlooked edge cases.
- **OWASP Top 10 for Smart Contracts**: References key risks such as injection flaws (e.g., unchecked CPI calls), broken access control (e.g., missing ownership checks), cryptographic failures (e.g., weak randomness), and vulnerable dependencies.
  - **Examples**: Failing to validate external calls (A04: Insecure Design) or using outdated libraries (A06: Vulnerable and Outdated Components).
  - **Importance**: Addressing these early prevents exploits; the video highlights how many Solana hacks stem from these foundational issues.

###### **Security by Design**
- **Description**: Intentionally incorporate security into the program's architecture from the outset, designing systems that are inherently secure rather than adding security as an afterthought.
- **Examples**: Using modular components with clear interfaces, implementing least privilege principles, and designing for auditability.
- **Importance**: Builds resilience into the core structure, making it harder for vulnerabilities to emerge later.

###### **Proactive Approach: Prevent Rather Than React**
- **Description**: Adopt measures to anticipate and mitigate risks before they become exploits, such as threat modeling and secure coding standards.
- **Examples**: Conducting threat assessments during design and using linters/static analyzers to catch issues early.
- **Importance**: Shifts focus from reactive patching to preventive design, reducing the likelihood and impact of attacks.

###### **Security Starts Early: Build with Security from Day One**
- **Description**: Integrate security considerations into every phase of development, starting from initial planning and requirements gathering.
- **Examples**: Including security requirements in user stories, performing security code reviews in pull requests, and educating the team on secure practices.
- **Importance**: Establishes a security-first mindset, ensuring that security is not bolted on but woven into the development process.

##### **Next Level: Testing (Integration Testing)**
- **Description**: Implement unit tests, integration tests, and end-to-end testing to verify program behavior under normal and edge cases. Think like a hacker to break the application.
- **Examples**: Use Anchor's testing framework for simulating transactions, testing CPI calls, and validating account states.
- **Importance**: Catches logical errors and basic vulnerabilities before deployment. Integration testing ensures components work together securely.

###### **Blue Teaming**
- **Description**: Simulate monitoring, detecting, and responding to attacks (blue team responsibilities).
- **Examples**: Test detection speed, response times, and communication strategies.
- **Importance**: Ensures the team can identify and mitigate issues quickly, including how to inform users/community.

###### **Security Regression Testing**
- **Description**: Retest fixed issues to ensure they are resolved correctly without introducing new vulnerabilities.
- **Examples**: After patching a bug, run tests to verify the fix and check for regressions.
- **Importance**: Prevents partial fixes or new issues from fixes.

###### **Social Engineering Testing**
- **Description**: Educate and test team members on resisting social engineering attacks like phishing or USB drops.
- **Examples**: Simulate phishing emails or unknown USB scenarios to gauge responses.
- **Importance**: Humans are often the weakest link; proactive education prevents breaches.

##### **Next Level: Fuzzing**
- **Description**: Use automated tools to input random or malformed data to discover unexpected behaviors or crashes. Approaches include blackbox (no system knowledge), whitebox (full internal knowledge), graybox (partial knowledge, like interface awareness), and coverage-guided (monitors code coverage to guide inputs).
- **Examples**: Tools like cargo-fuzz or custom fuzzers to test arithmetic operations, input validation, and deserialization; Trident uses coverage-guided graybox for Solana programs.
- **Importance**: Uncovers hard-to-find issues like overflows or buffer errors that standard tests might miss, simulating real-world attacks.

###### **Types of Fuzzing Methods**
- **Mutation-based Fuzzing**: Starts with valid inputs and applies random changes (mutations) to generate test cases.
  - **Examples**: Using AFL or libFuzzer to mutate transaction data or account states in Solana programs.
  - **Importance**: Effective for finding edge cases in existing code paths by slightly altering known good inputs.
- **Generation-based Fuzzing**: Creates entirely new inputs based on a model or grammar of the expected data format.
  - **Examples**: Defining a grammar for Solana instruction data and generating random but structurally valid inputs.
  - **Importance**: Useful for testing complex data structures and ensuring robustness against unexpected formats.
- **Property-based Fuzzing**: Combines fuzzing with property testing, where you define invariants that should always hold.
  - **Examples**: Using libraries like proptest to generate arbitrary inputs while checking properties like "no overflows in calculations".
  - **Importance**: Helps verify high-level properties and invariants in the code, catching logical errors.
- **Coverage-guided Fuzzing**: Uses feedback from code coverage to guide the generation of new test cases towards unexplored paths.
  - **Examples**: cargo-fuzz with instrumentation to prioritize inputs that increase code coverage.
  - **Importance**: Maximizes efficiency by focusing on uncovered code, leading to better vulnerability discovery.

##### **Top Level: Audits**
- **Description**: Professional third-party reviews or self-audits to identify sophisticated vulnerabilities and ensure compliance with security standards.
- **Examples**: Engage firms like Ackee Blockchain for code reviews, or use checklists for self-audits focusing on common Solana pitfalls.
- **Importance**: Provides expert validation, catches issues overlooked in earlier levels, and is crucial for production deployments handling real assets.

###### **Developer Perspective**
- **Structure**: Organize code clearly for easy navigation.
- **Documentation**: Document design, code, environment, and components to aid understanding.
- **Uniform Scope**: Avoid changing the audit scope mid-process.
- **Importance**: Prepares the code for efficient auditing and reduces bias.

###### **Auditor Perspective**
- **Understand the System**: Review the entire architecture, including offchain parts and dependencies.
- **Monitoring Progress**: Track audit consistency without jumping between parts.
- **Architecture Review**: Assess fairness, centralization, authority control, and user fund risks.
- **Outer Components**: Examine dependencies and external elements.
- **Manual Review**: Conduct shallow-to-deep code analysis, assessing impact and likelihood.
- **Development/Deployment Practices**: Check peer reviews, testing, and change management.
- **Risk Management**: Verify previous issues are resolved correctly.
- **Communicate Findings**: Report critical/high issues promptly and responsibly, without leaks.
- **Review Incident Response**: Evaluate monitoring, detection, reaction speed, and communication.

### **Supplemental Video: Common Vulnerability Vectors**
- Detailed attack vectors
- Real-world examples of exploits
- Mitigation strategies

**Note**: The video mentions creating a public database of these attack vector examples in the Solana Auditors Bootcamp repository. Examples are being updated, and contributions via pull requests are encouraged for new vectors.

#### **Signer Authorization**
- **Description**: Signing a transaction is not sufficient; the signer must be authorized to perform the action.
- **Attack Vector**: Unauthorized users can sign and execute actions meant for specific users, leading to unauthorized access.
- **Mitigation/Protection**: Use Anchor's signer constraint or include the signer in PDA seeds to ensure correspondence.
- **Examples**: Checking if the signer matches an authority field in an account.

#### **Arbitrary CPI**
- **Description**: Cross-Program Invocations (CPI) without verifying the target program ID.
- **Attack Vector**: Attacker substitutes a malicious program that skips checks, allowing unauthorized actions (e.g., similar to the Wormhole exploit).
- **Mitigation/Protection**: Use Anchor's Program or Interface account types to verify the program ID and ensure it's executable.
- **Examples**: Implementing custom ID traits for non-standard programs.

#### **Duplicate Mutable Accounts**
- **Description**: Instructions expecting two distinct mutable accounts of the same type without checking for duplicates.
- **Attack Vector**: Attacker provides the same account twice, leading to unexpected behavior (e.g., no net change in balances during transfers).
- **Mitigation/Protection**: Add constraints to ensure account addresses are different.
- **Examples**: In a trade scenario, subtracting and adding to the same account results in no change but may bypass fees or logic.

#### **Ownership Check**
- **Description**: Failing to verify that an account is owned by the expected program.
- **Attack Vector**: Attacker provides a malicious account mimicking the structure, leading to reading outdated or fake data.
- **Mitigation/Protection**: Use Anchor's Account type, which checks ownership, discriminator, and deserializes data. Avoid unchecked AccountInfo where possible.
- **Examples**: Token accounts without ownership checks can be faked to provide incorrect balances.

#### **PDA Privileges**
- **Description**: Program-Derived Addresses (PDAs) acting as authorities without proper access controls.
- **Attack Vector**: Attacker misuses PDA privileges to transfer assets (e.g., in escrow scenarios, draining vaults).
- **Mitigation/Protection**: Ensure instructions invoking PDA-signed CPIs are authorized; use new_with_signer for PDA signing.
- **Examples**: Escrow programs where PDAs control vaults must restrict who can invoke withdrawal logic.

#### **Revival Attack**
- **Description**: Incorrectly closing accounts by only transferring lamports without full closure.
- **Attack Vector**: Attacker adds lamports to "closed" accounts, reviving them and enabling denial-of-service or reuse.
- **Mitigation/Protection**: Use Anchor's close constraint, which assigns to System Program, transfers lamports, and reallocates data to zero.
- **Examples**: Accounts left with lamports can be rent-exempt and persist, blocking reinitialization.

#### **Re-Initialization Attack**
- **Description**: Using init_if_needed without preventing reinitialization of existing accounts.
- **Attack Vector**: Attacker reinitializes accounts (e.g., global configs) to default states, resetting values.
- **Mitigation/Protection**: Avoid init_if_needed where possible; if used, add checks to prevent reinitialization (e.g., check if already initialized).
- **Examples**: Global configs reset to defaults, disrupting program parameters.

#### **Account Reloading**
- **Description**: Failing to reload accounts after CPI modifications.
- **Attack Vector**: Reading outdated data post-CPI, leading to logic errors based on stale values.
- **Mitigation/Protection**: Use account.reload() after CPI to get updated data.
- **Examples**: Token balances not reloaded after transfers, causing incorrect post-transfer checks.

#### **Type Cosplay**
- **Description**: Deserializing accounts without checking discriminators, allowing type mismatches.
- **Attack Vector**: Attacker provides a different account type that deserializes successfully, leading to modifying unintended accounts.
- **Mitigation/Protection**: Use Anchor's Account type for discriminator, ownership, and deserialization checks.
- **Examples**: Accounts of same length but different structures deserialized interchangeably without checks.

#### **More Sophisticated Attack Vectors**
- **Phishing**: Creating fake websites/emails to trick users into signing malicious transactions.
  - **Attack Vector**: Users transfer assets to attackers via deceptive interfaces.
  - **Mitigation/Protection**: Use hardware wallets, verify URLs, and avoid signing untrusted transactions.
- **Private Key Leakage**: Unintentional exposure of private keys (e.g., in GitHub repos or via malware).
  - **Attack Vector**: Attackers monitor for leaked keys and drain accounts.
  - **Mitigation/Protection**: Never commit keys, use secure storage, and monitor repositories.
- **Sandwich Attacks**: Front-running and back-running transactions for profit (part of MEV).
  - **Attack Vector**: Manipulating prices around large trades (e.g., on DEXes).
  - **Mitigation/Protection**: Use private mempools or mechanisms like Jito (though monitor for malicious validators).
- **Front Running (including Initialization)**: Executing transactions ahead of others, like initializing configs before the deployer.
  - **Attack Vector**: Denial-of-service by claiming PDAs or exploiting thresholds.
  - **Mitigation/Protection**: Use program metadata (e.g., upgrade authority from ProgramData) to restrict initialization.
- **Loss of Precision**: Integer arithmetic discarding decimals or floating-point inaccuracies.
  - **Attack Vector**: Unexpected results in calculations (e.g., division yielding zero).
  - **Mitigation/Protection**: Use checked arithmetic and be aware of floating-point limitations.
- **Overflow/Underflow**: Arithmetic operations exceeding integer bounds.
  - **Attack Vector**: Panics or wraps causing denial-of-service or exploits (less common with Rust flags).
  - **Mitigation/Protection**: Enable overflow checks and use checked operations; handle panics gracefully.

### **Key Security Topics**
1. **Signer Checks** - Ensure accounts are signed when required
2. **PDA Validation** - Proper seed and bump validation
3. **Arithmetic Operations** - Prevent overflows/underflows
4. **Reentrancy** - Guard against recursive calls
5. **Account Ownership** - Verify program ownership
6. **Data Validation** - Check input sizes and formats

## 🔍 Key Concepts

### **Common Vulnerabilities**
- Missing signer checks leading to unauthorized actions
- Improper PDA derivation allowing account takeovers
- Integer overflows in calculations
- Reentrancy attacks via CPI

### **Best Practices**
- Use Anchor's validation macros
- Implement comprehensive tests
- Conduct security audits
- Follow secure development lifecycle

## 💡 Learning Takeaways
- Security is paramount in blockchain development
- Prevention is better than cure
- Understand attack vectors to build robust programs

## ✅ Lesson Completion Checklist
- [x] Watch main video
- [x] Watch supplemental video
- [x] Review common vulnerabilities
- [x] Study mitigation strategies
- [x] Document key concepts

**Next Steps**: Apply security practices to existing projects
