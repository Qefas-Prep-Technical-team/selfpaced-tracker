import React, { useState } from 'react';
import { Settings, AlertCircle } from 'lucide-react';

interface EmailConfigProps {
    subject: string;
    previewText: string;
    onSubjectChange: (subject: string) => void;
    onPreviewTextChange: (text: string) => void;
    senderEmail?: string;
    replyTo?: string;
    className?: string;
}

export const EmailConfig: React.FC<EmailConfigProps> = ({
    subject,
    previewText,
    onSubjectChange,
    onPreviewTextChange,
    senderEmail = 'marketing@analytics.com.ng',
    replyTo = 'support@analytics.com.ng',
    className = '',
}) => {
    const [characterCount, setCharacterCount] = useState(subject.length);

    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSubject = e.target.value;
        onSubjectChange(newSubject);
        setCharacterCount(newSubject.length);
    };

    return (
        <div className={`space-y-8 ${className}`}>
            <div>
                <h2 className="text-lg font-bold text-[#0d121b] dark:text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Email Configuration
                </h2>

                <div className="space-y-6">
                    {/* Sender Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#4c669a] dark:text-slate-400">
                                Sender Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={senderEmail}
                                    readOnly
                                    className="w-full rounded-lg border-[#e7ebf3] dark:border-slate-700 dark:bg-slate-800 p-3 text-sm bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed"
                                />
                                <span className="absolute right-3 top-3 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">
                                    Verified
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#4c669a] dark:text-slate-400">
                                Reply To
                            </label>
                            <input
                                type="email"
                                value={replyTo}
                                readOnly
                                className="w-full rounded-lg border-[#e7ebf3] dark:border-slate-700 dark:bg-slate-800 p-3 text-sm bg-slate-50 dark:bg-slate-800/50"
                            />
                        </div>
                    </div>

                    {/* Subject Line */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#4c669a] dark:text-slate-400">
                            Subject Line
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={subject}
                                onChange={handleSubjectChange}
                                maxLength={60}
                                className="w-full rounded-lg border-[#e7ebf3] dark:border-slate-700 dark:bg-slate-800 p-3 text-sm focus:border-primary focus:ring-primary"
                                placeholder="Enter your email subject line..."
                            />
                            <span className={`absolute right-3 top-3 text-[10px] font-bold ${characterCount > 50 ? 'text-amber-600' : 'text-[#4c669a]'
                                }`}>
                                {characterCount}/60
                            </span>
                        </div>
                        {characterCount > 50 && (
                            <div className="flex items-center gap-2 text-amber-600 text-xs">
                                <AlertCircle className="w-3 h-3" />
                                Subject line is getting long. Consider shortening for mobile devices.
                            </div>
                        )}
                    </div>

                    {/* Preview Text */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-[#4c669a] dark:text-slate-400">
                            Preview Text
                        </label>
                        <input
                            type="text"
                            value={previewText}
                            onChange={(e) => onPreviewTextChange(e.target.value)}
                            maxLength={120}
                            className="w-full rounded-lg border-[#e7ebf3] dark:border-slate-700 dark:bg-slate-800 p-3 text-sm focus:border-primary focus:ring-primary"
                            placeholder="Summary of what's new in your dashboard..."
                        />
                        <p className="text-xs text-slate-500">
                            This text appears in the inbox preview. Keep it under 120 characters.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};