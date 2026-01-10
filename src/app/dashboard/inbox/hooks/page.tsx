"use client";

import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { IConversation } from "@/models/Conversation";

type ClientMessage = {
  body: string;
  sender: string;
  timestamp: string;
};

type ClientConversation = {
  _id?: string;
  phoneNumber: string;
  name?: string;
  messages: ClientMessage[];
  status: "bot" | "human";
  lastMessageAt?: string | Date;
  isSubscribedToNewsletter?: boolean;
};

export default function Dashboard() {
  const [conversations, setConversations] = useState<ClientConversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<ClientConversation | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ----------------------------------
     1. Fetch all leads
  -----------------------------------*/
  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => setConversations(data))
      .catch(console.error);
  }, []);

  /* ----------------------------------
     2. Real-time Pusher listener
    const handler = (data: { phoneNumber: string; body: string }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.phoneNumber === data.phoneNumber
            ? ({
              ...c,
              messages: [
                ...c.messages,
                {
                  body: data.body,
                  sender: "user",
                  timestamp: new Date().toISOString(),
                },
              ],
            } as ClientConversation)
            : c
        )
      );

      // Update active chat instantly
      setActiveConvo((prev) =>
        prev?.phoneNumber === data.phoneNumber
          ? ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                body: data.body,
                sender: "user",
                timestamp: new Date().toISOString(),
              },
            ],
          } as ClientConversation)
          : prev
      );
    };
      setActiveConvo((prev) =>
        prev?.phoneNumber === data.phoneNumber
          ? ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                body: data.body,
                sender: "user",
                timestamp: new Date().toISOString(),
              },
            ],
          } as IConversation)
          : prev
      );
    };

    channel.bind("incoming-message", handler);

    return () => {
      channel.unbind("incoming-message", handler);
      pusher.unsubscribe("chat-channel");
      pusher.disconnect();
    };
  }, []);

  /* ----------------------------------
     3. Auto-scroll on new messages
  -----------------------------------*/
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo?.messages]);

  /* ----------------------------------
     4. Toggle AI / Human handoff
  -----------------------------------*/
  const toggleHandoff = async () => {
    if (!activeConvo) return;

    const newStatus = activeConvo.status === "bot" ? "human" : "bot";

    const res = await fetch("/api/chat/handoff", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber: activeConvo.phoneNumber,
        newStatus,
      }),
    });

    if (res.ok) {
      setActiveConvo({ ...activeConvo, status: newStatus });
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-slate-700 p-4">
        <h2 className="text-xl font-bold mb-4">Leads</h2>

        {conversations.map((convo) => (
          <div
            key={convo.phoneNumber}
            onClick={() => setActiveConvo(convo)}
            className={`p-3 mb-2 rounded cursor-pointer ${activeConvo?.phoneNumber === convo.phoneNumber
              ? "bg-blue-600"
              : "bg-slate-800 hover:bg-slate-700"
              }`}
          >
            <p className="font-medium">{convo.phoneNumber}</p>
            <p className="text-xs text-slate-400 truncate">
              {convo.messages.at(-1)?.body}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConvo ? (
          <>
            <div className="p-4 border-b border-slate-700 flex justify-between">
              <div>
                <h3 className="font-bold">{activeConvo.phoneNumber}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${activeConvo.status === "bot"
                    ? "bg-green-900 text-green-300"
                    : "bg-orange-900 text-orange-300"
                    }`}
                >
                  {activeConvo.status === "bot"
                    ? "AI Responding"
                    : "Manual Control"}
                </span>
              </div>

              <button
                onClick={toggleHandoff}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm"
              >
                {activeConvo.status === "bot" ? "Take Over" : "Give to AI"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConvo.messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] p-3 rounded-lg ${m.sender === "user"
                    ? "bg-slate-800"
                    : "bg-blue-700 ml-auto"
                    }`}
                >
                  <p className="text-sm">{m.body}</p>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-slate-800">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a manual reply..."
                className="w-full bg-slate-900 border border-slate-700 rounded p-3"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a lead to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
