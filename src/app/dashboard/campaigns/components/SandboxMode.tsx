import React, { useState } from 'react';
import { Beaker, Send } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';

interface SandboxModeProps {
    enabled?: boolean;
    onToggle?: (enabled: boolean) => void;
    onSendTest?: (phoneNumber: string) => void;
    defaultPhoneNumber?: string;
}

export const SandboxMode: React.FC<SandboxModeProps> = ({
    enabled = false,
    onToggle,
    onSendTest,
    defaultPhoneNumber = '',
}) => {
    const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);
    const [isSending, setIsSending] = useState(false);

    const handleSendTest = async () => {
        if (!phoneNumber.trim()) {
            alert('Please enter a test phone number');
            return;
        }

        setIsSending(true);
        try {
            await onSendTest?.(phoneNumber);
            console.log(`Test SMS sent to: ${phoneNumber}`);
        } catch (error) {
            console.error('Failed to send test SMS:', error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                        <Beaker className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Sandbox Mode</h4>
                        <p className="text-xs text-[#4c669a]">
                            Simulate broadcast without charging your wallet.
                        </p>
                    </div>
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                        {enabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <Switch.Root
                        checked={enabled}
                        onCheckedChange={onToggle}
                        className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative data-[state=checked]:bg-primary outline-none cursor-pointer"
                    >
                        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[26px]" />
                    </Switch.Root>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="form-input flex-1 w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm"
                    placeholder="Your test phone number (e.g., 08030000000)"
                    disabled={!enabled}
                />
                <button
                    onClick={handleSendTest}
                    disabled={!enabled || isSending}
                    className="bg-white dark:bg-slate-800 text-[#0d121b] dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className="inline-block w-4 h-4 mr-2" />
                    {isSending ? 'Sending...' : 'Send Test SMS'}
                </button>
            </div>

            {enabled && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                    <p className="text-xs text-green-700 dark:text-green-300">
                        💡 <strong>Sandbox Active:</strong> Test messages will not be sent to actual recipients and will not charge your wallet.
                    </p>
                </div>
            )}
        </div>
    );
};