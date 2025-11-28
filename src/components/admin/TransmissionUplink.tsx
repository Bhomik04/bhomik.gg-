"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CyberButton from "@/components/ui/CyberButton";

export default function TransmissionUplink() {
    const [message, setMessage] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddLog = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "activity_logs"), {
                message,
                url,
                type: "update",
                created_at: new Date(),
            });
            setMessage("");
            setUrl("");
            alert("Transmission Sent!");
        } catch (error) {
            console.error("Error adding log:", error);
            alert("Transmission Failed.");
        }
        setLoading(false);
    };

    return (
        <div className="p-6 border border-neon-green/30 rounded bg-cyber-gray/20">
            <h2 className="text-xl text-neon-green mb-4">TRANSMISSION UPLINK</h2>
            <form onSubmit={handleAddLog} className="space-y-4">
                <div>
                    <label className="block text-xs text-neon-green/70 mb-1">LOG MESSAGE</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-cyber-black border border-neon-green/50 p-2 text-neon-green focus:outline-none focus:border-neon-green h-24"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs text-neon-green/70 mb-1">REFERENCE URL (OPTIONAL)</label>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-cyber-black border border-neon-green/50 p-2 text-neon-green focus:outline-none focus:border-neon-green"
                    />
                </div>
                <CyberButton
                    type="submit"
                    disabled={loading}
                    variant="danger"
                    className="w-full !border-neon-green !text-neon-green hover:!bg-neon-green/10"
                >
                    {loading ? "UPLOADING..." : "BROADCAST"}
                </CyberButton>
            </form>
        </div>
    );
}
