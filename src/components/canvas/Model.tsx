"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { Group } from "three";

export default function Model(props: any) {
    const group = useRef<Group>(null);

    // Load the model
    const { scene, animations } = useGLTF("/model.glb");
    const { actions, mixer } = useAnimations(animations, group);

    // Play the first animation if available
    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            const firstAction = Object.values(actions)[0];
            if (firstAction) {
                firstAction.reset().play();
            }
        }
    }, [actions]);

    return (
        <group ref={group} {...props} dispose={null}>
            <primitive object={scene} scale={1} />
        </group>
    );
}

// Preload the model for faster initial render
useGLTF.preload("/model.glb");
