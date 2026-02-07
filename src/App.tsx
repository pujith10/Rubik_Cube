import { Routes, Route, useLocation } from 'react-router-dom';

import CubeSelectorPage from './pages/CubeSelectorPage';
import SolverPage from './pages/SolverPage';
import MethodsPage from './pages/MethodsPage';
import TutorialPage from './pages/TutorialPage';
import PracticePage from './pages/PracticePage';
import AlgorithmsPage from './pages/AlgorithmsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import Navbar from './components/layout/Navbar';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<CubeSelectorPage />} />
          <Route path="/cube/:size" element={<CubeSelectorPage />} />
          <Route path="/solver/:size" element={<SolverPage />} />
          <Route path="/methods" element={<MethodsPage />} />
          <Route path="/tutorial/:method/:size" element={<TutorialPage />} />
          <Route path="/practice/:size" element={<PracticePage />} />
          <Route path="/algorithms/:size/:category" element={<AlgorithmsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
