#!/bin/bash

# 🛠️ Bug Hunting Tools Setup Script
# Installs and configures all necessary tools

echo "🚀 Setting up Bug Hunting Tools..."
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to log progress
log_step() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Function to log success
log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to log warning
log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the bug-hunting-workspace directory"
    exit 1
fi

echo "📁 Setting up directory structure..."
mkdir -p tools targets reports templates docs

# 1. Install Trident
log_step "Installing Trident (fuzzing tool)..."
if [ ! -d "tools/trident" ]; then
    git clone https://github.com/solana-labs/trident.git tools/trident
    log_success "Trident cloned successfully"
else
    log_warning "Trident already exists, skipping..."
fi

# 2. Check VS Code Extension
log_step "Checking VS Code Extension..."
if [ -d "~/.cursor/extensions/ackeeblockchain.solana-0.1.2" ]; then
    log_success "VS Code Extension is installed"
else
    log_warning "VS Code Extension not found in expected location"
    echo "   Please ensure the Solana VS Code extension is installed"
fi

# 3. Create bug report template
log_step "Creating bug report template..."
cat > templates/bug-report-template.md << 'EOF'
# Bug Report Template

## Summary
Brief description of the vulnerability

## Severity
- [ ] Critical
- [ ] High
- [ ] Medium
- [ ] Low

## Description
Detailed description of the vulnerability

## Impact
What could an attacker do with this vulnerability?

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Proof of Concept
Code or transaction that demonstrates the vulnerability

## Recommended Fix
How should this be fixed?

## Additional Context
Any other relevant information
EOF
log_success "Bug report template created"

# 4. Create tracking spreadsheet
log_step "Creating tracking spreadsheet..."
cat > reports/tracking.csv << 'EOF'
Date,Protocol,Finding,Severity,Status,Payout,Platform
$(date '+%Y-%m-%d'),Example Protocol,Missing signer validation,Medium,Submitted,$0,Immunefi
EOF
log_success "Tracking spreadsheet created"

# 5. Create target finder script
log_step "Creating target finder script..."
cat > scripts/find-targets.sh << 'EOF'
#!/bin/bash

# 🎯 Target Finder Script
# Finds protocols to audit

echo "🎯 Finding audit targets..."
echo "=========================="

# GitHub search for Solana protocols
echo "📊 Searching GitHub for Solana protocols..."

# Simple DeFi protocols
echo "🔍 Simple DeFi Protocols:"
echo "  - Search: 'solana defi protocol anchor'"
echo "  - Filter: <100 stars, recent activity"
echo "  - Focus: Lending, DEX, staking"

# Token protocols
echo "🔍 Token Protocols:"
echo "  - Search: 'solana token program anchor'"
echo "  - Filter: <50 stars, simple functionality"
echo "  - Focus: SPL Token extensions"

# Governance protocols
echo "🔍 Governance Protocols:"
echo "  - Search: 'solana dao governance anchor'"
echo "  - Filter: <100 stars, voting mechanisms"
echo "  - Focus: Proposal systems"

echo ""
echo "📋 Manual Search URLs:"
echo "  https://github.com/search?q=solana+defi+protocol+anchor&type=repositories&s=updated&o=desc"
echo "  https://github.com/search?q=solana+token+program+anchor&type=repositories&s=updated&o=desc"
echo "  https://github.com/search?q=solana+dao+governance+anchor&type=repositories&s=updated&o=desc"
EOF
chmod +x scripts/find-targets.sh
log_success "Target finder script created"

# 6. Create start hunt script
log_step "Creating start hunt script..."
cat > scripts/start-hunt.sh << 'EOF'
#!/bin/bash

# 🚀 Start Hunting Script
# Initiates a bug hunting session

echo "🚀 Starting Bug Hunt Session..."
echo "==============================="

# Check if target is provided
if [ -z "$1" ]; then
    echo "❌ Please provide a target protocol"
    echo "Usage: ./scripts/start-hunt.sh [protocol-name]"
    exit 1
fi

TARGET=$1
TARGET_DIR="targets/$TARGET"

echo "🎯 Target: $TARGET"
echo "📁 Target directory: $TARGET_DIR"

# Create target directory
mkdir -p "$TARGET_DIR"
cd "$TARGET_DIR"

echo ""
echo "📋 Next Steps:"
echo "1. Clone the target protocol: git clone [repo-url] ."
echo "2. Open in Cursor: code ."
echo "3. Run VS Code extension scan"
echo "4. Save results to scan_results.txt"
echo "5. Run escalation scanner: ../../scripts/automated-escalation-scanner.sh"
echo "6. Use Cursor AI for deep analysis"
echo "7. Write and submit bug reports"
echo ""

echo "🎯 Happy hunting! 🚀"
EOF
chmod +x scripts/start-hunt.sh
log_success "Start hunt script created"

# 7. Create daily routine script
log_step "Creating daily routine script..."
cat > scripts/daily-routine.sh << 'EOF'
#!/bin/bash

# 📅 Daily Bug Hunting Routine
# Automated daily workflow

echo "📅 Daily Bug Hunting Routine"
echo "============================"

DATE=$(date '+%Y-%m-%d')
echo "📅 Date: $DATE"

echo ""
echo "🌅 Morning Tasks (2 hours):"
echo "1. Scan 2-3 new protocols with VS Code extension"
echo "2. Run Trident on 1 protocol"
echo "3. Document findings in tracking.csv"
echo "4. Prioritize by potential payout"

echo ""
echo "🌞 Afternoon Tasks (3 hours):"
echo "1. Write detailed bug reports"
echo "2. Use Cursor AI to enhance reports"
echo "3. Submit to bounty platforms"
echo "4. Follow up on submissions"

echo ""
echo "🌙 Evening Tasks (1 hour):"
echo "1. Learn from rejections"
echo "2. Improve methodology"
echo "3. Plan tomorrow's targets"
echo "4. Network in Discord communities"

echo ""
echo "📊 Today's Goals:"
echo "- Scan 3 protocols"
echo "- Submit 2 bug reports"
echo "- Network with 1 security researcher"
echo "- Learn 1 new vulnerability pattern"

echo ""
echo "🚀 Let's get hunting! 💰"
EOF
chmod +x scripts/daily-routine.sh
log_success "Daily routine script created"

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "📁 Workspace structure created:"
echo "  ├── tools/          # Trident and other tools"
echo "  ├── scripts/        # Automation scripts"
echo "  ├── targets/        # Protocols to audit"
echo "  ├── reports/        # Bug reports and tracking"
echo "  ├── templates/      # Report templates"
echo "  └── docs/           # Documentation"
echo ""
echo "🚀 Next Steps:"
echo "1. Run: ./scripts/find-targets.sh"
echo "2. Run: ./scripts/start-hunt.sh [protocol-name]"
echo "3. Run: ./scripts/daily-routine.sh"
echo ""
echo "🎯 Happy hunting! 🚀💰"
