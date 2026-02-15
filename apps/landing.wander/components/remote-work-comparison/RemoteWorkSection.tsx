import ComparisonPanel from "./ComparisonPanel";
import ScheduleStrip from "./ScheduleStrip";
import VirtualOfficeScene from "./VirtualOfficeScene";

const TRADITIONAL_BULLETS = [
  "Another Zoom link",
  "Wait hours for Slack replies",
  "Exhausted from 'camera-on' all the time",
  "Disconnected from your team",
  "Static meeting links",
];

const GATHER_BULLETS = [
  <>Walk up and talk — no links required</>,
  <>See who&apos;s free <em>right now</em></>,
  <>Be present without being on camera</>,
  <>Feel the team&apos;s energy at a glance</>,
  <>A workspace that feels alive</>,
];

export default function RemoteWorkSection() {
  return (
    <section className="px-6 py-16 lg:py-24 bg-[#F7F6F3]">
      <div className="max-w-6xl mx-auto">
        {/* Tagline pill */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F7ED] border border-[#3C8D5F]/30 px-3 py-1.5 text-sm font-medium text-[#2D2D44]">
            <span className="h-2 w-2 rounded-full bg-[#3C8D5F]" />
            Remote work, reimagined
          </span>
        </div>

        {/* Heading and subtitle */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#2D2D44] tracking-tight mb-4">
            What if remote work felt less... remote?
          </h2>
          <p className="text-lg text-[#5B5B6D] max-w-2xl mx-auto">
            Gather makes remote work feel more natural and delightful
          </p>
        </div>

        {/* Two panels */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <ComparisonPanel
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            title="Traditional Collaboration Tools"
          >
            <ul className="space-y-2 text-sm text-[#5B5B6D]">
              {TRADITIONAL_BULLETS.map((item) => (
                <li key={String(item)} className="flex gap-2">
                  <span className="text-[#5B5B6D] mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <ScheduleStrip />
          </ComparisonPanel>

          <ComparisonPanel
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="2.5" />
                <circle cx="18" cy="6" r="2.5" />
                <circle cx="12" cy="14" r="2.5" />
                <path d="M8.2 7.5L10.5 12M15.8 7.5L13.5 12M12 11.5V14" strokeLinecap="round" />
              </svg>
            }
            title="Gather's Workspace"
          >
            <ul className="space-y-2 text-sm text-[#5B5B6D]">
              {GATHER_BULLETS.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#5B5B6D] mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <VirtualOfficeScene />
          </ComparisonPanel>
        </div>
      </div>
    </section>
  );
}
