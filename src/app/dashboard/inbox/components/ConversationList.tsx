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

const ConversationList: FC<ConversationListProps> = ({
    selectedContact,
    onSelectContact,
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
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col shrink-0">
            <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-[#0d141b] dark:text-white text-lg font-bold">Conversations</h1>
                    <button className="text-primary flex items-center gap-1 text-sm font-semibold hover:opacity-80">
                        <span className="material-symbols-outlined text-lg">add_circle</span> New
                    </button>
                </div>
                <SearchBar placeholder="Search chats..." />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-16 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : (
                    conversations?.map((contact: any) => (
                        <div
                            key={contact.id}
                            onClick={() => onSelectContact(contact.id)}
                            className={`flex items-center gap-3 px-4 min-h-[72px] py-3 cursor-pointer transition-colors ${
                                selectedContact === contact.id
                                ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary'
                                : 'border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <div className="relative">
                                <img 
                                    src={contact.avatar} 
                                    className="rounded-full h-12 w-12 object-cover" 
                                    alt={contact.name} 
                                />
                                {contact.status === 'online' && (
                                    <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark" />
                                )}
                            </div>

                            <div className="flex flex-col flex-1 overflow-hidden">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-[#0d141b] dark:text-white text-sm font-semibold truncate">
                                        {contact.name}
                                    </p>
                                    <p className="text-[#4c739a] text-[10px] font-medium">
                                        {contact.lastSeen}
                                    </p>
                                </div>
                                <p className="text-[#4c739a] dark:text-slate-400 text-xs truncate leading-snug">
                                    {contact.lastMessage}
                                </p>
                                <div className="flex gap-1.5 mt-1.5">
                                    {contact.tags?.map((tag: any) => (
                                        <span
                                            key={tag.label}
                                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                                tag.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                                                tag.color === 'green' ? 'bg-green-100 text-green-600' :
                                                'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}
                                        >
                                            {tag.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </aside>
    )
}

export default ConversationList