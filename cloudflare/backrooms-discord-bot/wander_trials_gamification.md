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

## 8. Community Achievement Announcements

### Overview
To encourage community engagement, the Discord bot will automatically post milestone achievements to a dedicated announcement channel. These announcements highlight meaningful accomplishments so the server can celebrate player progress.

Only **high-value milestones** will be announced to avoid channel spam.

Initial milestones supported:

1. **Level Up** – When a player reaches a new level.
2. **Full Wander Trial Completion** – When a player completes all challenges within a Wander Trial.

Future milestones may include:

- Weekly leaderboard posts
- Rare achievements
- Community milestone goals

---

### Channel Configuration

For the MVP, the announcement channel will be configured using an **environment variable**.

Example:

```env
ANNOUNCEMENT_CHANNEL_ID=129874612987461298
SUPPORTED_DISCORD_SERVER_ID=123456789012345678
```

This allows the bot to be tested across different servers without modifying application code.

Later versions may support a `/setup` command to allow server administrators to configure the announcement channel dynamically.

For the new feature, we want to make sure that the when the message comes in, we only want to send to the announcement channel if the message is from the configured server id, the SUPPORTED_DISCORD_SERVER_ID environment variable.

---

### Announcement Conditions

The bot already calculates XP and updates player progress when `/complete trial` is executed. During this flow, the bot will detect milestone changes.

#### Level Up Detection

1. Fetch user progress before update
2. Calculate new XP and level
3. Compare previous level to new level
4. If level increased → send announcement

Pseudo logic:

```
oldLevel = user.level
newLevel = calculateLevel(user.totalXp)

if newLevel > oldLevel
  announceLevelUp()
```

---

#### Full Trial Completion Detection

1. Determine if all challenges for the trial are completed
2. Check if the trial was previously completed
3. If first full completion → send announcement

Pseudo logic:

```
if trial.allChallengesCompleted && !previouslyCompleted
  announceTrialCompletion()
```

---

### Announcement Message Examples

#### Level Up

```
⬆️ Scott reached Level 5!

Total XP: 1000
Keep completing challenges to level up.
```

#### Full Trial Completion

```
🏆 Scott completed all challenges in
"Shades Of An Artist"

Wander Trial fully cleared!
+350 XP earned
```

---

### Sending the Announcement

The bot will send a message to the configured channel using the channel ID from the environment variable.

Example flow:

```
completion processed
→ check milestones
→ if milestone reached
→ fetch announcement channel
→ send message/embed
```

Example implementation concept:

```javascript
const channelId = process.env.ANNOUNCEMENT_CHANNEL_ID;
const channel = await client.channels.fetch(channelId);

await channel.send(message);
```

---

### Anti-Spam Rules

To keep announcements meaningful:

Announce:

- Level ups
- Full Wander Trial completions

Do **not** announce:

- Individual challenge completions
- XP gains

This keeps the channel focused on meaningful milestones.

---

### Future Enhancements

Potential improvements after the MVP:

- `/leaderboard` command
- Weekly automated leaderboard announcements
- Rare achievement alerts
- Seasonal event milestone tracking
- Server-wide community progress goals

These features build on the same milesto

- [Firestore REST API Docs](https://firebase.google.com/docs/firestore/use-rest-api)
- [Google Cloud Service Accounts](https://cloud.google.com/iam/docs/service-accounts)
- [jose JWT Library](https://github.com/panva/jose)
- [Discord.js Slash Command Guide](https://discordjs.guide/creating-your-bot/command-handling.html)

