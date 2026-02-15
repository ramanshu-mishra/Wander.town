"use client";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="rounded-xl bg-white border border-[#EBEBEB] shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-[#2D2D44]">{question}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#DDD6F2] text-[#4A3B8C] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-4 pt-0">
          <p className="text-[#5B5B6D] text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
