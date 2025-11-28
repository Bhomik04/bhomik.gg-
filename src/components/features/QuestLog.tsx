"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Quest } from "@/types/rpg";
import { GameEngine } from "@/lib/GameEngine";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Star, Zap } from "lucide-react";

export default function QuestLog() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        const q = query(collection(db, "quests"), orderBy("isDaily", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedQuests: Quest[] = [];
            snapshot.forEach((doc) => {
                fetchedQuests.push({ id: doc.id, ...doc.data() } as Quest);
            });
            setQuests(fetchedQuests);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleComplete = async (questId: string) => {
        try {
            await GameEngine.completeQuest(questId);
        } catch (error: unknown) {
            console.error("Error completing quest:", error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unknown error occurred");
            }
        }
    };

    if (loading) return <div className="text-neon-cyan animate-pulse">LOADING QUESTS...</div>;

    return (
        <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-neon-cyan font-orbitron tracking-widest mb-4 flex items-center gap-2">
                <Star size={18} className="md:w-5 md:h-5" /> ACTIVE QUESTS
            </h3>
            
            <div className="space-y-3 max-h-[300px] md:max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {quests.map((quest) => (
                    <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 md:p-4 border rounded-lg backdrop-blur-sm transition-all ${
                            quest.status === 'completed' 
                                ? 'bg-neon-green/10 border-neon-green/30' 
                                : 'bg-black/40 border-neon-cyan/30 hover:bg-neon-cyan/10'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    {quest.status === 'completed' ? (
                                        <CheckCircle size={16} className="text-neon-green" />
                                    ) : (
                                        <Circle size={16} className="text-neon-cyan" />
                                    )}
                                    <h4 className={`font-bold text-sm md:text-base ${quest.status === 'completed' ? 'text-neon-green' : 'text-white'}`}>
                                        {quest.title}
                                    </h4>
                                    {quest.isDaily && (
                                        <span className="text-[8px] md:text-[10px] bg-neon-purple/20 text-neon-purple px-1 rounded border border-neon-purple/30">
                                            DAILY
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs md:text-sm text-gray-400 mb-2">{quest.description}</p>
                                
                                <div className="flex flex-wrap gap-2 md:gap-3 text-[10px] md:text-xs font-mono">
                                    <span className="text-neon-yellow flex items-center gap-1">
                                        <Star size={10} /> {quest.xpReward} XP
                                    </span>
                                    {quest.attributeReward && Object.entries(quest.attributeReward).map(([attr, val]) => (
                                        <span key={attr} className="text-neon-cyan flex items-center gap-1 uppercase">
                                            <Zap size={10} /> +{val} {attr}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {quest.status !== 'completed' && (
                                <button
                                    onClick={() => handleComplete(quest.id)}
                                    className="px-3 py-1 bg-neon-cyan/20 hover:bg-neon-cyan/40 text-neon-cyan border border-neon-cyan rounded text-xs font-orbitron transition-all"
                                >
                                    COMPLETE
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
