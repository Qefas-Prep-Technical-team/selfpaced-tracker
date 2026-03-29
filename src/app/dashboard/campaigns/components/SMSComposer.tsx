import React, { useState } from 'react';
import { Edit, AtSign, Layers, Send } from 'lucide-react';

interface SMSComposerProps {
    initialMessage?: string;
    onMessageChange?: (message: string, characters: number, units: number) => void;
    onPersonalize?: () => void;
    onTemplates?: () => void;
    unitPrice?: number;
    recipientCount?: number;
}

export const SMSComposer: React.FC<SMSComposerProps> = ({
    initialMessage = '',
    onMessageChange,
    onPersonalize,
    onTemplates,
    unitPrice = 12,
    recipientCount = 42,
}) => {
    const [message, setMessage] = useState(initialMessage);
    const [characters, setCharacters] = useState(142);
    const [units, setUnits] = useState(1);

    const calculateMessageStats = (text: string) => {
        const chars = text.length;
        const smsUnits = Math.ceil(chars / 160);

        setCharacters(chars);
        setUnits(smsUnits);

        onMessageChange?.(text, chars, smsUnits);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = e.target.value;
        setMessage(newMessage);
        calculateMessageStats(newMessage);
    };

    const totalCost = units * recipientCount * unitPrice;

    return (
        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden relative group">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <Edit className="w-5 h-5" />
                </div>
                Creative Studio
            </h3>

            <div className="relative group/field">
                <textarea
                    value={message}
                    onChange={handleChange}
                    className="w-full h-64 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 text-lg font-medium text-slate-800 dark:text-white transition-all outline-none resize-none placeholder:text-slate-400"
                    placeholder="Craft your message here..."
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover/field:opacity-100 transition-opacity">
                    <button
                        onClick={onPersonalize}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 hover:text-primary hover:scale-110 transition-all shadow-xl"
                        title="Personalization Tokens"
                    >
                        <AtSign className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onTemplates}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 hover:text-primary hover:scale-110 transition-all shadow-xl"
                        title="Templates"
                    >
                        <Layers className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-transparent hover:border-indigo-500/10 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Characters</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {characters}<span className="text-xs text-slate-400 opacity-50 ml-1">/ 160</span>
                    </p>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-transparent hover:border-indigo-500/10 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sms Units</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {units}<span className="text-xs text-slate-400 opacity-50 ml-1">PAGES</span>
                    </p>
                </div>
                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 transition-all">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Est. Billing</p>
                    <p className="text-2xl font-black text-primary">
                        {units * recipientCount}<span className="text-xs opacity-50 ml-1 font-bold">UNITS</span>
                    </p>
                </div>
            </div>
        </div>
    );
};