import React from 'react';
import { Save, Calendar, Copy } from 'lucide-react';

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
    onDuplicate,
    className = '',
}) => {
    return (
        <div className={`max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 ${className} shrink-0`}>
            {/* Breadcrumbs - Hidden on small mobile */}
            <div className="hidden xs:flex flex-wrap gap-2 mb-2">
                <a className="text-[#4c669a] text-[10px] sm:text-xs font-bold hover:underline uppercase tracking-wider" href="#">
                    Messaging Center
                </a>
                <span className="text-slate-300 dark:text-slate-800 text-xs">/</span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                    Email Newsletter
                </span>
            </div>

            {/* Header Content */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h1 className="text-[#0d121b] dark:text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-black leading-tight tracking-tight truncate">
                        {campaignName}
                    </h1>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        <span className="truncate">ID: {campaignId}</span>
                        <span className="text-slate-300 dark:text-slate-800">•</span>
                        <span>{lastUpdated}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={onDuplicate}
                        className="flex-1 sm:flex-none flex items-center justify-center rounded-xl h-10 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                        <Copy className="w-4 h-4 mr-1.5" />
                        <span className="hidden sm:inline">Duplicate</span>
                        <span className="sm:hidden">Draft</span>
                    </button>

                    <button
                        onClick={onSaveDraft}
                        className="flex-1 sm:flex-none flex items-center justify-center rounded-xl h-10 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                        <Save className="w-4 h-4 mr-1.5" />
                        Save
                    </button>

                    <button
                        onClick={onScheduleSend}
                        className="flex-[2] sm:flex-none flex items-center justify-center rounded-xl h-10 px-4 bg-primary text-white text-[10px] sm:text-xs font-black uppercase tracking-widest hover:shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <Calendar className="w-4 h-4 mr-1.5" />
                        Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};