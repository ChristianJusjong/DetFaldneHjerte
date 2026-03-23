import { Suspense, lazy, useEffect } from 'react';
import { Sidebar } from '@/features/navigation/components/Sidebar';
import { AIOracle } from '@/features/oracle/components/AIOracle';
import { SearchModal } from '@/features/search/components/SearchModal';
import { AnimatedRoutes } from '@/app/AnimatedRoutes';
import { SoundController } from '@/features/audio/components/SoundController';
import { WeatherOverlay } from '@/features/map/components/WeatherOverlay';
import { useGameStore } from '@/app/store/useGameStore';
import clsx from 'clsx';

// Lazy Load Tools
const NPCGenerator = lazy(() => import('@/features/dm-tools/components/NPCGenerator').then(module => ({ default: module.NPCGenerator })));
const DMScreen = lazy(() => import('@/features/dm-tools/components/DMScreen').then(module => ({ default: module.DMScreen })));
const DiceRoller = lazy(() => import('@/features/dm-tools/components/DiceRoller').then(module => ({ default: module.DiceRoller })));

const App = () => {
    const { setSearchOpen, isSearchOpen, isSidebarCollapsed } = useGameStore();

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
        <div className="app-container min-h-screen bg-bg text-text-main font-main selection:bg-superia/30 selection:text-white flex overflow-x-hidden">
            <WeatherOverlay />
            <SoundController />
            <Sidebar />

            <div className="flex-1 flex flex-col w-full relative">
                {/* Global Tools - Lazy Loaded */}
                <Suspense fallback={null}>
                    <NPCGenerator showTrigger={false} />
                    <DMScreen showTrigger={false} />
                    <DiceRoller />
                </Suspense>

                {/* Main Content - Dynamic padding based on sidebar on desktop, top-offset on mobile */}
                <main 
                    className={clsx(
                        "pt-24 lg:pt-12 px-4 md:px-8 max-w-[2000px] mx-auto min-h-screen transition-all duration-500 relative z-10 w-full",
                        isSidebarCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"
                    )}
                >
                    <AnimatedRoutes />
                </main>

                <AIOracle />
            </div>
            <SearchModal />
        </div>
    );
};

export default App;
