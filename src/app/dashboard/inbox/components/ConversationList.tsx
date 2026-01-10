import { FC } from 'react'
import Chip from './ui/Chip'
import SearchBar from './ui/SearchBar'
import { useQuery } from '@tanstack/react-query'


interface Contact {
    id: string
    name: string
    avatar: string
    status: 'online' | 'offline' | 'away'
    lastMessage: string
    lastSeen: string
    tags?: Array<{ label: string; color: string }>
    mode: 'ai' | 'manual' | 'resolved'
}

interface ConversationListProps {
    contacts: Omit<Contact, 'lastMessage' | 'lastSeen' | 'tags' | 'mode'>[]
    selectedContact: string
    onSelectContact: (id: string) => void
}

const filterChips = [
    { label: 'All', active: true },
    { label: 'AI Active', active: false },
    { label: 'Manual', active: false },
]

const conversationData: Contact[] = [
    {
        id: 'sarah-jenkins',
        name: 'Sarah Jenkins',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw12fLH6vo-0HG9SDmUkycLScJiQbyW-2Ztq5ZPY_1o206JeVN77WP0rxd-3xMZESm_E5YaoeizU2XCXtVKBrtLKMra0iqLK-B7uuQG3gLM2TRXZJ3mhvUbXsjr8CIyQPbup1R_vXaSh5ji5Bfz8eOMxDsaYMe08v2Y-MhZP5mj5sMeoc7Y8KB_CXhqDFFIxREA2niJwkMuuuooCfgvUgA-CR3NyUjuByyjppXXVl18ZEbzbM8djl89iTsXxST5T8cjYntkgwZM0o',
        status: 'online',
        lastMessage: 'The pricing page is a bit confusing for our team...',
        lastSeen: '2m ago',
        tags: [
            { label: 'AI Active', color: 'purple' },
            { label: 'High Intent', color: 'red' },
        ],
        mode: 'ai',
    },
    {
        id: 'mark-zuckerberg',
        name: 'Mark Zuckerberg',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnI9G9obcjbKzy0_EO-tk9OMrUpRVhBt9rZyXoPSGRW1dwIePCgK2Q1vVtqNtybePf-OOp9qlSYXVcP9ON-tBbYnpdrPe3EluTnFD8LXbhJjrwriWcRf4u6sJZvRkM8vUZ7_1JrfK-0Nq1xM2bHMWb6hLEedmNmmp0qEdgMBbi37vpjpLK803tZZVp4tU8c2WTEmu3Z26m-EeeAee673Wu7e2V5yRcB_ctl4F9EoteJk2HxFQ12tIRPk5BuRCtT6DdmoYchblEyQI',
        status: 'online',
        lastMessage: 'Can you explain the API rate limits?',
        lastSeen: '15m ago',
        tags: [{ label: 'Manual', color: 'gray' }],
        mode: 'manual',
    },
    {
        id: 'jessica-chen',
        name: 'Jessica Chen',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvSpnvwvnO5RSN50lZwjAo3T2HfQie6rkOyG_psG9Rcd9iZ9CRYbZyOE2Y_e92oBZ75MZPI-2Zo5Lx2mCORpQf4En1UG1cBiQ8aD7u6clqybF4jY_4lmSISbAzWE1zOmaKnFNYR9PR7JjUI9UuRrePUkOOaUNkJqm57fUg9TmawyF15oZXYvrkpa6QFWvhbskS39QgM9R0N1-WTL7w9VOA8MZ1Y_u7PSdqZnEg5YqFHGz64p2FjO52iAXxRkPH3KCKFy0QQtpIMh0',
        status: 'away',
        lastMessage: 'Newsletter subscription confirmed.',
        lastSeen: '1h ago',
        tags: [{ label: 'Resolved', color: 'green' }],
        mode: 'resolved',
    },
]

const ConversationList: FC<ConversationListProps> = ({
    selectedContact,
    onSelectContact,
}) => {

    // const { data: conversations, isLoading, error } = useQuery({
    //     queryKey: ["leads"], // Unique key for caching
    //     // queryFn: fetchLeads,
    // });

    // console.log(conversations, isLoading, error);
    return (
        <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col shrink-0">
            <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-[#0d141b] dark:text-white text-lg font-bold">
                        Conversations
                    </h1>
                    <button className="text-primary flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        New
                    </button>
                </div>

                {/* Search */}
                <SearchBar placeholder="Search chats..." />

                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {filterChips.map((chip) => (
                        <Chip
                            key={chip.label}
                            label={chip.label}
                            active={chip.active}
                            onClick={() => { }}
                        />
                    ))}
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {conversationData.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() => onSelectContact(contact.id)}
                        className={`flex items-center gap-3 px-4 min-h-[72px] py-3 cursor-pointer transition-colors ${selectedContact === contact.id
                            ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary'
                            : 'border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <div className="relative">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12"
                                style={{ backgroundImage: `url(${contact.avatar})` }}
                            />
                            {contact.status === 'online' && (
                                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-background-dark" />
                            )}
                        </div>

                        <div className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex justify-between items-center mb-0.5">
                                <p className="text-[#0d141b] dark:text-white text-sm font-semibold truncate">
                                    {contact.name}
                                </p>
                                <p className="text-[#4c739a] text-[10px] font-medium">
                                    {contact.lastSeen}
                                </p>
                            </div>

                            <p className="text-[#4c739a] dark:text-slate-400 text-xs truncate leading-snug">
                                {contact.lastMessage}
                            </p>

                            <div className="flex gap-1.5 mt-1.5">
                                {contact.tags?.map((tag) => (
                                    <span
                                        key={tag.label}
                                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${tag.color === 'purple'
                                            ? 'bg-ai-purple/10 text-ai-purple'
                                            : tag.color === 'red'
                                                ? 'bg-red-100 text-red-600'
                                                : tag.color === 'green'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                            }`}
                                    >
                                        {tag.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    )
}

export default ConversationList