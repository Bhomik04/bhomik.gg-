"use client";

import { clsx } from "clsx";
import { ButtonHTMLAttributes } from "react";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
}

export default function CyberButton({
    children,
    className,
    variant = "primary",
    ...props
}: CyberButtonProps) {
    const variants = {
        primary: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]",
        secondary: "border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_15px_rgba(176,38,255,0.4)]",
        danger: "border-neon-red text-neon-red hover:bg-neon-red/10 hover:shadow-[0_0_15px_rgba(255,0,60,0.4)]",
    };

    return (
        <button
            className={clsx(
                "relative px-6 py-2 font-mono text-sm tracking-wider uppercase transition-all duration-300 border bg-transparent clip-path-polygon",
                variants[variant],
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current" />

            {children}
        </button>
    );
}
