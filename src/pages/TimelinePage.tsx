import { Timeline } from "../components/visual/Timeline";
import { motion } from "framer-motion";

export const TimelinePage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 max-w-[1920px] mx-auto min-h-screen flex flex-col"
        >
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-serif text-superia mb-2 drop-shadow-lg">Tidens Hjul</h1>
                <p className="text-white/70 max-w-2xl mx-auto font-serif italic">
                    "Historien er ikke en lige linje, men en cirkel af gentagne fejl."
                </p>
            </div>

            <div className="flex-1">
                <Timeline />
            </div>
        </motion.div>
    );
};
