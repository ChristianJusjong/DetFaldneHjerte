import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContextFromPath } from '@/shared/utils/contextHelper';
import { queryOracle } from '@/features/oracle/engine/oracleEngine';
import { clsx } from 'clsx';
import { MysticCard } from '@/shared/components/MysticCard';

export const AIOracle = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Jeg er Hjertets Oracle. Hvad ønsker du at vide om Cor?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Context Logic
        const currentContext = getContextFromPath(location.pathname);

        // Simulate thinking delay + Get Answer
        // We put the delay here or inside the engine? 
        // Engine is async now, so we can just await it, maybe add artificial delay if too fast.

        setTimeout(async () => {
            const response = await queryOracle(userMsg.text, currentContext || undefined);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: response.text
            }]);
        }, 600);
    };

    return (
        <>
            <div
                className="fixed bottom-8 right-8 z-50 p-4 bg-superia rounded-full shadow-lg border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform animate-pulse hover:animate-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Sparkles className="text-white" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-24 right-8 w-96 h-[500px] z-50"
                    >
                        <MysticCard noPadding className="h-full flex flex-col overflow-hidden !rounded-3xl border-superia/20 shadow-2xl bg-black/80 backdrop-blur-xl">
                            <div className="p-4 bg-superia/10 border-b border-white/10 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-superia font-semibold">
                                    <Sparkles size={18} />
                                    <span>Hjertets Oracle</span>
                                </div>
                                <X size={18} className="cursor-pointer text-text-dim hover:text-white" onClick={() => setIsOpen(false)} />
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "max-w-[85%] p-4 text-sm leading-relaxed shadow-sm relative",
                                            m.role === 'ai'
                                                ? "self-start bg-white/10 text-gray-100 rounded-tr-xl rounded-bl-xl rounded-br-xl rounded-tl-sm border border-white/10"
                                                : "self-end bg-superia/10 text-superia rounded-tl-xl rounded-bl-xl rounded-br-xl rounded-tr-sm border border-superia/20"
                                        )}
                                    >
                                        <div className="font-serif italic mb-1 opacity-50 text-xs">
                                            {m.role === 'ai' ? 'Oracle' : 'Dig'}
                                        </div>
                                        {m.text}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-3 border-t border-white/10 flex gap-2 bg-black/40 backdrop-blur-md">
                                <input
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-superia/50 transition-colors placeholder:text-text-dim font-serif"
                                    placeholder="Spørg om kampagnen..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    className="p-2 bg-superia/20 text-superia border border-superia/30 rounded-lg cursor-pointer hover:bg-superia hover:text-black transition-all flex items-center justify-center"
                                    onClick={handleSend}
                                >
                                    <Send size={18} className="ml-0.5" />
                                </button>
                            </div>
                        </MysticCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
