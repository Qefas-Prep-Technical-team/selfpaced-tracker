'use client'

import { FC, useState } from 'react'
import ToggleGroup from './ui/ToggleGroup'

interface ChatHeaderProps {
    contactId: string
}

const ChatHeader: FC<ChatHeaderProps> = ({ contactId }) => {
    const [mode, setMode] = useState<'ai' | 'manual'>('ai')

    return (
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
                <div className="flex flex-col">
                    <h3 className="text-[#0d141b] dark:text-white font-bold text-base leading-tight">
                        Sarah Jenkins
                    </h3>
                    <div className="flex items-center gap-1.5">
                        <div className="size-2 bg-green-500 rounded-full" />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
                            Active Now
                        </span>
                    </div>
                </div>
            </div>

            {/* AI/Manual Toggle */}
            <ToggleGroup
                options={[
                    { value: 'ai', label: 'AI Bot', icon: 'smart_toy' },
                    { value: 'manual', label: 'Manual', icon: 'person' },
                ]}
                value={mode}
                onChange={()=>{}}
            />

            <div className="flex items-center gap-3">
                <button className="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">call</span>
                </button>
                <button className="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>
        </div>
    )
}

export default ChatHeader