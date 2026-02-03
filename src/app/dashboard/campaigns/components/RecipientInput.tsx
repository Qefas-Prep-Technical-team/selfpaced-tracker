import React, { useState } from 'react';
import { Users, Upload, Info } from 'lucide-react';

interface RecipientInputProps {
    initialValue?: string;
    onRecipientsChange?: (recipients: string[], validCount: number, invalidCount: number) => void;
    onUploadCSV?: () => void;
    placeholder?: string;
}

export const RecipientInput: React.FC<RecipientInputProps> = ({
    initialValue = '',
    onRecipientsChange,
    onUploadCSV,
    placeholder = 'Enter phone numbers separated by commas (e.g., 08030000000, +234810...)',
}) => {
    const [value, setValue] = useState(initialValue);
    const [validCount, setValidCount] = useState(42);
    const [invalidCount, setInvalidCount] = useState(1);

    const validatePhoneNumbers = (text: string) => {
        const numbers = text
            .split(',')
            .map((num) => num.trim())
            .filter((num) => num.length > 0);

        // Simple validation for Nigerian numbers
        const valid = numbers.filter((num) =>
            /^(?:\+234|0)[789]\d{9}$/.test(num)
        ).length;

        const invalid = numbers.length - valid;

        setValidCount(valid);
        setInvalidCount(invalid);

        onRecipientsChange?.(numbers, valid, invalid);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        validatePhoneNumbers(newValue);
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Recipients
                </h3>
                <button
                    onClick={onUploadCSV}
                    className="text-primary text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                    <Upload className="w-3 h-3" />
                    Upload CSV
                </button>
            </div>

            <div className="space-y-3">
                <textarea
                    value={value}
                    onChange={handleChange}
                    className="form-textarea w-full h-32 rounded-lg border-slate-200 dark:border-slate-800 dark:bg-slate-950 focus:border-primary focus:ring-primary text-sm font-mono"
                    placeholder={placeholder}
                />

                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-tight">
                        Nigerian numbers will be automatically formatted to E.164 (+234) for delivery.
                    </p>
                </div>

                <div className="flex justify-between text-xs font-medium text-[#4c669a]">
                    <span>
                        Valid numbers:{' '}
                        <span className="text-green-600 font-bold">{validCount}</span>
                    </span>
                    <span>
                        Invalid:{' '}
                        <span className="text-red-500 font-bold">{invalidCount}</span>
                    </span>
                </div>
            </div>
        </div>
    );
};