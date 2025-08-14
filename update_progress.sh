#!/bin/bash

# Auto-update progress tracker with commit info
PROJECT_DIR="$1"
COMMIT_MSG="$2"
PROJECT_NAME="$3"

if [ -z "$PROJECT_NAME" ]; then
    PROJECT_NAME="Unknown Project"
fi

# Update the progress tracker
cat > ~/projects/learning/PROGRESS_TRACKER.md << EOF
# Learning Progress Tracker

## Solana SOS App
- Status: In development for hackathon submission
- Last worked: $(date)
- Last commit: $COMMIT_MSG
- Current focus: Voice recognition and emergency response
- Next steps: Complete app store readiness

## Live Accelerator
- Status: Group project phase
- Focus: Rust fundamentals and app/auth service
- Next: Field-specific project (blockchain/AI)

## School of Solana
- Status: Week 3 of Season 7
- Focus: Solana development concepts
- Next: Complete course and build portfolio

## Security Practice
- Status: Rareskills bootcamp completed
- Focus: Smart contract auditing and bug bounty
- Next: Practice on real projects

## Recent Activity
- $(date): $PROJECT_NAME - $COMMIT_MSG
EOF

echo "Progress tracker updated for $PROJECT_NAME"

