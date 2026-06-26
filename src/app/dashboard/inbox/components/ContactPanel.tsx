/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FC } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Badge from './ui/Badge'
import { formatDistanceToNow, format } from 'date-fns'

interface ContactPanelProps {
    contactId: string;
    onBack?: () => void;
}

const ContactPanel: FC<ContactPanelProps> = ({ contactId, onBack }) => {
    const queryClient = useQueryClient();

    // Query for fetching conversation details
    const { data: conversation, isLoading } = useQuery<any>({
        queryKey: ['conversation', contactId],
        queryFn: async () => {
            const res = await fetch(`/api/conversations/${contactId}`);
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
        enabled: !!contactId,
    });

    const handleToggleHandoff = async () => {
        if (!conversation) return;
        const newStatus = conversation.status === 'bot' ? 'human' : 'bot';

        // Optimistic UI updates
        queryClient.setQueryData(['conversation', contactId], (old: any) => ({
            ...old,
            status: newStatus
        }));
        queryClient.invalidateQueries({ queryKey: ['leads'] });

        try {
            await fetch(`/api/conversations/${contactId}/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (err) {
            console.error("Failed to toggle handoff", err);
        }
    };

    const handleToggleNewsletter = async () => {
        if (!conversation) return;
        const newSub = !conversation.isSubscribedToNewsletter;

        // Optimistic UI updates
        queryClient.setQueryData(['conversation', contactId], (old: any) => ({
            ...old,
            isSubscribedToNewsletter: newSub
        }));
        queryClient.invalidateQueries({ queryKey: ['leads'] });

        try {
            await fetch(`/api/conversations/${contactId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isSubscribedToNewsletter: newSub })
            });
        } catch (err) {
            console.error("Failed to update subscription", err);
        }
    };

    if (isLoading) {
        return (
            <aside className="w-full md:w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-background flex flex-col shrink-0 p-6 space-y-6 animate-pulse">
                <div className="flex flex-col items-center space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="size-24 rounded-3xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-24 bg-slate-50 dark:bg-slate-800/50 rounded" />
                </div>
                <div className="space-y-4">
                    <div className="h-3 w-1/3 bg-slate-100 dark:bg-slate-800 rounded" />
                    <div className="h-10 bg-slate-50 dark:bg-slate-800/50 rounded" />
                    <div className="h-10 bg-slate-50 dark:bg-slate-800/50 rounded" />
                </div>
            </aside>
        );
    }

    if (!conversation) {
        return (
            <aside className="w-full md:w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-background flex flex-col shrink-0 items-center justify-center p-6 text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 text-slate-400">person_off</span>
                <p className="text-sm font-semibold">Select a lead to view details</p>
            </aside>
        );
    }

    const name = conversation.name || 'New Lead';
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    const createdAt = conversation.createdAt ? new Date(conversation.createdAt) : new Date();

    return (
        <aside className="w-full md:w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-background flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            {/* Profile Header */}
            <div className="p-6 flex flex-col items-center text-center border-b border-slate-100 dark:border-slate-800/50 relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10" />
                
                {/* Mobile Back Button */}
                <button 
                    onClick={onBack}
                    className="md:hidden absolute top-4 left-4 z-20 size-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 active:scale-95 transition-all"
                    aria-label="Back to chat"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>

                <div className="relative mt-4">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-3xl h-24 w-24 mb-4 ring-4 ring-white dark:ring-slate-900 shadow-xl"
                        style={{ backgroundImage: `url(${avatar})` }}
                    />
                    <div className="absolute -bottom-1 -right-1 size-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
                        <div className="size-2 bg-white rounded-full animate-pulse" />
                    </div>
                </div>
                
                <h4 className="text-slate-900 dark:text-white font-bold text-xl tracking-tight mb-1">
                    {name}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-6">
                    {conversation.status === 'bot' ? '🤖 AI Automation Active' : '👤 Manual Control'}
                </p>
                
                <div className="grid grid-cols-2 gap-2 w-full">
                    <button 
                        onClick={handleToggleHandoff}
                        className={`text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
                            conversation.status === 'bot' 
                                ? 'bg-primary text-white shadow-primary/20 hover:bg-primary/90' 
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white shadow-slate-200/10 dark:shadow-slate-800/10 hover:bg-slate-300 dark:hover:bg-slate-700'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">
                            {conversation.status === 'bot' ? 'handshake' : 'smart_toy'}
                        </span>
                        {conversation.status === 'bot' ? 'Take Over' : 'Give to AI'}
                    </button>
                    <a 
                        href={`tel:${conversation.phoneNumber}`}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">call</span>
                        Call Lead
                    </a>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 space-y-6 flex-1">
                {/* Contact Information */}
                <section>
                    <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                        Contact Details
                    </h5>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 group">
                            <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-100 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-lg">phone</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Phone</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                    {conversation.phoneNumber}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors border border-slate-100 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-lg">mail</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Email</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                                    {conversation.email || 'No email documented'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className={`size-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center transition-colors border border-slate-100 dark:border-slate-700/50 ${conversation.phoneNumber?.startsWith('tg_') ? 'text-slate-400 group-hover:text-blue-500' : 'text-slate-400 group-hover:text-amber-500'}`}>
                                <span className="material-symbols-outlined text-lg">
                                    {conversation.phoneNumber?.startsWith('tg_') ? 'send' : 'forum'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Channel</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                    {conversation.phoneNumber?.startsWith('tg_') ? 'Telegram Integration' : 'WhatsApp Integration'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors border border-slate-100 dark:border-slate-700/50">
                                <span className="material-symbols-outlined text-lg">calendar_today</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Created</span>
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                    {format(createdAt, 'MMM d, yyyy')}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Status Documentation Section */}
                <section className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                    <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">
                        Document Status
                    </h5>
                    
                    <div className="space-y-4">
                        {/* Handoff Status Switcher */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Automation</span>
                                <span className="text-[10px] text-slate-400">Let AI Bot handle chat</span>
                            </div>
                            <button
                                onClick={handleToggleHandoff}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    conversation.status === 'bot' ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        conversation.status === 'bot' ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Newsletter Campaign Switcher */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Newsletter</span>
                                <span className="text-[10px] text-slate-400">Add to email broadcasts</span>
                            </div>
                            <button
                                onClick={handleToggleNewsletter}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    conversation.isSubscribedToNewsletter ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        conversation.isSubscribedToNewsletter ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Recent Activity Timeline */}
                <section>
                    <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
                        Lead Activity Timeline
                    </h5>
                    <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
                        {/* Event 1: Last Activity */}
                        <div className="flex gap-4 items-start relative z-10">
                            <div className="mt-1 size-6 rounded-full shrink-0 flex items-center justify-center border-4 border-white dark:border-slate-900 bg-primary shadow-sm">
                                <div className="size-1 bg-white rounded-full animate-ping" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight mb-0.5">
                                    Last message exchanged
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                    {conversation.lastMessageAt ? formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true }) : 'Just now'}
                                </p>
                            </div>
                        </div>

                        {/* Event 2: Mode Status Changed */}
                        <div className="flex gap-4 items-start relative z-10">
                            <div className={`mt-1 size-6 rounded-full shrink-0 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm ${
                                conversation.status === 'bot' ? 'bg-purple-500' : 'bg-amber-500'
                            }`}>
                                <div className="size-1 bg-white rounded-full" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight mb-0.5">
                                    {conversation.status === 'bot' ? 'AI Bot took control' : 'Agent took control'}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">Automated routing</p>
                            </div>
                        </div>

                        {/* Event 3: Creation */}
                        <div className="flex gap-4 items-start relative z-10">
                            <div className="mt-1 size-6 rounded-full shrink-0 flex items-center justify-center border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-700 shadow-sm">
                                <div className="size-1 bg-white rounded-full" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight mb-0.5">
                                    Lead registered
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                    {format(createdAt, 'MMM d, yyyy h:mm a')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lead Badges */}
                <section>
                    <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3">
                        Lead Classification
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        <Badge color={conversation.status === 'bot' ? 'purple' : 'gray'}>
                            {conversation.status === 'bot' ? 'AI Active' : 'Manual Control'}
                        </Badge>
                        {conversation.isSubscribedToNewsletter && (
                            <Badge color="green">
                                Newsletter Subscribed
                            </Badge>
                        )}
                        <Badge color={conversation.phoneNumber?.startsWith('tg_') ? 'blue' : 'orange'}>
                            {conversation.phoneNumber?.startsWith('tg_') ? 'Telegram Lead' : 'WhatsApp Lead'}
                        </Badge>
                    </div>
                </section>
            </div>
        </aside>
    )
}

export default ContactPanel