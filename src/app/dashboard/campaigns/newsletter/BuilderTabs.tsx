'use client';

import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Mail, MessageSquare, History } from 'lucide-react';

interface BuilderTab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number;
    disabled?: boolean;
}

interface BuilderTabsProps {
    tabs?: BuilderTab[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    className?: string;
}

export const BuilderTabs: React.FC<BuilderTabsProps> = ({
    tabs = [
        {
            id: 'email',
            label: 'Email Newsletter',
            icon: <Mail className="w-4 h-4" />,
        },
        {
            id: 'sms',
            label: 'SMS Campaign',
            icon: <MessageSquare className="w-4 h-4" />,
            badge: 3,
        },
        {
            id: 'logs',
            label: 'Delivery Logs',
            icon: <History className="w-4 h-4" />,
        },
    ],
    activeTab = 'email',
    onTabChange,
    className = '',
}) => {
    return (
        <div className={`max-w-[1440px] w-full mx-auto px-6 lg:px-10 ${className}`}>
            <Tabs.Root value={activeTab} onValueChange={onTabChange}>
                <Tabs.List className="flex border-b border-[#cfd7e7] dark:border-slate-800 overflow-x-auto">
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.id}
                            value={tab.id}
                            disabled={tab?.disabled}
                            className="group flex items-center gap-2 border-b-[3px] border-transparent pb-3 px-4 lg:px-0 lg:mr-8 transition-all data-[state=active]:border-primary whitespace-nowrap"
                        >
                            {tab.icon && <span className="text-slate-400">{tab.icon}</span>}
                            <span className="text-sm font-bold tracking-[0.015em] group-data-[state=active]:text-primary group-data-[state=inactive]:text-[#4c669a] group-data-[state=inactive]:hover:text-primary">
                                {tab.label}
                            </span>
                            {tab.badge && (
                                <span className="ml-2 bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                    {tab.badge}
                                </span>
                            )}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>
            </Tabs.Root>
        </div>
    );
};