import * as React from "react";
import { Logo } from "./hero-section";

interface MobileHeaderProps {
  className?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ className }) => {
  return (
    <div className={`lg:hidden flex items-center gap-3 text-primary mb-12 justify-center ${className}`}>
      <Logo className="size-8" />
      <span className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
        QEFAS
      </span>
    </div>
  );
};

export { MobileHeader };