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
if [ ! -f "README.md" ] && [ ! -f "../README.md" ]; then
    echo "❌ Please run this script from the bug-hunting-workspace directory"
    exit 1
fi

echo "📁 Setting up directory structure..."
mkdir -p ../tools ../targets ../reports ../templates ../docs

# 1. Install Trident
log_step "Installing Trident (fuzzing tool)..."
if [ ! -d "../tools/trident" ]; then
    git clone https://github.com/solana-labs/trident.git ../tools/trident
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
cat > ../templates/bug-report-template.md << 'EOF'
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
cat > ../reports/tracking.csv << 'EOF'
Date,Protocol,Finding,Severity,Status,Payout,Platform
$(date '+%Y-%m-%d'),Example Protocol,Missing signer validation,Medium,Submitted,$0,Immunefi
EOF
log_success "Tracking spreadsheet created"

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
