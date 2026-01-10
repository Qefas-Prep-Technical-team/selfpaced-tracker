import { FC } from 'react'
import { format } from 'date-fns'

interface MessageBubbleProps {
    message: {
        sender: 'user' | 'ai' | 'system'
        content: string
        timestamp: Date
        avatar?: string
        isAIGenerated?: boolean
        priority?: 'high' | 'medium' | 'low'
    }
}

const MessageBubble: FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user'
    const isAI = message.sender === 'ai'
    const isSystem = message.sender === 'system'

    if (isSystem) {
        return (
            <div className="flex items-center justify-center my-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-primary/60 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 italic">
                    <span className="material-symbols-outlined text-sm">priority_high</span>
                    {message.content}
                </div>
            </div>
        )
    }

    return (
        <div
            className={`flex items-end gap-3 max-w-[80%] ${isUser ? '' : 'self-end flex-row-reverse'
                }`}
        >
            {/* Avatar */}
            {isUser ? (
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8 shrink-0"
                    style={{ backgroundImage: `url(${message.avatar})` }}
                />
            ) : (
                <div className="flex items-center justify-center h-8 w-8 shrink-0 rounded-full bg-ai-purple text-white shadow-lg">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                </div>
            )}

            {/* Message Content */}
            <div className={`flex flex-col gap-1 ${isUser ? 'items-start' : 'items-end'}`}>
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                            ? 'bg-slate-100 dark:bg-slate-800 text-[#0d141b] dark:text-white rounded-bl-none'
                            : 'ai-message-glow bg-purple-50 dark:bg-ai-purple/10 text-ai-purple border border-ai-purple/20 rounded-br-none'
                        }`}
                >
                    {isAI && (
                        <p className="font-semibold mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">auto_awesome</span>
                            Lumina AI
                        </p>
                    )}
                    {message.content}
                </div>

                {/* Timestamp */}
                <span className={`text-[10px] text-slate-400 font-medium ${isUser ? 'ml-1' : 'mr-1'}`}>
                    {format(message.timestamp, 'h:mm a')}
                    {message.isAIGenerated && ' · AI Generated'}
                </span>
            </div>
        </div>
    )
}

export default MessageBubble