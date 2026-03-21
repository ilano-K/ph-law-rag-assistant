"use client";

import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import ChatView from "../components/chat/ChatView";
import HistoryView from "../views/HistoryView";
import DiscoverView from "../components/discover/DiscoverView";
import HeaderBar from "../components/Header";

export default function Home() {
  // State variable. Set as Chat by default
  const [activeView, setActiveView] = useState<"chat" | "history" | "discover">(
    "chat",
  );

  return (
    <main className="p-4 h-screen w-screen">
      <div className="flex rounded-[28px] h-full w-full bg-white/10 p-4 gap-4">
        <Sidebar onViewChange={setActiveView} />

        <div className="flex flex-1 flex-col px-6">
          <HeaderBar title={activeView} />
          <div className="flex-1 bg-white/10 rounded-[24px] overflow-hidden">
            {/* Conditionally render the correct component based on the activeView state */}
            {activeView === "chat" && <ChatView />}
            {activeView === "history" && <HistoryView />}
            {activeView === "discover" && <DiscoverView />}
          </div>
        </div>
      </div>
    </main>
  );
}
