import { create } from "zustand";
import { Conversation, Message } from "../types";

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversationId: (id: string | null) => void;
  updateConversation: (conversation: Conversation) => void;
  addMessageToConversation: (phoneNumber: string, message: Message) => void;
  updateConversationStatus: (
    phoneNumber: string,
    status: Conversation["status"]
  ) => void;

  // Getters
  getActiveConversation: () => Conversation | null;
  getConversationByPhoneNumber: (
    phoneNumber: string
  ) => Conversation | undefined;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,

  setConversations: (conversations) => set({ conversations }),

  setActiveConversationId: (id) => set({ activeConversationId: id }),

  updateConversation: (conversation) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c._id === conversation._id || c.phoneNumber === conversation.phoneNumber
          ? { ...c, ...conversation }
          : c
      ),
    })),

  addMessageToConversation: (phoneNumber, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.phoneNumber === phoneNumber
          ? {
              ...c,
              messages: [...c.messages, message],
              lastMessageAt: new Date().toISOString(),
            }
          : c
      ),
    })),

  updateConversationStatus: (phoneNumber, status) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.phoneNumber === phoneNumber ? { ...c, status } : c
      ),
    })),

  getActiveConversation: () => {
    const { conversations, activeConversationId } = get();
    if (!activeConversationId) return null;

    return (
      conversations.find(
        (c) =>
          c._id === activeConversationId ||
          c.phoneNumber === activeConversationId
      ) || null
    );
  },

  getConversationByPhoneNumber: (phoneNumber) => {
    const { conversations } = get();
    return conversations.find((c) => c.phoneNumber === phoneNumber);
  },
}));
