'use client';

import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { StickyFooter } from './components/StickyFooter';
import SmsMain from './components/SmsMain';
import Link from 'next/link';
import { Button } from '../channel/components/ui/Button';
import { Phone, Mail, BarChart3, Zap, Send, Users } from 'lucide-react';

export default function MessagingCenterPage() {
    const [activeTab, setActiveTab] = useState('sms');
    const [isSending, setIsSending] = useState(false);

    const tabs = [
        { id: 'sms', label: 'SMS Messaging', icon: Phone },
        { id: 'email', label: 'Email Newsletter', icon: Mail },
        { id: 'history', label: 'History & Analytics', icon: BarChart3 },
    ];

    const handleSendBroadcast = async () => {
        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSending(false);
    };

    return (
        <main className="flex-1 flex justify-center py-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
            <div className="w-full max-w-[1200px] px-6">
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="size-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Outreach Center</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            Marketing <span className="text-primary italic">Campaigns</span>
                        </h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Multi-channel communication hub for student engagement</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-slate-400">Total Reach</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white">12,450</span>
                        </div>
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <Users size={20} />
                        </div>
                    </div>
                </div>

                <Tabs.Root
                    className="flex flex-col"
                    defaultValue="sms"
                    onValueChange={(value) => setActiveTab(value)}
                >
                    <Tabs.List className="flex items-center gap-2 bg-white/50 backdrop-blur-md dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm mb-10 w-fit">
                        {tabs.map((tab) => (
                            <Tabs.Trigger
                                key={tab.id}
                                value={tab.id}
                                className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2
                                    ${activeTab === tab.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 z-10'
                                        : 'text-slate-500 hover:bg-white dark:hover:bg-white/5'
                                    }`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>

                    <Tabs.Content value="sms" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
                            <SmsMain />
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="email" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl min-h-[600px] flex flex-col items-center justify-center text-center">
                            <div className="size-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 mb-6">
                                <Mail size={40} />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Newsletter Builder</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 text-sm">Design and broadcast premium newsletters to your subscribers.</p>
                            <Link href="/dashboard/campaigns/newsletter">
                                <Button variant="primary" icon={Send} className="px-10 py-4 text-xs font-black uppercase tracking-widest">
                                    Open Designer
                                </Button>
                            </Link>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="history" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/70 backdrop-blur-md dark:bg-slate-900/70 p-20 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl text-center">
                             <div className="size-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <BarChart3 size={32} className="text-slate-400" />
                             </div>
                             <h3 className="text-xl font-bold mb-2">Broadcasting History</h3>
                             <p className="text-sm text-slate-500 max-w-xs mx-auto">Track the performance and delivery status of your previous campaigns.</p>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>

            {activeTab === 'sms' && (
                <StickyFooter
                    onSaveDraft={() => console.log('Draft saved')}
                    onSendBroadcast={handleSendBroadcast}
                    isSending={isSending}
                />
            )}
        </main>
    );
}