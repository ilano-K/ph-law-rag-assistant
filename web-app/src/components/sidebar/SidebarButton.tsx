import { LucideIcon } from "lucide-react";

interface SidebarButtonProps {
  icon: LucideIcon;
}

export default function SidebarButton({ icon: Icon }: SidebarButtonProps) {
  return (
    <button
      className="
        flex items-center justify-center gap-2 px-4 py-2 rounded-lg
        bg-black text-white
        hover:bg-white/10
        active:bg-white/20
        transition-colors duration-100
      "
    >
      <Icon size={28} />
    </button>
  );
}
