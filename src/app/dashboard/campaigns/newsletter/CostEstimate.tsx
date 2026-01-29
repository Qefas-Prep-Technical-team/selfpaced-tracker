import React from 'react';
import { Calculator, Users, Clock, Zap } from 'lucide-react';

interface CostEstimateProps {
    estimatedCost: string;
    ratePerRecipient: string;
    recipientCount: number;
    deliveryTime: string;
    networkFeeIncluded?: boolean;
    onCustomize?: () => void;
    className?: string;
}

export const CostEstimate: React.FC<CostEstimateProps> = ({
    estimatedCost = '₦12,450.00',
    ratePerRecipient = '₦0.27',
    recipientCount = 45200,
    deliveryTime = '2-4 hours',
    networkFeeIncluded = true,
    onCustomize,
    className = '',
}) => {
    return (
        <div className={`border-t border-slate-200 dark:border-slate-800 pt-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold text-[#0d121b] dark:text-white">
                        Campaign Cost Estimate
                    </h3>
                </div>
                {onCustomize && (
                    <button
                        onClick={onCustomize}
                        className="text-xs text-primary font-bold hover:underline"
                    >
                        Customize
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500">Recipients</span>
                    </div>
                    <p className="text-xl font-bold">{recipientCount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">Total contacts</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500">Delivery Time</span>
                    </div>
                    <p className="text-xl font-bold">{deliveryTime}</p>
                    <p className="text-[10px] text-slate-400">Estimated</p>
                </div>
            </div>

            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Estimated Campaign Cost
                        </p>
                        <p className="text-2xl lg:text-3xl font-bold text-primary">{estimatedCost}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-slate-400">Rate: {ratePerRecipient} per recipient</p>
                        {networkFeeIncluded && (
                            <p className="text-[10px] text-green-600">Network Fee Included</p>
                        )}
                    </div>
                </div>

                {networkFeeIncluded && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/10">
                        <Zap className="w-4 h-4 text-green-500" />
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                            All Nigerian network delivery fees are included in the total cost.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};