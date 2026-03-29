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
    const isSystem = message.sender === 'system'

    if (isSystem) {
        return (
            <div className="flex items-center justify-center my-6">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-sm">info</span>
                    {message.content}
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-end gap-3 max-w-[85%] ${isUser ? '' : 'self-end flex-row-reverse group'}`}>
            {/* Avatar Logic */}
            <div className="shrink-0 mb-1">
                {isUser ? (
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8 ring-2 ring-white dark:ring-slate-900 shadow-sm"
                        style={{ backgroundImage: message.avatar ? `url(${message.avatar})` : undefined }}
                    />
                ) : (
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full text-white shadow-md transition-transform group-hover:scale-110 ${isAI ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
                        <span className="material-symbols-outlined text-[18px]">
                            {isAI ? 'smart_toy' : 'person'}
                        </span>
                    </div>
                )}
            </div>

            <div className={`flex flex-col gap-1.5 ${isUser ? 'items-start' : 'items-end'}`}>
                <div
                    className={`relative px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-200 ${
                        isUser
                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700'
                            : isAI 
                                ? 'bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/30 dark:to-purple-950/30 text-indigo-900 dark:text-indigo-100 border border-indigo-100/50 dark:border-indigo-800/30 rounded-br-none backdrop-blur-md ai-message-premium-glow'
                                : 'bg-slate-900 dark:bg-slate-700 text-white dark:text-slate-100 rounded-br-none shadow-indigo-200/20'
                    }`}
                >
                    {/* Header Name for Bot or Human */}
                    {!isUser && (
                        <div className={`flex items-center gap-1.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider ${isAI ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300'}`}>
                            <span className="material-symbols-outlined text-xs">
                                {isAI ? 'auto_awesome' : 'shield_person'}
                            </span>
                            {isAI ? 'Qefas Assistant' : 'Support Specialist'}
                        </div>
                    )}
                    <span className="block whitespace-pre-wrap">{message.content}</span>
                </div>

                <div className={`flex items-center gap-2 text-[10px] text-slate-400 font-medium ${isUser ? 'ml-1' : 'mr-1 flex-row-reverse'}`}>
                    <span>{format(message.timestamp, 'h:mm a')}</span>
                    {isAI && (
                        <>
                            <span className="size-1 bg-slate-300 rounded-full" />
                            <span className="text-indigo-500/80 dark:text-indigo-400/80">AI Enhanced</span>
                        </>
                    )}
                </div>
            </div>

            <style jsx>{`
                .ai-message-premium-glow {
                    box-shadow: 0 4px 15px -1px rgba(99, 102, 241, 0.1), 0 2px 6px -1px rgba(99, 102, 241, 0.06);
                }
                :global(.dark) .ai-message-premium-glow {
                    box-shadow: 0 4px 20px -2px rgba(139, 92, 246, 0.15);
                }
            `}</style>
        </div>
    )
}

export default MessageBubble