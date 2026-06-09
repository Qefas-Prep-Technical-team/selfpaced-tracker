/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FC, useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { pusherClient } from '@/lib/pusher'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface ChatWindowProps { 
    contactId: string;
    onBack?: () => void;
    onShowDetails?: () => void;
}

const ChatWindow: FC<ChatWindowProps> = ({ contactId, onBack, onShowDetails }) => {
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Local states for editing lead details
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const { data: conversation, isLoading } = useQuery({
        queryKey: ['conversation', contactId],
        queryFn: async () => {
            const res = await fetch(`/api/conversations/${contactId}`);
            const data = await res.json();
            return data;
        },
        enabled: !!contactId,
    });

    // Synchronize edit fields when conversation data changes/loads
    useEffect(() => {
        if (conversation) {
            setEditName(conversation.name || 'New Lead');
            setEditEmail(conversation.email || '');
        }
    }, [conversation]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (conversation?.messages) {
            scrollToBottom();
        }
    }, [conversation?.messages]);

    // Pusher Real-time Listener
    useEffect(() => {
        if (!contactId) return;

        // 1. Subscribe to the specific channel
        const channel = pusherClient.subscribe(`chat-${contactId}`);
        
        // 2. Bind to the 'new-message' event
        channel.bind('new-message', (data: any) => {
            console.log("New message received via Pusher:", data); // Debugging log

            queryClient.setQueryData(['conversation', contactId], (oldData: any) => {
                if (!oldData) return oldData;
                
                // Return a new object with the new message appended
                return {
                    ...oldData,
                    messages: [
                        ...(oldData.messages || []),
                        {
                            body: data.body,
                            sender: data.sender,
                            timestamp: data.timestamp || new Date(),
                        }
                    ]
                };
            });
        });

        return () => {
            pusherClient.unsubscribe(`chat-${contactId}`);
            channel.unbind_all();
        };
    }, [contactId, queryClient]);

    const handleSendMessage = async (content: string) => {
        await fetch('/api/messages/send', {
            method: 'POST',
            body: JSON.stringify({
                conversationId: contactId,
                body: content,
                sender: 'human' 
            })
        });
    };

    const handleSaveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Update cache optimistically
        queryClient.setQueryData(['conversation', contactId], (old: any) => ({
            ...old,
            name: editName,
            email: editEmail
        }));
        queryClient.invalidateQueries({ queryKey: ['leads'] });

        setIsEditing(false);

        try {
            await fetch(`/api/conversations/${contactId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editName, email: editEmail })
            });
        } catch (err) {
            console.error("Failed to save changes", err);
        }
    };

    if (isLoading) return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-background/50 gap-4">
            <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">Loading conversation...</p>
        </div>
    );

    return (
        <section className="flex-1 flex flex-col min-h-0 h-full overflow-hidden bg-slate-50/30 dark:bg-background/30 relative">
            {/* Subtle background pattern for premium feel */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <ChatHeader 
                name={conversation?.name || "Support Chat"} 
                status={conversation?.status} 
                avatar={conversation?.avatar}
                conversationId={contactId} 
                onEditClick={() => setIsEditing(true)}
                onBack={onBack}
                onShowDetails={onShowDetails}
            />

            {/* The scrollable area */}
            <div 
                ref={scrollRef} 
                className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 custom-scrollbar relative z-0"
            >
                {conversation?.messages?.map((msg: any, idx: number) => (
                    <MessageBubble 
                        key={idx} 
                        message={{
                            id: idx.toString(),
                            sender: msg.sender === 'user' ? 'user' : (msg.sender === 'bot' ? 'ai' : 'human'),
                            content: msg.body,
                            timestamp: new Date(msg.timestamp),
                            avatar: msg.sender === 'user' 
                                ? (conversation?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation?.name || 'User')}&background=random`) 
                                : undefined
                        }} 
                    />
                ))}
                
                {/* Visual spacer at the bottom */}
                <div className="h-4 shrink-0" />
            </div>

            {/* Input sits firmly at the bottom of the section */}
            <div className="relative z-10">
                <MessageInput onSendMessage={handleSendMessage} />
            </div>

            {/* Premium Centered Edit details modal outside of header containment context */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsEditing(false)}
                    />
                    
                    {/* Modal Box */}
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl transition-all scale-100 animate-in zoom-in-95 duration-200 text-left">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">edit</span>
                                Edit Lead Details
                            </h3>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="size-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveDetails} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                    Display Name
                                </label>
                                <input 
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="e.g. Sarah Jenkins"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <input 
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="e.g. sarah@company.com"
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-lg shadow-primary/20 transition-all active:scale-98 cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ChatWindow