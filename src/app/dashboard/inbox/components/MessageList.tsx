'use client';

import { Message } from './types';
import { RefObject } from 'react';

interface MessageListProps {
    messages: Message[];
    scrollRef: RefObject<HTMLDivElement>;
}

export default function MessageList({ messages, scrollRef }: MessageListProps) {
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
                <div
                    key={message._id || index}
                    className={`flex flex-col max-w-[70%] ${message.sender === 'user' ? 'self-start' : 'self-end'
                        }`}
                >
                    <div
                        className={`p-3 rounded-lg ${message.sender === 'user'
                                ? 'bg-slate-800'
                                : message.sender === 'bot'
                                    ? 'bg-blue-700'
                                    : 'bg-green-700'
                            }`}
                    >
                        <p className="text-sm">{message.body}</p>
                    </div>

                    <div
                        className={`text-xs text-slate-400 mt-1 ${message.sender === 'user' ? 'self-start' : 'self-end'
                            }`}
                    >
                        {formatTime(message.timestamp)}
                        {message.sender === 'bot' && ' · AI'}
                        {message.sender === 'human' && ' · You'}
                    </div>
                </div>
            ))}
            <div ref={scrollRef} />
        </div>
    );
}