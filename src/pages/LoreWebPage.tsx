import { LoreGraph } from '@/features/lore/components/LoreGraph';
import { motion } from "framer-motion";

export const LoreWebPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 max-w-7xl mx-auto"
        >
            <h1 className="text-4xl font-serif text-superia mb-6 drop-shadow-lg">Det Store Vidensnet</h1>
            <p className="text-white/70 mb-8 max-w-2xl text-lg font-serif italic">
                "Alt er forbundet. Fra de højeste guder til de mindste byer strømmer magiens linjer."
            </p>

            <div className="h-[70vh]">
                <LoreGraph />
            </div>
        </motion.div>
    );
};
