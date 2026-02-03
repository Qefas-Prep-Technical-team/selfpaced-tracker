import React from 'react';
import { Save, Calendar, Download, Copy } from 'lucide-react';

interface EditorHeaderProps {
    campaignName: string;
    campaignId: string;
    lastUpdated: string;
    onSaveDraft?: () => void;
    onScheduleSend?: () => void;
    onExport?: () => void;
    onDuplicate?: () => void;
    className?: string;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
    campaignName,
    campaignId,
    lastUpdated,
    onSaveDraft,
    onScheduleSend,
    onExport,
    onDuplicate,
    className = '',
}) => {
    return (
        <div className={`max-w-[1440px] w-full mx-auto px-6 lg:px-10 pt-6 ${className}`}>
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 mb-2">
                <a className="text-[#4c669a] text-sm font-medium hover:underline" href="#">
                    Messaging Center
                </a>
                <span className="text-[#4c669a] text-sm font-medium">/</span>
                <span className="text-[#0d121b] dark:text-slate-200 text-sm font-medium">
                    Email Newsletter
                </span>
            </div>

            {/* Header Content */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#0d121b] dark:text-white text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
                        {campaignName}
                    </h1>
                    <p className="text-[#4c669a] text-xs font-normal">
                        Campaign ID: {campaignId} • Created {lastUpdated}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onDuplicate}
                        className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                    </button>

                    <button
                        onClick={onSaveDraft}
                        className="flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                    </button>

                    <button
                        onClick={onScheduleSend}
                        className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold tracking-wide hover:bg-blue-700 transition-colors"
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Send
                    </button>
                </div>
            </div>
        </div>
    );
};