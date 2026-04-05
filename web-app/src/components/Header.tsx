"use client"; // 1. Required because we are using a React Hook

import { Circle } from "lucide-react";
import { usePathname } from "next/navigation"; // 2. Import the Next.js router hook

export default function HeaderBar() {
  // 3. Grab the current URL (e.g., "/", "/history", or "/discover")
  const pathname = usePathname();

  // 4. Map the URL to the correct title string
  let title = "Chat"; // Default for the root page ("/")
  
  if (pathname === "/history") {
    title = "History";
  } else if (pathname === "/discover") {
    title = "Discover";
  }

  return (
    <div className="flex flex-row pt-4 pb-8 text-white">
      <div className="flex-1 text-4xl font-bold">{title}</div>
      <div className="flex-1 flex justify-end items-center">
        <Circle size={42} />
      </div>
    </div>
  );
}