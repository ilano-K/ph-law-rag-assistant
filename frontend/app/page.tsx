"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatView from "../views/ChatView";
import HistoryView from "../views/HistoryView";
import DiscoverView from "../views/DiscoverView";

export default function Home() {
  // State variable. Set as Chat by default
  const [activeView, setActiveView] = useState<"chat" | "history" | "discover">(
    "chat",
  );

  return (
    <main className="flex h-screen w-screen bg-background p-4 gap-4">
      {/* Pass the set active view on the sidebar */}
      <Sidebar onViewChange={setActiveView} />

      <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden">
        {/* Conditionally render the correct component based on the activeView state */}
        {activeView === "chat" && <ChatView />}
        {activeView === "history" && <HistoryView />}
        {activeView === "discover" && <DiscoverView />}
      </div>
    </main>
  );
}
