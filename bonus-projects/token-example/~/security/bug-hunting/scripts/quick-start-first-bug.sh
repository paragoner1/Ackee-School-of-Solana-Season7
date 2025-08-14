#!/bin/bash

# 🎯 Quick Start: Your First Bug Hunt
# Gets you from zero to your first target in minutes

echo "🎯 Quick Start: Your First Bug Hunt"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Function to log section
log_section() {
    echo -e "${PURPLE}📋 $1${NC}"
    echo "============================="
}

# Function to highlight success
highlight_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to highlight info
highlight_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

echo ""
log_section "Step 1: Find Your First Target"

# Run target finder
echo "🔍 Searching for promising protocols..."
./scripts/find-targets.sh

echo ""
echo "📋 Manual Search URLs (open in browser):"
echo "   https://github.com/search?q=solana+defi+protocol+anchor+language:rust&type=repositories&s=updated&o=desc"
echo "   https://github.com/search?q=solana+lending+protocol+anchor&type=repositories&s=updated&o=desc"
echo "   https://github.com/search?q=solana+dex+protocol+anchor&type=repositories&s=updated&o=desc"

echo ""
highlight_info "Choose a protocol that:"
echo "   • Has 10-500 stars"
echo "   • Was updated in last 30 days"
echo "   • Uses Anchor framework"
echo "   • Has medium complexity (5-15 instruction files)"

echo ""
read -p "🎯 Enter the GitHub URL of your chosen target: " TARGET_URL

if [ -z "$TARGET_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

# Extract repo name from URL
REPO_NAME=$(echo "$TARGET_URL" | sed 's/.*github\.com\///' | sed 's/\.git$//')
echo ""
highlight_success "Target: $REPO_NAME"

echo ""
log_section "Step 2: Clone and Analyze"

# Create targets directory if it doesn't exist
mkdir -p targets
cd targets

# Clone the target
echo "📥 Cloning target repository..."
git clone "$TARGET_URL" "$REPO_NAME"
cd "$REPO_NAME"

# Quick assessment
echo ""
highlight_info "Quick Assessment:"
echo "   • Checking if Anchor project..."
if [ -f "Anchor.toml" ]; then
    highlight_success "✅ Anchor project detected"
else
    echo "❌ Not an Anchor project - may not work with Trident"
fi

echo "   • Checking complexity..."
RUST_FILES=$(find . -name "*.rs" | wc -l)
echo "   • Found $RUST_FILES Rust files"

if [ "$RUST_FILES" -lt 5 ]; then
    echo "⚠️  Low complexity - consider finding a more complex target"
elif [ "$RUST_FILES" -gt 50 ]; then
    echo "⚠️  Very high complexity - might be overwhelming for first target"
else
    highlight_success "✅ Good complexity level"
fi

echo ""
log_section "Step 3: Run Comprehensive Analysis"

# Run the complete analysis
echo "🔒 Running comprehensive security analysis..."
echo "   This will take 5-10 minutes and includes:"
echo "   • Static analysis with VS Code extension"
echo "   • Custom pattern analysis"
echo "   • Trident fuzzing (if Anchor project)"
echo "   • Escalation analysis"
echo ""

# Go back to bug-hunting directory to run analysis
cd ../..

# Run analysis
./scripts/combined-trident-analysis.sh "targets/$REPO_NAME"

echo ""
log_section "Step 4: Review Results"

# Check if analysis was successful
ANALYSIS_DIR=$(find "targets/$REPO_NAME" -name "security-analysis-*" | head -1)

if [ -n "$ANALYSIS_DIR" ]; then
    highlight_success "Analysis completed! Results in: $ANALYSIS_DIR"
    
    echo ""
    echo "📋 Key files to review:"
    echo "   • comprehensive-security-summary.md - Overview"
    echo "   • math-fuzzing.txt - Math vulnerabilities"
    echo "   • access-control-fuzzing.txt - Access control issues"
    
    if [ -d "targets/$REPO_NAME/crashes" ]; then
        echo "   • crashes/ - Trident crash files (potential vulnerabilities!)"
        highlight_success "🚨 CRASHES FOUND! Check these immediately!"
    fi
    
    echo ""
    echo "🔍 Quick vulnerability check:"
    echo "   Checking for obvious issues..."
    
    cd "targets/$REPO_NAME"
    
    # Quick grep for common issues
    echo "   • Unchecked operations:"
    grep -r "unchecked_" programs/ 2>/dev/null | head -3 || echo "     None found"
    
    echo "   • UncheckedAccount usage:"
    grep -r "UncheckedAccount" programs/ 2>/dev/null | head -3 || echo "     None found"
    
    echo "   • Manual lamports zeroing:"
    grep -r "lamports.*=.*0" programs/ 2>/dev/null | head -3 || echo "     None found"
    
    cd ../..
    
else
    echo "❌ Analysis failed or no results found"
fi

echo ""
log_section "Step 5: Next Steps"

echo "🎯 Your next actions:"
echo ""
echo "1. 📖 Review the analysis results:"
echo "   cd $ANALYSIS_DIR"
echo "   cat comprehensive-security-summary.md"
echo ""
echo "2. 🔍 Look for vulnerabilities:"
echo "   • Math overflow/underflow"
echo "   • Access control bypasses"
echo "   • State management issues"
echo "   • Trident crashes"
echo ""
echo "3. 📝 Write your first bug report:"
echo "   cp templates/bug-report-template.md my-first-bug-report.md"
echo ""
echo "4. 🎯 Submit to Immunefi:"
echo "   • Create account at https://immunefi.com"
echo "   • Find your target in their listings"
echo "   • Submit your report"
echo ""

echo "📚 For detailed guidance, see:"
echo "   docs/COMPLETE_WALKTHROUGH.md"
echo ""

echo "🚀 You're ready to find your first bug! Good luck! 🎯💰"
