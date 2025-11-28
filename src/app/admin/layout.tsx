"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { LayoutDashboard, Scroll, Network, Activity, LogOut, User, Briefcase, Archive, Radio } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
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
        <div className="min-h-screen bg-cyber-black text-white font-rajdhani flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-neon-cyan/20 bg-cyber-gray/30 backdrop-blur-sm p-6 flex flex-col h-screen sticky top-0">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-neon-cyan font-orbitron tracking-widest">
                        NETRUNNER
                    </h1>
                    <p className="text-xs text-neon-cyan/50 uppercase tracking-wider">
                        Admin Station v2.0
                    </p>
                </div>

                <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="text-xs text-neon-cyan/40 uppercase tracking-widest mb-2 mt-4">System</div>
                    <NavLink href="/admin" icon={LayoutDashboard} label="Overview" />

                    <div className="text-xs text-neon-cyan/40 uppercase tracking-widest mb-2 mt-6">Game Assets</div>
                    <NavLink href="/admin/quests" icon={Scroll} label="Quest Fabricator" />
                    <NavLink href="/admin/skills" icon={Network} label="Skill Architect" />

                    <div className="text-xs text-neon-cyan/40 uppercase tracking-widest mb-2 mt-6">Content</div>
                    <NavLink href="/admin/profile" icon={User} label="Character Stats" />
                    <NavLink href="/admin/projects" icon={Briefcase} label="Mission Log" />
                    <NavLink href="/admin/experience" icon={Archive} label="Data Archives" />

                    <div className="text-xs text-neon-cyan/40 uppercase tracking-widest mb-2 mt-6">Logs</div>
                    <NavLink href="/admin/logs" icon={Activity} label="Transmission Log" />
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded text-neon-red hover:bg-neon-red/10 border border-transparent hover:border-neon-red/30 transition-all mt-4"
                >
                    <LogOut size={20} />
                    <span className="uppercase tracking-wider text-sm">Disconnect</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen bg-[url('/grid.svg')] bg-opacity-5 pt-20">
                <div className="p-8 max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}

function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 p-3 rounded text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/30 transition-all group"
        >
            <Icon size={20} className="group-hover:shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
            <span className="uppercase tracking-wider text-sm">{label}</span>
        </Link>
    );
}
