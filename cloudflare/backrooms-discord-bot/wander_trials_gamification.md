# Wander Trials Gamification System – Design Doc

## Overview

The goal of this system is to gamify the Backrooms TCG experience using **Wander Trials**, which are unique game scenarios with 3–5 challenges each. Players can track achievements, gain XP, and earn badges via a **Discord bot** and eventually the web app.

The focus is **engagement**, with simple tracking and progression that can expand over time.

---

## 1. Core Concepts

- **Wander Trial:** A scenario with a small set of unique challenges.
- **Challenge:** A specific objective within a trial. Each challenge can grant XP.
- **Scenario Completion:** Bonus XP for completing any part of the trial.
- **Full Completion:** Bonus XP for completing all challenges in a trial.
- **Achievements/Badges:** Awarded for completing challenges, scenarios, or full trials.
- **Leveling/XP:** Tracks player progression.

---

## 2. Firestore Data Model

### 2.1 Wander Trials (Embedded Challenges)

```json
wanderTrials/{trialId}
{
  name: "No Rare Cards Trial",
  createdAt: timestamp,
  challenges: [
    { id: "challenge1", name: "Only Common Cards", xp: 100 },
    { id: "challenge2", name: "Draw Limit", xp: 100 },
    { id: "challenge3", name: "Random Deck", xp: 100 }
  ]
}
```

**Notes:**

- Challenges are embedded because each is **unique to the trial** and unlikely to change.
- `xp` is baseline 100 per challenge; bonuses are added for scenario participation and full completion.

---

### 2.2 Discord Users Collection

```json
discordUsers/{discordId}
{
  username: "Scott#1234",
  avatar: "https://cdn.discordapp.com/avatars/123456789012345678/abcdef.png",
  trials: {
    "NoRareCardsTrial": {
      completedScenario: true,
      completedChallenges: ["challenge1","challenge3"],
      allChallengesCompleted: false,
      completedAt: timestamp
    }
  },
  totalXp: 420,
  level: 5,
  version: 1
}
```

**Notes:**

- `discordId` is primary key for Discord bot integration.
- Trial progress is tracked under `trials`.
- Level and total XP are calculated from completed challenges.

---

### 2.3 User Progress Calculation

- Merge newly completed challenges with existing completed ones.
- Award XP for:
  - New challenges completed
  - Scenario participation bonus (if first time)
  - Full completion bonus (if all challenges completed)
- Update `allChallengesCompleted` and timestamp.
- Achievements/badges are stored optionally in a subcollection.

---

## 3. Discord Integration

### 3.1 Slash Command Flow (`/complete trial`)

1. User submits:
   - Trial ID
   - List of challenges completed
2. Worker looks up `discordUsers/{discordId}`.
3. Merge challenges and check full completion.
4. Calculate XP:
   - Challenge XP
   - Scenario bonus
   - Full completion bonus
5. Update Firestore:
   - `discordUsers/{discordId}/trials/{trialId}`
   - `discordUsers/{discordId}` for XP/level
   - Optionally, add achievements/badges
6. Respond with **Discord embed** showing:
   - Completed challenges
   - Remaining challenges
   - XP gained
   - Achievements unlocked
   - Level progress

---

### 3.2 Embed Design (Example)

```text
🎮 "No Rare Cards Trial" — Run Summary

You completed 2/3 challenges in this scenario!

🏆 Completed Challenges
✔ Challenge 1: Only Common Cards (+100 XP)
✔ Challenge 3: Random Deck (+100 XP)

✨ Achievements Earned
🏅 Scenario Participation Achievement (+50 XP)
❌ All Challenges Completed Achievement (not yet!)

⏳ Remaining Challenges
☐ Challenge 2: Draw Limit

🔥 Progress & XP
Partial Run XP: 250 XP
Total Level XP: 420 / 500 XP
Progress to next level: ▓▓▓▓▓▓░░░ 84%

Keep going! Complete all challenges for bonus XP and badges.
```

---

## 4. XP and Leveling

- **Base XP per challenge:** 100 XP
- **Scenario participation bonus:** 50 XP
- **Full completion bonus:** 150 XP
- Optional difficulty scaling:
  - Easy: 50–100 XP
  - Medium: 100–150 XP
  - Hard: 150–200 XP
- Level curve can start at **500 XP per level**; adjust as needed for pacing.

---

## 5. Cloudflare Worker Integration

- Cloudflare Worker hosts Discord bot commands.
- **Cannot use `firebase-admin`** (Node SDK) in Workers.
- Use **Firestore REST API** with:
  1. Service account JSON
  2. JWT signed via [`jose`](https://github.com/panva/jose) library
  3. Exchange JWT for OAuth2 token → use for Firestore writes
- Store service account JSON in **Cloudflare secrets** for safety.
- Optionally, restrict service account access via **IAM conditions** to `discordUsers/**` collection only.

---

## 6. MVP / Steps to Complete

### 6.1 Firestore Setup

1. Create `wanderTrials` collection and embed challenges.
2. Create `discordUsers` collection for Discord-specific user progress.
3. Assign baseline XP to challenges and bonuses.

### 6.2 Cloudflare Worker

1. Implement Discord bot commands:
   - `/complete trial` → submit scenario + challenges
2. Generate JWT using `jose` and get Firestore access token.
3. Read/write Firestore documents for XP, trials, and achievements.
4. Return Discord embed with progress.

### 6.3 Gamification Features

1. Track partial vs full completion.
2. Award XP for challenges, scenario participation, and full completion.
3. Track achievements/badges.
4. Optional: implement weekly/daily challenge multipliers.

### 6.4 Future Enhancements

1. Link Discord users to existing Google-auth users.
2. Add badge icons and streak tracking.
3. Optional: migrate `discordUsers` data into main users collection once linking is done.
4. Implement difficulty-based XP scaling or special seasonal trials.

---

## 7. Security Considerations

- Store service account JSON in **Cloudflare secrets**.
- Limit IAM permissions to only required collections (e.g., `discordUsers/**`).
- Prevent double-counting XP by checking previously completed challenges.
- Only allow Discord-authenticated users to submit progress.

---

## 8. References

- [Firestore REST API Docs](https://firebase.google.com/docs/firestore/use-rest-api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [jose JWT Library](https://github.com/panva/jose)
- [Discord.js Slash Command Guide](https://discordjs.guide/creating-your-bot/command-handling.html)

