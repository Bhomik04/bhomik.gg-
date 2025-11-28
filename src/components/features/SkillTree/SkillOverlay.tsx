"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SkillGraph from "./SkillGraph";
import Link from "next/link";

export default function SkillOverlay({ isOpen }: { isOpen: boolean }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-10"
                >
                    <div className="relative w-full h-full max-w-7xl flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 border-b border-neon-cyan/30 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-neon-cyan tracking-widest font-orbitron">
                                    NEURAL INTERFACE // SKILL TREE
                                </h2>
                                <p className="text-neon-cyan/50 text-xs uppercase tracking-wider">
                                    Upgrade your neural pathways
                                </p>
                            </div>

                            <Link
                                href="/"
                                className="group flex items-center gap-2 text-neon-red hover:text-white transition-colors"
                            >
                                <span className="text-xs uppercase tracking-widest group-hover:underline">Close Uplink</span>
                                <div className="border border-neon-red p-1 group-hover:bg-neon-red group-hover:text-black transition-colors">
                                    <X size={20} />
                                </div>
                            </Link>
                        </div>

                        {/* Content */}
                        <div className="flex-1 relative overflow-hidden rounded-lg border border-neon-cyan/20 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                            <SkillGraph className="h-full w-full" />

                            {/* Decorative corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
