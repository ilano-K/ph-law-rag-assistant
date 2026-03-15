import { Plus, History, Compass, Circle } from "lucide-react";
import SidebarButton from "./SidebarButton";

interface SidebarProps {
  onViewChange: (view: "chat" | "history" | "discover") => void;
}

export default function Sidebar({ onViewChange }: SidebarProps) {
  return (
    <div className="w-auto bg-black rounded-[24px] p-4 flex flex-col">
      {/* Logo / top circle */}
      <div className="flex justify-center mb-2">
        <Circle size={36} className="text-accent" />
      </div>
      <div className="flex flex-col gap-6 mt-8">
        {/* New Thread Button*/}
        <SidebarButton
          icon={Plus}
          onClick={() => onViewChange("chat")}
        ></SidebarButton>
        {/*History button*/}
        <SidebarButton
          icon={History}
          onClick={() => onViewChange("history")}
        ></SidebarButton>
        {/*Discover button*/}
        <SidebarButton
          icon={Compass}
          onClick={() => onViewChange("discover")}
        ></SidebarButton>
      </div>
    </div>
  );
}
