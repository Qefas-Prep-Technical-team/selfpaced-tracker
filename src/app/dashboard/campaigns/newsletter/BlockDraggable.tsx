'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Image as ImageIcon, MousePointer, Type, Video, Divide, Columns } from 'lucide-react';

interface BlockDraggableProps {
    block: {
        id: string;
        type: string;
        content: string;
    };
    onEdit: () => void;
    onDelete: () => void;
}

const getBlockIcon = (type: string) => {
    switch (type) {
        case 'text':
            return <Type className="w-4 h-4" />;
        case 'image':
            return <ImageIcon className="w-4 h-4" />;
        case 'button':
            return <MousePointer className="w-4 h-4" />;
        case 'video':
            return <Video className="w-4 h-4" />;
        case 'divider':
            return <Divide className="w-4 h-4" />;
        case 'columns':
            return <Columns className="w-4 h-4" />;
        default:
            return null;
    }
};

const getBlockLabel = (type: string) => {
    switch (type) {
        case 'text':
            return 'Text Block';
        case 'image':
            return 'Image Block';
        case 'button':
            return 'Button Block';
        case 'video':
            return 'Video Block';
        case 'divider':
            return 'Divider Block';
        case 'columns':
            return 'Columns Block';
        default:
            return 'Block';
    }
};

export const BlockDraggable: React.FC<BlockDraggableProps> = ({ block, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg group ${isDragging ? 'shadow-lg z-10' : ''
                }`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-400"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-3">
                <div className="text-primary">
                    {getBlockIcon(block.type)}
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        {getBlockLabel(block.type)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[200px]">
                        {block.content}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={onEdit}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                    title="Edit block"
                >
                    <Edit2 className="w-4 h-4 text-slate-400" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    title="Delete block"
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </button>
            </div>
        </div>
    );
};