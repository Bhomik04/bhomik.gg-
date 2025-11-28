"use client";

export const dynamic = 'force-dynamic';

import SkillGraph from "@/components/features/SkillTree/SkillGraph";

export default function SkillsPage() {
    return (
        <div className="container mx-auto p-8 pt-24 min-h-screen flex flex-col gap-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                    NEURAL SKILL MATRIX
                </h1>
                <p className="text-neon-red font-mono tracking-widest text-sm">
          // ACCESSING CORTEX DATABASE...
                </p>
            </div>

            <SkillGraph />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-cyber-gray">
                <div className="border border-neon-cyan/20 p-4 rounded bg-cyber-black/50">
                    <h3 className="text-neon-cyan mb-2">LEGEND</h3>
                    <ul className="space-y-1">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_5px_#b026ff]"></span>
                            <span className="text-neon-purple">MASTERED</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_5px_#00f3ff]"></span>
                            <span className="text-neon-cyan">UNLOCKED</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
                            <span className="text-gray-500">LOCKED</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
