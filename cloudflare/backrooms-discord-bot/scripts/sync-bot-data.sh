#!/bin/bash

# This script syncs the necessary data files from the main application to the Discord bot.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Get the absolute path of the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Project root is three levels up from the script's directory
PROJECT_ROOT="$SCRIPT_DIR/../../.."

# Source paths (relative to project root)
ARCHETYPES_SRC="src/assets/randomizer/archetypes.json"
PROMO_CARDS_SRC="src/assets/cardlists/promo-cards.json"
AQUA_ZONE_CARDS_SRC="src/assets/cardlists/aqua-zone-cards.json"
CAR_PARK_CARDS_SRC="src/assets/cardlists/car-park-cards.json"
LOBBY_LEVEL_CARDS_SRC="src/assets/cardlists/lobby-level-cards.json"

# Destination paths (relative to project root)
BOT_DATA_DIR="cloudflare/backrooms-discord-bot/data"
ARCHETYPES_DEST="$BOT_DATA_DIR/archetypes.json"
CARDS_DEST="$BOT_DATA_DIR/cards.json"

# --- Main Logic ---

echo "Changing to project root directory: $PROJECT_ROOT"
cd "$PROJECT_ROOT"

# 1. Sync Archetypes
echo "Copying archetypes..."
cp "$ARCHETYPES_SRC" "$ARCHETYPES_DEST"
echo "✅ Archetypes synced successfully."

# 2. Merge and Sync Cards
echo "Merging card lists..."
jq -s 'add' \
  "$PROMO_CARDS_SRC" \
  "$AQUA_ZONE_CARDS_SRC" \
  "$CAR_PARK_CARDS_SRC" \
  "$LOBBY_LEVEL_CARDS_SRC" > "$CARDS_DEST"
echo "✅ Cards merged and synced successfully."

echo "All data synced for the Discord bot!"
