'use client'

import { FC, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

interface MessageInputProps {
    onSendMessage: (content: string) => void
}

const MessageInput: FC<MessageInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState('')

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message)
            setMessage('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark">
            <div className="flex items-end gap-2 max-w-full">
                
                {/* 1. Grouped Action Buttons (Left) */}
                <div className="flex items-center gap-0.5 mb-1.5 shrink-0">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                        <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                        <span className="material-symbols-outlined text-xl">image</span>
                    </button>
                </div>

                {/* 2. Main Input Area (Center - Grows) */}
                <div className="relative flex-1 flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-primary/50 transition-all px-3 py-1">
                    <TextareaAutosize
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="w-full border-none bg-transparent py-2 text-sm focus:ring-0 resize-none dark:text-white dark:placeholder:text-slate-500 leading-tight"
                        minRows={1}
                        maxRows={5}
                    />
                    
                    {/* Tiny AI Badge inside the input */}
                    <div className="absolute right-2 top-[-10px]">
                        <span className="text-[8px] font-black text-ai-purple uppercase tracking-tighter bg-purple-100 dark:bg-ai-purple/20 px-1.5 py-0.5 rounded-full border border-ai-purple/20">
                            AI Co-pilot
                        </span>
                    </div>
                </div>

                {/* 3. Send Button (Right) */}
                <button
                    onClick={handleSend}
                    className="mb-1 size-9 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center shadow-md shadow-primary/20 transition-all disabled:opacity-30 disabled:grayscale shrink-0"
                    disabled={!message.trim()}
                >
                    <span className="material-symbols-outlined text-xl">send</span>
                </button>
            </div>
        </div>
    )
}

export default MessageInput