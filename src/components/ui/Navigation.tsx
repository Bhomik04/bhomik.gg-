"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Brain, Terminal, User, Briefcase, Archive, Radio } from "lucide-react";
import { motion } from "framer-motion";

export default function Navigation() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams?.get("view");

    const links = [
        { href: "/", label: "STATS", icon: Home },
        { href: "/about", label: "PROFILE", icon: User },
        { href: "/projects", label: "MISSIONS", icon: Briefcase },
        { href: "/experience", label: "ARCHIVES", icon: Archive },
        { href: "/contact", label: "COMMS", icon: Radio },
        { href: "/?view=skills", label: "SKILL TREE", icon: Brain },
        { href: "/admin", label: "ADMIN", icon: Terminal },
    ];

    return (
        <nav className="pointer-events-auto fixed top-6 right-6 z-50 flex gap-2">
            {links.map((link) => {
                const Icon = link.icon;
                // Determine active state
                let isActive = false;
                if (link.label === "SKILL TREE") {
                    isActive = currentView === "skills";
                } else if (link.label === "STATS") {
                    isActive = pathname === "/" && !currentView;
                } else {
                    isActive = pathname === link.href;
                }

                return (
                    <Link
                        key={link.href}
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
                            {/* Top left corner */}
                            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current" />
                            {/* Bottom right corner */}
                            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current" />

                            <div className="flex items-center gap-2">
                                <Icon size={14} />
                                <span>{link.label}</span>
                            </div>
                        </motion.div>

                        {/* Active indicator glow */}
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
    );
}
