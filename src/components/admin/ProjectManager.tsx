"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, Save, X, Link as LinkIcon, Github, Image as ImageIcon, Zap } from "lucide-react";
import { Attributes } from "@/types/rpg";

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    image_url: string;
    demo_url: string;
    repo_url: string;
    order: number;
    xpGranted?: number;
    attributeBonus?: Partial<Attributes>;
}

export default function ProjectManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Project, "id">>({
        title: "",
        description: "",
        tech_stack: [],
        image_url: "",
        demo_url: "",
        repo_url: "",
        order: 0,
        xpGranted: 100,
        attributeBonus: {}
    });
    const [techInput, setTechInput] = useState("");

    useEffect(() => {
        if (!db) return;
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedProjects: Project[] = [];
            snapshot.forEach((doc) => {
                fetchedProjects.push({ id: doc.id, ...doc.data() } as Project);
            });
            setProjects(fetchedProjects);
        });
        return () => unsubscribe();
    }, []);

    const handleAddTech = () => {
        if (techInput.trim()) {
            setFormData({ ...formData, tech_stack: [...formData.tech_stack, techInput.trim()] });
            setTechInput("");
        }
    };

    const removeTech = (index: number) => {
        const newStack = [...formData.tech_stack];
        newStack.splice(index, 1);
        setFormData({ ...formData, tech_stack: newStack });
    };

    const handleAttributeChange = (attr: keyof Attributes, value: number) => {
        const currentBonus = formData.attributeBonus || {};
        if (value === 0) {
            const newBonus = { ...currentBonus };
            delete newBonus[attr];
            setFormData({ ...formData, attributeBonus: newBonus });
        } else {
            setFormData({ ...formData, attributeBonus: { ...currentBonus, [attr]: value } });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!db) return;
        try {
            if (editingId) {
                await updateDoc(doc(db, "projects", editingId), formData);
                setEditingId(null);
            } else {
                await addDoc(collection(db, "projects"), formData);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setFormData({
            title: project.title,
            description: project.description,
            tech_stack: project.tech_stack,
            image_url: project.image_url,
            demo_url: project.demo_url,
            repo_url: project.repo_url,
            order: project.order,
            xpGranted: project.xpGranted || 100,
            attributeBonus: project.attributeBonus || {}
        });
    };

    const handleDelete = async (id: string) => {
        if (!db) return;
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteDoc(doc(db, "projects", id));
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: "",
            description: "",
            tech_stack: [],
            image_url: "",
            demo_url: "",
            repo_url: "",
            order: 0,
            xpGranted: 100,
            attributeBonus: {}
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-neon-cyan/30 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-neon-cyan font-orbitron tracking-widest">
                        MISSION LOG MANAGER
                    </h2>
                    <p className="text-neon-cyan/50 text-xs uppercase tracking-wider">
                        Manage completed projects and case studies
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-cyber-gray/30 p-6 rounded border border-neon-cyan/20">
                <h3 className="text-lg font-bold text-neon-cyan mb-4 flex items-center gap-2">
                    {editingId ? <Edit size={18} /> : <Plus size={18} />}
                    {editingId ? "EDIT MISSION" : "NEW MISSION"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Mission Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Sort Order"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full"
                        />
                    </div>

                    <textarea
                        placeholder="Mission Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full h-24"
                        required
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <div className="relative">
                            <ImageIcon size={16} className="absolute top-3 left-3 text-neon-cyan/50" />
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="bg-black/50 border border-neon-cyan/30 rounded p-3 pl-10 text-neon-cyan w-full"
                            />
                        </div>
                        <div className="relative">
                            <LinkIcon size={16} className="absolute top-3 left-3 text-neon-cyan/50" />
                            <input
                                type="text"
                                placeholder="Demo URL"
                                value={formData.demo_url}
                                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                                className="bg-black/50 border border-neon-cyan/30 rounded p-3 pl-10 text-neon-cyan w-full"
                            />
                        </div>
                        <div className="relative">
                            <Github size={16} className="absolute top-3 left-3 text-neon-cyan/50" />
                            <input
                                type="text"
                                placeholder="Repo URL"
                                value={formData.repo_url}
                                onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                                className="bg-black/50 border border-neon-cyan/30 rounded p-3 pl-10 text-neon-cyan w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Add Tech Stack (e.g. React, Next.js)"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                                className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan flex-1"
                            />
                            <button
                                type="button"
                                onClick={handleAddTech}
                                className="bg-neon-cyan/20 border border-neon-cyan text-neon-cyan px-4 rounded hover:bg-neon-cyan hover:text-black transition-all"
                            >
                                ADD
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tech_stack.map((tech, index) => (
                                <span key={index} className="bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan px-2 py-1 rounded text-xs flex items-center gap-1">
                                    {tech}
                                    <button type="button" onClick={() => removeTech(index)} className="hover:text-neon-red" aria-label="Remove technology"><X size={12} /></button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* XP and Attributes */}
                    <div className="space-y-4 border-t border-neon-cyan/20 pt-4">
                        <h4 className="text-neon-cyan font-bold flex items-center gap-2"><Zap size={16} /> REWARDS</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="xp-granted" className="block text-xs text-neon-cyan/70 mb-1">XP GRANTED</label>
                                <input
                                    id="xp-granted"
                                    type="number"
                                    value={formData.xpGranted || 0}
                                    onChange={(e) => setFormData({ ...formData, xpGranted: parseInt(e.target.value) })}
                                    className="bg-black/50 border border-neon-cyan/30 rounded p-3 text-neon-cyan w-full"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-neon-cyan/70 mb-2">ATTRIBUTE BONUSES</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {['technical', 'creative', 'intelligence', 'collaboration', 'learning'].map((attr) => (
                                    <div key={attr} className="flex items-center gap-2">
                                        <label htmlFor={`proj-attr-${attr}`} className="text-[10px] uppercase w-20 text-neon-cyan/60">{attr}</label>
                                        <input
                                            id={`proj-attr-${attr}`}
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={formData.attributeBonus?.[attr as keyof Attributes] || ''}
                                            className="w-16 bg-cyber-black border border-neon-cyan/30 p-1 text-xs text-neon-cyan"
                                            onChange={(e) => handleAttributeChange(attr as keyof Attributes, parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

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
                            <Save size={18} /> {editingId ? "UPDATE MISSION" : "INITIATE MISSION"}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/40 border border-neon-cyan/20 p-4 rounded hover:border-neon-cyan/50 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-bold text-neon-cyan">{project.title}</h4>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(project)} className="text-neon-cyan hover:text-white" aria-label="Edit project"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(project.id)} className="text-neon-red hover:text-white" aria-label="Delete project"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex flex-wrap gap-1 mb-3">
                                {project.tech_stack.slice(0, 3).map((t, i) => (
                                    <span key={i} className="text-[10px] bg-neon-cyan/5 text-neon-cyan px-1 rounded border border-neon-cyan/10">{t}</span>
                                ))}
                                {project.tech_stack.length > 3 && <span className="text-[10px] text-gray-500">+{project.tech_stack.length - 3}</span>}
                            </div>
                            <div className="flex gap-3 text-xs text-gray-500">
                                {project.demo_url && <a href={project.demo_url} target="_blank" className="hover:text-neon-cyan flex items-center gap-1"><LinkIcon size={12} /> Demo</a>}
                                {project.repo_url && <a href={project.repo_url} target="_blank" className="hover:text-neon-cyan flex items-center gap-1"><Github size={12} /> Repo</a>}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
