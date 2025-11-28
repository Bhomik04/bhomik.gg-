import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PlayerStats } from '../types/rpg';

export function usePlayerStats() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'player', 'main'), (doc) => {
      if (doc.exists()) {
        setStats(doc.data() as PlayerStats);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { stats, loading };
}
