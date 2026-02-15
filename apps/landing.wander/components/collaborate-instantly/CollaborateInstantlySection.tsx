import FeatureListPanel from "./FeatureListPanel";
import VirtualOfficeMap from "./VirtualOfficeMap";

export default function CollaborateInstantlySection() {
  return (
    <section className="px-6 py-16 lg:py-24 bg-[#F7F6F3]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block rounded-lg bg-[#E6F7ED] border border-[#3C8D5F]/30 px-3 py-1.5 text-sm font-medium text-[#3C8D5F] mb-4">
            • Virtual Workspace
          </span>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-[#2D2D44] tracking-tight mb-4">
            Collaborate instantly
          </h2>
          <p className="text-lg text-[#5B5B6D] max-w-2xl mx-auto">
            Forget scheduling and meeting links. Look around your virtual office to find who&apos;s free and start
            talking in seconds.
          </p>
        </div>

        {/* Two columns: feature list (left) + virtual office map (right) */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <FeatureListPanel />
          <VirtualOfficeMap />
        </div>
      </div>
    </section>
  );
}
