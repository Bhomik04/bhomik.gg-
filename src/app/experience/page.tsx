"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";

interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    type: 'work' | 'education';
}

export default function ExperiencePage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const q = query(collection(db, "experience"), orderBy("order", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched: Experience[] = [];
            snapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() } as Experience);
            });
            setExperiences(fetched);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-12 px-4 md:px-12 bg-cyber-black relative overflow-y-auto overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple font-orbitron tracking-widest">
                        DATA ARCHIVES
                    </h1>
                    <p className="text-neon-cyan/60 text-sm uppercase tracking-[0.3em] mt-2">
                        Historical records and career trajectory
                    </p>
                </div>

                {loading ? (
                    <div className="text-neon-cyan animate-pulse font-mono">DECRYPTING ARCHIVES...</div>
                ) : (
                    <div className="relative border-l-2 border-neon-cyan/20 ml-2 md:ml-4 lg:ml-8 space-y-8 md:space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-6 md:pl-8 lg:pl-12"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${exp.type === 'work' ? 'border-neon-cyan bg-cyber-black' : 'border-neon-purple bg-cyber-black'} shadow-[0_0_10px_rgba(0,243,255,0.5)]`} />

                                <div className="bg-cyber-gray/20 border border-neon-cyan/10 p-4 md:p-6 rounded-lg hover:bg-cyber-gray/30 transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-white font-orbitron tracking-wide group-hover:text-neon-cyan transition-colors">
                                                {exp.role}
                                            </h3>
                                            <div className="text-neon-cyan/70 font-mono text-sm flex items-center gap-2">
                                                {exp.type === 'work' ? <Briefcase size={14} /> : <GraduationCap size={14} />}
                                                {exp.company}
                                            </div>
                                        </div>

                                        <div className="text-xs font-mono text-gray-400 bg-black/30 px-3 py-1 rounded border border-white/10 flex items-center gap-2 w-fit">
                                            <Calendar size={12} />
                                            {exp.period}
                                        </div>
                                    </div>

                                    <p className="text-gray-300 font-rajdhani leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
