"use client";

export default function Scanlines() {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-30">
            {/* Scanline texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] bg-repeat" />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.5)_100%)]" />
        </div>
    );
}
