"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Github, Link as LinkIcon, Code } from "lucide-react";

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    image_url: string;
    demo_url: string;
    repo_url: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched: Project[] = [];
            snapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() } as Project);
            });
            setProjects(fetched);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-12 px-4 md:px-12 bg-cyber-black relative overflow-y-auto overflow-x-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple font-orbitron tracking-widest">
                        MISSION LOG
                    </h1>
                    <p className="text-neon-cyan/60 text-sm uppercase tracking-[0.3em] mt-2">
                        Completed operations and deployed systems
                    </p>
                </div>

                {loading ? (
                    <div className="text-neon-cyan animate-pulse font-mono">LOADING MISSION DATA...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-cyber-gray/30 border border-neon-cyan/20 rounded-lg overflow-hidden hover:border-neon-cyan/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]"
                            >
                                {/* Image / Thumbnail */}
                                <div className="h-36 md:h-48 bg-black/50 relative overflow-hidden">
                                    {project.image_url ? (
                                        <img
                                            src={project.image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyber-black to-cyber-gray">
                                            <Code size={48} className="text-neon-cyan/20" />
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent" />
                                </div>

                                <div className="p-4 md:p-6 relative">
                                    <h3 className="text-xl font-bold text-white font-orbitron tracking-wide mb-2 group-hover:text-neon-cyan transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 font-rajdhani">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tech_stack.map((tech, i) => (
                                            <span key={i} className="text-[10px] uppercase tracking-wider bg-neon-cyan/5 text-neon-cyan px-2 py-1 rounded border border-neon-cyan/10">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 mt-auto">
                                        {project.demo_url && (
                                            <a
                                                href={project.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon-cyan hover:text-white transition-colors"
                                            >
                                                <LinkIcon size={14} /> Live Demo
                                            </a>
                                        )}
                                        {project.repo_url && (
                                            <a
                                                href={project.repo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neon-purple hover:text-white transition-colors"
                                            >
                                                <Github size={14} /> Source Code
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-neon-cyan/20 border-r-transparent group-hover:border-t-neon-cyan/50 transition-all" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
