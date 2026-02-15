import { type ReactNode } from "react";

interface ComparisonPanelProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function ComparisonPanel({ icon, title, children }: ComparisonPanelProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#EBEBEB] shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 px-6 pt-6 pb-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F4] text-[#2D2D44]">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-[#2D2D44]">{title}</h3>
      </div>
      <div className="px-6 pb-6 flex flex-col gap-4 flex-1">
        {children}
      </div>
    </div>
  );
}
