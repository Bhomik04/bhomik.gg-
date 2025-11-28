"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Zap, Target, Network, Activity, LucideIcon } from "lucide-react";
import SkillPentagon from "@/components/features/SkillPentagon";
import { PlayerStats } from "@/types/rpg";

import QuestLog from "@/components/features/QuestLog";

export default function AdminOverview() {
    const [stats, setStats] = useState({
        skills: 0,
        quests: 0,
        projects: 0,
        experiences: 0
    });
    const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            if (!db) return;
            try {
                const [skillsSnap, questsSnap, projectsSnap, experiencesSnap, playerSnap] = await Promise.all([
                    getDocs(collection(db, "skills")),
                    getDocs(collection(db, "quests")),
                    getDocs(collection(db, "projects")),
                    getDocs(collection(db, "experience")),
                    getDoc(doc(db, "player", "main"))
                ]);

                setStats({
                    skills: skillsSnap.size,
                    quests: questsSnap.size,
                    projects: projectsSnap.size,
                    experiences: experiencesSnap.size
                });

                if (playerSnap.exists()) {
                    setPlayerStats(playerSnap.data() as PlayerStats);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="border-b border-neon-cyan/30 pb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-neon-cyan font-orbitron tracking-widest">
                    SYSTEM OVERVIEW
                </h1>
                <p className="text-neon-cyan/50 text-xs uppercase tracking-wider mt-2">
                    Netrunner Station Dashboard
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard
                    icon={Network}
                    label="Skills"
                    value={stats.skills}
                    color="cyan"
                />
                <StatCard
                    icon={Target}
                    label="Quests"
                    value={stats.quests}
                    color="purple"
                />
                <StatCard
                    icon={Zap}
                    label="Projects"
                    value={stats.projects}
                    color="cyan"
                />
                <StatCard
                    icon={Activity}
                    label="Experiences"
                    value={stats.experiences}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                <div className="bg-cyber-gray/20 border border-neon-cyan/20 p-4 md:p-6 rounded-lg flex flex-col items-center justify-center">
                    <h2 className="text-lg md:text-xl font-bold text-neon-cyan mb-4 font-orbitron self-start">
                        ATTRIBUTE MATRIX
                    </h2>
                    {playerStats ? (
                        <div className="w-full max-w-[300px]">
                            <SkillPentagon skills={playerStats.attributes} maxValue={20} />
                        </div>
                    ) : (
                        <div className="text-neon-cyan/50 animate-pulse">Loading Matrix...</div>
                    )}
                </div>

                <div className="bg-cyber-gray/20 border border-neon-cyan/20 p-4 md:p-6 rounded-lg">
                    <h2 className="text-lg md:text-xl font-bold text-neon-cyan mb-4 font-orbitron">
                        QUICK ACTIONS
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        <QuickLink
                            href="/admin/profile"
                            label="Edit Character Stats"
                            description="Modify bio, level, and class"
                        />
                        <QuickLink
                            href="/admin/projects"
                            label="Manage Missions"
                            description="Add or update project entries"
                        />
                        <QuickLink
                            href="/admin/skills"
                            label="Update Skill Tree"
                            description="Add new skills and nodes"
                        />
                        <QuickLink
                            href="/admin/quests"
                            label="Create Quests"
                            description="Design new challenges"
                        />
                    </div>
                </div>

                <div className="bg-cyber-gray/20 border border-neon-cyan/20 p-6 rounded-lg">
                    <QuestLog />
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: number; color: 'cyan' | 'purple' | 'green' }) {
    const colorMap: Record<string, string> = {
        cyan: "text-neon-cyan border-neon-cyan",
        purple: "text-neon-purple border-neon-purple",
        green: "text-neon-green border-neon-green"
    };

    return (
        <div className={`bg-black/40 border ${colorMap[color]} p-4 md:p-6 rounded-lg hover:bg-black/60 transition-all`}>
            <div className="flex items-center justify-between mb-2">
                <Icon size={20} className={`md:w-6 md:h-6 ${colorMap[color]}`} />
                <span className="text-2xl md:text-3xl font-bold text-white font-orbitron">{value}</span>
            </div>
            <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider">{label}</div>
        </div>
    );
}

function QuickLink({ href, label, description }: { href: string; label: string; description: string }) {
    return (
        <a
            href={href}
            className="block p-3 md:p-4 bg-black/30 border border-neon-cyan/20 rounded hover:border-neon-cyan/50 hover:bg-black/50 transition-all group touch-manipulation"
        >
            <h3 className="text-sm md:text-base text-neon-cyan font-bold mb-1 group-hover:text-white transition-colors">{label}</h3>
            <p className="text-[10px] md:text-xs text-gray-500">{description}</p>
        </a>
    );
}
