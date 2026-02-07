import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Cube from '../components/cube/Cube';
import { generateScramble } from '../utils/scramble';
import { useCubeStore } from '../stores/useCubeStore';
import { Play, RotateCcw, Trash2, History, Trophy, Timer as TimerIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface SolveTime {
    id: number;
    time: number;
    scramble: string;
    date: Date;
}

export default function PracticePage() {
    const { size } = useParams();
    const cubeSize = parseInt(size || '3');

    // Store
    const { resetCube, addMove } = useCubeStore();

    // State
    const [scramble, setScramble] = useState('');
    const [timerState, setTimerState] = useState<'idle' | 'holding' | 'running' | 'inspection'>('idle');
    const [time, setTime] = useState(0);
    const [solves, setSolves] = useState<SolveTime[]>([]);

    // Refs
    const requestRef = useRef<number>();
    const startTimeRef = useRef<number>(0);
    const spaceDownRef = useRef<boolean>(false);

    // Initial Scramble
    useEffect(() => {
        handleNewScramble();
    }, []);

    // Timer Logic
    const animate = (time: number) => {
        if (timerState === 'running') {
            const now = Date.now();
            setTime(now - startTimeRef.current);
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        if (timerState === 'running') {
            startTimeRef.current = Date.now() - time;
            requestRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestRef.current!);
        }
        return () => cancelAnimationFrame(requestRef.current!);
    }, [timerState]);

    // Keyboard Handling
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space') {
            if (timerState === 'running') {
                // Stop Timer
                setTimerState('idle');
                addSolve(time);
            } else if (timerState === 'idle' && !spaceDownRef.current) {
                // Prepare to start (Green light)
                setTimerState('holding');
                setTime(0);
                spaceDownRef.current = true;
            }
        }
    }, [timerState, time]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space') {
            spaceDownRef.current = false;
            if (timerState === 'holding') {
                // Start Timer
                setTimerState('running');
                startTimeRef.current = Date.now();
            }
        }
    }, [timerState]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    // Actions
    const handleNewScramble = () => {
        const newScramble = generateScramble();
        setScramble(newScramble);
        applyScramble(newScramble);
    };

    const applyScramble = async (scrambleStr: string) => {
        resetCube();
        await new Promise(r => setTimeout(r, 100)); // Reset visual

        // Fast application
        // We can just add moves to queue quickly
        const moves = scrambleStr.split(' ');
        moves.forEach(move => {
            const face = move.charAt(0);
            const modifier = move.length > 1 ? move.charAt(1) : '';

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

            if (modifier === "'") direction *= -1;
            if (modifier === '2') addMove(axis, layer, direction); // double

            addMove(axis, layer, direction as 1 | -1);
        });
    };

    const addSolve = (finalTime: number) => {
        setSolves(prev => [{
            id: Date.now(),
            time: finalTime,
            scramble,
            date: new Date()
        }, ...prev]);
        handleNewScramble();
    };

    const getSolution = () => {
        if (!scramble) return '';
        return scramble
            .split(' ')
            .reverse()
            .map(move => {
                if (move.length === 1) return move + "'"; // R -> R'
                if (move.endsWith("'")) return move[0];   // R' -> R
                return move;                              // R2 -> R2
            })
            .join(' ');
    };

    // Stats Calculation
    const formatTime = (ms: number) => (ms / 1000).toFixed(2);

    const getAo5 = () => {
        if (solves.length < 5) return '-';
        const last5 = solves.slice(0, 5).map(s => s.time);
        last5.sort((a, b) => a - b);
        const sum = last5.slice(1, 4).reduce((a, b) => a + b, 0); // Remove best and worst
        return formatTime(sum / 3);
    };

    const getBest = () => {
        if (solves.length === 0) return '-';
        return formatTime(Math.min(...solves.map(s => s.time)));
    };

    return (
        <div className="h-screen pt-20 flex bg-[#0a0a0a] overflow-hidden">
            {/* Left: Stats Panel */}
            <div className="w-80 border-r border-white/10 bg-[#111] flex flex-col p-6 z-10 glass">
                <div className="flex items-center gap-2 mb-8 text-blue-400">
                    <History size={20} />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Session</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Best</span>
                        <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                            {getBest()}
                        </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Ao5</span>
                        <div className="text-2xl font-mono font-bold text-blue-400">
                            {getAo5()}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {solves.map((solve, i) => (
                        <div key={solve.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-white/5 group border border-transparent hover:border-white/10 transition-all">
                            <span className="text-gray-500 font-mono text-sm">#{solves.length - i}</span>
                            <span className="text-white font-mono font-bold text-lg">{formatTime(solve.time)}</span>
                            <button
                                onClick={() => setSolves(s => s.filter(x => x.id !== solve.id))}
                                className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {solves.length === 0 && (
                        <div className="text-center text-gray-600 py-8">
                            No solves yet. <br />Start practicing!
                        </div>
                    )}
                </div>
            </div>

            {/* Center: Cube & Timer */}
            <div className="flex-1 relative flex flex-col">
                {/* Scramble Display */}
                <div className="absolute top-0 left-0 right-0 p-8 flex flex-col items-center z-10 pointer-events-none">
                    <div className="text-center font-mono text-2xl md:text-3xl font-medium text-gray-300 bg-black/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 shadow-xl max-w-4xl leading-relaxed pointer-events-auto">
                        {scramble}
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                onClick={handleNewScramble}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                title="New Scramble"
                            >
                                <RotateCcw size={20} />
                            </button>
                            <button
                                onClick={() => alert(`Solution (Reverse Scramble):\n${getSolution()}`)}
                                className="px-4 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/20"
                            >
                                Reveal Solution
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3D View */}
                <div className="flex-1 relative bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
                    <Cube />
                </div>

                {/* Timer Overlay */}
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-200",
                        timerState === 'running' ? "bg-black/10 backdrop-blur-[2px]" : ""
                    )}
                >
                    <div className={cn(
                        "font-mono font-bold transition-all duration-100 select-none",
                        timerState === 'running' ? "text-[12rem] text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]" :
                            timerState === 'holding' ? "text-[8rem] text-green-400" :
                                "text-[8rem] text-white/80"
                    )}>
                        {formatTime(time)}
                    </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                    <p className={cn(
                        "text-lg font-medium transition-opacity duration-300",
                        timerState === 'running' ? "opacity-0" : "opacity-50 text-gray-400"
                    )}>
                        Hold <span className="font-bold text-white bg-white/10 px-2 py-1 rounded mx-1">SPACE</span> to start
                    </p>
                </div>
            </div>
        </div>
    );
}
