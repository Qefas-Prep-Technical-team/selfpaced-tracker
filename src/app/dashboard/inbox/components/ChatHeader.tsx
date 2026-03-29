/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from "@tanstack/react-query";
import ToggleGroup from "./ui/ToggleGroup";
import { FC } from "react";

 const ChatHeader: FC<any> = ({ name, status, avatar, conversationId }) => {
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
        <div className="h-20 px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
                        <img 
                            src={avatar || "https://ui-avatars.com/api/?name=" + name} 
                            className="h-full w-full object-cover" 
                            alt={name} 
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                </div>
                
                <div className="flex flex-col">
                    <h3 className="text-slate-900 dark:text-white font-bold tracking-tight">{name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                            <span className="size-1.5 bg-emerald-500 rounded-full" />
                            Active now
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span>Customer ID: #{conversationId?.slice(-6).toUpperCase() || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ToggleGroup
                    value={status === 'bot' ? 'ai' : 'manual'}
                    onChange={handleToggle}
                    options={[
                        { value: 'ai', label: 'AI Bot', icon: 'smart_toy' },
                        { value: 'manual', label: 'Manual', icon: 'person' },
                    ]}
                />
                
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>
            </div>
        </div>
    );
}
export default ChatHeader;