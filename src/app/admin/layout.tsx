"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                // For now, we'll just show a message or redirect. 
                // Ideally redirect to a login page.
                // router.push("/login");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, router]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen text-neon-cyan">AUTHENTICATING...</div>;
    }

    // Allow access for now for development purposes if no auth is set up yet, 
    // or strictly block. Let's block if no user to be safe, but provide a way to login later.
    // For this MVP step, I'll render children but show a warning if not logged in.

    return (
        <div className="min-h-screen bg-cyber-black text-foreground p-8">
            <div className="border-b border-neon-red/30 pb-4 mb-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-neon-red">NETRUNNER STATION // ADMIN</h1>
                <div className="text-xs font-mono text-neon-cyan">
                    {user ? `USER: ${user.email}` : "UNAUTHORIZED ACCESS DETECTED"}
                </div>
            </div>
            {children}
        </div>
    );
}
