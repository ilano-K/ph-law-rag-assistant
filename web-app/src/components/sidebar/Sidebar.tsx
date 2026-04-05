import { Plus, History, Compass, Circle } from "lucide-react";
import Link from "next/link"; // 1. Import Next.js Link
import SidebarButton from "./SidebarButton";

// 2. We removed the interface and props entirely!
export default function Sidebar() {
  return (
    <div className="w-auto bg-black rounded-[24px] p-4 flex flex-col">
      {/* Logo / top circle */}
      <div className="flex justify-center mb-2">
        <Circle size={36} className="text-accent" />
      </div>
      <div className="flex flex-col gap-6 mt-8">
        
        {/* 3. Wrap each button in a <Link> pointing to the folder names */}
        <Link href="/">
          <SidebarButton icon={Plus} />
        </Link>
        
        <Link href="/history">
          <SidebarButton icon={History} />
        </Link>
        
        <Link href="/discover">
          <SidebarButton icon={Compass} />
        </Link>

      </div>
    </div>
  );
}