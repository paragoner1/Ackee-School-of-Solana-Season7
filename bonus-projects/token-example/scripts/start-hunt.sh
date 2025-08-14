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
TARGET_DIR="../targets/$TARGET"

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
