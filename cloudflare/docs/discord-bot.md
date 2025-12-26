# 🌟 High-Value, Low-Effort Features (Recommended V1)

These are realistic, quick wins that build momentum and visibility.

---

## 1️⃣ /deck-random — Generate a Random Deck in Discord

Uses your existing deck randomizer.

Flow

User runs /deck-random simple or /deck-random mixed

Bot calls your app endpoint (or a small internal lib)

Bot replies with:

Deck name / archetypes used

Card count summary

Button: Open in Deck Builder

Button: View Deck List

Why it works

Promotes the web app

Great for community prompts and casual play

Drives “try this deck” conversations

---

## 2️⃣ /challenge-roll — Roll Challenge Set in Discord

Pairs perfectly with the new system.

Modes supported

all-levels

random

manual (optional later)

Output

Four challenges formatted as embeds

Difficulty icons or color coding

Button: Open in App / Share Link

Bonus

Could support:

/challenge re-roll 2 (replace slot 2)

or /challenge-of-the-day

--- 

### 3️⃣ /card — Look Up a Card by Name or ID

This will be very popular.

Input

/card hallways

/card LL-001

Bot returns

Card image (if available) or text details

Type, cost/stats, rarity, flavor text (if any)

Button: View in App

Implementation options

Export your card DB as JSON and embed in bot

Or expose a small readonly API endpoint

---

### 4️⃣ /link-deck — Turn a Shared URL Into a Pretty Embed

When people paste deck links in chat, the bot detects and expands it.

Embed includes

Deck name

Author (if logged-in deck)

Card count summary

Button: Open Deck

Why this is great

Makes sharing feel “first-class”

Encourages social deck-building