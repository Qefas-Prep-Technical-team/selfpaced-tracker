/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Type, Image, MousePointer, Video, Divide, Columns } from 'lucide-react';
import { BlockDraggable } from './BlockDraggable';


export type BlockType = 'text' | 'image' | 'button' | 'video' | 'divider' | 'columns';

export interface ContentBlock {
    id: string;
    type: BlockType;
    content: string;
    settings?: Record<string, any>;
}

interface ContentBlocksProps {
    blocks: ContentBlock[];
    onBlocksChange: (blocks: ContentBlock[]) => void;
    onAddBlock: (type: BlockType) => void;
    onEditBlock: (blockId: string) => void;
    // --- ADDED THESE PROPS ---
    editingBlockId: string | null;
    onUpdateContent: (id: string, content: string) => void;
    setEditingBlockId: (id: string | null) => void;
    className?: string;
}

const blockTypes: { type: BlockType; label: string; icon: React.ReactNode; description: string }[] = [
    {
        type: 'text',
        label: 'Text',
        icon: <Type className="w-5 h-5" />,
        description: 'Add text content with formatting',
    },
    {
        type: 'image',
        label: 'Image',
        icon: <Image className="w-5 h-5" />,
        description: 'Insert images or banners',
    },
    {
        type: 'button',
        label: 'Button',
        icon: <MousePointer className="w-5 h-5" />,
        description: 'Call-to-action buttons',
    },
    {
        type: 'video',
        label: 'Video',
        icon: <Video className="w-5 h-5" />,
        description: 'Embed video content',
    },
    {
        type: 'divider',
        label: 'Divider',
        icon: <Divide className="w-5 h-5" />,
        description: 'Horizontal separators',
    },
    {
        type: 'columns',
        label: 'Columns',
        icon: <Columns className="w-5 h-5" />,
        description: 'Multi-column layout',
    },
];

export const ContentBlocks: React.FC<ContentBlocksProps> = ({
    blocks,
    onBlocksChange,
    onAddBlock,
    onEditBlock,
    editingBlockId,      // Destructure these
    onUpdateContent,
    setEditingBlockId,
    className = '',
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex((block) => block.id === active.id);
            const newIndex = blocks.findIndex((block) => block.id === over.id);

            const newBlocks = arrayMove(blocks, oldIndex, newIndex);
            onBlocksChange(newBlocks);
        }
    };

    const handleAddBlock = (type: BlockType) => {
        const newBlock: ContentBlock = {
            id: `block-${Date.now()}`,
            type,
            content: getDefaultContent(type),
        };
        onBlocksChange([...blocks, newBlock]);
    };

    const handleDeleteBlock = (blockId: string) => {
        onBlocksChange(blocks.filter(block => block.id !== blockId));
    };

    const getDefaultContent = (type: BlockType): string => {
        switch (type) {
            case 'text':
                return 'Your text content here...';
            case 'image':
                return 'https://example.com/image.jpg';
            case 'button':
                return 'Click Here';
            case 'video':
                return 'https://example.com/video.mp4';
            case 'divider':
                return 'divider';
            case 'columns':
                return '2';
            default:
                return '';
        }
    };

    return (
        <div className={className}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#0d121b] dark:text-white">
                    Content Blocks
                </h2>
                <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
                    + Manage Layout
                </span>
            </div>
            {/* Block Types Selection Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
                {blockTypes.map((bt) => (
                    <button
                        key={bt.type}
                        onClick={() => onAddBlock(bt.type)}
                        className="flex flex-col items-center p-2 border rounded hover:bg-slate-50"
                    >
                        {bt.icon}
                        <span className="text-[10px] mt-1">{bt.label}</span>
                    </button>
                ))}
            </div>

            {/* Blocks Editor */}
            {/* <div className="space-y-4 border-2 border-dashed border-[#e7ebf3] dark:border-slate-700 rounded-xl p-4 lg:p-6">
                {blocks.length === 0 ? (
                    <div className="text-center py-8">
                        <Type className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 mb-2">No blocks added yet</p>
                        <p className="text-sm text-slate-400">
                            Click on a block type above to add content to your email
                        </p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        modifiers={[restrictToVerticalAxis]}
                    >
                        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-4">
                                {blocks.map((block) => (
                                    <BlockDraggable
                                        key={block.id}
                                        block={block}
                                        onEdit={() => onEditBlock(block.id)}
                                        onDelete={() => handleDeleteBlock(block.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                <button
                    onClick={() => onAddBlock('text')}
                    className="w-full py-3 text-xs font-bold text-primary border border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                    + ADD BLOCK HERE
                </button>
            </div> */}
            {/* Blocks Editor (The Sortable List) */}
            <div className="space-y-4 border-2 border-dashed border-slate-200 rounded-xl p-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {blocks.map((block) => (
                                <div key={block.id} className="relative group">
                                    {/* If THIS block is being edited, show the textarea */}
                                    {editingBlockId === block.id ? (
                                        <div className="p-4 bg-blue-50 border-2 border-blue-400 rounded-lg space-y-3">
                                            <label className="text-xs font-bold text-blue-600 uppercase">
                                                Edit {block.type} Content
                                            </label>

                                            {block.type === 'image' ? (
                                                /* Image specific input */
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border rounded bg-white"
                                                    placeholder="Paste Image URL (e.g. https://...)"
                                                    value={block.content}
                                                    onChange={(e) => onUpdateContent(block.id, e.target.value)}
                                                    onBlur={() => setEditingBlockId(null)}
                                                    autoFocus
                                                />
                                            ) : (
                                                /* Default Textarea for Text/Buttons/etc */
                                                <textarea
                                                    className="w-full p-2 border rounded bg-white shadow-inner"
                                                    rows={4}
                                                    value={block.content}
                                                    onChange={(e) => onUpdateContent(block.id, e.target.value)}
                                                    onBlur={() => setEditingBlockId(null)}
                                                    autoFocus
                                                />
                                            )}

                                            <div className="flex justify-between items-center">
                                                <p className="text-[10px] text-blue-500">Click outside to save changes</p>
                                                <button
                                                    onClick={() => setEditingBlockId(null)}
                                                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded"
                                                >
                                                    Done
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Non-editing state (BlockDraggable) */
                                        <BlockDraggable
                                            block={block}
                                            onEdit={() => onEditBlock(block.id)}
                                            onDelete={() => onBlocksChange(blocks.filter(b => b.id !== block.id))}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};