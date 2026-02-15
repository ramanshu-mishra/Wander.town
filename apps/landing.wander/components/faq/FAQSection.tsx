"use client";

import { useState } from "react";
import FAQItem from "./FAQItem";

const DEFAULT_ITEMS = [
  {
    question: "Is this a new version of Gather?",
    answer:
      "Yes. This is Gather's next-generation workspace, designed to make remote collaboration feel more natural. You get the same reliability with a fresh experience built for how teams work today.",
  },
  {
    question: "How do I get started?",
    answer:
      "Sign up for a free 30-day trial. Create your space, invite your team, and start collaborating. No credit card required. You can explore all features and migrate at your own pace.",
  },
  {
    question: "What's included in the free 30-day trial?",
    answer:
      "Full access to the virtual office, meetings, chat, and all premium features. Invite your whole team and use the workspace as you would on a paid plan. No feature limits during the trial.",
  },
  {
    question: "Can I still use Gather 1.0?",
    answer:
      "Yes. Gather 1.0 remains available for existing customers. You can switch to the new workspace when you're ready. We'll share migration guides and support to make the transition smooth.",
  },
];

interface FAQSectionProps {
  items?: { question: string; answer: string }[];
  helpCenterHref?: string;
}

export default function FAQSection({ items = DEFAULT_ITEMS, helpCenterHref = "#" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-6 py-16 lg:py-24 bg-[#F7F6F3]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F7ED] border border-[#3C8D5F]/30 px-3 py-1.5 text-sm font-medium text-[#2D2D44] mb-4">
            <span className="h-2 w-2 rounded-full bg-[#3C8D5F]" />
            FAQs
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2D2D44] tracking-tight">
            All you need to know
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <FAQItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="my-6 border-t border-[#EBEBEB]" />

        {/* CTA */}
        <div className="rounded-xl bg-white border border-[#EBEBEB] shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-[#2D2D44] font-medium">Still have questions?</p>
          <a
            href={helpCenterHref}
            className="inline-flex justify-center rounded-lg border border-[#EBEBEB] bg-white px-4 py-2.5 text-sm font-medium text-[#2D2D44] hover:bg-[#F5F5F4] transition-colors shrink-0"
          >
            Visit Help Center
          </a>
        </div>
      </div>
    </section>
  );
}
