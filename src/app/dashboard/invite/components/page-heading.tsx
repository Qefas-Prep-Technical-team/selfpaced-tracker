import * as React from "react";
import { cn } from "@/lib/utils";

import { User as PersonAdd } from "lucide-react";
import { Button } from "./ui/button";

interface PageHeadingProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
}

const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  description,
  action,
  children,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-base">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          leftIcon={action.icon || <PersonAdd className="h-5 w-5" />}
          className={"cursor-pointer"}
        >
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
};

export { PageHeading };