"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Zap, Lock, Unlock, Star } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SkillPentagon from "../features/SkillPentagon";

interface Skill {
    id: string;
    label: string;
    category: string;
    status: "locked" | "unlocked" | "mastered";
}

export default function HudOverlay() {
    const [currentTime, setCurrentTime] = useState("");
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch skills from Firebase
    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }

        const unsubscribe = onSnapshot(
            collection(db, "skills"),
            (snapshot) => {
                const skillsData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Skill[];
                setSkills(skillsData);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching skills:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const attributes = [
        { name: "BODY", current: 3, max: 20 },
        { name: "REFLEX", current: 3, max: 20 },
        { name: "TECHNICAL", current: 3, max: 20 },
        { name: "INTELLIGENCE", current: 3, max: 20 },
        { name: "COOL", current: 3, max: 20 },
    ];

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    const getSkillIcon = (status: string) => {
        switch (status) {
            case "locked":
                return <Lock className="w-3 h-3" />;
            case "unlocked":
                return <Unlock className="w-3 h-3" />;
            case "mastered":
                return <Star className="w-3 h-3" />;
            default:
                return null;
        }
    };

    const getSkillColor = (status: string) => {
        switch (status) {
            case "locked":
                return "text-gray-600";
            case "unlocked":
                return "text-neon-cyan";
            case "mastered":
                return "text-neon-purple";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="pointer-events-none fixed inset-0 z-40 flex">
            {/* LEFT SIDEBAR - Stats */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-64 p-6 pt-20 flex flex-col gap-6"
            >
                {/* Header */}
                <div className="border-l-2 border-neon-cyan pl-4">
                    <div className="text-neon-cyan text-2xl font-bold tracking-wider">2</div>
                    <div className="text-neon-cyan/70 text-xs uppercase tracking-widest">STREET CRED</div>
                </div>

                {/* Attributes */}
                <div className="space-y-3">
                    {attributes.map((attr, idx) => (
                        <motion.div
                            key={attr.name}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className="pointer-events-auto cursor-pointer group"
                        >
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-neon-cyan" />
                                    <span className="text-neon-cyan/90 font-mono tracking-wider">{attr.name}</span>
                                </div>
                                <span className="text-neon-cyan font-bold">{attr.current}</span>
                            </div>
                            <div className="h-1 w-full bg-cyber-gray/30 mt-1 group-hover:bg-cyber-gray/50 transition-colors">
                                <div
                                    className="h-full bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,0.6)]"
                                    style={{ width: `${(attr.current / attr.max) * 100}%` }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pentagon Chart */}
                <SkillPentagon />
            </motion.div>

            {/* RIGHT SIDEBAR - Skills */}
            <div className="flex-1" />
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-80 p-6 pt-20 flex flex-col"
            >
                {/* Header */}
                <div className="border-l-2 border-neon-red pl-4 mb-6">
                    <div className="text-neon-red/90 text-xs uppercase tracking-widest mb-1">
                        SKILLS OVERVIEW
                    </div>
                    <div className="text-neon-cyan text-sm font-mono">
                        {skills.filter(s => s.status === "mastered").length} Mastered / {skills.length} Total
                    </div>
                </div>

                {/* Skills List */}
                <div className="space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar">
                    {loading ? (
                        <div className="text-neon-cyan/50 text-xs text-center">Loading skills...</div>
                    ) : Object.keys(groupedSkills).length === 0 ? (
                        <div className="text-neon-cyan/50 text-xs text-center">
                            No skills found. Add skills in Admin panel.
                        </div>
                    ) : (
                        Object.entries(groupedSkills).map(([category, categorySkills]) => (
                            <div key={category} className="space-y-2">
                                <div className="text-neon-purple/70 text-[10px] uppercase tracking-widest font-bold">
                                    {category}
                                </div>
                                {categorySkills.map((skill) => (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className={`pointer-events-auto cursor-pointer group flex items-center gap-2 hover:bg-neon-cyan/10 p-2 -mx-2 rounded transition-colors ${getSkillColor(skill.status)}`}
                                    >
                                        {getSkillIcon(skill.status)}
                                        <span className="text-xs uppercase tracking-wide font-mono flex-1">
                                            {skill.label}
                                        </span>
                                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))}
                            </div>
                        ))
                    )}
                </div>

                {/* Bottom Stats */}
                <div className="mt-auto pt-6 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-neon-cyan/50 uppercase tracking-widest">Time</span>
                        <span className="text-neon-cyan font-mono">{currentTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-neon-red/50 uppercase tracking-widest">Level</span>
                        <span className="text-neon-red font-bold">1</span>
                    </div>
                </div>
            </motion.div>

            {/* Top branding - moved to left */}
            <div className="absolute top-6 left-6 text-left pointer-events-none">
                <div className="text-neon-cyan text-sm font-bold tracking-[0.3em] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
                    BHOMIK GOYAL
                </div>
                <div className="text-neon-cyan/50 text-[10px] uppercase tracking-widest mt-1">
                    NETRUNNER // LVL 01
                </div>
            </div>
        </div>
    );
}
