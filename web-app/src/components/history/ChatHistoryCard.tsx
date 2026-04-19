"use client";

// Optional: A quick helper to make your timestamps look clean (e.g., "OCT 24, 2025")
function formatDate(dateString: string | Date) {
  return new Date(dateString)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

type ChatHistoryCardProps = {
  title: string;
  firstMessage: string;
  date: string | Date;
  onNavigate?: () => void; // Passed down from the parent (e.g., router.push)
};

export default function ChatHistoryCard({
  title,
  firstMessage,
  date,
  onNavigate,
}: ChatHistoryCardProps) {
  return (
    <div
      onClick={onNavigate}
      // Matches your exact CaseCard glassmorphism and hover physics!
      // Added cursor-pointer so the whole card feels interactive
      className="flex flex-col gap-4 w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl transition-all hover:border-[#fb6a71]/40 hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(251,106,113,0.1)] cursor-pointer"
    >
      {/* Header Section */}
      <div className="border-b border-white/10 pb-4 flex flex-col gap-1">
        {/* Date takes the place of the case prefix */}
        <span className="text-[#fb6a71] font-bold text-xs tracking-wider">
          {formatDate(date)}
        </span>
        <h3 className="text-white font-bold text-lg leading-snug line-clamp-1">
          {title}
        </h3>
      </div>

      {/* Message Preview Section */}
      <div className="flex flex-col gap-1 pt-2">
        <p className="text-white/80 text-sm line-clamp-3">
          {firstMessage || "Start a new conversation..."}
        </p>

        <button
          onClick={(e) => {
            // Prevent the card's onClick from firing twice if they click the button directly
            e.stopPropagation();
            if (onNavigate) onNavigate();
          }}
          className="text-[#fb6a71] text-xs font-bold self-start mt-2 hover:text-[#ff8f94] transition-colors focus:outline-none"
        >
          CONTINUE CHAT
        </button>
      </div>
    </div>
  );
}
