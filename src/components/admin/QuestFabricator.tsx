"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CyberButton from "@/components/ui/CyberButton";

export default function QuestFabricator() {
    const [title, setTitle] = useState("");
    const [xp, setXp] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleAddQuest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "quests"), {
                title,
                xp_reward: Number(xp),
                is_active: true,
                is_completed_today: false,
                created_at: new Date(),
            });
            setTitle("");
            alert("Quest Fabricated!");
        } catch (error) {
            console.error("Error adding quest:", error);
            alert("Fabrication Failed.");
        }
        setLoading(false);
    };

    return (
        <div className="p-6 border border-neon-cyan/30 rounded bg-cyber-gray/20">
            <h2 className="text-xl text-neon-cyan mb-4">QUEST FABRICATOR</h2>
            <form onSubmit={handleAddQuest} className="space-y-4">
                <div>
                    <label className="block text-xs text-neon-cyan/70 mb-1">QUEST TITLE</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-cyber-black border border-neon-cyan/50 p-2 text-neon-cyan focus:outline-none focus:border-neon-cyan"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-neon-cyan/70 mb-1">XP REWARD</label>
                    <input
                        type="number"
                        value={xp}
                        onChange={(e) => setXp(Number(e.target.value))}
                        className="w-full bg-cyber-black border border-neon-cyan/50 p-2 text-neon-cyan focus:outline-none focus:border-neon-cyan"
                        required
                    />
                </div>
                <CyberButton
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "FABRICATING..." : "INITIATE QUEST"}
                </CyberButton>
            </form>
        </div>
    );
}
