/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { EmailConfig } from './EmailConfig';
import { CostEstimate } from './CostEstimate';
import { EmailPreview } from './EmailPreview';
import { BuilderTabs } from './BuilderTabs';
import { EditorHeader } from './EditorHeader';
import { SplitScreenLayout } from './SplitScreenLayout';
import { ChecklistItem, PreSendChecklist } from './PreSendChecklist';
import { ContentBlock, ContentBlocks } from './ContentBlocks';
import { generateFinalHtml, generateHtmlFromBlocks } from '@/lib/utils';
import { toast } from 'react-toastify';


export default function EmailBuilderPage() {
    const [isSendingTest, setIsSendingTest] = useState(false); // New state
    const [blocks, setBlocks] = useState<ContentBlock[]>([]); // initialized with your blocks
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
    const [activeEmails, setActiveEmails] = useState<string[]>([]);
    // NEW: Stats state to share between EmailConfig and CostEstimate
    const [recipientStats, setRecipientStats] = useState({ active: 0, inactive: 0 });
    // Inside your parent component
    const RATE_PER_RECIPIENT = 0.27;
    const recipientCount = activeEmails.length; // This would likely come from your contact list state

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
    // Inside your main page or parent component
    // 1. Explicitly type the array variable


    // Inside EmailBuilderPage, keep this function
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

    // Content Blocks State


    // Preview State
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

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
        console.log('Draft saved:', draft);
        toast.success('💾 Draft saved successfully!');
    };

    // This converts your visual blocks into the final HTML code
    const finalHtml = `
        <html>
            <body style="margin: 0; padding: 20px; background-color: #f9fafb;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 10px;">
                    ${generateHtmlFromBlocks(blocks)}
                </div>
            </body>
        </html>
    `;

    const handleScheduleSend = () => {
        console.log('Scheduling email campaign...');
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
        // Open relevant settings or fix issue
    };

    const handleCustomizeCost = () => {
        console.log('Opening cost customization');
        toast.success('💰 Cost customization dialog');
    };

    // Left Panel Content (Builder)
    // LINKED CONTENT:
    // This variable always holds the "Send-Ready" version of your preview

    const finalHtmlContent = generateFinalHtml(blocks);
    const handleTestSend = async () => {
        const testEmail = "qefas.lms@gmail.com";
        setIsSendingTest(true); // Start loading

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
            setIsSendingTest(false); // Stop loading regardless of success/fail
        }
    };
    const leftContent = (
        <div className="p-4 lg:p-10  mx-auto space-y-8">
            <EmailConfig
                subject={subject}
                previewText={previewText}
                onSubjectChange={setSubject}
                onPreviewTextChange={setPreviewText}
                senderEmail={senderEmail}
                htmlContent={finalHtmlContent} // <-- Passed here for the blast
                onSyncComplete={(active, inactive) => {
                    setRecipientStats({ active, inactive });
                }}
                onTestSend={handleTestSend}
                isSendingTest={isSendingTest} // Pass the state down
                setActiveEmails={setActiveEmails}
                activeEmails={activeEmails}
            />


            <ContentBlocks
                blocks={blocks}
                onBlocksChange={setBlocks}
                onAddBlock={handleAddBlock}
                onEditBlock={handleEditBlock}
                editingBlockId={editingBlockId}       // <-- Added
                onUpdateContent={updateBlockContent}   // <-- Added
                setEditingBlockId={setEditingBlockId} // <-- Added to allow closing
            />

            <PreSendChecklist
                onItemClick={handleChecklistItemClick}
                // CHANGE THIS LINE:
                items={getDynamicChecklist(blocks)}
            />

            <CostEstimate
                recipientCount={activeEmails.length} // Use the state directly here
                ratePerRecipient="₦0.27"
                estimatedCost={calculateCost(activeEmails.length)}
                deliveryTime="calculating..."
                onCustomize={handleCustomizeCost}
            />
        </div>
    );

    // Right Panel Content (Preview)
    const rightContent = (
        <EmailPreview
            subject={subject}
            senderEmail={senderEmail}
            blocks={blocks} // Ensure this is the 'blocks' state from your useState hook
            previewMode={previewMode}
            onModeChange={setPreviewMode}
        />
    );

    return (


        <main className="flex-1 h-screen flex flex-col">

            <SplitScreenLayout
                leftContent={leftContent}
                rightContent={rightContent}
                defaultLeftWidth={50}
                minLeftWidth={30}
                minRightWidth={30}
            />
        </main>

    );

}