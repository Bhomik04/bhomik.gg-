"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Html, useProgress } from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="text-neon-cyan font-mono text-sm">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-lg font-bold">LOADING NEURAL INTERFACE...</div>
                    <div className="w-48 h-1 bg-cyber-gray/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="text-xs opacity-70">{progress.toFixed(0)}%</div>
                </div>
            </div>
        </Html>
    );
}

export default function AvatarScene() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 1, 3]} fov={60} />

                {/* Cyberpunk Lighting Setup */}
                <ambientLight intensity={0.5} color="#001133" />

                {/* Neon Red Key Light */}
                <spotLight
                    position={[5, 5, 5]}
                    angle={0.3}
                    penumbra={1}
                    intensity={20}
                    color="#ff003c"
                    castShadow
                />

                {/* Cyan Rim Light */}
                <spotLight
                    position={[-5, 5, -5]}
                    angle={0.3}
                    penumbra={1}
                    intensity={20}
                    color="#00f3ff"
                />

                {/* Fill Light */}
                <pointLight position={[0, -2, 2]} intensity={5} color="#b026ff" />

                <Suspense fallback={<Loader />}>
                    <Model position={[0, -1, 0]} />
                    <Environment preset="city" />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 2.5}
                    maxPolarAngle={Math.PI / 1.8}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            {/* Gradient overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-cyber-black via-transparent to-transparent opacity-60" />
        </div>
    );
}
