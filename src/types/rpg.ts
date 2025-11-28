import { Timestamp } from 'firebase/firestore';

export interface PlayerStats {
  name: string;
  class: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  status: string;
  location: string;
  bio: string;
  attributes: Attributes;
  attributeXP: Attributes;
}

export interface Attributes {
  learning: number;
  collaboration: number;
  technical: number;
  intelligence: number;
  creative: number;
}

export interface User {
  id: string;
  displayName: string;
  createdAt: Timestamp;
  email?: string;
  photoUrl?: string;
}

export interface Skill {
  id: string;
  label: string;
  category: string;
  status: 'locked' | 'unlocked' | 'mastered';
  parentId?: string;
  requiredLevel: number;
  xpReward: number;
  attributeBonus?: Partial<Attributes>;
  description?: string;
  icon?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  attributeReward?: Partial<Attributes>;
  status: 'available' | 'in-progress' | 'completed';
  completedAt?: Timestamp;
  isDaily: boolean;
  requirements?: string[];
}

export interface ActivityLog {
  id?: string;
  message: string;
  xpGained: number;
  levelUp: boolean;
  timestamp: Timestamp;
  type: 'quest' | 'skill' | 'project' | 'achievement';
}
