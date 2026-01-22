"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleGroupOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleGroupProps {
  options: ToggleGroupOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 py-2 text-xs font-medium rounded-md transition-all",
            value === option.value
              ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          )}
        >
          {option.icon && <span className="mr-2">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export { ToggleGroup };