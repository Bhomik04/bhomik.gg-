"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CyberButton from "@/components/ui/CyberButton";

export default function SkillArchitect() {
    const [label, setLabel] = useState("");
    const [category, setCategory] = useState("Core");
    const [loading, setLoading] = useState(false);

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "skills"), {
                label,
                category,
                status: "locked", // Default status
                parent_id: null, // For now, root nodes only or manual editing
                created_at: new Date(),
            });
            setLabel("");
            alert("Skill Architected!");
        } catch (error) {
            console.error("Error adding skill:", error);
            alert("Architecture Failed.");
        }
        setLoading(false);
    };

    return (
        <div className="p-6 border border-neon-purple/30 rounded bg-cyber-gray/20">
            <h2 className="text-xl text-neon-purple mb-4">SKILL ARCHITECT</h2>
            <form onSubmit={handleAddSkill} className="space-y-4">
                <div>
                    <label className="block text-xs text-neon-purple/70 mb-1">SKILL LABEL</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="w-full bg-cyber-black border border-neon-purple/50 p-2 text-neon-purple focus:outline-none focus:border-neon-purple"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-neon-purple/70 mb-1">CATEGORY</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-cyber-black border border-neon-purple/50 p-2 text-neon-purple focus:outline-none focus:border-neon-purple"
                    >
                        <option value="Core">Core</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Design">Design</option>
                    </select>
                </div>
                <CyberButton
                    type="submit"
                    disabled={loading}
                    variant="secondary"
                    className="w-full"
                >
                    {loading ? "COMPILING..." : "DEPLOY NODE"}
                </CyberButton>
            </form>
        </div>
    );
}
