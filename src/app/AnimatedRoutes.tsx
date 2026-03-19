import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

// Eager Load Home
import { HomePage } from '../pages/HomePage';

// Lazy Load Pages
const PlanePage = lazy(() => import('../pages/PlanePage').then(module => ({ default: module.PlanePage })));
const ContinentPage = lazy(() => import('../pages/ContinentPage').then(module => ({ default: module.ContinentPage })));
const RegionPage = lazy(() => import('../pages/RegionPage').then(module => ({ default: module.RegionPage })));
const CityPage = lazy(() => import('../pages/CityPage').then(module => ({ default: module.CityPage })));
const AssetPage = lazy(() => import('../pages/AssetPage').then(module => ({ default: module.AssetPage })));
const LoreEntityPage = lazy(() => import('../pages/LoreEntityPage').then(module => ({ default: module.LoreEntityPage })));
const ConflictPage = lazy(() => import('../pages/ConflictPage').then(module => ({ default: module.ConflictPage })));
const ReligionPage = lazy(() => import('../pages/ReligionPage').then(module => ({ default: module.ReligionPage })));
const RacesPage = lazy(() => import('../pages/RacesPage').then(module => ({ default: module.RacesPage })));
const OrganizationsPage = lazy(() => import('../pages/OrganizationsPage').then(module => ({ default: module.OrganizationsPage })));
const TravelPage = lazy(() => import('../pages/TravelPage').then(module => ({ default: module.TravelPage })));
const BestiaryPage = lazy(() => import('../pages/BestiaryPage').then(module => ({ default: module.BestiaryPage })));
const LoreWebPage = lazy(() => import('../pages/LoreWebPage').then(module => ({ default: module.LoreWebPage })));
const TimelinePage = lazy(() => import('../pages/TimelinePage').then(module => ({ default: module.TimelinePage })));
const InteractiveMap = lazy(() => import('@/features/map/components/InteractiveMap').then(module => ({ default: module.InteractiveMap })));

const PageTransition = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.01, filter: 'blur(4px)' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full"
    >
        {children}
    </motion.div>
);

export const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                    <Route path="/plane/:planeId" element={<PageTransition><PlanePage /></PageTransition>} />
                    <Route path="/continent/:continentId" element={<PageTransition><ContinentPage /></PageTransition>} />
                    <Route path="/continent/:continentId/:regionId" element={<PageTransition><RegionPage /></PageTransition>} />
                    <Route path="/continent/:continentId/:regionId/:cityId" element={<PageTransition><CityPage /></PageTransition>} />

                    <Route path="/continent/:continentId/:regionId/:cityId/:districtId/:assetId" element={<PageTransition><AssetPage /></PageTransition>} />
                    <Route path="/asset/:id" element={<PageTransition><AssetPage /></PageTransition>} />
                    <Route path="/lore/:type/:id" element={<PageTransition><LoreEntityPage /></PageTransition>} />

                    <Route path="/conflict" element={<PageTransition><ConflictPage /></PageTransition>} />
                    <Route path="/religion" element={<PageTransition><ReligionPage /></PageTransition>} />
                    <Route path="/races" element={<PageTransition><RacesPage /></PageTransition>} />
                    <Route path="/organizations" element={<PageTransition><OrganizationsPage /></PageTransition>} />
                    <Route path="/travel" element={<PageTransition><TravelPage /></PageTransition>} />
                    <Route path="/bestiary" element={<PageTransition><BestiaryPage /></PageTransition>} />

                    <Route path="/web" element={<PageTransition><LoreWebPage /></PageTransition>} />
                    <Route path="/timeline" element={<PageTransition><TimelinePage /></PageTransition>} />
                    <Route path="/map" element={<PageTransition><InteractiveMap /></PageTransition>} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
};
