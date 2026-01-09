"use client";
import { useEffect, useState, useRef } from 'react';
import Pusher from 'pusher-js';
import { IConversation, IMessage } from '@/models/Conversation';

export default function Dashboard() {
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<IConversation | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Fetch all leads from MongoDB
  useEffect(() => {
    fetch('/api/leads').then(res => res.json()).then(data => setConversations(data));
  }, []);

  // 2. Real-time: Listen for Pusher "pings"
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('chat-channel');
    
    channel.bind('incoming-message', (data: { phoneNumber: string; body: string }) => {
      // Update the contact list and current chat window instantly
      setConversations(prev => prev.map(c => 
        c.phoneNumber === data.phoneNumber 
          ? { ...c, messages: [...c.messages, { body: data.body, sender: 'user', timestamp: new Date() }] }
          : c
      ));
    });

    return () => pusher.unsubscribe('chat-channel');
  }, []);

  // 3. Toggle Handoff Logic
  const toggleHandoff = async () => {
    if (!activeConvo) return;
    const newStatus = activeConvo.status === 'bot' ? 'human' : 'bot';
    
    const res = await fetch('/api/chat/handoff', {
      method: 'PATCH',
      body: JSON.stringify({ phoneNumber: activeConvo.phoneNumber, newStatus }),
    });
    
    if (res.ok) {
      setActiveConvo({ ...activeConvo, status: newStatus });
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      {/* Sidebar: Contact List */}
      <div className="w-1/4 border-r border-slate-700 p-4">
        <h2 className="text-xl font-bold mb-4">Leads</h2>
        {conversations.map(convo => (
          <div 
            key={convo.phoneNumber}
            onClick={() => setActiveConvo(convo)}
            className={`p-3 mb-2 rounded cursor-pointer ${activeConvo?.phoneNumber === convo.phoneNumber ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}`}
          >
            <p className="font-medium">{convo.phoneNumber}</p>
            <p className="text-xs text-slate-400 truncate">{convo.messages[convo.messages.length - 1]?.body}</p>
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConvo ? (
          <>
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{activeConvo.phoneNumber}</h3>
                <span className={`text-xs px-2 py-1 rounded ${activeConvo.status === 'bot' ? 'bg-green-900 text-green-300' : 'bg-orange-900 text-orange-300'}`}>
                  {activeConvo.status === 'bot' ? 'AI Responding' : 'Manual Control'}
                </span>
              </div>
              <button 
                onClick={toggleHandoff}
                className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm transition"
              >
                {activeConvo.status === 'bot' ? 'Take Over' : 'Give to AI'}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConvo.messages.map((m, i) => (
                <div key={i} className={`max-w-[70%] p-3 rounded-lg ${m.sender === 'user' ? 'bg-slate-800' : 'bg-blue-700 ml-auto'}`}>
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
                className="w-full bg-slate-900 border border-slate-700 rounded p-3 focus:outline-none focus:border-blue-500"
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