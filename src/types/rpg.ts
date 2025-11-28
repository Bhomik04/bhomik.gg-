import { Timestamp } from 'firebase/firestore';

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
  description?: string;
  icon?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
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
