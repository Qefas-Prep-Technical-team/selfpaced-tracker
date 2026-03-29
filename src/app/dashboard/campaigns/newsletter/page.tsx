/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { EmailConfig } from './EmailConfig';
import { CostEstimate } from './CostEstimate';
import { EmailPreview } from './EmailPreview';
import { EditorHeader } from './EditorHeader';
import { SplitScreenLayout } from './SplitScreenLayout';
import { ChecklistItem, PreSendChecklist } from './PreSendChecklist';
import { ContentBlock, ContentBlocks } from './ContentBlocks';
import { generateFinalHtml, generateHtmlFromBlocks } from '@/lib/utils';
import { toast } from 'react-toastify';


export default function EmailBuilderPage() {
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [activeEmails, setActiveEmails] = useState<string[]>([]);
    const [recipientStats, setRecipientStats] = useState({ active: 0, inactive: 0 });
    const RATE_PER_RECIPIENT = 0.27;

    const calculateCost = (count: number) => {
        const total = count * RATE_PER_RECIPIENT;
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(total);
    };

    const handleEditBlock = (blockId: string) => {
        setEditingBlockId(blockId);
    };

    const getDynamicChecklist = (blocks: ContentBlock[]): ChecklistItem[] => {
        const hasUnsubscribe = blocks.some(b =>
            b.content.toLowerCase().includes('unsubscribe')
        );

        const hasEmptyImages = blocks.some(b =>
            b.type === 'image' && (b.content === '' || b.content.startsWith('http') === false)
        );

        const hasPlaceholderLinks = blocks.some(b => {
            if (b.type !== 'button') return false;
            try {
                const btn = JSON.parse(b.content);
                return btn.url === '#' || btn.url === 'https://' || !btn.url;
            } catch { return true; }
        });

        return [
            {
                id: 'domain',
                title: 'Domain Verified',
                description: 'analytics.com.ng is ready.',
                status: 'passed',
            },
            {
                id: 'unsubscribe',
                title: 'Unsubscribe Link',
                description: hasUnsubscribe
                    ? 'Legal footer requirement met.'
                    : 'Your email might be flagged as spam without this.',
                status: hasUnsubscribe ? 'passed' : 'failed',
            },
            {
                id: 'images',
                title: 'Image Check',
                description: hasEmptyImages
                    ? 'One or more images are missing a valid source URL.'
                    : 'All images have sources.',
                status: hasEmptyImages ? 'failed' : 'passed',
            },
            {
                id: 'links',
                title: 'Button Links',
                description: hasPlaceholderLinks
                    ? 'Check your button URLs before sending.'
                    : 'All buttons are linked correctly.',
                status: hasPlaceholderLinks ? 'warning' : 'passed',
            }
        ];
    };

    const updateBlockContent = (blockId: string, newContent: string) => {
        setBlocks(prev =>
            prev.map(b => b.id === blockId ? { ...b, content: newContent } : b)
        );
    };

    // Email Configuration State
    const [subject, setSubject] = useState('New Q2 Analytics features for Nigerian Merchants');
    const [previewText, setPreviewText] = useState('Summary of what\'s new in your dashboard...');

    // Preview State
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [activeView, setActiveView] = useState<'builder' | 'preview'>('builder');

    // Campaign Information
    const campaignName = 'Q2 Growth Update - Nigeria';
    const campaignId = 'NG-Q2-2024';
    const lastUpdated = '2 hours ago';
    const senderEmail = 'qefas.lms@gmail.com';

    // Event Handlers
    const handleSaveDraft = () => {
        const draft = {
            subject,
            previewText,
            blocks,
            lastSaved: new Date().toISOString(),
        };
        localStorage.setItem('emailDraft', JSON.stringify(draft));
        toast.success('💾 Draft saved successfully!');
    };

    const handleScheduleSend = () => {
        toast.info('📅 Schedule send dialog opening...');
    };

    const handleAddBlock = (type: any) => {
        const newBlock: ContentBlock = {
            id: `block-${Date.now()}`,
            type,
            content: `New ${type} block content`,
        };
        setBlocks([...blocks, newBlock]);
    };

    const handleChecklistItemClick = (itemId: string) => {
        console.log('Checklist item clicked:', itemId);
    };

    const handleCustomizeCost = () => {
        toast.success('💰 Cost customization dialog');
    };

    const finalHtmlContent = generateFinalHtml(blocks);
    const handleTestSend = async () => {
        const testEmail = "qefas.lms@gmail.com";
        setIsSendingTest(true);

        try {
            const response = await fetch('/api/send-bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: `[TEST] ${subject}`,
                    htmlContent: finalHtmlContent,
                    to: [testEmail],
                    sender: 'onboarding@resend.dev'
                }),
            });

            if (response.ok) toast.success("✅ Test email delivered!");
        } catch (err) {
            toast.error("❌ Send failed");
        } finally {
            setIsSendingTest(false);
        }
    };

    const leftContent = (
        <div className="p-4 lg:p-10 mx-auto space-y-8">
            <EmailConfig
                subject={subject}
                previewText={previewText}
                onSubjectChange={setSubject}
                onPreviewTextChange={setPreviewText}
                senderEmail={senderEmail}
                htmlContent={finalHtmlContent}
                onSyncComplete={(active, inactive) => {
                    setRecipientStats({ active, inactive });
                }}
                onTestSend={handleTestSend}
                isSendingTest={isSendingTest}
                setActiveEmails={setActiveEmails}
                activeEmails={activeEmails}
            />

            <ContentBlocks
                blocks={blocks}
                onBlocksChange={setBlocks}
                onAddBlock={handleAddBlock}
                onEditBlock={handleEditBlock}
                editingBlockId={editingBlockId}
                onUpdateContent={updateBlockContent}
                setEditingBlockId={setEditingBlockId}
            />

            <PreSendChecklist
                onItemClick={handleChecklistItemClick}
                items={getDynamicChecklist(blocks)}
            />

            <CostEstimate
                recipientCount={activeEmails.length}
                ratePerRecipient="₦0.27"
                estimatedCost={calculateCost(activeEmails.length)}
                deliveryTime="calculating..."
                onCustomize={handleCustomizeCost}
            />
        </div>
    );

    const rightContent = (
        <EmailPreview
            subject={subject}
            senderEmail={senderEmail}
            blocks={blocks}
            previewMode={previewMode}
            onModeChange={setPreviewMode}
        />
    );

    return (
        <main className="flex-1 h-screen flex flex-col bg-white dark:bg-background-dark overflow-hidden">
            <EditorHeader
                campaignName={campaignName}
                campaignId={campaignId}
                lastUpdated={lastUpdated}
                onSaveDraft={handleSaveDraft}
                onScheduleSend={handleScheduleSend}
            />

            {/* Mobile View Switcher */}
            <div className="lg:hidden flex items-center p-4 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-20 shrink-0">
                <div className="flex-1 flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveView('builder')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeView === 'builder' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-black/5' : 'text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Builder
                    </button>
                    <button 
                        onClick={() => setActiveView('preview')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeView === 'preview' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-black/5' : 'text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Preview
                    </button>
                </div>
            </div>

            <SplitScreenLayout
                leftContent={leftContent}
                rightContent={rightContent}
                activeView={activeView}
            />
        </main>
    );
}