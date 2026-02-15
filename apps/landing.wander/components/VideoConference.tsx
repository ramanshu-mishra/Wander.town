"use client";

interface VideoConferenceProps {
  /** Optional video source for the main area (e.g. promo video); if not set, shows placeholder grid */
  videoSrc?: string;
  className?: string;
}

const PARTICIPANTS = [
  { name: "Natasha", gradient: "from-amber-900/40 to-stone-800" },
  { name: "Cameron", gradient: "from-sky-900/50 to-slate-800" },
  { name: "Scott", gradient: "from-emerald-900/40 to-zinc-800" },
  { name: "Melodie", gradient: "from-amber-800/30 to-stone-900" },
  { name: "Eva", gradient: "from-indigo-900/40 to-slate-800" },
  { name: "Joshua", gradient: "from-blue-900/50 to-slate-800" },
];

export default function VideoConference({ videoSrc, className = "" }: VideoConferenceProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl bg-[#1a1a1e] border border-[#2d2d33] shadow-2xl ${className}`}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#25252a] border-b border-[#2d2d33]">
        <div className="flex items-center gap-2.5 text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className="text-sm font-medium">Design Review</span>
          <span className="text-red-500" title="Meeting locked">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
        </div>
        <div className="flex items-center gap-3 text-white/90">
          <button type="button" className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Share screen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Layout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" fillOpacity="0.3" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Grid view">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="5" height="5" rx="0.5" />
              <rect x="10" y="3" width="5" height="5" rx="0.5" />
              <rect x="17" y="3" width="5" height="5" rx="0.5" />
              <rect x="3" y="10" width="5" height="5" rx="0.5" />
              <rect x="10" y="10" width="5" height="5" rx="0.5" />
              <rect x="17" y="10" width="5" height="5" rx="0.5" />
            </svg>
          </button>
          <button type="button" className="p-1.5 rounded hover:bg-white/10 transition-colors" title="More options">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content: video or 2x3 grid */}
      <div className="relative aspect-video bg-[#0f0f12] min-h-[280px]">
        {videoSrc ? (
          <video
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            playsInline
            muted
          />
        ) : (
          <div className="absolute inset-0 p-2 grid grid-cols-3 grid-rows-2 gap-1.5">
            {PARTICIPANTS.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-lg border border-white/20 bg-gradient-to-br ${p.gradient} overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1.5">
                  <span className="text-white text-xs font-medium">{p.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <footer className="flex items-center justify-between px-4 py-3 bg-[#25252a] border-t border-[#2d2d33]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-medium">
            You
          </div>
          <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/90 transition-colors" title="Music">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13M9 9l12-2" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </button>
          <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/90 transition-colors" title="More">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="6" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="18" r="1.5" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors" title="Microphone">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
            </svg>
          </button>
          <button type="button" className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors" title="Camera">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </button>
          <button type="button" className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors" title="Raise hand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l3 3v6M9 12h3M6 9c0-2 1.5-4 3-4s3 2 3 4M9 9V6M9 6c0-1 .5-2 1.5-2s1.5 1 1.5 2" />
            </svg>
          </button>
          <button type="button" className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors" title="Reactions">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
            </svg>
          </button>
          <button type="button" className="p-2.5 rounded-full hover:bg-white/10 text-white transition-colors" title="Share">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M12 17v-6M9 14l3-3 3 3" />
            </svg>
          </button>
          <button type="button" className="p-2.5 rounded-full hover:bg-red-600/90 text-white transition-colors" title="Leave call">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/90 transition-colors" title="Info">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
          <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/90 transition-colors" title="Participants">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </button>
          <button type="button" className="p-2 rounded-full hover:bg-white/10 text-white/90 transition-colors" title="Chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
