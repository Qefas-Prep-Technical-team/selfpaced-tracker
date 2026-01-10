import { Conversation, HandoffPayload, SendMessagePayload } from "../types";

const API_BASE = "/api";

export const chatService = {
  // Fetch all conversations
  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE}/leads`);
    if (!response.ok) throw new Error("Failed to fetch conversations");
    return response.json();
  },

  // Toggle handoff
  async toggleHandoff(payload: HandoffPayload): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/chat/handoff`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to toggle handoff");
    return response.json();
  },

  // Send a message
  async sendMessage(
    payload: SendMessagePayload
  ): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/chat/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  },

  // Subscribe to newsletter
  async subscribeToNewsletter(
    phoneNumber: string
  ): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) throw new Error("Failed to subscribe");
    return response.json();
  },
};
