import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link2, Copy } from "lucide-react";

interface GeneratedLinkProps {
  link: string;
  title?: string;
  description?: string;
  onCopy?: () => void;
  className?: string;
}

const GeneratedLink: React.FC<GeneratedLinkProps> = ({
  link,
  title = "Invite Link Generated",
  description = "Share this unique link with the recipient.",
  onCopy,
  className,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    onCopy?.();
  };

  return (
    <div
      className={cn(
        "bg-primary/5 dark:bg-primary/10 border-2 border-dashed border-primary/30 rounded-xl p-6 space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Link2 className="h-5 w-5 text-primary" />
        <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          {title}
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      <div className="flex items-stretch gap-2">
        <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300 font-mono truncate">
          {link}
        </div>
        <Button
          onClick={handleCopy}
          size="icon"
          className="shadow-md active:scale-95"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export { GeneratedLink };