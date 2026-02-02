import React, { useState } from 'react';
import { Settings, AlertCircle, Send, Loader2, RefreshCw, Users, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface EmailConfigProps {
    subject: string;
    previewText: string;
    onSubjectChange: (subject: string) => void;
    onPreviewTextChange: (text: string) => void;
    htmlContent: string;
    senderEmail?: string;
    replyTo?: string;
    className?: string;
    // Add this line below:
    onTestSend?: () => Promise<void>; // Add this line
    onSyncComplete?: (activeCount: number, inactiveCount: number) => void;
    isSendingTest?: boolean; // Add this to interface
    setActiveEmails: React.Dispatch<React.SetStateAction<string[]>>;
    activeEmails: string[];
}

export const EmailConfig: React.FC<EmailConfigProps> = ({
    subject,
    previewText,
    onSubjectChange,
    onPreviewTextChange,
    htmlContent,
    senderEmail = 'onboarding@resend.dev',
    replyTo = 'admin@qefas.com',
    className = '',
    onTestSend,
    isSendingTest = false,
    onSyncComplete,
    setActiveEmails,
    activeEmails
    // Destructure it here as well
}) => {
    const [characterCount, setCharacterCount] = useState(subject.length);
    const [isSending, setIsSending] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);


    // Stats State
    const [stats, setStats] = useState<{ active: number; inactive: number; total: number } | null>(null);


    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSubject = e.target.value;
        onSubjectChange(newSubject);
        setCharacterCount(newSubject.length);
    };

    // 1. Sync Logic: Fetch from your Newsletter Schema
    const handleSyncSubscribers = async () => {
        setIsSyncing(true);
        try {
            const response = await fetch('/api/newsletter/subscribers');
            const data = await response.json();

            const active = data.filter((s: any) => s.status === 'active');
            const inactive = data.filter((s: any) => s.status === 'inactive');

            // This line sends the data back up to EmailBuilderPage
            onSyncComplete?.(active.length, inactive.length);

            setStats({
                active: active.length,
                inactive: inactive.length,
                total: data.length
            });
            setActiveEmails(active.map((s: any) => s.email));
            toast.success("Subscribers synced successfully");
        } catch (error) {
            toast.error("Failed to sync subscribers");
            console.error("Sync failed", error);
        } finally {
            setIsSyncing(false);
        }
    };

    // 2. Bulk Send Logic
    const handleSendCampaign = async () => {
        if (activeEmails.length === 0) return toast.error("No active recipients found. Sync first!");

        setIsSending(true);
        try {
            const response = await fetch('/api/send-bulk', {
                method: 'POST',
                body: JSON.stringify({
                    subject,
                    previewText,
                    htmlContent,
                    to: activeEmails, // Send the array of active emails
                }),
            });
            if (response.ok) toast.success(`Campaign triggered for ${activeEmails.length} recipients!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to trigger campaign");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Campaign Setup</h2>
                        <p className="text-sm text-slate-500">Configure delivery and audience</p>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={handleSyncSubscribers}
                        disabled={isSyncing}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        Sync Audience
                    </button>
                    <button
                        onClick={handleSendCampaign}
                        disabled={isSending || activeEmails.length === 0}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50 transition-all shadow-sm shadow-primary/20"
                    >
                        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Blast Campaign
                    </button>
                </div>
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onTestSend}
                    disabled={isSendingTest} // Prevent double clicks
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg font-bold text-sm hover:bg-amber-600 disabled:bg-amber-300 disabled:cursor-not-allowed transition-all min-w-[140px]"
                >
                    {isSendingTest ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Send Test Email
                        </>
                    )}
                </button>

                {/* Your existing Sync/Send buttons */}
            </div>

            {/* Sync Results / Stats Card */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-500 mb-1">
                            <Users className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Total Reach</span>
                        </div>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Active (To Send)</span>
                        </div>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.active}</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600 mb-1">
                            <XCircle className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Inactive (Filtered)</span>
                        </div>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.inactive}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sender Settings */}
                <div className="space-y-4 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Delivery Details</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">From</label>
                            <input readOnly value={senderEmail} className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 text-sm bg-slate-50 cursor-not-allowed" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reply-To</label>
                            <input readOnly value={replyTo} className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 text-sm bg-slate-50" />
                        </div>
                    </div>
                </div>

                {/* Content Settings */}
                <div className="space-y-4 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Envelope Details</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject Line</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={handleSubjectChange}
                                    maxLength={60}
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 pr-12 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                />
                                <span className={`absolute right-3 top-3 text-[10px] font-bold ${characterCount > 50 ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {characterCount}/60
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preview Text</label>
                            <input
                                type="text"
                                value={previewText}
                                onChange={(e) => onPreviewTextChange(e.target.value)}
                                className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};