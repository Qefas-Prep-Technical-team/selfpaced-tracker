/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { FC, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { pusherClient } from '@/lib/pusher'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface ChatWindowProps { contactId: string }

const ChatWindow: FC<ChatWindowProps> = ({ contactId }) => {
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);

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

    if (isLoading) return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-background-dark/50 gap-4">
            <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">Loading conversation...</p>
        </div>
    );

    return (
        <section className="flex-1 flex flex-col min-h-0 h-full overflow-hidden bg-slate-50/30 dark:bg-background-dark/30 relative">
            {/* Subtle background pattern for premium feel */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

            <ChatHeader 
                name={conversation?.name || "Support Chat"} 
                status={conversation?.status} 
                avatar={conversation?.avatar}
                conversationId={contactId} 
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
                            avatar: msg.sender === 'user' ? undefined : (msg.sender === 'bot' ? undefined : conversation?.avatar)
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
        </section>
    )
}

export default ChatWindow