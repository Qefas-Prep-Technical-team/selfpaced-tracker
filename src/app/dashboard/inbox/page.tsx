import ChatLayout from "./components/ChatLayout";

export default function LiveChatPage() {
    return (
        // Locks the outer container to exactly the screen size
        <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
            {/* If you have a Nav, put it here */}
            
            {/* This container ensures ChatLayout fills the remaining height */}
            <ChatLayout />
        </div>
    )
}