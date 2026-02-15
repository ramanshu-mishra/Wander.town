import FeatureCard from "./FeatureCard";

function SimplifyViewImage() {
  const labels = ["COWORK", "R&D", "PRODUCT", "GTM", "DESIGN", "NOOK", "ENG", "SOCIAL", "HR"];
  return (
    <div className="w-full h-full p-3 bg-[#1a1a1e] flex flex-col gap-1.5">
      <div className="grid grid-cols-3 gap-1 flex-1 text-[8px] font-semibold text-white/70 uppercase">
        {labels.map((l) => (
          <div key={l} className="rounded bg-white/10 flex items-center justify-center border border-white/10">
            {l}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-4 h-4 rounded-full bg-[#2D2D44] border border-white/20" />
        ))}
      </div>
    </div>
  );
}

function ControlHearImage() {
  return (
    <div className="w-full h-full p-4 bg-gradient-to-b from-emerald-900/40 to-emerald-800/30 flex items-center justify-center">
      <div className="rounded-xl bg-[#1a1a1e]/95 border border-white/10 p-4 shadow-xl max-w-[90%]">
        <p className="text-white/90 text-xs mb-3">Som & Daniel started talking nearby</p>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6M12 19v4M8 23h8" />
            </svg>
            Listen in
          </button>
          <button type="button" className="flex items-center gap-1.5 rounded-lg bg-[#4C67F7] px-2.5 py-1.5 text-xs text-white">
            Join
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function SetAvailabilityImage() {
  return (
    <div className="w-full h-full p-4 bg-[#1a1a1e] flex flex-col items-center justify-center gap-4">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full border-2 border-[#3C8D5F] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#3C8D5F]" />
          </div>
          <span className="text-[10px] text-white/80">Active</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6M12 19v4M8 23h8" />
            </svg>
          </div>
          <span className="text-[10px] text-white/80">Busy</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white/50" />
          </div>
          <span className="text-[10px] text-white/80">Away</span>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-[#2d2d33] px-3 py-2 text-xs text-white/90">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
        Deep focus until 12:30
      </div>
    </div>
  );
}

export default function MinimizeDistractionsSection() {
  return (
    <section className="px-6 py-16 lg:py-24 bg-[#F7F6F3]">
      <div className="max-w-6xl mx-auto">
        {/* Top CTA */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className="rounded-xl bg-[#2D2D44] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3d3d52] transition-colors"
          >
            Learn more about the virtual office
          </button>
        </div>

        {/* Busy status pill */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1.5 text-xs font-medium text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6M12 19v4M8 23h8" />
            </svg>
            Busy
          </span>
        </div>

        {/* Title and description */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#2D2D44] tracking-tight mb-4">
            Minimize distractions
          </h2>
          <p className="text-lg text-[#5B5B6D] max-w-2xl mx-auto">
            You decide who gets your attention. Control what you see and hear, and show others when you&apos;re busy.
          </p>
        </div>

        {/* Three feature cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard
            image={<SimplifyViewImage />}
            title="Simplify Your View"
            description="Switch to Simplified View to focus on people rather than details, and stay connected with Mini Mode even when using different apps."
          />
          <FeatureCard
            image={<ControlHearImage />}
            title="Control What You Hear"
            description="You're muted by default and hear public conversations only if you choose. You have full control over what you hear and who can hear you."
          />
          <FeatureCard
            image={<SetAvailabilityImage />}
            title="Set Your Availability"
            description="Let your team know when you're free or deep in focus mode. They'll have the context they need to reach out at the right time."
          />
        </div>
      </div>
    </section>
  );
}
