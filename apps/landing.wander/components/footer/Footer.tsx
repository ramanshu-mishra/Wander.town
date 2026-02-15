const FOOTER_BG = "#161922";

const PRODUCT_LINKS = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Download", href: "#" },
  { label: "What's new", href: "#" },
];

const RESOURCES_LINKS = [
  { label: "Testimonials", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Help center", href: "#" },
  { label: "Status", href: "#" },
];

const COMPANY_LINKS = [
  { label: "Careers", href: "#" },
  { label: "Contact sales", href: "#" },
  { label: "Privacy & security", href: "#" },
  { label: "Legal policies", href: "#" },
];

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-white font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a href={href} className="text-white/80 text-sm hover:text-white transition-colors">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* CTA section */}
      <div className="px-6 py-16 lg:py-20 text-center" style={{ backgroundColor: FOOTER_BG }}>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
          Make remote work feel less remote
        </h2>
        <p className="text-white/80 text-lg mb-8">
          Join 10,000+ teams who switched to natural collaboration.
        </p>
        <button
          type="button"
          className="rounded-xl bg-[#4C67F7] px-8 py-3.5 text-base font-semibold text-white hover:bg-[#3d56e6] transition-colors"
        >
          Start free 30-day trial
        </button>
      </div>

      {/* Separator */}
      <div className="h-px bg-white/10" />

      {/* Main footer content */}
      <div className="px-6 py-12 lg:py-16" style={{ backgroundColor: FOOTER_BG }}>
        <div className="max-w-6xl mx-auto">
          {/* Top row: brand + nav + events box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
            {/* Brand + social */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <rect x="3" y="3" width="6" height="6" rx="1" />
                  <rect x="15" y="3" width="6" height="6" rx="1" />
                  <rect x="3" y="15" width="6" height="6" rx="1" />
                  <rect x="15" y="15" width="6" height="6" rx="1" />
                </svg>
                <span className="text-xl font-semibold text-white">Gather</span>
              </div>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Nav columns */}
            <div className="lg:col-span-4 grid grid-cols-3 gap-6 lg:gap-8">
              <LinkColumn title="Product" links={PRODUCT_LINKS} />
              <LinkColumn title="Resources" links={RESOURCES_LINKS} />
              <LinkColumn title="Company" links={COMPANY_LINKS} />
            </div>

            {/* Gather Events box */}
            <div className="lg:col-span-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <path d="M9 22V12h6v10" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">Looking for the original Gather Events?</h4>
                    <p className="text-white/70 text-sm mb-4">Log in or create a new event space.</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 transition-colors"
                      >
                        Log in
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-white text-[#161922] text-sm font-medium px-4 py-2 hover:bg-white/90 transition-colors"
                      >
                        Create new
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Language selector */}
          <div className="mb-6">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              English
            </button>
          </div>

          {/* Legal disclaimer */}
          <p className="text-white/50 text-xs leading-relaxed max-w-4xl mb-6">
            *All references to other companies, systems, software, and/or platforms are for illustrative purposes
            only and do not imply any affiliation with Gather. Gather assumes no liability for a customer&apos;s use
            of another company&apos;s product, system, software, and/or platform, whether cloud-based or otherwise.
          </p>

          {/* Copyright */}
          <p className="text-white/50 text-xs">© 2025 Gather Presence Inc.</p>
        </div>
      </div>
    </footer>
  );
}
