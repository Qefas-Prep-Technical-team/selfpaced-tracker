/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient } from "@tanstack/react-query";
import ToggleGroup from "./ui/ToggleGroup";
import { FC } from "react";

 const ChatHeader: FC<any> = ({ name, status, conversationId }) => {
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
        <div className="h-16 border-b ...">
            <h3>{name}</h3>
            <ToggleGroup
                value={status === 'bot' ? 'ai' : 'manual'}
                onChange={handleToggle}
                options={[
                    { value: 'ai', label: 'AI Bot', icon: 'smart_toy' },
                    { value: 'manual', label: 'Manual', icon: 'person' },
                ]}
            />
        </div>
    );
}
export default ChatHeader;