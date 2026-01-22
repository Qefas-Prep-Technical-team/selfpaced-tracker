import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex items-center gap-3 rounded-xl border p-4",
  {
    variants: {
      variant: {
        default: "bg-primary/5 border-primary/20 text-primary",
        warning: "bg-amber-500/5 border-amber-500/20 text-amber-600",
        error: "bg-red-500/5 border-red-500/20 text-red-600",
        success: "bg-green-500/5 border-green-500/20 text-green-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon}
        <p className="text-sm font-medium">{children}</p>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert };