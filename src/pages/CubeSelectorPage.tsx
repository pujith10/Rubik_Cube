import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cube from '../components/cube/Cube';
import { useCubeStore } from '../stores/useCubeStore';
import InstructionsModal from '../components/layout/InstructionsModal';

export default function CubeSelectorPage() {
    const { size } = useParams();
    const setSize = useCubeStore((state) => state.setSize);

    useEffect(() => {
        // Handle explicit size route or default to 3
        if (size) {
            const sizeInt = parseInt(size);
            if (!isNaN(sizeInt) && (sizeInt === 3 || sizeInt === 4 || sizeInt === 5)) {
                setSize(sizeInt);
            } else {
                setSize(3);
            }
        } else {
            // No size param (root route), default to 3
            setSize(3);
        }
    }, [size, setSize]);

    return (
        <div className="h-screen w-full text-white flex flex-col items-center justify-center relative">
            <InstructionsModal />

            <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {useCubeStore.getState().size}x{useCubeStore.getState().size} Cube
                </h1>
                <p className="text-gray-400 mt-2">Drag to rotate • Buttons to move</p>
            </div>

            <div className="w-full h-full">
                <Cube />
            </div>
        </div>
    );
}
