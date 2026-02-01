#!/usr/bin/env bash
set -euo pipefail

################################################################################
# Create Symlink for AI Agent Guidelines                                       #
# Creates a CLAUDE.md symlink pointing to AGENTS.md for AI assistance           #
################################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔗 Creating symlink for AI agent guidelines..."
echo ""

SOURCE="AGENTS.md"
TARGET="CLAUDE.md"

if [ ! -f "$SOURCE" ]; then
    echo -e "${RED}❌ Source file $SOURCE not found!${NC}"
    exit 1
fi

# Check if symlink already exists and points to correct location
if [ -L "$TARGET" ]; then
    current_target="$(readlink "$TARGET")"
    if [ "$current_target" = "$SOURCE" ]; then
        echo -e "${YELLOW}ℹ${NC} Symlink $TARGET already exists and is correct."
    else
        # Update incorrect symlink
        rm "$TARGET"
        ln -s "$SOURCE" "$TARGET"
        echo -e "${YELLOW}↻${NC} Updated: $TARGET -> $SOURCE"
    fi
elif [ -e "$TARGET" ]; then
    # Regular file exists, warn user
    echo -e "${RED}⚠${NC} Cannot create symlink: A regular file named $TARGET already exists."
    exit 1
else
    # Create new symlink
    ln -s "$SOURCE" "$TARGET"
    echo -e "${GREEN}✓${NC} Created: $TARGET -> $SOURCE"
fi

echo ""
echo -e "${GREEN}✨ Symlink creation complete!${NC}"