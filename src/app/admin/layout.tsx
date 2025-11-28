"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { LayoutDashboard, Scroll, Network, Activity, LogOut, User, Briefcase, Archive, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const ADMIN_EMAIL = "bhomikgoyal2004@gmail.com";

        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
            } else if (user.email !== ADMIN_EMAIL) {
                // User is logged in but not authorized
                alert("Access Denied: You are not authorized to access the admin panel.");
                if (auth) signOut(auth);
                router.push("/");
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        if (auth) await signOut(auth);
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cyber-black flex items-center justify-center">
                <div className="text-neon-cyan font-orbitron animate-pulse">
                    VERIFYING NEURAL LINK...
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-cyber-black text-white font-rajdhani flex flex-col md:flex-row overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-cyber-black/95 backdrop-blur-lg border-b border-neon-cyan/20 px-4 py-3 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold text-neon-cyan font-orbitron tracking-widest">
                        NETRUNNER
                    </h1>
                    <p className="text-[10px] text-neon-cyan/50 uppercase tracking-wider">
                        Admin Station
                    </p>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-neon-cyan touch-manipulation"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden fixed inset-0 z-40 bg-black/50"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:relative z-50 md:z-auto
                    w-64 border-r border-neon-cyan/20 bg-cyber-gray/95 md:bg-cyber-gray/30 
                    backdrop-blur-lg md:backdrop-blur-sm p-6 flex flex-col h-screen 
                    top-0 left-0 md:sticky
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    transition-transform md:transition-none duration-300
                `}
            >
                        <div className="mb-10 hidden md:block">
                            <h1 className="text-2xl font-bold text-neon-cyan font-orbitron tracking-widest">
                                NETRUNNER
                            </h1>
                            <p className="text-xs text-neon-cyan/50 uppercase tracking-wider">
                                Admin Station v2.0
                            </p>
                        </div>

                        {/* Close button for mobile */}
                        <div className="md:hidden mb-6 pt-2">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-neon-cyan/70 text-xs uppercase tracking-wider"
                            >
                                ← Close Menu
                            </button>
                        </div>

                        <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
                            <div className="text-xs text-neon-cyan/40 uppercase tracking-widest mb-2 mt-4">System</div>
                            <NavLink href="/admin" icon={LayoutDashboard} label="Overview" onClick={() => setSidebarOpen(false)} />

                            <div className="text-xs text-neon-cyan/40 uppercase tracking-widest mb-2 mt-6">Game Assets</div>
                            <NavLink href="/admin/quests" icon={Scroll} label="Quest Fabricator" onClick={() => setSidebarOpen(false)} />
                            <NavLink href="/admin/skills" icon={Network} label="Skill Architect" onClick={() => setSidebarOpen(false)} />

                            <div className="text-xs text-neon-cyan/40 uppercase tracking-widest mb-2 mt-6">Content</div>
                            <NavLink href="/admin/profile" icon={User} label="Character Stats" onClick={() => setSidebarOpen(false)} />
                            <NavLink href="/admin/projects" icon={Briefcase} label="Mission Log" onClick={() => setSidebarOpen(false)} />
                            <NavLink href="/admin/experience" icon={Archive} label="Data Archives" onClick={() => setSidebarOpen(false)} />

                            <div className="text-xs text-neon-cyan/40 uppercase tracking-widest mb-2 mt-6">Logs</div>
                            <NavLink href="/admin/logs" icon={Activity} label="Transmission Log" onClick={() => setSidebarOpen(false)} />
                        </nav>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 rounded text-neon-red hover:bg-neon-red/10 border border-transparent hover:border-neon-red/30 transition-all mt-4 touch-manipulation"
                        >
                            <LogOut size={20} />
                            <span className="uppercase tracking-wider text-sm">Disconnect</span>
                        </button>
                    </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen bg-[url('/grid.svg')] bg-opacity-5 pt-16 md:pt-8 pb-20 md:pb-8">
                <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}

function NavLink({ href, icon: Icon, label, onClick }: { href: string; icon: any; label: string; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 p-3 rounded text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/30 transition-all group touch-manipulation"
        >
            <Icon size={20} className="group-hover:shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
            <span className="uppercase tracking-wider text-sm">{label}</span>
        </Link>
    );
}
