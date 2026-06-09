'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'
import ContactPanel from './ContactPanel'

export default function ChatLayout() {
    const [selectedContact, setSelectedContact] = useState<string | null>(null)
    const [activeView, setActiveView] = useState<'list' | 'chat' | 'details'>('list')

    // Fetch conversations list for default selection and responsive layout sync
    const { data: conversations } = useQuery<any[]>({
        queryKey: ["leads"],
        queryFn: async () => {
            const res = await fetch('/api/conversations')
            if (!res.ok) throw new Error('Failed to fetch conversations')
            return res.json()
        }
    })

    // Automatically select the first conversation once loaded
    useEffect(() => {
        if (!selectedContact && conversations && conversations.length > 0) {
            setSelectedContact(conversations[0].id)
        }
    }, [conversations, selectedContact])

    const handleSelectContact = (id: string) => {
        setSelectedContact(id)
        setActiveView('chat')
    }

    return (
        <main className="flex flex-1 overflow-hidden relative bg-slate-50/50 dark:bg-background">
            {/* Conversation List */}
            <div className={`
                absolute inset-0 z-10 bg-background transition-transform duration-300 md:relative md:translate-x-0 md:flex md:z-auto md:w-85
                ${activeView === 'list' ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <ConversationList
                    selectedContact={selectedContact || ''}
                    onSelectContact={handleSelectContact}
                />
            </div>

            {/* Chat Window */}
            <div className={`
                absolute inset-0 z-20 bg-background transition-transform duration-300 md:relative md:translate-x-0 md:flex md:z-auto md:flex-1
                ${activeView === 'chat' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}>
                {selectedContact ? (
                    <ChatWindow 
                        contactId={selectedContact} 
                        onBack={() => setActiveView('list')}
                        onShowDetails={() => setActiveView('details')}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/30 text-slate-400 gap-2">
                        <span className="material-symbols-outlined text-4xl animate-bounce">forum</span>
                        <p className="text-sm font-semibold">Select a lead to start chatting</p>
                    </div>
                )}
            </div>

            {/* Contact Info Panel */}
            <div className={`
                absolute inset-0 z-30 bg-background transition-transform duration-300 md:relative md:translate-x-0 md:flex md:z-auto md:w-80
                ${activeView === 'details' ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:hidden lg:flex'}
            `}>
                {selectedContact ? (
                    <ContactPanel 
                        contactId={selectedContact}
                        onBack={() => setActiveView('chat')}
                    />
                ) : (
                    <div className="w-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-background flex flex-col items-center justify-center p-6 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
                        <p className="text-sm font-medium">No details available</p>
                    </div>
                )}
            </div>
        </main>
    )
}