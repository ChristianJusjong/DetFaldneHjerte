import { Suspense, lazy } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DrillDownMenu } from './components/DrillDownMenu';
import { AIOracle } from './components/AIOracle';
import { SearchModal } from './components/SearchModal';
import { AnimatedRoutes } from './components/AnimatedRoutes';
import { SoundController } from './components/SoundController';
import { WeatherOverlay } from './components/visual/WeatherOverlay';


// Lazy Load Tools
const NPCGenerator = lazy(() => import('./components/NPCGenerator').then(module => ({ default: module.NPCGenerator })));
const DMScreen = lazy(() => import('./components/DMScreen').then(module => ({ default: module.DMScreen })));
const DiceRoller = lazy(() => import('./components/tools/DiceRoller').then(module => ({ default: module.DiceRoller })));

const App = () => {
  return (
    <Router>
      <div className="app-container min-h-screen bg-bg text-text-main font-main selection:bg-superia/30 selection:text-white">
        <WeatherOverlay />
        <SoundController />
        <DrillDownMenu />

        {/* Global Tools - Lazy Loaded */}
        <Suspense fallback={null}>
          <NPCGenerator showTrigger={false} />
          <DMScreen showTrigger={false} />
          <DiceRoller />
        </Suspense>

        {/* Main Content - Padded top for fixed nav, removed left margin since sidebar is gone */}
        <main className="pt-20 px-4 md:px-8 max-w-[1920px] mx-auto min-h-screen transition-all duration-300 relative z-10">
          <AnimatedRoutes />
        </main>

        <AIOracle />
        <SearchModal />
      </div>
    </Router>
  );
};

export default App;
