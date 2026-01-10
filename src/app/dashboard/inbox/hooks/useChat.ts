"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../components/services/chat.service";
import { useChatStore } from "../components/stores/chat.store";
import { Conversation } from "../components/types";

export const useConversations = () => {
  const setConversations = useChatStore((state) => state.setConversations);
  // 1. Define the fetcher function
};

export const useToggleHandoff = () => {
  const queryClient = useQueryClient();
  const updateConversationStatus = useChatStore(
    (state) => state.updateConversationStatus
  );

  return useMutation({
    mutationFn: chatService.toggleHandoff,
    onSuccess: (_, variables) => {
      // Update local store immediately
      updateConversationStatus(variables.phoneNumber, variables.newStatus);

      // Invalidate and refetch conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const addMessageToConversation = useChatStore(
    (state) => state.addMessageToConversation
  );

  return useMutation({
    mutationFn: chatService.sendMessage,
    onSuccess: (_, variables) => {
      // Optimistically add message to store
      const newMessage = {
        body: variables.body,
        sender: variables.sender,
        timestamp: new Date().toISOString(),
      };

      addMessageToConversation(variables.phoneNumber, newMessage);

      // Invalidate conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// 1. Define the fetcher function
const fetchLeads = async () => {
  const res = await fetch("/api/leads");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

export default function LeadsComponent() {
  // 2. Replace useEffect/useState with useQuery
  const {
    data: conversations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leads"], // Unique key for caching
    queryFn: fetchLeads,
  });
}
