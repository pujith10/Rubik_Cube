import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TUTORIALS } from '../data/tutorialData';
import Cube from '../components/cube/Cube';
import { ArrowLeft, ChevronRight, Play, RotateCcw, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCubeStore } from '../stores/useCubeStore';

export default function TutorialPage() {
    const { method } = useParams();
    const navigate = useNavigate();
    const tutorial = method ? TUTORIALS[method] : null;

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Store
    const { resetCube, addMove } = useCubeStore();

    useEffect(() => {
        if (!tutorial) {
            navigate('/methods');
        }
    }, [tutorial, navigate]);

    if (!tutorial) return null;

    const currentStep = tutorial.steps[currentStepIndex];
    const isFirst = currentStepIndex === 0;
    const isLast = currentStepIndex === tutorial.steps.length - 1;

    const handleDemonstrate = async () => {
        if (isPlaying || !currentStep.algorithm) return;
        setIsPlaying(true);
        resetCube();

        // Wait for reset
        await new Promise(r => setTimeout(r, 500));

        // 1. Apply Setup (if any) - Instant or Fast?
        // Let's make it instant or very fast to "set the stage"
        if (currentStep.setup) {
            // For now, just animate it fast
            // In a real app complexity, we might want 'instant set' function in store
            const setupMoves = currentStep.setup.split(' ');
            setupMoves.forEach(m => processMove(m)); // fast
            // Wait for setup
            await new Promise(r => setTimeout(r, setupMoves.length * 150));
        }

        // 2. Play Algorithm - Normal Speed
        const algoMoves = currentStep.algorithm.split(' ');

        // Wait a beat before starting real algo
        await new Promise(r => setTimeout(r, 500));

        for (const move of algoMoves) {
            processMove(move);
            await new Promise(r => setTimeout(r, 600)); // pace it out
        }

        setIsPlaying(false);
    };

    const processMove = (moveStr: string) => {
        const face = moveStr.charAt(0);
        const modifier = moveStr.length > 1 ? moveStr.charAt(1) : '';

        let axis: 'x' | 'y' | 'z' = 'y';
        let layer = 0;
        let direction: 1 | -1 = -1;
        const offset = 1;

        switch (face) {
            case 'U': axis = 'y'; layer = offset; direction = -1; break;
            case 'D': axis = 'y'; layer = -offset; direction = 1; break;
            case 'R': axis = 'x'; layer = offset; direction = -1; break;
            case 'L': axis = 'x'; layer = -offset; direction = 1; break;
            case 'F': axis = 'z'; layer = offset; direction = -1; break;
            case 'B': axis = 'z'; layer = -offset; direction = 1; break;
        }

        if (modifier === "'") {
            direction *= -1;
        } else if (modifier === '2') {
            addMove(axis, layer, direction); // Double
        }

        addMove(axis, layer, direction as 1 | -1);
    };

    return (
        <div className="h-screen pt-20 flex bg-[#0a0a0a] overflow-hidden">
            {/* Left: Sidebar Navigation */}
            <div className="w-80 border-r border-white/10 bg-[#111] flex flex-col p-6 overflow-y-auto z-10">
                <Link to="/methods" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={18} /> Back to Courses
                </Link>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        {tutorial.name}
                    </h2>
                    <p className="text-sm text-gray-500">{tutorial.description}</p>
                </div>

                <div className="space-y-2 relative">
                    {/* Line connecting milestones */}
                    <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-white/10" />

                    {tutorial.steps.map((step, idx) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStepIndex(idx)}
                            className={cn(
                                "relative w-full text-left p-3 rounded-xl flex items-start gap-4 transition-all z-10",
                                idx === currentStepIndex
                                    ? "bg-blue-500/10 border border-blue-500/20"
                                    : "hover:bg-white/5"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors bg-[#111]",
                                idx === currentStepIndex
                                    ? "border-blue-500 text-blue-500"
                                    : idx < currentStepIndex
                                        ? "border-green-500 text-green-500"
                                        : "border-gray-700 text-gray-700"
                            )}>
                                {idx < currentStepIndex ? <CheckCircle2 size={16} /> : <span>{idx + 1}</span>}
                            </div>
                            <div>
                                <h4 className={cn(
                                    "font-medium mb-1",
                                    idx === currentStepIndex ? "text-white" : "text-gray-400"
                                )}>
                                    {step.title}
                                </h4>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Center: 3D View */}
            <div className="flex-1 relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
                <div className="absolute inset-0">
                    <Cube />
                </div>

                {/* Control Overlay */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                        onClick={() => resetCube()}
                        className="px-6 py-3 rounded-full bg-black/50 backdrop-blur border border-white/10 hover:bg-white/10 text-white font-medium flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw size={18} /> Reset
                    </button>
                    {currentStep.algorithm && (
                        <button
                            onClick={handleDemonstrate}
                            disabled={isPlaying}
                            className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPlaying ? (
                                <span className="animate-pulse">Watching...</span>
                            ) : (
                                <>
                                    <Play size={18} fill="currentColor" /> Watch Move
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Right: Info Panel */}
            <div className="w-96 border-l border-white/10 bg-[#111] p-8 flex flex-col overflow-y-auto z-10">
                <div className="mb-auto">
                    <span className="text-blue-400 text-sm font-bold tracking-wider uppercase mb-2 block">
                        Step {currentStepIndex + 1} of {tutorial.steps.length}
                    </span>
                    <h1 className="text-3xl font-bold mb-6 text-white">{currentStep.title}</h1>

                    <div className="prose prose-invert prose-lg mb-8 text-gray-300">
                        <p>{currentStep.description}</p>
                    </div>

                    {currentStep.algorithm && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Algorithm</h3>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-xl text-center text-blue-300 shadow-inner">
                                {currentStep.algorithm}
                            </div>
                        </div>
                    )}

                    {currentStep.tips && (
                        <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-6">
                            <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                                <Zap size={18} /> Pro Tips
                            </h3>
                            <ul className="space-y-2">
                                {currentStep.tips.map((tip, i) => (
                                    <li key={i} className="text-sm text-gray-400 flex gap-2">
                                        <span className="text-yellow-500/50">•</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-6">
                    <button
                        onClick={() => setCurrentStepIndex(p => Math.max(0, p - 1))}
                        disabled={isFirst}
                        className="text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500 font-medium transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentStepIndex(p => Math.min(tutorial.steps.length - 1, p + 1))}
                        disabled={isLast}
                        className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        Next Step <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
