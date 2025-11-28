"use client";

import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
    Background,
    Controls,
    Edge,
    Node,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CustomNode from "./CustomNode";

const nodeTypes = {
    skill: CustomNode,
};

// Initial placeholder data in case DB is empty
const initialNodes: Node[] = [
    {
        id: "root",
        type: "skill",
        position: { x: 0, y: 0 },
        data: { label: "Start", status: "unlocked", category: "Core" },
    },
];

export default function SkillGraph({ className = "" }: { className?: string }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!db) return;

        const q = query(collection(db, "skills"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedNodes: Node[] = [];
            const fetchedEdges: Edge[] = [];

            // Simple layout logic (can be improved with dagre)
            let yOffset = 0;
            const xOffsetMap: Record<string, number> = {};

            snapshot.docs.forEach((doc, index) => {
                const data = doc.data();
                // Basic positioning logic for demo purposes
                // In a real app, you'd use a layout library like dagre or elkjs
                const parentId = data.parent_id;
                const x = parentId ? (xOffsetMap[parentId] || 0) + (index % 2 === 0 ? -150 : 150) : 0;
                const y = parentId ? (yOffset + 150) : 0;

                if (parentId) xOffsetMap[parentId] = x;
                if (!parentId) yOffset += 100;

                fetchedNodes.push({
                    id: doc.id,
                    type: "skill",
                    position: { x, y },
                    data: {
                        label: data.label,
                        status: data.status,
                        category: data.category
                    },
                });

                if (data.parent_id) {
                    fetchedEdges.push({
                        id: `e-${data.parent_id}-${doc.id}`,
                        source: data.parent_id,
                        target: doc.id,
                        type: "smoothstep",
                        animated: data.status !== "locked",
                        style: { stroke: data.status === "locked" ? "#555" : "#00f3ff" },
                    });
                }
            });

            if (fetchedNodes.length > 0) {
                setNodes(fetchedNodes);
                setEdges(fetchedEdges);
            }
        });

        return () => unsubscribe();
    }, [setNodes, setEdges]);

    return (
        <div className={`w-full border border-neon-cyan/30 bg-cyber-black/80 backdrop-blur-md rounded-lg overflow-hidden ${className || "h-[600px]"}`}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#1a1a1a" gap={20} />
                <Controls className="!bg-cyber-gray !border-neon-cyan/30 !fill-neon-cyan" />
            </ReactFlow>
        </div>
    );
}
