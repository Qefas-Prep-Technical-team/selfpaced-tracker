/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Monitor, Smartphone, Info, RefreshCw } from 'lucide-react';

interface EmailPreviewProps {
    subject: string;
    senderEmail: string;
    blocks: Array<{
        type: string;
        content: any;
    }>;
    previewMode?: 'desktop' | 'mobile';
    onModeChange?: (mode: 'desktop' | 'mobile') => void;
    className?: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
    subject,
    senderEmail,
    blocks = [],
    previewMode = 'desktop',
    onModeChange,
    className = '',
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // const renderBlock = (block: any, index: number) => {
    //     switch (block.type) {
    //         case 'text':
    //             return (
    //                 <div key={index} className="space-y-4 mb-6">
    //                     <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
    //                         {block.content.title || 'Hello there,'}
    //                     </h3>
    //                     <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
    //                         {block.content.body || 'Your content here...'}
    //                     </p>
    //                 </div>
    //             );
    //         case 'image':
    //             return (
    //                 <div key={index} className="aspect-[16/9] w-full rounded-lg mb-8 bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center text-white">
    //                     <div className="text-center px-4 lg:px-10">
    //                         <h2 className="text-lg lg:text-xl font-bold mb-2">Image Placeholder</h2>
    //                         <p className="text-xs lg:text-sm text-white/80">
    //                             {block.content.alt || 'Your image description here'}
    //                         </p>
    //                     </div>
    //                 </div>
    //             );
    //         case 'button':
    //             return (
    //                 <div key={index} className="flex justify-center mb-8">
    //                     <button className="px-6 lg:px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-blue-700 transition-colors">
    //                         {block.content.label || 'Call to Action'}
    //                     </button>
    //                 </div>
    //             );
    //         default:
    //             return null;
    //     }
    // };

