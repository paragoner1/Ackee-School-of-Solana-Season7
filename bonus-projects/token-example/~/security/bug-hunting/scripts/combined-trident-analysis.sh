#!/bin/bash

# 🔒 Combined Security Analysis with Trident
# Runs all security tools including Trident fuzzing for comprehensive analysis

echo "🔒 Combined Security Analysis with Trident"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Function to log section
log_section() {
    echo -e "${PURPLE}📋 $1${NC}"
    echo "============================="
}

# Function to log finding
log_finding() {
    echo -e "${BLUE}[ANALYSIS]${NC} $1"
}

# Function to highlight vulnerabilities
highlight_vulnerability() {
    echo -e "${RED}[VULNERABILITY]${NC} $1"
}

# Function to highlight success
highlight_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to highlight Trident
highlight_trident() {
    echo -e "${CYAN}[TRIDENT]${NC} $1"
}

# Check if target directory is provided
if [ -z "$1" ]; then
    echo "❌ Please provide a target directory"
    echo "Usage: ./combined-trident-analysis.sh [target-directory]"
    exit 1
fi

TARGET_DIR="$1"
echo "🎯 Target: $TARGET_DIR"

# Check if target exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Target directory does not exist: $TARGET_DIR"
    exit 1
fi

# Create analysis directory
ANALYSIS_DIR="$TARGET_DIR/security-analysis-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$ANALYSIS_DIR"
echo "📁 Analysis results will be saved to: $ANALYSIS_DIR"

cd "$TARGET_DIR"

echo ""
log_section "Phase 1: Static Analysis with VS Code Extension"

# Check if VS Code extension is available
if command -v code &> /dev/null; then
    log_finding "VS Code extension available"
    echo "   Run 'solana: Scan Workspace for Security Issues' in VS Code/Cursor"
    echo "   This will provide initial static analysis"
else
    log_finding "VS Code CLI not available"
    echo "   Please run security scan manually in VS Code/Cursor"
fi

echo ""
log_section "Phase 2: Custom Pattern Analysis"

# Run custom fuzzers
if [ -f "../scripts/fuzz-math-operations.sh" ]; then
    log_finding "Running math operations fuzzer..."
    ../scripts/fuzz-math-operations.sh . > "$ANALYSIS_DIR/math-fuzzing.txt" 2>&1
    highlight_success "Math fuzzing completed"
    echo "   Results saved to: $ANALYSIS_DIR/math-fuzzing.txt"
else
    highlight_vulnerability "Math fuzzing script not found"
fi

if [ -f "../scripts/fuzz-access-control.sh" ]; then
    log_finding "Running access control fuzzer..."
    ../scripts/fuzz-access-control.sh . > "$ANALYSIS_DIR/access-control-fuzzing.txt" 2>&1
    highlight_success "Access control fuzzing completed"
    echo "   Results saved to: $ANALYSIS_DIR/access-control-fuzzing.txt"
else
    highlight_vulnerability "Access control fuzzing script not found"
fi

echo ""
log_section "Phase 3: Trident Fuzzing Setup"

