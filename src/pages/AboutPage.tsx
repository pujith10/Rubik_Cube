import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-6"
                >
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pb-2">
                        Beyond the Cube
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        We're not just building a solver. We're crafting an interactive experience that bridges the gap between digital simulation and physical mastery.
                    </p>
                </motion.div>

                {/* Mission Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed">
                            To create the most intuitive, visually stunning, and educational Rubik's Cube platform on the web. Whether you're a speedcuber or a beginner, we provide the tools to master the puzzle.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">The Technology</h2>
                        <p className="text-gray-400 leading-relaxed">
                            Powered by React Three Fiber and WebGL, our engine delivers realistic physics and stunning visuals. We push the boundaries of what's possible in a browser-based 3D application.
                        </p>
                    </motion.div>
                </div>

                {/* Team / Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-center pt-12 border-t border-white/10"
                >
                    <h3 className="text-xl font-semibold mb-8">Connect With Us</h3>
                    <div className="flex justify-center gap-6">
                        <SocialLink icon={Github} href="#" label="GitHub" />
                        <SocialLink icon={Twitter} href="#" label="Twitter" />
                        <SocialLink icon={Linkedin} href="#" label="LinkedIn" />
                        <SocialLink icon={Mail} href="#" label="Email" />
                    </div>
                </motion.div>

                <div className="text-center text-sm text-gray-600 mt-12">
                    &copy; {new Date().getFullYear()} CubeMaster. All rights reserved.
                </div>
            </div>

            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
            </div>
        </div>
    );
};

const SocialLink = ({ icon: Icon, href, label }: { icon: any, href: string, label: string }) => (
    <a
        href={href}
        className="p-3 rounded-full bg-white/5 hover:bg-white/20 hover:scale-110 transition-all duration-300 text-gray-400 hover:text-white"
        aria-label={label}
    >
        <Icon className="w-6 h-6" />
    </a>
);

export default AboutPage;
