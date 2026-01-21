import { BrowserRouter as Router } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Sidebar } from './components/Sidebar';
import { AIOracle } from './components/AIOracle';
import { SearchModal } from './components/SearchModal';
import { AnimatedRoutes } from './components/AnimatedRoutes';
import { SoundController } from './components/SoundController';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <SoundController />
        <Sidebar />
        <main className="main-content lg:ml-[280px] min-h-screen transition-all duration-300">
          <AnimatedRoutes />
        </main>
        <AIOracle />
        <SearchModal />
        <SpeedInsights />
      </div>
    </Router>
  );
};

export default App;
