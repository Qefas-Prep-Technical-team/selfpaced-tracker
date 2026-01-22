import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

const toastVariants = cva(
  "p-4 rounded-lg flex items-center gap-3 border",
  {
    variants: {
      variant: {
        success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
        error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
        warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description: string;
  onClose?: () => void;
  showClose?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  variant = "info",
  title,
  description,
  onClose,
  showClose = false,
  className,
  ...props
}) => {
  const Icon = iconMap[variant || "info"];

  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      <Icon
        className={cn("h-5 w-5", {
          "text-green-600 dark:text-green-400": variant === "success",
          "text-red-600 dark:text-red-400": variant === "error",
          "text-yellow-600 dark:text-yellow-400": variant === "warning",
          "text-blue-600 dark:text-blue-400": variant === "info",
        })}
      />
      <div className="flex-1">
        {title && (
          <p
            className={cn("text-sm font-medium", {
              "text-green-800 dark:text-green-300": variant === "success",
              "text-red-800 dark:text-red-300": variant === "error",
              "text-yellow-800 dark:text-yellow-300": variant === "warning",
              "text-blue-800 dark:text-blue-300": variant === "info",
            })}
          >
            {title}
          </p>
        )}
        <p
          className={cn("text-sm", {
            "text-green-700 dark:text-green-400/80": variant === "success",
            "text-red-700 dark:text-red-400/80": variant === "error",
            "text-yellow-700 dark:text-yellow-400/80": variant === "warning",
            "text-blue-700 dark:text-blue-400/80": variant === "info",
          })}
        >
          {description}
        </p>
      </div>
      {showClose && onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export { Toast };