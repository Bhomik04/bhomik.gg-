Implementation Plan: Full RPG Game Mechanics System
Goal
Implement a complete, database-backed RPG progression system with real-time game mechanics, experience tracking, level-up logic, and dynamic skill unlocking.

Database Schema (Firestore)
1. player Collection (Single Document: main)
{
  name: "Bhomik Goyal",
  class: "Netrunner",
  level: 1,
  currentXP: 0,
  xpToNextLevel: 100,
  totalXP: 0,
  status: "Online",
  location: "Night City",
  bio: "Character lore...",
  
  // Attributes (Pentagon Stats)
  attributes: {
    technical: 10,
    creative: 8,
    problemSolving: 9,
    collaboration: 7,
    learning: 8
  },
  
  // Attribute XP pools
  attributeXP: {
    technical: 0,
    creative: 0,
    problemSolving: 0,
    collaboration: 0,
    learning: 0
  }
}
2. skills Collection
{
  id: "react-advanced",
  label: "React Advanced",
  category: "Frontend",
  status: "locked" | "unlocked" | "mastered",
  parentId: "react-basics",
  requiredLevel: 5,
  xpReward: 50,
  attributeBonus: { technical: 2, creative: 1 }
}
3. quests Collection
{
  id: "quest-1",
  title: "Build Authentication System",
  description: "Implement Firebase Auth",
  xpReward: 100,
  attributeReward: { technical: 3 },
  status: "available" | "in-progress" | "completed",
  completedAt: timestamp | null,
  isDaily: false
}
4. projects Collection (Already exists)
{
  title: "Project Name",
  xpGranted: 150,
  attributeBonus: { technical: 5, creative: 3 }
}
5. activity_logs Collection
{
  message: "Completed quest: ...",
  xpGained: 100,
  levelUp: false,
  timestamp: Date
}
Core Game Mechanics
Level-Up System
XP Formula: xpToNextLevel = baseXP * (level ^ exponential)
Base XP: 100
Exponential: 1.5
Level 1→2: 100 XP
Level 2→3: 225 XP
Level 3→4: 380 XP
Attribute System
Each attribute starts at base value (e.g., 10)
Completing quests/skills grants attribute XP
Every 100 attribute XP increases that attribute by 1
Attributes affect skill unlocking requirements
Skill Tree Logic
Skills have requiredLevel and parentId
A skill unlocks when:
Player level >= requiredLevel
Parent skill is unlocked or mastered
Unlocking a skill grants XP
Using a skill repeatedly increases mastery
Implementation Steps
Phase 1: Database Setup
Create Firestore structure
Initialize player document with starting values
Seed initial skills with dependencies
Add sample quests
Phase 2: Game Logic Layer
[NEW] 
GameEngine.ts

calculateXPForLevel(level: number): number
canLevelUp(currentXP, level): boolean
levelUp(playerId): Promise<void>
awardXP(playerId, amount, source): Promise<void>
unlockSkill(skillId): Promise<void>
canUnlockSkill(skillId, playerLevel, unlockedSkills): boolean
[NEW] 
usePlayer.ts

Real-time player data hook
Returns: { player, loading, error, refreshPlayer }
[NEW] 
useQuests.ts

Real-time quests hook
completeQuest(questId) function
Phase 3: UI Integration
[MODIFY] 
HudOverlay.tsx
Fetch real player data from Firestore
Display live XP bar with currentXP / xpToNextLevel
Show actual level from database
Pentagon chart uses real attributes values
[MODIFY] 
SkillPentagon.tsx
Accept attributes prop from player data
Display real-time attribute values
[MODIFY] 
QuestFabricator.tsx
Add "Complete Quest" button
Trigger GameEngine.awardXP() on completion
Update quest status to "completed"
[NEW] 
XPNotification.tsx
Toast notification when XP is gained
Level-up animation with confetti
Attribute increase notification
Phase 4: Admin Tools
[MODIFY] 
Admin Overview
Button to manually award XP
Reset player progress (dev tool)
View XP history
Verification Plan
Complete a Quest:

XP increases in database
UI updates in real-time
Level-up triggers when threshold reached
Unlock Skills:

Skills locked until requirements met
Skills auto-unlock when level increases
Pentagon Chart:

Values reflect database
Change when attributes increase
Real-time Sync:

Open in two tabs
Complete quest in one
See update in other tab immediately