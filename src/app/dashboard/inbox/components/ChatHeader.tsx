/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from "@tanstack/react-query";
import ToggleGroup from "./ui/ToggleGroup";
import { FC } from "react";

interface ChatHeaderProps {
    name: string;
    status: string;
    avatar: string;
    conversationId: string;
    onBack?: () => void;
    onShowDetails?: () => void;
}

const ChatHeader: FC<ChatHeaderProps> = ({ name, status, avatar, conversationId, onBack, onShowDetails }) => {
    const queryClient = useQueryClient();

    const handleToggle = async (newMode: string) => {
        // Optimistic UI update
        queryClient.setQueryData(['conversation', conversationId], (old: any) => ({
            ...old,
            status: newMode === 'ai' ? 'bot' : 'human'
        }));

        await fetch(`/api/conversations/${conversationId}/toggle`, {
            method: 'POST',
            body: JSON.stringify({ status: newMode === 'ai' ? 'bot' : 'human' })
        });
    };

    return (
        <div className="h-16 md:h-20 px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10 w-full">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                {/* Mobile Back Button */}
                <button 
                    onClick={onBack}
                    className="md:hidden size-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 active:scale-90 transition-transform shrink-0"
                    aria-label="Back to conversations"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>

                <div className="relative shrink-0 hidden sm:block">
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
                        <img 
                            src={avatar || "https://ui-avatars.com/api/?name=" + name} 
                            className="h-full w-full object-cover" 
                            alt={name} 
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                </div>
                
                <div className="flex flex-col min-w-0">
                    <h3 className="text-slate-900 dark:text-white font-bold tracking-tight text-sm md:text-base truncate">{name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1 shrink-0">
                            <span className="size-1.5 bg-emerald-500 rounded-full" />
                            <span className="hidden xs:inline">Online</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 hidden xs:inline shrink-0">•</span>
                        <span className="truncate hidden sm:inline">#{conversationId?.slice(-6).toUpperCase() || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden sm:block">
                    <ToggleGroup
                        value={status === 'bot' ? 'ai' : 'manual'}
                        onChange={handleToggle}
                        options={[
                            { value: 'ai', label: 'AI Bot', icon: 'smart_toy' },
                            { value: 'manual', label: 'Manual', icon: 'person' },
                        ]}
                    />
                </div>
                
                {/* Mobile Details Toggle */}
                <button 
                    onClick={onShowDetails}
                    className="md:hidden size-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 active:scale-95 transition-all shrink-0"
                    aria-label="Toggle contact info"
                >
                    <span className="material-symbols-outlined text-xl">info</span>
                </button>

                <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-slate-800" />
                
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors hidden md:block">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>
        </div>
    );
}
export default ChatHeader;