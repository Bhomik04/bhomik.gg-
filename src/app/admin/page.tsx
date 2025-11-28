"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import QuestFabricator from "@/components/admin/QuestFabricator";
import SkillArchitect from "@/components/admin/SkillArchitect";
import TransmissionUplink from "@/components/admin/TransmissionUplink";
import { clsx } from "clsx";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"quests" | "skills" | "logs">("quests");

    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b border-gray-800 pb-2">
                <button
                    onClick={() => setActiveTab("quests")}
                    className={clsx(
                        "px-4 py-2 text-sm font-mono transition-colors",
                        activeTab === "quests"
                            ? "text-neon-cyan border-b-2 border-neon-cyan bg-neon-cyan/10"
                            : "text-gray-500 hover:text-neon-cyan/70"
                    )}
                >
                    QUESTS
                </button>
                <button
                    onClick={() => setActiveTab("skills")}
                    className={clsx(
                        "px-4 py-2 text-sm font-mono transition-colors",
                        activeTab === "skills"
                            ? "text-neon-purple border-b-2 border-neon-purple bg-neon-purple/10"
                            : "text-gray-500 hover:text-neon-purple/70"
                    )}
                >
                    SKILLS
                </button>
                <button
                    onClick={() => setActiveTab("logs")}
                    className={clsx(
                        "px-4 py-2 text-sm font-mono transition-colors",
                        activeTab === "logs"
                            ? "text-neon-green border-b-2 border-neon-green bg-neon-green/10"
                            : "text-gray-500 hover:text-neon-green/70"
                    )}
                >
                    LOGS
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {activeTab === "quests" && <QuestFabricator />}
                    {activeTab === "skills" && <SkillArchitect />}
                    {activeTab === "logs" && <TransmissionUplink />}
                </div>

                <div className="p-6 border border-gray-800 rounded bg-cyber-black/50">
                    <h3 className="text-gray-400 text-xs mb-4">SYSTEM STATUS</h3>
                    <div className="space-y-2 text-xs font-mono text-gray-500">
                        <div className="flex justify-between">
                            <span>DATABASE CONNECTION</span>
                            <span className="text-neon-green">ACTIVE</span>
                        </div>
                        <div className="flex justify-between">
                            <span>LAST SYNC</span>
                            <span>{new Date().toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>SECURITY LEVEL</span>
                            <span className="text-neon-red">MAXIMUM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
