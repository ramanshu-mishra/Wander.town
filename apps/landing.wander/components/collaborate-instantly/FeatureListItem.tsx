import { type ReactNode } from "react";

interface FeatureListItemProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export default function FeatureListItem({ icon, title, description }: FeatureListItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F4] text-[#2D2D44]">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-[#2D2D44]">{title}</h3>
        {description && <p className="mt-0.5 text-sm text-[#5B5B6D]">{description}</p>}
      </div>
    </div>
  );
}
