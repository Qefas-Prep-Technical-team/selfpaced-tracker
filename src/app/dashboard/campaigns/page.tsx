'use client';

import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { StickyFooter } from './components/StickyFooter';
import { PageHeader } from './components/PageHeader';
import SmsMain from './components/SmsMain';
import EmailBuilderPage from './newsletter/page';

export default function MessagingCenterPage() {
    const [activeTab, setActiveTab] = useState('sms');
    const [isSending, setIsSending] = useState(false);

    const tabs = [
        { id: 'sms', label: 'SMS Messaging', icon: '📱' },
        { id: 'email', label: 'Email Newsletter', icon: '📧' },
        { id: 'history', label: 'History & Analytics', icon: '📊' },
    ];

    const handleSendBroadcast = async () => {
        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSending(false);
    };

    return (
        <main className=' px-4 md:px-10 py-6 md:py-8'>
            <PageHeader
                title="Messaging Center"
                description="Centralized hub for reliable customer outreach across Nigeria."
            />

            <Tabs.Root
                className="flex flex-col mt-8"
                defaultValue="sms"
                onValueChange={(value) => setActiveTab(value)}
            >
                {/* Tab List (Navigation) */}
                <Tabs.List className="flex border-b border-gray-200 mb-6 gap-8">
                    {tabs.map((tab) => (
                        <Tabs.Trigger
                            key={tab.id}
                            value={tab.id}
                            className={`pb-4 text-sm font-medium transition-all relative
                                ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </Tabs.Trigger>
                    ))}
                </Tabs.List>

                {/* Content Areas */}
                <Tabs.Content value="sms" className="outline-none">
                    <SmsMain />
                </Tabs.Content>

                <Tabs.Content value="email" className="py-10 text-center outline-none">
                    <EmailBuilderPage />
                </Tabs.Content>

                <Tabs.Content value="history" className="py-10 text-center outline-none">
                    <p className="text-gray-500">Analytics dashboard loading...</p>
                </Tabs.Content>
            </Tabs.Root>

            <StickyFooter
                onSaveDraft={() => console.log('Draft saved')}
                onSendBroadcast={handleSendBroadcast}
                isSending={isSending}
            />
        </main >
    );
}