const EVENTS = [
  { label: "Daily Standup", start: 0, duration: 50, highlight: false },
  { label: "Coffee Call with Marco", start: 75, duration: 40, highlight: true },
  { label: "Checkin with Devin", start: 130, duration: 40, highlight: false },
];
const TOTAL_MINUTES = 240; // 4 hours

export default function ScheduleStrip() {
  return (
    <div className="flex gap-3 mt-2">
      <div className="flex flex-col justify-between text-[10px] text-[#5B5B6D]/80 font-medium pt-0.5 pb-6">
        <span>09:00</span>
        <span>10:00</span>
        <span>11:00</span>
        <span>12:00</span>
      </div>
      <div className="relative flex-1 min-h-[120px]">
        <div className="absolute inset-0 flex flex-col gap-1">
          {EVENTS.map((ev) => (
            <div
              key={ev.label}
              className={`rounded-lg px-3 py-2 text-xs font-medium flex items-center ${
                ev.highlight ? "bg-[#d4e8f7] text-[#2D2D44]" : "bg-[#F5F5F4] text-[#5B5B6D]"
              }`}
              style={{
                height: `${(ev.duration / TOTAL_MINUTES) * 100}%`,
                minHeight: "36px",
              }}
            >
              {ev.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
