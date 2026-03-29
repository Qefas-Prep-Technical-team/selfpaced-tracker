import React, { FC, useState } from 'react';
import { SMSConfigCard } from './SMSConfigCard';
import { RecipientInput } from './RecipientInput';
import { SMSComposer } from './SMSComposer';
import { SandboxMode } from './SandboxMode';



import { Send, Users, Radio, Smartphone, Layout } from 'lucide-react';

const SmsMain = () => {
    const [selectedRoute, setSelectedRoute] = useState('corporate');
    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [sandboxEnabled, setSandboxEnabled] = useState(false);

    const handleSendBroadcast = async () => {
        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Broadcast sent:', { message, recipients });
        setIsSending(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Configuration */}
            <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                        <Radio size={18} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">Campaign Config</h3>
                </div>

                <SMSConfigCard
                    selectedRoute={selectedRoute}
                    onRouteSelect={setSelectedRoute}
                />

                <RecipientInput
                    onRecipientsChange={(recipients, valid, invalid) => {
                        setRecipients(recipients);
                    }}
                    onUploadCSV={() => console.log('Upload CSV clicked')}
                />
            </div>

            {/* Right Column: Composer */}
            <div className="lg:col-span-7 space-y-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                        <Smartphone size={18} />
                    </div>
                    <h3 className="text-lg font-black tracking-tight">Message Studio</h3>
                </div>

                <SMSComposer
                    onMessageChange={(msg, chars, units) => {
                        setMessage(msg);
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