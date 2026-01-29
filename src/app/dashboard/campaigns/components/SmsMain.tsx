import React, { FC, useState } from 'react';
import { SMSConfigCard } from './SMSConfigCard';
import { RecipientInput } from './RecipientInput';
import { SMSComposer } from './SMSComposer';
import { SandboxMode } from './SandboxMode';



const SmsMain = () => {
    const [selectedRoute, setSelectedRoute] = useState('corporate');
    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [sandboxEnabled, setSandboxEnabled] = useState(false);

    const breadcrumbs = [
        { label: 'Dashboard', href: '/' },
        { label: 'Messaging Center', href: '/messaging' },
    ];

    const tabs = [
        { id: 'sms', label: 'SMS Messaging', icon: 'sms', active: true },
        { id: 'email', label: 'Email Newsletter', icon: 'mail' },
        { id: 'history', label: 'History & Analytics', icon: 'history' },
    ];

    const handleSendBroadcast = async () => {
        setIsSending(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Broadcast sent:', { message, recipients });
        setIsSending(false);
    };

    const handleSaveDraft = () => {
        console.log('Draft saved:', { message, recipients });
    };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-24 md:mb-32">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-6">
                <SMSConfigCard
                    selectedRoute={selectedRoute}
                    onRouteSelect={setSelectedRoute}
                />

                <RecipientInput
                    onRecipientsChange={(recipients, valid, invalid) => {
                        setRecipients(recipients);
                        console.log(`Valid: ${valid}, Invalid: ${invalid}`);
                    }}
                    onUploadCSV={() => console.log('Upload CSV clicked')}
                />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 space-y-6">
                <SMSComposer
                    onMessageChange={(msg, chars, units) => {
                        setMessage(msg);
                        console.log(`Chars: ${chars}, Units: ${units}`);
                    }}
                    onPersonalize={() => console.log('Personalize clicked')}
                    onTemplates={() => console.log('Templates clicked')}
                />

                <SandboxMode
                    enabled={sandboxEnabled}
                    onToggle={() => setSandboxEnabled(!sandboxEnabled)}
                    onSendTest={() => console.log('Send test SMS')}
                />
            </div>
        </div>
    );
};

export default SmsMain;