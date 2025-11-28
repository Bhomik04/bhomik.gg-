"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Home, Brain, Terminal, User, Briefcase, Archive, Radio, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams?.get("view");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Main navigation links
    const mainLinks = [
        { href: "/", label: "STATS", shortLabel: "STATS", icon: Home },
        { href: "/about", label: "PROFILE", shortLabel: "ME", icon: User },
        { href: "/projects", label: "MISSIONS", shortLabel: "WORK", icon: Briefcase },
        { href: "/?view=skills", label: "SKILL TREE", shortLabel: "SKILLS", icon: Brain },
        { href: "/contact", label: "COMMS", shortLabel: "CHAT", icon: Radio },
    ];

    // Secondary links (shown in expanded menu)
    const secondaryLinks = [
        { href: "/experience", label: "ARCHIVES", icon: Archive },
        { href: "/admin", label: "ADMIN", icon: Terminal },
    ];

    const allLinks = [...mainLinks, ...secondaryLinks];

    const isLinkActive = (link: { href: string; label: string }) => {
        if (link.label === "SKILL TREE") {
            return currentView === "skills";
        } else if (link.label === "STATS") {
            return pathname === "/" && !currentView;
        } else {
            return pathname === link.href;
        }
    };

    return (
        <>
            {/* Desktop Navigation - Top Right */}
            <nav className="pointer-events-auto fixed top-6 right-6 z-50 hidden md:flex gap-2">
                {allLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = isLinkActive(link);

                    return (
                        <Link
                            key={link.href + link.label}
                            href={link.href}
                            className="relative group"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`
                                    relative px-4 py-2 font-mono text-xs uppercase tracking-widest
                                    transition-all duration-300
                                    ${isActive
                                        ? 'bg-neon-cyan/20 text-neon-cyan border-b-2 border-neon-cyan'
                                        : 'text-neon-cyan/50 hover:text-neon-cyan hover:bg-neon-cyan/10 border-b-2 border-transparent'
                                    }
                                `}
                            >
                                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current" />
                                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current" />
                                <div className="flex items-center gap-2">
                                    <Icon size={14} />
                                    <span>{link.label}</span>
                                </div>
                            </motion.div>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-neon-cyan/10 -z-10 blur-md"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="pointer-events-auto fixed bottom-0 left-0 right-0 z-50 md:hidden bg-cyber-black/95 backdrop-blur-lg border-t border-neon-cyan/20 safe-area-bottom">
                <div className="flex justify-around items-center h-16 px-2">
                    {mainLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = isLinkActive(link);

                        return (
                            <Link
                                key={link.href + link.label}
                                href={link.href}
                                className="relative flex flex-col items-center justify-center flex-1 py-2 touch-manipulation"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={`flex flex-col items-center gap-1 transition-all duration-200 ${isActive ? 'text-neon-cyan' : 'text-gray-500'}`}
                                >
                                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-neon-cyan/20' : ''}`}>
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <span className="text-[10px] font-mono uppercase tracking-wider">
                                        {link.shortLabel}
                                    </span>
                                </motion.div>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobileActiveTab"
                                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-neon-cyan rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                    />
                                )}
                            </Link>
                        );
                    })}

                    {/* More Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex flex-col items-center justify-center flex-1 py-2 touch-manipulation"
                    >
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            className={`flex flex-col items-center gap-1 transition-all duration-200 ${mobileMenuOpen ? 'text-neon-cyan' : 'text-gray-500'}`}
                        >
                            <div className={`p-1.5 rounded-lg ${mobileMenuOpen ? 'bg-neon-cyan/20' : ''}`}>
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-wider">MORE</span>
                        </motion.div>
                    </button>
                </div>
            </nav>

            {/* Mobile Expanded Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="pointer-events-auto fixed bottom-16 left-0 right-0 z-40 md:hidden bg-cyber-black/95 backdrop-blur-lg border-t border-neon-cyan/20 p-4"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {secondaryLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = isLinkActive(link);

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all touch-manipulation ${
                                            isActive
                                                ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                                                : 'bg-cyber-gray/30 border-neon-cyan/20 text-gray-400'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className="text-sm font-mono uppercase tracking-wider">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
