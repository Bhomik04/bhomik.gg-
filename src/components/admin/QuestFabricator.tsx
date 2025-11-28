"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CyberButton from "@/components/ui/CyberButton";
import { Attributes } from "@/types/rpg";

export default function QuestFabricator() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [xp, setXp] = useState(100);
    const [isDaily, setIsDaily] = useState(false);
    const [attributeReward, setAttributeReward] = useState<Partial<Attributes>>({});
    const [loading, setLoading] = useState(false);

    const handleAddQuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;
        setLoading(true);
        try {
            await addDoc(collection(db, "quests"), {
                title,
                description,
                xpReward: Number(xp),
                attributeReward,
                status: 'available',
                isDaily,
                createdAt: new Date(),
            });
            setTitle("");
            setDescription("");
            setXp(100);
            setAttributeReward({});
            alert("Quest Fabricated!");
        } catch (error) {
            console.error("Error adding quest:", error);
            alert("Fabrication Failed.");
        }
        setLoading(false);
    };

    const handleAttributeChange = (attr: keyof Attributes, value: number) => {
        if (value === 0) {
            const newRewards = { ...attributeReward };
            delete newRewards[attr];
            setAttributeReward(newRewards);
        } else {
            setAttributeReward({ ...attributeReward, [attr]: value });
        }
    };

    return (
        <div className="p-6 border border-neon-cyan/30 rounded bg-cyber-gray/20">
            <h2 className="text-xl text-neon-cyan mb-4 font-orbitron tracking-widest">QUEST FABRICATOR</h2>
            <form onSubmit={handleAddQuest} className="space-y-4">
                <div>
                    <label htmlFor="quest-title" className="block text-xs text-neon-cyan/70 mb-1">QUEST TITLE</label>
                    <input
                        id="quest-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-cyber-black border border-neon-cyan/50 p-2 text-neon-cyan focus:outline-none focus:border-neon-cyan"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="quest-desc" className="block text-xs text-neon-cyan/70 mb-1">DESCRIPTION</label>
                    <textarea
                        id="quest-desc"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-cyber-black border border-neon-cyan/50 p-2 text-neon-cyan focus:outline-none focus:border-neon-cyan"
                        rows={3}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quest-xp" className="block text-xs text-neon-cyan/70 mb-1">XP REWARD</label>
                        <input
                            id="quest-xp"
                            type="number"
                            value={xp}
                            onChange={(e) => setXp(Number(e.target.value))}
                            className="w-full bg-cyber-black border border-neon-cyan/50 p-2 text-neon-cyan focus:outline-none focus:border-neon-cyan"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center gap-2 text-xs text-neon-cyan/70 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDaily}
                                onChange={(e) => setIsDaily(e.target.checked)}
                                className="accent-neon-cyan"
                            />
                            IS DAILY QUEST?
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-neon-cyan/70 mb-2">ATTRIBUTE REWARDS</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['technical', 'creative', 'intelligence', 'collaboration', 'learning'].map((attr) => (
                            <div key={attr} className="flex items-center gap-2">
                                <label htmlFor={`attr-${attr}`} className="text-[10px] uppercase w-20 text-neon-cyan/60">{attr}</label>
                                <input
                                    id={`attr-${attr}`}
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    className="w-16 bg-cyber-black border border-neon-cyan/30 p-1 text-xs text-neon-cyan"
                                    onChange={(e) => handleAttributeChange(attr as keyof Attributes, parseInt(e.target.value) || 0)}
                                />
                            </div>
                        ))}
                    </div>
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
