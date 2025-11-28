"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-12 px-4 md:px-12 bg-cyber-black relative overflow-y-auto overflow-x-hidden flex items-start md:items-center justify-center">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 py-4">

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple font-orbitron tracking-widest">
                            COMMS UPLINK
                        </h1>
                        <p className="text-neon-cyan/60 text-sm uppercase tracking-[0.3em] mt-2">
                            Establish secure connection
                        </p>
                    </div>

                    <div className="space-y-6">
                        <p className="text-gray-300 font-rajdhani text-lg">
                            Open to new alliances, mission contracts, and collaborative operations.
                            Transmit your signal below.
                        </p>

                        <div className="space-y-4">
                            <ContactLink
                                href="mailto:hello@example.com"
                                icon={Mail}
                                label="ENCRYPTED MAIL"
                                value="hello@example.com"
                            />
                            <ContactLink
                                href="https://github.com"
                                icon={Github}
                                label="CODE REPOSITORY"
                                value="github.com/username"
                            />
                            <ContactLink
                                href="https://linkedin.com"
                                icon={Linkedin}
                                label="PROFESSIONAL NETWORK"
                                value="linkedin.com/in/username"
                            />
                            <ContactLink
                                href="https://twitter.com"
                                icon={Twitter}
                                label="PUBLIC FEED"
                                value="@username"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-cyber-gray/20 border border-neon-cyan/30 p-6 md:p-8 rounded-lg backdrop-blur-sm relative"
                >
                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-cyan" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-cyan" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-cyan" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-cyan" />

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-neon-cyan/80">
                                Identity (Name)
                            </label>
                            <input
                                type="text"
                                className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-neon-cyan/80">
                                Return Address (Email)
                            </label>
                            <input
                                type="email"
                                className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                                placeholder="name@domain.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-neon-cyan/80">
                                Transmission (Message)
                            </label>
                            <textarea
                                rows={4}
                                className="w-full bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan focus:outline-none focus:border-neon-cyan transition-all font-mono"
                                placeholder="Type your message here..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan p-4 rounded hover:bg-neon-cyan hover:text-black transition-all font-bold tracking-widest uppercase flex items-center justify-center gap-2 group"
                        >
                            <span>Send Transmission</span>
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

function ContactLink({ href, icon: Icon, label, value }: { href: string; icon: any; label: string; value: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group p-4 border border-transparent hover:border-neon-cyan/30 hover:bg-neon-cyan/5 rounded transition-all"
        >
            <div className="bg-black/50 p-3 rounded text-neon-cyan group-hover:text-white group-hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all">
                <Icon size={24} />
            </div>
            <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</div>
                <div className="text-white font-mono group-hover:text-neon-cyan transition-colors">{value}</div>
            </div>
        </a>
    );
}
