import React from 'react';
import { Save, Send } from 'lucide-react';

interface StickyFooterProps {
    estimatedCost?: string;
    estimatedDelivery?: string;
    totalRecipients?: number;
    onSaveDraft?: () => void;
    onSendBroadcast?: () => void;
    isSending?: boolean;
}

export const StickyFooter: React.FC<StickyFooterProps> = ({
    estimatedCost = '₦504.00',
    estimatedDelivery = 'Instant (98.9%)',
    totalRecipients = 42,
    onSaveDraft,
    onSendBroadcast,
    isSending = false,
}) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-2xl z-40">
            <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-6 md:gap-8">
                    {/* Estimated Cost */}
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#4c669a] uppercase tracking-wider">
                            Estimated Cost
                        </span>
                        <span className="text-xl md:text-2xl font-black text-primary tracking-tight">
                            {estimatedCost}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex gap-6 border-l border-slate-100 dark:border-slate-800 pl-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#4c669a] uppercase">
                                Est. Delivery
                            </span>
                            <span className="text-sm font-semibold">{estimatedDelivery}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-[#4c669a] uppercase">
                                Total Volume
                            </span>
                            <span className="text-sm font-semibold">
                                {totalRecipients} Recipients
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={onSaveDraft}
                        className="px-4 md:px-6 py-2 md:py-3 border border-slate-200 dark:border-slate-700 rounded-lg md:rounded-xl text-sm font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                        <Save className="inline-block w-4 h-4 mr-2" />
                        Save Draft
                    </button>
                    <button
                        onClick={onSendBroadcast}
                        disabled={isSending}
                        className="px-6 md:px-10 py-2 md:py-3 bg-primary text-white rounded-lg md:rounded-xl text-sm font-black hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                        {isSending ? 'Sending...' : 'Send Broadcast'}
                    </button>
                </div>
            </div>
        </footer>
    );
};