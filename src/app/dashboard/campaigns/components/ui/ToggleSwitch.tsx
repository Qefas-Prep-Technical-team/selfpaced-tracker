import React from 'react';
import * as Switch from '@radix-ui/react-switch';

interface ToggleSwitchProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    enabled,
    onToggle,
    label,
    description,
    disabled = false,
    size = 'md',
}) => {
    const sizeClasses = {
        sm: 'w-10 h-5',
        md: 'w-11 h-6',
        lg: 'w-14 h-7',
    };

    const thumbSizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <div className="flex items-center justify-between">
            {(label || description) && (
                <div className="flex-1">
                    {label && <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
                    {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
                </div>
            )}

            <Switch.Root
                checked={enabled}
                onCheckedChange={onToggle}
                disabled={disabled}
                className={`${sizeClasses[size]} bg-slate-300 dark:bg-slate-600 rounded-full relative data-[state=checked]:bg-primary outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                <Switch.Thumb
                    className={`${thumbSizeClasses[size]} block bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]`}
                />
            </Switch.Root>
        </div>
    );
};