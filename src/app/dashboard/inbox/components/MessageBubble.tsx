import { FC } from 'react'
import { format } from 'date-fns'

interface MessageBubbleProps {
    message: {
        id:string
        sender: 'user' | 'ai' | 'human' | 'system' // Added human
        content: string
        timestamp: Date
        avatar?: string
        isAIGenerated?: boolean
    }
}

const MessageBubble: FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.sender === 'user'
    const isAI = message.sender === 'ai'
    const isHuman = message.sender === 'human'
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
        <div className={`flex items-end gap-3 max-w-[80%] ${isUser ? '' : 'self-end flex-row-reverse'}`}>
            {/* Avatar Logic */}
            {isUser ? (
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8 shrink-0 bg-slate-200"
                    style={{ backgroundImage: message.avatar ? `url(${message.avatar})` : undefined }}
                />
            ) : (
                <div className={`flex items-center justify-center h-8 w-8 shrink-0 rounded-full text-white shadow-lg ${isAI ? 'bg-ai-purple' : 'bg-primary'}`}>
                    <span className="material-symbols-outlined text-sm">
                        {isAI ? 'smart_toy' : 'support_agent'}
                    </span>
                </div>
            )}

            <div className={`flex flex-col gap-1 ${isUser ? 'items-start' : 'items-end'}`}>
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isUser
                            ? 'bg-slate-100 dark:bg-slate-800 text-[#0d141b] dark:text-white rounded-bl-none'
                            : isAI 
                                ? 'ai-message-glow bg-purple-50 dark:bg-ai-purple/10 text-ai-purple border border-ai-purple/20 rounded-br-none'
                                : 'bg-primary/10 text-primary border border-primary/20 rounded-br-none'
                    }`}
                >
                    {/* Header Name for Bot or Human */}
                    {!isUser && (
                        <p className="font-semibold mb-1 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">
                                {isAI ? 'auto_awesome' : 'person'}
                            </span>
                            {isAI ? 'Qefas AI' : 'Customer Care'}
                        </p>
                    )}
                    {message.content}
                </div>

                <span className={`text-[10px] text-slate-400 font-medium ${isUser ? 'ml-1' : 'mr-1'}`}>
                    {format(message.timestamp, 'h:mm a')}
                    {isAI && ' · AI Generated'}
                </span>
            </div>
        </div>
    )
}

export default MessageBubble