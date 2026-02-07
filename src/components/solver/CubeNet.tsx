import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useCubeStore } from '../../stores/useCubeStore';

// Type definitions
type FaceColor = 'w' | 'y' | 'g' | 'b' | 'r' | 'o';
type Face = FaceColor[];

interface CubeNetProps {
    cubeState: Record<string, Face>;
    onColorChange: (face: string, index: number, color: FaceColor) => void;
    selectedColor: FaceColor;
}

const COLORS: Record<FaceColor, string> = {
    w: '#ffffff',
    y: '#ffd500',
    g: '#009b48',
    b: '#0046ad',
    r: '#b71234',
    o: '#ff5800',
};

const FaceGrid = ({
    faceName,
    colors,
    onCellClick
}: {
    faceName: string,
    colors: Face,
    onCellClick: (index: number) => void
}) => {
    return (
        <div className="grid grid-cols-3 gap-1 bg-black p-1 rounded-md border border-white/10">
            {colors.map((color, idx) => (
                <div
                    key={`${faceName}-${idx}`}
                    onClick={() => onCellClick(idx)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm cursor-pointer hover:opacity-80 transition-opacity border border-white/5"
                    style={{ backgroundColor: COLORS[color] }}
                />
            ))}
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                <span className="font-bold text-black/50 drop-shadow-sm uppercase">{faceName}</span>
            </div>
        </div>
    );
};

export default function CubeNet({ cubeState, onColorChange, selectedColor }: CubeNetProps) {
    // Layout: 
    //    U
    //  L F R B
    //    D

    const renderFace = (face: string) => (
        <div className="relative">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                {face === 'u' ? 'Up' : face === 'd' ? 'Down' : face === 'l' ? 'Left' : face === 'r' ? 'Right' : face === 'f' ? 'Front' : 'Back'}
            </span>
            <FaceGrid
                faceName={face}
                colors={cubeState[face]}
                onCellClick={(idx) => onColorChange(face, idx, selectedColor)}
            />
        </div>
    );

    return (
        <div className="flex flex-col items-center gap-2 scale-90 sm:scale-100">
            {/* Top Row: U */}
            <div className="grid grid-cols-4 gap-2">
                <div className="invisible" /> {/* Spacer */}
                {renderFace('u')}
                <div className="invisible" /> {/* Spacer */}
                <div className="invisible" /> {/* Spacer */}
            </div>

            {/* Middle Row: L F R B */}
            <div className="grid grid-cols-4 gap-2">
                {renderFace('l')}
                {renderFace('f')}
                {renderFace('r')}
                {renderFace('b')}
            </div>

            {/* Bottom Row: D */}
            <div className="grid grid-cols-4 gap-2">
                <div className="invisible" /> {/* Spacer */}
                {renderFace('d')}
                <div className="invisible" /> {/* Spacer */}
                <div className="invisible" /> {/* Spacer */}
            </div>
        </div>
    );
}