    const renderBlock = (block: any, index: number) => {
        // Helper to extract content safely whether it's a string or an object
        const getContent = (field: string, fallback: string) => {
            if (typeof block.content === 'string') return block.content;
            if (typeof block.content === 'object' && block.content !== null) {
                return block.content[field] || fallback;
            }
            return fallback;
        };

        switch (block.type) {
            case 'text':
                return (
                    <div key={index} className="space-y-4 mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            {typeof block.content === 'object' ? block.content.title : 'Update:'}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                            {getContent('body', 'Your content here...')}
                        </p>
                    </div>
                );
            case 'image':
                const imgSrc = typeof block.content === 'string' ? block.content : block.content.url;
                return (
                    <div key={index} className="w-full mb-8">
                        {imgSrc && imgSrc.startsWith('http') ? (
                            <img src={imgSrc} alt="Preview" className="w-full rounded-lg object-cover" />
                        ) : (
                            <div className="aspect-[16/9] w-full rounded-lg bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center text-white">
                                <p className="text-xs">{getContent('alt', 'Image Placeholder')}</p>
                            </div>
                        )}
                    </div>
                );
            case 'image':
                const isUrl = typeof block.content === 'string' && block.content.startsWith('http');

                return (
                    <div key={index} className="w-full mb-8">
                        {isUrl ? (
                            <div className="relative group">
                                <img
                                    src={block.content}
                                    alt="Email Content"
                                    className="w-full rounded-lg object-cover border border-slate-200"
                                    onError={(e) => {
                                        // Fallback if the URL is broken
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                                    }}
                                />
                            </div>
                        ) : (
                            /* The placeholder you already had */
                            <div className="aspect-[16/9] w-full rounded-lg bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center text-white text-center p-6">
                                <div>
                                    <h2 className="text-lg font-bold mb-2">Image Block</h2>
                                    <p className="text-xs text-white/70">
                                        {block.content || 'No image URL provided yet. Click edit to add one.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'button':
                return (
                    <div key={index} className="flex justify-center mb-8">
                        <button className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg shadow-lg">
                            {getContent('label', 'Click Here')}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <div className={`flex flex-col items-center py-6 lg:py-10 px-4 lg:px-6 ${className}`}>
            {/* Preview Controls */}
            <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm mb-6 lg:mb-10 w-full max-w-md">
                <button
                    onClick={() => onModeChange?.('desktop')}
                    className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors ${previewMode === 'desktop'
                        ? 'bg-primary text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                >
                    <Monitor className="w-4 h-4" />
                    Desktop
                </button>
                <button
                    onClick={() => onModeChange?.('mobile')}
                    className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors ${previewMode === 'mobile'
                        ? 'bg-primary text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                >
                    <Smartphone className="w-4 h-4" />
                    Mobile
                </button>
                <button
                    onClick={handleRefresh}
                    className="ml-2 p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                    title="Refresh preview"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Email Preview Container */}
            <div
                className={`w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col ${previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-[640px]'
                    } ${previewMode === 'mobile' ? 'min-h-[600px]' : 'min-h-[700px]'}`}
            >
                {/* Email Header Browser Mockup */}
                <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-t-xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="size-2 lg:size-2.5 rounded-full bg-slate-300"></div>
                        <div className="size-2 lg:size-2.5 rounded-full bg-slate-300"></div>
                        <div className="size-2 lg:size-2.5 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="flex gap-2 text-[10px] lg:text-[11px] text-slate-500">
                        <span className="font-bold">From:</span>
                        <span className="truncate">{senderEmail}</span>
                    </div>
                    <div className="flex gap-2 text-[10px] lg:text-[11px] text-slate-500">
                        <span className="font-bold">Subject:</span>
                        <span className="text-[#0d121b] dark:text-white truncate">{subject}</span>
                    </div>
                </div>

                {/* Email Content Body */}
                <div className={`flex-1 p-4 lg:p-12 overflow-y-auto ${previewMode === 'mobile' ? 'p-4' : ''}`}>
                    {/* Email Logo */}
                    <div className="flex justify-center mb-6 lg:mb-10">
                        <div className="h-8 w-32 lg:w-40 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-400">YOUR LOGO</span>
                        </div>
                    </div>

                    {/* Render Blocks */}
                    {blocks.length > 0 ? (
                        blocks.map((block, index) => renderBlock(block, index))
                    ) : (
                        <div className="space-y-4">
                            <div className="aspect-[16/9] w-full rounded-lg mb-8 bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center text-white">
                                <div className="text-center px-4 lg:px-10">
                                    <h2 className="text-lg lg:text-xl font-bold mb-2">Scaling Nigerian Commerce in Q2</h2>
                                    <p className="text-xs lg:text-sm text-white/80">
                                        New tools designed for the local market.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Hello there,
                                </h3>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                    Welcome to our Q2 update. We`&apos;`ve spent the last three months optimizing our core engine to ensure better delivery across all major Nigerian mobile networks.
                                </p>
                                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                    Whether your customers are on MTN, Airtel, or Glo, our new messaging gateway ensures your analytics reports and newsletters land right in their inbox without delay.
                                </p>
                            </div>

                            <div className="flex justify-center mb-8">
                                <button className="px-6 lg:px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20">
                                    Explore New Features
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Email Footer */}
                    <div className="pt-6 lg:pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 lg:mb-4">
                            SaaS Analytics Nigeria Ltd.
                        </p>
                        <p className="text-[10px] text-slate-400">
                            Lagos, Nigeria • You are receiving this because you subscribed to our merchant updates.
                        </p>
                        <div className="flex justify-center gap-4 mt-3 lg:mt-4">
                            <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">
                                Unsubscribe
                            </span>
                            <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">
                                Privacy Policy
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Network Tooltip */}
            <div className="mt-6 lg:mt-8 w-full max-w-[400px] flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 p-4 rounded-lg">
                <Info className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                        Local Delivery Optimization
                    </p>
                    <p className="text-[11px] text-blue-800 dark:text-blue-400/80 leading-normal mt-1">
                        Your campaign is automatically optimized for low-bandwidth mobile devices common in the Nigerian region.
                    </p>
                </div>
            </div>
        </div>
    );
};