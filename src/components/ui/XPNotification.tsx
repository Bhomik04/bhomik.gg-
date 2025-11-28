"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityLog } from "@/types/rpg";
import { Zap, Trophy, Star, ArrowUp } from "lucide-react";

export default function XPNotification() {
    const [notification, setNotification] = useState<ActivityLog | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!db) return;

        // Listen for the most recent activity log
        const q = query(
            collection(db, "activity_logs"),
            orderBy("timestamp", "desc"),
            limit(1)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data() as ActivityLog;
                    // Only show notifications for events that happened just now (within last 5 seconds)
                    // This prevents showing old logs on page load
                    const now = Timestamp.now();
                    const diff = now.seconds - data.timestamp.seconds;
                    
                    if (diff < 5) {
                        setNotification(data);
                        setVisible(true);
                        
                        // Auto hide after 3 seconds
                        setTimeout(() => {
                            setVisible(false);
                        }, 3000);
                    }
                }
            });
        });

        return () => unsubscribe();
    }, []);

    return (
        <AnimatePresence>
            {visible && notification && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    className="fixed bottom-8 right-8 z-50 pointer-events-none"
                >
                    <div className="bg-black/80 border border-neon-cyan/50 p-4 rounded shadow-[0_0_15px_rgba(0,243,255,0.3)] backdrop-blur-md flex items-center gap-4 min-w-[300px]">
                        <div className="bg-neon-cyan/20 p-2 rounded-full border border-neon-cyan">
                            {notification.levelUp ? (
                                <Trophy className="text-neon-yellow w-6 h-6 animate-pulse" />
                            ) : notification.type === 'quest' ? (
                                <Star className="text-neon-purple w-6 h-6" />
                            ) : (
                                <Zap className="text-neon-cyan w-6 h-6" />
                            )}
                        </div>
                        
                        <div>
                            <h4 className="text-neon-cyan font-bold font-orbitron text-sm tracking-wider">
                                {notification.levelUp ? "LEVEL UP!" : "SYSTEM UPDATE"}
                            </h4>
                            <p className="text-gray-300 text-xs font-mono">
                                {notification.message}
                            </p>
                            {notification.xpGained > 0 && (
                                <div className="text-neon-yellow text-xs font-bold mt-1 flex items-center gap-1">
                                    <ArrowUp size={10} /> {notification.xpGained} XP GAINED
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
