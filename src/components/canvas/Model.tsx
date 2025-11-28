"use client";

import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import { Group } from "three";

export default function Model(props: any) {
    const group = useRef<Group>(null);
    const [error, setError] = useState(false);

    // Try to load the model, fallback to box if failed or not found
    let nodes, materials;
    try {
        const gltf = useGLTF("/model.glb");
        nodes = gltf.nodes;
        materials = gltf.materials;
    } catch (e) {
        // console.warn("Avatar model not found, using placeholder.");
    }

    if (!nodes || error) {
        return (
            <group {...props} dispose={null}>
                <mesh>
                    <boxGeometry args={[1, 2, 1]} />
                    <meshStandardMaterial color="cyan" wireframe />
                </mesh>
            </group>
        );
    }

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={nodes.Scene || nodes.root} />
        </group>
    );
}

useGLTF.preload("/avatar.glb");
