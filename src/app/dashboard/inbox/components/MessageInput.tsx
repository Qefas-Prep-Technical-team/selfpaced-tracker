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
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
            <div className="flex items-end gap-3 max-w-full relative">
                
                {/* 1. Grouped Action Buttons (Left) */}
                <div className="flex items-center gap-1 mb-1 shadow-sm bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 border border-slate-200 dark:border-slate-700">
                    <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-primary transition-all duration-200 hover:shadow-sm">
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                    </button>
                    <button className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-emerald-500 transition-all duration-200 hover:shadow-sm">
                        <span className="material-symbols-outlined text-xl">image</span>
                    </button>
                </div>

                {/* 2. Main Input Area (Center - Grows) */}
                <div className="relative flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all px-4 py-2 shadow-sm">
                    <TextareaAutosize
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message Qefas Assistant..."
                        className="w-full border-none bg-transparent py-1.5 text-sm focus:ring-0 resize-none dark:text-white dark:placeholder:text-slate-500 leading-relaxed"
                        minRows={1}
                        maxRows={8}
                    />
                    
                    {/* Enhanced AI Badge inside the input */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-800/50 mt-1">
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/30">
                                <span className="material-symbols-outlined text-[10px] text-indigo-500">auto_awesome</span>
                                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">AI Co-pilot</span>
                            </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium hidden md:inline">Shift + Enter for new line</span>
                    </div>
                </div>

                {/* 3. Send Button (Right) */}
                <button
                    onClick={handleSend}
                    className="mb-1 size-10 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:grayscale shrink-0 disabled:scale-100"
                    disabled={!message.trim()}
                >
                    <span className="material-symbols-outlined text-xl ml-0.5">send</span>
                </button>
            </div>
        </div>
    )
}

export default MessageInput