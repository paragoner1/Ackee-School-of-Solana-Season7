#!/bin/bash

# Manual progress update function
update_progress() {
    local project_name="$1"
    local status_update="$2"
    local focus_area="$3"
    
    # Update the progress tracker
    cat > ~/projects/learning/PROGRESS_TRACKER.md << EOF
# Learning Progress Tracker

## Solana SOS App
- Status: In development for hackathon submission
- Last worked: $(date)
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
- $(date): $project_name - $status_update
- Focus: $focus_area
EOF

    # Commit the update
    cd ~/projects/learning
    git add PROGRESS_TRACKER.md
    git commit -m "Progress update: $project_name - $status_update"
    
    echo "Progress tracker updated for $project_name"
}

# Export the function
export -f update_progress

