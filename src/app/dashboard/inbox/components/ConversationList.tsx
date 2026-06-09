/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FC, useEffect, useState } from 'react'
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
    onSelectContact 
}) => {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    
    // New Chat Modal States
    const [isNewChatOpen, setIsNewChatOpen] = useState(false)
    const [newPhone, setNewPhone] = useState('')
    const [newName, setNewName] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { data: conversations, isLoading } = useQuery({
        queryKey: ["leads"],
        queryFn: fetchLeads,
    })

    // Real-time updates via Pusher
    useEffect(() => {
        const channel = pusherClient.subscribe('chat-updates')
        
        // Listen for new messages to re-sort or update the list and play the WhatsApp sound
        channel.bind('new-message', (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["leads"] })
            
            // Only play notification sound for incoming user/bot messages, not our own sends
            if (data?.sender !== 'human') {
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2357/2357-84.wav');
                    audio.volume = 0.5;
                    audio.play().catch(e => console.log('Audio autoplay blocked by browser:', e));
                } catch (err) {
                    console.error('Failed to play notification audio:', err);
                }
            }
        })

        return () => { pusherClient.unsubscribe('chat-updates') }
    }, [queryClient])

    // Filter conversations based on query
    const filteredConversations = conversations?.filter((contact: any) => {
        const query = searchQuery.toLowerCase()
        return (
            contact.name?.toLowerCase().includes(query) ||
            contact.email?.toLowerCase().includes(query) ||
            contact.lastMessage?.toLowerCase().includes(query)
        )
    })

    const handleCreateChat = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newPhone) return

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: newPhone,
                    name: newName || 'New Lead',
                    email: newEmail || ''
                })
            })
            if (!res.ok) throw new Error('Failed to create chat')
            const data = await res.json()
            
            // Invalidate leads query
            queryClient.invalidateQueries({ queryKey: ["leads"] })
            
            // Switch to the newly created chat
            onSelectContact(data.id)
            
            // Reset states and close modal
            setNewPhone('')
            setNewName('')
            setNewEmail('')
            setIsNewChatOpen(false)
        } catch (error) {
            console.error("Error creating chat:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <aside className="w-full md:w-85 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background flex flex-col shrink-0 overflow-hidden">
            <div className="p-6 flex flex-col gap-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                    <h1 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Messages</h1>
                    <button 
                        onClick={() => setIsNewChatOpen(true)}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
                        aria-label="Start New Chat"
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                </div>
                <SearchBar 
                    placeholder="Search conversations..." 
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
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
                        {filteredConversations && filteredConversations.length > 0 ? (
                            filteredConversations.map((contact: any) => (
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
                                                src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name || 'User')}`} 
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
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center min-h-[200px]">
                                <span className="material-symbols-outlined text-4xl mb-2 text-slate-300 dark:text-slate-700">search_off</span>
                                <p className="text-xs font-semibold">No conversations found</p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">Try searching another query</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Start New Chat Modal */}
            {isNewChatOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsNewChatOpen(false)}
                    />
                    
                    {/* Modal Box */}
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl transition-all scale-100 animate-in zoom-in-95 duration-200 text-left">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">chat</span>
                                Start New Chat
                            </h3>
                            <button 
                                onClick={() => setIsNewChatOpen(false)}
                                className="size-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleCreateChat} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                                    Phone Number (WhatsApp)*
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    placeholder="e.g. 2348030000000"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="e.g. john@example.com"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:border-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsNewChatOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newPhone}
                                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/95 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer"
                                >
                                    {isSubmitting ? 'Starting...' : 'Start Chat'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </aside>
    )
}

export default ConversationList