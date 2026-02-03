import React from 'react';
import { Download, Plus, Filter, Calendar } from 'lucide-react';

interface ActionButton {
    label: string;
    onClick: () => void;
    icon?: 'download' | 'plus' | 'filter' | 'calendar' | string;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ActionButton[];
    children?: React.ReactNode;
}

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'download':
            return <Download className="w-4 h-4" />;
        case 'plus':
            return <Plus className="w-4 h-4" />;
        case 'filter':
            return <Filter className="w-4 h-4" />;
        case 'calendar':
            return <Calendar className="w-4 h-4" />;
        default:
            return null;
    }
};

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    actions = [],
    children,
}) => {
    return (
        <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-[#4c669a] dark:text-slate-400 text-sm md:text-base max-w-2xl">
                        {description}
                    </p>
                )}
            </div>

            {(actions.length > 0 || children) && (
                <div className="flex gap-3">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${action.variant === 'primary'
                                    ? 'bg-primary text-white hover:bg-blue-700'
                                    : action.variant === 'outline'
                                        ? 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {action.icon && getIcon(action.icon)}
                            {action.label}
                        </button>
                    ))}
                    {children}
                </div>
            )}
        </div>
    );
};