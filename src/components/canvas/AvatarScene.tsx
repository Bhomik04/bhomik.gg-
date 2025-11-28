"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Suspense } from "react";
import Model from "./Model";

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

                <Suspense fallback={null}>
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
