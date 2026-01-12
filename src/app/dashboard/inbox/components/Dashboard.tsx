// 'use client';

// import { useEffect, useRef } from 'react';
// import { useChatStore } from './stores/chat.store';
// import ConversationList from './ConversationList';
// import ChatHeader from './ChatHeader';
// import MessageInput from './MessageInput';
// import { ConversationStatus } from './types';
// import { useConversations, useSendMessage, useToggleHandoff } from '../hooks/useChat';
// import { usePusher } from '../hooks/usePusher';
// import MessageList from './MessageList';

// export default function Dashboard() {
//     const {
//         conversations,
//         activeConversationId,
//         setActiveConversationId,
//         getActiveConversation,
//     } = useChatStore();

//     const activeConvo = getActiveConversation();
//     const scrollRef = useRef<HTMLDivElement>(null);

//     // React Query hooks - handle potential undefined properties
//     const conversationQuery = useConversations();
//     const isLoading = conversationQuery?.isLoading || conversationQuery?.isPending || false;
//     const error = conversationQuery?.error || null;
    
//     const toggleHandoffMutation = useToggleHandoff();
//     const sendMessageMutation = useSendMessage();

//     // Pusher for real-time updates
//     usePusher();

//     // Auto-scroll to latest message
//     useEffect(() => {
//         scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, [activeConvo?.messages]);

//     // Handle handoff toggle
//     const handleToggleHandoff = async () => {
//         if (!activeConvo) return;

//         await toggleHandoffMutation.mutateAsync({
//             phoneNumber: activeConvo.phoneNumber,
//             newStatus: activeConvo.status === 'bot' ? 'human' : 'bot' as ConversationStatus,
//         });
//     };

//     // Handle sending message
//     const handleSendMessage = async (body: string) => {
//         if (!activeConvo || !body.trim()) return;

//         await sendMessageMutation.mutateAsync({
//             phoneNumber: activeConvo.phoneNumber,
//             body,
//             sender: 'human', // Assuming manual messages are from human agent
//         });
//     };

//     if (isLoading) {
//         return (
//             <div className="flex h-screen bg-slate-900 items-center justify-center">
//                 <div className="text-white">Loading conversations...</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex h-screen bg-slate-900 items-center justify-center">
//                 <div className="text-red-500">Error loading conversations</div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex h-screen bg-slate-900 text-white">
//             {/* Sidebar */}
//             <ConversationList
//                 conversations={conversations}
//                 activeConversationId={activeConversationId}
//                 onSelectConversation={setActiveConversationId}
//             />

//             {/* Chat Area */}
//             <div className="flex-1 flex flex-col">
//                 {activeConvo ? (
//                     <>
//                         <ChatHeader
//                             conversation={activeConvo}
//                             onToggleHandoff={handleToggleHandoff}
//                         />

//                         <MessageList
//                             messages={activeConvo.messages}
//                             scrollRef={scrollRef}
//                         />

//                         <MessageInput
//                             onSendMessage={handleSendMessage}
//                             isLoading={sendMessageMutation.isPending}
//                         />
//                     </>
//                 ) : (
//                     <div className="flex-1 flex items-center justify-center text-slate-500">
//                         Select a lead to start chatting
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


