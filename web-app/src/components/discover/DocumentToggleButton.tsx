"use client";
import { Filter } from "@/src/types/documents";
import { useState } from "react";

interface ToggleButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function ToggleButton({ label, selected, onClick }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative 
        px-8 py-3 
        rounded-xl 
        text-sm md:text-base
        font-bold 
        tracking-wide
        transition-all 
        duration-300 
        ease-out
        ${
          selected
            ? "bg-[#fb6a71]/20 text-[#fb6a71] shadow-[0_0_20px_rgba(251,106,113,0.15)] border border-[#fb6a71]/30"
            : "text-white/40 hover:text-white/90 hover:bg-white/5 border border-transparent"
        }
      `}
    >
      {label}
    </button>
  );
}

interface CaseToggleProps {
  filters: Filter[];
  defaultActive?: string;
  onToggle?: (filter: Filter) => void | Promise<void>;
}

export default function CaseToggle({
  filters,
  defaultActive,
  onToggle,
}: CaseToggleProps) {
  const [activeFilter, setActiveFilter] = useState<string>(
    defaultActive || filters[0],
  );

  function handleToggle(filter: Filter) {
    setActiveFilter(filter);
    onToggle?.(filter);
  }

  return (
    // The Glassmorphism "Track" Container - NOW LEFT ALIGNED
    <div className="flex justify-start w-full mb-6">
      <div className="flex space-x-2 bg-white/[0.02] backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-lg">
        {filters.map((filter) => (
          <ToggleButton
            key={filter}
            label={filter}
            selected={activeFilter === filter}
            onClick={() => handleToggle(filter)}
          />
        ))}
      </div>
    </div>
  );
}
