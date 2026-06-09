import React, { FC } from 'react';
import { SMSConfigCard } from './SMSConfigCard';
import { RecipientInput } from './RecipientInput';
import { SMSComposer } from './SMSComposer';
import { SandboxMode } from './SandboxMode';
import { Radio, Smartphone } from 'lucide-react';

interface SenderIdItem {
    sender_id: string;
    status: 'active' | 'pending' | 'blocked';
    country?: string;
    company?: string;
    usecase?: string;
}

interface SmsMainProps {
    selectedRoute: string;
    onRouteSelect: (route: string) => void;
    message: string;
    onMessageChange: (msg: string) => void;
    recipients: string[];
    onRecipientsChange: (recipients: string[]) => void;
    sandboxEnabled: boolean;
    onSandboxToggle: (enabled: boolean) => void;
    onSendTest: (phoneNumber: string) => void;
    balance?: number;
    currency?: string;
    accountUser?: string;
    prices?: {
        dnd: string;
        generic: string;
        whatsapp: string;
        voice: string;
    };
    senderIds?: SenderIdItem[];
    selectedSenderId?: string;
    onSenderIdSelect?: (senderId: string) => void;
    onRefreshSenderIds?: () => void;
}

const SmsMain: FC<SmsMainProps> = ({
    selectedRoute,
    onRouteSelect,
    message,
    onMessageChange,
    recipients,
    onRecipientsChange,
    sandboxEnabled,
    onSandboxToggle,
    onSendTest,
    balance = 0.00,
    currency = 'NGN',
    accountUser = 'Termii Account',
    prices = {
        dnd: '12.00',
        generic: '4.00',
        whatsapp: '20.00',
        voice: '25.00'
    },
    senderIds = [],
    selectedSenderId = '',
    onSenderIdSelect,
    onRefreshSenderIds,
}) => {
    // Dynamically build delivery routes with pricing from environmental options
    const deliveryRoutes = [
        {
            id: 'dnd',
            name: 'DND (Transactional)',
            description: 'Bypasses DND restrictions',
            price: `₦${Number(prices.dnd).toFixed(2)}`,
            priceUnit: '/unit',
            recommended: true,
        },
        {
            id: 'generic',
            name: 'Generic (Promotional)',
            description: 'Subject to DND limitations',
            price: `₦${Number(prices.generic).toFixed(2)}`,
            priceUnit: '/unit',
        },
        {
            id: 'whatsapp',
            name: 'WhatsApp (Conversational)',
            description: 'Delivered via WhatsApp API',
            price: `₦${Number(prices.whatsapp).toFixed(2)}`,
            priceUnit: '/unit',
        },
        {
            id: 'voice',
            name: 'Voice Call (TTS)',
            description: 'Automated text-to-speech call',
            price: `₦${Number(prices.voice).toFixed(2)}`,
            priceUnit: '/unit',
        },
    ];

    const activeRoutePrice = Number(prices[selectedRoute as keyof typeof prices] || '12');

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
                    onRouteSelect={onRouteSelect}
                    balance={balance}
                    currency={currency}
                    accountUser={accountUser}
                    deliveryRoutes={deliveryRoutes}
                    senderIds={senderIds}
                    selectedSenderId={selectedSenderId}
                    onSenderIdSelect={onSenderIdSelect}
                    onRefreshSenderIds={onRefreshSenderIds}
                />

                <RecipientInput
                    onRecipientsChange={(newRecipients) => {
                        onRecipientsChange(newRecipients);
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
                    onMessageChange={(msg) => {
                        onMessageChange(msg);
                    }}
                    recipientCount={recipients.length}
                    unitPrice={activeRoutePrice}
                    onPersonalize={() => console.log('Personalize clicked')}
                    onTemplates={() => console.log('Templates clicked')}
                />

                <SandboxMode
                    enabled={sandboxEnabled}
                    onToggle={onSandboxToggle}
                    onSendTest={onSendTest}
                />
            </div>
        </div>
    );
};

export default SmsMain;