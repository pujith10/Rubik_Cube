import { useState, useEffect } from 'react';
// @ts-ignore
import solver from 'rubiks-cube-solver';
import CubeNet from '../components/solver/CubeNet';
import Cube from '../components/cube/Cube';
import { ArrowRight, RotateCw, AlertCircle } from 'lucide-react';
import { useCubeStore } from '../stores/useCubeStore';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

type FaceColor = 'w' | 'y' | 'g' | 'b' | 'r' | 'o';
type FaceName = 'u' | 'l' | 'f' | 'r' | 'b' | 'd';

const INITIAL_STATE: Record<FaceName, FaceColor[]> = {
    u: Array(9).fill('w'),
    l: Array(9).fill('o'), // Correct L is Orange relative to Front Green
    f: Array(9).fill('g'),
    r: Array(9).fill('r'),
    b: Array(9).fill('b'),
    d: Array(9).fill('y'),
};

const PALETTE: FaceColor[] = ['w', 'y', 'g', 'b', 'r', 'o'];

export default function SolverPage() {
    const [cubeState, setCubeState] = useState(INITIAL_STATE);
    const [selectedColor, setSelectedColor] = useState<FaceColor>('w');
    const [solution, setSolution] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSolving, setIsSolving] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();
    const { addMove, resetCube } = useCubeStore();

    // No initialization needed for rubiks-cube-solver

    const handleColorChange = (face: string, index: number, color: FaceColor) => {
        // Don't allow changing center pieces
        if (index === 4) return;

        setCubeState(prev => ({
            ...prev,
            [face]: prev[face as FaceName].map((c, i) => i === index ? color : c)
        }));
        setSolution(null);
        setError(null);
    };

    const handleSolve = () => {
        setIsSolving(true);
        setError(null);

        try {
            // Mapping color to face char expected by solver
            // Standard Kociemba solvers often expect U R F D L B order
            // and characters corresponding to the face (U, R, F, etc.)

            const colorToFace: Record<FaceColor, string> = {
                'w': 'u',
                'r': 'r',
                'g': 'f',
                'y': 'd',
                'o': 'l',
                'b': 'b'
            };

            const order: FaceName[] = ['u', 'r', 'f', 'd', 'l', 'b'];
            let stateString = '';

            order.forEach(face => {
                stateString += cubeState[face].map(c => colorToFace[c]).join('');
            });

            console.log("Solving state (raw):", stateString);

            // Note: Some libraries might fail on solved state. checking manually.

            if (stateString === 'uuuuuuuuurrrrrrrrrfffffffffdddddddddlllllllllbbbbbbbbb') {
                setSolution("Actually, it's already solved!");
                setIsSolving(false);
                return;
            }

            // rubiks-cube-solver returns a string like "R U R' U'"
            const result = solver(stateString);

            if (result) {
                setSolution(result);
            } else {
                setError("No solution found. Check your colors!");
            }
        } catch (e: any) {
            console.error("Solver error:", e);
            // Handle specific error for solved state if library throws it unpredictably
            if (e.message && e.message.includes('moving down')) {
                setSolution("Actually, it's already solved!");
            } else {
                setError("Invalid cube state. Please verify colors.");
            }
        } finally {
            setIsSolving(false);
        }
    };

    const handleAnimate = async () => {
        if (!solution || solution.includes("Actually")) return;
        // solution is string like "R U R' U'"
        // To animate, we should ideally start from the scrambled state.
        // But since we don't have a way to visually set the cube state instantly to matches the colors,
        // we will just perform the solution moves on the current 3D cube.
        // The user can assume the 3D cube started as solved or whatever state it was.
        // Better: Reset cube first, then apply REVERSE solution to scramble it, then apply solution.

        setIsAnimating(true);
        resetCube();

        // Wait a bit for reset to visually register (though it's fast)
        await new Promise(resolve => setTimeout(resolve, 500));

        const moves = solution.split(' ');

        // Helper to process a move string
        const processMove = (moveStr: string) => {
            const face = moveStr.charAt(0);
            const modifier = moveStr.length > 1 ? moveStr.charAt(1) : '';

            let axis: 'x' | 'y' | 'z' = 'y';
            let layer = 0;
            let direction: 1 | -1 = -1;

            // Mapping based on Cube.tsx Debug Controls
            // U: y, offset, -1
            // D: y, -offset, 1
            // R: x, offset, -1
            // L: x, -offset, 1
            // F: z, offset, -1
            // B: z, -offset, 1

            // Assuming size 3, offset is 1.
            const offset = 1;

            switch (face) {
                case 'U': axis = 'y'; layer = offset; direction = -1; break;
                case 'D': axis = 'y'; layer = -offset; direction = 1; break; // Inverted valid for D?
                // Standard D is clockwise looking from bottom.
                // My debug control says D (Down) -> addMove('y', -offset, 1).
                // So standard D is direction 1 in my engine.
                case 'R': axis = 'x'; layer = offset; direction = -1; break;
                case 'L': axis = 'x'; layer = -offset; direction = 1; break;
                case 'F': axis = 'z'; layer = offset; direction = -1; break;
                case 'B': axis = 'z'; layer = -offset; direction = 1; break;
            }

            if (modifier === "'") {
                direction *= -1;
            } else if (modifier === '2') {
                // Double move
                addMove(axis, layer, direction);
            }

            addMove(axis, layer, direction as 1 | -1);
        };

        // 1. Scramble (Reverse Solution)
        // Reverse order and invert moves
        // e.g. "R U" -> "U' R'"
        // Actually, let's skip the scramble part for now and just animate the solution
        // because "painting" the scramble via reverse moves takes time and user might be confused why it's moving weirdly first.
        // Ideally we'd set it instantly.
        // Let's just animate the solution moves string.

        moves.forEach(move => {
            processMove(move);
        });

        // Re-enable button after some time (rough estimate: moves * speed)
        // Store handles queue, so we can just set false.
        // But user might click again.
        setTimeout(() => setIsAnimating(false), moves.length * 500 + 1000);
    };

    const renderSolution = () => {
        if (!solution) return null;

        const moves = solution.split(' ');

        return (
            <div className="mt-8 w-full max-w-2xl animate-in slide-in-from-bottom-5 fade-in duration-500">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -z-10" />

                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-400">
                        <RotateCw size={24} />
                        Solution Found!
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {moves.map((move, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/5 rounded-lg font-mono text-lg font-bold text-white border border-white/5 shadow-sm">
                                {move}
                            </span>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 mb-2">Total moves: {moves.length}</p>

                    <button
                        onClick={handleAnimate}
                        disabled={isAnimating}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isAnimating ? 'Animating...' : 'Animate on 3D Cube'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 text-center">
                Cube Solver
            </h1>

            <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-start">

                {/* Left: Input */}
                <div className="flex flex-col items-center gap-8">
                    {/* Cube Net */}
                    <CubeNet
                        cubeState={cubeState}
                        onColorChange={handleColorChange}
                        selectedColor={selectedColor}
                    />

                    {/* Color Palette */}
                    <div className="flex gap-4 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                        {PALETTE.map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={cn(
                                    "w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 shadow-lg",
                                    selectedColor === color ? "border-white scale-110 ring-2 ring-white/20" : "border-transparent opacity-80"
                                )}
                                style={{
                                    backgroundColor:
                                        color === 'w' ? '#ffffff' :
                                            color === 'y' ? '#ffd500' :
                                                color === 'g' ? '#009b48' :
                                                    color === 'b' ? '#0046ad' :
                                                        color === 'r' ? '#b71234' :
                                                            '#ff5800'
                                }}
                            />
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 w-full max-w-md">
                        <button
                            onClick={() => setCubeState(JSON.parse(JSON.stringify(INITIAL_STATE)))}
                            className="flex-1 py-3 px-6 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSolve}
                            disabled={isSolving}
                            className="flex-[2] py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isSolving ? 'Solving...' : (
                                <>
                                    Solve Cube <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* Right: Solution & Instructions */}
                <div className="space-y-6 h-[500px] flex flex-col">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative flex-1 min-h-[300px] overflow-hidden">
                        {/* 3D Cube View */}
                        <div className="absolute inset-0 z-0">
                            <Cube />
                        </div>

                        {/* Instructions Overlay (hide if solution present?) */}
                        {!solution && (
                            <div className="relative z-10 bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-white/10 pointer-events-none">
                                <h2 className="text-xl font-bold mb-2 text-white">How to use</h2>
                                <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                                    <li>Hold your physical cube with <strong>White Top</strong> / <strong>Green Front</strong>.</li>
                                    <li>Paint the net on the left to match.</li>
                                    <li>Click Solve.</li>
                                </ol>
                            </div>
                        )}
                    </div>

                    {/* Render Solution if available */}
                    {renderSolution()}
                </div>
            </div>
        </div>
    );
}
