"use client";

interface AvatarProps {
  label: string;
  status?: "free" | "busy" | "talking";
  className?: string;
}

function Avatar({ label, status = "free", className = "" }: AvatarProps) {
  const statusColor = status === "free" ? "bg-[#3C8D5F]" : status === "busy" ? "bg-red-500" : "bg-[#4C67F7]";
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="relative">
        <div className="h-8 w-8 rounded-full bg-[#2D2D44] flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow">
          {label.split(",")[0].trim().slice(0, 2).toUpperCase()}
        </div>
        {status && (
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${statusColor}`}
          />
        )}
      </div>
      <span className="text-[10px] font-medium text-[#2D2D44] leading-tight text-center max-w-[60px]">
        {label}
      </span>
    </div>
  );
}

export default function VirtualOfficeMap() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#EBEBEB] bg-[#F5F5F4] shadow-sm aspect-[4/3] min-h-[320px] max-w-full">
      {/* Pixel-art style office: grid of rooms */}
      <div
        className="h-full w-full grid gap-px p-2"
        style={{
          gridTemplateColumns: "1fr 1.2fr 1fr",
          gridTemplateRows: "auto 1fr 1fr",
        }}
      >
        {/* Row 1: Outdoor / Product label */}
        <div className="rounded bg-[#E6F7ED] flex items-center justify-center min-h-[48px]">
          <Avatar label="You" status="free" className="scale-90" />
        </div>
        <div className="rounded bg-[#d4e8f7] flex items-center justify-center text-xs font-semibold text-[#2D2D44]">
          Product team
        </div>
        <div className="rounded bg-[#f0e6d4]" />
        {/* Row 2: Product area + lounge */}
        <div className="rounded bg-[#d4e8f7] flex items-end justify-around pb-2 pt-1 gap-1">
          <Avatar label="Brad" status="free" />
          <Avatar label="Alison" status="busy" />
        </div>
        <div className="rounded bg-[#e8e0d4] flex items-center justify-center">
          <div className="flex gap-2 flex-wrap justify-center items-center p-2">
            <div className="h-6 w-10 rounded bg-amber-200" title="sofa" />
            <div className="h-4 w-4 rounded-full bg-amber-300" title="table" />
          </div>
        </div>
        <div className="rounded bg-[#d4e8f7] flex items-center justify-center gap-1">
          <div className="h-8 w-12 rounded bg-emerald-400" title="ping-pong" />
        </div>
        {/* Row 3: CX + lounge */}
        <div className="rounded bg-[#E6F7ED] flex items-center justify-center min-h-[48px]">
          <span className="text-[10px] text-[#5B5B6D]">Outdoor</span>
        </div>
        <div className="rounded bg-[#e0e0dc] flex items-end justify-center pb-2 pt-1">
          <Avatar label="Jinen, Steven" status="talking" />
        </div>
        <div className="rounded bg-[#e0e0dc] flex items-end justify-center pb-2 pt-1">
          <Avatar label="Som, Morgan" status="talking" />
        </div>
      </div>
    </div>
  );
}
