import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer2, Move3d, RotateCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function InstructionsModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show automatically on mount
        setIsOpen(true);
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -z-10" />

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                                Welcome!
                            </h2>
                            <p className="text-gray-400">Master the Cube with ease.</p>
                        </div>

                        {/* Instructions List */}
                        <div className="space-y-6 mb-8">
                            <InstructionItem
                                icon={Move3d}
                                title="Rotate View"
                                description="Drag anywhere on the background to rotate the camera around the cube."
                            />
                            <InstructionItem
                                icon={MousePointer2}
                                title="Control Faces"
                                description="Use the on-screen buttons to rotate specific layers (U, D, L, R, F, B)."
                            />
                            <InstructionItem
                                icon={RotateCw}
                                title="Scramble & Solve"
                                description="Explore features in the menu to scramble or find optimal solutions."
                            />
                        </div>

                        {/* Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
                        >
                            Start Cubing
                        </motion.button>

                        {/* Close Icon (Optional) */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

const InstructionItem = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-blue-400">
            <Icon size={24} />
        </div>
        <div>
            <h3 className="font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
    </div>
);
