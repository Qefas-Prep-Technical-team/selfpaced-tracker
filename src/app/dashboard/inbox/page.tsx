import ChatLayout from "./components/ChatLayout";

export default function LiveChatPage() {
    return (
        // Locks the outer container to exactly fit the remaining page height
        <div className="flex h-[calc(100vh-144px)] md:h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-background">
            {/* If you have a Nav, put it here */}
            
            {/* This container ensures ChatLayout fills the remaining height */}
            <ChatLayout />
        </div>
    )
}