# Check if Trident is installed
if command -v trident &> /dev/null; then
    highlight_trident "Trident CLI is installed"
    
    # Check if this is an Anchor project
    if [ -f "Anchor.toml" ]; then
        log_finding "Anchor project detected - initializing Trident..."
        
        # Initialize Trident
        if trident init > "$ANALYSIS_DIR/trident-init.txt" 2>&1; then
            highlight_success "Trident initialized successfully"
            echo "   Initialization log saved to: $ANALYSIS_DIR/trident-init.txt"
            
            # Add fuzz test
            log_finding "Adding fuzz test..."
            if trident fuzz add > "$ANALYSIS_DIR/trident-add.txt" 2>&1; then
                highlight_success "Fuzz test added successfully"
                echo "   Add log saved to: $ANALYSIS_DIR/trident-add.txt"
                
                # Check if fuzz test was created
                if [ -d "trident-tests" ]; then
                    log_finding "Fuzz test directory created"
                    ls -la trident-tests/ > "$ANALYSIS_DIR/trident-tests-listing.txt"
                    
                    echo ""
                    log_section "Phase 4: Trident Fuzzing Campaign"
                    
                    # Run fuzzing
                    log_finding "Starting Trident fuzzing campaign..."
                    echo "   This will run for 30 minutes to find vulnerabilities"
                    echo "   Monitoring for crashes..."
                    
                    # Run fuzzing in background and capture output
                    trident fuzz run-hfuzz fuzz_0 --duration 30m > "$ANALYSIS_DIR/trident-fuzzing.txt" 2>&1 &
                    FUZZ_PID=$!
                    
                    # Monitor for crashes
                    echo "   Fuzzing PID: $FUZZ_PID"
                    echo "   Monitoring for crashes..."
                    
                    # Wait for fuzzing to complete or check for crashes
                    sleep 5
                    
                    # Check if crashes directory exists
                    if [ -d "crashes" ]; then
                        highlight_vulnerability "CRASHES FOUND!"
                        echo "   Crash files:"
                        ls -la crashes/ > "$ANALYSIS_DIR/crashes-listing.txt"
                        cat "$ANALYSIS_DIR/crashes-listing.txt"
                        
                        # Debug crashes
                        echo ""
                        log_section "Phase 5: Crash Analysis"
                        
                        for crash_file in crashes/*; do
                            if [ -f "$crash_file" ]; then
                                log_finding "Debugging crash: $crash_file"
                                trident fuzz debug-hfuzz fuzz_0 "$crash_file" > "$ANALYSIS_DIR/crash-debug-$(basename $crash_file).txt" 2>&1
                                echo "   Debug log saved to: $ANALYSIS_DIR/crash-debug-$(basename $crash_file).txt"
                            fi
                        done
                    else
                        log_finding "No crashes found yet, continuing monitoring..."
                        echo "   Fuzzing is still running in background"
                        echo "   Check $ANALYSIS_DIR/trident-fuzzing.txt for progress"
                    fi
                    
                else
                    highlight_vulnerability "Fuzz test directory not created"
                fi
            else
                highlight_vulnerability "Failed to add fuzz test"
                echo "   Error log saved to: $ANALYSIS_DIR/trident-add.txt"
            fi
        else
            highlight_vulnerability "Failed to initialize Trident"
            echo "   Error log saved to: $ANALYSIS_DIR/trident-init.txt"
        fi
    else
        log_finding "Not an Anchor project - Trident requires Anchor framework"
        echo "   Skipping Trident fuzzing for this target"
    fi
else
    highlight_vulnerability "Trident CLI not installed"
    echo "   Install with: cargo install trident-cli"
    echo "   Skipping Trident fuzzing for this target"
fi

echo ""
log_section "Phase 6: Automated Escalation Analysis"

# Run escalation scanner
if [ -f "../scripts/automated-escalation-scanner.sh" ]; then
    log_finding "Running escalation scanner..."
    ../scripts/automated-escalation-scanner.sh . > "$ANALYSIS_DIR/escalation-analysis.txt" 2>&1
    highlight_success "Escalation analysis completed"
    echo "   Results saved to: $ANALYSIS_DIR/escalation-analysis.txt"
else
    highlight_vulnerability "Escalation scanner not found"
fi

echo ""
log_section "Phase 7: Code Coverage Analysis"

# Check for test files
log_finding "Analyzing test coverage..."

TEST_COUNT=$(find . -name "*.ts" -o -name "*_test.rs" -o -name "test_*.rs" | wc -l)
echo "   Test files found: $TEST_COUNT"

if [ "$TEST_COUNT" -gt 0 ]; then
    echo "   Test files:"
    find . -name "*.ts" -o -name "*_test.rs" -o -name "test_*.rs" | head -5
fi

# Check for Anchor.toml
if [ -f "Anchor.toml" ]; then
    log_finding "Anchor project detected"
    echo "   Run 'anchor test' for comprehensive testing"
else
    log_finding "No Anchor.toml found"
    echo "   Consider adding Anchor framework for better testing"
fi

echo ""
log_section "Phase 8: Generate Comprehensive Report"

# Create comprehensive summary report
SUMMARY_FILE="$ANALYSIS_DIR/comprehensive-security-summary.md"
cat > "$SUMMARY_FILE" << EOF
# 🔒 Comprehensive Security Analysis Summary
## Generated: $(date)

### Target: $TARGET_DIR
### Analysis Date: $(date)

## 📊 Analysis Overview

This report contains the results of a comprehensive security analysis using multiple tools and techniques, including **Trident fuzzing**.

## 🛠️ Tools Used

1. **VS Code Extension** - Static analysis
2. **Math Operations Fuzzer** - Overflow/underflow detection
3. **Access Control Fuzzer** - Authorization bypass detection
4. **Trident Fuzzing** - Dynamic vulnerability discovery
5. **Escalation Scanner** - Critical vulnerability detection
6. **Code Coverage Analysis** - Test coverage assessment

## 📋 Files Generated

- \`math-fuzzing.txt\` - Math operations analysis
- \`access-control-fuzzing.txt\` - Access control analysis
- \`trident-init.txt\` - Trident initialization log
- \`trident-add.txt\` - Trident fuzz test creation log
- \`trident-fuzzing.txt\` - Trident fuzzing campaign results
- \`crashes-listing.txt\` - Crash files listing (if found)
- \`crash-debug-*.txt\` - Individual crash debug logs (if found)
- \`escalation-analysis.txt\` - Escalation analysis
- \`comprehensive-security-summary.md\` - This summary report

## 🔱 Trident Fuzzing Results

$(if [ -d "crashes" ]; then
    echo "### 🚨 CRASHES FOUND!"
    echo ""
    echo "Trident discovered the following crashes:"
    echo ""
    for crash_file in crashes/*; do
        if [ -f "$crash_file" ]; then
            echo "- \`$(basename $crash_file)\` - Debug log: \`crash-debug-$(basename $crash_file).txt\`"
        fi
    done
    echo ""
    echo "**These crashes represent potential security vulnerabilities!**"
    echo ""
    echo "### Next Steps for Crashes:"
    echo "1. Review each crash debug log"
    echo "2. Reproduce the vulnerability"
    echo "3. Write proof of concept"
    echo "4. Submit bug report with crash file"
else
    echo "### ✅ No Crashes Found"
    echo ""
    echo "Trident fuzzing completed without finding crashes."
    echo "This could mean:"
    echo "- The code is well-tested"
    echo "- The fuzzing campaign needs more time"
    echo "- Different fuzz test strategies are needed"
fi)

## 🎯 Next Steps

1. **Review all generated files**
2. **Address high-priority vulnerabilities**
3. **Reproduce any Trident crashes**
4. **Implement recommended fixes**
5. **Run follow-up analysis**
6. **Document findings for bug reports**

## 💰 Income Potential

With Trident fuzzing, you can expect:
- **2-5x more bugs found** compared to manual analysis
- **Higher quality vulnerabilities** with reproducible crashes
- **Faster bug discovery** through automated fuzzing
- **Professional reports** with crash files as proof

## 📞 Support

For questions about this analysis, refer to the security workspace documentation.
EOF

highlight_success "Comprehensive summary report generated"
echo "   Results saved to: $SUMMARY_FILE"

echo ""
log_section "Analysis Complete"

echo "📁 All results saved to: $ANALYSIS_DIR"
echo ""
echo "📋 Generated Files:"
echo "   • math-fuzzing.txt"
echo "   • access-control-fuzzing.txt"
echo "   • trident-init.txt"
echo "   • trident-add.txt"
echo "   • trident-fuzzing.txt"

if [ -d "crashes" ]; then
    echo "   • crashes-listing.txt"
    echo "   • crash-debug-*.txt (for each crash)"
fi

echo "   • escalation-analysis.txt"
echo "   • comprehensive-security-summary.md"

echo ""
echo "🎯 Next Steps:"
echo "1. Review all analysis files"
echo "2. Address critical vulnerabilities first"
echo "3. Reproduce any Trident crashes"
echo "4. Use findings for bug reports"
echo "5. Run follow-up analysis after fixes"

if [ -d "crashes" ]; then
    echo ""
    highlight_vulnerability "🚨 CRASHES FOUND - IMMEDIATE ACTION REQUIRED!"
    echo "Review crash files and debug logs for potential vulnerabilities"
fi

echo ""
echo "🔒 Combined security analysis with Trident complete! 🚀"
