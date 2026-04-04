"use client";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationBarProps) {
  // THE MATH: Calculates exactly which numbers and "..." to show
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  // Don't render anything if there's only 1 page
  if (totalPages <= 1) return null;

  return (
    // Outer wrapper for spacing
    <div className="flex justify-center w-full mt-8">
      {/* THE GLASSMORPHISM TRACK (Matches CaseToggle exactly) */}
      <div className="flex items-center space-x-1 bg-white/[0.02] backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-lg">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/5 border border-transparent transition-all duration-300 ease-out disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* THE PAGE NUMBERS */}
        {pages.map((p, index) => {
          if (p === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-10 h-10 text-white/40 font-bold text-sm tracking-wide"
              >
                ...
              </span>
            );
          }

          const isCurrent = p === currentPage;

          return (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`
                flex items-center justify-center
                w-10 h-10 
                rounded-xl 
                text-sm 
                font-bold 
                tracking-wide
                transition-all 
                duration-300 
                ease-out
                ${
                  isCurrent
                    ? "bg-[#fb6a71]/20 text-[#fb6a71] shadow-[0_0_20px_rgba(251,106,113,0.15)] border border-[#fb6a71]/30"
                    : "text-white/40 hover:text-white/90 hover:bg-white/5 border border-transparent"
                }
              `}
            >
              {p}
            </button>
          );
        })}

        {/* NEXT BUTTON */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/5 border border-transparent transition-all duration-300 ease-out disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
