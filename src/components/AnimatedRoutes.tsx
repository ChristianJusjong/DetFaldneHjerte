import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import { HomePage } from '../pages/HomePage';
import { PlanePage } from '../pages/PlanePage';
import { ContinentPage } from '../pages/ContinentPage';
import { ConflictPage } from '../pages/ConflictPage';
import { ReligionPage } from '../pages/ReligionPage';
import { RacesPage } from '../pages/RacesPage';
import { OrganizationsPage } from '../pages/OrganizationsPage';
import { TravelPage } from '../pages/TravelPage';
import { BestiaryPage } from '../pages/BestiaryPage';
import { CityPage } from '../pages/CityPage';
import { RegionPage } from '../pages/RegionPage';
import { AssetPage } from '../pages/AssetPage';
import { LoreEntityPage } from '../pages/LoreEntityPage';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
};

export const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                <Route path="/plane/:planeId" element={<PageTransition><PlanePage /></PageTransition>} />
                <Route path="/continent/:continentId" element={<PageTransition><ContinentPage /></PageTransition>} />
                <Route path="/continent/:continentId/:regionId" element={<PageTransition><RegionPage /></PageTransition>} />
                <Route path="/continent/:continentId/:regionId/:cityId" element={<PageTransition><CityPage /></PageTransition>} />
                <Route path="/continent/:continentId/:regionId/:cityId/:districtId/:assetId" element={<PageTransition><AssetPage /></PageTransition>} />
                <Route path="/lore/:type/:id" element={<PageTransition><LoreEntityPage /></PageTransition>} />
                <Route path="/conflict" element={<PageTransition><ConflictPage /></PageTransition>} />
                <Route path="/religion" element={<PageTransition><ReligionPage /></PageTransition>} />
                <Route path="/races" element={<PageTransition><RacesPage /></PageTransition>} />
                <Route path="/organizations" element={<PageTransition><OrganizationsPage /></PageTransition>} />
                <Route path="/travel" element={<PageTransition><TravelPage /></PageTransition>} />
                <Route path="/bestiary" element={<PageTransition><BestiaryPage /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};
