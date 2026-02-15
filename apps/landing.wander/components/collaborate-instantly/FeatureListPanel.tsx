import FeatureListItem from "./FeatureListItem";

const FEATURES = [
  {
    title: "See who's free",
    description: "Instantly know who's free, focused, or in meetings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
    ),
  },
  {
    title: "Wave them over",
    description: undefined,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 12c0-2 1.5-4 3-4s3 2 3 4v7M10 9V6M10 6c0-1 .5-2 1.5-2s1.5 1 1.5 2M14 6v3M14 6c0-1 .5-2 1.5-2s1.5 1 1.5 2" />
      </svg>
    ),
  },
  {
    title: "Hear nearby conversations",
    description: undefined,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    title: "Join in a click",
    description: undefined,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l1.35 4.05L17.5 8.5l-4.15 1.35L12 14l-1.35-4.15L6.5 8.5l4.15-1.35L12 3z" />
        <path d="M5 16l1.5 4.5L11 22l-4.5-1.5L5 16z" />
        <path d="M19 5l.75 2.25L22 8l-2.25.75L19 11l-.75-2.25L16 8l2.25-.75L19 5z" />
      </svg>
    ),
  },
];

export default function FeatureListPanel() {
  return (
    <div className="rounded-2xl bg-white border border-[#EBEBEB] shadow-sm p-6 lg:p-8 flex flex-col gap-6">
      {FEATURES.map((f) => (
        <FeatureListItem key={f.title} icon={f.icon} title={f.title} description={f.description} />
      ))}
      <button
        type="button"
        className="mt-2 w-full rounded-xl bg-[#4C67F7] py-3.5 text-base font-semibold text-white hover:bg-[#3d56e6] transition-colors"
      >
        Start free 30-day trial
      </button>
    </div>
  );
}
