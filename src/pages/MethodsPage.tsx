import { Link } from 'react-router-dom';
import { TUTORIALS } from '../data/tutorialData';
import { ArrowRight, BookOpen, GraduationCap, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MethodsPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    Master the Cube
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Choose your path. Whether you're solving your first cube or chasing sub-20 seconds, we have a guide for you.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {Object.values(TUTORIALS).map((method) => (
                    <div
                        key={method.id}
                        className="group relative bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
                    >
                        {/* Background Gradient */}
                        <div className={cn(
                            "absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] -z-10 opacity-20 transition-opacity group-hover:opacity-30",
                            method.id === 'beginner' ? "bg-blue-500" : "bg-purple-500"
                        )} />

                        <div className="flex justify-between items-start mb-6">
                            <div className={cn(
                                "p-3 rounded-2xl",
                                method.id === 'beginner' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                            )}>
                                {method.id === 'beginner' ? <BookOpen size={32} /> : <Zap size={32} />}
                            </div>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-sm font-medium border",
                                method.difficulty === 'Beginner'
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border-red-500/20"
                            )}>
                                {method.difficulty}
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold mb-3 text-white group-hover:text-blue-200 transition-colors">
                            {method.name}
                        </h2>

                        <p className="text-gray-400 mb-8 h-12">
                            {method.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 font-mono">
                            <span className="flex items-center gap-2">
                                <GraduationCap size={16} />
                                {method.steps.length} Lessons
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                to={`/tutorial/${method.id}/3`}
                                className="flex-1 py-3 px-6 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                                Start Course <ArrowRight size={18} />
                            </Link>

                            {method.id === 'cfop' && (
                                <Link
                                    to="/algorithms/3x3/cfop"
                                    className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-medium text-white"
                                >
                                    Algorithms
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
