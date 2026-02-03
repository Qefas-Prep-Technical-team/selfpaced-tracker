/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Type, Image, MousePointer, Video, Divide, Columns, Trash2 } from 'lucide-react';
import { BlockDraggable } from './BlockDraggable';
import { safeParseColumns } from '@/lib/utils';


export type BlockType = 'text' | 'image' | 'button' | 'video' | 'divider' | 'columns' | 'heading';

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
                return JSON.stringify({ label: 'Click Here', url: 'https://' });
            case 'video':
                return 'https://example.com/video.mp4';
            case 'divider':
                return 'divider';
            case 'columns':
                // Provide a stringified array of 2 empty strings
                return JSON.stringify(["", ""]);
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
                        className="flex flex-col items-center p-2 border rounded hover:bg-slate-50 transition-colors"
                    >
                        {bt.icon}
                        <span className="text-[10px] mt-1">{bt.label}</span>
                    </button>
                ))}
            </div>

            {/* Blocks Editor (The Sortable List) */}
            <div className="space-y-4 border-2 border-dashed border-slate-200 rounded-xl p-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {blocks.map((block) => {
                                const isEditing = editingBlockId === block.id;

                                return (
                                    <div key={block.id} className="relative group">
                                        {isEditing ? (
                                            <div className="space-y-4 p-4 border-2 border-blue-500 rounded-lg bg-blue-50/30">
                                                <div className="flex justify-between items-center border-b pb-2">
                                                    <span className="text-sm font-bold text-blue-600 uppercase">
                                                        Editing {block.type}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setEditingBlockId(null)}
                                                            className="text-xs px-2 py-1 bg-slate-200 rounded hover:bg-slate-300 transition-colors"
                                                        >
                                                            Done
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBlock(block.id)}
                                                            className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* RENDER DYNAMIC EDITORS BASED ON TYPE */}
                                                {block.type === 'columns' ? (
                                                    <div className="space-y-4">
                                                        <div className="flex gap-2">
                                                            {[2, 3].map(num => (
                                                                <button
                                                                    key={num}
                                                                    onClick={() => {
                                                                        const newCols = Array(num).fill("");
                                                                        onUpdateContent(block.id, JSON.stringify(newCols));
                                                                    }}
                                                                    className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${safeParseColumns(block.content).length === num
                                                                            ? 'bg-blue-600 text-white border-blue-600'
                                                                            : 'bg-white text-slate-600 hover:bg-slate-50'
                                                                        }`}
                                                                >
                                                                    {num} Columns
                                                                </button>
                                                            ))}
                                                        </div>
                                                        {safeParseColumns(block.content).map((colText, idx) => (
                                                            <textarea
                                                                key={idx}
                                                                className="w-full p-2 border rounded text-sm mb-2 focus:ring-2 focus:ring-blue-400 outline-none"
                                                                placeholder={`Column ${idx + 1} content...`}
                                                                value={colText}
                                                                onChange={(e) => {
                                                                    const updated = [...safeParseColumns(block.content)];
                                                                    updated[idx] = e.target.value;
                                                                    onUpdateContent(block.id, JSON.stringify(updated));
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                ) : block.type === 'button' ? (
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Button Text</label>
                                                            <input
                                                                type="text"
                                                                className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                                                                value={(() => {
                                                                    try { return JSON.parse(block.content).label }
                                                                    catch { return block.content }
                                                                })()}
                                                                onChange={(e) => {
                                                                    let data = { label: e.target.value, url: 'https://' };
                                                                    try { data = { ...JSON.parse(block.content), label: e.target.value }; } catch (err) { }
                                                                    onUpdateContent(block.id, JSON.stringify(data));
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Link URL</label>
                                                            <input
                                                                type="text"
                                                                placeholder="https://example.com"
                                                                className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                                                                value={(() => {
                                                                    try { return JSON.parse(block.content).url }
                                                                    catch { return '' }
                                                                })()}
                                                                onChange={(e) => {
                                                                    let data = { label: 'Click Here', url: e.target.value };
                                                                    try { data = { ...JSON.parse(block.content), url: e.target.value }; } catch (err) { }
                                                                    onUpdateContent(block.id, JSON.stringify(data));
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* UNIVERSAL TEXTAREA FOR TEXT, IMAGE URLS, VIDEOS */
                                                    <textarea
                                                        autoFocus
                                                        className="w-full p-2 border rounded text-sm bg-white focus:ring-2 focus:ring-blue-400 outline-none"
                                                        rows={block.type === 'text' ? 5 : 2}
                                                        value={block.content}
                                                        onChange={(e) => onUpdateContent(block.id, e.target.value)}
                                                        placeholder={`Enter ${block.type} ${block.type === 'image' || block.type === 'video' ? 'URL' : 'content'}...`}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            /* NON-EDITING STATE (The Draggable Block) */
                                            <BlockDraggable
                                                block={block}
                                                onEdit={() => setEditingBlockId(block.id)}
                                                onDelete={() => handleDeleteBlock(block.id)}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
};