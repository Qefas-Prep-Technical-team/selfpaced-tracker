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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" />
                Message Composer
            </h3>

            <div className="relative">
                <textarea
                    value={message}
                    onChange={handleChange}
                    className="form-textarea w-full h-48 rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-primary focus:ring-primary text-base"
                    placeholder="Type your message here..."
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                        onClick={onPersonalize}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                        title="Personalization Tokens"
                    >
                        <AtSign className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onTemplates}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                        title="Templates"
                    >
                        <Layers className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-[#4c669a] uppercase">
                        Characters
                    </p>
                    <p className="text-xl font-black">
                        {characters}
                        <span className="text-xs text-slate-400 font-normal"> / 160</span>
                    </p>
                </div>
                <div className="text-center border-x border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-[#4c669a] uppercase">
                        Page Units
                    </p>
                    <p className="text-xl font-black">
                        {units}
                        <span className="text-xs text-slate-400 font-normal"> SMS</span>
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-[#4c669a] uppercase">
                        Total Billing
                    </p>
                    <p className="text-xl font-black text-primary">
                        {units * recipientCount}
                        <span className="text-xs text-slate-400 font-normal"> Units</span>
                    </p>
                </div>
            </div>
        </div>
    );
};