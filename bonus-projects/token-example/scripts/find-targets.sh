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

echo ""
echo "🎯 Quick Start:"
echo "1. Pick a protocol from the search results"
echo "2. Run: ./scripts/start-hunt.sh [protocol-name]"
echo "3. Clone the repository and start scanning"
