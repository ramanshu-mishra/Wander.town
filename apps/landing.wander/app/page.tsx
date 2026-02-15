import VideoConference from "@/components/VideoConference"
import { CollaborateInstantlySection } from "@/components/collaborate-instantly"
import { MinimizeDistractionsSection } from "@/components/minimize-distractions"
import { RemoteWorkSection } from "@/components/remote-work-comparison"
import { FAQSection } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] font-sans">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo icon - network/dots */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#2D2D44]">
            <circle cx="6" cy="6" r="2.5" fill="currentColor" />
            <circle cx="18" cy="6" r="2.5" fill="currentColor" />
            <circle cx="12" cy="14" r="2.5" fill="currentColor" />
            <path d="M8.2 7.5L10.5 12M15.8 7.5L13.5 12M12 11.5V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-semibold text-[#2D2D44]">Gather</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#DDD6F2] px-2.5 py-1 text-xs font-medium text-[#4A3B8C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3C8D5F]" />
            What&apos;s new
          </span>
        </div>
        <nav className="flex items-center gap-8 text-[#5B5B6D] text-[15px] font-medium">
          {/* Product with dropdown */}
          <div className="relative group">
            <a href="#" className="block py-2 hover:text-[#2D2D44]">Product</a>
            <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-150 z-50">
              <div className="rounded-xl bg-[#F5F5F4] shadow-lg border border-[#EBEBEB] p-2 w-[320px] grid grid-cols-2 gap-1">
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#2D2D44] hover:bg-white/80 text-sm font-medium">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#EBEBEB] text-[#5B5B6D]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                  </span>
                  Features
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#2D2D44] hover:bg-white/80 text-sm font-medium">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#EBEBEB] text-[#5B5B6D]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg>
                  </span>
                  Virtual Office
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#2D2D44] hover:bg-white/80 text-sm font-medium">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#EBEBEB] text-[#5B5B6D]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                  </span>
                  Virtual Meetings
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#2D2D44] hover:bg-white/80 text-sm font-medium">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#EBEBEB] text-[#5B5B6D]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="12" r="3" /><circle cx="16" cy="8" r="3" /><circle cx="16" cy="16" r="3" /><path d="M9.5 11.5L14.5 8.5M9.5 12.5L14.5 15.5" /></svg>
                  </span>
                  Compare Versions
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#2D2D44] hover:bg-white/80 text-sm font-medium">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#EBEBEB] text-[#5B5B6D]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  </span>
                  Download
                </a>
                <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[#2D2D44] hover:bg-white/80 text-sm font-medium">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#EBEBEB] text-[#5B5B6D]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.35 4.05L17.5 8.5l-4.15 1.35L12 14l-1.35-4.15L6.5 8.5l4.15-1.35L12 3z" /><path d="M5 16l1.5 4.5L11 22l-4.5-1.5L5 16z" /><path d="M19 5l.75 2.25L22 8l-2.25.75L19 11l-.75-2.25L16 8l2.25-.75L19 5z" /></svg>
                  </span>
                  What&apos;s New
                </a>
              </div>
            </div>
          </div>
          <a href="#" className="hover:text-[#2D2D44]">Pricing</a>
          {/* Resources with dropdown */}
          <div className="relative group">
            <a href="#" className="block py-2 hover:text-[#2D2D44]">Resources</a>
            <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-[opacity,visibility] duration-150 z-50">
              <div className="rounded-xl bg-white shadow-lg border border-[#EBEBEB] py-1 min-w-[200px]">
                <a href="#" className="group flex items-center gap-3 rounded-lg px-3 py-2.5 mx-1 text-[#2D2D44] hover:bg-[#F5F5F5] hover:text-[#6B5BAB] text-sm font-medium">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F4] text-[#5B5B6D] group-hover:bg-[#F0EDF7] group-hover:text-[#6B5BAB] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" /></svg>
                  </span>
                  Help Docs
                </a>
                <a href="#" className="group flex items-center gap-3 rounded-lg px-3 py-2.5 mx-1 text-[#2D2D44] hover:bg-[#F5F5F5] hover:text-[#6B5BAB] text-sm font-medium">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F4] text-[#5B5B6D] group-hover:bg-[#F0EDF7] group-hover:text-[#6B5BAB] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
                  </span>
                  Blog & Guides
                </a>
                <a href="#" className="group flex items-center gap-3 rounded-lg px-3 py-2.5 mx-1 text-[#2D2D44] hover:bg-[#F5F5F5] hover:text-[#6B5BAB] text-sm font-medium">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F4] text-[#5B5B6D] group-hover:bg-[#F0EDF7] group-hover:text-[#6B5BAB] transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><circle cx="9" cy="10" r="1" fill="currentColor" /><circle cx="12" cy="10" r="1" fill="currentColor" /><circle cx="15" cy="10" r="1" fill="currentColor" /></svg>
                  </span>
                  Testimonials
                </a>
              </div>
            </div>
          </div>
          <a href="#" className="hover:text-[#2D2D44]">Contact Sales</a>
        </nav>
        <div className="flex items-center gap-3">
          <button type="button" className="rounded-lg bg-[#EBEBEB] px-4 py-2.5 text-sm font-medium text-[#2D2D44] hover:bg-[#e0e0e0]">
            Login
          </button>
          <button type="button" className="rounded-lg bg-[#4A3B8C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3d2f73]">
            Get started
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center px-6 pt-16 pb-24 max-w-3xl mx-auto text-center">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full bg-[#EBEBEB] px-4 py-2.5 text-sm text-[#2D2D44] hover:bg-[#e0e0e0] mb-8"
        >
          Just shipped: Celebrate Lunar New Year with new objects
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2D44] leading-tight tracking-tight mb-6">
          A virtual workspace that feels refreshingly human
        </h1>
        <p className="text-lg md:text-xl text-[#5B5B6D] font-normal mb-10 max-w-2xl">
          Meet, chat, and work together like you&apos;re in person. No scheduling needed for quick interactions.
        </p>
        <button
          type="button"
          className="rounded-2xl bg-[#4C67F7] px-8 py-4 text-lg font-semibold text-white hover:bg-[#3d56e6] shadow-sm"
        >
          Create Your Space
        </button>
      </main>

      {/* Video / meeting demo */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <VideoConference className="w-full" />
      </section>

      <CollaborateInstantlySection />

      <MinimizeDistractionsSection />

      <RemoteWorkSection />

      <FAQSection />

      {/* Bottom feature pills */}
      <div className="flex flex-wrap justify-center gap-4 px-6 pb-16">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[#3C8D5F]/40 bg-[#E6F7ED] px-5 py-2.5 text-sm font-medium text-[#3C8D5F] hover:bg-[#d4f0e0]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Meetings
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[#3C8D5F]/40 bg-[#E6F7ED] px-5 py-2.5 text-sm font-medium text-[#3C8D5F] hover:bg-[#d4f0e0]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Chat
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-[#3C8D5F]/40 bg-[#E6F7ED] px-5 py-2.5 text-sm font-medium text-[#3C8D5F] hover:bg-[#d4f0e0]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Activity
        </button>
      </div>

      <Footer />
    </div>
  );
}
