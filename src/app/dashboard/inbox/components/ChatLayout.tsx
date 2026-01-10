'use client'

import { useState } from 'react'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'
import ContactPanel from './ContactPanel'

interface Contact {
    id: string
    name: string
    email: string
    avatar: string
    status: 'online' | 'offline' | 'away'
    role?: string
}

export default function ChatLayout() {
    const [selectedContact, setSelectedContact] = useState<string>('sarah-jenkins')

    const contacts: Contact[] = [
        {
            id: 'sarah-jenkins',
            name: 'Sarah Jenkins',
            email: 's.jenkins@webflow.com',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAw12fLH6vo-0HG9SDmUkycLScJiQbyW-2Ztq5ZPY_1o206JeVN77WP0rxd-3xMZESm_E5YaoeizU2XCXtVKBrtLKMra0iqLK-B7uuQG3gLM2TRXZJ3mhvUbXsjr8CIyQPbup1R_vXaSh5ji5Bfz8eOMxDsaYMe08v2Y-MhZP5mj5sMeoc7Y8KB_CXhqDFFIxREA2niJwkMuuuooCfgvUgA-CR3NyUjuByyjppXXVl18ZEbzbM8djl89iTsXxST5T8cjYntkgwZM0o',
            status: 'online',
            role: 'Operations Manager @ WebFlow',
        },
        {
            id: 'mark-zuckerberg',
            name: 'Mark Zuckerberg',
            email: 'mark@meta.com',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnI9G9obcjbKzy0_EO-tk9OMrUpRVhBt9rZyXoPSGRW1dwIePCgK2Q1vVtqNtybePf-OOp9qlSYXVcP9ON-tBbYnpdrPe3EluTnFD8LXbhJjrwriWcRf4u6sJZvRkM8vUZ7_1JrfK-0Nq1xM2bHMWb6hLEedmNmmp0qEdgMBbi37vpjpLK803tZZVp4tU8c2WTEmu3Z26m-EeeAee673Wu7e2V5yRcB_ctl4F9EoteJk2HxFQ12tIRPk5BuRCtT6DdmoYchblEyQI',
            status: 'online',
        },
        {
            id: 'jessica-chen',
            name: 'Jessica Chen',
            email: 'jessica@startup.com',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvSpnvwvnO5RSN50lZwjAo3T2HfQie6rkOyG_psG9Rcd9iZ9CRYbZyOE2Y_e92oBZ75MZPI-2Zo5Lx2mCORpQf4En1UG1cBiQ8aD7u6clqybF4jY_4lmSISbAzWE1zOmaKnFNYR9PR7JjUI9UuRrePUkOOaUNkJqm57fUg9TmawyF15oZXYvrkpa6QFWvhbskS39QgM9R0N1-WTL7w9VOA8MZ1Y_u7PSdqZnEg5YqFHGz64p2FjO52iAXxRkPH3KCKFy0QQtpIMh0',
            status: 'away',
        },
    ]

    const selectedContactData = contacts.find(c => c.id === selectedContact)

    return (
        <main className="flex flex-1 overflow-hidden">
            {/* Left Panel - Conversation List */}
            <ConversationList
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
            />

            {/* Center Panel - Chat Window */}
            <ChatWindow contactId={selectedContact} />

            {/* Right Panel - Contact Info */}
            {selectedContactData && <ContactPanel contact={selectedContactData} />}
        </main>
    )
}