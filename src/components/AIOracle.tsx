import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLore } from '../utils/data';
import { getContextFromPath } from '../utils/contextHelper';
import { clsx } from 'clsx';
import { MysticCard } from './ui/MysticCard';

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

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Local RAG Logic
        const query = input.toLowerCase();
        let answer = "Jeg ser tåge... Spørg mere specifikt.";
        const data = getLore();
        let found = false;

        // 0. Check Context First
        const currentContext = getContextFromPath(location.pathname);
        if (currentContext && (query.includes('her') || query.includes('dette') || query.includes('denne') || query.includes('by') || query.includes('hvem'))) {
            // If user asks about "here", "this", etc., and we have context, use it.
            // Simple heuristic: if we have context and regular search yields nothing specific, we might pivot to context.
            // But let's prioritize direct matches first, then context fallback or enhancement.

            // Actually, let's mix it in. If the query implies context ("Hvad sker der her?"), we use it.
            if (query.includes('her') || query.includes('rygte') || query.includes('fortæl')) {
                answer = `${currentContext} \n\n(Kontekstuel viden)`;
                found = true;
            }
        }

        // 1. Check Gods
        if (!found) {
            data.religion.gods.forEach(g => {
                if (query.includes(g.name.toLowerCase()) || query.includes(g.domain.toLowerCase())) {
                    answer = `Ah, **${g.name}**. Guden for ${g.domain}. Deres symbol er ${g.symbol}. ${g.followers ? `De følges af ${g.followers}.` : ''}`;
                    found = true;
                }
            });
        }

        // 2. Check Continents & Races
        if (!found) {
            data.planes.forEach(p => p.continents.forEach(c => {
                if (query.includes(c.name.toLowerCase())) {
                    answer = `${c.name}, også kendt som "${c.title}". ${c.description.substring(0, 150)}... ${c.culturalQuote ? `Som de siger: "${c.culturalQuote}"` : ''}`;
                    found = true;
                }
                c.races.forEach(r => {
                    if (query.includes(r.name.toLowerCase())) {
                        answer = `**${r.name}**. ${r.description} (Mekanik: ${r.mechanic})`;
                        found = true;
                    }
                });
            }));
        }

        // 3. Check Conflict
        if (!found && (query.includes('konflikt') || query.includes('krig') || query.includes('sygdom') || query.includes('autoimmun'))) {
            answer = `Du spørger om **${data.conflict.title}**. ${data.conflict.description}`;
            found = true;
        }

        // 4. Default Mysticism + Context Fallback
        if (!found) {
            if (currentContext) {
                answer = `Jeg er ikke sikker på præcis hvad du mener, men du befinder dig et sted med historie: ${currentContext}`;
            } else {
                answer = `Jeg hører din stemme, men ${query} er skjult for mig i øjeblikket. Prøv at spørge om en Gud, en Race eller et Kontinent.`;
            }
        }

        // Simulate AI response delay
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: answer
            }]);
        }, 800);
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
