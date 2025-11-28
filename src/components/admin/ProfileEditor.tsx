"use client";

import { useState, useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Save, User, Hash, Tag, FileText, Activity, Zap } from "lucide-react";
import { PlayerStats, Attributes } from "@/types/rpg";
import SkillPentagon from "@/components/features/SkillPentagon";

export default function ProfileEditor() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<PlayerStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            // Don't error immediately, just let it be in "offline" mode with no data or defaults
            return;
        }

        const unsubscribe = onSnapshot(doc(db, "player", "main"), 
            (docSnap) => {
                if (docSnap.exists()) {
                    setFormData(docSnap.data() as PlayerStats);
                } else {
                    // Default data if profile doesn't exist
                    setFormData({
                        name: "Bhomik Goyal",
                        class: "Netrunner",
                        level: 1,
                        currentXP: 0,
                        xpToNextLevel: 1000,
                        totalXP: 0,
                        status: "ONLINE",
                        location: "Night City",
                        bio: "",
                        attributes: {
                            technical: 3,
                            creative: 3,
                            intelligence: 3,
                            collaboration: 3,
                            learning: 3
                        },
                        attributeXP: {
                            technical: 0,
                            creative: 0,
                            intelligence: 0,
                            collaboration: 0,
                            learning: 0
                        }
                    });
                }
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Error fetching profile:", err);
                // If offline, we might get an error, but we can still show the form if we have data?
                // Or just show the error but allow retry.
                // For better UX, let's set default data if we fail so user can at least see the UI
                if (!formData) {
                     setFormData({
                        name: "Bhomik Goyal",
                        class: "Netrunner",
                        level: 1,
                        currentXP: 0,
                        xpToNextLevel: 1000,
                        totalXP: 0,
                        status: "OFFLINE",
                        location: "Unknown",
                        bio: "Connection lost...",
                        attributes: {
                            technical: 3,
                            creative: 3,
                            intelligence: 3,
                            collaboration: 3,
                            learning: 3
                        },
                        attributeXP: {
                            technical: 0,
                            creative: 0,
                            intelligence: 0,
                            collaboration: 0,
                            learning: 0
                        }
                    });
                }
                setLoading(false);
                // Don't block UI with error if we have fallback data
                // setError(err.message); 
            }
        );

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData || !db) return;
        
        setSaving(true);
        try {
            await setDoc(doc(db, "player", "main"), formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleAttributeChange = (attr: keyof Attributes, value: number) => {
        if (!formData) return;
        setFormData({
            ...formData,
            attributes: {
                ...formData.attributes,
                [attr]: value
            }
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="text-neon-cyan animate-pulse font-orbitron tracking-widest">ACCESSING MAINFRAME...</div>
            <div className="w-64 h-1 bg-gray-800 rounded overflow-hidden">
                <div className="h-full bg-neon-cyan animate-progress"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-neon-red">
            <div className="font-bold">CONNECTION ERROR</div>
            <div className="text-sm font-mono">{error}</div>
            <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 border border-neon-red hover:bg-neon-red/10 rounded transition-colors"
            >
                RETRY UPLINK
            </button>
        </div>
    );

    if (!formData) return <div className="text-red-500">Error loading data</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-neon-cyan/30 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-neon-cyan font-orbitron tracking-widest">
                        CHARACTER STATS EDITOR
                    </h2>
                    <p className="text-neon-cyan/50 text-xs uppercase tracking-wider">
                        Modify core identity parameters
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="profile-name" className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon-cyan/80">
                            <User size={14} /> Name
                        </label>
                        <input
                            id="profile-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="profile-class" className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon-cyan/80">
                            <Tag size={14} /> Class
                        </label>
                        <input
                            id="profile-class"
                            type="text"
                            value={formData.class}
                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="profile-level" className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon-cyan/80">
                            <Hash size={14} /> Level
                        </label>
                        <input
                            id="profile-level"
                            type="number"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                            className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="profile-status" className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon-cyan/80">
                            <Activity size={14} /> Status
                        </label>
                        <input
                            id="profile-status"
                            type="text"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="profile-bio" className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon-cyan/80">
                        <FileText size={14} /> Bio (Markdown Supported)
                    </label>
                    <textarea
                        id="profile-bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={6}
                        className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                    />
                </div>

                <div className="border-t border-neon-cyan/30 pt-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-neon-cyan font-orbitron tracking-widest mb-4 flex items-center gap-2">
                                <Zap size={20} /> ATTRIBUTES
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(formData.attributes).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <label htmlFor={`attr-${key}`} className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon-cyan/80">
                                            {key}
                                        </label>
                                        <input
                                            id={`attr-${key}`}
                                            type="number"
                                            value={value}
                                            onChange={(e) => handleAttributeChange(key as keyof Attributes, parseInt(e.target.value))}
                                            className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-center p-4 bg-black/30 rounded border border-neon-cyan/20">
                            <div className="w-[250px]">
                                <SkillPentagon skills={formData.attributes} maxValue={20} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-neon-cyan/20 hover:bg-neon-cyan/40 text-neon-cyan border border-neon-cyan px-6 py-3 rounded font-orbitron tracking-wider transition-all"
                    >
                        <Save size={18} />
                        {saving ? "SAVING..." : "SAVE CHANGES"}
                    </motion.button>
                </div>
            </form>
        </div>
    );
}
