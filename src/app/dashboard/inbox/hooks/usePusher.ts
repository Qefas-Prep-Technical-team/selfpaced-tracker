"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";
import { useChatStore } from "../components/stores/chat.store";
import { IncomingMessageData } from "../components/types";

export const usePusher = () => {
  const addMessageToConversation = useChatStore(
    (state) => state.addMessageToConversation
  );

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "mt1",
    });

    // Subscribe to channel
    const channel = pusher.subscribe("chat-channel");

    // Handle incoming messages
    const handler = (data: IncomingMessageData) => {
      console.log("Pusher message received:", data);

      addMessageToConversation(data.phoneNumber, {
        body: data.body,
        sender: data.sender,
        timestamp: data.timestamp,
      });
    };

    channel.bind("incoming-message", handler);

    // Cleanup
    return () => {
      channel.unbind("incoming-message", handler);
      pusher.unsubscribe("chat-channel");
      pusher.disconnect();
    };
  }, [addMessageToConversation]);
};
