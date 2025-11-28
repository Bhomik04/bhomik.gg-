"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SkillPentagonProps {
    skills?: {
        technical: number;
        creative: number;
        intelligence: number;
        collaboration: number;
        learning: number;
    };
    maxValue?: number;
}

export default function SkillPentagon({ skills, maxValue = 100 }: SkillPentagonProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Default skill values (0-100)
    const skillData = skills || {
        technical: 10,
        creative: 10,
        intelligence: 10,
        collaboration: 10,
        learning: 10,
    };

    const skillLabels = [
        "TECHNICAL",
        "CREATIVE",
        "INTELLIGENCE",
        "COLLABORATION",
        "LEARNING",
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        const levels = 5;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background grid (pentagon levels)
        for (let level = 1; level <= levels; level++) {
            const levelRadius = (radius / levels) * level;
            ctx.beginPath();
            for (let i = 0; i <= 5; i++) {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const x = centerX + Math.cos(angle) * levelRadius;
                const y = centerY + Math.sin(angle) * levelRadius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.strokeStyle = level === levels ? "#00f3ff40" : "#00f3ff20";
            ctx.lineWidth = level === levels ? 1.5 : 0.5;
            ctx.stroke();
        }

        // Draw grid lines from center
        ctx.strokeStyle = "#00f3ff15";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
            ctx.stroke();
        }

        // Draw skill data polygon
        // Map attributes to the labels: TECHNICAL, CREATIVE, INTELLIGENCE, COLLABORATION, LEARNING
        const values = [
            skillData.technical,
            skillData.creative,
            skillData.intelligence,
            skillData.collaboration,
            skillData.learning
        ];
        
        ctx.beginPath();
        values.forEach((value, i) => {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const distance = (value / maxValue) * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();

        // Fill with gradient
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, "#00f3ff40");
        gradient.addColorStop(1, "#00f3ff10");
        ctx.fillStyle = gradient;
        ctx.fill();

        // Stroke the polygon
        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00f3ff";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw data points
        values.forEach((value, i) => {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const distance = (value / 100) * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#00f3ff";
            ctx.fill();
            ctx.strokeStyle = "#001133";
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw labels
        ctx.font = "9px monospace";
        ctx.fillStyle = "#00f3ff";
        ctx.textAlign = "center";
        skillLabels.forEach((label, i) => {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const labelDistance = radius + 25;
            const x = centerX + Math.cos(angle) * labelDistance;
            const y = centerY + Math.sin(angle) * labelDistance;

            // Handle multi-line labels
            const lines = label.split("\n");
            lines.forEach((line, lineIndex) => {
                ctx.fillText(line, x, y + lineIndex * 10);
            });
        });
    }, [skillData]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 border border-neon-cyan/30 bg-cyber-black/50 backdrop-blur-sm"
        >
            <div className="text-neon-cyan/50 text-[10px] uppercase tracking-widest mb-3 text-center">
                SKILL DISTRIBUTION
            </div>
            <canvas
                ref={canvasRef}
                width={240}
                height={240}
                className="w-full"
            />
        </motion.div>
    );
}
