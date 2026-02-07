import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, BookOpen, Info, Settings, Trophy } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Navbar() {
    const location = useLocation();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Solver', path: '/solver/3', icon: Grid3X3 },
        { name: 'Tutorials', path: '/methods', icon: BookOpen },
        { name: 'Practice', path: '/practice/3', icon: Trophy },
        { name: 'About', path: '/about', icon: Info },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none fade-in-down">
            <div className="flex items-center gap-2 px-3 py-3 bg-black/40 backdrop-blur-2xl border border-white/5 rounded-full shadow-2xl pointer-events-auto ring-1 ring-white/10">
                {navItems.map((item) => {
                    // Check if active based on path. Handles root path properly.
                    const isActive = item.path === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-white/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {/* Active background glow */}
                            {isActive && (
                                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full -z-10" />
                            )}

                            <item.icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive && "text-blue-400")} />
                            <span className={cn("font-medium text-sm hidden sm:block", isActive ? "text-white" : "text-gray-400 group-hover:text-white")}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className="absolute right-8 top-8 pointer-events-auto">
                <button className="p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all hover:rotate-90 duration-500 shadow-lg">
                    <Settings className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
}
