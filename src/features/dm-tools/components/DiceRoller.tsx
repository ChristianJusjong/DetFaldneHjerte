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
                className="fixed bottom-20 right-4 z-40 p-3 rounded-full bg-surface border border-border text-superia shadow-lg hover:bg-surface-highlight transition-colors"
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
                        className="fixed bottom-36 right-4 z-50 w-72 bg-surface/90 border border-border rounded-2xl shadow-glass overflow-hidden backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between p-3 bg-black/30 border-b border-border/50">
                            <h3 className="text-superia font-serif font-bold tracking-widest text-sm">SKÆBNEN</h3>
                            <button onClick={() => setIsOpen(false)} className="text-text-dim hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 flex flex-col items-center">
                            <ReactDice
                                numDice={2}
                                ref={reactDice}
                                rollDone={rollDone}
                                faceColor="#1a1a1a"
                                dotColor="#fcd34d"
                                dieSize={50}
                                rollTime={2}
                                disableIndividual={false}
                            />

                            <div className="mt-5 text-center">
                                <div className="text-[10px] text-text-dim uppercase tracking-[0.2em] font-main font-semibold mb-1">Total</div>
                                <div className="text-4xl font-bold text-white font-main">{total}</div>
                            </div>

                            <button
                                onClick={rollAll}
                                className="mt-6 w-full py-2.5 bg-superia/10 hover:bg-superia/20 border border-superia/30 hover:border-superia/50 text-superia rounded-lg transition-all font-main font-semibold shadow-[0_0_15px_rgba(252,211,77,0.1)] hover:shadow-[0_0_20px_rgba(252,211,77,0.2)]"
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
