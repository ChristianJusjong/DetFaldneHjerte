import { useState, useRef } from 'react';
import ReactDice, { type ReactDiceRef } from 'react-dice-complete';
import { Dices, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DiceRoller = () => {
    const reactDice = useRef<ReactDiceRef>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [total, setTotal] = useState(0);

    const rollAll = () => {
        reactDice.current?.rollAll();
    };

    const rollDone = (totalValue: number) => {
        setTotal(totalValue);
    };

    return (
        <>
            {/* Toggle Button (Floating) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 right-4 z-40 p-3 rounded-full bg-surface border border-border text-superia shadow-lg hover:bg-surface-light transition-colors"
                title="Terninger"
            >
                <Dices size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-36 right-4 z-50 w-72 bg-surface-dark border border-superia/30 rounded-lg shadow-2xl overflow-hidden backdrop-blur-md"
                    >
                        <div className="flex items-center justify-between p-3 bg-black/40 border-b border-white/10">
                            <h3 className="text-superia font-serif font-bold">Skæbnen</h3>
                            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4 flex flex-col items-center">
                            <ReactDice
                                numDice={2}
                                ref={reactDice}
                                rollDone={rollDone}
                                faceColor="#1a1a1a"
                                dotColor="#d4af37"
                                dieSize={50}
                                rollTime={2}
                                disableIndividual={false}
                            />

                            <div className="mt-4 text-center">
                                <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Total</div>
                                <div className="text-3xl font-bold text-white">{total}</div>
                            </div>

                            <button
                                onClick={rollAll}
                                className="mt-4 w-full py-2 bg-superia/10 hover:bg-superia/20 border border-superia/30 text-superia rounded transition-colors font-serif font-bold"
                            >
                                Rul Terningerne
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
