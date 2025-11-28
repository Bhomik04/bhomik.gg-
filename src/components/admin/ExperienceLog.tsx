"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, Plus, Trash2, Edit, Save, Calendar, Building } from "lucide-react";

interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    type: 'work' | 'education';
    order: number;
}

export default function ExperienceLog() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Experience, "id">>({
        role: "",
        company: "",
        period: "",
        description: "",
        type: "work",
        order: 0
    });

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, "experience"), orderBy("order", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched: Experience[] = [];
            snapshot.forEach((doc) => {
                fetched.push({ id: doc.id, ...doc.data() } as Experience);
            });
            setExperiences(fetched);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;
        try {
            if (editingId) {
                await updateDoc(doc(db, "experience", editingId), formData);
                setEditingId(null);
            } else {
                await addDoc(collection(db, "experience"), formData);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving experience:", error);
        }
    };

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.id);
        setFormData({
            role: exp.role,
            company: exp.company,
            period: exp.period,
            description: exp.description,
            type: exp.type,
            order: exp.order
        });
    };

    const handleDelete = async (id: string) => {
        if (!db) return;
        if (confirm("Are you sure you want to delete this entry?")) {
            await deleteDoc(doc(db, "experience", id));
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            role: "",
            company: "",
            period: "",
            description: "",
            type: "work",
            order: 0
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-neon-cyan/30 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-neon-cyan font-orbitron tracking-widest">
                        DATA ARCHIVES
                    </h2>
                    <p className="text-neon-cyan/50 text-xs uppercase tracking-wider">
                        Manage work history and education logs
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-cyber-gray/30 p-6 rounded border border-neon-cyan/20">
                <h3 className="text-lg font-bold text-neon-cyan mb-4 flex items-center gap-2">
                    {editingId ? <Edit size={18} /> : <Plus size={18} />}
                    {editingId ? "EDIT ARCHIVE" : "NEW ARCHIVE ENTRY"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Role / Degree"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Company / Institution"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Period (e.g. 2020 - Present)"
                            value={formData.period}
                            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                            className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full"
                            required
                        />
                        <select
                            aria-label="Experience Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'work' | 'education' })}
                            className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full"
                        >
                            <option value="work">Work Experience</option>
                            <option value="education">Education</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Order (Year)"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full"
                        />
                    </div>

                    <textarea
                        placeholder="Description / Achievements"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full h-24"
                        required
                    />

                    <div className="flex gap-2 justify-end">
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-neon-red border border-neon-red/30 rounded hover:bg-neon-red/10"
                            >
                                CANCEL
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-neon-cyan/20 border border-neon-cyan text-neon-cyan px-6 py-2 rounded hover:bg-neon-cyan hover:text-black transition-all font-bold tracking-widest uppercase flex items-center gap-2"
                        >
                            <Save size={18} /> {editingId ? "UPDATE ARCHIVE" : "ARCHIVE DATA"}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {experiences.map((exp) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/40 border border-neon-cyan/20 p-4 rounded hover:border-neon-cyan/50 transition-all group flex justify-between items-center"
                        >
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${exp.type === 'work' ? 'border-neon-purple text-neon-purple' : 'border-neon-cyan text-neon-cyan'}`}>
                                        {exp.type.toUpperCase()}
                                    </span>
                                    <span className="text-gray-500 text-xs flex items-center gap-1"><Calendar size={10} /> {exp.period}</span>
                                </div>
                                <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                                <div className="text-neon-cyan/70 text-sm flex items-center gap-1 mb-2"><Building size={12} /> {exp.company}</div>
                                <p className="text-sm text-gray-400 line-clamp-1">{exp.description}</p>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(exp)} aria-label="Edit Experience" className="text-neon-cyan hover:text-white p-2"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(exp.id)} aria-label="Delete Experience" className="text-neon-red hover:text-white p-2"><Trash2 size={18} /></button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
