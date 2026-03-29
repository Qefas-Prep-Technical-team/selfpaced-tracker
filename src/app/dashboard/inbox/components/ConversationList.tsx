/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FC, useEffect } from 'react'
import Chip from './ui/Chip'
import SearchBar from './ui/SearchBar'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { pusherClient } from '@/lib/pusher'

interface ConversationListProps {
    selectedContact: string
    onSelectContact: (id: string) => void
}

const fetchLeads = async () => {
    const res = await fetch('/api/conversations')
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
}

// Define the Contact type (or import it if you have it in a separate file)
interface Contact {
    id: string
    name: string
    email: string
    avatar: string
    status: 'online' | 'offline' | 'away'
    role?: string
}

interface ConversationListProps {
    contacts: Contact[]; // <--- ADD THIS LINE
    selectedContact: string;
    onSelectContact: (id: string) => void;
}

const ConversationList: FC<ConversationListProps> = ({ 
    contacts, // <--- AND DESTRUCTURE IT HERE
    selectedContact, 
    onSelectContact 
}) => {
    const queryClient = useQueryClient()
    const { data: conversations, isLoading } = useQuery({
        queryKey: ["leads"],
        queryFn: fetchLeads,
    })

    // Real-time updates via Pusher
    useEffect(() => {
        const channel = pusherClient.subscribe('chat-updates')
        
        // Listen for new messages to re-sort or update the list
        channel.bind('new-message', () => {
            queryClient.invalidateQueries({ queryKey: ["leads"] })
        })

        return () => { pusherClient.unsubscribe('chat-updates') }
    }, [queryClient])
    console.log(conversations)

    return (
        <aside className="w-85 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col shrink-0 overflow-hidden">
            <div className="p-6 flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Messages</h1>
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-sm">
                        <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                </div>
                <SearchBar placeholder="Search conversations..." />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex gap-3 p-3">
                                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 animate-pulse rounded" />
                                    <div className="h-2 w-3/4 bg-slate-50 dark:bg-slate-800/50 animate-pulse rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {conversations?.map((contact: any) => (
                            <div
                                key={contact.id}
                                onClick={() => onSelectContact(contact.id)}
                                className={`group flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200 relative ${
                                    selectedContact === contact.id
                                    ? 'bg-primary/[0.03] dark:bg-primary/[0.05]'
                                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                            >
                                {selectedContact === contact.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                )}

                                <div className="relative shrink-0">
                                    <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-900 shadow-sm group-hover:shadow-md transition-shadow">
                                        <img 
                                            src={contact.avatar} 
                                            className="h-full w-full object-cover" 
                                            alt={contact.name} 
                                        />
                                    </div>
                                    {contact.status === 'online' && (
                                        <div className="absolute bottom-0.5 right-0.5 size-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <p className={`text-sm font-semibold truncate transition-colors ${
                                            selectedContact === contact.id ? 'text-primary' : 'text-slate-900 dark:text-slate-100'
                                        }`}>
                                            {contact.name}
                                        </p>
                                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium whitespace-nowrap ml-2">
                                            {contact.lastSeen}
                                        </p>
                                    </div>
                                    <p className={`text-xs truncate leading-snug transition-colors ${
                                        selectedContact === contact.id ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {contact.lastMessage}
                                    </p>
                                    
                                    {contact.tags && contact.tags.length > 0 && (
                                        <div className="flex items-center gap-1.5 mt-2 overflow-x-hidden">
                                            {contact.tags.map((tag: any) => (
                                                <span
                                                    key={tag.label}
                                                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider shadow-sm border ${
                                                        tag.color === 'purple' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-800/50' :
                                                        tag.color === 'green' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/50' :
                                                        'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                                    }`}
                                                >
                                                    {tag.label}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    )
}

export default ConversationList