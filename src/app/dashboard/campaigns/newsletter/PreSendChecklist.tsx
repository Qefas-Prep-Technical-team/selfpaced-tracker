import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface ChecklistItem {
    id: string;
    title: string;
    description?: string;
    status: 'passed' | 'warning' | 'failed' | 'pending';
    action?: () => void;
}

interface PreSendChecklistProps {
    items?: ChecklistItem[];
    onItemClick?: (itemId: string) => void;
    className?: string;
}

export const PreSendChecklist: React.FC<PreSendChecklistProps> = ({
    items = [
        {
            id: 'domain',
            title: 'Domain Verified (analytics.com.ng)',
            status: 'passed',
        },
        {
            id: 'subject',
            title: 'Subject Line Optimized',
            description: 'Subject line is under 60 characters',
            status: 'passed',
        },
        {
            id: 'content',
            title: 'Content Quality Check',
            description: 'No broken links detected',
            status: 'passed',
        },
        {
            id: 'batch',
            title: 'Large Batch Sending',
            description: 'Scheduled for 45,200 contacts. Delivery may be staggered to Nigerian networks.',
            status: 'warning',
        },
        {
            id: 'spam',
            title: 'Spam Score Analysis',
            description: 'Low risk of being marked as spam',
            status: 'passed',
        },
        {
            id: 'unsubscribe',
            title: 'Unsubscribe Link',
            description: 'Missing unsubscribe link in footer',
            status: 'failed',
        },
    ],
    onItemClick,
    className = '',
}) => {
    const getStatusConfig = (status: ChecklistItem['status']) => {
        switch (status) {
            case 'passed':
                return {
                    icon: <CheckCircle className="w-4 h-4" />,
                    bgColor: 'bg-green-100 dark:bg-green-900/30',
                    textColor: 'text-green-600 dark:text-green-400',
                    badgeColor: 'bg-green-50 dark:bg-green-900/40 text-green-600',
                    badgeText: 'PASSED',
                };
            case 'warning':
                return {
                    icon: <AlertTriangle className="w-4 h-4" />,
                    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
                    textColor: 'text-amber-600 dark:text-amber-400',
                    badgeColor: 'bg-amber-50 dark:bg-amber-900/40 text-amber-600',
                    badgeText: 'WARNING',
                };
            case 'failed':
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    textColor: 'text-red-600 dark:text-red-400',
                    badgeColor: 'bg-red-50 dark:bg-red-900/40 text-red-600',
                    badgeText: 'FAILED',
                };
            case 'pending':
                return {
                    icon: <Info className="w-4 h-4" />,
                    bgColor: 'bg-slate-100 dark:bg-slate-800',
                    textColor: 'text-slate-400',
                    badgeColor: 'bg-slate-50 dark:bg-slate-800 text-slate-400',
                    badgeText: 'PENDING',
                };
            default:
                return {
                    icon: <Info className="w-4 h-4" />,
                    bgColor: 'bg-slate-100 dark:bg-slate-800',
                    textColor: 'text-slate-400',
                    badgeColor: 'bg-slate-50 dark:bg-slate-800 text-slate-400',
                    badgeText: 'PENDING',
                };
        }
    };

    const passedCount = items.filter(item => item.status === 'passed').length;
    const totalCount = items.length;

    return (
        <div className={`bg-background-light dark:bg-slate-800 rounded-xl p-4 lg:p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm lg:text-base font-bold text-[#0d121b] dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    Pre-Send Checklist
                </h3>
                <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {passedCount}/{totalCount} Complete
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item) => {
                    const config = getStatusConfig(item.status);

                    return (
                        <div
                            key={item.id}
                            onClick={() => onItemClick?.(item.id)}
                            className={`flex items-start justify-between p-3 rounded-lg cursor-pointer hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors ${item.action ? 'hover:scale-[1.01]' : ''
                                }`}
                        >
                            <div className="flex items-start gap-3 flex-1">
                                <div className={`${config.bgColor} p-2 rounded-full flex-shrink-0`}>
                                    {config.icon}
                                </div>
                                <div className="flex-1">
                                    <span className={`text-sm font-medium ${config.textColor}`}>
                                        {item.title}
                                    </span>
                                    {item.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ml-2 ${config.badgeColor}`}>
                                {config.badgeText}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Overall Score:</span>
                    <div className="flex items-center gap-2">
                        <div className="w-24 lg:w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${(passedCount / totalCount) * 100}%` }}
                            />
                        </div>
                        <span className="font-bold text-green-600">
                            {Math.round((passedCount / totalCount) * 100)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};