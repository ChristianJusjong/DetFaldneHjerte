import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] w-full">
            <motion.div
                className="w-16 h-16 border-4 border-superia/20 border-t-superia rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-superia font-serif text-lg tracking-wider"
            >
                Kalder på visdommen...
            </motion.p>
        </div>
    );
};
