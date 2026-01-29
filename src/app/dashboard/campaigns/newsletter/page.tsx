/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { EmailConfig } from './EmailConfig';
import { CostEstimate } from './CostEstimate';
import { EmailPreview } from './EmailPreview';
import { BuilderTabs } from './BuilderTabs';
import { EditorHeader } from './EditorHeader';
import { SplitScreenLayout } from './SplitScreenLayout';
import { PreSendChecklist } from './PreSendChecklist';
import { ContentBlock, ContentBlocks } from './ContentBlocks';


export default function EmailBuilderPage() {
    const [blocks, setBlocks] = useState<ContentBlock[]>([]); // initialized with your blocks
    const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

    const handleEditBlock = (blockId: string) => {
        setEditingBlockId(blockId);
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
    const senderEmail = 'marketing@analytics.com.ng';

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
        alert('💾 Draft saved successfully!');
    };

    const handleScheduleSend = () => {
        console.log('Scheduling email campaign...');
        alert('📅 Schedule send dialog opening...');
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
        alert('💰 Cost customization dialog');
    };

    // Left Panel Content (Builder)
    const leftContent = (
        <div className="p-4 lg:p-10 max-w-[560px] mx-auto space-y-8">
            <EmailConfig
                subject={subject}
                previewText={previewText}
                onSubjectChange={setSubject}
                onPreviewTextChange={setPreviewText}
                senderEmail={senderEmail}
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
            />

            <CostEstimate
                estimatedCost="₦12,450.00"
                ratePerRecipient="₦0.27"
                recipientCount={45200}
                deliveryTime="2-4 hours"
                networkFeeIncluded
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
            {/* <EditorHeader
                campaignName={campaignName}
                campaignId={campaignId}
                lastUpdated={lastUpdated}
                onSaveDraft={handleSaveDraft}
                onScheduleSend={handleScheduleSend}
                onDuplicate={() => console.log('Duplicate campaign')}
            /> */}
            {/* 
            <BuilderTabs
                activeTab="email"
                onTabChange={(tab) => console.log('Tab changed to:', tab)}
            /> */}

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