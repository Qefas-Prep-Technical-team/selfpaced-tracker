import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
        primary:
          "bg-primary/10 text-primary",
        success:
          "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
        warning:
          "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        error:
          "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
        expired:
          "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotClassName?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, dot, dotClassName, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant }), className)}
        ref={ref}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "size-1.5 rounded-full mr-1.5",
              {
                "bg-primary": variant === "primary",
                "bg-green-600": variant === "success",
                "bg-amber-600": variant === "warning",
                "bg-red-600": variant === "error",
                "bg-gray-400": variant === "expired",
              },
              dotClassName
            )}
          />
        )}
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };