import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark/50 border border-border-light dark:border-border-dark shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {title}
        </p>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-foreground text-3xl font-bold">{value}</p>
        {trend && (
          <p
            className={cn(
              "text-sm font-bold flex items-center",
              trend.isPositive ? "text-green-600" : "text-red-500"
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {trend.value}%
            {trend.label && <span className="ml-1 font-normal">{trend.label}</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export { StatCard };