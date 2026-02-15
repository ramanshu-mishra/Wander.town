import { type ReactNode } from "react";

interface FeatureCardProps {
  image: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ image, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-[#EBEBEB] shadow-sm overflow-hidden flex flex-col">
      <div className="aspect-video bg-[#F5F5F4] flex items-center justify-center min-h-[180px]">
        {image}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#2D2D44] mb-2">{title}</h3>
        <p className="text-[#5B5B6D] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
