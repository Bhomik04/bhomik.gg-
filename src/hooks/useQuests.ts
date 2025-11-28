import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Quest } from '../types/rpg';
import { GameEngine } from '../lib/GameEngine';

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      // Avoid synchronous state update in effect
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    const q = query(collection(db, 'quests'), orderBy('isDaily', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedQuests: Quest[] = [];
        snapshot.forEach((doc) => {
          fetchedQuests.push({ id: doc.id, ...doc.data() } as Quest);
        });
        setQuests(fetchedQuests);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching quests:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const completeQuest = async (questId: string) => {
    try {
      await GameEngine.completeQuest(questId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to complete quest";
      throw new Error(errorMessage);
    }
  };

  return { quests, loading, error, completeQuest };
}
