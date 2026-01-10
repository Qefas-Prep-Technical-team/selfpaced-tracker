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
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-2">
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <span className="material-symbols-outlined">mood</span>
                </button>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <span className="material-symbols-outlined">attach_file</span>
                </button>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <span className="material-symbols-outlined">image</span>
                </button>
                <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                <span className="text-[10px] font-bold text-ai-purple uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
                    AI Co-pilot Ready
                </span>
            </div>

            {/* Text Input */}
            <div className="relative">
                <TextareaAutosize
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message to Sarah..."
                    className="w-full border-none bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/30 resize-none dark:text-white dark:placeholder:text-slate-500"
                    minRows={1}
                    maxRows={4}
                />
                <button
                    onClick={handleSend}
                    className="absolute right-3 bottom-3 size-10 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!message.trim()}
                >
                    <span className="material-symbols-outlined">send</span>
                </button>
            </div>
        </div>
    )
}

export default MessageInput