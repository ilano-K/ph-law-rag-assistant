"use client";

import { Document, Filter } from "@/src/types/documents";

function ContentDisplay({ content }: { content: string | null }) {
  if (!content) return null;

  return (
    <div className="flex flex-col gap-1">
      {/* Text is permanently clamped to 3 lines */}
      <p className="text-white/80 text-sm line-clamp-3">{content}</p>

      {/* Empty navigation hook, ready for next/navigation */}
      <button
        onClick={() => {
          // TODO: Navigate to the full case view using the Supabase document.id
          console.log("Placeholder: Will navigate to full view!");
        }}
        className="text-[#fb6a71] text-xs font-bold self-start mt-2 hover:text-[#ff8f94] transition-colors focus:outline-none"
      >
        READ MORE
      </button>
    </div>
  );
}
const contentMap: Record<Filter, (doc: Document) => string> = {
  Cases: (doc) => doc.case_digests?.[0]?.facts ?? "No digest",
  Acts: (doc) => doc.law_digests?.[0]?.key_provisions ?? "No law",
  "Republic Acts": (doc) => doc.law_digests?.[0]?.key_provisions ?? "No law",
};
// The Main Card expecting Supabase Data
export default function CaseCard({
  document,
  filter,
}: {
  document: Document;
  filter: Filter;
}) {
  return (
    <div className="flex flex-col gap-4 w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl transition-all hover:border-[#fb6a71]/40 hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(251,106,113,0.1)]">
      {/* From the Supabase 'documents' table */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-accent font-bold text-sm tracking-wide">
          {document.prefix} {document.document_number}
        </h2>
        <h3 className="text-white font-bold text-lg leading-snug">
          {document.title}
        </h3>
      </div>

      {/* From the Supabase 'case_digests' table */}
      <div className="flex flex-col gap-4 pt-2">
        {/* We now only pass the content, no title needed */}
        <ContentDisplay content={contentMap[filter](document)} />
      </div>
    </div>
  );
}
