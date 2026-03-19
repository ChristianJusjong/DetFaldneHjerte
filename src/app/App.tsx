import { Suspense, lazy } from 'react';
import { DrillDownMenu } from '@/features/lore/components/DrillDownMenu';
import { AIOracle } from '@/features/oracle/components/AIOracle';
import { SearchModal } from '@/features/search/components/SearchModal';
import { AnimatedRoutes } from '@/app/AnimatedRoutes';
import { SoundController } from '@/features/audio/components/SoundController';
import { WeatherOverlay } from '@/features/map/components/WeatherOverlay';

import { useGameStore } from '@/app/store/useGameStore';
import { useEffect } from 'react';

// Lazy Load Tools
const NPCGenerator = lazy(() => import('@/features/dm-tools/components/NPCGenerator').then(module => ({ default: module.NPCGenerator })));
const DMScreen = lazy(() => import('@/features/dm-tools/components/DMScreen').then(module => ({ default: module.DMScreen })));
const DiceRoller = lazy(() => import('@/features/dm-tools/components/DiceRoller').then(module => ({ default: module.DiceRoller })));

const App = () => {
  const { setSearchOpen, isSearchOpen } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search with / or Ctrl+K (excluding inputs)
      if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && 
          !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen, isSearchOpen]);

  return (
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
  );
};

export default App;
