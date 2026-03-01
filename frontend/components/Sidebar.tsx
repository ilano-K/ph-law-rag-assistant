import { Plus, History, Compass } from "lucide-react";

interface SidebarProps {
  onViewChange: (view: "chat" | "history" | "discover") => void;
}

export default function Sidebar({ onViewChange }: SidebarProps) {
  return (
    <div className="w-[260px] h-full bg-surface border border-border rounded-xl p-4 flex flex-col">
      {/* New Thread Button*/}
      <button
        onClick={() => onViewChange("chat")}
        className="flex items-center gap-2 text-accent border border-accent rounded-lg px-4 py-3 hover:bg-accent/10 transition-colors w-full"
      >
        <Plus size={20} />
        <span className="font-medium">New Conversation</span>
      </button>
      {/* Navigation Links */}
      <div className="flex flex-col gap-2 mt-8 text-foreground">
        {/*History button*/}
        <button
          onClick={() => onViewChange("history")}
          className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-md transition-colors text-left w-full"
        >
          <History size={18} className="text-accent" />
          <span>History</span>
        </button>
        {/*Discover button*/}
        <button
          onClick={() => onViewChange("discover")}
          className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-md transition-colors text-left w-full"
        >
          <Compass size={18} className="text-accent" />
          <span>Discover</span>
        </button>
      </div>
    </div>
  );
}
