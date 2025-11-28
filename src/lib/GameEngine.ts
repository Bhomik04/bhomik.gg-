import { db } from './firebase';
import { doc, getDoc, updateDoc, collection, addDoc, Timestamp, increment, setDoc, FieldValue } from 'firebase/firestore';
import { PlayerStats, Attributes, Skill, Quest, ActivityLog } from '../types/rpg';

export class GameEngine {
  private static readonly PLAYER_DOC_ID = 'main';
  private static readonly BASE_XP = 100;
  private static readonly EXPONENT = 1.5;

  // Calculate XP required for next level
  static calculateXPToNextLevel(level: number): number {
    return Math.floor(this.BASE_XP * Math.pow(level, this.EXPONENT));
  }

  // Add XP to player and handle level up
  static async addXP(amount: number): Promise<{ leveledUp: boolean; newLevel?: number }> {
    if (!db) return { leveledUp: false };

    try {
      const playerRef = doc(db, 'player', this.PLAYER_DOC_ID);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) return { leveledUp: false };

      const playerData = playerSnap.data() as PlayerStats;
      let { currentXP, level, totalXP, xpToNextLevel } = playerData;

      currentXP += amount;
      totalXP += amount;
      let leveledUp = false;

      // Check for level up (loop in case of multiple level ups)
      while (currentXP >= xpToNextLevel) {
        currentXP -= xpToNextLevel;
        level++;
        xpToNextLevel = this.calculateXPToNextLevel(level);
        leveledUp = true;
      }

      await updateDoc(playerRef, {
        currentXP,
        level,
        totalXP,
        xpToNextLevel
      });

      if (leveledUp) {
        await this.logActivity(`Leveled up to Level ${level}!`, 0, true, 'achievement');
      }

      return { leveledUp, newLevel: level };
    } catch (error) {
      console.error("GameEngine.addXP error:", error);
      return { leveledUp: false };
    }
  }

  // Complete a quest
  static async completeQuest(questId: string): Promise<void> {
    if (!db) return;

    try {
      const questRef = doc(db, 'quests', questId);
      const questSnap = await getDoc(questRef);

      if (!questSnap.exists()) throw new Error('Quest not found');

      const questData = questSnap.data() as Quest;

      if (questData.status === 'completed') return; // Already completed

      // Update quest status
      await updateDoc(questRef, {
        status: 'completed',
        completedAt: Timestamp.now()
      });

      // Award XP
      await this.addXP(questData.xpReward);

      // Award Attribute XP
      if (questData.attributeReward) {
        for (const [attr, amount] of Object.entries(questData.attributeReward)) {
          await this.addAttributeXP(attr as keyof Attributes, amount);
        }
      }

      await this.logActivity(`Completed quest: ${questData.title}`, questData.xpReward, false, 'quest');
    } catch (error) {
      console.error("GameEngine.completeQuest error:", error);
    }
  }

  // Unlock a skill
  static async unlockSkill(skillId: string): Promise<void> {
    if (!db) return;

    try {
      const skillRef = doc(db, 'skills', skillId);
      const skillSnap = await getDoc(skillRef);

      if (!skillSnap.exists()) throw new Error('Skill not found');

      const skillData = skillSnap.data() as Skill;

      if (skillData.status !== 'locked') return; // Already unlocked or mastered

      const playerRef = doc(db, 'player', this.PLAYER_DOC_ID);
      const playerSnap = await getDoc(playerRef);
      const playerData = playerSnap.data() as PlayerStats;

      if (playerData.level < skillData.requiredLevel) {
        throw new Error(`Level ${skillData.requiredLevel} required`);
      }

      // Update skill status
      await updateDoc(skillRef, {
        status: 'unlocked'
      });

      // Award XP
      await this.addXP(skillData.xpReward);

      // Award Attribute Bonus (Permanent stat increase)
      if (skillData.attributeBonus) {
         const updates: Record<string, FieldValue> = {};
         for (const [attr, amount] of Object.entries(skillData.attributeBonus)) {
           updates[`attributes.${attr}`] = increment(amount);
         }
         await updateDoc(playerRef, updates);
      }

      await this.logActivity(`Unlocked skill: ${skillData.label}`, skillData.xpReward, false, 'skill');
    } catch (error) {
      console.error("GameEngine.unlockSkill error:", error);
    }
  }

  // Add Attribute XP and handle attribute leveling
  static async addAttributeXP(attribute: keyof Attributes, amount: number): Promise<void> {
    if (!db) return;

    try {
      const playerRef = doc(db, 'player', this.PLAYER_DOC_ID);
      const playerSnap = await getDoc(playerRef);
      
      if (!playerSnap.exists()) return;

      const playerData = playerSnap.data() as PlayerStats;
      let currentAttrXP = playerData.attributeXP[attribute] || 0;
      let currentAttrVal = playerData.attributes[attribute] || 0;

      currentAttrXP += amount;

      // Every 100 XP increases attribute by 1
      while (currentAttrXP >= 100) {
        currentAttrXP -= 100;
        currentAttrVal++;
      }

      await updateDoc(playerRef, {
        [`attributeXP.${attribute}`]: currentAttrXP,
        [`attributes.${attribute}`]: currentAttrVal
      });
    } catch (error) {
      console.error("GameEngine.addAttributeXP error:", error);
    }
  }

  // Log activity
  static async logActivity(message: string, xpGained: number, levelUp: boolean, type: ActivityLog['type']): Promise<void> {
    if (!db) return;

    try {
      await addDoc(collection(db, 'activity_logs'), {
        message,
        xpGained,
        levelUp,
        timestamp: Timestamp.now(),
        type
      });
    } catch (error) {
      console.error("GameEngine.logActivity error:", error);
    }
  }

  // Initialize Player (Seeding)
  static async initializePlayer(): Promise<void> {
    if (!db) return;
    
    try {
      const playerRef = doc(db, 'player', this.PLAYER_DOC_ID);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) {
        const initialData: PlayerStats = {
          name: "Bhomik Goyal",
          class: "Netrunner",
          level: 1,
          currentXP: 0,
          xpToNextLevel: 100,
          totalXP: 0,
          status: "Online",
          location: "Night City",
          bio: "Full Stack Developer | Creative Technologist",
          attributes: {
            learning: 5,
            collaboration: 5,
            technical: 5,
            intelligence: 5,
            creative: 5
          },
          attributeXP: {
            learning: 0,
            collaboration: 0,
            technical: 0,
            intelligence: 0,
            creative: 0
          }
        };
        await setDoc(playerRef, initialData);
        console.log("Player initialized");
      }
    } catch (error) {
      console.error("Error initializing player:", error);
      // Don't throw, just log. This allows the app to continue even if offline.
    }
  }
}
