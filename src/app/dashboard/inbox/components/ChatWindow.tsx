'use client'

import { FC, useState } from 'react'

import { format } from 'date-fns'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface Message {
    id: string
    sender: 'user' | 'ai' | 'system'
    content: string
    timestamp: Date
    avatar?: string
    isAIGenerated?: boolean
    priority?: 'high' | 'medium' | 'low'
}

interface ChatWindowProps {
    contactId: string
}

const ChatWindow: FC<ChatWindowProps> = ({ contactId }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'user',
            content: 'Hi! I was looking at the pricing page. It\'s a bit confusing for our team of 50. Is there a custom enterprise plan?',
            timestamp: new Date('2024-01-15T10:42:00'),
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDW9nKHEix5Cd_sdkelaSVmTLOBmjjwg5TinXFj3OqS-yGn88Lv2sZSe2UZrPLKkdGE_IlBoF53xxEF0OOQR2iteFyfb2DNdgr6L04-WaUlNPoLer1LRRRnrjdIOlqYyIZx18eQ4Tu4KjArWOt_2imzXpFbq1Cj2dT9c9zjNeIP9T0i-p8z3WjE9S9DVJzcgEjSQKErwBFJuHXCibMP0A0OdLO57K2Cen8BJpSUuYis23E5BVaG0OG_e2bSlqDz-vOh6SndvmvG6c',
        },
        {
            id: '2',
            sender: 'ai',
            content: 'Hello Sarah! Great question. For teams over 25, we do offer customized Enterprise solutions including SSO, advanced security, and dedicated support. Would you like me to show you our feature comparison for large teams?',
            timestamp: new Date('2024-01-15T10:43:00'),
            isAIGenerated: true,
        },
        {
            id: '3',
            sender: 'user',
            content: 'Yes, that would be helpful. I\'m also worried about the data migration process from our current CRM.',
            timestamp: new Date('2024-01-15T10:44:00'),
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTpcOuzWgmF2DQjo4hjncgeD2b5_bQ8VGfiSQl6I_929UsiFFjYWFS-qTq4fKcv3uoaooKjhEmS4-m2PL4_HN-FF5QRGVAbcX8cZZMB1JjPaDS0no7n8vR3dxMnlEHfCwcb4wze3KogJg9Gof0hp0960zNVA3YujA-nw0aL_KYwSCShnERZ9UaVhqIVafE4OMv39zAhaEcvMIFdbW7uAUBpC5TYV6sn-n_b0E8snNi8cG5Bg_PwtbsOmXcLpdMeDPY6DvYhBnWeuI',
        },
        {
            id: '4',
            sender: 'system',
            content: 'AI detected migration concern - High human intervention priority',
            timestamp: new Date('2024-01-15T10:45:00'),
            priority: 'high',
        },
        {
            id: '5',
            sender: 'ai',
            content: 'I understand! Migration is a top priority for our enterprise customers. We have a dedicated migration tool and a team to assist. One moment while I prepare the technical documentation for you...',
            timestamp: new Date('2024-01-15T10:45:30'),
            isAIGenerated: true,
        },
    ])

    const handleSendMessage = (content: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            content,
            timestamp: new Date(),
            avatar: 'https://lh3.googleusercontent.com/a/placeholder',
        }
        setMessages([...messages, newMessage])
    }

    return (
        <section className="flex-1 flex flex-col bg-white dark:bg-background-dark relative">
            <ChatHeader contactId={contactId} />

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                {/* Date Separator */}
                <div className="flex items-center justify-center my-2">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {format(new Date(), 'MMMM d, yyyy')}
                    </span>
                </div>

                {/* Messages */}
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
            </div>

            {/* Message Input */}
            <MessageInput onSendMessage={handleSendMessage} />
        </section>
    )
}

export default ChatWindow