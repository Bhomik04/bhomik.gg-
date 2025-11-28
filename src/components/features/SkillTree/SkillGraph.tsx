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
    NodeMouseHandler
} from "reactflow";
import "reactflow/dist/style.css";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CustomNode from "./CustomNode";
import { Skill } from "@/types/rpg";
import { GameEngine } from "@/lib/GameEngine";

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
                const data = doc.data() as Skill;
                // Basic positioning logic for demo purposes
                // In a real app, you'd use a layout library like dagre or elkjs
                const parentId = data.parentId;
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
                        category: data.category,
                        xpReward: data.xpReward,
                        requiredLevel: data.requiredLevel
                    },
                });

                if (data.parentId) {
                    fetchedEdges.push({
                        id: `e-${data.parentId}-${doc.id}`,
                        source: data.parentId,
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

    const onNodeClick: NodeMouseHandler = useCallback(async (event, node) => {
        if (node.data.status === 'locked') {
            try {
                await GameEngine.unlockSkill(node.id);
                // Success notification could be added here
            } catch (error: any) {
                alert(error.message); // Simple alert for now
            }
        }
    }, []);

    return (
        <div className={`w-full border border-neon-cyan/30 bg-cyber-black/80 backdrop-blur-md rounded-lg overflow-hidden ${className || "h-[600px]"}`}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#1a1a1a" gap={20} />
                <Controls className="!bg-cyber-gray !border-neon-cyan/30 !fill-neon-cyan" />
            </ReactFlow>
        </div>
    );
}
