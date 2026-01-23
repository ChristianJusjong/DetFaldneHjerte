import { BrowserRouter as Router } from 'react-router-dom';
import { DrillDownMenu } from './components/DrillDownMenu';
import { AIOracle } from './components/AIOracle';
import { SearchModal } from './components/SearchModal';
import { AnimatedRoutes } from './components/AnimatedRoutes';
import { SoundController } from './components/SoundController';
// Keeping purely for tool access logic if needed later, but removing from view

import { NPCGenerator } from './components/NPCGenerator';
import { DMScreen } from './components/DMScreen';

const App = () => {
  return (
    <Router>
      <div className="app-container min-h-screen bg-bg text-text-main font-main selection:bg-superia/30 selection:text-white">
        <SoundController />
        <DrillDownMenu />

        {/* Global Tools - Mounted here to listen to store state, triggers handled in DrillDownMenu */}
        <NPCGenerator showTrigger={false} />
        <DMScreen showTrigger={false} />

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
