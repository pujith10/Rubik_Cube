import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCubeStore, type Move } from '../../stores/useCubeStore';
import Cubie from './Cubie';
import { Vector3, Quaternion } from 'three';
import { useState, useRef } from 'react';

const COLORS = {
    U: '#ffffff', // Up - White
    D: '#ffd500', // Down - Yellow
    L: '#ff5800', // Left - Orange
    R: '#b71234', // Right - Red
    F: '#009b48', // Front - Green
    B: '#0046ad', // Back - Blue
};

// Inner component to access useFrame
function CubeModel() {
    const { cubies, size, moveQueue, applyMove } = useCubeStore();
    const offset = (size - 1) / 2;

    // Animation state
    const [currentMove, setCurrentMove] = useState<Move | null>(null);
    const progressRef = useRef(0);
    const ANIMATION_SPEED = 5.0; // Speed multiplier

    useFrame((_, delta) => {
        if (currentMove) {
            progressRef.current += delta * ANIMATION_SPEED;
            if (progressRef.current >= 1) {
                // Finish move
                applyMove(currentMove); // This shifts the queue inside store
                setCurrentMove(null);
                progressRef.current = 0;
            }
        } else if (moveQueue.length > 0) {
            // Start next move
            setCurrentMove(moveQueue[0]);
            progressRef.current = 0;
        }
    });

    const getColors = (initialPosition: [number, number, number]) => {
        const [x, y, z] = initialPosition;
        // Logic: Internal faces should have the color of the face they are facing towards
        // e.g. An internal face pointing Right (positive x) should be Red (Right color)
        // so that when the layer slices, it looks solid.

        return {
            right: x === offset ? COLORS.R : COLORS.R, // Was Internal
            left: x === -offset ? COLORS.L : COLORS.L, // Was Internal
            top: y === offset ? COLORS.U : COLORS.U,   // Was Internal
            bottom: y === -offset ? COLORS.D : COLORS.D, // Was Internal
            front: z === offset ? COLORS.F : COLORS.F,   // Was Internal
            back: z === -offset ? COLORS.B : COLORS.B,   // Was Internal
        };
    };

    return (
        <group>
            {cubies.map((cubie) => {
                let position = new Vector3(...cubie.position);
                let quaternion = new Quaternion(...cubie.quaternion);

                if (currentMove) {
                    const { axis, layer, direction } = currentMove;
                    // Check if cubie is in the moving layer
                    let posComp = 0;
                    if (axis === 'x') posComp = cubie.position[0];
                    if (axis === 'y') posComp = cubie.position[1];
                    if (axis === 'z') posComp = cubie.position[2];

                    if (Math.abs(posComp - layer) < 0.1) {
                        // Apply partial rotation
                        const angle = (Math.PI / 2) * direction * progressRef.current;
                        const axisVec = new Vector3();
                        if (axis === 'x') axisVec.set(1, 0, 0);
                        if (axis === 'y') axisVec.set(0, 1, 0);
                        if (axis === 'z') axisVec.set(0, 0, 1);

                        const rotQuat = new Quaternion().setFromAxisAngle(axisVec, angle);

                        // Rotate position around center (0,0,0) - simplified since center is 0,0,0
                        // Just apply axis angle to position vector
                        position.applyAxisAngle(axisVec, angle);

                        // Rotate orientation
                        // Note: To rotate visually, we premultiply the extra rotation
                        quaternion.premultiply(rotQuat);
                    }
                }

                return (
                    <Cubie
                        key={cubie.id}
                        position={[position.x, position.y, position.z]}
                        quaternion={[quaternion.x, quaternion.y, quaternion.z, quaternion.w]}
                        colors={getColors(cubie.initialPosition)}
                    />
                );
            })}
        </group>
    );
}

export default function Cube() {
    const { size, addMove } = useCubeStore();
    const offset = (size - 1) / 2;

    return (
        <div className="w-full h-full relative">
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <OrbitControls enablePan={false} />
                <CubeModel />
            </Canvas>

            {/* Debug Controls */}
            <div className="absolute bottom-10 left-10 p-4 bg-black/50 rounded-lg flex gap-4 text-white z-10 pointer-events-auto">
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-center">Y Axis</span>
                    <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 cursor-pointer" onClick={() => addMove('y', offset, -1)}>U (Up)</button>
                    <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 cursor-pointer" onClick={() => addMove('y', -offset, 1)}>D (Down)</button>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-center">X Axis</span>
                    <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 cursor-pointer" onClick={() => addMove('x', offset, -1)}>R (Right)</button>
                    <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 cursor-pointer" onClick={() => addMove('x', -offset, 1)}>L (Left)</button>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-center">Z Axis</span>
                    <button className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 cursor-pointer" onClick={() => addMove('z', offset, -1)}>F (Front)</button>
                    <button className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 cursor-pointer" onClick={() => addMove('z', -offset, 1)}>B (Back)</button>
                </div>
            </div>
        </div>
    );
}
