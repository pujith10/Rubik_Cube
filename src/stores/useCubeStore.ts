import { create } from 'zustand';
import { Vector3, Quaternion } from 'three';

export interface CubieData {
    id: number;
    position: [number, number, number];
    quaternion: [number, number, number, number];
    // Initial logical position to determine original stickers
    initialPosition: [number, number, number];
}

export interface Move {
    axis: 'x' | 'y' | 'z';
    layer: number;
    direction: 1 | -1;
}

interface CubeStore {
    size: number;
    cubies: CubieData[];
    isRotating: boolean;
    moveQueue: Move[];
    setSize: (size: number) => void;
    resetCube: () => void;
    setCubies: (cubies: CubieData[]) => void;
    setIsRotating: (isRotating: boolean) => void;
    addMove: (axis: 'x' | 'y' | 'z', layer: number, direction: 1 | -1) => void;
    applyMove: (move: Move) => void;
}

const generateCubies = (size: number): CubieData[] => {
    const cubies: CubieData[] = [];
    const offset = (size - 1) / 2;
    let id = 0;

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < size; z++) {
                const pos: [number, number, number] = [x - offset, y - offset, z - offset];
                cubies.push({
                    id: id++,
                    position: pos,
                    quaternion: [0, 0, 0, 1],
                    initialPosition: pos,
                });
            }
        }
    }
    return cubies;
};

export const useCubeStore = create<CubeStore>((set, get) => ({
    size: 3,
    cubies: generateCubies(3),
    isRotating: false,
    moveQueue: [],
    setSize: (size) => {
        set({ size, cubies: generateCubies(size) });
    },
    resetCube: () => {
        const { size } = get();
        set({ cubies: generateCubies(size) });
    },
    setCubies: (cubies) => set({ cubies }),
    setIsRotating: (isRotating) => set({ isRotating }),
    addMove: (axis, layer, direction) => {
        set((state) => ({ moveQueue: [...state.moveQueue, { axis, layer, direction }] }));
    },
    applyMove: ({ axis, layer, direction }) => {
        const { cubies } = get();
        const axisVector = new Vector3();
        if (axis === 'x') axisVector.set(1, 0, 0);
        if (axis === 'y') axisVector.set(0, 1, 0);
        if (axis === 'z') axisVector.set(0, 0, 1);

        const angle = (Math.PI / 2) * direction;
        const rotationQuat = new Quaternion().setFromAxisAngle(axisVector, angle);

        const newCubies = cubies.map((cubie) => {
            // Check if cubie is in the layer
            // Floating point tolerance
            let positionComponent = 0;
            if (axis === 'x') positionComponent = cubie.position[0];
            if (axis === 'y') positionComponent = cubie.position[1];
            if (axis === 'z') positionComponent = cubie.position[2];

            if (Math.abs(positionComponent - layer) < 0.1) {
                // Rotate position
                const pos = new Vector3(...cubie.position);
                pos.applyQuaternion(rotationQuat);
                // Round to avoid float drift
                pos.x = Math.round(pos.x * 2) / 2;
                pos.y = Math.round(pos.y * 2) / 2;
                pos.z = Math.round(pos.z * 2) / 2;

                // Rotate orientation
                const q = new Quaternion(...cubie.quaternion);
                q.premultiply(rotationQuat);

                return {
                    ...cubie,
                    position: [pos.x, pos.y, pos.z] as [number, number, number],
                    quaternion: [q.x, q.y, q.z, q.w] as [number, number, number, number],
                };
            }
            return cubie;
        });

        set((state) => ({
            cubies: newCubies,
            // Remove the processed move from queue if it was the first one? 
            // No, applyMove is called by the component after animation, 
            // so we should rely on the component to shift the queue BEFORE or AFTER calling applyMove.
            // Actually, let's have a separate shiftMove action if needed, or just let addMove append.
            // The component will read the queue. We need a pop action.
            moveQueue: state.moveQueue.slice(1)
        }));
    },
}));
