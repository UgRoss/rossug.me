#!/usr/bin/env bash
set -euo pipefail

################################################################################
# Create Symlink for AI Agent Guidelines                                       #
# Creates a CLAUDE.md symlink pointing to AGENTS.md for AI assistance           #
################################################################################

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

# Get the project root directory
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

main() {
    printf "🔗 Creating symlink for AI agent guidelines...\n\n"

    local source="AGENTS.md"
    local target="${PROJECT_ROOT}/CLAUDE.md"

    if [[ ! -f "$source" ]]; then
        printf "${RED}❌ Source file %s not found!${NC}\n" "$source"
        exit 1
    fi

    # Check if target exists
    if [[ -L "$target" ]]; then
        local current_target
        current_target="$(readlink "$target")"
        if [[ "$current_target" == "$source" ]]; then
            printf "${YELLOW}ℹ${NC} Symlink %s already exists and is correct.\n" "CLAUDE.md"
        else
            # Update incorrect symlink
            rm "$target"
            ln -s "$source" "$target"
            printf "${YELLOW}↻${NC} Updated: %s -> %s\n" "CLAUDE.md" "$source"
        fi
    elif [[ -e "$target" ]]; then
        # Regular file or directory exists
        printf "${RED}⚠${NC} Cannot create symlink: A regular file or directory named %s already exists.\n" "CLAUDE.md"
        exit 1
    else
        # Create new symlink
        ln -s "$source" "$target"
        printf "${GREEN}✓${NC} Created: %s -> %s\n" "CLAUDE.md" "$source"
    fi

    printf "\n${GREEN}✨ Symlink creation complete!${NC}\n"
}

main "$@"
