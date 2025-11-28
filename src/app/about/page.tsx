"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import AvatarScene from "@/components/canvas/AvatarScene";
import ReactMarkdown from "react-markdown";
import SkillPentagon from "@/components/features/SkillPentagon";
import { PlayerStats } from "@/types/rpg";

export default function AboutPage() {
    const [profile, setProfile] = useState<PlayerStats | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!db) return;
            const docRef = doc(db, "player", "main");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data() as PlayerStats);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
            {/* Background 3D Scene (Dimmed) */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <AvatarScene />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20 md:py-24 min-h-full flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-start md:justify-center">
                {/* Character Card */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full md:w-1/3 bg-cyber-black/80 border border-neon-cyan/30 p-1 backdrop-blur-md rounded-lg relative flex-shrink-0"
                >
                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />

                    <div className="bg-cyber-gray/50 p-6 rounded h-full flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full border-2 border-neon-cyan mb-4 overflow-hidden relative shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                            {/* Placeholder for user image if we had one, or just use the 3D model context */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neon-cyan/20" />
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-white font-orbitron tracking-widest mb-1">
                            {profile?.name || "BHOMIK GOYAL"}
                        </h2>
                        <div className="text-neon-cyan font-mono text-sm mb-4">
                            LVL {profile?.level || 1} {profile?.class || "NETRUNNER"}
                        </div>

                        <div className="w-full h-[1px] bg-neon-cyan/30 my-4" />

                        <div className="grid grid-cols-2 gap-4 w-full text-left text-xs font-mono mb-6">
                            <div>
                                <span className="text-gray-500 block">STATUS</span>
                                <span className="text-neon-green">{profile?.status || "ONLINE"}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">LOCATION</span>
                                <span className="text-white">{profile?.location || "NIGHT CITY"}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bio / Lore */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full md:w-2/3"
                >
                    <div className="mb-6">
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple font-orbitron tracking-widest">
                            CHARACTER LORE
                        </h1>
                        <p className="text-neon-cyan/60 text-sm uppercase tracking-[0.3em] mt-2">
                            {/* Tagline is not in PlayerStats, maybe add it or use bio snippet */}
                            INITIALIZING NEURAL HANDSHAKE...
                        </p>
                    </div>

                    <div className="bg-black/40 border-l-2 border-neon-cyan p-4 md:p-6 backdrop-blur-sm text-gray-300 leading-relaxed font-rajdhani text-base md:text-lg max-h-[300px] md:h-[400px] overflow-y-auto custom-scrollbar">
                        {profile?.bio ? (
                            <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-neon-cyan prose-strong:text-neon-purple">
                                <ReactMarkdown>
                                    {profile.bio}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-neon-cyan/30 animate-pulse">
                                AWAITING DATA UPLINK...
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
