#!/bin/bash

# 🔍 Automated Escalation Scanner
# Escalates low/medium severity findings to critical vulnerabilities

echo "🔍 Automated Escalation Scanner"
echo "================================"
echo ""

# Configuration
SCAN_RESULTS_FILE="scan_results.txt"
ESCALATION_LOG="escalation_analysis.log"
PROTOCOL_NAME=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log findings
log_finding() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$ESCALATION_LOG"
    echo -e "${BLUE}[LOG]${NC} $1"
}

# Function to highlight critical findings
highlight_critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
    log_finding "CRITICAL: $1"
}

# Function to highlight escalation opportunities
highlight_escalation() {
    echo -e "${YELLOW}[ESCALATION]${NC} $1"
    log_finding "ESCALATION: $1"
}

# Function to highlight success
highlight_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    log_finding "SUCCESS: $1"
}

# Check if scan results exist
if [ ! -f "$SCAN_RESULTS_FILE" ]; then
    echo "❌ No scan results found. Please run VS Code extension scan first."
    echo "Expected file: $SCAN_RESULTS_FILE"
    exit 1
fi

echo "📊 Analyzing scan results for escalation opportunities..."
echo ""

# Pattern 1: Access Control Escalation
echo "🔍 Pattern 1: Access Control Escalation"
echo "----------------------------------------"

if grep -i "missing signer" "$SCAN_RESULTS_FILE" > /dev/null; then
    highlight_escalation "Missing signer validation found - checking for access control bypasses"
    
    # Automated checks for access control bypasses
    echo "   🔍 Checking for privilege escalation paths..."
    if grep -i "admin\|authority\|owner" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential privilege escalation: Admin functions found with missing signer validation"
    fi
    
    echo "   🔍 Checking for fund transfer functions..."
    if grep -i "transfer\|withdraw\|mint" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential fund draining: Transfer functions with missing signer validation"
    fi
    
    echo "   🔍 Checking for cross-program invocations..."
    if grep -i "cpi\|invoke\|call" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential cross-program attack: CPI calls with missing signer validation"
    fi
fi

if grep -i "uncheckedaccount" "$SCAN_RESULTS_FILE" > /dev/null; then
    highlight_escalation "UncheckedAccount usage found - checking for access bypasses"
    highlight_critical "Potential access control bypass: UncheckedAccount without proper validation"
fi

echo ""

# Pattern 2: State Management Escalation
echo "🔍 Pattern 2: State Management Escalation"
echo "------------------------------------------"

if grep -i "immutable account" "$SCAN_RESULTS_FILE" > /dev/null; then
    highlight_escalation "Immutable account mutation found - checking for state corruption"
    
    echo "   🔍 Checking for race conditions..."
    if grep -i "concurrent\|parallel\|thread" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential race condition: Concurrent access to immutable accounts"
    fi
    
    echo "   🔍 Checking for reentrancy patterns..."
    if grep -i "callback\|recursive\|loop" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential reentrancy: Recursive calls with state mutations"
    fi
fi

if grep -i "missing mut" "$SCAN_RESULTS_FILE" > /dev/null; then
    highlight_escalation "Missing mut attributes found - checking for state corruption"
    highlight_critical "Potential state corruption: Attempting to mutate immutable accounts"
fi

echo ""

# Pattern 3: Math/Logic Escalation
echo "🔍 Pattern 3: Math/Logic Escalation"
echo "-----------------------------------"

if grep -i "unsafe math\|overflow\|underflow" "$SCAN_RESULTS_FILE" > /dev/null; then
    highlight_escalation "Unsafe math operations found - checking for fund draining"
    
    echo "   🔍 Checking for fund calculations..."
    if grep -i "balance\|amount\|fee\|price" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential fund draining: Unsafe math in fund calculations"
    fi
    
    echo "   🔍 Checking for precision loss..."
    if grep -i "decimal\|precision\|round" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential precision loss: Unsafe math in decimal calculations"
    fi
    
    echo "   🔍 Checking for oracle manipulation..."
    if grep -i "oracle\|price\|feed" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential oracle manipulation: Unsafe math in price calculations"
    fi
fi

echo ""

# Pattern 4: Integration Escalation
echo "🔍 Pattern 4: Integration Escalation"
echo "------------------------------------"

if grep -i "cross.*program\|cpi\|invoke" "$SCAN_RESULTS_FILE" > /dev/null; then
    highlight_escalation "Cross-program invocations found - checking for integration attacks"
    
    echo "   🔍 Checking for unauthorized calls..."
    if grep -i "external\|foreign\|other" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential unauthorized CPI: External calls without proper validation"
    fi
fi

echo ""

# Pattern 5: Configuration Escalation
echo "🔍 Pattern 5: Configuration Escalation"
echo "--------------------------------------"

if grep -i "config\|setting\|parameter" "$SCAN_RESULTS_FILE" > /dev/null; then
    highlight_escalation "Configuration issues found - checking for privilege escalation"
    
    echo "   🔍 Checking for admin functions..."
    if grep -i "admin\|authority\|owner" "$SCAN_RESULTS_FILE" > /dev/null; then
        highlight_critical "Potential privilege escalation: Admin functions with configuration issues"
    fi
fi

echo ""

# Generate escalation report
echo "📋 Generating escalation report..."
echo ""

# Count findings
LOW_COUNT=$(grep -i "low\|minor" "$SCAN_RESULTS_FILE" | wc -l)
MEDIUM_COUNT=$(grep -i "medium\|moderate" "$SCAN_RESULTS_FILE" | wc -l)
CRITICAL_OPPORTUNITIES=$(grep -c "CRITICAL:" "$ESCALATION_LOG" 2>/dev/null || echo "0")

echo "📊 Escalation Summary:"
echo "   • Low severity findings: $LOW_COUNT"
echo "   • Medium severity findings: $MEDIUM_COUNT"
echo "   • Critical opportunities identified: $CRITICAL_OPPORTUNITIES"
echo ""

# Generate Cursor AI prompts
echo "🤖 Cursor AI Prompts for Deep Analysis:"
echo "========================================"
echo ""

if [ "$CRITICAL_OPPORTUNITIES" -gt 0 ]; then
    echo "Prompt 1: Escalation Analysis"
    echo "-----------------------------"
    echo "Analyze these security findings and identify potential critical vulnerabilities:"
    echo "$(grep "CRITICAL:" "$ESCALATION_LOG" | head -5)"
    echo ""
    
    echo "Prompt 2: Attack Vector Generation"
    echo "----------------------------------"
    echo "Based on these escalation patterns, generate specific attack vectors that could lead to critical exploits:"
    echo "$(grep "ESCALATION:" "$ESCALATION_LOG" | head -3)"
    echo ""
    
    echo "Prompt 3: Proof of Concept"
    echo "--------------------------"
    echo "Create a proof-of-concept for the most critical vulnerability identified. What would an attacker do to exploit this?"
    echo ""
    
    highlight_success "Escalation analysis complete! Focus on the critical opportunities identified above."
else
    echo "No immediate escalation opportunities found."
    echo "Consider manual analysis of the codebase for deeper vulnerabilities."
fi

echo ""
echo "📁 Files generated:"
echo "   • $ESCALATION_LOG - Detailed escalation analysis"
echo "   • Use Cursor AI prompts above for deep analysis"
echo ""

echo "🎯 Next Steps:"
echo "   1. Review critical opportunities identified"
echo "   2. Use Cursor AI prompts for deep analysis"
echo "   3. Generate proof-of-concepts for critical findings"
echo "   4. Submit detailed reports for critical vulnerabilities"
echo ""

echo "🚀 Happy hunting! 🚀"
