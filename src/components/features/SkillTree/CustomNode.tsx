"use client";

import { Handle, Position } from "reactflow";
import { Lock, Zap } from "lucide-react";
import clsx from "clsx";

interface CustomNodeProps {
    data: {
        label: string;
        status: "locked" | "unlocked" | "mastered";
        category: string;
    };
}

export default function CustomNode({ data }: CustomNodeProps) {
    const isLocked = data.status === "locked";
    const isMastered = data.status === "mastered";

    return (
        <div
            className={clsx(
                "relative flex items-center gap-2 px-4 py-2 rounded-md border-2 transition-all duration-300 min-w-[150px]",
                isLocked
                    ? "bg-cyber-gray/50 border-gray-600 text-gray-500 grayscale"
                    : isMastered
                        ? "bg-neon-purple/10 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.4)]"
                        : "bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.3)]"
            )}
        >
            <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />

            <div className={clsx(
                "p-1 rounded-full border",
                isLocked ? "border-gray-500" : isMastered ? "border-neon-purple" : "border-neon-cyan"
            )}>
                {isLocked ? <Lock size={12} /> : <Zap size={12} />}
            </div>

            <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider">{data.label}</span>
                <span className="text-[10px] opacity-70">{data.category}</span>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
        </div>
    );
}
